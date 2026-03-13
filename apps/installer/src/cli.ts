import { InstallerApiClient } from "./api-client";
import {
  claimSelfHostProvisioningWithToken,
  issueInstallToken,
  loadEnvFileIfPresent,
  runBootstrapPrompts,
  runBootstrapSequence
} from "./bootstrap";
import { buildPublicDomain, renderEnvTemplate, slugify } from "./env-template";
import type { ParsedArgs } from "./types";

function printHelp() {
  console.log(`VEXUSCLAW installer CLI

Usage:
  vexus-installer bootstrap run [flags]
  vexus-installer env render [flags]
  vexus-installer claim [flags]
  vexus-installer install-token issue [flags]
  vexus-installer doctor [flags]

Flags:
  --base-url <url>              API base URL for setup/bootstrap, ex: http://127.0.0.1/api/v1
  --domain <domain>             Base domain for the workspace, ex: vexusclaw.com
  --public-domain <domain>      Explicit public hostname, ex: user33260.vexusclaw.com
  --workspace <slug>            Workspace slug
  --workspace-name <name>       Workspace name
  --admin-name <name>           Initial admin name
  --email <email>               Initial admin email
  --password <password>         Initial admin password
  --provider <openai|mock|chatgpt-oauth>
  --openai-api-key <key>        OpenAI key for provider openai
  --skip-default-agent          Finalize setup without creating a default agent
  --skip-whatsapp               Skip primary WhatsApp provisioning during finalize
  --non-interactive             Do not prompt for missing values
  --api-base-url <url>          Provisioning API base URL, ex: https://vexusclaw.com/api/v1
  --install-token <token>       Self-host install token
  --ip <address>                Public IP to register for self-host DNS
  --slug <slug>                 Existing self-host claim slug to update
  --label <label>               Label used when issuing an install token
  --metadata-json <json>        JSON metadata for issued install token
  --expires-at <iso-date>       Expiration for issued install token
`);
}

function parseArgs(argv: string[]): ParsedArgs {
  const command: string[] = [];
  const flags: Record<string, string | boolean> = {};

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];

    if (!value) {
      continue;
    }

    if (!value.startsWith("--")) {
      command.push(value);
      continue;
    }

    const key = value.slice(2);
    const next = argv[index + 1];

    if (!next || next.startsWith("--")) {
      flags[key] = true;
      continue;
    }

    flags[key] = next;
    index += 1;
  }

  return {
    command,
    flags
  };
}

function getString(flags: Record<string, string | boolean>, key: string): string | undefined {
  const value = flags[key];
  return typeof value === "string" ? value : undefined;
}

function getBoolean(flags: Record<string, string | boolean>, key: string): boolean {
  return flags[key] === true;
}

async function printDoctor(baseUrl?: string) {
  await loadEnvFileIfPresent();
  const resolvedBaseUrl = baseUrl ?? `${process.env.VEXUS_PUBLIC_URL ?? "http://localhost"}/api/v1`;
  const api = new InstallerApiClient(resolvedBaseUrl.replace(/\/+$/, ""));

  const [setup, health] = await Promise.all([
    api.get("/setup/status").catch((error) => ({ error: error.message })),
    fetch(`${resolvedBaseUrl.replace(/\/api\/v1$/, "")}/health`).then(async (response) => ({
      ok: response.ok,
      payload: await response.json().catch(() => null),
      status: response.status
    })).catch((error) => ({ ok: false, payload: error instanceof Error ? error.message : String(error), status: 0 }))
  ]);

  console.log(JSON.stringify({
    baseUrl: resolvedBaseUrl,
    health,
    setup
  }, null, 2));
}

async function handleEnvRender(flags: Record<string, string | boolean>) {
  const workspaceSlug = slugify(getString(flags, "workspace") ?? "mission-control");
  const baseDomain = getString(flags, "domain") ?? "vexusclaw.com";
  const publicDomain = getString(flags, "public-domain") ?? buildPublicDomain(workspaceSlug, baseDomain);
  const answers = getBoolean(flags, "non-interactive")
    ? {
        adminEmail: getString(flags, "email") ?? "owner@example.com",
        adminName: getString(flags, "admin-name") ?? "Owner",
        adminPassword: getString(flags, "password") ?? "ChangeMeNow123!",
        baseUrl: getString(flags, "base-url"),
        baseDomain,
        publicDomain,
        openAiApiKey: getString(flags, "openai-api-key"),
        provider: (getString(flags, "provider") as "openai" | "mock" | "chatgpt-oauth" | undefined) ?? "mock",
        skipDefaultAgent: getBoolean(flags, "skip-default-agent"),
        skipWhatsApp: getBoolean(flags, "skip-whatsapp"),
        workspaceName: getString(flags, "workspace-name") ?? "VEXUSCLAW Workspace",
        workspaceSlug
      }
    : await runBootstrapPrompts({
        adminEmail: getString(flags, "email"),
        adminName: getString(flags, "admin-name"),
        adminPassword: getString(flags, "password"),
        baseUrl: getString(flags, "base-url"),
        baseDomain,
        publicDomain,
        openAiApiKey: getString(flags, "openai-api-key"),
        provider: getString(flags, "provider") as "openai" | "mock" | "chatgpt-oauth" | undefined,
        skipDefaultAgent: getBoolean(flags, "skip-default-agent"),
        skipWhatsApp: getBoolean(flags, "skip-whatsapp"),
        workspaceName: getString(flags, "workspace-name"),
        workspaceSlug: getString(flags, "workspace")
      });

  console.log(renderEnvTemplate({
    adminEmail: answers.adminEmail,
    adminPassword: answers.adminPassword,
    baseDomain: answers.baseDomain,
    cookieDomain: getString(flags, "cookie-domain") ?? "",
    openAiApiKey: answers.openAiApiKey,
    publicDomain: answers.publicDomain,
    protocol: getString(flags, "protocol") === "http" ? "http" : "https",
    provider: answers.provider,
    workspaceSlug: answers.workspaceSlug
  }));
}

async function handleBootstrap(flags: Record<string, string | boolean>) {
  const result = await runBootstrapSequence({
    adminEmail: getString(flags, "email"),
    adminName: getString(flags, "admin-name"),
    adminPassword: getString(flags, "password"),
    baseUrl: getString(flags, "base-url"),
    baseDomain: getString(flags, "domain"),
    publicDomain: getString(flags, "public-domain"),
    nonInteractive: getBoolean(flags, "non-interactive"),
    openAiApiKey: getString(flags, "openai-api-key"),
    provider: (getString(flags, "provider") as "openai" | "mock" | "chatgpt-oauth" | undefined) ?? "mock",
    skipDefaultAgent: getBoolean(flags, "skip-default-agent"),
    skipWhatsApp: getBoolean(flags, "skip-whatsapp"),
    workspaceName: getString(flags, "workspace-name"),
    workspaceSlug: getString(flags, "workspace")
  });

  console.log(JSON.stringify(result, null, 2));
}

async function handleClaim(flags: Record<string, string | boolean>) {
  const installToken = getString(flags, "install-token");

  if (!installToken) {
    throw new Error("The --install-token flag is required.");
  }

  const payload = await claimSelfHostProvisioningWithToken({
    apiBaseUrl: getString(flags, "api-base-url") ?? "https://vexusclaw.com/api/v1",
    installToken,
    ipAddress: getString(flags, "ip"),
    slug: getString(flags, "slug")
  });

  console.log(JSON.stringify(payload, null, 2));
}

async function handleIssueInstallToken(flags: Record<string, string | boolean>) {
  const label = getString(flags, "label");

  if (!label) {
    throw new Error("The --label flag is required.");
  }

  const result = await issueInstallToken({
    email: getString(flags, "email"),
    expiresAt: getString(flags, "expires-at"),
    label,
    metadataJson: getString(flags, "metadata-json")
  });

  console.log(JSON.stringify(result, null, 2));
}

export async function runCli(argv = process.argv.slice(2)) {
  const parsed = parseArgs(argv);
  const [scope, action] = parsed.command;

  if (getBoolean(parsed.flags, "help")) {
    printHelp();
    return;
  }

  if (!scope || (scope === "bootstrap" && !action)) {
    await handleBootstrap(parsed.flags);
    return;
  }

  if (scope === "env" && action === "render") {
    await handleEnvRender(parsed.flags);
    return;
  }

  if (scope === "bootstrap" && action === "run") {
    await handleBootstrap(parsed.flags);
    return;
  }

  if (scope === "claim") {
    await handleClaim(parsed.flags);
    return;
  }

  if (scope === "install-token" && action === "issue") {
    await handleIssueInstallToken(parsed.flags);
    return;
  }

  if (scope === "doctor") {
    await printDoctor(getString(parsed.flags, "base-url"));
    return;
  }

  throw new Error(`Unknown command: ${parsed.command.join(" ")}`);
}
