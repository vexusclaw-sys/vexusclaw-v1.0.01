import type {
  ChannelStatus,
  ChannelType,
  MessageRole,
  ProviderType
} from "@vexus/shared";

export interface ProviderMessage {
  role: MessageRole;
  content: string;
}

export interface ProviderCompletion {
  content: string;
  provider: ProviderType;
  model: string;
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
    estimatedCostUsd?: number;
  };
}

export interface ChannelEvent {
  workspaceId: string;
  channelConnectionId: string;
  externalUserId: string;
  externalConversationId?: string;
  message: string;
  receivedAt: string;
  metadata?: Record<string, unknown>;
}

export interface ToolInvocationResult {
  ok: boolean;
  output: string;
  metadata?: Record<string, unknown>;
}

export interface ToolAdapter {
  key: string;
  description: string;
  permissions: string[];
  execute(input: Record<string, unknown>, context: AgentRuntimeContext): Promise<ToolInvocationResult>;
}

export interface MemoryStore {
  remember(input: {
    workspaceId: string;
    agentId?: string;
    sessionId?: string;
    content: string;
    tags?: string[];
  }): Promise<void>;
  findRelevant(input: {
    workspaceId: string;
    agentId?: string;
    sessionId?: string;
    query: string;
    limit?: number;
  }): Promise<string[]>;
}

export interface AgentRuntimeContext {
  workspaceId: string;
  agentId: string;
  sessionId: string;
  channelConnectionId: string;
  memory: MemoryStore;
  tools: ToolAdapter[];
  metadata?: Record<string, unknown>;
}

export interface ProviderAdapter {
  key: ProviderType;
  label: string;
  supportsStreaming: boolean;
  isConfigured(): Promise<boolean>;
  chat(messages: ProviderMessage[], context: AgentRuntimeContext): Promise<ProviderCompletion>;
}

export interface ChannelSendPayload {
  sessionId: string;
  content: string;
  metadata?: Record<string, unknown>;
}

export interface ChannelAdapter {
  key: ChannelType;
  label: string;
  getStatus(connectionId: string): Promise<ChannelStatus>;
  normalizeInbound(payload: unknown): Promise<ChannelEvent>;
  sendMessage(connectionId: string, payload: ChannelSendPayload): Promise<void>;
}

export interface PluginManifest {
  slug: string;
  name: string;
  version: string;
  author: string;
  category: string;
  permissions: string[];
  description: string;
}
