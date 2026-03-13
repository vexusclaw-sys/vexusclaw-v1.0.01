import {
  Queue,
  QueueEvents,
  Worker,
  type JobsOptions,
  type Job,
  type Processor
} from "bullmq";

import { readEnv } from "@vexus/config";

export const queueNames = {
  automations: "automations",
  channels: "channels",
  agents: "agents",
  sync: "sync",
  system: "system"
} as const;

export const channelJobNames = {
  whatsappHealth: "whatsapp.health",
  whatsappOutbound: "whatsapp.outbound",
  whatsappReconnect: "whatsapp.reconnect"
} as const;

export type QueueName = (typeof queueNames)[keyof typeof queueNames];
export type ChannelJobName = (typeof channelJobNames)[keyof typeof channelJobNames];

export interface WhatsAppOutboundJobData {
  assistantMessageId: string;
  connectionId: string;
  content: string;
  externalConversationId?: string;
  externalUserId: string;
  idempotencyKey: string;
  metadata?: Record<string, unknown>;
}

export interface WhatsAppReconnectJobData {
  actorUserId?: string;
  attempt?: number;
  connectionId: string;
  reason: string;
}

export interface WhatsAppHealthJobData {
  connectionId: string;
  reason: string;
}

export type ChannelQueueJobData =
  | WhatsAppHealthJobData
  | WhatsAppOutboundJobData
  | WhatsAppReconnectJobData;

export type VexusQueue<T = unknown> = Queue<T>;
export type VexusQueueEvents = QueueEvents;
export type VexusJob<T = unknown> = Job<T>;
export type VexusWorker<T = unknown> = Worker<T>;

export function createQueueConnection() {
  const env = readEnv();

  return {
    maxRetriesPerRequest: null,
    url: env.REDIS_URL
  };
}

export function createQueue<T = unknown>(name: QueueName) {
  return new Queue<T>(name, {
    connection: createQueueConnection()
  });
}

export function createQueueEvents(name: QueueName) {
  return new QueueEvents(name, {
    connection: createQueueConnection()
  });
}

export function createWorker<T = unknown>(
  name: QueueName,
  processor: Processor<T>,
  options?: {
    concurrency?: number;
  }
) {
  return new Worker<T>(name, processor, {
    concurrency: options?.concurrency ?? 5,
    connection: createQueueConnection()
  });
}

export function createJobOptions(overrides: JobsOptions = {}): JobsOptions {
  return {
    attempts: 1,
    backoff: {
      delay: 1_000,
      type: "exponential"
    },
    removeOnComplete: 250,
    removeOnFail: 250,
    ...overrides
  };
}
