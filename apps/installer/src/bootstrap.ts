import { readFile } from "node:fs/promises";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

import { PrismaClient } from "@vexus/db";
import { generateOpaqueToken, hashOpaqueToken } from "@vexus/auth";

import { InstallerApiClient } from "./api-client";
import { buildPublicDomain, slugify } from "./env-template";
import type {
  BootstrapAnswers,
  BootstrapRunOptions,
  IssueInstallTokenOptions,
  ProvisioningClaimOptions
} from "./types";

function isInteractive(): boolean {
  return Boolean(stdin.isTTY && stdout.isTTY);
}

function defaultWorkspaceName(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.slice(0, 1).toUpperCase() + part.slice(1))
    .join(" ") || "VEXUSCLAW Workspace";
}

export async function loadEnvFileIfPresent(path = ".env"): Promise<void> {
  const raw = await readFile(path, "utf8").catch(() => null);

  if (!raw) {
    return;
  }

  raw.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      return;
    }

    const separator = trimmed.indexOf("=");

    if (separator <= 0) {
      return;
    }

    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();

    if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  });
}

export async function runBootstrapPrompts(
  partial: Partial<BootstrapAnswers> = {}
): Promise<BootstrapAnswers> {
  if (!isInteractive()) {
    return {
      baseDomain: partial.baseDomain ?? "vexusclaw.com",
      publicDomain: partial.publicDomain,
      workspaceName: partial.workspaceName ?? "VEXUSCLAW Workspace",
      workspaceSlug: partial.workspaceSlug ?? "mission-control",
      adminName: partial.adminName ?? "Owner",
      adminEmail: partial.adminEmail ?? "owner@example.com",
      adminPassword: partial.adminPassword ?? "ChangeMeNow123!",
      provider: partial.provider ?? "mock",
      openAiApiKey: partial.openAiApiKey,
      skipWhatsApp: partial.skipWhatsApp ?? false,
      skipDefaultAgent: partial.skipDefaultAgent ?? true,
      baseUrl: partial.baseUrl
    };
  }

  const rl = createInterface({ input: stdin, output: stdout });
  const workspaceSlug = slugify(
    partial.workspaceSlug ??
      ((await rl.question("Workspace slug [mission-control]: ")) || "mission-control")
  );
  const workspaceName =
    partial.workspaceName ??
    ((await rl.question(`Workspace name [${defaultWorkspaceName(workspaceSlug)}]: `)) ||
      defaultWorkspaceName(workspaceSlug));
  const baseDomain =
    partial.baseDomain ??
    ((await rl.question("Base domain [vexusclaw.com]: ")) ||
      "vexusclaw.com");
  const adminName =
    partial.adminName ??
    ((await rl.question("Admin name [Owner]: ")) || "Owner");
  const adminEmail =
    partial.adminEmail ??
    ((await rl.question("Admin email [owner@example.com]: ")) || "owner@example.com");
  const adminPassword =
    partial.adminPassword ??
    ((await rl.question("Initial admin password [ChangeMeNow123!]: ")) || "ChangeMeNow123!");
  const providerRaw =
    partial.provider ??
    (((await rl.question("Provider [mock/openai/chatgpt-oauth]: ")) || "mock") as BootstrapAnswers["provider"]);
  const provider = providerRaw === "openai" || providerRaw === "chatgpt-oauth" ? providerRaw : "mock";
  const openAiApiKey =
    provider === "openai"
      ? partial.openAiApiKey ?? (await rl.question("OpenAI API key [optional]: "))
      : partial.openAiApiKey;
  const skipWhatsAppAnswer = String(
    partial.skipWhatsApp ?? ((await rl.question("Skip WhatsApp provisioning? [y/N]: ")) || "n")
  ).toLowerCase();

  await rl.close();

  return {
    workspaceName,
    workspaceSlug,
    adminName,
    adminEmail,
    adminPassword,
    baseDomain,
    publicDomain: partial.publicDomain ?? buildPublicDomain(workspaceSlug, baseDomain),
    provider,
    openAiApiKey: openAiApiKey || undefined,
    skipWhatsApp: skipWhatsAppAnswer === "y" || skipWhatsAppAnswer === "yes",
    skipDefaultAgent: partial.skipDefaultAgent ?? true,
    baseUrl: partial.baseUrl
  };
}

function resolveBaseUrl(options: Partial<BootstrapRunOptions>): string {
  if (options.baseUrl) {
    return options.baseUrl.replace(/\/+$/, "");
  }

  const protocol = process.env.VEXUS_PUBLIC_PROTOCOL === "https" ? "https" : "http";
  const domain = options.publicDomain || process.env.VEXUS_DOMAIN || "localhost";

  return `${protocol}://${domain}/api/v1`;
}

export async function runBootstrapSequence(options: Partial<BootstrapRunOptions>) {
  const answers = options.nonInteractive
    ? {
        baseDomain: options.baseDomain ?? "vexusclaw.com",
        publicDomain: options.publicDomain,
        workspaceName: options.workspaceName ?? defaultWorkspaceName(options.workspaceSlug ?? "mission-control"),
        workspaceSlug: slugify(options.workspaceSlug ?? "mission-control"),
        adminName: options.adminName ?? "Owner",
        adminEmail: options.adminEmail ?? "owner@example.com",
        adminPassword: options.adminPassword ?? "ChangeMeNow123!",
        provider: options.provider ?? "mock",
        openAiApiKey: options.openAiApiKey,
        skipWhatsApp: options.skipWhatsApp ?? false,
        skipDefaultAgent: options.skipDefaultAgent ?? true,
        baseUrl: options.baseUrl
      }
    : await runBootstrapPrompts(options);

  const baseUrl = resolveBaseUrl({
    ...answers,
    baseUrl: options.baseUrl
  });
  const api = new InstallerApiClient(baseUrl);
  const status = await api.get<any>("/setup/status");

  let currentStatus = status;

  if (!currentStatus.isBootstrapped) {
    currentStatus = await api.post("/setup/bootstrap", {
      workspaceName: answers.workspaceName,
      domain: answers.publicDomain ?? buildPublicDomain(answers.workspaceSlug, answers.baseDomain),
      workspaceSlug: answers.workspaceSlug
    });
  }

  if (!currentStatus.adminConfigured) {
    const adminResult = await api.post<{
      session: unknown;
      setup: any;
    }>("/setup/admin", {
      email: answers.adminEmail,
      name: answers.adminName,
      password: answers.adminPassword
    });
    currentStatus = adminResult.setup;
  }

  if (!currentStatus.providerConfigured) {
    const providerType =
      answers.provider === "chatgpt-oauth"
        ? "chatgpt_oauth"
        : answers.provider;
    currentStatus = await api.post("/setup/provider", {
      providerType,
      mode:
        answers.provider === "openai"
          ? "api_key"
          : answers.provider === "chatgpt-oauth"
            ? "oauth_stub"
            : "skip",
      apiKey: answers.provider === "openai" ? answers.openAiApiKey : undefined,
      label:
        answers.provider === "openai"
          ? "OpenAI Primary"
          : answers.provider === "chatgpt-oauth"
            ? "ChatGPT OAuth"
            : "Mock Provider"
    });
  }

  if (!currentStatus.isReady) {
    currentStatus = await api.post("/setup/finalize",
      answers.skipDefaultAgent
        ? {
            createDefaultAgent: false,
            provisionWhatsApp: !answers.skipWhatsApp
          }
        : {
            agentName: `${answers.workspaceName} Agent`,
            agentRole: "operator",
            instructions:
              "You are the default VEXUSCLAW operator agent. Be concise, operational, and preserve context across the workspace.",
            tone: "direct",
            createDefaultAgent: true,
            provisionWhatsApp: !answers.skipWhatsApp
          }
    );
  }

  return {
    baseUrl,
    setup: currentStatus
  };
}

export async function claimSelfHostProvisioningWithToken(input: ProvisioningClaimOptions) {
  const api = new InstallerApiClient(input.apiBaseUrl.replace(/\/+$/, ""));
  const headers = {
    authorization: `Bearer ${input.installToken}`
  };

  if (input.slug) {
    return api.request(`/provisioning/self-host/claim/${input.slug}`, {
      body: {
        ipAddress: input.ipAddress
      },
      headers,
      method: "PUT"
    });
  }

  return api.request("/provisioning/self-host/claim", {
    body: {
      ipAddress: input.ipAddress
    },
    headers,
    method: "POST"
  });
}

export async function issueInstallToken(options: IssueInstallTokenOptions) {
  await loadEnvFileIfPresent();

  const prisma = new PrismaClient();

  try {
    const rawToken = `vxc_${generateOpaqueToken(24)}`;
    const record = await (prisma as any).selfHostInstallToken.create({
      data: {
        email: options.email,
        expiresAt: options.expiresAt ? new Date(options.expiresAt) : null,
        label: options.label,
        metadata: options.metadataJson ? JSON.parse(options.metadataJson) : undefined,
        tokenHash: hashOpaqueToken(rawToken)
      }
    });

    return {
      details: {
        activationCount: record.activationCount,
        createdAt: record.createdAt.toISOString(),
        email: record.email,
        expiresAt: record.expiresAt?.toISOString() ?? null,
        id: record.id,
        label: record.label,
        lastUsedAt: record.lastUsedAt?.toISOString() ?? null,
        metadata: record.metadata ?? null,
        status: String(record.status || "").toLowerCase(),
        updatedAt: record.updatedAt.toISOString()
      },
      token: rawToken
    };
  } finally {
    await prisma.$disconnect();
  }
}
