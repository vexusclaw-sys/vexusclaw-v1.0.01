import type { FastifyBaseLogger } from "fastify";

import {
  AgentStatus,
  ChannelType,
  OnboardingStatus,
  ProviderType as PrismaProviderType,
  UserStatus,
  WorkspaceRole,
  WorkspaceStatus
} from "@vexus/db";
import type { PrismaClient, SetupState } from "@vexus/db";
import type { VexusEnv } from "@vexus/config";
import type { ProviderType, SetupFinalizeInput, SetupStatusResponse } from "@vexus/shared";

import { hashPassword } from "@vexus/auth";

import { HttpError } from "../../app/errors";
import { serializeSetupStatus } from "../../lib/serializers";
import type { ProviderService } from "../providers/service";
import type { WhatsAppChannelService } from "../channels/whatsapp/service";
import type { WorkspaceDomainService } from "../workspace/domain-service";

export interface SetupServiceDependencies {
  env: VexusEnv;
  logger: FastifyBaseLogger;
  prisma: PrismaClient;
  providers: ProviderService;
  whatsapp: WhatsAppChannelService;
  workspaceDomains: WorkspaceDomainService;
}

function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export class SetupService {
  private readonly env: VexusEnv;
  private readonly logger: FastifyBaseLogger;
  private readonly prisma: PrismaClient;
  private readonly providers: ProviderService;
  private readonly whatsapp: WhatsAppChannelService;
  private readonly workspaceDomains: WorkspaceDomainService;

  constructor(dependencies: SetupServiceDependencies) {
    this.env = dependencies.env;
    this.logger = dependencies.logger;
    this.prisma = dependencies.prisma;
    this.providers = dependencies.providers;
    this.whatsapp = dependencies.whatsapp;
    this.workspaceDomains = dependencies.workspaceDomains;
  }

  async getStatus(preferredWorkspaceId?: string): Promise<SetupStatusResponse> {
    const workspace = await this.findWorkspace(preferredWorkspaceId);

    if (!workspace) {
      return this.buildSetupStatus({
        workspace: null,
        setupState: null
      });
    }

    const ensuredWorkspace = await this.workspaceDomains.ensureWorkspaceAccess(workspace);
    const [setupState, provider] = await Promise.all([
      this.prisma.setupState.findUnique({
        where: {
          workspaceId: ensuredWorkspace.workspace.id
        }
      }),
      this.prisma.providerConnection.findFirst({
        where: {
          workspaceId: ensuredWorkspace.workspace.id,
          deletedAt: null,
          isPrimary: true
        }
      })
    ]);

    return this.buildSetupStatus({
      workspace: ensuredWorkspace.workspace,
      setupState,
      providerConfigured: Boolean(provider && provider.status === "CONNECTED")
    });
  }

  async bootstrap(input: {
    workspaceName: string;
    domain: string;
    workspaceSlug?: string;
  }, preferredWorkspaceId?: string): Promise<SetupStatusResponse> {
    const existing = await this.findWorkspace(preferredWorkspaceId);
    const slug = existing
      ? (await this.workspaceDomains.ensureWorkspaceAccess(existing)).workspace.slug
      : await this.allocateWorkspaceSlug(input.workspaceSlug || input.workspaceName);
    const hostname = this.workspaceDomains.describeWorkspace({
      domain: null,
      slug
    }).hostname;

    const workspace = existing
      ? await this.prisma.workspace.update({
          where: {
            id: existing.id
          },
          data: {
            name: input.workspaceName,
            slug,
            domain: hostname,
            status: WorkspaceStatus.SETUP,
            onboardingStatus: OnboardingStatus.IN_PROGRESS
          }
        })
      : await this.prisma.workspace.create({
          data: {
            name: input.workspaceName,
            slug,
            domain: hostname,
            status: WorkspaceStatus.SETUP,
            onboardingStatus: OnboardingStatus.IN_PROGRESS
          }
        });

    await this.prisma.setupState.upsert({
      where: {
        workspaceId: workspace.id
      },
      update: {
        currentStep: "admin",
        isBootstrapped: true,
        domain: hostname
      },
      create: {
        workspaceId: workspace.id,
        currentStep: "admin",
        isBootstrapped: true,
        domain: hostname
      }
    });

    return this.getStatus(workspace.id);
  }

  async configureAdmin(input: {
    name: string;
    email: string;
    password: string;
  }, preferredWorkspaceId?: string): Promise<void> {
    const workspace = await this.requireWorkspace(preferredWorkspaceId);
    const passwordHash = await hashPassword(input.password);

    const user = await this.prisma.user.upsert({
      where: {
        email: input.email
      },
      update: {
        name: input.name,
        passwordHash,
        status: UserStatus.ACTIVE
      },
      create: {
        name: input.name,
        email: input.email,
        passwordHash,
        status: UserStatus.ACTIVE
      }
    });

    await this.prisma.workspaceMember.upsert({
      where: {
        workspaceId_userId: {
          workspaceId: workspace.id,
          userId: user.id
        }
      },
      update: {
        role: WorkspaceRole.OWNER,
        deletedAt: null
      },
      create: {
        workspaceId: workspace.id,
        userId: user.id,
        role: WorkspaceRole.OWNER
      }
    });

    await this.prisma.setupState.upsert({
      where: {
        workspaceId: workspace.id
      },
      update: {
        currentStep: "provider",
        adminConfigured: true,
        adminEmail: input.email
      },
      create: {
        workspaceId: workspace.id,
        currentStep: "provider",
        adminConfigured: true,
        adminEmail: input.email
      }
    });
  }

  async configureProvider(input: {
    actorUserId?: string;
    providerType: ProviderType;
    mode?: "api_key" | "oauth_pkce" | "oauth_stub" | "skip";
    apiKey?: string;
    label?: string;
  }, preferredWorkspaceId?: string): Promise<SetupStatusResponse> {
    const workspace = await this.requireWorkspace(preferredWorkspaceId);

    await this.providers.ensurePrimaryProviderFromSetup(workspace.id, input.actorUserId, input);

    await this.prisma.setupState.upsert({
      where: {
        workspaceId: workspace.id
      },
      update: {
        currentStep: "channels",
        providerConfigured: true,
        providerType:
          input.providerType === "openai"
            ? PrismaProviderType.OPENAI
            : input.providerType === "chatgpt_oauth"
              ? PrismaProviderType.CHATGPT_OAUTH
              : PrismaProviderType.MOCK
      },
      create: {
        workspaceId: workspace.id,
        currentStep: "channels",
        providerConfigured: true,
        providerType:
          input.providerType === "openai"
            ? PrismaProviderType.OPENAI
            : input.providerType === "chatgpt_oauth"
              ? PrismaProviderType.CHATGPT_OAUTH
              : PrismaProviderType.MOCK
      }
    });

    return this.getStatus(workspace.id);
  }

  async finalize(
    input: SetupFinalizeInput,
    actorUserId?: string,
    preferredWorkspaceId?: string
  ): Promise<SetupStatusResponse> {
    const workspace = await this.requireWorkspace(preferredWorkspaceId);
    const createDefaultAgent = input.createDefaultAgent ?? true;

    if (createDefaultAgent) {
      const defaultSlug = slugify(input.agentName ?? "");

      const agent = await this.prisma.agent.upsert({
        where: {
          workspaceId_slug: {
            workspaceId: workspace.id,
            slug: defaultSlug
          }
        },
        update: {
          name: input.agentName ?? "VEXUSCLAW Operator",
          role: input.agentRole ?? "operator",
          instructions: input.instructions ??
            "You are the default VEXUSCLAW operator agent. Be concise, operational, and preserve context across the workspace.",
          tone: input.tone ?? "direct",
          status: AgentStatus.ACTIVE,
          isDefault: true,
          deletedAt: null
        },
        create: {
          workspaceId: workspace.id,
          name: input.agentName ?? "VEXUSCLAW Operator",
          slug: defaultSlug || "vexusclaw-operator",
          description: "Primary assistant provisioned during VEXUSCLAW setup.",
          role: input.agentRole ?? "operator",
          instructions: input.instructions ??
            "You are the default VEXUSCLAW operator agent. Be concise, operational, and preserve context across the workspace.",
          tone: input.tone ?? "direct",
          status: AgentStatus.ACTIVE,
          isDefault: true
        }
      });

      await this.prisma.agent.updateMany({
        where: {
          workspaceId: workspace.id,
          id: {
            not: agent.id
          }
        },
        data: {
          isDefault: false
        }
      });
    }

    if (input.provisionWhatsApp ?? true) {
      await this.whatsapp.createOrConnectPrimary(workspace.id, actorUserId);
    }

    await this.prisma.workspace.update({
      where: {
        id: workspace.id
      },
      data: {
        status: WorkspaceStatus.ACTIVE,
        onboardingStatus: OnboardingStatus.COMPLETED
      }
    });

    await this.prisma.setupState.upsert({
      where: {
        workspaceId: workspace.id
      },
      update: {
        currentStep: "finalize",
        primaryChannel: ChannelType.WHATSAPP,
        completedAt: new Date()
      },
      create: {
        workspaceId: workspace.id,
        currentStep: "finalize",
        primaryChannel: ChannelType.WHATSAPP,
        completedAt: new Date(),
        isBootstrapped: true,
        adminConfigured: true,
        providerConfigured: true
      }
    });

    return this.getStatus(workspace.id);
  }

  private async findWorkspace(preferredWorkspaceId?: string) {
    if (preferredWorkspaceId) {
      return this.prisma.workspace.findUnique({
        where: {
          id: preferredWorkspaceId
        }
      });
    }

    return this.prisma.workspace.findFirst({
      where: {
        deletedAt: null
      },
      orderBy: {
        createdAt: "asc"
      }
    });
  }

  private async requireWorkspace(preferredWorkspaceId?: string) {
    const workspace = await this.findWorkspace(preferredWorkspaceId);

    if (!workspace) {
      throw new HttpError(400, "Workspace has not been bootstrapped yet.", "SETUP_NOT_BOOTSTRAPPED");
    }

    return (await this.workspaceDomains.ensureWorkspaceAccess(workspace)).workspace;
  }

  private buildSetupStatus(input: {
    workspace: Awaited<ReturnType<SetupService["findWorkspace"]>> | null;
    setupState: SetupState | null;
    providerConfigured?: boolean;
  }): SetupStatusResponse {
    const status = serializeSetupStatus(input);

    if (!input.workspace) {
      return {
        ...status,
        baseDomain: this.env.VEXUS_BASE_DOMAIN,
        publicUrl: null
      };
    }

    const access = this.workspaceDomains.describeWorkspace(input.workspace);

    return {
      ...status,
      baseDomain: access.baseDomain,
      domain: access.hostname,
      publicUrl: access.publicUrl
    };
  }

  private shouldAllocateFreshSlug(slug: string): boolean {
    return slugify(slug) === slugify(this.env.DEFAULT_WORKSPACE_SLUG);
  }

  private async allocateWorkspaceSlug(source?: string): Promise<string> {
    return this.workspaceDomains.generateUniqueWorkspaceSlug(
      [source, this.env.DEFAULT_ADMIN_EMAIL, this.env.VEXUS_BASE_DOMAIN].filter(Boolean).join(":")
    );
  }
}
