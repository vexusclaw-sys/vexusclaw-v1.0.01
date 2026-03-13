import type { FastifyBaseLogger } from "fastify";

import type { VexusEnv } from "@vexus/config";
import type { AgentStatus, Prisma, PrismaClient } from "@vexus/db";
import type { ProviderType } from "@vexus/shared";

export interface ParsedSlashCommand {
  argsText: string;
  name: string;
  normalized: string;
  raw: string;
  tokens: string[];
}

export interface SessionModelOverride {
  model: string;
  providerType: ProviderType;
  setAt: string;
}

export interface ConversationCommandSelections {
  modelOverride?: SessionModelOverride;
  selectedAgentId?: string;
}

export interface ConversationCommandContext {
  channelConnection: {
    config: Prisma.JsonValue | null;
    defaultAgentId: string | null;
    id: string;
    name: string;
  };
  conversationId: string;
  currentAgent: {
    id: string;
    isDefault: boolean;
    name: string;
    slug: string;
    status: AgentStatus;
  };
  env: VexusEnv;
  externalUserId: string;
  logger: FastifyBaseLogger;
  prisma: PrismaClient;
  selections: ConversationCommandSelections;
  session: {
    agentId: string;
    externalConversationId: string | null;
    id: string;
    metadata: Prisma.JsonValue | null;
  };
  workspaceId: string;
}

export interface ConversationCommandResult {
  assistantPayload?: Record<string, unknown>;
  command: ParsedSlashCommand;
  reply: string;
  sessionMetadataPatch?: Record<string, unknown>;
}

export interface ModelCatalogEntry {
  connectionId: string | null;
  connectionLabel: string;
  isPrimary: boolean;
  key: string;
  model: string;
  providerType: ProviderType;
  source: "chatgpt_runtime" | "mock" | "openai_api" | "openai_default";
}

export interface WorkspaceModelCatalog {
  defaultSelection: SessionModelOverride;
  entries: ModelCatalogEntry[];
}

export interface ClawHubSearchResult {
  displayName: string;
  score: number;
  slug: string;
  version?: string;
}

export interface ClawHubExploreItem {
  createdAt?: number;
  displayName: string;
  latestVersion?: {
    createdAt?: number;
    version?: string;
  } | null;
  metadata?: Record<string, unknown> | null;
  slug: string;
  stats?: {
    comments?: number;
    downloads?: number;
    installsAllTime?: number;
    installsCurrent?: number;
    stars?: number;
    versions?: number;
  } | null;
  summary?: string | null;
  tags?: Record<string, string> | null;
  updatedAt?: number;
}

export interface ClawHubInspectResult {
  latestVersion?: {
    changelog?: string | null;
    createdAt?: number;
    version?: string;
  } | null;
  owner?: {
    displayName?: string | null;
    handle?: string | null;
    userId?: string | null;
  } | null;
  skill?: {
    createdAt?: number;
    displayName?: string | null;
    slug?: string | null;
    stats?: Record<string, number>;
    summary?: string | null;
    tags?: Record<string, string>;
    updatedAt?: number;
  } | null;
  version?: unknown;
  versions?: unknown;
}

export interface WorkspaceSkillPaths {
  lockfilePath: string;
  skillsDir: string;
  workspaceRoot: string;
}

export interface WorkspaceSkillSummary {
  author: string;
  category: string;
  description: string;
  installed: boolean;
  installedAt?: string;
  installedVersion?: string;
  name: string;
  slug: string;
  version: string;
}
