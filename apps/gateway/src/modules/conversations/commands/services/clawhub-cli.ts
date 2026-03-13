import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

import type { ClawHubExploreItem, ClawHubInspectResult, ClawHubSearchResult } from "../types";

const execFileAsync = promisify(execFile);
const bundledClawHubBin = fileURLToPath(new URL("../../../../../node_modules/.bin/clawhub", import.meta.url));

function extractJsonPayload(output: string): string {
  const start = output.indexOf("{");
  const end = output.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Claw Hub did not return a JSON payload.");
  }

  return output.slice(start, end + 1);
}

function parseSearchResults(output: string): ClawHubSearchResult[] {
  const results: ClawHubSearchResult[] = [];

  for (const line of output.split("\n").map((entry) => entry.trim())) {
    if (!line || line.startsWith("- ")) {
      continue;
    }

    const parts = line.split(/\s{2,}/g).filter(Boolean);

    if (parts.length < 3) {
      continue;
    }

    const slugAndVersion = parts[0];
    const displayName = parts[1];
    const scorePart = parts[parts.length - 1];

    if (!slugAndVersion || !displayName || !scorePart) {
      continue;
    }

    const slugMatch = /^(?<slug>[a-z0-9][a-z0-9-]*)(?:\s+v(?<version>[^\s]+))?$/i.exec(slugAndVersion);
    const score = Number.parseFloat(scorePart.replace(/[()]/g, ""));

    if (!slugMatch?.groups?.slug || !Number.isFinite(score)) {
      continue;
    }

    results.push({
      displayName,
      score,
      slug: slugMatch.groups.slug,
      version: slugMatch.groups.version
    });
  }

  return results;
}

async function runClawHub(args: string[], cwd: string): Promise<string> {
  const candidates = [
    { command: bundledClawHubBin, args },
    { command: "clawhub", args },
    { command: "pnpm", args: ["exec", "clawhub", ...args] }
  ];
  let lastError: Error | null = null;

  for (const candidate of candidates) {
    try {
      const result = await execFileAsync(candidate.command, candidate.args, {
        cwd,
        maxBuffer: 1024 * 1024,
        timeout: 60_000
      });

      return `${result.stdout ?? ""}${result.stderr ?? ""}`.trim();
    } catch (error) {
      const code =
        typeof error === "object" && error && "code" in error ? String((error as { code?: string }).code) : "";

      if (code === "ENOENT") {
        lastError = error instanceof Error ? error : new Error(String(error));
        continue;
      }

      const stdout =
        typeof error === "object" && error && "stdout" in error ? String((error as { stdout?: string }).stdout ?? "") : "";
      const stderr =
        typeof error === "object" && error && "stderr" in error ? String((error as { stderr?: string }).stderr ?? "") : "";
      const combined = [stdout, stderr]
        .map((value) => value.trim())
        .filter(Boolean)
        .join("\n");

      throw new Error(combined || (error instanceof Error ? error.message : "Claw Hub command failed."));
    }
  }

  throw lastError ?? new Error("Claw Hub CLI is not available in the gateway runtime.");
}

function extractJsonObject<T>(output: string): T {
  return JSON.parse(extractJsonPayload(output)) as T;
}

type ClawHubExploreSort = "downloads" | "installs" | "installsAllTime" | "newest" | "rating" | "trending";

interface ClawHubExploreResponse {
  items?: ClawHubExploreItem[];
}

export async function searchClawHubSkills(input: {
  cwd: string;
  limit?: number;
  query: string;
}): Promise<ClawHubSearchResult[]> {
  const args = ["search", input.query];

  if (typeof input.limit === "number" && Number.isFinite(input.limit)) {
    args.push("--limit", String(input.limit));
  }

  const output = await runClawHub(args, input.cwd);
  return parseSearchResults(output);
}

export async function inspectClawHubSkill(input: {
  cwd: string;
  slug: string;
  version?: string;
}): Promise<ClawHubInspectResult> {
  const args = ["inspect", input.slug, "--json"];

  if (input.version) {
    args.push("--version", input.version);
  }

  const output = await runClawHub(args, input.cwd);
  return extractJsonObject<ClawHubInspectResult>(output);
}

export async function exploreClawHubSkills(input: {
  cwd: string;
  limit?: number;
  sort?: ClawHubExploreSort;
}): Promise<ClawHubExploreItem[]> {
  const args = ["explore", "--json"];

  if (typeof input.limit === "number" && Number.isFinite(input.limit)) {
    args.push("--limit", String(input.limit));
  }

  if (input.sort) {
    args.push("--sort", input.sort);
  }

  const output = await runClawHub(args, input.cwd);
  const payload = extractJsonObject<ClawHubExploreResponse>(output);
  return Array.isArray(payload.items) ? payload.items : [];
}

export async function installClawHubSkill(input: {
  skillsDirName?: string;
  slug: string;
  version?: string;
  workspaceRoot: string;
}): Promise<void> {
  const args = [
    "--workdir",
    input.workspaceRoot,
    "--dir",
    input.skillsDirName ?? "skills",
    "--no-input",
    "install",
    input.slug
  ];

  if (input.version) {
    args.push("--version", input.version);
  }

  await runClawHub(args, input.workspaceRoot);
}
