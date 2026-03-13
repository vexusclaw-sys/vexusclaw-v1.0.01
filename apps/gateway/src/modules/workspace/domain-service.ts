import { createHash } from "node:crypto";

import type { FastifyBaseLogger } from "fastify";

import type { VexusEnv } from "@vexus/config";
import type { PrismaClient, Workspace } from "@vexus/db";
import {
  buildWorkspaceHostname,
  buildWorkspacePublicUrl,
  extractWorkspaceSlugFromHost,
  isReservedWorkspaceSlug,
  normalizeWorkspaceHost
} from "@vexus/shared";

import { HttpError } from "../../app/errors";

export interface WorkspaceAccessInfo {
  slug: string;
  hostname: string;
  publicUrl: string;
  baseDomain: string;
  resolvedHost: string | null;
  matchedBySubdomain: boolean;
}

export interface ResolvedHostWorkspace {
  workspace: Workspace;
  access: WorkspaceAccessInfo;
}

export interface WorkspaceDomainServiceDependencies {
  env: VexusEnv;
  logger: FastifyBaseLogger;
  prisma: PrismaClient;
}

function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export class WorkspaceDomainService {
  private readonly env: VexusEnv;
  private readonly logger: FastifyBaseLogger;
  private readonly prisma: PrismaClient;

  constructor(dependencies: WorkspaceDomainServiceDependencies) {
    this.env = dependencies.env;
    this.logger = dependencies.logger;
    this.prisma = dependencies.prisma;
  }

  async ensurePrimaryWorkspaceAccess(): Promise<ResolvedHostWorkspace | null> {
    const workspace = await this.prisma.workspace.findFirst({
      where: {
        deletedAt: null
      },
      orderBy: {
        createdAt: "asc"
      }
    });

    if (!workspace) {
      return null;
    }

    return this.ensureWorkspaceAccess(workspace);
  }

  async ensureWorkspaceAccessById(workspaceId: string): Promise<ResolvedHostWorkspace> {
    const workspace = await this.prisma.workspace.findUnique({
      where: {
        id: workspaceId
      }
    });

    if (!workspace || workspace.deletedAt) {
      throw new HttpError(404, "Workspace not found.", "WORKSPACE_NOT_FOUND");
    }

    return this.ensureWorkspaceAccess(workspace);
  }

  async ensureWorkspaceAccess(
    workspace: Workspace,
    resolvedHost?: string | null
  ): Promise<ResolvedHostWorkspace> {
    const shouldRegenerateSlug = this.shouldRegenerateWorkspaceSlug(workspace.slug);
    const slug = shouldRegenerateSlug
      ? await this.generateUniqueWorkspaceSlugForWorkspace(workspace)
      : workspace.slug;
    const hostname = buildWorkspaceHostname(slug, this.env.VEXUS_BASE_DOMAIN);

    const updatedWorkspace =
      slug !== workspace.slug || workspace.domain !== hostname
        ? await this.prisma.workspace.update({
            where: {
              id: workspace.id
            },
            data: {
              slug,
              domain: hostname
            }
          })
        : workspace;

    await this.prisma.setupState.upsert({
      where: {
        workspaceId: updatedWorkspace.id
      },
      update: {
        domain: hostname
      },
      create: {
        workspaceId: updatedWorkspace.id,
        domain: hostname
      }
    });

    return {
      workspace: updatedWorkspace,
      access: this.describeWorkspace(updatedWorkspace, resolvedHost)
    };
  }

  async resolveByHost(hostHeader: string | null | undefined): Promise<ResolvedHostWorkspace | null> {
    const normalizedHost = normalizeWorkspaceHost(hostHeader);

    if (!normalizedHost) {
      return null;
    }

    const slug = extractWorkspaceSlugFromHost(normalizedHost, this.env.VEXUS_BASE_DOMAIN);

    if (!slug) {
      return null;
    }

    const workspace = await this.prisma.workspace.findUnique({
      where: {
        slug
      }
    });

    if (!workspace || workspace.deletedAt) {
      this.logger.warn(
        {
          host: normalizedHost,
          slug
        },
        "Workspace host did not resolve to an active workspace"
      );

      return null;
    }

    return this.ensureWorkspaceAccess(workspace, normalizedHost);
  }

  describeWorkspace(workspace: Pick<Workspace, "slug" | "domain">, resolvedHost?: string | null): WorkspaceAccessInfo {
    const hostname = workspace.domain ?? buildWorkspaceHostname(workspace.slug, this.env.VEXUS_BASE_DOMAIN);

    return {
      slug: workspace.slug,
      hostname,
      publicUrl:
        buildWorkspacePublicUrl({
          baseDomain: this.env.VEXUS_BASE_DOMAIN,
          hostname,
          protocol: this.env.VEXUS_PUBLIC_PROTOCOL
        }) ?? `${this.env.VEXUS_PUBLIC_PROTOCOL}://${hostname}`,
      baseDomain: this.env.VEXUS_BASE_DOMAIN,
      resolvedHost: normalizeWorkspaceHost(resolvedHost),
      matchedBySubdomain: normalizeWorkspaceHost(resolvedHost) === hostname
    };
  }

  async generateUniqueWorkspaceSlug(seed: string): Promise<string> {
    for (let attempt = 0; attempt < 64; attempt += 1) {
      const candidate = this.createUserSlugFromSeed(seed, attempt);
      const existing = await this.prisma.workspace.findUnique({
        where: {
          slug: candidate
        },
        select: {
          id: true
        }
      });

      if (!existing) {
        return candidate;
      }
    }

    throw new HttpError(500, "Could not allocate a unique workspace subdomain.", "WORKSPACE_SLUG_UNAVAILABLE");
  }

  private shouldRegenerateWorkspaceSlug(slug: string): boolean {
    const normalized = slugify(slug);

    if (!normalized) {
      return true;
    }

    if (normalized === slugify(this.env.DEFAULT_WORKSPACE_SLUG)) {
      return true;
    }

    return isReservedWorkspaceSlug(normalized);
  }

  private async generateUniqueWorkspaceSlugForWorkspace(workspace: Workspace): Promise<string> {
    const setupState = await this.prisma.setupState.findUnique({
      where: {
        workspaceId: workspace.id
      }
    });
    const seedBase = [
      workspace.id,
      workspace.name,
      setupState?.adminEmail,
      this.env.DEFAULT_ADMIN_EMAIL
    ]
      .filter(Boolean)
      .join(":");

    for (let attempt = 0; attempt < 64; attempt += 1) {
      const candidate = this.createUserSlugFromSeed(seedBase, attempt);
      const existing = await this.prisma.workspace.findUnique({
        where: {
          slug: candidate
        },
        select: {
          id: true
        }
      });

      if (!existing || existing.id === workspace.id) {
        return candidate;
      }
    }

    throw new HttpError(500, "Could not allocate a unique workspace subdomain.", "WORKSPACE_SLUG_UNAVAILABLE");
  }

  private createUserSlugFromSeed(seed: string, attempt: number): string {
    const hash = createHash("sha256")
      .update(`${seed}:${attempt}`)
      .digest("hex");
    const numeric = (parseInt(hash.slice(0, 8), 16) % 90000) + 10000;

    return `user${numeric}`;
  }
}
