import type { FastifyBaseLogger } from "fastify";

import {
  ProviderConnectionMode,
  ProviderConnectionStatus,
  ProviderType as PrismaProviderType
} from "@vexus/db";
import type { PrismaClient } from "@vexus/db";
import {
  createSecretHint,
  encryptSecret
} from "@vexus/auth";
import type {
  OpenAIConnectionTestResult,
  ProviderConnectionDetails,
  ProviderConnectionInput,
  ProviderType
} from "@vexus/shared";

import { HttpError } from "../../app/errors";
import { serializeProviderConnection } from "../../lib/serializers";

export interface ProviderServiceDependencies {
  logger: FastifyBaseLogger;
  prisma: PrismaClient;
}

export class ProviderService {
  private readonly logger: FastifyBaseLogger;
  private readonly prisma: PrismaClient;

  constructor(dependencies: ProviderServiceDependencies) {
    this.logger = dependencies.logger;
    this.prisma = dependencies.prisma;
  }

  async list(workspaceId: string): Promise<ProviderConnectionDetails[]> {
    const connections = await this.prisma.providerConnection.findMany({
      where: {
        workspaceId,
        deletedAt: null
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

    return connections.map((connection) => serializeProviderConnection(connection));
  }

  async testOpenAI(apiKey: string): Promise<OpenAIConnectionTestResult> {
    try {
      const response = await fetch("https://api.openai.com/v1/models", {
        headers: {
          Authorization: `Bearer ${apiKey}`
        }
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { error?: { message?: string } }
          | null;

        return {
          ok: false,
          message: payload?.error?.message ?? "OpenAI rejected the provided API key."
        };
      }

      const payload = (await response.json()) as {
        data?: Array<{ id?: string }>;
      };

      return {
        ok: true,
        message: "OpenAI connection verified successfully.",
        model: payload.data?.[0]?.id
      };
    } catch (error) {
      this.logger.warn({ error }, "OpenAI test connection failed");

      return {
        ok: false,
        message: error instanceof Error ? error.message : "OpenAI test failed."
      };
    }
  }

  async createConnection(
    workspaceId: string,
    actorUserId: string,
    input: ProviderConnectionInput
  ): Promise<ProviderConnectionDetails> {
    if (input.provider === "chatgpt_oauth") {
      throw new HttpError(
        400,
        "Use the ChatGPT OAuth endpoints to create this provider connection.",
        "CHATGPT_OAUTH_CREATE_UNSUPPORTED"
      );
    }

    return this.upsertConnection(workspaceId, actorUserId, input);
  }

  async setPrimaryConnection(workspaceId: string, connectionId: string): Promise<ProviderConnectionDetails> {
    const existing = await this.prisma.providerConnection.findFirst({
      where: {
        id: connectionId,
        workspaceId,
        deletedAt: null
      }
    });

    if (!existing) {
      throw new HttpError(404, "Provider connection not found.", "PROVIDER_NOT_FOUND");
    }

    await this.unsetPrimaryConnections(workspaceId);

    const connection = await this.prisma.providerConnection.update({
      where: {
        id: existing.id
      },
      data: {
        isPrimary: true
      }
    });

    return serializeProviderConnection(connection);
  }

  async updateConnection(
    workspaceId: string,
    connectionId: string,
    actorUserId: string,
    input: Partial<ProviderConnectionInput>
  ): Promise<ProviderConnectionDetails> {
    const existing = await this.prisma.providerConnection.findFirst({
      where: {
        id: connectionId,
        workspaceId,
        deletedAt: null
      }
    });

    if (!existing) {
      throw new HttpError(404, "Provider connection not found.", "PROVIDER_NOT_FOUND");
    }

    const provider = input.provider ?? (existing.provider.toLowerCase() as ProviderType);
    const encryptedSecret =
      input.apiKey !== undefined
        ? encryptSecret(input.apiKey)
        : existing.encryptedSecret;
    const secretHint =
      input.apiKey !== undefined
        ? createSecretHint(input.apiKey)
        : existing.secretHint;
    const mode =
      input.mode === "oauth_stub"
        ? ProviderConnectionMode.OAUTH_STUB
        : input.mode === "oauth_pkce"
          ? ProviderConnectionMode.OAUTH_PKCE
        : input.mode === "api_key"
          ? ProviderConnectionMode.API_KEY
          : existing.mode;

    if (provider === "openai" && !encryptedSecret && mode === ProviderConnectionMode.API_KEY) {
      throw new HttpError(400, "An OpenAI API key is required.", "PROVIDER_KEY_REQUIRED");
    }

    if (provider === "chatgpt_oauth") {
      throw new HttpError(
        400,
        "ChatGPT OAuth connections must be updated through the OAuth flow.",
        "CHATGPT_OAUTH_UPDATE_UNSUPPORTED"
      );
    }

    if (input.isPrimary) {
      await this.unsetPrimaryConnections(workspaceId);
    }

    const connection = await this.prisma.providerConnection.update({
      where: {
        id: existing.id
      },
      data: {
        provider:
          provider === "openai"
            ? PrismaProviderType.OPENAI
            : PrismaProviderType.MOCK,
        label: input.label ?? existing.label,
        mode,
        encryptedSecret,
        secretHint,
        status: ProviderConnectionStatus.CONNECTED,
        lastTestedAt: input.apiKey !== undefined ? new Date() : existing.lastTestedAt,
        lastError: null,
        isPrimary: input.isPrimary ?? existing.isPrimary,
        createdById: actorUserId,
        config: {
          mode: provider === "mock" ? "fallback" : "api_key"
        }
      }
    });

    return serializeProviderConnection(connection);
  }

  async deleteConnection(workspaceId: string, connectionId: string): Promise<void> {
    const existing = await this.prisma.providerConnection.findFirst({
      where: {
        id: connectionId,
        workspaceId,
        deletedAt: null
      }
    });

    if (!existing) {
      throw new HttpError(404, "Provider connection not found.", "PROVIDER_NOT_FOUND");
    }

    await this.prisma.providerConnection.update({
      where: {
        id: existing.id
      },
      data: {
        deletedAt: new Date(),
        isPrimary: false,
        status: ProviderConnectionStatus.DISABLED
      }
    });
  }

  async ensurePrimaryProviderFromSetup(
    workspaceId: string,
    actorUserId: string | undefined,
    input: {
      providerType: ProviderType;
      mode?: "api_key" | "oauth_pkce" | "oauth_stub" | "skip";
      apiKey?: string;
      label?: string;
    }
  ): Promise<ProviderConnectionDetails> {
    if (input.providerType === "chatgpt_oauth") {
      throw new HttpError(
        400,
        "ChatGPT OAuth setup must be completed through the experimental OAuth flow.",
        "CHATGPT_OAUTH_SETUP_UNSUPPORTED"
      );
    }

    if (input.mode === "skip" || input.providerType === "mock") {
      return this.upsertConnection(workspaceId, actorUserId ?? "", {
        provider: "mock",
        label: input.label ?? "VEXUSCLAW Mock Provider",
        mode: "oauth_stub",
        isPrimary: true
      });
    }

    return this.upsertConnection(workspaceId, actorUserId ?? "", {
      provider: "openai",
      label: input.label ?? "VEXUSCLAW OpenAI",
      apiKey: input.apiKey,
      mode: input.mode ?? "api_key",
      isPrimary: true
    });
  }

  private async upsertConnection(
    workspaceId: string,
    actorUserId: string,
    input: ProviderConnectionInput
  ): Promise<ProviderConnectionDetails> {
    const providerType = input.provider === "openai" ? PrismaProviderType.OPENAI : PrismaProviderType.MOCK;
    const mode =
      input.mode === "oauth_stub" || input.provider === "mock"
        ? ProviderConnectionMode.OAUTH_STUB
        : input.mode === "oauth_pkce" || input.provider === "chatgpt_oauth"
          ? ProviderConnectionMode.OAUTH_PKCE
        : ProviderConnectionMode.API_KEY;

    if (input.provider === "openai" && !input.apiKey && mode === ProviderConnectionMode.API_KEY) {
      throw new HttpError(400, "An OpenAI API key is required.", "PROVIDER_KEY_REQUIRED");
    }

    if (input.provider === "chatgpt_oauth") {
      throw new HttpError(
        400,
        "Use the ChatGPT OAuth endpoints to create this provider connection.",
        "CHATGPT_OAUTH_CREATE_UNSUPPORTED"
      );
    }

    if (input.isPrimary ?? true) {
      await this.unsetPrimaryConnections(workspaceId);
    }

    const existing = await this.prisma.providerConnection.findFirst({
      where: {
        workspaceId,
        provider: providerType,
        deletedAt: null
      }
    });

    const data = {
      label: input.label,
      provider: providerType,
      mode,
      encryptedSecret: input.apiKey ? encryptSecret(input.apiKey) : existing?.encryptedSecret,
      secretHint: input.apiKey ? createSecretHint(input.apiKey) : existing?.secretHint ?? null,
      status: ProviderConnectionStatus.CONNECTED,
      lastTestedAt: new Date(),
      lastError: null,
      isPrimary: input.isPrimary ?? true,
      createdById: actorUserId || undefined,
      config: {
        source: "api",
        runtime: input.provider
      }
    };

    const connection = existing
      ? await this.prisma.providerConnection.update({
          where: {
            id: existing.id
          },
          data
        })
      : await this.prisma.providerConnection.create({
          data: {
            workspaceId,
            ...data
          }
        });

    return serializeProviderConnection(connection);
  }

  private async unsetPrimaryConnections(workspaceId: string): Promise<void> {
    await this.prisma.providerConnection.updateMany({
      where: {
        workspaceId,
        deletedAt: null
      },
      data: {
        isPrimary: false
      }
    });
  }
}
