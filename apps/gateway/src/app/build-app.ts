import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import websocket from "@fastify/websocket";
import Fastify from "fastify";
import type { FastifyInstance } from "fastify";
import Redis from "ioredis";

import { readEnv } from "@vexus/config";
import { VexusCore } from "@vexus/core";
import { prisma } from "@vexus/db";
import { createLogger } from "@vexus/logger";
import { NullMemoryStore } from "@vexus/memory";
import {
  ChatGptOAuthProviderAdapter,
  MockProviderAdapter,
  OpenAIProviderAdapter,
  ProviderRegistry
} from "@vexus/providers";
import { authCookieNames } from "@vexus/shared";
import { createDefaultTools } from "@vexus/tools";

import type { AccessTokenPayload } from "./auth-context";
import { HttpError, isHttpError } from "./errors";
import { getAuthorizationToken, getRequestHost } from "./http";
import { registerAgentRoutes } from "../modules/agents/routes";
import { AgentsService } from "../modules/agents/service";
import { registerAuthRoutes } from "../modules/auth/routes";
import { AuthService } from "../modules/auth/service";
import { registerChannelRoutes } from "../modules/channels/routes";
import { WhatsAppChannelService } from "../modules/channels/whatsapp/service";
import { ConversationService } from "../modules/conversations/service";
import { registerHealthRoutes } from "../modules/health/routes";
import { HealthService } from "../modules/health/service";
import { registerLogRoutes } from "../modules/logs/routes";
import { LogsService } from "../modules/logs/service";
import { registerOverviewRoutes } from "../modules/overview/routes";
import { OverviewService } from "../modules/overview/service";
import { registerProvisioningRoutes } from "../modules/provisioning/routes";
import { ProvisioningService } from "../modules/provisioning/service";
import { ChatGptOAuthService } from "../modules/providers/chatgpt-oauth/service";
import { registerProviderRoutes } from "../modules/providers/routes";
import { ProviderService } from "../modules/providers/service";
import { registerSessionRoutes } from "../modules/sessions/routes";
import { registerSetupRoutes } from "../modules/setup/routes";
import { SetupService } from "../modules/setup/service";
import { WorkspaceDomainService } from "../modules/workspace/domain-service";
import { registerWorkspaceRoutes } from "../modules/workspace/routes";
import { WorkspaceService } from "../modules/workspace/service";
import { registerRootRoutes } from "../routes/root";

export async function buildApp(): Promise<FastifyInstance<any, any, any, any>> {
  const env = readEnv();
  const logger = createLogger({ service: "gateway" });
  const redis = new Redis(env.REDIS_URL, {
    lazyConnect: true,
    maxRetriesPerRequest: 1
  });

  const app = Fastify({
    loggerInstance: logger,
    trustProxy: true
  });

  const providerRegistry = new ProviderRegistry();
  const mockProvider = new MockProviderAdapter();
  const openAIProvider = new OpenAIProviderAdapter();
  const chatGptOAuthProvider = new ChatGptOAuthProviderAdapter();
  providerRegistry.register(mockProvider);
  providerRegistry.register(openAIProvider);
  providerRegistry.register(chatGptOAuthProvider);

  const runtime = new VexusCore({
    provider: env.OPENAI_API_KEY ? openAIProvider : mockProvider,
    memory: new NullMemoryStore(),
    tools: createDefaultTools(),
    logger
  });

  await app.register(cors, {
    origin: true,
    credentials: true
  });
  await app.register(cookie);
  await app.register(jwt, {
    secret: env.JWT_ACCESS_SECRET
  });
  await app.register(websocket);

  await redis.connect();

  const workspaceDomains = new WorkspaceDomainService({
    env,
    logger,
    prisma
  });
  const providerService = new ProviderService({
    logger,
    prisma
  });
  const chatGptOAuthService = new ChatGptOAuthService({
    env,
    logger,
    prisma,
    workspaceDomains
  });
  const agentsService = new AgentsService({
    logger,
    prisma
  });
  const whatsappService = new WhatsAppChannelService({
    env,
    logger,
    prisma
  });
  const setupService = new SetupService({
    env,
    logger,
    prisma,
    providers: providerService,
    whatsapp: whatsappService,
    workspaceDomains
  });
  const conversationService = new ConversationService({
    chatgptOAuth: chatGptOAuthService,
    env,
    logger,
    prisma,
    providerRegistry,
    runtime,
    whatsapp: whatsappService
  });
  const healthService = new HealthService({
    logger,
    prisma,
    redis
  });
  const logsService = new LogsService({
    logger,
    whatsapp: whatsappService
  });
  const authService = new AuthService({
    env,
    logger,
    prisma,
    signAccessToken: (payload) =>
      app.jwt.sign(payload, {
        expiresIn: `${env.ACCESS_TOKEN_TTL_MINUTES}m`
      }),
    verifyAccessToken: async (token) => app.jwt.verify<AccessTokenPayload>(token),
    workspaceDomains
  });
  const overviewService = new OverviewService({
    health: healthService,
    logger,
    prisma,
    setup: setupService,
    workspaceDomains
  });
  const provisioningService = new ProvisioningService({
    env,
    logger,
    prisma
  });
  const workspaceService = new WorkspaceService({
    logger,
    prisma,
    workspaceDomains
  });

  whatsappService.setInboundHandler(async (input) => {
    await conversationService.handleWhatsAppInbound(input);
  });

  app.decorate("runtime", runtime);
  app.decorate("prisma", prisma);
  app.decorate("redis", redis);
  app.decorate("providerRegistry", providerRegistry);
  app.decorateRequest("authContext", null);
  app.decorateRequest("hostWorkspace", null);
  app.decorate("services", {
    agents: agentsService,
    auth: authService,
    chatgptOAuth: chatGptOAuthService,
    conversations: conversationService,
    health: healthService,
    logs: logsService,
    overview: overviewService,
    provisioning: provisioningService,
    providers: providerService,
    setup: setupService,
    workspaceDomains,
    workspace: workspaceService,
    whatsapp: whatsappService
  });
  app.addHook("onRequest", async (request) => {
    try {
      request.hostWorkspace = await workspaceDomains.resolveByHost(getRequestHost(request));
    } catch (error) {
      request.hostWorkspace = null;
      request.log.warn({ error }, "Workspace host resolution failed");
    }
  });
  app.decorate("authenticate", async (request) => {
    const accessToken =
      request.cookies[authCookieNames.accessToken] ?? getAuthorizationToken(request);

    if (!accessToken) {
      throw new HttpError(401, "Authentication required.", "AUTH_REQUIRED");
    }

    try {
      const payload = await app.jwt.verify<AccessTokenPayload>(accessToken);

      if (request.hostWorkspace && request.hostWorkspace.workspace.id !== payload.workspaceId) {
        throw new HttpError(
          403,
          "The current subdomain does not match the authenticated workspace.",
          "AUTH_WORKSPACE_HOST_MISMATCH"
        );
      }

      request.authContext = payload;
    } catch (error) {
      if (isHttpError(error)) {
        throw error;
      }

      throw new HttpError(401, "Authentication required.", "AUTH_INVALID_ACCESS", {
        cause: error instanceof Error ? error.message : "Unknown token verification error"
      });
    }
  });

  app.setErrorHandler((error, request, reply) => {
    request.log.error({ error }, "Gateway request failed");

    if (isHttpError(error)) {
      return reply.code(error.statusCode).send({
        error: {
          code: error.code,
          message: error.message,
          details: error.details
        }
      });
    }

    return reply.code(500).send({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: error instanceof Error ? error.message : "Unexpected server error."
      }
    });
  });

  app.addHook("onClose", async () => {
    await whatsappService.close();
    await redis.quit();
    await prisma.$disconnect();
  });

  await registerRootRoutes(app);
  await registerHealthRoutes(app);
  await app.register(registerAuthRoutes, {
    prefix: "/api/v1"
  });
  await app.register(registerAgentRoutes, {
    prefix: "/api/v1"
  });
  await app.register(registerSetupRoutes, {
    prefix: "/api/v1"
  });
  await app.register(registerProviderRoutes, {
    prefix: "/api/v1"
  });
  await app.register(registerChannelRoutes, {
    prefix: "/api/v1"
  });
  await app.register(registerOverviewRoutes, {
    prefix: "/api/v1"
  });
  await app.register(registerProvisioningRoutes, {
    prefix: "/api/v1"
  });
  await app.register(registerLogRoutes, {
    prefix: "/api/v1"
  });
  await app.register(registerSessionRoutes, {
    prefix: "/api/v1"
  });
  await app.register(registerWorkspaceRoutes, {
    prefix: "/api/v1"
  });

  try {
    const ensuredWorkspace = await workspaceDomains.ensurePrimaryWorkspaceAccess();

    if (ensuredWorkspace) {
      logger.info(
        {
          slug: ensuredWorkspace.access.slug,
          publicUrl: ensuredWorkspace.access.publicUrl
        },
        "Workspace public access ensured"
      );
    }
  } catch (error) {
    logger.error({ error }, "Workspace public access bootstrap failed");
  }

  try {
    await whatsappService.bootstrap();
  } catch (error) {
    logger.error({ error }, "WhatsApp bootstrap failed during gateway startup");
  }

  return app;
}
