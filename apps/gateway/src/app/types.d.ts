import type { FastifyReply } from "fastify";
import type Redis from "ioredis";

import type { VexusCore } from "@vexus/core";
import type { PrismaClient } from "@vexus/db";
import type { ProviderRegistry } from "@vexus/providers";

import type { AccessTokenPayload } from "./auth-context";
import type { AuthService } from "../modules/auth/service";
import type { AgentsService } from "../modules/agents/service";
import type { ConversationService } from "../modules/conversations/service";
import type { HealthService } from "../modules/health/service";
import type { LogsService } from "../modules/logs/service";
import type { OverviewService } from "../modules/overview/service";
import type { ProvisioningService } from "../modules/provisioning/service";
import type { ChatGptOAuthService } from "../modules/providers/chatgpt-oauth/service";
import type { ProviderService } from "../modules/providers/service";
import type { SetupService } from "../modules/setup/service";
import type { WorkspaceDomainService, ResolvedHostWorkspace } from "../modules/workspace/domain-service";
import type { WorkspaceService } from "../modules/workspace/service";
import type { WhatsAppChannelService } from "../modules/channels/whatsapp/service";

export interface GatewayServices {
  agents: AgentsService;
  auth: AuthService;
  chatgptOAuth: ChatGptOAuthService;
  conversations: ConversationService;
  health: HealthService;
  logs: LogsService;
  overview: OverviewService;
  provisioning: ProvisioningService;
  providers: ProviderService;
  setup: SetupService;
  workspaceDomains: WorkspaceDomainService;
  workspace: WorkspaceService;
  whatsapp: WhatsAppChannelService;
}

declare module "fastify" {
  interface FastifyInstance {
    authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    prisma: PrismaClient;
    providerRegistry: ProviderRegistry;
    redis: Redis;
    runtime: VexusCore;
    services: GatewayServices;
  }

  interface FastifyRequest {
    authContext: AccessTokenPayload | null;
    hostWorkspace: ResolvedHostWorkspace | null;
  }
}
