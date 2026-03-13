import type { FastifyBaseLogger } from "fastify";

import { decryptSecret, encryptSecret } from "@vexus/auth";
import type { VexusEnv } from "@vexus/config";
import {
  OAuthAttemptStatus,
  ProviderConnectionMode,
  ProviderConnectionStatus,
  ProviderType as PrismaProviderType
} from "@vexus/db";
import type { OAuthSessionAttempt, PrismaClient, ProviderConnection } from "@vexus/db";
import type {
  ChatGptOAuthAttemptStatus,
  ChatGptOAuthManualCompleteInput,
  ChatGptOAuthStartInput,
  ChatGptOAuthStartResponse,
  ProviderConnectionDetails
} from "@vexus/shared";

import { HttpError } from "../../../app/errors";
import { serializeProviderConnection } from "../../../lib/serializers";
import type { ResolvedHostWorkspace, WorkspaceDomainService } from "../../workspace/domain-service";
import {
  buildAuthorizeUrl,
  calculateTokenExpiry,
  exchangeCodeForToken,
  extractChatGptTokenMetadata,
  generateOAuthState,
  generatePkcePair,
  parseCallbackParameters,
  refreshOAuthToken,
  resolveRedirectUri
} from "./oauth";
import { parseImportedChatGptSession } from "./session-import";

export interface ChatGptOAuthServiceDependencies {
  env: VexusEnv;
  logger: FastifyBaseLogger;
  prisma: PrismaClient;
  workspaceDomains: WorkspaceDomainService;
}

interface CompleteAttemptInput {
  code: string;
  expectedWorkspaceId?: string;
  state: string;
}

export class ChatGptOAuthService {
  private readonly env: VexusEnv;
  private readonly logger: FastifyBaseLogger;
  private readonly prisma: PrismaClient;
  private readonly workspaceDomains: WorkspaceDomainService;

  constructor(dependencies: ChatGptOAuthServiceDependencies) {
    this.env = dependencies.env;
    this.logger = dependencies.logger;
    this.prisma = dependencies.prisma;
    this.workspaceDomains = dependencies.workspaceDomains;
  }

  isConfigured(): boolean {
    return (
      this.env.OPENAI_CHATGPT_OAUTH_ENABLED &&
      Boolean(this.env.OPENAI_CHATGPT_OAUTH_CLIENT_ID.trim())
    );
  }

  async createAttempt(input: {
    actorUserId: string;
    hostWorkspace: ResolvedHostWorkspace | null;
    requestOrigin?: string | null;
    start: ChatGptOAuthStartInput;
    workspaceId: string;
  }): Promise<ChatGptOAuthStartResponse> {
    this.assertConfigured();

    const ensuredWorkspace = input.hostWorkspace?.workspace.id === input.workspaceId
      ? input.hostWorkspace
      : await this.workspaceDomains.ensureWorkspaceAccessById(input.workspaceId);
    const publicUrl = input.requestOrigin?.trim() || ensuredWorkspace.access.publicUrl;
    const state = generateOAuthState();
    const pkce = generatePkcePair();
    const redirectUri = resolveRedirectUri({
      env: this.env,
      publicUrl
    });
    const expiresAt = new Date(
      Date.now() + this.env.OPENAI_CHATGPT_OAUTH_ATTEMPT_TTL_MINUTES * 60 * 1000
    );

    const attempt = await this.prisma.oAuthSessionAttempt.create({
      data: {
        codeVerifierEncrypted: encryptSecret(pkce.codeVerifier),
        expiresAt,
        initiatedById: input.actorUserId,
        makePrimary: input.start.makePrimary ?? true,
        metadata: {
          publicUrl,
          resolvedHost: ensuredWorkspace.access.resolvedHost
        },
        provider: PrismaProviderType.CHATGPT_OAUTH,
        redirectUri,
        requestedLabel: input.start.label?.trim() || "ChatGPT OAuth",
        returnToPath: input.start.returnToPath?.trim() || "/agents",
        state,
        workspaceId: input.workspaceId
      }
    });

    const authorizeUrl = buildAuthorizeUrl({
      authorizeEndpoint: this.env.OPENAI_CHATGPT_OAUTH_AUTHORIZE_URL,
      clientId: this.env.OPENAI_CHATGPT_OAUTH_CLIENT_ID,
      codeChallenge: pkce.codeChallenge,
      extraParams: this.env.OPENAI_CHATGPT_OAUTH_EXTRA_PARAMS,
      redirectUri,
      scope: this.env.OPENAI_CHATGPT_OAUTH_SCOPE,
      state
    });

    this.logger.info(
      {
        attemptId: attempt.id,
        provider: "chatgpt_oauth",
        workspaceId: input.workspaceId
      },
      "Created ChatGPT OAuth attempt"
    );

    return {
      attemptId: attempt.id,
      authorizeUrl,
      expiresAt: attempt.expiresAt.toISOString()
    };
  }

  async completeManual(
    workspaceId: string,
    input: ChatGptOAuthManualCompleteInput
  ): Promise<ProviderConnectionDetails> {
    this.assertConfigured();

    try {
      const parsed = parseCallbackParameters(input);
      const state =
        parsed.state ??
        (await this.resolveManualAttemptState({
          attemptId: input.attemptId,
          workspaceId
        }));
      const result = await this.completeAttempt({
        code: parsed.code,
        expectedWorkspaceId: workspaceId,
        state
      });

      return serializeProviderConnection(result.connection);
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }

      throw new HttpError(
        400,
        error instanceof Error
          ? error.message
          : "Could not validate your token. Please try signing in again.",
        "OAUTH_TOKEN_EXCHANGE_FAILED"
      );
    }
  }

  async importSession(input: {
    actorUserId: string;
    authJson: string;
    label?: string;
    makePrimary?: boolean;
    workspaceId: string;
  }): Promise<ProviderConnectionDetails> {
    const session = parseImportedChatGptSession(input.authJson);

    if (input.makePrimary ?? true) {
      await this.unsetPrimaryConnections(input.workspaceId);
    }

    const existing = await this.prisma.providerConnection.findFirst({
      where: {
        deletedAt: null,
        provider: PrismaProviderType.CHATGPT_OAUTH,
        workspaceId: input.workspaceId
      },
      orderBy: [
        {
          isPrimary: "desc"
        },
        {
          updatedAt: "desc"
        }
      ]
    });

    const label = input.label?.trim() || session.derivedLabel;
    const config = {
      accountEmail: session.accountEmail,
      accountName: session.accountName,
      authMode: session.authMode,
      importedAt: new Date().toISOString(),
      importMethod: "auth_json",
      importedFrom: "codex_auth_json",
      lastRefreshAt: session.lastRefreshAt?.toISOString() ?? null,
      oauthClientId: session.clientId,
      oauthSource: "chatgpt",
      tokenType: "Bearer"
    };

    const connection = existing
      ? await this.prisma.providerConnection.update({
          where: {
            id: existing.id
          },
          data: {
            accessTokenEncrypted: encryptSecret(session.accessToken),
            accountId: session.accountId,
            authState: "imported_session",
            config,
            createdById: input.actorUserId,
            deletedAt: null,
            isPrimary: input.makePrimary ?? true,
            label,
            lastError: null,
            lastTestedAt: new Date(),
            mode: "OAUTH_IMPORTED" as ProviderConnectionMode,
            provider: PrismaProviderType.CHATGPT_OAUTH,
            refreshTokenEncrypted: session.refreshToken
              ? encryptSecret(session.refreshToken)
              : existing.refreshTokenEncrypted,
            scope: existing.scope ?? this.env.OPENAI_CHATGPT_OAUTH_SCOPE,
            status: ProviderConnectionStatus.CONNECTED,
            tokenExpiresAt: session.tokenExpiresAt
          }
        })
      : await this.prisma.providerConnection.create({
          data: {
            accessTokenEncrypted: encryptSecret(session.accessToken),
            accountId: session.accountId,
            authState: "imported_session",
            config,
            createdById: input.actorUserId,
            isPrimary: input.makePrimary ?? true,
            label,
            lastTestedAt: new Date(),
            mode: "OAUTH_IMPORTED" as ProviderConnectionMode,
            provider: PrismaProviderType.CHATGPT_OAUTH,
            refreshTokenEncrypted: session.refreshToken
              ? encryptSecret(session.refreshToken)
              : null,
            scope: this.env.OPENAI_CHATGPT_OAUTH_SCOPE,
            status: ProviderConnectionStatus.CONNECTED,
            tokenExpiresAt: session.tokenExpiresAt,
            workspaceId: input.workspaceId
          }
        });

    this.logger.info(
      {
        accountEmail: session.accountEmail,
        connectionId: connection.id,
        workspaceId: connection.workspaceId
      },
      "Imported ChatGPT/Codex auth session"
    );

    return serializeProviderConnection(connection);
  }

  async getAttemptStatus(workspaceId: string, attemptId: string): Promise<ChatGptOAuthAttemptStatus> {
    const attempt = await this.prisma.oAuthSessionAttempt.findFirst({
      where: {
        id: attemptId,
        workspaceId
      }
    });

    if (!attempt) {
      throw new HttpError(404, "OAuth attempt not found.", "OAUTH_ATTEMPT_NOT_FOUND");
    }

    return {
      attemptId: attempt.id,
      status: attempt.status.toLowerCase() as ChatGptOAuthAttemptStatus["status"],
      expiresAt: attempt.expiresAt.toISOString(),
      providerConnectionId:
        attempt.metadata &&
        typeof attempt.metadata === "object" &&
        "providerConnectionId" in attempt.metadata &&
        typeof attempt.metadata.providerConnectionId === "string"
          ? attempt.metadata.providerConnectionId
          : null,
      lastError: attempt.lastError
    };
  }

  async completeFromCallback(input: {
    code?: string;
    error?: string;
    errorDescription?: string;
    requestOrigin?: string | null;
    state?: string;
  }): Promise<string> {
    this.assertConfigured();

    if (!input.state?.trim()) {
      return this.buildGlobalCallbackRedirect({
        message: "OAuth callback returned without state.",
        status: "error"
      });
    }

    const attempt = await this.prisma.oAuthSessionAttempt.findUnique({
      where: {
        state: input.state.trim()
      }
    });

    if (!attempt) {
      return this.buildGlobalCallbackRedirect({
        message: "OAuth state not recognized by VEXUSCLAW.",
        status: "error"
      });
    }

    const ensuredWorkspace = await this.workspaceDomains.ensureWorkspaceAccessById(attempt.workspaceId);
    const publicUrl = this.resolveAttemptPublicUrl(
      attempt,
      input.requestOrigin,
      ensuredWorkspace.access.publicUrl
    );

    if (input.error?.trim()) {
      await this.failAttempt(attempt.id, input.errorDescription ?? input.error);

      return this.buildWorkspaceCallbackRedirect({
        attempt,
        message: input.errorDescription ?? input.error,
        publicUrl,
        status: "error"
      });
    }

    if (!input.code?.trim()) {
      await this.failAttempt(attempt.id, "OAuth callback returned without authorization code.");

      return this.buildWorkspaceCallbackRedirect({
        attempt,
        message: "OAuth callback returned without authorization code.",
        publicUrl,
        status: "error"
      });
    }

    try {
      const result = await this.completeAttempt({
        code: input.code.trim(),
        state: input.state.trim()
      });

      return this.buildWorkspaceCallbackRedirect({
        attempt: result.attempt,
        message: "Conexao concluida com sucesso.",
        providerConnectionId: result.connection.id,
        publicUrl,
        status: "success"
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "OAuth completion failed.";

      await this.failAttempt(attempt.id, message);

      return this.buildWorkspaceCallbackRedirect({
        attempt,
        message,
        publicUrl,
        status: "error"
      });
    }
  }

  async completeFromLoopbackCallback(input: {
    code?: string;
    error?: string;
    errorDescription?: string;
    state?: string;
  }): Promise<{
    message: string;
    providerConnectionId: string | null;
    status: "error" | "success";
  }> {
    this.assertConfigured();

    if (!input.state?.trim()) {
      return {
        message: "OAuth callback returned without state.",
        providerConnectionId: null,
        status: "error"
      };
    }

    const attempt = await this.prisma.oAuthSessionAttempt.findUnique({
      where: {
        state: input.state.trim()
      }
    });

    if (!attempt) {
      return {
        message: "OAuth state not recognized by VEXUSCLAW.",
        providerConnectionId: null,
        status: "error"
      };
    }

    if (input.error?.trim()) {
      await this.failAttempt(attempt.id, input.errorDescription ?? input.error);

      return {
        message: input.errorDescription ?? input.error,
        providerConnectionId: null,
        status: "error"
      };
    }

    if (!input.code?.trim()) {
      await this.failAttempt(attempt.id, "OAuth callback returned without authorization code.");

      return {
        message: "OAuth callback returned without authorization code.",
        providerConnectionId: null,
        status: "error"
      };
    }

    try {
      const result = await this.completeAttempt({
        code: input.code.trim(),
        state: input.state.trim()
      });

      return {
        message: "Conexao concluida com sucesso. Voce pode fechar esta janela.",
        providerConnectionId: result.connection.id,
        status: "success"
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "OAuth completion failed.";

      await this.failAttempt(attempt.id, message);

      return {
        message,
        providerConnectionId: null,
        status: "error"
      };
    }
  }

  async ensureAccessToken(connection: ProviderConnection): Promise<{
    accessToken: string | null;
    refreshed: boolean;
  }> {
    if (connection.provider !== PrismaProviderType.CHATGPT_OAUTH) {
      return {
        accessToken: null,
        refreshed: false
      };
    }

    if (!connection.accessTokenEncrypted) {
      return {
        accessToken: null,
        refreshed: false
      };
    }

    const leewayMs = this.env.OPENAI_CHATGPT_OAUTH_TOKEN_REFRESH_LEEWAY_SECONDS * 1000;
    const expiresAt = connection.tokenExpiresAt?.getTime() ?? 0;

    if (!connection.tokenExpiresAt || expiresAt > Date.now() + leewayMs) {
      return {
        accessToken: decryptSecret(connection.accessTokenEncrypted),
        refreshed: false
      };
    }

    if (!connection.refreshTokenEncrypted) {
      await this.prisma.providerConnection.update({
        where: {
          id: connection.id
        },
        data: {
          authState: "refresh_missing",
          lastError: "Refresh token unavailable for ChatGPT OAuth session.",
          status: ProviderConnectionStatus.ERROR
        }
      });

      return {
        accessToken: null,
        refreshed: false
      };
    }

    try {
      const refreshed = await refreshOAuthToken({
        clientId: this.resolveConnectionClientId(connection),
        clientSecret: this.env.OPENAI_CHATGPT_OAUTH_CLIENT_SECRET || undefined,
        refreshToken: decryptSecret(connection.refreshTokenEncrypted),
        tokenEndpoint: this.env.OPENAI_CHATGPT_OAUTH_TOKEN_URL
      });
      const refreshedMetadata = extractChatGptTokenMetadata({
        accessToken: refreshed.access_token,
        fallbackAccountId: connection.accountId
      });
      const tokenExpiresAt =
        calculateTokenExpiry(refreshed.expires_in) ?? refreshedMetadata.tokenExpiresAt;
      const nextConfig =
        connection.config && typeof connection.config === "object"
          ? ({
              ...(connection.config as Record<string, unknown>),
              oauthClientId: this.resolveConnectionClientId(connection),
              tokenType: refreshed.token_type ?? "Bearer"
            } as Record<string, unknown>)
          : {
              oauthClientId: this.resolveConnectionClientId(connection),
              oauthSource: "chatgpt",
              tokenType: refreshed.token_type ?? "Bearer"
            };
      const updated = await this.prisma.providerConnection.update({
        where: {
          id: connection.id
        },
        data: {
          accessTokenEncrypted: encryptSecret(refreshed.access_token),
          authState: "connected",
          config: nextConfig as never,
          accountId: refreshedMetadata.accountId ?? connection.accountId,
          lastError: null,
          refreshTokenEncrypted: refreshed.refresh_token
            ? encryptSecret(refreshed.refresh_token)
            : connection.refreshTokenEncrypted,
          scope: refreshed.scope ?? connection.scope,
          status: ProviderConnectionStatus.CONNECTED,
          tokenExpiresAt
        }
      });

      this.logger.info(
        {
          connectionId: updated.id,
          workspaceId: updated.workspaceId
        },
        "Refreshed ChatGPT OAuth access token"
      );

      return {
        accessToken: decryptSecret(updated.accessTokenEncrypted ?? ""),
        refreshed: true
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "OAuth token refresh failed.";

      await this.prisma.providerConnection.update({
        where: {
          id: connection.id
        },
        data: {
          authState: "refresh_failed",
          lastError: message,
          status: ProviderConnectionStatus.ERROR
        }
      });

      this.logger.warn(
        {
          connectionId: connection.id,
          error,
          workspaceId: connection.workspaceId
        },
        "ChatGPT OAuth refresh failed"
      );

      return {
        accessToken: null,
        refreshed: false
      };
    }
  }

  private async completeAttempt(input: CompleteAttemptInput): Promise<{
    attempt: OAuthSessionAttempt;
    connection: ProviderConnection;
  }> {
    const attempt = await this.prisma.oAuthSessionAttempt.findUnique({
      where: {
        state: input.state
      }
    });

    if (!attempt) {
      throw new HttpError(404, "OAuth attempt not found.", "OAUTH_ATTEMPT_NOT_FOUND");
    }

    if (input.expectedWorkspaceId && attempt.workspaceId !== input.expectedWorkspaceId) {
      throw new HttpError(403, "This OAuth attempt belongs to another workspace.", "OAUTH_WORKSPACE_MISMATCH");
    }

    if (attempt.status === OAuthAttemptStatus.COMPLETED) {
      const connection = await this.resolveCompletedAttemptConnection(attempt);

      if (connection) {
        return {
          attempt,
          connection
        };
      }
    }

    if (attempt.status !== OAuthAttemptStatus.PENDING) {
      throw new HttpError(409, "This OAuth attempt is no longer pending.", "OAUTH_ATTEMPT_NOT_PENDING");
    }

    if (attempt.expiresAt.getTime() <= Date.now()) {
      await this.expireAttempt(attempt.id);
      throw new HttpError(410, "This OAuth attempt has expired.", "OAUTH_ATTEMPT_EXPIRED");
    }

    const codeVerifier = decryptSecret(attempt.codeVerifierEncrypted);
    const tokenPayload = await exchangeCodeForToken({
      clientId: this.env.OPENAI_CHATGPT_OAUTH_CLIENT_ID,
      clientSecret: this.env.OPENAI_CHATGPT_OAUTH_CLIENT_SECRET || undefined,
      code: input.code,
      codeVerifier,
      redirectUri: attempt.redirectUri,
      tokenEndpoint: this.env.OPENAI_CHATGPT_OAUTH_TOKEN_URL
    });
    const tokenMetadata = extractChatGptTokenMetadata({
      accessToken: tokenPayload.access_token,
      idToken: tokenPayload.id_token
    });
    const tokenExpiresAt = calculateTokenExpiry(tokenPayload.expires_in) ?? tokenMetadata.tokenExpiresAt;

    if (attempt.makePrimary) {
      await this.unsetPrimaryConnections(attempt.workspaceId);
    }

    const existing = await this.prisma.providerConnection.findFirst({
      where: {
        deletedAt: null,
        provider: PrismaProviderType.CHATGPT_OAUTH,
        workspaceId: attempt.workspaceId
      },
      orderBy: [
        {
          isPrimary: "desc"
        },
        {
          updatedAt: "desc"
        }
      ]
    });

    const connection = existing
      ? await this.prisma.providerConnection.update({
          where: {
            id: existing.id
          },
          data: {
            accessTokenEncrypted: encryptSecret(tokenPayload.access_token),
            accountId: tokenMetadata.accountId,
            authState: "connected",
            config: {
              accountEmail: tokenMetadata.accountEmail,
              accountName: tokenMetadata.accountName,
              oauthClientId: tokenMetadata.clientId ?? this.env.OPENAI_CHATGPT_OAUTH_CLIENT_ID,
              oauthSource: "chatgpt",
              tokenType: tokenPayload.token_type ?? "Bearer"
            },
            createdById: attempt.initiatedById,
            deletedAt: null,
            isPrimary: attempt.makePrimary,
            label: attempt.requestedLabel ?? existing.label,
            lastError: null,
            lastTestedAt: new Date(),
            mode: ProviderConnectionMode.OAUTH_PKCE,
            provider: PrismaProviderType.CHATGPT_OAUTH,
            refreshTokenEncrypted: tokenPayload.refresh_token
              ? encryptSecret(tokenPayload.refresh_token)
              : existing.refreshTokenEncrypted,
            scope: tokenPayload.scope ?? this.env.OPENAI_CHATGPT_OAUTH_SCOPE,
            status: ProviderConnectionStatus.CONNECTED,
            tokenExpiresAt
          }
        })
      : await this.prisma.providerConnection.create({
          data: {
            accessTokenEncrypted: encryptSecret(tokenPayload.access_token),
            accountId: tokenMetadata.accountId,
            authState: "connected",
            config: {
              accountEmail: tokenMetadata.accountEmail,
              accountName: tokenMetadata.accountName,
              oauthClientId: tokenMetadata.clientId ?? this.env.OPENAI_CHATGPT_OAUTH_CLIENT_ID,
              oauthSource: "chatgpt",
              tokenType: tokenPayload.token_type ?? "Bearer"
            },
            createdById: attempt.initiatedById,
            isPrimary: attempt.makePrimary,
            label: attempt.requestedLabel ?? "ChatGPT OAuth",
            lastTestedAt: new Date(),
            mode: ProviderConnectionMode.OAUTH_PKCE,
            provider: PrismaProviderType.CHATGPT_OAUTH,
            refreshTokenEncrypted: tokenPayload.refresh_token
              ? encryptSecret(tokenPayload.refresh_token)
              : null,
            scope: tokenPayload.scope ?? this.env.OPENAI_CHATGPT_OAUTH_SCOPE,
            status: ProviderConnectionStatus.CONNECTED,
            tokenExpiresAt,
            workspaceId: attempt.workspaceId
          }
        });

    const completedAttempt = await this.prisma.oAuthSessionAttempt.update({
      where: {
        id: attempt.id
      },
      data: {
        completedAt: new Date(),
        lastError: null,
        metadata: {
          accountEmail: tokenMetadata.accountEmail,
          accountId: tokenMetadata.accountId,
          accountName: tokenMetadata.accountName,
          providerConnectionId: connection.id
        },
        status: OAuthAttemptStatus.COMPLETED
      }
    });

    this.logger.info(
      {
        attemptId: completedAttempt.id,
        connectionId: connection.id,
        workspaceId: connection.workspaceId
      },
      "Completed ChatGPT OAuth flow"
    );

    return {
      attempt: completedAttempt,
      connection
    };
  }

  private assertConfigured(): void {
    if (this.isConfigured()) {
      return;
    }

    throw new HttpError(
      503,
      "ChatGPT OAuth is not configured for this VEXUSCLAW instance.",
      "CHATGPT_OAUTH_NOT_CONFIGURED"
    );
  }

  private async unsetPrimaryConnections(workspaceId: string): Promise<void> {
    await this.prisma.providerConnection.updateMany({
      where: {
        deletedAt: null,
        workspaceId
      },
      data: {
        isPrimary: false
      }
    });
  }

  private async expireAttempt(attemptId: string): Promise<void> {
    await this.prisma.oAuthSessionAttempt.update({
      where: {
        id: attemptId
      },
      data: {
        status: OAuthAttemptStatus.EXPIRED
      }
    }).catch(() => undefined);
  }

  private async failAttempt(attemptId: string, message: string): Promise<void> {
    await this.prisma.oAuthSessionAttempt.update({
      where: {
        id: attemptId
      },
      data: {
        lastError: message,
        status: OAuthAttemptStatus.FAILED
      }
    }).catch(() => undefined);
  }

  private resolveAttemptPublicUrl(
    attempt: Pick<OAuthSessionAttempt, "metadata">,
    requestOrigin: string | null | undefined,
    fallbackPublicUrl: string
  ): string {
    const metadata =
      attempt.metadata && typeof attempt.metadata === "object"
        ? (attempt.metadata as Record<string, unknown>)
        : null;
    const attemptPublicUrl =
      metadata && typeof metadata.publicUrl === "string"
        ? metadata.publicUrl.trim()
        : "";

    if (attemptPublicUrl) {
      return attemptPublicUrl;
    }

    if (requestOrigin?.trim()) {
      return requestOrigin.trim();
    }

    return fallbackPublicUrl;
  }

  private resolveConnectionClientId(connection: Pick<ProviderConnection, "config">): string {
    const config =
      connection.config && typeof connection.config === "object"
        ? (connection.config as Record<string, unknown>)
        : null;
    const storedClientId =
      config && typeof config.oauthClientId === "string" ? config.oauthClientId.trim() : "";

    return storedClientId || this.env.OPENAI_CHATGPT_OAUTH_CLIENT_ID;
  }

  private async resolveManualAttemptState(input: {
    attemptId?: string;
    workspaceId: string;
  }): Promise<string> {
    if (input.attemptId?.trim()) {
      const attempt = await this.prisma.oAuthSessionAttempt.findFirst({
        where: {
          id: input.attemptId.trim(),
          workspaceId: input.workspaceId
        }
      });

      if (!attempt) {
        throw new HttpError(404, "OAuth attempt not found.", "OAUTH_ATTEMPT_NOT_FOUND");
      }

      return attempt.state;
    }

    const attempts = await this.prisma.oAuthSessionAttempt.findMany({
      where: {
        provider: PrismaProviderType.CHATGPT_OAUTH,
        status: OAuthAttemptStatus.PENDING,
        workspaceId: input.workspaceId
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 2
    });

    const [attempt] = attempts;

    if (attempts.length === 1 && attempt) {
      return attempt.state;
    }

    if (attempts.length > 1) {
      throw new HttpError(
        409,
        "Existe mais de uma tentativa OAuth pendente. Cole a URL final completa com state ou gere um novo link.",
        "OAUTH_ATTEMPT_AMBIGUOUS"
      );
    }

    throw new HttpError(
      400,
      "Nao existe tentativa OAuth pendente para usar esse code. Gere um novo link e tente novamente.",
      "OAUTH_ATTEMPT_REQUIRED"
    );
  }

  private async resolveCompletedAttemptConnection(
    attempt: Pick<OAuthSessionAttempt, "id" | "metadata" | "workspaceId">
  ): Promise<ProviderConnection | null> {
    const metadata =
      attempt.metadata && typeof attempt.metadata === "object"
        ? (attempt.metadata as Record<string, unknown>)
        : null;
    const providerConnectionId =
      metadata && typeof metadata.providerConnectionId === "string"
        ? metadata.providerConnectionId
        : null;

    if (!providerConnectionId) {
      return null;
    }

    return this.prisma.providerConnection.findFirst({
      where: {
        id: providerConnectionId,
        workspaceId: attempt.workspaceId,
        deletedAt: null
      }
    });
  }

  private buildWorkspaceCallbackRedirect(input: {
    attempt: Pick<OAuthSessionAttempt, "id" | "returnToPath">;
    message: string;
    providerConnectionId?: string;
    publicUrl: string;
    status: "error" | "success";
  }): string {
    const url = new URL("/auth/chatgpt/callback", input.publicUrl);
    url.searchParams.set("attemptId", input.attempt.id);
    url.searchParams.set("message", input.message);
    url.searchParams.set("status", input.status);

    if (input.providerConnectionId) {
      url.searchParams.set("providerConnectionId", input.providerConnectionId);
    }

    if (input.attempt.returnToPath) {
      url.searchParams.set("returnTo", input.attempt.returnToPath);
    }

    return url.toString();
  }

  private buildGlobalCallbackRedirect(input: {
    message: string;
    status: "error" | "success";
  }): string {
    const url = new URL("/auth/chatgpt/callback", this.env.VEXUS_DASHBOARD_URL);
    url.searchParams.set("message", input.message);
    url.searchParams.set("status", input.status);
    return url.toString();
  }
}
