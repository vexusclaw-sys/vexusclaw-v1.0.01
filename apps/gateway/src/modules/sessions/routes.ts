import type { FastifyInstance } from "fastify";

import { ChannelType, SessionStatus } from "@vexus/db";

import { HttpError } from "../../app/errors";
import { apiOk } from "../../app/http";
import { sessionListQuerySchema } from "./schemas";

export async function registerSessionRoutes(app: FastifyInstance) {
  app.get("/sessions", { preHandler: app.authenticate }, async (request) => {
    const workspaceId = request.authContext?.workspaceId;

    if (!workspaceId) {
      throw new HttpError(401, "Authentication required.", "AUTH_REQUIRED");
    }

    const filters = sessionListQuerySchema.parse(request.query);
    const channelTypeMap: Record<string, ChannelType> = {
      webchat: ChannelType.WEBCHAT,
      whatsapp: ChannelType.WHATSAPP
    };
    const statusMap: Record<string, SessionStatus> = {
      closed: SessionStatus.CLOSED,
      handover_pending: SessionStatus.HANDOVER_PENDING,
      idle: SessionStatus.IDLE,
      open: SessionStatus.OPEN
    };

    return apiOk({
      ...(await app.services.conversations.listSessions(workspaceId, {
        agentId: filters.agentId,
        channelConnectionId: filters.channelConnectionId,
        channelType: filters.channelType ? channelTypeMap[filters.channelType] : undefined,
        page: filters.page,
        pageSize: filters.pageSize,
        query: filters.query,
        status: filters.status ? statusMap[filters.status] : undefined
      }))
    });
  });

  app.get("/sessions/:id", { preHandler: app.authenticate }, async (request) => {
    const workspaceId = request.authContext?.workspaceId;
    const params = request.params as { id: string };

    if (!workspaceId) {
      throw new HttpError(401, "Authentication required.", "AUTH_REQUIRED");
    }

    return apiOk(await app.services.conversations.getSessionDetails(workspaceId, params.id));
  });

  app.get("/sessions/:id/messages", { preHandler: app.authenticate }, async (request) => {
    const workspaceId = request.authContext?.workspaceId;
    const params = request.params as { id: string };

    if (!workspaceId) {
      throw new HttpError(401, "Authentication required.", "AUTH_REQUIRED");
    }

    const session = await app.services.conversations.getSessionDetails(workspaceId, params.id);

    return apiOk(session.messages);
  });
}
