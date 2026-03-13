import { access, mkdir, rm } from "node:fs/promises";
import path from "node:path";

import { Boom } from "@hapi/boom";
import NodeCache from "@cacheable/node-cache";
import {
  Browsers,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeWASocket,
  makeCacheableSignalKeyStore,
  type CacheStore,
  type GroupMetadata,
  useMultiFileAuthState,
  type ConnectionState,
  type WASocket,
  type WAMessage
} from "@whiskeysockets/baileys";
import type { FastifyBaseLogger } from "fastify";
import QRCode from "qrcode";

import type { VexusEnv } from "@vexus/config";
import {
  AgentStatus,
  ChannelEventType,
  ChannelStatus,
  ChannelType
} from "@vexus/db";
import type { Prisma, PrismaClient } from "@vexus/db";
import {
  type ChannelQueueJobData,
  channelJobNames,
  createJobOptions,
  createQueue,
  createQueueEvents,
  createWorker,
  queueNames,
  type VexusJob,
  type VexusQueue,
  type VexusQueueEvents,
  type VexusWorker,
  type WhatsAppHealthJobData,
  type WhatsAppOutboundJobData,
  type WhatsAppReconnectJobData
} from "@vexus/queue";
import type {
  ChannelConnectionDetails,
  ChannelEventLogItem,
  ChannelLogListResponse
} from "@vexus/shared";

import type { WhatsAppInboundInput } from "../../conversations/service";
import { HttpError } from "../../../app/errors";
import {
  serializeChannelConnection,
  serializeChannelEventLog
} from "../../../lib/serializers";

const INBOUND_MESSAGE_DEDUPE_TTL_MS = 10 * 60 * 1000;
const GROUP_MENTION_ALIAS_CACHE_TTL_MS = 5 * 60 * 1000;
const GROUP_METADATA_CACHE_TTL_MS = 5 * 60 * 1000;
const BAILEYS_GROUP_METADATA_CACHE_TTL_MS = 5 * 60 * 1000;
const BAILEYS_MSG_RETRY_CACHE_TTL_MS = 60 * 60 * 1000;
const BAILEYS_SIGNAL_KEY_CACHE_TTL_MS = 5 * 60 * 1000;
const BAILEYS_USER_DEVICES_CACHE_TTL_MS = 5 * 60 * 1000;

type GroupActivationMode = "always" | "mention";
type GroupTriggerReason =
  | "activation_always"
  | "e164"
  | "native_mention"
  | "pattern"
  | "reply_to_bot";

type GroupTargetAgent = {
  aliases: string[];
  id: string;
  isDefault: boolean;
  name: string;
  patterns: Array<{
    regex: RegExp;
    source: string;
  }>;
  slug: string;
};

type GroupRoutingConfig = {
  activationMode: GroupActivationMode;
  allowedGroupJids: Set<string> | null;
  defaultAgentId?: string;
  defaultAgentSlug?: string;
  targets: GroupTargetAgent[];
};

type GroupTriggerDecision = {
  activationMode: GroupActivationMode;
  commandContent?: string;
  matched: boolean;
  targetAgentId?: string;
  targetAgentSlug?: string;
  triggerReason?: GroupTriggerReason;
};

type RuntimeSocketState = {
  authDir: string;
  baileysGroupMetadataCache: NodeCache<GroupMetadata>;
  instanceId: string;
  msgRetryCounterCache: NodeCache<unknown>;
  signalKeyCache: NodeCache<unknown>;
  socket: WASocket;
  userDevicesCache: NodeCache<unknown>;
};

type WhatsAppMessageUpsert = {
  messages: WAMessage[];
  type: string;
};

export interface WhatsAppChannelServiceDependencies {
  env: VexusEnv;
  logger: FastifyBaseLogger;
  prisma: PrismaClient;
}

export class WhatsAppChannelService {
  private readonly env: VexusEnv;
  private readonly logger: FastifyBaseLogger;
  private readonly prisma: PrismaClient;
  private readonly sockets = new Map<string, RuntimeSocketState>();
  private readonly reconnectAttempts = new Map<string, number>();
  private readonly inboundMessageCache = new Map<string, number>();
  private readonly groupMetadataCache = new Map<string, { expiresAt: number; subject?: string }>();
  private readonly groupRoutingCache = new Map<string, { config: GroupRoutingConfig; expiresAt: number }>();
  private readonly startupPromises = new Map<string, Promise<void>>();
  private readonly channelQueue: VexusQueue<ChannelQueueJobData>;
  private readonly channelQueueEvents: VexusQueueEvents;
  private channelWorker: VexusWorker<ChannelQueueJobData> | null = null;
  private inboundHandler: ((input: WhatsAppInboundInput) => Promise<void>) | null = null;
  private runtimeCounter = 0;
  private workerReady = false;

  constructor(dependencies: WhatsAppChannelServiceDependencies) {
    this.env = dependencies.env;
    this.logger = dependencies.logger;
    this.prisma = dependencies.prisma;
    this.channelQueue = createQueue<ChannelQueueJobData>(queueNames.channels);
    this.channelQueueEvents = createQueueEvents(queueNames.channels);
  }

  setInboundHandler(handler: (input: WhatsAppInboundInput) => Promise<void>): void {
    this.inboundHandler = handler;
  }

  async bootstrap(): Promise<void> {
    await this.ensureWorkersReady();

    const connections = await this.prisma.channelConnection.findMany({
      where: {
        deletedAt: null,
        type: ChannelType.WHATSAPP
      }
    });

    for (const connection of connections) {
      const authDir = this.resolveAuthDirectory(connection.id);
      const authExists = await this.pathExists(authDir);

      if (!authExists) {
        continue;
      }

      if (
        connection.status === ChannelStatus.CONNECTED ||
        connection.status === ChannelStatus.CONNECTING ||
        connection.status === ChannelStatus.QR_REQUIRED
      ) {
        try {
          await this.startRuntime(connection.id, {
            force: true,
            reason: "bootstrap"
          });
          await this.scheduleHealthCheck(connection.id, "bootstrap");
        } catch (error) {
          this.logger.error({ connectionId: connection.id, error }, "Failed to bootstrap WhatsApp runtime");
        }
      }
    }
  }

  async close(): Promise<void> {
    await Promise.all(Array.from(this.sockets.keys()).map((connectionId) => this.disposeRuntime(connectionId, false)));

    if (this.channelWorker) {
      await this.channelWorker.close();
      this.channelWorker = null;
    }

    await Promise.all([
      this.channelQueueEvents.close(),
      this.channelQueue.close()
    ]);

    this.workerReady = false;
  }

  async list(workspaceId: string): Promise<ChannelConnectionDetails[]> {
    const channels = await this.prisma.channelConnection.findMany({
      where: {
        workspaceId,
        deletedAt: null
      },
      include: {
        eventLogs: {
          orderBy: {
            createdAt: "desc"
          },
          take: 6
        }
      },
      orderBy: [
        {
          isPrimary: "desc"
        },
        {
          updatedAt: "desc"
        }
      ]
    });

    return channels.map((channel) => serializeChannelConnection(channel));
  }

  async listLogs(
    workspaceId: string,
    filters: {
      channelConnectionId?: string;
      page: number;
      pageSize: number;
      query?: string;
      type?: ChannelEventType;
    }
  ): Promise<ChannelLogListResponse> {
    const page = Math.max(filters.page, 1);
    const pageSize = Math.min(Math.max(filters.pageSize, 1), 50);
    const query = filters.query?.trim();
    const where = {
      channelConnectionId: filters.channelConnectionId,
      message: query
        ? {
            contains: query,
            mode: "insensitive" as const
          }
        : undefined,
      type: filters.type,
      workspaceId
    } satisfies Prisma.ChannelEventLogWhereInput;

    const [total, logs] = await this.prisma.$transaction([
      this.prisma.channelEventLog.count({
        where
      }),
      this.prisma.channelEventLog.findMany({
        where,
        include: {
          channelConnection: {
            select: {
              id: true,
              name: true,
              type: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        },
        skip: (page - 1) * pageSize,
        take: pageSize
      })
    ]);

    return {
      hasNextPage: page * pageSize < total,
      items: logs.map((log) => serializeChannelEventLog(log)),
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize))
    };
  }

  async createOrConnectPrimary(
    workspaceId: string,
    actorUserId?: string,
    name = "VEXUSCLAW WhatsApp"
  ): Promise<ChannelConnectionDetails> {
    const connection = await this.ensurePrimaryConnection(workspaceId, name);
    await this.startRuntime(connection.id, {
      actorUserId,
      force: true,
      reason: "connect"
    });
    await this.scheduleHealthCheck(connection.id, "connect");

    return this.getConnection(workspaceId, connection.id);
  }

  async reconnect(
    workspaceId: string,
    connectionId: string,
    actorUserId?: string
  ): Promise<ChannelConnectionDetails> {
    const connection = await this.prisma.channelConnection.findFirst({
      where: {
        id: connectionId,
        workspaceId,
        type: ChannelType.WHATSAPP,
        deletedAt: null
      }
    });

    if (!connection) {
      throw new HttpError(404, "WhatsApp connection not found.", "CHANNEL_NOT_FOUND");
    }

    await this.appendEventLog(connection.id, ChannelEventType.RECONNECTING, "Manual reconnect requested.", {
      actorUserId
    });

    await this.startRuntime(connection.id, {
      actorUserId,
      force: true,
      reason: "manual_reconnect"
    });
    await this.scheduleHealthCheck(connection.id, "manual_reconnect");

    return this.getConnection(workspaceId, connection.id);
  }

  async reset(
    workspaceId: string,
    connectionId: string,
    actorUserId?: string
  ): Promise<ChannelConnectionDetails> {
    const connection = await this.prisma.channelConnection.findFirst({
      where: {
        id: connectionId,
        workspaceId,
        type: ChannelType.WHATSAPP,
        deletedAt: null
      }
    });

    if (!connection) {
      throw new HttpError(404, "WhatsApp connection not found.", "CHANNEL_NOT_FOUND");
    }

    await this.cancelMaintenanceJobs(connectionId);
    await this.disposeRuntime(connectionId, true);
    this.reconnectAttempts.delete(connectionId);

    await rm(this.resolveAuthDirectory(connectionId), {
      force: true,
      recursive: true
    }).catch(() => undefined);

    await this.updateConnectionState(connectionId, {
      lastActivityAt: new Date(),
      lastError: null,
      qrCodeData: null,
      qrExpiresAt: null,
      sessionStatePatch: {
        lastResetAt: new Date().toISOString(),
        lifecycle: "disconnected",
        runtime: "baileys"
      },
      status: ChannelStatus.DISCONNECTED
    });

    await this.appendEventLog(connectionId, ChannelEventType.DISCONNECTED, "Manual WhatsApp reset completed.", {
      actorUserId,
      action: "manual_reset"
    });

    return this.getConnection(workspaceId, connectionId);
  }

  async getConnection(workspaceId: string, connectionId: string): Promise<ChannelConnectionDetails> {
    const connection = await this.prisma.channelConnection.findFirst({
      where: {
        id: connectionId,
        workspaceId,
        deletedAt: null
      },
      include: {
        eventLogs: {
          orderBy: {
            createdAt: "desc"
          },
          take: 10
        }
      }
    });

    if (!connection) {
      throw new HttpError(404, "Channel connection not found.", "CHANNEL_NOT_FOUND");
    }

    if (
      connection.type === ChannelType.WHATSAPP &&
      connection.status === ChannelStatus.QR_REQUIRED &&
      connection.qrExpiresAt &&
      connection.qrExpiresAt <= new Date()
    ) {
      await this.startRuntime(connection.id, {
        force: true,
        reason: "qr_expired"
      });

      return this.getConnection(workspaceId, connection.id);
    }

    return serializeChannelConnection(connection);
  }

  async getQr(workspaceId: string, connectionId: string): Promise<{
    id: string;
    status: string;
    qrCodeData: string | null;
    qrExpiresAt: string | null;
    recentLogs: ChannelEventLogItem[];
  }> {
    const connection = await this.prisma.channelConnection.findFirst({
      where: {
        id: connectionId,
        workspaceId,
        type: ChannelType.WHATSAPP,
        deletedAt: null
      },
      include: {
        eventLogs: {
          orderBy: {
            createdAt: "desc"
          },
          take: 10
        }
      }
    });

    if (!connection) {
      throw new HttpError(404, "WhatsApp connection not found.", "CHANNEL_NOT_FOUND");
    }

    if (connection.qrExpiresAt && connection.qrExpiresAt <= new Date()) {
      await this.startRuntime(connection.id, {
        force: true,
        reason: "qr_refresh"
      });

      return this.getQr(workspaceId, connectionId);
    }

    return {
      id: connection.id,
      qrCodeData: connection.qrCodeData,
      qrExpiresAt: connection.qrExpiresAt?.toISOString() ?? null,
      recentLogs: connection.eventLogs.map((log) => serializeChannelEventLog(log)),
      status: connection.status.toLowerCase()
    };
  }

  async sendText(input: {
    assistantMessageId: string;
    connectionId: string;
    content: string;
    externalConversationId?: string;
    externalUserId: string;
    idempotencyKey: string;
    metadata?: Record<string, unknown>;
  }): Promise<{
    jobId: string;
  }> {
    await this.ensureWorkersReady();

    const jobId = `whatsapp:outbound:${input.idempotencyKey}`;
    const existingMessage = await this.prisma.message.findUnique({
      where: {
        id: input.assistantMessageId
      },
      select: {
        payload: true
      }
    });

    const deliveryStatus = (existingMessage?.payload as Record<string, unknown> | null)?.deliveryStatus;

    if (deliveryStatus === "sent") {
      return {
        jobId
      };
    }

    const existingJob = await this.channelQueue.getJob(jobId);

    if (!existingJob) {
      await this.channelQueue.add(
        channelJobNames.whatsappOutbound,
        {
          assistantMessageId: input.assistantMessageId,
          connectionId: input.connectionId,
          content: input.content,
          externalConversationId: input.externalConversationId,
          externalUserId: input.externalUserId,
          idempotencyKey: input.idempotencyKey,
          metadata: input.metadata
        },
        createJobOptions({
          attempts: 3,
          backoff: {
            delay: 2_000,
            type: "exponential"
          },
          jobId
        })
      );
    }

    return {
      jobId
    };
  }

  async ensurePrimaryConnection(workspaceId: string, name = "VEXUSCLAW WhatsApp") {
    const existing = await this.prisma.channelConnection.findFirst({
      where: {
        workspaceId,
        type: ChannelType.WHATSAPP,
        deletedAt: null
      }
    });

    const defaultAgent = await this.prisma.agent.findFirst({
      where: {
        workspaceId,
        isDefault: true,
        deletedAt: null,
        status: AgentStatus.ACTIVE
      }
    });

    if (existing) {
      const updated = await this.prisma.channelConnection.update({
        where: {
          id: existing.id
        },
        data: {
          config: {
            ...(existing.config as Record<string, unknown> | null),
            library: "baileys",
            transport: "whatsapp"
          },
          defaultAgentId: existing.defaultAgentId ?? defaultAgent?.id,
          isPrimary: true,
          lastError: null,
          name
        }
      });

      await this.prisma.channelConnection.updateMany({
        where: {
          workspaceId,
          id: {
            not: updated.id
          },
          deletedAt: null
        },
        data: {
          isPrimary: false
        }
      });

      return updated;
    }

    await this.prisma.channelConnection.updateMany({
      where: {
        workspaceId,
        deletedAt: null
      },
      data: {
        isPrimary: false
      }
    });

    return this.prisma.channelConnection.create({
      data: {
        config: {
          library: "baileys",
          transport: "whatsapp"
        },
        defaultAgentId: defaultAgent?.id,
        externalId: `wa_${workspaceId.slice(0, 8)}`,
        isPrimary: true,
        name,
        status: ChannelStatus.DISCONNECTED,
        type: ChannelType.WHATSAPP,
        workspaceId
      }
    });
  }

  private async ensureWorkersReady(): Promise<void> {
    if (this.workerReady) {
      return;
    }

    this.channelWorker = createWorker<ChannelQueueJobData>(
      queueNames.channels,
      async (job) => this.processChannelJob(job),
      {
        concurrency: 4
      }
    );

    await Promise.all([
      this.channelQueue.waitUntilReady(),
      this.channelQueueEvents.waitUntilReady(),
      this.channelWorker.waitUntilReady()
    ]);

    this.workerReady = true;
  }

  private async processChannelJob(job: VexusJob<ChannelQueueJobData>) {
    switch (job.name) {
      case channelJobNames.whatsappOutbound:
        return this.processOutboundJob(job as VexusJob<WhatsAppOutboundJobData>);
      case channelJobNames.whatsappReconnect:
        return this.processReconnectJob(job as VexusJob<WhatsAppReconnectJobData>);
      case channelJobNames.whatsappHealth:
        return this.processHealthJob(job as VexusJob<WhatsAppHealthJobData>);
      default:
        this.logger.warn({ jobId: job.id, jobName: job.name }, "Ignoring unknown channel queue job");
        return null;
    }
  }

  private async processOutboundJob(job: VexusJob<WhatsAppOutboundJobData>) {
    const attempt = job.attemptsMade + 1;

    try {
      const deliveryResult = await this.deliverOutboundMessage(job.data, attempt);
      await this.scheduleHealthCheck(job.data.connectionId, "outbound_delivery");
      return deliveryResult;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to send outbound WhatsApp message.";
      const finalAttempt = attempt >= (job.opts.attempts ?? 1);

      await this.updateMessageDelivery(job.data.assistantMessageId, {
        deliveryStatus: finalAttempt ? "failed" : "retrying",
        lastAttemptAt: new Date().toISOString(),
        lastError: message,
        retryAttempt: attempt
      });

      await this.updateConnectionState(job.data.connectionId, {
        lastActivityAt: new Date(),
        lastError: message
      });

      await this.appendEventLog(job.data.connectionId, ChannelEventType.ERROR, message, {
        assistantMessageId: job.data.assistantMessageId,
        attempt,
        direction: "outbound",
        finalAttempt
      });

      throw error;
    }
  }

  private async processReconnectJob(job: VexusJob<WhatsAppReconnectJobData>) {
    await this.startRuntime(job.data.connectionId, {
      actorUserId: job.data.actorUserId,
      force: true,
      reason: job.data.reason
    });
    await this.scheduleHealthCheck(job.data.connectionId, "reconnect_job");

    return {
      connectionId: job.data.connectionId,
      reconnected: true
    };
  }

  private async processHealthJob(job: VexusJob<WhatsAppHealthJobData>) {
    const connection = await this.prisma.channelConnection.findFirst({
      where: {
        id: job.data.connectionId,
        type: ChannelType.WHATSAPP,
        deletedAt: null
      }
    });

    if (!connection || connection.status === ChannelStatus.DISCONNECTED || connection.status === ChannelStatus.ERROR) {
      return {
        healthy: false,
        skipped: true
      };
    }

    const runtime = this.sockets.get(connection.id);

    if (connection.status === ChannelStatus.QR_REQUIRED && connection.qrExpiresAt && connection.qrExpiresAt <= new Date()) {
      await this.appendEventLog(connection.id, ChannelEventType.QR_REQUIRED, "Refreshing expired WhatsApp QR code.", {
        reason: job.data.reason
      });

      await this.startRuntime(connection.id, {
        force: true,
        reason: "health_qr_refresh"
      });
      await this.scheduleHealthCheck(connection.id, "health_qr_refresh");

      return {
        healthy: true,
        refreshedQr: true
      };
    }

    if (!runtime) {
      await this.appendEventLog(connection.id, ChannelEventType.ERROR, "WhatsApp health check detected a missing runtime socket.", {
        reason: job.data.reason,
        status: connection.status.toLowerCase()
      });

      await this.enqueueReconnectJob(connection.id, {
        attempt: this.reconnectAttempts.get(connection.id) ?? 0,
        reason: "health_recover"
      });

      return {
        healthy: false,
        scheduledReconnect: true
      };
    }

    await this.scheduleHealthCheck(connection.id, "health_heartbeat");

    return {
      healthy: true
    };
  }

  private async deliverOutboundMessage(
    input: WhatsAppOutboundJobData,
    attempt: number
  ): Promise<{
    externalMessageId: string | null;
  }> {
    const message = await this.prisma.message.findUnique({
      where: {
        id: input.assistantMessageId
      },
      select: {
        externalMessageId: true,
        payload: true
      }
    });

    const deliveryStatus = (message?.payload as Record<string, unknown> | null)?.deliveryStatus;

    if (message?.externalMessageId || deliveryStatus === "sent") {
      return {
        externalMessageId: message?.externalMessageId ?? null
      };
    }

    const runtime = await this.ensureActiveRuntime(input.connectionId);
    const targetJid = input.externalConversationId ?? input.externalUserId;
    const outboundMessage = await this.sendTextWithRuntimeRecovery(runtime, input.connectionId, targetJid, input.content);
    const externalMessageId = outboundMessage?.key.id ?? null;

    await this.updateMessageDelivery(
      input.assistantMessageId,
      {
        deliveredAt: new Date().toISOString(),
        deliveryStatus: "sent",
        queueJobId: `whatsapp:outbound:${input.idempotencyKey}`,
        retryAttempt: attempt
      },
      externalMessageId
    );

    await this.updateConnectionState(input.connectionId, {
      lastActivityAt: new Date(),
      lastError: null
    });

    await this.appendEventLog(input.connectionId, ChannelEventType.OUTBOUND_MESSAGE, "Outbound WhatsApp message sent.", {
      assistantMessageId: input.assistantMessageId,
      attempt,
      externalMessageId,
      ...input.metadata
    });

    return {
      externalMessageId
    };
  }

  private async startRuntime(
    connectionId: string,
    options: {
      actorUserId?: string;
      force?: boolean;
      reason: string;
    }
  ): Promise<void> {
    const pendingStart = this.startupPromises.get(connectionId);

    if (pendingStart) {
      await pendingStart.catch(() => undefined);

      if (!options.force) {
        return;
      }
    }

    const startPromise = this.startRuntimeInternal(connectionId, options);
    this.startupPromises.set(connectionId, startPromise);

    try {
      await startPromise;
    } finally {
      if (this.startupPromises.get(connectionId) === startPromise) {
        this.startupPromises.delete(connectionId);
      }
    }
  }

  private async startRuntimeInternal(
    connectionId: string,
    options: {
      actorUserId?: string;
      force?: boolean;
      reason: string;
    }
  ): Promise<void> {
    const connection = await this.prisma.channelConnection.findFirst({
      where: {
        id: connectionId,
        type: ChannelType.WHATSAPP,
        deletedAt: null
      }
    });

    if (!connection) {
      throw new HttpError(404, "WhatsApp connection not found.", "CHANNEL_NOT_FOUND");
    }

    if (options.force) {
      await this.disposeRuntime(connectionId, false);
    } else if (this.sockets.has(connectionId)) {
      return;
    }

    if (options.reason !== "auto_reconnect") {
      this.reconnectAttempts.set(connectionId, 0);
    }

    const authDir = this.resolveAuthDirectory(connectionId);
    await mkdir(authDir, {
      recursive: true
    });

    await this.updateConnectionState(connectionId, {
      lastError: null,
      sessionStatePatch: {
        authDir,
        lifecycle: "connecting",
        runtime: "baileys"
      },
      status: ChannelStatus.CONNECTING
    });

    if (options.reason !== "bootstrap") {
      await this.appendEventLog(connectionId, ChannelEventType.RECONNECTING, "WhatsApp runtime starting.", {
        actorUserId: options.actorUserId,
        reason: options.reason
      });
    }

    const { state, saveCreds } = await useMultiFileAuthState(authDir);
    let version: [number, number, number] | undefined;

    try {
      ({ version } = await fetchLatestBaileysVersion());
    } catch (error) {
      this.logger.warn(
        { connectionId, error },
        "Failed to fetch latest Baileys version. Falling back to bundled defaults."
      );
    }

    const instanceId = `${Date.now()}-${this.runtimeCounter += 1}`;
    const runtimeLogger = this.logger.child({
      channelConnectionId: connectionId,
      runtimeInstanceId: instanceId,
      service: "whatsapp-runtime"
    });
    const signalKeyCache = this.createBaileysCache<unknown>(BAILEYS_SIGNAL_KEY_CACHE_TTL_MS);
    const userDevicesCache = this.createBaileysCache<unknown>(BAILEYS_USER_DEVICES_CACHE_TTL_MS);
    const msgRetryCounterCache = this.createBaileysCache<unknown>(BAILEYS_MSG_RETRY_CACHE_TTL_MS);
    const baileysGroupMetadataCache = this.createBaileysCache<GroupMetadata>(BAILEYS_GROUP_METADATA_CACHE_TTL_MS);

    const socket = makeWASocket({
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, runtimeLogger, signalKeyCache as unknown as CacheStore)
      },
      browser: Browsers.macOS("VEXUSCLAW"),
      logger: runtimeLogger,
      markOnlineOnConnect: false,
      printQRInTerminal: false,
      syncFullHistory: false,
      version
    });

    const runtimeState: RuntimeSocketState = {
      authDir,
      baileysGroupMetadataCache,
      instanceId,
      msgRetryCounterCache,
      signalKeyCache,
      socket,
      userDevicesCache
    };

    this.sockets.set(connectionId, runtimeState);

    socket.ev.on("creds.update", async () => {
      await saveCreds();
    });

    socket.ev.on("connection.update", async (update) => {
      await this.handleConnectionUpdate(connectionId, instanceId, update);
    });

    socket.ev.on("messages.upsert", async (upsert) => {
      await this.handleMessagesUpsert(connectionId, instanceId, upsert);
    });

    socket.ev.on("groups.upsert", async (updates) => {
      if (!this.isCurrentRuntime(connectionId, instanceId)) {
        return;
      }

      this.cacheBaileysGroupMetadata(connectionId, updates, runtimeState ?? this.sockets.get(connectionId)!);
    });

    socket.ev.on("groups.update", async (updates) => {
      if (!this.isCurrentRuntime(connectionId, instanceId)) {
        return;
      }

      this.cacheBaileysGroupMetadata(connectionId, updates, runtimeState ?? this.sockets.get(connectionId)!);
    });

    socket.ev.on("group-participants.update", async ({ id }) => {
      if (!this.isCurrentRuntime(connectionId, instanceId)) {
        return;
      }

      this.invalidateBaileysGroupMetadata(connectionId, id, runtimeState ?? this.sockets.get(connectionId)!);
    });

    const socketWithEvents = socket.ws as unknown as {
      on?: (event: string, listener: (error: Error) => void) => void;
    };

    if (typeof socketWithEvents.on === "function") {
      socketWithEvents.on("error", (error: Error) => {
        runtimeLogger.error({ error }, "WhatsApp socket websocket error");
      });
    }
  }

  private createBaileysCache<T>(ttlMs: number): NodeCache<T> {
    return new NodeCache<T>({
      deleteOnExpire: true,
      stdTTL: Math.max(1, Math.ceil(ttlMs / 1000)),
      useClones: false
    });
  }

  private async sendTextWithRuntimeRecovery(
    runtime: RuntimeSocketState,
    connectionId: string,
    targetJid: string,
    content: string
  ): Promise<WAMessage | undefined> {
    try {
      return await runtime.socket.sendMessage(targetJid, {
        text: content
      });
    } catch (error) {
      if (!this.isRecoverableGroupSessionError(targetJid, error)) {
        throw error;
      }

      this.logger.warn(
        {
          connectionId,
          error,
          targetJid
        },
        "Recovering WhatsApp group session after outbound failure"
      );

      await this.recoverGroupSendState(connectionId, targetJid, runtime);
      await this.startRuntime(connectionId, {
        force: true,
        reason: "group_session_recovery"
      });

      const recoveredRuntime = await this.ensureActiveRuntime(connectionId);

      return recoveredRuntime.socket.sendMessage(targetJid, {
        text: content
      });
    }
  }

  private isRecoverableGroupSessionError(targetJid: string, error: unknown): boolean {
    if (!this.isGroupJid(targetJid) || !(error instanceof Error)) {
      return false;
    }

    return /no sessions?/i.test(error.message);
  }

  private async recoverGroupSendState(
    connectionId: string,
    groupJid: string,
    runtime: RuntimeSocketState
  ): Promise<void> {
    this.invalidateBaileysGroupMetadata(connectionId, groupJid, runtime);
    runtime.msgRetryCounterCache.flushAll();
    runtime.signalKeyCache.flushAll();
    runtime.userDevicesCache.flushAll();

    await runtime.socket.authState.keys.set({
      "sender-key-memory": {
        [groupJid]: null
      }
    });
  }

  private async loadRetryableMessage(
    _workspaceId: string,
    _key: unknown
  ): Promise<undefined> {
    return undefined;
  }

  private async resolveBaileysGroupMetadata(
    connectionId: string,
    groupJid: string,
    runtime: RuntimeSocketState,
    forceRefresh = false
  ): Promise<GroupMetadata | undefined> {
    const normalizedGroupJid = this.normalizeAddressingJid(groupJid);

    if (!normalizedGroupJid) {
      return undefined;
    }

    if (forceRefresh) {
      this.invalidateBaileysGroupMetadata(connectionId, normalizedGroupJid, runtime);
    } else {
      const cached = runtime.baileysGroupMetadataCache.get(normalizedGroupJid);

      if (cached) {
        return cached;
      }
    }

    try {
      const metadata = await runtime.socket.groupMetadata(normalizedGroupJid);
      this.cacheBaileysGroupMetadata(connectionId, [metadata], runtime);
      return metadata;
    } catch (error) {
      this.logger.debug(
        { connectionId, error, groupJid: normalizedGroupJid },
        "Unable to resolve WhatsApp group metadata for outbound send"
      );
      return undefined;
    }
  }

  private cacheBaileysGroupMetadata(
    connectionId: string,
    updates: Array<Partial<GroupMetadata>>,
    runtime: RuntimeSocketState
  ): void {
    for (const update of updates) {
      const groupJid = this.normalizeAddressingJid(this.readString(update.id));

      if (!groupJid) {
        continue;
      }

      const cached = runtime.baileysGroupMetadataCache.get(groupJid);
      const merged = {
        ...(cached ?? {}),
        ...update
      } as GroupMetadata;

      runtime.baileysGroupMetadataCache.set(groupJid, merged);
      this.groupMetadataCache.set(`${connectionId}:${groupJid}`, {
        expiresAt: Date.now() + GROUP_METADATA_CACHE_TTL_MS,
        subject: this.readString(merged.subject) ?? undefined
      });
    }
  }

  private invalidateBaileysGroupMetadata(
    connectionId: string,
    groupJid: string,
    runtime: RuntimeSocketState
  ): void {
    const normalizedGroupJid = this.normalizeAddressingJid(groupJid);

    if (!normalizedGroupJid) {
      return;
    }

    runtime.baileysGroupMetadataCache.del(normalizedGroupJid);
    this.groupMetadataCache.delete(`${connectionId}:${normalizedGroupJid}`);
  }

  private async ensureActiveRuntime(connectionId: string): Promise<RuntimeSocketState> {
    const existing = this.sockets.get(connectionId);

    if (existing) {
      return existing;
    }

    await this.startRuntime(connectionId, {
      force: false,
      reason: "lazy_send"
    });

    const created = this.sockets.get(connectionId);

    if (!created) {
      throw new HttpError(503, "WhatsApp runtime is unavailable.", "WHATSAPP_RUNTIME_UNAVAILABLE");
    }

    return created;
  }

  private async handleConnectionUpdate(
    connectionId: string,
    instanceId: string,
    update: Partial<ConnectionState>
  ): Promise<void> {
    if (!this.isCurrentRuntime(connectionId, instanceId)) {
      return;
    }

    const runtime = this.sockets.get(connectionId);

    if (update.qr) {
      const qrCodeData = await QRCode.toDataURL(update.qr, {
        margin: 1,
        width: 320
      });
      const qrExpiresAt = new Date(Date.now() + this.env.WHATSAPP_QR_TTL_MINUTES * 60 * 1000);

      await this.updateConnectionState(connectionId, {
        lastActivityAt: new Date(),
        lastError: null,
        qrCodeData,
        qrExpiresAt,
        sessionStatePatch: {
          authDir: runtime?.authDir,
          lifecycle: "qr_required",
          runtime: "baileys"
        },
        status: ChannelStatus.QR_REQUIRED
      });

      await this.appendEventLog(connectionId, ChannelEventType.QR_REQUIRED, "WhatsApp QR code is required.", {
        expiresAt: qrExpiresAt.toISOString()
      });
      await this.scheduleHealthCheck(connectionId, "qr_required");
    }

    if (update.connection === "open") {
      await this.updateConnectionState(connectionId, {
        lastActivityAt: new Date(),
        lastConnectedAt: new Date(),
        lastError: null,
        qrCodeData: null,
        qrExpiresAt: null,
        sessionStatePatch: {
          authDir: runtime?.authDir,
          lifecycle: "connected",
          meId: runtime?.socket.user?.id ?? null,
          meLid: this.readString(this.asRecord(runtime?.socket.authState.creds.me)?.lid),
          meName: this.readString(this.asRecord(runtime?.socket.user)?.name),
          runtime: "baileys"
        },
        status: ChannelStatus.CONNECTED
      });

      this.reconnectAttempts.set(connectionId, 0);

      await this.appendEventLog(connectionId, ChannelEventType.CONNECTED, "WhatsApp session connected.", {
        meId: runtime?.socket.user?.id ?? null,
        meLid: this.readString(this.asRecord(runtime?.socket.authState.creds.me)?.lid)
      });
      await this.scheduleHealthCheck(connectionId, "connected");

      return;
    }

    if (update.connection === "close") {
      const boomError = update.lastDisconnect?.error
        ? new Boom(update.lastDisconnect.error as Error)
        : null;
      const statusCode = boomError?.output?.statusCode;
      const currentAttempt = this.reconnectAttempts.get(connectionId) ?? 0;
      const shouldReconnect =
        statusCode !== DisconnectReason.loggedOut &&
        currentAttempt < this.env.WHATSAPP_MAX_RECONNECT_ATTEMPTS;

      await this.disposeRuntime(connectionId, false, instanceId);

      if (shouldReconnect) {
        const nextAttempt = currentAttempt + 1;
        this.reconnectAttempts.set(connectionId, nextAttempt);

        await this.updateConnectionState(connectionId, {
          lastActivityAt: new Date(),
          lastError: boomError?.message ?? null,
          sessionStatePatch: {
            lifecycle: "reconnecting",
            reconnectAttempt: nextAttempt
          },
          status: ChannelStatus.CONNECTING
        });

        await this.appendEventLog(connectionId, ChannelEventType.RECONNECTING, "WhatsApp runtime reconnecting.", {
          attempt: nextAttempt,
          reason: boomError?.message ?? null,
          statusCode
        });

        await this.enqueueReconnectJob(connectionId, {
          attempt: nextAttempt,
          reason: "auto_reconnect"
        });

        return;
      }

      if (statusCode === DisconnectReason.loggedOut) {
        await rm(this.resolveAuthDirectory(connectionId), {
          force: true,
          recursive: true
        }).catch(() => undefined);
      }

      await this.updateConnectionState(connectionId, {
        lastActivityAt: new Date(),
        lastError: boomError?.message ?? null,
        qrCodeData: null,
        qrExpiresAt: null,
        sessionStatePatch: {
          lifecycle: statusCode === DisconnectReason.loggedOut ? "disconnected" : "error"
        },
        status:
          statusCode === DisconnectReason.loggedOut
            ? ChannelStatus.DISCONNECTED
            : ChannelStatus.ERROR
      });

      this.reconnectAttempts.delete(connectionId);

      await this.appendEventLog(
        connectionId,
        statusCode === DisconnectReason.loggedOut
          ? ChannelEventType.DISCONNECTED
          : ChannelEventType.ERROR,
        statusCode === DisconnectReason.loggedOut
          ? "WhatsApp session disconnected."
          : boomError?.message ?? "WhatsApp runtime closed unexpectedly.",
        {
          statusCode
        }
      );
    }
  }

  private async handleMessagesUpsert(
    connectionId: string,
    instanceId: string,
    upsert: WhatsAppMessageUpsert
  ): Promise<void> {
    if (!this.isCurrentRuntime(connectionId, instanceId) || upsert.type !== "notify") {
      return;
    }

    const runtime = this.sockets.get(connectionId);
    const botAddresses = this.resolveBotAddresses(runtime);
    const botJid = botAddresses.find((jid) => jid.endsWith("@s.whatsapp.net")) ?? botAddresses[0];
    const botE164 = this.extractNumericJidLocal(botJid);

    for (const message of upsert.messages) {
      const content = this.extractMessageText(message);

      if (!content) {
        continue;
      }

      const triggerDecision = await this.evaluateMessageTrigger(
        connectionId,
        message,
        content,
        botAddresses,
        botE164,
        runtime
      );

      if (!triggerDecision.matched) {
        if (this.isGroupJid(message.key.remoteJid)) {
          this.logger.info(
            {
              botAddresses,
              connectionId,
              contentPreview: content.slice(0, 160),
              mentionedJids: this.extractMentionedJids(message),
              participantJid: this.normalizeAddressingJid(message.key.participant),
              remoteJid: this.normalizeAddressingJid(message.key.remoteJid)
            },
            "Ignoring WhatsApp group message because no trigger matched"
          );
        }

        continue;
      }

      const remoteJid = this.normalizeAddressingJid(message.key.remoteJid);
      const participantJid = this.normalizeAddressingJid(message.key.participant);
      const isGroupMessage = this.isGroupJid(message.key.remoteJid);
      const externalConversationId = remoteJid;
      const externalUserId = isGroupMessage ? (participantJid ?? remoteJid) : remoteJid;
      const messageId = message.key.id ?? undefined;
      const inboundContent = triggerDecision.commandContent?.trim() || content;
      const groupSubject =
        isGroupMessage && externalConversationId
          ? await this.resolveGroupSubject(connectionId, externalConversationId, runtime)
          : undefined;

      if (!externalUserId || !externalConversationId) {
        continue;
      }

      if (messageId && this.seenInboundMessage(connectionId, messageId)) {
        continue;
      }

      if (messageId) {
        this.rememberInboundMessage(connectionId, messageId);
      }

      await this.updateConnectionState(connectionId, {
        lastActivityAt: new Date(),
        lastError: null
      });

      await this.appendEventLog(connectionId, ChannelEventType.INBOUND_MESSAGE, "Inbound WhatsApp message received.", {
        activationMode: triggerDecision.activationMode,
        groupSubject,
        isGroupMessage,
        messageId,
        participantJid,
        remoteJid: externalConversationId,
        targetAgentId: triggerDecision.targetAgentId,
        targetAgentSlug: triggerDecision.targetAgentSlug,
        triggerReason: triggerDecision.triggerReason
      });

      if (!this.inboundHandler) {
        continue;
      }

      try {
        await this.inboundHandler({
          connectionId,
          externalConversationId,
          externalUserId,
          message: inboundContent,
          messageId,
          raw: {
            activationMode: triggerDecision.activationMode,
            commandContent: triggerDecision.commandContent ?? null,
            groupSubject,
            isGroupMessage,
            mentionedJids: this.extractMentionedJids(message),
            participantJid,
            participantName: message.pushName ?? null,
            pushName: message.pushName ?? null,
            remoteJid: externalConversationId,
            targetAgentId: triggerDecision.targetAgentId ?? null,
            targetAgentSlug: triggerDecision.targetAgentSlug ?? null,
            triggerReason: triggerDecision.triggerReason ?? null
          },
          receivedAt: new Date().toISOString(),
          visitorName: message.pushName ?? undefined
        });
      } catch (error) {
        const messageText =
          error instanceof Error ? error.message : "Unknown WhatsApp inbound processing error.";

        await this.updateConnectionState(connectionId, {
          lastActivityAt: new Date(),
          lastError: messageText
        });

        await this.appendEventLog(connectionId, ChannelEventType.ERROR, messageText, {
          direction: "inbound",
          messageId
        });
      }
    }
  }

  private async evaluateMessageTrigger(
    connectionId: string,
    message: WAMessage,
    content: string,
    botAddresses: string[],
    botE164?: string,
    runtime?: RuntimeSocketState
  ): Promise<GroupTriggerDecision> {
    if (message.key.fromMe || !message.message || !message.key.remoteJid) {
      return {
        activationMode: this.env.WHATSAPP_GROUP_ACTIVATION,
        matched: false
      };
    }

    if (message.key.remoteJid === "status@broadcast") {
      return {
        activationMode: this.env.WHATSAPP_GROUP_ACTIVATION,
        matched: false
      };
    }

    if (!this.isGroupJid(message.key.remoteJid)) {
      return {
        activationMode: this.env.WHATSAPP_GROUP_ACTIVATION,
        matched: true
      };
    }

    const groupJid = this.normalizeAddressingJid(message.key.remoteJid);
    const config = await this.resolveGroupRoutingConfig(connectionId, runtime);

    if (groupJid && config.allowedGroupJids && !config.allowedGroupJids.has(groupJid)) {
      return {
        activationMode: config.activationMode,
        matched: false
      };
    }

    const explicitAgentMatch = this.matchTargetAgentFromText(content, config.targets);
    const defaultTarget = this.resolveDefaultGroupTarget(config);

    if (config.activationMode === "always") {
      return {
        activationMode: config.activationMode,
        commandContent: this.extractSlashCommandAfterMention(
          content,
          explicitAgentMatch?.aliases ?? defaultTarget?.aliases ?? [],
          botAddresses
        ),
        matched: true,
        targetAgentId: explicitAgentMatch?.id ?? defaultTarget?.id,
        targetAgentSlug: explicitAgentMatch?.slug ?? defaultTarget?.slug,
        triggerReason: explicitAgentMatch ? "pattern" : "activation_always"
      };
    }

    if (explicitAgentMatch) {
      return {
        activationMode: config.activationMode,
        commandContent: this.extractSlashCommandAfterMention(content, explicitAgentMatch.aliases, botAddresses),
        matched: true,
        targetAgentId: explicitAgentMatch.id,
        targetAgentSlug: explicitAgentMatch.slug,
        triggerReason: "pattern"
      };
    }

    if (this.isBotMentioned(message, botAddresses)) {
      return {
        activationMode: config.activationMode,
        commandContent: this.extractSlashCommandAfterMention(content, defaultTarget?.aliases ?? [], botAddresses),
        matched: true,
        targetAgentId: defaultTarget?.id,
        targetAgentSlug: defaultTarget?.slug,
        triggerReason: "native_mention"
      };
    }

    if (this.env.WHATSAPP_GROUP_REPLY_TO_BOT_ENABLED && this.isReplyToBot(message, botAddresses)) {
      return {
        activationMode: config.activationMode,
        commandContent: this.extractSlashCommandAfterMention(content, defaultTarget?.aliases ?? [], botAddresses),
        matched: true,
        targetAgentId: defaultTarget?.id,
        targetAgentSlug: defaultTarget?.slug,
        triggerReason: "reply_to_bot"
      };
    }

    if (this.env.WHATSAPP_GROUP_SELF_E164_FALLBACK_ENABLED && this.hasSelfE164Mention(content, botE164)) {
      return {
        activationMode: config.activationMode,
        commandContent: this.extractSlashCommandAfterMention(content, defaultTarget?.aliases ?? [], botAddresses),
        matched: true,
        targetAgentId: defaultTarget?.id,
        targetAgentSlug: defaultTarget?.slug,
        triggerReason: "e164"
      };
    }

    return {
      activationMode: config.activationMode,
      matched: false
    };
  }

  private extractMessageText(message: WAMessage): string | null {
    const payload = this.unwrapMessagePayload(message.message);

    if (!payload) {
      return null;
    }

    const conversation = this.readString(payload.conversation);

    if (conversation) {
      return conversation;
    }

    const extendedTextMessage = this.asRecord(payload.extendedTextMessage);
    const extendedText = this.readString(extendedTextMessage?.text);

    if (extendedText) {
      return extendedText;
    }

    const imageMessage = this.asRecord(payload.imageMessage);
    const imageCaption = this.readString(imageMessage?.caption);

    if (imageCaption) {
      return imageCaption;
    }

    const videoMessage = this.asRecord(payload.videoMessage);
    const videoCaption = this.readString(videoMessage?.caption);

    if (videoCaption) {
      return videoCaption;
    }

    const buttonsResponseMessage = this.asRecord(payload.buttonsResponseMessage);
    const buttonSelection = this.readString(buttonsResponseMessage?.selectedDisplayText);

    if (buttonSelection) {
      return buttonSelection;
    }

    const listResponseMessage = this.asRecord(payload.listResponseMessage);
    const listTitle = this.readString(listResponseMessage?.title);

    if (listTitle) {
      return listTitle;
    }

    return null;
  }

  private isBotMentioned(message: WAMessage, botAddresses: string[]): boolean {
    if (!botAddresses.length) {
      return false;
    }

    const knownAddresses = new Set(botAddresses);
    return this.extractMentionedJids(message).some((jid) => knownAddresses.has(jid));
  }

  private async resolveGroupRoutingConfig(
    connectionId: string,
    runtime?: RuntimeSocketState
  ): Promise<GroupRoutingConfig> {
    const cached = this.groupRoutingCache.get(connectionId);

    if (cached && cached.expiresAt > Date.now()) {
      return cached.config;
    }

    const connection = await this.prisma.channelConnection.findUnique({
      where: {
        id: connectionId
      },
      select: {
        defaultAgent: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        name: true,
        sessionState: true,
        workspaceId: true
      }
    });

    const workspaceAgents = connection?.workspaceId
      ? await this.prisma.agent.findMany({
          where: {
            deletedAt: null,
            status: AgentStatus.ACTIVE,
            workspaceId: connection.workspaceId
          },
          orderBy: [
            {
              isDefault: "desc"
            },
            {
              updatedAt: "desc"
            }
          ],
          select: {
            config: true,
            id: true,
            isDefault: true,
            name: true,
            slug: true
          }
        })
      : [];
    const sessionState = this.asRecord(connection?.sessionState);
    const defaultAgentId = connection?.defaultAgent?.id ?? workspaceAgents.find((agent) => agent.isDefault)?.id;
    const globalDefaultPatterns = this.compileMentionPatterns(this.env.WHATSAPP_GROUP_MENTION_PATTERNS);
    const targets = workspaceAgents.map((agent) => {
      const config = this.asRecord(agent.config);
      const agentPatterns = this.compileMentionPatterns(
        config?.whatsappMentionPatterns ?? config?.mentionPatterns ?? undefined
      );
      const aliases = this.buildMentionAliases([
        agent.name,
        agent.slug,
        agent.id === defaultAgentId ? connection?.name : undefined,
        agent.id === defaultAgentId ? this.readString(sessionState?.meName) : undefined,
        agent.id === defaultAgentId ? this.readString(this.asRecord(runtime?.socket.user)?.name) : undefined,
        agent.id === defaultAgentId ? this.readString(this.asRecord(runtime?.socket.user)?.notify) : undefined
      ]);

      return {
        aliases,
        id: agent.id,
        isDefault: agent.id === defaultAgentId || agent.isDefault,
        name: agent.name,
        patterns: this.buildTargetMentionPatterns(
          aliases,
          agent.id === defaultAgentId ? [...globalDefaultPatterns, ...agentPatterns] : agentPatterns
        ),
        slug: agent.slug
      } satisfies GroupTargetAgent;
    });
    const defaultTarget =
      targets.find((target) => target.id === defaultAgentId) ??
      targets.find((target) => target.isDefault) ??
      targets[0];
    const config = {
      activationMode: this.env.WHATSAPP_GROUP_ACTIVATION,
      allowedGroupJids: this.parseAllowedGroupJids(this.env.WHATSAPP_GROUP_ALLOWED_JIDS),
      defaultAgentId: defaultTarget?.id,
      defaultAgentSlug: defaultTarget?.slug,
      targets
    } satisfies GroupRoutingConfig;

    this.groupRoutingCache.set(connectionId, {
      config,
      expiresAt: Date.now() + GROUP_MENTION_ALIAS_CACHE_TTL_MS
    });

    return config;
  }

  private resolveDefaultGroupTarget(config: GroupRoutingConfig): GroupTargetAgent | undefined {
    return (
      config.targets.find((target) => target.id === config.defaultAgentId) ??
      config.targets.find((target) => target.isDefault) ??
      config.targets[0]
    );
  }

  private matchTargetAgentFromText(content: string, targets: GroupTargetAgent[]): GroupTargetAgent | undefined {
    const normalizedContent = this.normalizeMentionContent(content);
    let bestMatch: {
      score: number;
      target: GroupTargetAgent;
    } | null = null;

    for (const target of targets) {
      for (const pattern of target.patterns) {
        pattern.regex.lastIndex = 0;
        const matched = pattern.regex.test(content) || pattern.regex.test(normalizedContent);

        if (!matched) {
          continue;
        }

        const score = pattern.source.length;

        if (!bestMatch || score > bestMatch.score) {
          bestMatch = {
            score,
            target
          };
        }
      }
    }

    return bestMatch?.target;
  }

  private buildTargetMentionPatterns(aliases: string[], configuredPatterns: string[]): GroupTargetAgent["patterns"] {
    const patterns = new Map<string, RegExp>();

    for (const alias of aliases) {
      const escapedAlias = this.escapeRegExp(alias).replace(/ /g, "\\s+");
      const source = `(^|\\s)@?${escapedAlias}(?=$|\\s|[!?,.:;])`;
      patterns.set(source, new RegExp(source, "iu"));
    }

    for (const source of configuredPatterns) {
      try {
        patterns.set(source, new RegExp(source, "iu"));
      } catch {
        this.logger.warn({ source }, "Ignoring invalid WhatsApp group mention regex");
      }
    }

    return Array.from(patterns.entries()).map(([source, regex]) => ({
      regex,
      source
    }));
  }

  private compileMentionPatterns(input: unknown): string[] {
    if (Array.isArray(input)) {
      return input
        .filter((value): value is string => typeof value === "string" && value.trim().length > 0)
        .map((value) => value.trim());
    }

    if (typeof input !== "string") {
      return [];
    }

    const trimmed = input.trim();

    if (!trimmed) {
      return [];
    }

    if (trimmed.startsWith("[")) {
      try {
        const parsed = JSON.parse(trimmed);
        return this.compileMentionPatterns(parsed);
      } catch {
        this.logger.warn("Ignoring invalid JSON for WHATSAPP_GROUP_MENTION_PATTERNS");
      }
    }

    return trimmed
      .split(/\r?\n/)
      .map((value) => value.trim())
      .filter(Boolean);
  }

  private parseAllowedGroupJids(value: string): Set<string> | null {
    const normalized = value
      .split(/[\n,]+/)
      .map((item) => this.normalizeAddressingJid(item.trim()))
      .filter((item): item is string => Boolean(item));

    return normalized.length ? new Set(normalized) : null;
  }

  private isReplyToBot(message: WAMessage, botAddresses: string[]): boolean {
    if (!botAddresses.length) {
      return false;
    }

    const knownAddresses = new Set(botAddresses);
    return this.extractContextInfos(message).some((contextInfo) => {
      const participant = this.normalizeAddressingJid(this.readString(contextInfo.participant));
      const stanzaId = this.readString(contextInfo.stanzaId);
      return Boolean(stanzaId) && participant !== null && knownAddresses.has(participant);
    });
  }

  private resolveBotAddresses(runtime?: RuntimeSocketState): string[] {
    const addresses = new Set<string>();
    const socketUser = this.asRecord(runtime?.socket.user);
    const authMe = this.asRecord(runtime?.socket.authState.creds.me);

    for (const candidate of [
      runtime?.socket.user?.id,
      this.readString(socketUser?.lid),
      this.readString(authMe?.id),
      this.readString(authMe?.lid)
    ]) {
      const normalized = this.normalizeAddressingJid(candidate);

      if (normalized) {
        addresses.add(normalized);
      }
    }

    return Array.from(addresses);
  }

  private hasSelfE164Mention(content: string, botE164?: string): boolean {
    if (!botE164) {
      return false;
    }

    const normalizedDigits = content.replace(/\D+/g, "");

    if (!normalizedDigits) {
      return false;
    }

    const localDigits = botE164.length > 10 ? botE164.slice(-10) : botE164;
    return normalizedDigits.includes(botE164) || (localDigits.length >= 8 && normalizedDigits.includes(localDigits));
  }

  private async resolveGroupSubject(
    connectionId: string,
    groupJid: string,
    runtime?: RuntimeSocketState
  ): Promise<string | undefined> {
    const cacheKey = `${connectionId}:${groupJid}`;
    const cached = this.groupMetadataCache.get(cacheKey);

    if (cached && cached.expiresAt > Date.now()) {
      return cached.subject;
    }

    let subject: string | undefined;

    try {
      const metadata = runtime
        ? await this.resolveBaileysGroupMetadata(connectionId, groupJid, runtime)
        : undefined;
      subject = this.readString(metadata?.subject) ?? undefined;

      if (!subject && runtime) {
        const directMetadata = await runtime.socket.groupMetadata(groupJid);
        subject = this.readString(directMetadata?.subject) ?? undefined;
        this.cacheBaileysGroupMetadata(connectionId, [directMetadata], runtime);
      }
    } catch (error) {
      this.logger.debug({ connectionId, error, groupJid }, "Unable to resolve WhatsApp group metadata");
    }

    this.groupMetadataCache.set(cacheKey, {
      expiresAt: Date.now() + GROUP_METADATA_CACHE_TTL_MS,
      subject
    });

    return subject;
  }

  private extractMentionedJids(message: WAMessage): string[] {
    const payload = this.unwrapMessagePayload(message.message);

    if (!payload) {
      return [];
    }

    const mentioned = new Set<string>();

    for (const key of [
      "buttonsResponseMessage",
      "documentMessage",
      "extendedTextMessage",
      "imageMessage",
      "listResponseMessage",
      "videoMessage"
    ]) {
      const node = this.asRecord(payload[key]);
      const contextInfo = this.asRecord(node?.contextInfo);
      const mentionedJids = Array.isArray(contextInfo?.mentionedJid) ? contextInfo.mentionedJid : [];

      for (const jid of mentionedJids) {
        const normalized = this.normalizeAddressingJid(typeof jid === "string" ? jid : undefined);

        if (normalized) {
          mentioned.add(normalized);
        }
      }
    }

    return Array.from(mentioned);
  }

  private extractContextInfos(message: WAMessage): Record<string, unknown>[] {
    const payload = this.unwrapMessagePayload(message.message);

    if (!payload) {
      return [];
    }

    const contextInfos: Record<string, unknown>[] = [];
    const directContext = this.asRecord(payload.contextInfo);

    if (directContext) {
      contextInfos.push(directContext);
    }

    for (const key of [
      "buttonsResponseMessage",
      "documentMessage",
      "extendedTextMessage",
      "imageMessage",
      "listResponseMessage",
      "videoMessage"
    ]) {
      const node = this.asRecord(payload[key]);
      const contextInfo = this.asRecord(node?.contextInfo);

      if (contextInfo) {
        contextInfos.push(contextInfo);
      }
    }

    return contextInfos;
  }

  private unwrapMessagePayload(payload: WAMessage["message"] | Record<string, unknown> | undefined): Record<string, unknown> | null {
    const record = this.asRecord(payload);

    if (!record) {
      return null;
    }

    for (const key of [
      "documentWithCaptionMessage",
      "ephemeralMessage",
      "viewOnceMessage",
      "viewOnceMessageV2",
      "viewOnceMessageV2Extension"
    ]) {
      const wrapper = this.asRecord(record[key]);

      if (!wrapper) {
        continue;
      }

      const nested = this.unwrapMessagePayload((wrapper.message as Record<string, unknown> | undefined) ?? wrapper);

      if (nested) {
        return nested;
      }
    }

    return record;
  }

  private asRecord(value: unknown): Record<string, unknown> | null {
    return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
  }

  private buildMentionAliases(values: Array<string | null | undefined>): string[] {
    const aliases = new Set<string>();

    for (const value of values) {
      const normalized = this.normalizeMentionAlias(value);

      if (!normalized) {
        continue;
      }

      aliases.add(normalized);

      const [firstWord] = normalized.split(" ");

      if (firstWord && firstWord.length >= 3) {
        aliases.add(firstWord);
      }
    }

    return Array.from(aliases);
  }

  private normalizeMentionAlias(value: string | null | undefined): string | null {
    if (!value) {
      return null;
    }

    const normalized = value
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/^@+/, "")
      .replace(/[^a-z0-9 ]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    return normalized || null;
  }

  private normalizeMentionContent(value: string): string {
    return value
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9@ ]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  private extractSlashCommandAfterMention(
    content: string,
    aliases: string[],
    selfAddresses: string[] = []
  ): string | undefined {
    const trimmed = content.trim();

    if (!trimmed) {
      return undefined;
    }

    if (trimmed.startsWith("/")) {
      return trimmed;
    }

    const slashIndex = trimmed.indexOf("/");

    if (slashIndex <= 0) {
      return undefined;
    }

    const prefix = trimmed.slice(0, slashIndex).trim();
    const command = trimmed.slice(slashIndex).trim();

    if (!prefix || !command.startsWith("/")) {
      return undefined;
    }

    const normalizedPrefix = this.normalizeMentionContent(prefix)
      .replace(/^@+/, "")
      .replace(/[!?,.:;\s]+$/g, "")
      .trim();

    if (!normalizedPrefix) {
      return undefined;
    }

    for (const alias of aliases) {
      const normalizedAlias = this.normalizeMentionAlias(alias);

      if (!normalizedAlias) {
        continue;
      }

      if (normalizedPrefix === normalizedAlias) {
        return command;
      }
    }

    const selfMentionTokens = new Set<string>();

    for (const address of selfAddresses) {
      const localPart = this.readString(address?.split("@")[0])?.replace(/^@+/, "").trim();

      if (localPart) {
        selfMentionTokens.add(this.normalizeMentionContent(localPart).replace(/^@+/, "").trim());
        const digitsOnly = localPart.replace(/\D+/g, "");

        if (digitsOnly) {
          selfMentionTokens.add(digitsOnly);
        }
      }
    }

    if (selfMentionTokens.has(normalizedPrefix)) {
      return command;
    }

    return undefined;
  }

  private readString(value: unknown): string | null {
    return typeof value === "string" && value.trim() ? value : null;
  }

  private escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  private isGroupJid(jid?: string | null): boolean {
    return typeof jid === "string" && jid.endsWith("@g.us");
  }

  private normalizeAddressingJid(jid?: string | null): string | null {
    if (!jid) {
      return null;
    }

    const [local, domain] = jid.split("@");

    if (!local || !domain) {
      return jid;
    }

    return `${local.split(":")[0]}@${domain}`;
  }

  private extractNumericJidLocal(jid?: string | null): string | undefined {
    const normalized = this.normalizeAddressingJid(jid);

    if (!normalized) {
      return undefined;
    }

    const [local] = normalized.split("@");
    const digits = local?.replace(/\D+/g, "");

    return digits || undefined;
  }

  private async updateMessageDelivery(
    messageId: string,
    patch: Record<string, unknown>,
    externalMessageId?: string | null
  ): Promise<void> {
    const message = await this.prisma.message.findUnique({
      where: {
        id: messageId
      },
      select: {
        payload: true
      }
    });

    if (!message) {
      return;
    }

    await this.prisma.message.update({
      where: {
        id: messageId
      },
      data: {
        externalMessageId: externalMessageId ?? undefined,
        payload: {
          ...((message.payload as Record<string, unknown> | null) ?? {}),
          ...patch
        } as Prisma.InputJsonValue
      }
    });
  }

  private async updateConnectionState(
    connectionId: string,
    input: {
      lastActivityAt?: Date;
      lastConnectedAt?: Date | null;
      lastError?: string | null;
      qrCodeData?: string | null;
      qrExpiresAt?: Date | null;
      sessionStatePatch?: Record<string, unknown>;
      status?: ChannelStatus;
    }
  ) {
    const current = await this.prisma.channelConnection.findUnique({
      where: {
        id: connectionId
      },
      select: {
        sessionState: true
      }
    });

    const data: Prisma.ChannelConnectionUpdateInput = {
      lastActivityAt: input.lastActivityAt,
      lastError: input.lastError,
      qrCodeData: input.qrCodeData,
      status: input.status
    };

    if ("lastConnectedAt" in input) {
      data.lastConnectedAt = input.lastConnectedAt;
    }

    if ("qrExpiresAt" in input) {
      data.qrExpiresAt = input.qrExpiresAt;
    }

    if (input.sessionStatePatch) {
      data.sessionState = {
        ...((current?.sessionState as Record<string, unknown> | null) ?? {}),
        ...input.sessionStatePatch
      } as Prisma.InputJsonValue;
    }

    return this.prisma.channelConnection.update({
      where: {
        id: connectionId
      },
      data
    });
  }

  private async appendEventLog(
    connectionId: string,
    type: ChannelEventType,
    message: string,
    payload?: Record<string, unknown>
  ): Promise<void> {
    const connection = await this.prisma.channelConnection.findUnique({
      where: {
        id: connectionId
      },
      select: {
        workspaceId: true
      }
    });

    if (!connection) {
      return;
    }

    await this.prisma.channelEventLog.create({
      data: {
        channelConnectionId: connectionId,
        message,
        payload: payload as Prisma.InputJsonValue | undefined,
        type,
        workspaceId: connection.workspaceId
      }
    });
  }

  private async enqueueReconnectJob(
    connectionId: string,
    input: {
      actorUserId?: string;
      attempt?: number;
      reason: string;
    }
  ): Promise<void> {
    await this.ensureWorkersReady();
    const jobId = `whatsapp:reconnect:${connectionId}`;
    const existingJob = await this.channelQueue.getJob(jobId);
    await existingJob?.remove().catch(() => undefined);

    await this.channelQueue.add(
      channelJobNames.whatsappReconnect,
      {
        actorUserId: input.actorUserId,
        attempt: input.attempt,
        connectionId,
        reason: input.reason
      },
      createJobOptions({
        attempts: 1,
        delay: this.env.WHATSAPP_RECONNECT_DELAY_MS * Math.max(input.attempt ?? 1, 1),
        jobId
      })
    );
  }

  private async scheduleHealthCheck(connectionId: string, reason: string): Promise<void> {
    await this.ensureWorkersReady();
    const jobId = `whatsapp:health:${connectionId}`;
    const existingJob = await this.channelQueue.getJob(jobId);
    await existingJob?.remove().catch(() => undefined);

    await this.channelQueue.add(
      channelJobNames.whatsappHealth,
      {
        connectionId,
        reason
      },
      createJobOptions({
        attempts: 1,
        delay: this.env.WHATSAPP_HEALTH_INTERVAL_MS,
        jobId
      })
    );
  }

  private async cancelMaintenanceJobs(connectionId: string): Promise<void> {
    const jobIds = [
      `whatsapp:health:${connectionId}`,
      `whatsapp:reconnect:${connectionId}`
    ];

    await Promise.all(
      jobIds.map(async (jobId) => {
        const job = await this.channelQueue.getJob(jobId);
        await job?.remove().catch(() => undefined);
      })
    );
  }

  private async disposeRuntime(
    connectionId: string,
    logout = true,
    expectedInstanceId?: string
  ): Promise<void> {
    const runtime = this.sockets.get(connectionId);

    if (!runtime) {
      return;
    }

    if (expectedInstanceId && runtime.instanceId !== expectedInstanceId) {
      return;
    }

    this.sockets.delete(connectionId);

    const ws = runtime.socket.ws;
    const swallowSocketError = (error: unknown) => {
      this.logger.debug(
        {
          connectionId,
          error,
          expectedInstanceId,
          logout
        },
        "Ignored WhatsApp socket error during runtime disposal"
      );
    };

    ws.on("error", swallowSocketError);

    try {
      if (ws.isConnecting || ws.isClosing || ws.isClosed) {
        try {
          ws.close();
        } catch {
          // Ignore close errors during teardown.
        }
      } else if (logout) {
        await runtime.socket.logout();
      } else {
        runtime.socket.end(new Error("VEXUSCLAW runtime reset"));
      }
    } catch {
      try {
        if (!ws.isClosed) {
          runtime.socket.end(new Error("VEXUSCLAW runtime disposed"));
        }
      } catch {
        try {
          ws.close();
        } catch {
          // Ignore close errors during teardown.
        }
      }
    } finally {
      ws.off("error", swallowSocketError);
    }
  }

  private isCurrentRuntime(connectionId: string, instanceId: string): boolean {
    return this.sockets.get(connectionId)?.instanceId === instanceId;
  }

  private seenInboundMessage(connectionId: string, messageId: string): boolean {
    this.pruneInboundMessageCache();
    return this.inboundMessageCache.has(`${connectionId}:${messageId}`);
  }

  private rememberInboundMessage(connectionId: string, messageId: string): void {
    this.pruneInboundMessageCache();
    this.inboundMessageCache.set(`${connectionId}:${messageId}`, Date.now() + INBOUND_MESSAGE_DEDUPE_TTL_MS);
  }

  private pruneInboundMessageCache(): void {
    const now = Date.now();

    for (const [key, expiresAt] of this.inboundMessageCache.entries()) {
      if (expiresAt <= now) {
        this.inboundMessageCache.delete(key);
      }
    }
  }

  private resolveAuthDirectory(connectionId: string): string {
    return path.join(this.env.FILE_STORAGE_PATH, "whatsapp", connectionId);
  }

  private async pathExists(targetPath: string): Promise<boolean> {
    try {
      await access(targetPath);
      return true;
    } catch {
      return false;
    }
  }
}
