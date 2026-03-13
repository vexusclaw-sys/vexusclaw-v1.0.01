import type { FastifyBaseLogger } from "fastify";

import {
  ChannelStatus,
  ChannelType
} from "@vexus/db";
import type { PrismaClient } from "@vexus/db";
import type { MissionControlOverview } from "@vexus/shared";

import type { HealthService } from "../health/service";
import type { SetupService } from "../setup/service";
import type { WorkspaceDomainService } from "../workspace/domain-service";

export interface OverviewServiceDependencies {
  health: HealthService;
  logger: FastifyBaseLogger;
  prisma: PrismaClient;
  setup: SetupService;
  workspaceDomains: WorkspaceDomainService;
}

export class OverviewService {
  private readonly health: HealthService;
  private readonly logger: FastifyBaseLogger;
  private readonly prisma: PrismaClient;
  private readonly setup: SetupService;
  private readonly workspaceDomains: WorkspaceDomainService;

  constructor(dependencies: OverviewServiceDependencies) {
    this.health = dependencies.health;
    this.logger = dependencies.logger;
    this.prisma = dependencies.prisma;
    this.setup = dependencies.setup;
    this.workspaceDomains = dependencies.workspaceDomains;
  }

  async getOverview(
    workspaceId: string,
    resolvedHostWorkspace?: {
      resolvedHost?: string | null;
      matchedBySubdomain?: boolean;
    }
  ): Promise<MissionControlOverview> {
    const ensuredWorkspace = await this.workspaceDomains.ensureWorkspaceAccessById(workspaceId);
    const [health, onboarding, totals, connectedChannels, provider, whatsapp] = await Promise.all([
      this.health.getReport(),
      this.setup.getStatus(workspaceId),
      Promise.all([
        this.prisma.agent.count({
          where: {
            workspaceId,
            deletedAt: null
          }
        }),
        this.prisma.channelConnection.count({
          where: {
            workspaceId,
            deletedAt: null
          }
        }),
        this.prisma.session.count({
          where: {
            workspaceId
          }
        })
      ]),
      this.prisma.channelConnection.count({
        where: {
          workspaceId,
          deletedAt: null,
          status: ChannelStatus.CONNECTED
        }
      }),
      this.prisma.providerConnection.findFirst({
        where: {
          workspaceId,
          deletedAt: null,
          isPrimary: true
        }
      }),
      this.prisma.channelConnection.findFirst({
        where: {
          workspaceId,
          deletedAt: null,
          type: ChannelType.WHATSAPP
        },
        orderBy: {
          isPrimary: "desc"
        }
      })
    ]);

    return {
      systemStatus: health.status,
      health,
      onboarding,
      instance: {
        hostname: ensuredWorkspace.access.hostname,
        publicUrl: ensuredWorkspace.access.publicUrl,
        baseDomain: ensuredWorkspace.access.baseDomain,
        resolvedHost: resolvedHostWorkspace?.resolvedHost ?? null,
        matchedBySubdomain: resolvedHostWorkspace?.matchedBySubdomain ?? false
      },
      totals: {
        agents: totals[0],
        channels: totals[1],
        sessions: totals[2],
        connectedChannels
      },
      provider: {
        connected: Boolean(provider && provider.status === "CONNECTED"),
        type: provider ? (provider.provider.toLowerCase() as "openai" | "mock") : null,
        label: provider?.label ?? null
      },
      whatsapp: {
        id: whatsapp?.id ?? null,
        status: whatsapp
          ? (whatsapp.status.toLowerCase() as MissionControlOverview["whatsapp"]["status"])
          : "disconnected",
        qrRequired: whatsapp?.status === ChannelStatus.QR_REQUIRED,
        lastActivityAt: whatsapp?.lastActivityAt?.toISOString() ?? null,
        lastError: whatsapp?.lastError ?? null
      }
    };
  }
}
