import type { FastifyBaseLogger } from "fastify";

import { decryptSecret } from "@vexus/auth";
import type { VexusEnv } from "@vexus/config";
import type { VexusCore } from "@vexus/core";
import {
  AgentStatus,
  ChannelEventType,
  ChannelType,
  MessageRole,
  ProviderType as PrismaProviderType,
  ProviderConnectionStatus,
  SessionStatus
} from "@vexus/db";
import type { Prisma, PrismaClient } from "@vexus/db";
import type { ProviderRegistry } from "@vexus/providers";
import type { ProviderAdapter, ProviderMessage } from "@vexus/sdk";
import type { ProviderType } from "@vexus/shared";

import { HttpError } from "../../app/errors";
import { serializeSessionDetails, serializeSessionListItem } from "../../lib/serializers";
import type {
  SessionDetailsResponse,
  SessionListResponse
} from "@vexus/shared";
import { dispatchConversationCommand } from "./commands/dispatcher";
import type { ConversationCommandSelections, SessionModelOverride } from "./commands/types";
import type { ChatGptOAuthService } from "../providers/chatgpt-oauth/service";

export interface WhatsAppReplyPort {
  sendText(input: {
    assistantMessageId: string;
    connectionId: string;
    content: string;
    externalConversationId?: string;
    externalUserId: string;
    idempotencyKey: string;
    metadata?: Record<string, unknown>;
  }): Promise<{
    jobId: string;
  }>;
}

export interface ConversationServiceDependencies {
  chatgptOAuth: ChatGptOAuthService;
  env: VexusEnv;
  logger: FastifyBaseLogger;
  prisma: PrismaClient;
  providerRegistry: ProviderRegistry;
  runtime: VexusCore;
  whatsapp: WhatsAppReplyPort;
}

export interface WhatsAppInboundInput {
  connectionId: string;
  externalUserId: string;
  externalConversationId?: string;
  messageId?: string;
  message: string;
  raw: Record<string, unknown>;
  receivedAt: string;
  visitorName?: string;
}

interface ResolvedProviderRuntime {
  adapter: ProviderAdapter;
  connectionId: string | null;
  label: string;
  metadata: Record<string, unknown>;
  providerType: ProviderType;
}

interface WhatsAppGroupContext {
  groupSubject?: string;
  isGroupMessage: boolean;
  participantJid?: string;
  speakerLabel?: string;
  targetAgentId?: string;
  triggerReason?: string;
}

export class ConversationService {
  private readonly chatgptOAuth: ChatGptOAuthService;
  private readonly env: VexusEnv;
  private readonly logger: FastifyBaseLogger;
  private readonly prisma: PrismaClient;
  private readonly providerRegistry: ProviderRegistry;
  private readonly runtime: VexusCore;
  private readonly whatsapp: WhatsAppReplyPort;

  constructor(dependencies: ConversationServiceDependencies) {
    this.chatgptOAuth = dependencies.chatgptOAuth;
    this.env = dependencies.env;
    this.logger = dependencies.logger;
    this.prisma = dependencies.prisma;
    this.providerRegistry = dependencies.providerRegistry;
    this.runtime = dependencies.runtime;
    this.whatsapp = dependencies.whatsapp;
  }

  async handleWhatsAppInbound(input: WhatsAppInboundInput): Promise<{
    duplicate?: boolean;
    reply: string;
    sessionId: string;
  }> {
    const connection = await this.prisma.channelConnection.findFirst({
      where: {
        id: input.connectionId,
        type: ChannelType.WHATSAPP,
        deletedAt: null
      },
      include: {
        defaultAgent: true,
        workspace: true
      }
    });

    if (!connection) {
      throw new HttpError(404, "WhatsApp connection not found.", "CHANNEL_NOT_FOUND");
    }

    if (input.messageId) {
      const duplicate = await this.prisma.message.findUnique({
        where: {
          workspaceId_externalMessageId: {
            externalMessageId: input.messageId,
            workspaceId: connection.workspaceId
          }
        },
        select: {
          sessionId: true
        }
      });

      if (duplicate) {
        this.logger.info(
          {
            connectionId: connection.id,
            externalMessageId: input.messageId,
            sessionId: duplicate.sessionId
          },
          "Skipping duplicated WhatsApp inbound message"
        );

        await this.prisma.channelConnection.update({
          where: {
            id: connection.id
          },
          data: {
            lastActivityAt: new Date(input.receivedAt)
          }
        });

        return {
          duplicate: true,
          reply: "",
          sessionId: duplicate.sessionId
        };
      }
    }

    const groupContext = this.extractGroupContext(input);
    const conversationId = input.externalConversationId ?? input.externalUserId;
    const conversationState = await this.loadConversationState({
      channelConnectionId: connection.id,
      conversationId,
      workspaceId: connection.workspaceId
    });
    const conversationSelections = this.extractConversationSelections(conversationState?.metadata);
    const agent = await this.resolveInboundAgent({
      conversationAgentId: conversationState?.agentId,
      conversationSelections,
      connectionDefaultAgentId: connection.defaultAgent?.id,
      input,
      workspaceId: connection.workspaceId
    });

    if (!agent) {
      throw new HttpError(400, "No default agent is configured for this workspace.", "AGENT_NOT_FOUND");
    }

    const session = await this.resolveSession({
      agentId: agent.id,
      channelConnectionId: connection.id,
      externalConversationId: input.externalConversationId,
      externalUserId: input.externalUserId,
      initialMetadata: this.buildSelectionMetadata(conversationSelections),
      visitorName: input.visitorName,
      workspaceId: connection.workspaceId
    });

    const priorMessages = await this.loadPriorMessages(session.id, groupContext.isGroupMessage);
    const sessionMetadata = {
      ...this.buildSelectionMetadata(conversationSelections),
      ...((session.metadata as Record<string, unknown> | null) ?? {})
    };
    let assistantMessageId: string | null = null;
    const runtimeMessage = this.formatInboundMessageForRuntime(input, groupContext);
    const systemPrompt = this.buildRuntimeSystemPrompt(agent.instructions, groupContext);
    const inboundPayload = {
      channel: "whatsapp",
      externalConversationId: conversationId,
      messageId: input.messageId,
      raw: input.raw as Prisma.InputJsonValue
    } satisfies Prisma.InputJsonObject;
    const inboundMessage = await this.prisma.message.create({
      data: {
        agentId: agent.id,
        content: input.message,
        externalMessageId: input.messageId,
        payload: inboundPayload,
        role: MessageRole.USER,
        sessionId: session.id,
        workspaceId: connection.workspaceId
      }
    }).catch(async (error) => {
      const conflictCode =
        typeof error === "object" && error && "code" in error ? (error as { code?: string }).code : undefined;

      if (conflictCode === "P2002" && input.messageId) {
        const duplicate = await this.prisma.message.findUnique({
          where: {
            workspaceId_externalMessageId: {
              externalMessageId: input.messageId,
              workspaceId: connection.workspaceId
            }
          }
        });

        if (duplicate) {
          return duplicate;
        }
      }

      throw error;
    });

    await this.prisma.session.update({
      where: {
        id: session.id
      },
      data: {
        lastMessageAt: new Date(input.receivedAt),
        metadata: this.toInputJsonValue({
          ...sessionMetadata,
          channel: "whatsapp",
          externalConversationId: conversationId,
          externalUserId: input.externalUserId,
          groupSubject: groupContext.groupSubject,
          isGroupMessage: groupContext.isGroupMessage,
          lastInboundMessageId: inboundMessage.id,
          lastInboundAt: input.receivedAt,
          targetAgentId: agent.id,
          triggerReason: groupContext.triggerReason
        }),
        status: SessionStatus.OPEN,
        visitorName: input.visitorName ?? session.visitorName
      }
    });

    await this.prisma.channelConnection.update({
      where: {
        id: connection.id
      },
      data: {
        lastActivityAt: new Date(input.receivedAt),
        lastError: null
      }
    });

    const commandResult = await dispatchConversationCommand(
      {
        channelConnection: {
          config: connection.config,
          defaultAgentId: connection.defaultAgent?.id ?? null,
          id: connection.id,
          name: connection.name
        },
        conversationId,
        currentAgent: {
          id: agent.id,
          isDefault: agent.isDefault,
          name: agent.name,
          slug: agent.slug,
          status: agent.status
        },
        env: this.env,
        externalUserId: input.externalUserId,
        logger: this.logger,
        prisma: this.prisma,
        selections: this.extractConversationSelections(sessionMetadata),
        session: {
          agentId: session.agentId,
          externalConversationId: session.externalConversationId,
          id: session.id,
          metadata: session.metadata
        },
        workspaceId: connection.workspaceId
      },
      input.message
    );

    if (commandResult) {
      const commandMetadata = {
        command: {
          argsText: commandResult.command.argsText,
          name: commandResult.command.name
        },
        commandHandled: true
      };
      const assistantPayload: Record<string, unknown> = {
        channel: "whatsapp",
        deliveryStatus: "pending",
        ...commandMetadata,
        ...commandResult.assistantPayload
      };
      const updatedSessionMetadata = {
        ...sessionMetadata,
        ...commandResult.sessionMetadataPatch,
        channel: "whatsapp",
        externalConversationId: conversationId,
        externalUserId: input.externalUserId,
        groupSubject: groupContext.groupSubject,
        isGroupMessage: groupContext.isGroupMessage,
        lastAssistantAt: new Date().toISOString(),
        lastInboundAt: input.receivedAt,
        lastInboundMessageId: inboundMessage.id,
        targetAgentId: agent.id,
        triggerReason: groupContext.triggerReason
      };

      await this.prisma.message.update({
        where: {
          id: inboundMessage.id
        },
        data: {
          payload: this.toInputJsonValue({
            ...(inboundPayload as Record<string, unknown>),
            ...commandMetadata
          })
        }
      });

      const assistantMessage = await this.prisma.message.create({
        data: {
          agentId: agent.id,
          content: commandResult.reply,
          payload: this.toInputJsonValue(assistantPayload),
          role: MessageRole.ASSISTANT,
          sessionId: session.id,
          workspaceId: connection.workspaceId
        }
      });
      assistantMessageId = assistantMessage.id;

      const dispatch = await this.whatsapp.sendText({
        assistantMessageId: assistantMessage.id,
        connectionId: connection.id,
        content: commandResult.reply,
        externalConversationId: conversationId,
        externalUserId: input.externalUserId,
        idempotencyKey: assistantMessage.id,
        metadata: {
          sessionId: session.id
        }
      });

      await this.prisma.message.update({
        where: {
          id: assistantMessage.id
        },
        data: {
          payload: this.toInputJsonValue({
            ...assistantPayload,
            deliveryStatus: "queued",
            queueJobId: dispatch.jobId,
            queuedAt: new Date().toISOString()
          })
        }
      });

      await this.prisma.session.update({
        where: {
          id: session.id
        },
        data: {
          lastMessageAt: new Date(),
          metadata: this.toInputJsonValue(updatedSessionMetadata),
          status: SessionStatus.OPEN
        }
      });

      return {
        reply: commandResult.reply,
        sessionId: session.id
      };
    }

    const providerRuntime = await this.resolveProviderRuntime(
      connection.workspaceId,
      this.extractConversationSelections(sessionMetadata).modelOverride
    );

    try {
      const result = await this.runtime.handleInboundMessage(
        {
          channelConnectionId: connection.id,
          externalConversationId: input.externalConversationId,
          externalUserId: input.externalUserId,
          message: runtimeMessage,
          metadata: {
            channel: "whatsapp",
            groupSubject: groupContext.groupSubject,
            isGroupMessage: groupContext.isGroupMessage,
            messageId: input.messageId,
            providerType: providerRuntime.providerType,
            targetAgentId: agent.id,
            triggerReason: groupContext.triggerReason
          },
          receivedAt: input.receivedAt,
          workspaceId: connection.workspaceId
        },
        {
          agentId: agent.id,
          channelConnectionId: connection.id,
          memory: {
            findRelevant: async () => [],
            remember: async () => undefined
          },
          metadata: {
            ...providerRuntime.metadata,
            channelType: "whatsapp",
            providerConnectionId: providerRuntime.connectionId
          },
          sessionId: session.id,
          tools: [],
          workspaceId: connection.workspaceId
        },
        {
          priorMessages,
          provider: providerRuntime.adapter,
          systemPrompt
        }
      );

      if (this.shouldSuppressAssistantReply(result.reply, groupContext)) {
        await this.prisma.session.update({
          where: {
            id: session.id
          },
          data: {
            metadata: this.toInputJsonValue({
              ...sessionMetadata,
              channel: "whatsapp",
              externalConversationId: conversationId,
              externalUserId: input.externalUserId,
              groupSubject: groupContext.groupSubject,
              isGroupMessage: groupContext.isGroupMessage,
              lastInboundMessageId: inboundMessage.id,
              lastInboundAt: input.receivedAt,
              lastSilentAt: new Date().toISOString(),
              targetAgentId: agent.id,
              triggerReason: groupContext.triggerReason
            }),
            status: SessionStatus.OPEN
          }
        });

        return {
          reply: "",
          sessionId: session.id
        };
      }

      const assistantPayload: Record<string, unknown> = {
        channel: "whatsapp",
        deliveryStatus: "pending",
        model: result.model,
        provider: result.provider,
        providerConnectionId: providerRuntime.connectionId,
        providerLabel: providerRuntime.label
      };

      const assistantMessage = await this.prisma.message.create({
        data: {
          agentId: agent.id,
          content: result.reply,
          estimatedCostUsd: result.usage?.estimatedCostUsd ?? undefined,
          payload: this.toInputJsonValue(assistantPayload),
          role: MessageRole.ASSISTANT,
          sessionId: session.id,
          tokenInput: result.usage?.inputTokens,
          tokenOutput: result.usage?.outputTokens,
          workspaceId: connection.workspaceId
        }
      });
      assistantMessageId = assistantMessage.id;

      const dispatch = await this.whatsapp.sendText({
        assistantMessageId: assistantMessage.id,
        connectionId: connection.id,
        content: result.reply,
        externalConversationId: conversationId,
        externalUserId: input.externalUserId,
        idempotencyKey: assistantMessage.id,
        metadata: {
          sessionId: session.id
        }
      });

      await this.prisma.message.update({
        where: {
          id: assistantMessage.id
        },
        data: {
          payload: this.toInputJsonValue({
            ...assistantPayload,
            deliveryStatus: "queued",
            queueJobId: dispatch.jobId,
            queuedAt: new Date().toISOString()
          })
        }
      });

      await this.prisma.session.update({
        where: {
          id: session.id
        },
        data: {
          lastMessageAt: new Date(),
          metadata: this.toInputJsonValue({
            ...sessionMetadata,
            channel: "whatsapp",
            externalConversationId: conversationId,
            externalUserId: input.externalUserId,
            groupSubject: groupContext.groupSubject,
            isGroupMessage: groupContext.isGroupMessage,
            lastInboundMessageId: inboundMessage.id,
            lastInboundAt: input.receivedAt,
            lastAssistantAt: new Date().toISOString(),
            providerConnectionId: providerRuntime.connectionId,
            providerType: providerRuntime.providerType,
            targetAgentId: agent.id,
            triggerReason: groupContext.triggerReason
          }),
          status: SessionStatus.OPEN
        }
      });

      return {
        reply: result.reply,
        sessionId: session.id
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown conversation execution error.";
      this.logger.error(
        {
          connectionId: connection.id,
          error,
          sessionId: session.id,
          workspaceId: connection.workspaceId
        },
        "WhatsApp conversation execution failed"
      );

      if (assistantMessageId) {
        const assistantMessage = await this.prisma.message.findUnique({
          where: {
            id: assistantMessageId
          },
          select: {
            payload: true
          }
        });

        await this.prisma.message.update({
          where: {
            id: assistantMessageId
          },
          data: {
            payload: this.toInputJsonValue({
              ...((assistantMessage?.payload as Record<string, unknown> | null) ?? {}),
              deliveryStatus: "failed",
              lastError: message,
              lastErrorAt: new Date().toISOString()
            })
          }
        }).catch(() => undefined);
      }

      await this.prisma.channelConnection.update({
        where: {
          id: connection.id
        },
        data: {
          lastError: message,
          lastActivityAt: new Date()
        }
      });

      await this.prisma.session.update({
        where: {
          id: session.id
        },
        data: {
          metadata: this.toInputJsonValue({
            ...sessionMetadata,
            channel: "whatsapp",
            externalConversationId: conversationId,
            externalUserId: input.externalUserId,
            groupSubject: groupContext.groupSubject,
            isGroupMessage: groupContext.isGroupMessage,
            lastError: message,
            lastErrorAt: new Date().toISOString(),
            targetAgentId: agent.id,
            triggerReason: groupContext.triggerReason
          }),
          status: SessionStatus.IDLE
        }
      });

      await this.prisma.channelEventLog.create({
        data: {
          channelConnectionId: connection.id,
          message,
          payload: this.toInputJsonValue({
            direction: "runtime",
            externalUserId: input.externalUserId,
            sessionId: session.id
          }),
          type: ChannelEventType.ERROR,
          workspaceId: connection.workspaceId
        }
      });

      throw error;
    }
  }

  async listSessions(
    workspaceId: string,
    filters: {
      agentId?: string;
      channelConnectionId?: string;
      channelType?: ChannelType;
      page: number;
      pageSize: number;
      query?: string;
      status?: SessionStatus;
    }
  ): Promise<SessionListResponse> {
    const page = Math.max(filters.page, 1);
    const pageSize = Math.min(Math.max(filters.pageSize, 1), 50);
    const query = filters.query?.trim();
    const where = {
      agentId: filters.agentId,
      channelConnection: filters.channelType
        ? {
            type: filters.channelType
          }
        : undefined,
      channelConnectionId: filters.channelConnectionId,
      OR: query
        ? [
            {
              externalConversationId: {
                contains: query,
                mode: "insensitive" as const
              }
            },
            {
              externalUserId: {
                contains: query,
                mode: "insensitive" as const
              }
            },
            {
              visitorName: {
                contains: query,
                mode: "insensitive" as const
              }
            }
          ]
        : undefined,
      status: filters.status,
      workspaceId
    } satisfies Prisma.SessionWhereInput;

    const [total, sessions] = await this.prisma.$transaction([
      this.prisma.session.count({
        where
      }),
      this.prisma.session.findMany({
        where,
        include: {
          _count: {
            select: {
              messages: true
            }
          },
          agent: {
            select: {
              id: true,
              name: true
            }
          },
          channelConnection: {
            select: {
              id: true,
              name: true,
              status: true,
              type: true
            }
          },
          messages: {
            orderBy: {
              createdAt: "desc"
            },
            select: {
              content: true,
              createdAt: true
            },
            take: 1
          }
        },
        orderBy: {
          lastMessageAt: "desc"
        },
        skip: (page - 1) * pageSize,
        take: pageSize
      })
    ]);

    return {
      hasNextPage: page * pageSize < total,
      items: sessions.map((session) => serializeSessionListItem(session)),
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize))
    };
  }

  async getSessionDetails(workspaceId: string, sessionId: string): Promise<SessionDetailsResponse> {
    const session = await this.prisma.session.findFirst({
      where: {
        id: sessionId,
        workspaceId
      },
      include: {
        agent: {
          select: {
            id: true,
            name: true
          }
        },
        channelConnection: {
          select: {
            id: true,
            lastActivityAt: true,
            lastError: true,
            name: true,
            status: true,
            type: true
          }
        },
        messages: {
          orderBy: {
            createdAt: "asc"
          },
          select: {
            content: true,
            createdAt: true,
            estimatedCostUsd: true,
            externalMessageId: true,
            id: true,
            payload: true,
            role: true,
            tokenInput: true,
            tokenOutput: true
          }
        }
      }
    });

    if (!session) {
      throw new HttpError(404, "Session not found.", "SESSION_NOT_FOUND");
    }

    return serializeSessionDetails(session);
  }

  private async resolveSession(input: {
    agentId: string;
    channelConnectionId: string;
    externalConversationId?: string;
    externalUserId: string;
    initialMetadata?: Record<string, Prisma.InputJsonValue>;
    visitorName?: string;
    workspaceId: string;
  }) {
    const conversationId = input.externalConversationId ?? input.externalUserId;
    const isGroupConversation = conversationId !== input.externalUserId;
    const existing = await this.prisma.session.findFirst({
      where: {
        agentId: input.agentId,
        channelConnectionId: input.channelConnectionId,
        externalConversationId: conversationId,
        externalUserId: isGroupConversation ? undefined : input.externalUserId,
        status: {
          in: [SessionStatus.OPEN, SessionStatus.IDLE]
        },
        workspaceId: input.workspaceId
      },
      orderBy: {
        lastMessageAt: "desc"
      }
    });

    if (existing) {
      return existing;
    }

    return this.prisma.session.create({
      data: {
        agentId: input.agentId,
        channelConnectionId: input.channelConnectionId,
        externalConversationId: conversationId,
        externalUserId: input.externalUserId,
        metadata: {
          channel: "whatsapp",
          ...(input.initialMetadata ?? {})
        } as Prisma.InputJsonValue,
        status: SessionStatus.OPEN,
        visitorName: input.visitorName,
        workspaceId: input.workspaceId
      }
    });
  }

  private async loadPriorMessages(sessionId: string, isGroupMessage = false): Promise<ProviderMessage[]> {
    const messages = await this.prisma.message.findMany({
      where: {
        sessionId
      },
      orderBy: {
        createdAt: "asc"
      },
      take: isGroupMessage ? this.env.WHATSAPP_GROUP_HISTORY_LIMIT : 20
    });

    return messages
      .filter((message) => !this.isCommandMessage(message.payload))
      .map((message) => ({
        content: this.formatStoredMessageForRuntime(message),
        role: message.role.toLowerCase() as ProviderMessage["role"]
      }));
  }

  private async resolveInboundAgent(input: {
    conversationAgentId?: string;
    conversationSelections?: ConversationCommandSelections;
    connectionDefaultAgentId?: string;
    input: WhatsAppInboundInput;
    workspaceId: string;
  }) {
    const raw = this.asRecord(input.input.raw);
    const targetAgentId = this.readString(raw?.targetAgentId);
    const targetAgentSlug = this.readString(raw?.targetAgentSlug);

    if (targetAgentId) {
      const agent = await this.prisma.agent.findFirst({
        where: {
          id: targetAgentId,
          workspaceId: input.workspaceId,
          deletedAt: null,
          status: AgentStatus.ACTIVE
        }
      });

      if (agent) {
        return agent;
      }
    }

    if (targetAgentSlug) {
      const agent = await this.prisma.agent.findFirst({
        where: {
          slug: targetAgentSlug,
          workspaceId: input.workspaceId,
          deletedAt: null,
          status: AgentStatus.ACTIVE
        }
      });

      if (agent) {
        return agent;
      }
    }

    const selectedAgentId = input.conversationSelections?.selectedAgentId ?? input.conversationAgentId;

    if (selectedAgentId) {
      const agent = await this.prisma.agent.findFirst({
        where: {
          id: selectedAgentId,
          workspaceId: input.workspaceId,
          deletedAt: null,
          status: AgentStatus.ACTIVE
        }
      });

      if (agent) {
        return agent;
      }
    }

    if (input.connectionDefaultAgentId) {
      const agent = await this.prisma.agent.findFirst({
        where: {
          id: input.connectionDefaultAgentId,
          workspaceId: input.workspaceId,
          deletedAt: null,
          status: AgentStatus.ACTIVE
        }
      });

      if (agent) {
        return agent;
      }
    }

    return this.prisma.agent.findFirst({
      where: {
        workspaceId: input.workspaceId,
        isDefault: true,
        deletedAt: null,
        status: AgentStatus.ACTIVE
      }
    });
  }

  private extractGroupContext(input: WhatsAppInboundInput): WhatsAppGroupContext {
    const raw = this.asRecord(input.raw);
    const participantName =
      this.readString(raw?.participantName) ??
      input.visitorName ??
      this.readString(raw?.pushName) ??
      this.readString(raw?.participantJid) ??
      input.externalUserId;

    return {
      groupSubject: this.readString(raw?.groupSubject) ?? undefined,
      isGroupMessage: raw?.isGroupMessage === true,
      participantJid: this.readString(raw?.participantJid) ?? undefined,
      speakerLabel: participantName,
      targetAgentId: this.readString(raw?.targetAgentId) ?? undefined,
      triggerReason: this.readString(raw?.triggerReason) ?? undefined
    };
  }

  private formatInboundMessageForRuntime(input: WhatsAppInboundInput, context: WhatsAppGroupContext): string {
    if (!context.isGroupMessage) {
      return input.message;
    }

    return this.buildGroupUserMessage(input.message, context.speakerLabel);
  }

  private buildRuntimeSystemPrompt(basePrompt: string, context: WhatsAppGroupContext): string {
    const prompt = basePrompt?.trim() || "You are VEXUSCLAW, an enterprise-grade mission-control agent.";

    if (!context.isGroupMessage) {
      return prompt;
    }

    const details = [
      prompt,
      "",
      "You are replying inside a WhatsApp group chat.",
      context.groupSubject ? `Group subject: ${context.groupSubject}.` : undefined,
      context.speakerLabel ? `Current speaker: ${context.speakerLabel}.` : undefined,
      "Messages prefixed with [from: Name] indicate who sent that group message.",
      "Reply normally in the group when addressed. Do not claim that you cannot reply in groups."
    ].filter(Boolean);

    return details.join("\n");
  }

  private shouldSuppressAssistantReply(reply: string, context: WhatsAppGroupContext): boolean {
    if (!context.isGroupMessage) {
      return false;
    }

    return reply.trim().toUpperCase() === "NO_REPLY";
  }

  private formatStoredMessageForRuntime(message: {
    content: string;
    payload: Prisma.JsonValue | null;
    role: MessageRole;
  }): string {
    if (message.role !== MessageRole.USER) {
      return message.content;
    }

    const payload = this.asRecord(message.payload);
    const raw = this.asRecord(payload?.raw);

    if (raw?.isGroupMessage !== true) {
      return message.content;
    }

    const speaker =
      this.readString(raw?.participantName) ??
      this.readString(raw?.pushName) ??
      this.readString(raw?.participantJid);

    return this.buildGroupUserMessage(message.content, speaker ?? undefined);
  }

  private buildGroupUserMessage(content: string, speakerLabel?: string): string {
    const speaker = speakerLabel?.trim();

    if (!speaker) {
      return content;
    }

    return `[from: ${speaker}] ${content}`;
  }

  private async loadConversationState(input: {
    channelConnectionId: string;
    conversationId: string;
    workspaceId: string;
  }) {
    return this.prisma.session.findFirst({
      where: {
        channelConnectionId: input.channelConnectionId,
        externalConversationId: input.conversationId,
        workspaceId: input.workspaceId
      },
      orderBy: {
        lastMessageAt: "desc"
      },
      select: {
        agentId: true,
        id: true,
        metadata: true
      }
    });
  }

  private extractConversationSelections(metadata: unknown): ConversationCommandSelections {
    const record = this.asRecord(metadata);
    const selectedAgentId = this.readString(record?.selectedAgentId) ?? undefined;
    const modelOverride = this.extractModelOverride(record?.modelOverride);

    return {
      modelOverride,
      selectedAgentId
    };
  }

  private extractModelOverride(value: unknown): SessionModelOverride | undefined {
    const record = this.asRecord(value);
    const model = this.readString(record?.model);
    const providerType = this.readString(record?.providerType);
    const setAt = this.readString(record?.setAt);

    if (!model || !setAt || !providerType) {
      return undefined;
    }

    if (providerType !== "openai" && providerType !== "chatgpt_oauth" && providerType !== "mock") {
      return undefined;
    }

    return {
      model,
      providerType,
      setAt
    };
  }

  private buildSelectionMetadata(selections: ConversationCommandSelections): Record<string, Prisma.InputJsonValue> {
    const metadata: Record<string, Prisma.InputJsonValue> = {};

    if (selections.selectedAgentId) {
      metadata.selectedAgentId = selections.selectedAgentId;
    }

    if (selections.modelOverride) {
      metadata.modelOverride = {
        model: selections.modelOverride.model,
        providerType: selections.modelOverride.providerType,
        setAt: selections.modelOverride.setAt
      };
    }

    return metadata;
  }

  private toInputJsonValue(value: unknown): Prisma.InputJsonValue {
    return value as Prisma.InputJsonValue;
  }

  private isCommandMessage(payload: Prisma.JsonValue | null): boolean {
    const record = this.asRecord(payload);
    return record?.commandHandled === true || Boolean(this.asRecord(record?.command));
  }

  private asRecord(value: unknown): Record<string, unknown> | null {
    return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
  }

  private readString(value: unknown): string | null {
    return typeof value === "string" && value.trim() ? value : null;
  }

  private async resolveProviderRuntime(
    workspaceId: string,
    modelOverride?: SessionModelOverride
  ): Promise<ResolvedProviderRuntime> {
    const preferredProvider =
      modelOverride?.providerType === "openai"
        ? PrismaProviderType.OPENAI
        : modelOverride?.providerType === "chatgpt_oauth"
          ? PrismaProviderType.CHATGPT_OAUTH
          : modelOverride?.providerType === "mock"
            ? PrismaProviderType.MOCK
            : undefined;
    const connection =
      (preferredProvider
        ? await this.prisma.providerConnection.findFirst({
            where: {
              deletedAt: null,
              provider: preferredProvider,
              status: ProviderConnectionStatus.CONNECTED,
              workspaceId
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
        : null) ??
      (await this.prisma.providerConnection.findFirst({
        where: {
          deletedAt: null,
          status: ProviderConnectionStatus.CONNECTED,
          workspaceId
        },
        orderBy: [
          {
            isPrimary: "desc"
          },
          {
            updatedAt: "desc"
          }
        ]
      }));

    if (!connection) {
      return {
        adapter: this.providerRegistry.get("mock"),
        connectionId: null,
        label: "VEXUSCLAW Mock Provider",
        metadata: {
          providerFallback: true,
          providerFallbackReason: "no_primary_provider"
        },
        providerType: "mock"
      };
    }

    const providerType = connection.provider.toLowerCase() as ProviderType;

    if (providerType === "openai" && !connection.encryptedSecret) {
      return {
        adapter: this.providerRegistry.get("mock"),
        connectionId: connection.id,
        label: `${connection.label} (fallback)`,
        metadata: {
          providerFallback: true,
          providerFallbackReason: "missing_openai_secret"
        },
        providerType: "mock"
      };
    }

    if (providerType === "chatgpt_oauth") {
      const resolved = await this.chatgptOAuth.ensureAccessToken(connection);

      if (!resolved.accessToken) {
        return {
          adapter: this.providerRegistry.get("mock"),
          connectionId: connection.id,
          label: `${connection.label} (fallback)`,
          metadata: {
            providerFallback: true,
            providerFallbackReason: "chatgpt_oauth_unavailable"
          },
          providerType: "mock"
        };
      }

      return {
        adapter: this.providerRegistry.get("chatgpt_oauth"),
        connectionId: connection.id,
        label: connection.label,
        metadata: {
          chatgptAccountId: connection.accountId,
          chatgptAccessToken: resolved.accessToken,
          ...(modelOverride?.providerType === providerType && modelOverride.model
            ? {
                providerModel: modelOverride.model
              }
            : {})
        },
        providerType
      };
    }

    return {
      adapter: this.providerRegistry.get(providerType),
      connectionId: connection.id,
      label: connection.label,
      metadata:
        providerType === "openai" && connection.encryptedSecret
          ? {
              openaiApiKey: decryptSecret(connection.encryptedSecret),
              ...(modelOverride?.providerType === providerType && modelOverride.model
                ? {
                    providerModel: modelOverride.model
                  }
                : {})
            }
          : {},
      providerType
    };
  }
}
