import type { ChannelEventType, ChannelStatus, ChannelType } from "../enums";

export interface ChannelEventLogItem {
  id: string;
  channelConnectionId: string;
  channelName: string | null;
  channelType: ChannelType | null;
  payload: Record<string, unknown> | null;
  type: ChannelEventType;
  message: string;
  createdAt: string;
}

export interface ChannelConnectionDetails {
  id: string;
  name: string;
  type: ChannelType;
  status: ChannelStatus;
  isPrimary: boolean;
  qrCodeData: string | null;
  qrExpiresAt: string | null;
  lastError: string | null;
  lastConnectedAt: string | null;
  lastActivityAt: string | null;
  updatedAt: string;
  sessionState: Record<string, unknown> | null;
  recentLogs?: ChannelEventLogItem[];
}

export interface ChannelListResponse {
  items: ChannelConnectionDetails[];
}

export interface ChannelLogListResponse {
  items: ChannelEventLogItem[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
}
