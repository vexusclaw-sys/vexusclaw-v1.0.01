import { formatUnauthorizedMutationReply, isCommandMutationAllowed } from "../auth";
import {
  formatClawHubExploreResults,
  formatClawHubInspect,
  formatClawHubSearchResults,
  formatSkillInstallSuccess,
  formatSkillsOverview
} from "../format";
import {
  exploreClawHubSkills,
  inspectClawHubSkill,
  installClawHubSkill,
  searchClawHubSkills
} from "../services/clawhub-cli";
import {
  ensureWorkspaceSkillPaths,
  loadWorkspaceSkillSummaries,
  syncWorkspaceInstalledSkills,
  upsertSkillFromClawHubInspect
} from "../services/skill-workspace";
import type { ConversationCommandContext, ConversationCommandResult, ParsedSlashCommand } from "../types";

function readVersionFlag(tokens: string[]): string | undefined {
  const versionToken = tokens.find((token) => token.toLowerCase().startsWith("version="));
  const version = versionToken?.slice(versionToken.indexOf("=") + 1).trim();

  return version || undefined;
}

function normalizeClawHubSort(value?: string):
  | "downloads"
  | "installs"
  | "installsAllTime"
  | "newest"
  | "rating"
  | "trending" {
  const normalized = value?.trim().toLowerCase();

  switch (normalized) {
    case "downloads":
      return "downloads";
    case "installs":
      return "installs";
    case "installsalltime":
    case "installs-all-time":
    case "alltime":
      return "installsAllTime";
    case "rating":
      return "rating";
    case "trending":
      return "trending";
    case "newest":
    default:
      return "newest";
  }
}

export async function handleSkillCommands(input: {
  command: ParsedSlashCommand;
  context: ConversationCommandContext;
}): Promise<ConversationCommandResult | null> {
  if (input.command.name !== "skills") {
    return null;
  }

  const [subcommand = "list", ...rest] = input.command.tokens;
  const normalizedSubcommand = subcommand.toLowerCase();
  const paths = await ensureWorkspaceSkillPaths(input.context.env, input.context.workspaceId);

  if (normalizedSubcommand === "list") {
    const skills = await loadWorkspaceSkillSummaries({
      env: input.context.env,
      mode: "all",
      prisma: input.context.prisma,
      workspaceId: input.context.workspaceId
    });

    return {
      command: input.command,
      reply: formatSkillsOverview({
        items: skills,
        mode: "all"
      })
    };
  }

  if (normalizedSubcommand === "clawhub" || normalizedSubcommand === "hub") {
    const sort = normalizeClawHubSort(rest[0]);
    const items = await exploreClawHubSkills({
      cwd: paths.workspaceRoot,
      limit: 12,
      sort
    });

    return {
      command: input.command,
      reply: formatClawHubExploreResults({
        items: items.map((item) => ({
          displayName: item.displayName,
          downloads: item.stats?.downloads,
          installsAllTime: item.stats?.installsAllTime,
          slug: item.slug,
          stars: item.stats?.stars,
          summary: item.summary,
          version: item.latestVersion?.version
        })),
        sort
      })
    };
  }

  if (normalizedSubcommand === "installed") {
    const skills = await loadWorkspaceSkillSummaries({
      env: input.context.env,
      mode: "installed",
      prisma: input.context.prisma,
      workspaceId: input.context.workspaceId
    });

    return {
      command: input.command,
      reply: formatSkillsOverview({
        items: skills,
        mode: "installed"
      })
    };
  }

  if (normalizedSubcommand === "search") {
    const query = rest.join(" ").trim();

    if (!query) {
      return {
        command: input.command,
        reply: "Usage: /skills search <query>"
      };
    }

    const results = await searchClawHubSkills({
      cwd: paths.workspaceRoot,
      limit: 8,
      query
    });

    return {
      command: input.command,
      reply: formatClawHubSearchResults(results)
    };
  }

  if (normalizedSubcommand === "inspect") {
    const slug = rest[0]?.trim();

    if (!slug) {
      return {
        command: input.command,
        reply: "Usage: /skills inspect <slug>"
      };
    }

    const inspect = await inspectClawHubSkill({
      cwd: paths.workspaceRoot,
      slug,
      version: readVersionFlag(rest.slice(1))
    });

    await upsertSkillFromClawHubInspect({
      inspect,
      prisma: input.context.prisma
    });

    return {
      command: input.command,
      reply: formatClawHubInspect({
        author:
          inspect.owner?.displayName?.trim() || inspect.owner?.handle?.trim() || "ClawHub",
        changelog: inspect.latestVersion?.changelog ?? undefined,
        createdAt:
          typeof inspect.skill?.createdAt === "number"
            ? new Date(inspect.skill.createdAt).toISOString()
            : undefined,
        downloads: inspect.skill?.stats?.downloads,
        name: inspect.skill?.displayName?.trim() || slug,
        slug: inspect.skill?.slug?.trim() || slug,
        summary: inspect.skill?.summary?.trim() || "No summary available.",
        updatedAt:
          typeof inspect.skill?.updatedAt === "number"
            ? new Date(inspect.skill.updatedAt).toISOString()
            : undefined,
        version: inspect.latestVersion?.version?.trim() || "latest"
      })
    };
  }

  if (normalizedSubcommand === "install") {
    if (
      !isCommandMutationAllowed({
        channelConfig: input.context.channelConnection.config,
        env: input.context.env,
        externalUserId: input.context.externalUserId
      })
    ) {
      return {
        command: input.command,
        reply: formatUnauthorizedMutationReply()
      };
    }

    const slug = rest[0]?.trim();

    if (!slug) {
      return {
        command: input.command,
        reply: "Usage: /skills install <slug> [version=x]"
      };
    }

    const version = readVersionFlag(rest.slice(1));

    await installClawHubSkill({
      slug,
      version,
      workspaceRoot: paths.workspaceRoot
    });

    const inspect = await inspectClawHubSkill({
      cwd: paths.workspaceRoot,
      slug,
      version
    });
    const skill = await upsertSkillFromClawHubInspect({
      inspect,
      prisma: input.context.prisma
    });

    await syncWorkspaceInstalledSkills({
      env: input.context.env,
      prisma: input.context.prisma,
      workspaceId: input.context.workspaceId
    });

    return {
      command: input.command,
      reply: formatSkillInstallSuccess({
        name: skill.name,
        slug: skill.slug,
        version: version || inspect.latestVersion?.version?.trim() || skill.version
      })
    };
  }

  return {
    command: input.command,
    reply:
      "Unknown /skills subcommand. Use clawhub, list, installed, search, inspect, or install."
  };
}
