import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";

import type { VexusEnv } from "@vexus/config";
import { SkillStatus } from "@vexus/db";
import type { Prisma, PrismaClient } from "@vexus/db";

import type { ClawHubInspectResult, WorkspaceSkillPaths, WorkspaceSkillSummary } from "../types";

interface ClawHubLockfile {
  skills: Record<
    string,
    {
      installedAt?: number;
      version?: string;
    }
  >;
  version: number;
}

function titleizeSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function resolveWorkspaceSkillPaths(env: VexusEnv, workspaceId: string): WorkspaceSkillPaths {
  const workspaceRoot = path.join(env.FILE_STORAGE_PATH, "workspaces", workspaceId);

  return {
    lockfilePath: path.join(workspaceRoot, ".clawhub", "lock.json"),
    skillsDir: path.join(workspaceRoot, "skills"),
    workspaceRoot
  };
}

export async function ensureWorkspaceSkillPaths(
  env: VexusEnv,
  workspaceId: string
): Promise<WorkspaceSkillPaths> {
  const paths = resolveWorkspaceSkillPaths(env, workspaceId);

  await mkdir(paths.workspaceRoot, { recursive: true });
  await mkdir(path.dirname(paths.lockfilePath), { recursive: true });
  await mkdir(paths.skillsDir, { recursive: true });

  return paths;
}

export async function readWorkspaceSkillLockfile(
  env: VexusEnv,
  workspaceId: string
): Promise<ClawHubLockfile> {
  const paths = await ensureWorkspaceSkillPaths(env, workspaceId);

  try {
    const content = await readFile(paths.lockfilePath, "utf8");
    const parsed = JSON.parse(content) as ClawHubLockfile;

    if (parsed && typeof parsed === "object" && parsed.version === 1 && parsed.skills) {
      return parsed;
    }
  } catch {
    // Ignore invalid or missing lockfile and treat it as empty.
  }

  return {
    skills: {},
    version: 1
  };
}

export async function upsertSkillFromClawHubInspect(input: {
  inspect: ClawHubInspectResult;
  prisma: PrismaClient;
}) {
  const slug = input.inspect.skill?.slug?.trim();

  if (!slug) {
    throw new Error("Claw Hub inspect payload is missing the skill slug.");
  }

  const name = input.inspect.skill?.displayName?.trim() || titleizeSlug(slug);
  const version = input.inspect.latestVersion?.version?.trim() || "latest";
  const description = input.inspect.skill?.summary?.trim() || "Installed via Claw Hub.";
  const author =
    input.inspect.owner?.displayName?.trim() || input.inspect.owner?.handle?.trim() || "ClawHub";

  return input.prisma.skill.upsert({
    where: {
      slug
    },
    update: {
      author,
      category: "clawhub",
      description,
      manifest: input.inspect as unknown as Prisma.InputJsonValue,
      name,
      requiredPermissions: [],
      status: SkillStatus.PUBLISHED,
      version
    },
    create: {
      author,
      category: "clawhub",
      description,
      manifest: input.inspect as unknown as Prisma.InputJsonValue,
      name,
      requiredPermissions: [],
      slug,
      status: SkillStatus.PUBLISHED,
      version
    }
  });
}

export async function syncWorkspaceInstalledSkills(input: {
  env: VexusEnv;
  prisma: PrismaClient;
  workspaceId: string;
}): Promise<WorkspaceSkillSummary[]> {
  const lockfile = await readWorkspaceSkillLockfile(input.env, input.workspaceId);
  const slugs = Object.keys(lockfile.skills);
  const knownSkills = await input.prisma.skill.findMany({
    where: slugs.length > 0 ? { slug: { in: slugs } } : undefined
  });
  const skillBySlug = new Map(knownSkills.map((skill) => [skill.slug, skill]));

  for (const slug of slugs) {
    if (skillBySlug.has(slug)) {
      continue;
    }

    const entry = lockfile.skills[slug];

    if (!entry) {
      continue;
    }

    const skill = await input.prisma.skill.create({
      data: {
        author: "ClawHub",
        category: "clawhub",
        description: "Installed via Claw Hub.",
        manifest: {
          slug,
          source: "clawhub-lock"
        },
        name: titleizeSlug(slug),
        requiredPermissions: [],
        slug,
        status: SkillStatus.PUBLISHED,
        version: entry.version ?? "latest"
      }
    });

    skillBySlug.set(slug, skill);
  }

  const installedSkills: WorkspaceSkillSummary[] = [];

  for (const slug of slugs) {
    const entry = lockfile.skills[slug];

    if (!entry) {
      continue;
    }

    const skill = skillBySlug.get(slug);

    if (!skill) {
      continue;
    }

    await input.prisma.installedSkill.upsert({
      where: {
        workspaceId_skillId: {
          skillId: skill.id,
          workspaceId: input.workspaceId
        }
      },
      update: {
        deletedAt: null,
        status: SkillStatus.PUBLISHED,
        version: entry.version ?? skill.version
      },
      create: {
        skillId: skill.id,
        status: SkillStatus.PUBLISHED,
        version: entry.version ?? skill.version,
        workspaceId: input.workspaceId
      }
    });

    installedSkills.push({
      author: skill.author,
      category: skill.category,
      description: skill.description,
      installed: true,
      installedAt:
        typeof entry.installedAt === "number" ? new Date(entry.installedAt).toISOString() : undefined,
      installedVersion: entry.version ?? skill.version,
      name: skill.name,
      slug: skill.slug,
      version: skill.version
    });
  }

  if (slugs.length > 0) {
    await input.prisma.installedSkill.updateMany({
      where: {
        deletedAt: null,
        skill: {
          slug: {
            notIn: slugs
          }
        },
        workspaceId: input.workspaceId
      },
      data: {
        deletedAt: new Date()
      }
    });
  }

  return installedSkills.sort((left, right) => left.slug.localeCompare(right.slug));
}

export async function loadWorkspaceSkillSummaries(input: {
  env: VexusEnv;
  mode: "all" | "installed";
  prisma: PrismaClient;
  workspaceId: string;
}): Promise<WorkspaceSkillSummary[]> {
  const installed = await syncWorkspaceInstalledSkills(input);

  if (input.mode === "installed") {
    return installed;
  }

  const skills = await input.prisma.skill.findMany({
    where: {
      status: SkillStatus.PUBLISHED
    },
    orderBy: [
      {
        updatedAt: "desc"
      },
      {
        slug: "asc"
      }
    ]
  });
  const installedBySlug = new Map(installed.map((skill) => [skill.slug, skill]));

  return skills.map((skill) => {
    const installedEntry = installedBySlug.get(skill.slug);

    return {
      author: skill.author,
      category: skill.category,
      description: skill.description,
      installed: Boolean(installedEntry),
      installedAt: installedEntry?.installedAt,
      installedVersion: installedEntry?.installedVersion,
      name: skill.name,
      slug: skill.slug,
      version: skill.version
    };
  });
}
