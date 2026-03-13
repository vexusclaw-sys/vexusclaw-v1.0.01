import { randomBytes } from "node:crypto";

import type { EnvTemplateInput } from "./types";

function randomSecret(length = 32): string {
  return randomBytes(length).toString("hex");
}

export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "mission-control";
}

function trimDots(value: string): string {
  return value.replace(/^\.+|\.+$/g, "");
}

export function buildPublicDomain(workspaceSlug: string, baseDomain: string): string {
  return `${trimDots(workspaceSlug)}.${trimDots(baseDomain)}`;
}

export function renderEnvTemplate(input: EnvTemplateInput): string {
  const protocol = input.protocol;
  const publicDomain = input.publicDomain ?? buildPublicDomain(input.workspaceSlug, input.baseDomain);
  const baseUrl = `${protocol}://${publicDomain}`;
  const cookieDomain = input.cookieDomain ?? "";
  const openAiEnabled = input.provider === "openai";
  const chatGptEnabled = input.provider === "chatgpt-oauth";
  const postgresUser = "vexus";
  const postgresDb = "vexusclaw";
  const postgresPassword = randomSecret(18);

  return [
    `# VEXUSCLAW production environment`,
    `# Required operator inputs`,
    `NODE_ENV=production`,
    `VEXUS_APP_NAME=VEXUSCLAW`,
    `VEXUS_DOMAIN=${publicDomain}`,
    `VEXUS_BASE_DOMAIN=${input.baseDomain}`,
    `VEXUS_PUBLIC_URL=${baseUrl}`,
    `VEXUS_DASHBOARD_URL=${baseUrl}`,
    `VEXUS_API_URL=${baseUrl}/api`,
    `VEXUS_PUBLIC_PROTOCOL=${protocol}`,
    ``,
    `# Network bindings`,
    `VEXUS_GATEWAY_PORT=4000`,
    `VEXUS_DASHBOARD_PORT=3000`,
    `VEXUS_INSTALLER_PORT=4100`,
    `VEXUS_GATEWAY_BIND_ADDRESS=127.0.0.1`,
    `VEXUS_GATEWAY_BIND_PORT=4000`,
    `VEXUS_DASHBOARD_BIND_PORT=3000`,
    `VEXUS_HTTP_BIND_PORT=80`,
    `VEXUS_HTTPS_BIND_PORT=443`,
    `VEXUS_WEBCHAT_WIDGET_PATH=/widget`,
    ``,
    `# Generated secrets and internal credentials`,
    `POSTGRES_DB=${postgresDb}`,
    `POSTGRES_USER=${postgresUser}`,
    `POSTGRES_PASSWORD=${postgresPassword}`,
    `DATABASE_URL=postgresql://${postgresUser}:${postgresPassword}@postgres:5432/${postgresDb}`,
    `REDIS_URL=redis://redis:6379`,
    `JWT_ACCESS_SECRET=${randomSecret(32)}`,
    `JWT_REFRESH_SECRET=${randomSecret(32)}`,
    `VEXUS_ENCRYPTION_KEY=${randomSecret(32)}`,
    `ACCESS_TOKEN_TTL_MINUTES=15`,
    `REFRESH_TOKEN_TTL_DAYS=30`,
    `COOKIE_DOMAIN=${cookieDomain}`,
    `COOKIE_SECURE=${protocol === "https" ? "true" : "false"}`,
    ``,
    `# Optional platform integrations`,
    `CLOUDFLARE_API_TOKEN=`,
    `CLOUDFLARE_ZONE_ID=`,
    `SELF_HOST_PROVISIONING_ENABLED=false`,
    `OPENAI_API_KEY=${openAiEnabled ? input.openAiApiKey ?? "" : ""}`,
    `OPENAI_CONNECT_MODE=${openAiEnabled ? "api_key" : "stub"}`,
    `OPENAI_CHATGPT_OAUTH_ENABLED=${chatGptEnabled ? "true" : "false"}`,
    `OPENAI_CHATGPT_OAUTH_CLIENT_ID=`,
    `OPENAI_CHATGPT_OAUTH_CLIENT_SECRET=`,
    `OPENAI_CHATGPT_OAUTH_REDIRECT_URI=http://localhost:1455/auth/callback`,
    `OPENAI_CHATGPT_OAUTH_SCOPE=openid profile email offline_access`,
    `OPENAI_CHATGPT_OAUTH_AUTHORIZE_URL=https://auth.openai.com/oauth/authorize`,
    `OPENAI_CHATGPT_OAUTH_TOKEN_URL=https://auth.openai.com/oauth/token`,
    `OPENAI_CHATGPT_OAUTH_EXTRA_PARAMS=id_token_add_organizations=true&codex_cli_simplified_flow=true&originator=pi`,
    `OPENAI_CHATGPT_OAUTH_ATTEMPT_TTL_MINUTES=10`,
    `OPENAI_CHATGPT_OAUTH_TOKEN_REFRESH_LEEWAY_SECONDS=60`,
    `OPENAI_CHATGPT_RUNTIME_BASE_URL=https://chatgpt.com/backend-api`,
    `OPENAI_CHATGPT_RUNTIME_MODEL=gpt-5.3-codex`,
    `OPENAI_CHATGPT_RUNTIME_TRANSPORT=sse`,
    `OPENAI_CHATGPT_RUNTIME_ORIGINATOR=pi`,
    `OPENAI_CHATGPT_RUNTIME_TEXT_VERBOSITY=medium`,
    `OPENAI_CHATGPT_OAUTH_LOOPBACK_ENABLED=true`,
    `OPENAI_CHATGPT_OAUTH_LOOPBACK_HOST=0.0.0.0`,
    `OPENAI_CHATGPT_OAUTH_LOOPBACK_PORT=1455`,
    `WHATSAPP_QR_TTL_MINUTES=5`,
    `WHATSAPP_HEALTH_INTERVAL_MS=60000`,
    `WHATSAPP_MAX_RECONNECT_ATTEMPTS=3`,
    `WHATSAPP_RECONNECT_DELAY_MS=3000`,
    `WHATSAPP_GROUP_ACTIVATION=mention`,
    `WHATSAPP_GROUP_ALLOWED_JIDS=`,
    `WHATSAPP_GROUP_HISTORY_LIMIT=30`,
    `WHATSAPP_GROUP_MENTION_PATTERNS=`,
    `WHATSAPP_GROUP_REPLY_TO_BOT_ENABLED=true`,
    `WHATSAPP_GROUP_SELF_E164_FALLBACK_ENABLED=true`,
    `WHATSAPP_COMMAND_ALLOWED_SENDERS=`,
    `CADDY_EMAIL=${input.adminEmail}`,
    `NEXT_PUBLIC_VEXUS_API_URL=/api/v1`,
    `NEXT_PUBLIC_VEXUS_APP_NAME=VEXUSCLAW`,
    ``,
    `# Bootstrap defaults`,
    `DEFAULT_WORKSPACE_SLUG=${input.workspaceSlug}`,
    `DEFAULT_ADMIN_EMAIL=${input.adminEmail}`,
    `DEFAULT_ADMIN_PASSWORD=${input.adminPassword}`,
    `FILE_STORAGE_DRIVER=local`,
    `FILE_STORAGE_PATH=/data/uploads`,
    `LOG_LEVEL=info`
  ].join("\n");
}
