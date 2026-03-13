import type { FastifyBaseLogger } from "fastify";
import type Redis from "ioredis";

import type { PrismaClient } from "@vexus/db";
import type { HealthCheckResult, HealthReport, HealthState } from "@vexus/shared";

export interface HealthServiceDependencies {
  logger: FastifyBaseLogger;
  prisma: PrismaClient;
  redis: Redis;
}

export class HealthService {
  private readonly logger: FastifyBaseLogger;
  private readonly prisma: PrismaClient;
  private readonly redis: Redis;

  constructor(dependencies: HealthServiceDependencies) {
    this.logger = dependencies.logger;
    this.prisma = dependencies.prisma;
    this.redis = dependencies.redis;
  }

  async getReport(): Promise<HealthReport> {
    const checks = await Promise.all([
      this.checkGateway(),
      this.checkDatabase(),
      this.checkRedis()
    ]);

    return {
      status: this.aggregateStatus(checks),
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      checks
    };
  }

  async getReadiness(): Promise<{
    ready: boolean;
    report: HealthReport;
  }> {
    const report = await this.getReport();

    return {
      ready: report.status !== "down",
      report
    };
  }

  private async checkGateway(): Promise<HealthCheckResult> {
    return {
      name: "gateway",
      status: "ok",
      details: {
        uptimeSeconds: Math.round(process.uptime())
      }
    };
  }

  private async checkDatabase(): Promise<HealthCheckResult> {
    const startedAt = Date.now();

    try {
      await this.prisma.$queryRaw`SELECT 1`;

      return {
        name: "database",
        status: "ok",
        latencyMs: Date.now() - startedAt
      };
    } catch (error) {
      this.logger.error({ error }, "Database healthcheck failed");

      return {
        name: "database",
        status: "down",
        latencyMs: Date.now() - startedAt,
        details: {
          message: error instanceof Error ? error.message : "Unknown database error"
        }
      };
    }
  }

  private async checkRedis(): Promise<HealthCheckResult> {
    const startedAt = Date.now();

    try {
      const response = await this.redis.ping();

      return {
        name: "redis",
        status: response === "PONG" ? "ok" : "degraded",
        latencyMs: Date.now() - startedAt,
        details: {
          response
        }
      };
    } catch (error) {
      this.logger.error({ error }, "Redis healthcheck failed");

      return {
        name: "redis",
        status: "down",
        latencyMs: Date.now() - startedAt,
        details: {
          message: error instanceof Error ? error.message : "Unknown Redis error"
        }
      };
    }
  }

  private aggregateStatus(checks: HealthCheckResult[]): HealthState {
    if (checks.some((check) => check.status === "down")) {
      return "down";
    }

    if (checks.some((check) => check.status === "degraded")) {
      return "degraded";
    }

    return "ok";
  }
}
