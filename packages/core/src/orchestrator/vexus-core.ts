import type { Logger } from "pino";

import type {
  AgentRuntimeContext,
  ChannelEvent,
  MemoryStore,
  ProviderCompletion,
  ProviderAdapter,
  ProviderMessage,
  ToolAdapter
} from "@vexus/sdk";

export interface VexusCoreDependencies {
  provider: ProviderAdapter;
  memory: MemoryStore;
  tools?: ToolAdapter[];
  logger: Logger;
}

export interface CoreExecutionResult {
  reply: string;
  provider: string;
  model: string;
  usage?: ProviderCompletion["usage"];
}

export interface CoreExecutionOptions {
  priorMessages?: ProviderMessage[];
  provider?: ProviderAdapter;
  systemPrompt?: string;
}

export class VexusCore {
  private readonly provider: ProviderAdapter;
  private readonly memory: MemoryStore;
  private readonly tools: ToolAdapter[];
  private readonly logger: Logger;

  constructor(dependencies: VexusCoreDependencies) {
    this.provider = dependencies.provider;
    this.memory = dependencies.memory;
    this.tools = dependencies.tools ?? [];
    this.logger = dependencies.logger;
  }

  async handleInboundMessage(
    event: ChannelEvent,
    context: AgentRuntimeContext,
    options: CoreExecutionOptions = {}
  ): Promise<CoreExecutionResult> {
    this.logger.info(
      {
        workspaceId: event.workspaceId,
        channelConnectionId: event.channelConnectionId,
        externalUserId: event.externalUserId
      },
      "Handling inbound channel event"
    );

    await this.memory.remember({
      workspaceId: context.workspaceId,
      agentId: context.agentId,
      sessionId: context.sessionId,
      content: event.message,
      tags: ["inbound", "channel-message"]
    });

    const provider = options.provider ?? this.provider;
    const completion = await provider.chat(
      this.buildConversationMessages(event, options),
      {
        ...context,
        tools: this.tools
      }
    );

    await this.memory.remember({
      workspaceId: context.workspaceId,
      agentId: context.agentId,
      sessionId: context.sessionId,
      content: completion.content,
      tags: ["outbound", "assistant-message"]
    });

    return {
      reply: completion.content,
      provider: completion.provider,
      model: completion.model,
      usage: completion.usage
    };
  }

  private buildConversationMessages(
    event: ChannelEvent,
    options: CoreExecutionOptions
  ): ProviderMessage[] {
    const systemPrompt =
      options.systemPrompt ?? "You are VEXUSCLAW, an enterprise-grade mission-control agent.";

    return [
      {
        role: "system",
        content: systemPrompt
      },
      ...(options.priorMessages ?? []),
      {
        role: "user",
        content: event.message
      }
    ];
  }
}
