import { createHash } from "node:crypto";
import { isIP } from "node:net";

import type { FastifyBaseLogger } from "fastify";

import { hashOpaqueToken, generateOpaqueToken } from "@vexus/auth";
import type { PrismaClient } from "@vexus/db";
import type { VexusEnv } from "@vexus/config";
import type {
  SelfHostClaimResponse,
  SelfHostDnsRecordDetails,
  SelfHostInstallTokenDetails
} from "@vexus/shared";

import { HttpError } from "../../app/errors";

interface CloudflareDnsRecordMutationResponse {
  success: boolean;
  errors?: Array<{
    message?: string;
  }>;
  result?: {
    id: string;
  };
}

interface CloudflareDnsRecordListResponse {
  success: boolean;
  errors?: Array<{
    message?: string;
  }>;
  result?: Array<{
    id: string;
  }>;
}

interface SelfHostInstallTokenRecord {
  id: string;
  tokenHash: string;
  label: string;
  email: string | null;
  status: "ACTIVE" | "REVOKED";
  expiresAt: Date | null;
  lastUsedAt: Date | null;
  activationCount: number;
  metadata: unknown;
  createdAt: Date;
  updatedAt: Date;
}

interface SelfHostDnsRecordRecord {
  id: string;
  installTokenId: string;
  slug: string;
  fqdn: string;
  ipAddress: string;
  cloudflareRecordId: string | null;
  status: "PENDING" | "ACTIVE" | "ERROR";
  lastError: string | null;
  lastSyncedAt: Date | null;
  metadata: unknown;
  createdAt: Date;
  updatedAt: Date;
}

type SelfHostPrisma = PrismaClient & {
  selfHostDnsRecord: any;
  selfHostInstallToken: any;
};

export interface ProvisioningServiceDependencies {
  env: VexusEnv;
  logger: FastifyBaseLogger;
  prisma: PrismaClient;
}

export class ProvisioningService {
  private readonly env: VexusEnv;
  private readonly logger: FastifyBaseLogger;
  private readonly prisma: PrismaClient;

  constructor(dependencies: ProvisioningServiceDependencies) {
    this.env = dependencies.env;
    this.logger = dependencies.logger;
    this.prisma = dependencies.prisma;
  }

  async issueInstallToken(input: {
    label: string;
    email?: string;
    expiresAt?: Date;
    metadata?: Record<string, unknown>;
  }): Promise<{
    token: string;
    details: SelfHostInstallTokenDetails;
  }> {
    const rawToken = `vxc_${generateOpaqueToken(24)}`;
    const record = (await this.selfHostPrisma.selfHostInstallToken.create({
      data: {
        email: input.email,
        expiresAt: input.expiresAt,
        label: input.label,
        metadata: input.metadata,
        tokenHash: hashOpaqueToken(rawToken)
      }
    })) as SelfHostInstallTokenRecord;

    return {
      token: rawToken,
      details: this.serializeInstallToken(record)
    };
  }

  async claim(input: {
    installToken: string;
    ipAddress?: string;
    requestIp?: string;
  }): Promise<SelfHostClaimResponse> {
    this.assertProvisioningEnabled();

    const installToken = await this.requireInstallToken(input.installToken);
    const ipAddress = this.normalizeIpAddress(input.ipAddress ?? input.requestIp);
    const existing = (await this.selfHostPrisma.selfHostDnsRecord.findUnique({
      where: {
        installTokenId: installToken.id
      }
    })) as SelfHostDnsRecordRecord | null;

    if (existing) {
      return this.syncExistingRecord(existing, installToken, ipAddress);
    }

    const slug = await this.allocateUniqueSlug(`${installToken.id}:${installToken.label}:${installToken.email ?? ""}`);
    const fqdn = `${slug}.${this.env.VEXUS_BASE_DOMAIN}`;
    const created = (await this.selfHostPrisma.selfHostDnsRecord.create({
      data: {
        fqdn,
        installTokenId: installToken.id,
        ipAddress,
        slug,
        status: "PENDING"
      }
    })) as SelfHostDnsRecordRecord;

    return this.syncExistingRecord(created, installToken, ipAddress);
  }

  async updateClaim(input: {
    installToken: string;
    slug: string;
    ipAddress?: string;
    requestIp?: string;
  }): Promise<SelfHostClaimResponse> {
    this.assertProvisioningEnabled();

    const installToken = await this.requireInstallToken(input.installToken);
    const ipAddress = this.normalizeIpAddress(input.ipAddress ?? input.requestIp);
    const record = (await this.selfHostPrisma.selfHostDnsRecord.findFirst({
      where: {
        installTokenId: installToken.id,
        slug: input.slug
      }
    })) as SelfHostDnsRecordRecord | null;

    if (!record) {
      throw new HttpError(404, "Self-host DNS claim not found.", "SELF_HOST_CLAIM_NOT_FOUND");
    }

    return this.syncExistingRecord(record, installToken, ipAddress);
  }

  async getClaimStatus(input: {
    installToken: string;
    slug: string;
  }): Promise<SelfHostClaimResponse> {
    this.assertProvisioningEnabled();

    const installToken = await this.requireInstallToken(input.installToken);
    const record = (await this.selfHostPrisma.selfHostDnsRecord.findFirst({
      where: {
        installTokenId: installToken.id,
        slug: input.slug
      }
    })) as SelfHostDnsRecordRecord | null;

    if (!record) {
      throw new HttpError(404, "Self-host DNS claim not found.", "SELF_HOST_CLAIM_NOT_FOUND");
    }

    return this.serializeDnsRecord(record);
  }

  private async syncExistingRecord(
    record: SelfHostDnsRecordRecord,
    installToken: SelfHostInstallTokenRecord,
    ipAddress: string
  ): Promise<SelfHostClaimResponse> {
    try {
      const cloudflareRecordId = await this.upsertCloudflareDnsRecord(record.fqdn, ipAddress);
      const updatedRecord = (await this.selfHostPrisma.selfHostDnsRecord.update({
        where: {
          id: record.id
        },
        data: {
          cloudflareRecordId,
          ipAddress,
          lastError: null,
          lastSyncedAt: new Date(),
          status: "ACTIVE"
        }
      })) as SelfHostDnsRecordRecord;

      await this.selfHostPrisma.selfHostInstallToken.update({
        where: {
          id: installToken.id
        },
        data: {
          activationCount: {
            increment: 1
          },
          lastUsedAt: new Date()
        }
      });

      return this.serializeDnsRecord(updatedRecord);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Cloudflare DNS sync failed.";

      await this.selfHostPrisma.selfHostDnsRecord.update({
        where: {
          id: record.id
        },
        data: {
          ipAddress,
          lastError: message,
          status: "ERROR"
        }
      });

      throw error;
    }
  }

  private async requireInstallToken(rawToken: string): Promise<SelfHostInstallTokenRecord> {
    const tokenHash = hashOpaqueToken(rawToken);
    const token = (await this.selfHostPrisma.selfHostInstallToken.findUnique({
      where: {
        tokenHash
      }
    })) as SelfHostInstallTokenRecord | null;

    if (!token) {
      throw new HttpError(401, "The self-host install token is invalid.", "SELF_HOST_INSTALL_TOKEN_INVALID");
    }

    if (token.status !== "ACTIVE") {
      throw new HttpError(403, "The self-host install token has been revoked.", "SELF_HOST_INSTALL_TOKEN_REVOKED");
    }

    if (token.expiresAt && token.expiresAt.getTime() < Date.now()) {
      throw new HttpError(410, "The self-host install token has expired.", "SELF_HOST_INSTALL_TOKEN_EXPIRED");
    }

    return token;
  }

  private assertProvisioningEnabled(): void {
    if (!this.env.SELF_HOST_PROVISIONING_ENABLED) {
      throw new HttpError(
        503,
        "Self-host DNS provisioning is not enabled on this control plane.",
        "SELF_HOST_PROVISIONING_DISABLED"
      );
    }

    if (!this.env.CLOUDFLARE_API_TOKEN || !this.env.CLOUDFLARE_ZONE_ID) {
      throw new HttpError(
        503,
        "Cloudflare provisioning is not configured on this control plane.",
        "SELF_HOST_PROVISIONING_NOT_CONFIGURED"
      );
    }
  }

  private normalizeIpAddress(value?: string): string {
    const normalized = value?.trim().replace(/^::ffff:/, "");

    if (!normalized || !isIP(normalized)) {
      throw new HttpError(
        400,
        "A valid public IPv4 or IPv6 address is required for self-host DNS provisioning.",
        "SELF_HOST_INVALID_IP"
      );
    }

    return normalized;
  }

  private async allocateUniqueSlug(seed: string): Promise<string> {
    for (let attempt = 0; attempt < 64; attempt += 1) {
      const slug = this.createUserSlug(seed, attempt);
      const [workspace, dnsRecord] = await Promise.all([
        this.prisma.workspace.findUnique({
          where: {
            slug
          },
          select: {
            id: true
          }
        }),
        this.selfHostPrisma.selfHostDnsRecord.findUnique({
          where: {
            slug
          },
          select: {
            id: true
          }
        })
      ]);

      if (!workspace && !dnsRecord) {
        return slug;
      }
    }

    throw new HttpError(
      500,
      "Could not allocate a unique self-host subdomain.",
      "SELF_HOST_SLUG_UNAVAILABLE"
    );
  }

  private createUserSlug(seed: string, attempt: number): string {
    const hash = createHash("sha256")
      .update(`${seed}:${attempt}`)
      .digest("hex");
    const numeric = (parseInt(hash.slice(0, 8), 16) % 90000) + 10000;

    return `user${numeric}`;
  }

  private async upsertCloudflareDnsRecord(fqdn: string, ipAddress: string): Promise<string> {
    const recordType = isIP(ipAddress) === 6 ? "AAAA" : "A";
    const existing = await this.cloudflareRequest<CloudflareDnsRecordListResponse>(
      `/dns_records?type=${recordType}&name=${encodeURIComponent(fqdn)}`
    );
    const existingRecordId = existing.result?.[0]?.id;
    const method = existingRecordId ? "PUT" : "POST";
    const path = existingRecordId ? `/dns_records/${existingRecordId}` : "/dns_records";
    const payload = {
      content: ipAddress,
      name: fqdn,
      proxied: false,
      ttl: 120,
      type: recordType
    };
    const response = await this.cloudflareRequest<CloudflareDnsRecordMutationResponse>(path, {
      body: JSON.stringify(payload),
      method
    });
    const recordId = response.result?.id;

    if (!recordId) {
      throw new HttpError(
        502,
        "Cloudflare did not return a DNS record id for the self-host subdomain.",
        "SELF_HOST_CLOUDFLARE_INVALID_RESPONSE"
      );
    }

    return recordId;
  }

  private async cloudflareRequest<T extends { success: boolean; errors?: Array<{ message?: string }> }>(
    path: string,
    init?: RequestInit
  ): Promise<T> {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${this.env.CLOUDFLARE_ZONE_ID}${path}`,
      {
        ...init,
        headers: {
          Authorization: `Bearer ${this.env.CLOUDFLARE_API_TOKEN}`,
          "Content-Type": "application/json",
          ...(init?.headers ?? {})
        }
      }
    );
    const payload = (await response.json().catch(() => null)) as T | null;

    if (!response.ok || !payload?.success) {
      const message =
        payload?.errors?.map((error: { message?: string }) => error.message).filter(Boolean).join("; ") ||
        `Cloudflare request failed with status ${response.status}.`;

      this.logger.error(
        {
          path,
          responseStatus: response.status
        },
        "Cloudflare DNS request failed"
      );

      throw new HttpError(502, message, "SELF_HOST_CLOUDFLARE_REQUEST_FAILED");
    }

    return payload as T;
  }

  private serializeInstallToken(record: SelfHostInstallTokenRecord): SelfHostInstallTokenDetails {
    return {
      activationCount: record.activationCount,
      createdAt: record.createdAt.toISOString(),
      email: record.email ?? null,
      expiresAt: record.expiresAt?.toISOString() ?? null,
      id: record.id,
      label: record.label,
      lastUsedAt: record.lastUsedAt?.toISOString() ?? null,
      status: record.status.toLowerCase() as SelfHostInstallTokenDetails["status"]
    };
  }

  private serializeDnsRecord(record: SelfHostDnsRecordRecord): SelfHostClaimResponse {
    const details: SelfHostDnsRecordDetails = {
      createdAt: record.createdAt.toISOString(),
      fqdn: record.fqdn,
      id: record.id,
      ipAddress: record.ipAddress,
      lastError: record.lastError ?? null,
      lastSyncedAt: record.lastSyncedAt?.toISOString() ?? null,
      slug: record.slug,
      status: record.status.toLowerCase() as SelfHostDnsRecordDetails["status"],
      updatedAt: record.updatedAt.toISOString()
    };

    return {
      ...details,
      ready: details.status === "active"
    };
  }

  private get selfHostPrisma(): SelfHostPrisma {
    return this.prisma as SelfHostPrisma;
  }
}
