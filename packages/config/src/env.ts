import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  VEXUS_APP_NAME: z.string().min(1).default("VEXUSCLAW"),
  VEXUS_DOMAIN: z.string().min(1).default("localhost"),
  VEXUS_BASE_DOMAIN: z.string().min(1).optional(),
  VEXUS_PUBLIC_URL: z.string().url().default("http://localhost"),
  VEXUS_DASHBOARD_URL: z.string().url().default("http://localhost"),
  VEXUS_API_URL: z.string().url().default("http://localhost/api"),
  VEXUS_PUBLIC_PROTOCOL: z.enum(["http", "https"]).optional(),
  VEXUS_GATEWAY_PORT: z.coerce.number().int().positive().default(4000),
  VEXUS_DASHBOARD_PORT: z.coerce.number().int().positive().default(3000),
  VEXUS_INSTALLER_PORT: z.coerce.number().int().positive().default(4100),
  VEXUS_WEBCHAT_WIDGET_PATH: z.string().default("/widget"),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),
  VEXUS_ENCRYPTION_KEY: z.string().min(32),
  ACCESS_TOKEN_TTL_MINUTES: z.coerce.number().int().positive().default(15),
  REFRESH_TOKEN_TTL_DAYS: z.coerce.number().int().positive().default(30),
  COOKIE_DOMAIN: z.string().optional().default("localhost"),
  COOKIE_SECURE: z
    .union([z.boolean(), z.string()])
    .transform((value) => (typeof value === "boolean" ? value : value === "true"))
    .default(false),
  CLOUDFLARE_API_TOKEN: z.string().optional().default(""),
  CLOUDFLARE_ZONE_ID: z.string().optional().default(""),
  SELF_HOST_PROVISIONING_ENABLED: z
    .union([z.boolean(), z.string()])
    .transform((value) => (typeof value === "boolean" ? value : value === "true"))
    .default(false),
  OPENAI_API_KEY: z.string().optional().default(""),
  OPENAI_CONNECT_MODE: z.enum(["stub", "api_key"]).default("stub"),
  OPENAI_CHATGPT_OAUTH_ENABLED: z
    .union([z.boolean(), z.string()])
    .transform((value) => (typeof value === "boolean" ? value : value === "true"))
    .default(false),
  OPENAI_CHATGPT_OAUTH_CLIENT_ID: z.string().optional().default(""),
  OPENAI_CHATGPT_OAUTH_CLIENT_SECRET: z.string().optional().default(""),
  OPENAI_CHATGPT_OAUTH_REDIRECT_URI: z
    .string()
    .min(1)
    .default("http://localhost:1455/auth/callback"),
  OPENAI_CHATGPT_OAUTH_SCOPE: z
    .string()
    .min(1)
    .default("openid profile email offline_access"),
  OPENAI_CHATGPT_OAUTH_AUTHORIZE_URL: z
    .string()
    .url()
    .default("https://auth.openai.com/oauth/authorize"),
  OPENAI_CHATGPT_OAUTH_TOKEN_URL: z
    .string()
    .url()
    .default("https://auth.openai.com/oauth/token"),
  OPENAI_CHATGPT_OAUTH_EXTRA_PARAMS: z
    .string()
    .default("id_token_add_organizations=true&codex_cli_simplified_flow=true&originator=pi"),
  OPENAI_CHATGPT_OAUTH_ATTEMPT_TTL_MINUTES: z.coerce.number().int().positive().default(10),
  OPENAI_CHATGPT_OAUTH_TOKEN_REFRESH_LEEWAY_SECONDS: z
    .coerce.number()
    .int()
    .nonnegative()
    .default(60),
  OPENAI_CHATGPT_RUNTIME_BASE_URL: z
    .string()
    .url()
    .default("https://chatgpt.com/backend-api"),
  OPENAI_CHATGPT_RUNTIME_MODEL: z.string().min(1).default("gpt-5.3-codex"),
  OPENAI_CHATGPT_RUNTIME_TRANSPORT: z.enum(["sse"]).default("sse"),
  OPENAI_CHATGPT_RUNTIME_ORIGINATOR: z.string().min(1).default("pi"),
  OPENAI_CHATGPT_RUNTIME_TEXT_VERBOSITY: z.enum(["low", "medium", "high"]).default("medium"),
  OPENAI_CHATGPT_OAUTH_LOOPBACK_ENABLED: z
    .union([z.boolean(), z.string()])
    .transform((value) => (typeof value === "boolean" ? value : value === "true"))
    .default(true),
  OPENAI_CHATGPT_OAUTH_LOOPBACK_HOST: z.string().min(1).default("0.0.0.0"),
  OPENAI_CHATGPT_OAUTH_LOOPBACK_PORT: z.coerce.number().int().positive().default(1455),
  WHATSAPP_QR_TTL_MINUTES: z.coerce.number().int().positive().default(5),
  WHATSAPP_HEALTH_INTERVAL_MS: z.coerce.number().int().positive().default(60_000),
  WHATSAPP_MAX_RECONNECT_ATTEMPTS: z.coerce.number().int().nonnegative().default(3),
  WHATSAPP_RECONNECT_DELAY_MS: z.coerce.number().int().positive().default(3_000),
  WHATSAPP_GROUP_ACTIVATION: z.enum(["mention", "always"]).default("mention"),
  WHATSAPP_GROUP_ALLOWED_JIDS: z.string().default(""),
  WHATSAPP_GROUP_HISTORY_LIMIT: z.coerce.number().int().positive().default(30),
  WHATSAPP_GROUP_MENTION_PATTERNS: z.string().default(""),
  WHATSAPP_GROUP_REPLY_TO_BOT_ENABLED: z
    .union([z.boolean(), z.string()])
    .transform((value) => (typeof value === "boolean" ? value : value === "true"))
    .default(true),
  WHATSAPP_GROUP_SELF_E164_FALLBACK_ENABLED: z
    .union([z.boolean(), z.string()])
    .transform((value) => (typeof value === "boolean" ? value : value === "true"))
    .default(true),
  WHATSAPP_COMMAND_ALLOWED_SENDERS: z.string().default(""),
  CADDY_EMAIL: z.string().email(),
  DEFAULT_WORKSPACE_SLUG: z.string().min(1).default("mission-control"),
  DEFAULT_ADMIN_EMAIL: z.string().email(),
  DEFAULT_ADMIN_PASSWORD: z.string().min(12),
  FILE_STORAGE_DRIVER: z.enum(["local"]).default("local"),
  FILE_STORAGE_PATH: z.string().min(1).default("/data/uploads"),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info")
}).transform((input) => ({
  ...input,
  VEXUS_BASE_DOMAIN: input.VEXUS_BASE_DOMAIN ?? input.VEXUS_DOMAIN,
  VEXUS_PUBLIC_PROTOCOL:
    input.VEXUS_PUBLIC_PROTOCOL ??
    (new URL(input.VEXUS_PUBLIC_URL).protocol.replace(":", "") as "http" | "https")
}));

export type VexusEnv = z.infer<typeof envSchema>;

let cachedEnv: VexusEnv | null = null;

export function readEnv(source: NodeJS.ProcessEnv = process.env): VexusEnv {
  if (cachedEnv) {
    return cachedEnv;
  }

  const parsed = envSchema.safeParse(source);

  if (!parsed.success) {
    throw new Error(`Invalid environment configuration: ${parsed.error.message}`);
  }

  cachedEnv = parsed.data;
  return parsed.data;
}

export function resetEnvCache(): void {
  cachedEnv = null;
}

export function getPublicConfig(env = readEnv()) {
  return {
    appName: env.VEXUS_APP_NAME,
    domain: env.VEXUS_DOMAIN,
    dashboardUrl: env.VEXUS_DASHBOARD_URL,
    apiUrl: env.VEXUS_API_URL,
    widgetPath: env.VEXUS_WEBCHAT_WIDGET_PATH
  };
}
