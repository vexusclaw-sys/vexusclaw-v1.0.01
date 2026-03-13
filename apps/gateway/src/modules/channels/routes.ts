import type { FastifyInstance } from "fastify";

import { ChannelEventType } from "@vexus/db";

import { HttpError } from "../../app/errors";
import { apiOk } from "../../app/http";
import { channelLogQuerySchema } from "../logs/schemas";
import { createWhatsAppConnectionSchema } from "./schemas";

const channelEventTypeMap: Record<string, ChannelEventType> = {
  connected: ChannelEventType.CONNECTED,
  disconnected: ChannelEventType.DISCONNECTED,
  error: ChannelEventType.ERROR,
  inbound_message: ChannelEventType.INBOUND_MESSAGE,
  outbound_message: ChannelEventType.OUTBOUND_MESSAGE,
  qr_required: ChannelEventType.QR_REQUIRED,
  reconnecting: ChannelEventType.RECONNECTING
};

export async function registerChannelRoutes(app: FastifyInstance) {
  app.get("/channels", { preHandler: app.authenticate }, async (request) => {
    const workspaceId = request.authContext?.workspaceId;

    if (!workspaceId) {
      throw new HttpError(401, "Authentication required.", "AUTH_REQUIRED");
    }

    return apiOk({
      items: await app.services.whatsapp.list(workspaceId)
    });
  });

  app.post("/channels/whatsapp", { preHandler: app.authenticate }, async (request) => {
    const workspaceId = request.authContext?.workspaceId;

    if (!workspaceId) {
      throw new HttpError(401, "Authentication required.", "AUTH_REQUIRED");
    }

    const input = createWhatsAppConnectionSchema.parse(request.body);

    return apiOk(
      await app.services.whatsapp.createOrConnectPrimary(
        workspaceId,
        request.authContext?.sub,
        input.name
      )
    );
  });

  app.get("/channels/:id", { preHandler: app.authenticate }, async (request) => {
    const workspaceId = request.authContext?.workspaceId;
    const params = request.params as { id: string };

    if (!workspaceId) {
      throw new HttpError(401, "Authentication required.", "AUTH_REQUIRED");
    }

    return apiOk(await app.services.whatsapp.getConnection(workspaceId, params.id));
  });

  app.post("/channels/:id/reconnect", { preHandler: app.authenticate }, async (request) => {
    const workspaceId = request.authContext?.workspaceId;
    const params = request.params as { id: string };

    if (!workspaceId) {
      throw new HttpError(401, "Authentication required.", "AUTH_REQUIRED");
    }

    return apiOk(await app.services.whatsapp.reconnect(workspaceId, params.id, request.authContext?.sub));
  });

  app.post("/channels/:id/reset", { preHandler: app.authenticate }, async (request) => {
    const workspaceId = request.authContext?.workspaceId;
    const params = request.params as { id: string };

    if (!workspaceId) {
      throw new HttpError(401, "Authentication required.", "AUTH_REQUIRED");
    }

    return apiOk(await app.services.whatsapp.reset(workspaceId, params.id, request.authContext?.sub));
  });

  app.get("/channels/:id/qr", { preHandler: app.authenticate }, async (request) => {
    const workspaceId = request.authContext?.workspaceId;
    const params = request.params as { id: string };

    if (!workspaceId) {
      throw new HttpError(401, "Authentication required.", "AUTH_REQUIRED");
    }

    return apiOk(await app.services.whatsapp.getQr(workspaceId, params.id));
  });

  app.get("/channels/:id/logs", { preHandler: app.authenticate }, async (request) => {
    const workspaceId = request.authContext?.workspaceId;
    const params = request.params as { id: string };

    if (!workspaceId) {
      throw new HttpError(401, "Authentication required.", "AUTH_REQUIRED");
    }

    const filters = channelLogQuerySchema.parse(request.query);

    return apiOk(
      await app.services.logs.listChannelLogs(workspaceId, {
        channelConnectionId: params.id,
        page: filters.page,
        pageSize: filters.pageSize,
        query: filters.query,
        type: filters.type ? channelEventTypeMap[filters.type] : undefined
      })
    );
  });
}
