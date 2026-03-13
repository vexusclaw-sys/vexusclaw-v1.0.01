function truncate(value: string, max = 140): string {
  const trimmed = value.trim();

  if (trimmed.length <= max) {
    return trimmed;
  }

  return `${trimmed.slice(0, max - 1).trimEnd()}...`;
}

export function formatCommandList(): string {
  return [
    "Commands",
    "/help",
    "/commands",
    "/agents",
    "/agent <slug|#>",
    "/models",
    "/model <provider/model|#|status>",
    "/skills",
    "/skills clawhub [newest|downloads|rating|installs|installsalltime|trending]",
    "/skills list",
    "/skills installed",
    "/skills search <query>",
    "/skills inspect <slug>",
    "/skills install <slug> [version=x]",
    "",
    "Mutating commands require allowlist authorization."
  ].join("\n");
}

export function formatAgentList(input: {
  agents: Array<{
    isDefault: boolean;
    isSelected: boolean;
    name: string;
    slug: string;
    status: string;
  }>;
}): string {
  if (input.agents.length === 0) {
    return "No agents are available in this workspace.";
  }

  return [
    `Agents (${input.agents.length})`,
    ...input.agents.map((agent, index) => {
      const tags = [
        agent.isSelected ? "current" : null,
        agent.isDefault ? "default" : null,
        agent.status
      ].filter(Boolean);

      return `${index + 1}. ${agent.name} (${agent.slug})${tags.length ? ` [${tags.join(", ")}]` : ""}`;
    }),
    "",
    "Use /agent <slug|#> to switch the conversation agent."
  ].join("\n");
}

export function formatAgentStatus(input: {
  currentAgentName: string;
  currentAgentSlug: string;
}): string {
  return `Current agent: ${input.currentAgentName} (${input.currentAgentSlug})`;
}

export function formatModelList(input: {
  current: string;
  models: Array<{
    connectionLabel: string;
    isCurrent: boolean;
    isDefault: boolean;
    key: string;
    source: string;
  }>;
  truncatedCount: number;
}): string {
  if (input.models.length === 0) {
    return "No models are available from the connected providers.";
  }

  const lines = [
    `Models (${input.models.length}${input.truncatedCount > 0 ? ` shown, ${input.truncatedCount} hidden` : ""})`,
    `Current: ${input.current}`
  ];

  lines.push(
    ...input.models.map((model, index) => {
      const tags = [
        model.isCurrent ? "current" : null,
        model.isDefault ? "default" : null,
        model.connectionLabel,
        model.source
      ].filter(Boolean);

      return `${index + 1}. ${model.key}${tags.length ? ` [${tags.join(", ")}]` : ""}`;
    })
  );

  lines.push("");
  lines.push("Use /model <provider/model|#>. Use /model status to inspect the current selection.");

  return lines.join("\n");
}

export function formatModelStatus(input: {
  current: string;
  defaultModel: string;
  hasOverride: boolean;
}): string {
  return [
    `Current model: ${input.current}`,
    `Default model: ${input.defaultModel}`,
    `Override: ${input.hasOverride ? "enabled" : "off"}`
  ].join("\n");
}

export function formatSkillsOverview(input: {
  items: Array<{
    author: string;
    description: string;
    installed: boolean;
    installedVersion?: string;
    name: string;
    slug: string;
    version: string;
  }>;
  mode: "all" | "installed";
}): string {
  if (input.items.length === 0) {
    return input.mode === "installed"
      ? "No skills are installed in this workspace."
      : "No skills are known yet. Use /skills search <query> to look in Claw Hub.";
  }

  const title = input.mode === "installed" ? `Installed skills (${input.items.length})` : `Skills (${input.items.length})`;

  return [
    title,
    ...input.items.map((skill, index) => {
      const tags = [
        skill.installed ? `installed:${skill.installedVersion ?? skill.version}` : null,
        skill.author
      ].filter(Boolean);

      return `${index + 1}. ${skill.slug} - ${skill.name}${tags.length ? ` [${tags.join(", ")}]` : ""}\n   ${truncate(skill.description)}`;
    }),
    "",
    "Use /skills search <query>, /skills inspect <slug>, or /skills install <slug>."
  ].join("\n");
}

export function formatClawHubSearchResults(results: Array<{
  displayName: string;
  score: number;
  slug: string;
  version?: string;
}>): string {
  if (results.length === 0) {
    return "No Claw Hub skills matched this query.";
  }

  return [
    `Claw Hub results (${results.length})`,
    ...results.map((entry, index) => {
      const version = entry.version ? ` v${entry.version}` : "";
      return `${index + 1}. ${entry.slug}${version} - ${entry.displayName} (${entry.score.toFixed(3)})`;
    }),
    "",
    "Use /skills inspect <slug> or /skills install <slug>."
  ].join("\n");
}

export function formatClawHubInspect(input: {
  author: string;
  changelog?: string;
  createdAt?: string;
  downloads?: number;
  name: string;
  slug: string;
  summary: string;
  updatedAt?: string;
  version: string;
}): string {
  const lines = [
    `${input.name} (${input.slug})`,
    `Version: ${input.version}`,
    `Author: ${input.author}`,
    input.createdAt ? `Created: ${input.createdAt}` : null,
    input.updatedAt ? `Updated: ${input.updatedAt}` : null,
    typeof input.downloads === "number" ? `Downloads: ${input.downloads}` : null,
    "",
    truncate(input.summary, 280)
  ].filter(Boolean) as string[];

  if (input.changelog) {
    lines.push("");
    lines.push(`Changelog: ${truncate(input.changelog, 220)}`);
  }

  lines.push("");
  lines.push("Use /skills install <slug> to install this skill.");

  return lines.join("\n");
}

export function formatClawHubExploreResults(input: {
  items: Array<{
    displayName: string;
    downloads?: number;
    installsAllTime?: number;
    slug: string;
    stars?: number;
    summary?: string | null;
    version?: string;
  }>;
  sort: string;
}): string {
  if (input.items.length === 0) {
    return "ClawHub did not return any remote skills right now.";
  }

  const sortLabelMap: Record<string, string> = {
    downloads: "downloads",
    installs: "installs",
    installsalltime: "installs all time",
    newest: "newest",
    rating: "rating",
    trending: "trending"
  };
  const sortLabel = sortLabelMap[input.sort.toLowerCase()] ?? input.sort;

  return [
    `ClawHub - Skills disponiveis (${sortLabel})`,
    ...input.items.map((entry, index) => {
      const version = entry.version ? ` v${entry.version}` : "";
      const stats = [
        typeof entry.downloads === "number" ? `downloads:${entry.downloads}` : null,
        typeof entry.installsAllTime === "number" ? `installs:${entry.installsAllTime}` : null,
        typeof entry.stars === "number" ? `stars:${entry.stars}` : null
      ].filter(Boolean);

      return `${index + 1}. ${entry.slug}${version} - ${entry.displayName}${stats.length ? ` [${stats.join(", ")}]` : ""}\n   ${truncate(entry.summary ?? "No summary available.")}`;
    }),
    "",
    "Use /skills inspect <slug> or /skills install <slug> [version=x].",
    "Tip: /skills clawhub trending"
  ].join("\n");
}

export function formatSkillInstallSuccess(input: {
  name: string;
  slug: string;
  version: string;
}): string {
  return `Installed ${input.name} (${input.slug}) v${input.version}.`;
}

export function formatCommandError(message: string): string {
  return `Command failed: ${truncate(message, 260)}`;
}
