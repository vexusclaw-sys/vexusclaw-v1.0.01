import { randomUUID } from "node:crypto";

import type { FastifyBaseLogger } from "fastify";

import {
  UserStatus,
  WorkspaceStatus
} from "@vexus/db";
import type {
  PrismaClient,
  WorkspaceRole
} from "@vexus/db";
import {
  generateOpaqueToken,
  hashOpaqueToken,
  verifyPassword
} from "@vexus/auth";
import type { VexusEnv } from "@vexus/config";
import type { AuthSession } from "@vexus/shared";

import type { AccessTokenPayload } from "../../app/auth-context";
import { HttpError } from "../../app/errors";
import { serializeAuthSession } from "../../lib/serializers";
import type { WorkspaceDomainService } from "../workspace/domain-service";

const rolePriority: Record<WorkspaceRole, number> = {
  OWNER: 30,
  ADMIN: 20,
  OPERATOR: 10
};

export interface AuthServiceDependencies {
  env: VexusEnv;
  logger: FastifyBaseLogger;
  prisma: PrismaClient;
  signAccessToken(payload: AccessTokenPayload): string;
  verifyAccessToken(token: string): Promise<AccessTokenPayload>;
  workspaceDomains: WorkspaceDomainService;
}

export interface AuthFlowMetadata {
  ipAddress?: string;
  userAgent?: string;
}

export interface AuthResult {
  session: AuthSession;
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  private readonly env: VexusEnv;
  private readonly logger: FastifyBaseLogger;
  private readonly prisma: PrismaClient;
  private readonly signAccessTokenFn: AuthServiceDependencies["signAccessToken"];
  private readonly verifyAccessTokenFn: AuthServiceDependencies["verifyAccessToken"];
  private readonly workspaceDomains: WorkspaceDomainService;

  constructor(dependencies: AuthServiceDependencies) {
    this.env = dependencies.env;
    this.logger = dependencies.logger;
    this.prisma = dependencies.prisma;
    this.signAccessTokenFn = dependencies.signAccessToken;
    this.verifyAccessTokenFn = dependencies.verifyAccessToken;
    this.workspaceDomains = dependencies.workspaceDomains;
  }

  getEnv(): VexusEnv {
    return this.env;
  }

  async login(
    input: {
      email: string;
      password: string;
    },
    metadata: AuthFlowMetadata = {},
    preferredWorkspaceId?: string
  ): Promise<AuthResult> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: input.email
      }
    });

    if (!user || user.deletedAt || user.status !== UserStatus.ACTIVE) {
      throw new HttpError(401, "Invalid email or password.", "AUTH_INVALID_CREDENTIALS");
    }

    const validPassword = await verifyPassword(input.password, user.passwordHash);

    if (!validPassword) {
      throw new HttpError(401, "Invalid email or password.", "AUTH_INVALID_CREDENTIALS");
    }

    const membership = await this.resolvePrimaryMembership(user.id, preferredWorkspaceId);

    if (!membership) {
      throw new HttpError(403, "No active workspace membership found.", "AUTH_NO_WORKSPACE");
    }

    await this.prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        lastLoginAt: new Date()
      }
    });

    return this.issueTokensForMembership(membership, metadata);
  }

  async refresh(
    rawRefreshToken: string,
    metadata: AuthFlowMetadata = {},
    preferredWorkspaceId?: string
  ): Promise<AuthResult> {
    const tokenHash = hashOpaqueToken(rawRefreshToken);
    const existingToken = await this.prisma.refreshToken.findUnique({
      where: {
        tokenHash
      },
      include: {
        user: true
      }
    });

    if (!existingToken) {
      throw new HttpError(401, "Refresh token is invalid.", "AUTH_INVALID_REFRESH");
    }

    if (existingToken.revokedAt || existingToken.expiresAt <= new Date()) {
      await this.revokeTokenFamily(existingToken.familyId);
      throw new HttpError(401, "Refresh token has expired.", "AUTH_REFRESH_EXPIRED");
    }

    if (existingToken.user.deletedAt || existingToken.user.status !== UserStatus.ACTIVE) {
      await this.revokeTokenFamily(existingToken.familyId);
      throw new HttpError(401, "User session is no longer valid.", "AUTH_INVALID_SESSION");
    }

    if (preferredWorkspaceId && preferredWorkspaceId !== existingToken.workspaceId) {
      throw new HttpError(
        403,
        "The current subdomain does not match the workspace session.",
        "AUTH_WORKSPACE_HOST_MISMATCH"
      );
    }

    const membership = await this.resolvePrimaryMembership(
      existingToken.userId,
      existingToken.workspaceId
    );

    if (!membership) {
      await this.revokeTokenFamily(existingToken.familyId);
      throw new HttpError(403, "Workspace membership is no longer active.", "AUTH_NO_WORKSPACE");
    }

    const nextRefreshToken = await this.createRefreshToken(
      {
        userId: existingToken.userId,
        workspaceId: existingToken.workspaceId,
        familyId: existingToken.familyId
      },
      metadata
    );

    await this.prisma.refreshToken.update({
      where: {
        id: existingToken.id
      },
      data: {
        lastUsedAt: new Date(),
        revokedAt: new Date(),
        replacedByTokenId: nextRefreshToken.id
      }
    });

    const session = await this.createSession(membership);

    return {
      session,
      accessToken: this.signAccessToken(session),
      refreshToken: nextRefreshToken.rawToken
    };
  }

  async logout(rawRefreshToken?: string): Promise<void> {
    if (!rawRefreshToken) {
      return;
    }

    const tokenHash = hashOpaqueToken(rawRefreshToken);

    await this.prisma.refreshToken.updateMany({
      where: {
        tokenHash,
        revokedAt: null
      },
      data: {
        revokedAt: new Date()
      }
    });
  }

  async getSessionFromAccessToken(accessToken: string): Promise<AuthSession> {
    const payload = await this.verifyAccessTokenFn(accessToken);
    return this.getSessionFromPayload(payload);
  }

  async getSessionFromPayload(payload: AccessTokenPayload): Promise<AuthSession> {
    const membership = await this.resolvePrimaryMembership(payload.sub, payload.workspaceId);

    if (!membership) {
      throw new HttpError(401, "Session is no longer valid.", "AUTH_INVALID_SESSION");
    }

    return this.createSession(membership);
  }

  private async issueTokensForMembership(
    membership: NonNullable<Awaited<ReturnType<AuthService["resolvePrimaryMembership"]>>>,
    metadata: AuthFlowMetadata
  ): Promise<AuthResult> {
    const refreshToken = await this.createRefreshToken(
      {
        userId: membership.userId,
        workspaceId: membership.workspaceId
      },
      metadata
    );
    const session = await this.createSession(membership);

    return {
      session,
      accessToken: this.signAccessToken(session),
      refreshToken: refreshToken.rawToken
    };
  }

  private signAccessToken(session: AuthSession): string {
    return this.signAccessTokenFn({
      sub: session.user.id,
      email: session.user.email,
      workspaceId: session.workspace.id,
      role: session.workspace.role,
      tokenType: "access"
    });
  }

  private async resolvePrimaryMembership(userId: string, preferredWorkspaceId?: string) {
    const memberships = await this.prisma.workspaceMember.findMany({
      where: {
        userId,
        deletedAt: null,
        workspace: {
          deletedAt: null,
          status: {
            in: [WorkspaceStatus.ACTIVE, WorkspaceStatus.SETUP]
          }
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            status: true
          }
        },
        workspace: true
      }
    });

    const ordered = memberships.sort((left, right) => rolePriority[right.role] - rolePriority[left.role]);

    if (preferredWorkspaceId) {
      const preferred = ordered.find((membership) => membership.workspaceId === preferredWorkspaceId);

      return preferred ?? null;
    }

    return ordered[0] ?? null;
  }

  private async createSession(
    membership: NonNullable<Awaited<ReturnType<AuthService["resolvePrimaryMembership"]>>>
  ): Promise<AuthSession> {
    const ensuredWorkspace = await this.workspaceDomains.ensureWorkspaceAccess(membership.workspace);
    const session = serializeAuthSession({
      membership: {
        ...membership,
        workspace: ensuredWorkspace.workspace
      }
    });

    return {
      ...session,
      workspace: {
        ...session.workspace,
        baseDomain: ensuredWorkspace.access.baseDomain,
        publicUrl: ensuredWorkspace.access.publicUrl
      }
    };
  }

  private async createRefreshToken(
    input: {
      userId: string;
      workspaceId: string;
      familyId?: string;
    },
    metadata: AuthFlowMetadata
  ) {
    const rawToken = generateOpaqueToken();
    const tokenHash = hashOpaqueToken(rawToken);
    const expiresAt = new Date(Date.now() + this.env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);

    const record = await this.prisma.refreshToken.create({
      data: {
        userId: input.userId,
        workspaceId: input.workspaceId,
        familyId: input.familyId ?? randomUUID(),
        tokenHash,
        expiresAt,
        ipAddress: metadata.ipAddress,
        userAgent: metadata.userAgent,
        metadata: {
          issuedAt: new Date().toISOString()
        }
      }
    });

    return {
      ...record,
      rawToken
    };
  }

  private async revokeTokenFamily(familyId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: {
        familyId,
        revokedAt: null
      },
      data: {
        revokedAt: new Date()
      }
    });
  }
}
