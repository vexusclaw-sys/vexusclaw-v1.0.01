export type InstallerProvider = "openai" | "mock" | "chatgpt-oauth";

export interface BootstrapAnswers {
  baseDomain: string;
  publicDomain?: string;
  workspaceName: string;
  workspaceSlug: string;
  adminName: string;
  adminEmail: string;
  adminPassword: string;
  provider: InstallerProvider;
  openAiApiKey?: string;
  skipWhatsApp: boolean;
  skipDefaultAgent: boolean;
  baseUrl?: string;
}

export interface BootstrapRunOptions extends BootstrapAnswers {
  baseUrl: string;
  nonInteractive?: boolean;
}

export interface EnvTemplateInput {
  baseDomain: string;
  publicDomain?: string;
  protocol: "http" | "https";
  workspaceSlug: string;
  adminEmail: string;
  adminPassword: string;
  provider: InstallerProvider;
  openAiApiKey?: string;
  cookieDomain?: string;
}

export interface ProvisioningClaimOptions {
  apiBaseUrl: string;
  installToken: string;
  ipAddress?: string;
  slug?: string;
}

export interface IssueInstallTokenOptions {
  label: string;
  email?: string;
  expiresAt?: string;
  metadataJson?: string;
}

export interface ParsedArgs {
  command: string[];
  flags: Record<string, string | boolean>;
}
