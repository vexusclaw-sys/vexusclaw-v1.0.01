import type { FastifyInstance } from "fastify";

import { ChannelEventType } from "@vexus/db";

import { HttpError } from "../../app/errors";
import { apiOk } from "../../app/http";
import { channelLogQuerySchema } from "./schemas";

const channelEventTypeMap: Record<string, ChannelEventType> = {
  connected: ChannelEventType.CONNECTED,
  disconnected: ChannelEventType.DISCONNECTED,
  error: ChannelEventType.ERROR,
  inbound_message: ChannelEventType.INBOUND_MESSAGE,
  outbound_message: ChannelEventType.OUTBOUND_MESSAGE,
  qr_required: ChannelEventType.QR_REQUIRED,
  reconnecting: ChannelEventType.RECONNECTING
};

export async function registerLogRoutes(app: FastifyInstance) {
  app.get("/logs/channels", { preHandler: app.authenticate }, async (request) => {
    const workspaceId = request.authContext?.workspaceId;

    if (!workspaceId) {
      throw new HttpError(401, "Authentication required.", "AUTH_REQUIRED");
    }

    const filters = channelLogQuerySchema.parse(request.query);

    return apiOk(
      await app.services.logs.listChannelLogs(workspaceId, {
        channelConnectionId: filters.channelConnectionId,
        page: filters.page,
        pageSize: filters.pageSize,
        query: filters.query,
        type: filters.type ? channelEventTypeMap[filters.type] : undefined
      })
    );
  });
}
