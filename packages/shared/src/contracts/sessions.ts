import type { ChannelStatus, ChannelType, MessageRole, SessionStatus } from "../enums";

export interface SessionListItem {
  id: string;
  status: SessionStatus;
  channelConnectionId: string;
  channelName: string;
  channelType: ChannelType;
  channelStatus: ChannelStatus;
  agentId: string;
  agentName: string;
  externalUserId: string;
  externalConversationId: string | null;
  visitorName: string | null;
  lastMessageAt: string;
  startedAt: string;
  updatedAt: string;
  lastPreview: string | null;
  messageCount: number;
}

export interface SessionListResponse {
  items: SessionListItem[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
}

export interface SessionTranscriptMessage {
  id: string;
  externalMessageId: string | null;
  role: MessageRole;
  content: string;
  tokenInput: number | null;
  tokenOutput: number | null;
  estimatedCostUsd: string | null;
  payload: Record<string, unknown> | null;
  createdAt: string;
}

export interface SessionDetailsResponse {
  id: string;
  status: SessionStatus;
  channelConnectionId: string;
  channelName: string;
  channelType: ChannelType;
  channelStatus: ChannelStatus;
  channelLastActivityAt: string | null;
  channelLastError: string | null;
  agentId: string;
  agentName: string;
  externalUserId: string;
  externalConversationId: string | null;
  visitorName: string | null;
  summary: string | null;
  metadata: Record<string, unknown> | null;
  startedAt: string;
  lastMessageAt: string;
  closedAt: string | null;
  messageCount: number;
  messages: SessionTranscriptMessage[];
}
