import type { FastifyBaseLogger } from "fastify";

import type { PrismaClient } from "@vexus/db";
import type { WorkspaceSettingsResponse } from "@vexus/shared";

import { serializeProviderConnection, serializeSetupStatus } from "../../lib/serializers";
import type { WorkspaceDomainService } from "./domain-service";

export interface WorkspaceServiceDependencies {
  logger: FastifyBaseLogger;
  prisma: PrismaClient;
  workspaceDomains: WorkspaceDomainService;
}

export class WorkspaceService {
  private readonly logger: FastifyBaseLogger;
  private readonly prisma: PrismaClient;
  private readonly workspaceDomains: WorkspaceDomainService;

  constructor(dependencies: WorkspaceServiceDependencies) {
    this.logger = dependencies.logger;
    this.prisma = dependencies.prisma;
    this.workspaceDomains = dependencies.workspaceDomains;
  }

  async getSettings(workspaceId: string): Promise<WorkspaceSettingsResponse> {
    const ensuredWorkspace = await this.workspaceDomains.ensureWorkspaceAccessById(workspaceId);
    const workspace = ensuredWorkspace.workspace;

    const [setupState, providers] = await Promise.all([
      this.prisma.setupState.findUnique({
        where: {
          workspaceId
        }
      }),
      this.prisma.providerConnection.findMany({
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
      })
    ]);

    return {
      workspace: {
        id: workspace.id,
        name: workspace.name,
        slug: workspace.slug,
        domain: ensuredWorkspace.access.hostname,
        publicUrl: ensuredWorkspace.access.publicUrl,
        baseDomain: ensuredWorkspace.access.baseDomain,
        onboardingStatus: workspace.onboardingStatus.toLowerCase() as WorkspaceSettingsResponse["workspace"]["onboardingStatus"]
      },
      setup: {
        ...serializeSetupStatus({
          workspace,
          setupState,
          providerConfigured: providers.some((provider) => provider.status === "CONNECTED")
        }),
        baseDomain: ensuredWorkspace.access.baseDomain,
        domain: ensuredWorkspace.access.hostname,
        publicUrl: ensuredWorkspace.access.publicUrl
      },
      providers: providers.map((provider) => serializeProviderConnection(provider))
    };
  }

  async updateSettings(
    workspaceId: string,
    input: {
      workspaceName?: string;
      domain?: string;
    }
  ): Promise<WorkspaceSettingsResponse> {
    const ensuredWorkspace = await this.workspaceDomains.ensureWorkspaceAccessById(workspaceId);

    await this.prisma.workspace.update({
      where: {
        id: workspaceId
      },
      data: {
        name: input.workspaceName,
        domain: ensuredWorkspace.access.hostname
      }
    });

    await this.prisma.setupState.upsert({
      where: {
        workspaceId
      },
      update: {
        domain: ensuredWorkspace.access.hostname
      },
      create: {
        workspaceId,
        domain: ensuredWorkspace.access.hostname
      }
    });

    return this.getSettings(workspaceId);
  }
}
