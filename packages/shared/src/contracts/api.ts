import type {
  AgentStatus,
  ChannelStatus,
  ChannelType,
  HealthState,
  ProviderConnectionStatus,
  ProviderType,
  SessionStatus
} from "../enums";

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
}

export interface ApiEnvelope<T> {
  data: T;
  meta?: PaginationMeta | Record<string, unknown>;
}

export interface HealthCheckResult {
  name: string;
  status: HealthState;
  latencyMs?: number;
  details?: Record<string, unknown>;
}

export interface HealthReport {
  status: HealthState;
  version: string;
  timestamp: string;
  checks: HealthCheckResult[];
}

export interface ProviderConnectionSummary {
  id: string;
  provider: ProviderType;
  label: string;
  status: ProviderConnectionStatus;
  updatedAt: string;
}

export interface AgentSummary {
  id: string;
  name: string;
  role: string;
  tone: string;
  status: AgentStatus;
  isDefault: boolean;
}

export interface ChannelConnectionSummary {
  id: string;
  name: string;
  type: ChannelType;
  status: ChannelStatus;
  updatedAt: string;
}

export interface SessionSummary {
  id: string;
  status: SessionStatus;
  channelType: ChannelType;
  agentName: string;
  lastMessageAt: string;
}
