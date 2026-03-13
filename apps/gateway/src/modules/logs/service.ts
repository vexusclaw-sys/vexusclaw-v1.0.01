import type { FastifyBaseLogger } from "fastify";

import type { ChannelEventType } from "@vexus/db";
import type { ChannelLogListResponse } from "@vexus/shared";

import type { WhatsAppChannelService } from "../channels/whatsapp/service";

export interface LogsServiceDependencies {
  logger: FastifyBaseLogger;
  whatsapp: WhatsAppChannelService;
}

export class LogsService {
  private readonly logger: FastifyBaseLogger;
  private readonly whatsapp: WhatsAppChannelService;

  constructor(dependencies: LogsServiceDependencies) {
    this.logger = dependencies.logger;
    this.whatsapp = dependencies.whatsapp;
  }

  async listChannelLogs(
    workspaceId: string,
    filters: {
      channelConnectionId?: string;
      page: number;
      pageSize: number;
      query?: string;
      type?: ChannelEventType;
    }
  ): Promise<ChannelLogListResponse> {
    this.logger.debug({ workspaceId, ...filters }, "Listing channel logs");

    return this.whatsapp.listLogs(workspaceId, filters);
  }
}
