import type { AgentStatus, ChannelType } from "../enums";

export interface AgentDetails {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  role: string;
  instructions: string;
  tone: string;
  operatorAddressing: string | null;
  status: AgentStatus;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  availableChannels: ChannelType[];
  tools: string[];
}

export interface AgentListResponse {
  items: AgentDetails[];
}

export interface CreateAgentInput {
  name: string;
  description?: string;
  role: string;
  instructions: string;
  tone: string;
  operatorAddressing?: string;
}

export interface UpdateAgentInput extends CreateAgentInput {}
