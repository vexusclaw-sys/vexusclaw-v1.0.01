import type { FastifyBaseLogger } from "fastify";

import { AgentStatus } from "@vexus/db";
import type { PrismaClient } from "@vexus/db";
import type {
  AgentDetails,
  AgentListResponse,
  CreateAgentInput,
  UpdateAgentInput
} from "@vexus/shared";

import { HttpError } from "../../app/errors";

const defaultAgentTools = ["memory search", "system status", "task creation"] as const;

function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface AgentsServiceDependencies {
  logger: FastifyBaseLogger;
  prisma: PrismaClient;
}

export class AgentsService {
  private readonly logger: FastifyBaseLogger;
  private readonly prisma: PrismaClient;

  constructor(dependencies: AgentsServiceDependencies) {
    this.logger = dependencies.logger;
    this.prisma = dependencies.prisma;
  }

  async list(workspaceId: string): Promise<AgentListResponse> {
    const [agents, channels] = await Promise.all([
      this.prisma.agent.findMany({
        where: {
          workspaceId,
          deletedAt: null
        },
        orderBy: [
          {
            isDefault: "desc"
          },
          {
            createdAt: "asc"
          }
        ]
      }),
      this.prisma.channelConnection.findMany({
        where: {
          workspaceId,
          deletedAt: null
        },
        select: {
          type: true
        }
      })
    ]);

    const availableChannels = Array.from(
      new Set(channels.map((channel) => channel.type.toLowerCase() as AgentDetails["availableChannels"][number]))
    );

    return {
      items: agents.map((agent) => this.serializeAgent(agent, availableChannels))
    };
  }

  async create(workspaceId: string, input: CreateAgentInput): Promise<AgentDetails> {
    const workspace = await this.prisma.workspace.findUnique({
      where: {
        id: workspaceId
      },
      select: {
        id: true
      }
    });

    if (!workspace) {
      throw new HttpError(404, "Workspace not found.", "WORKSPACE_NOT_FOUND");
    }

    const slug = await this.generateUniqueSlug(workspaceId, input.name);
    const channels = await this.prisma.channelConnection.findMany({
      where: {
        workspaceId,
        deletedAt: null
      },
      select: {
        type: true
      }
    });
    const availableChannels = Array.from(
      new Set(channels.map((channel) => channel.type.toLowerCase() as AgentDetails["availableChannels"][number]))
    );

    const agent = await this.prisma.agent.create({
      data: {
        config: input.operatorAddressing?.trim()
          ? {
              operatorAddressing: input.operatorAddressing.trim()
            }
          : undefined,
        workspaceId,
        description: input.description?.trim() || null,
        instructions: input.instructions.trim(),
        isDefault: false,
        name: input.name.trim(),
        role: input.role.trim(),
        slug,
        status: AgentStatus.ACTIVE,
        tone: input.tone.trim()
      }
    });

    this.logger.info(
      {
        agentId: agent.id,
        workspaceId
      },
      "Agent created"
    );

    return this.serializeAgent(agent, availableChannels);
  }

  async update(workspaceId: string, agentId: string, input: UpdateAgentInput): Promise<AgentDetails> {
    const [existing, channels] = await Promise.all([
      this.prisma.agent.findFirst({
        where: {
          id: agentId,
          workspaceId,
          deletedAt: null
        }
      }),
      this.prisma.channelConnection.findMany({
        where: {
          workspaceId,
          deletedAt: null
        },
        select: {
          type: true
        }
      })
    ]);

    if (!existing) {
      throw new HttpError(404, "Agent not found.", "AGENT_NOT_FOUND");
    }

    const availableChannels = Array.from(
      new Set(channels.map((channel) => channel.type.toLowerCase() as AgentDetails["availableChannels"][number]))
    );

    const updated = await this.prisma.agent.update({
      where: {
        id: existing.id
      },
      data: {
        config: input.operatorAddressing?.trim()
          ? {
              operatorAddressing: input.operatorAddressing.trim()
            }
          : {},
        description: input.description?.trim() || null,
        instructions: input.instructions.trim(),
        name: input.name.trim(),
        role: input.role.trim(),
        tone: input.tone.trim()
      }
    });

    this.logger.info(
      {
        agentId: updated.id,
        workspaceId
      },
      "Agent updated"
    );

    return this.serializeAgent(updated, availableChannels);
  }

  private async generateUniqueSlug(workspaceId: string, name: string): Promise<string> {
    const base = slugify(name) || "agent";

    for (let index = 0; index < 50; index += 1) {
      const candidate = index === 0 ? base : `${base}-${index + 1}`;
      const existing = await this.prisma.agent.findUnique({
        where: {
          workspaceId_slug: {
            workspaceId,
            slug: candidate
          }
        },
        select: {
          id: true
        }
      });

      if (!existing) {
        return candidate;
      }
    }

    throw new HttpError(409, "Could not allocate a unique slug for this agent.", "AGENT_SLUG_CONFLICT");
  }

  private serializeAgent(
    agent: {
      id: string;
      name: string;
      slug: string;
      description: string | null;
      role: string;
      instructions: string;
      tone: string;
      config?: unknown;
      status: AgentStatus;
      isDefault: boolean;
      createdAt: Date;
      updatedAt: Date;
    },
    availableChannels: AgentDetails["availableChannels"]
  ): AgentDetails {
    const config =
      agent.config && typeof agent.config === "object"
        ? (agent.config as Record<string, unknown>)
        : null;

    return {
      id: agent.id,
      name: agent.name,
      slug: agent.slug,
      description: agent.description,
      role: agent.role,
      instructions: agent.instructions,
      tone: agent.tone,
      operatorAddressing:
        config && typeof config.operatorAddressing === "string"
          ? config.operatorAddressing
          : null,
      status: agent.status.toLowerCase() as AgentDetails["status"],
      isDefault: agent.isDefault,
      createdAt: agent.createdAt.toISOString(),
      updatedAt: agent.updatedAt.toISOString(),
      availableChannels,
      tools: [...defaultAgentTools]
    };
  }
}
