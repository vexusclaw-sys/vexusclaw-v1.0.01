import { createHash, randomBytes } from "node:crypto";

import type { VexusEnv } from "@vexus/config";

const defaultLocalCodexRedirectUri = "http://localhost:1455/auth/callback";
const chatGptAuthClaimPath = "https://api.openai.com/auth";

export interface OAuthPkcePair {
  codeChallenge: string;
  codeVerifier: string;
}

export interface OpenAITokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  scope?: string;
  token_type?: string;
  id_token?: string;
}

export interface ChatGptTokenMetadata {
  accountEmail: string | null;
  accountId: string | null;
  accountName: string | null;
  clientId: string | null;
  tokenExpiresAt: Date | null;
}

function normalizeOAuthErrorPart(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  if (Array.isArray(value)) {
    const joined = value
      .map((item) => normalizeOAuthErrorPart(item))
      .filter((item): item is string => Boolean(item))
      .join(" ");

    return joined || null;
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const preferred = [
      record.error_description,
      record.description,
      record.message,
      record.error,
      record.code
    ]
      .map((item) => normalizeOAuthErrorPart(item))
      .find((item): item is string => Boolean(item));

    if (preferred) {
      return preferred;
    }

    try {
      return JSON.stringify(record);
    } catch {
      return null;
    }
  }

  return null;
}

function extractOAuthErrorMessage(
  payload: (OpenAITokenResponse & { error?: unknown; error_description?: unknown }) | null,
  fallback: string
): string {
  return (
    normalizeOAuthErrorPart(payload?.error_description) ??
    normalizeOAuthErrorPart(payload?.error) ??
    fallback
  );
}

export function generateOAuthState(): string {
  return randomBytes(24).toString("hex");
}

export function generatePkcePair(): OAuthPkcePair {
  const codeVerifier = randomBytes(64).toString("base64url");
  const codeChallenge = createHash("sha256").update(codeVerifier).digest("base64url");

  return {
    codeChallenge,
    codeVerifier
  };
}

export function resolveRedirectUri(input: {
  env: VexusEnv;
  publicUrl: string;
}): string {
  const configured = input.env.OPENAI_CHATGPT_OAUTH_REDIRECT_URI.trim();

  if (configured.startsWith("http://") || configured.startsWith("https://")) {
    return configured;
  }

  return defaultLocalCodexRedirectUri;
}

export function buildAuthorizeUrl(input: {
  authorizeEndpoint: string;
  clientId: string;
  redirectUri: string;
  scope: string;
  state: string;
  codeChallenge: string;
  extraParams?: string;
}): string {
  const url = new URL(input.authorizeEndpoint);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", input.clientId);
  url.searchParams.set("redirect_uri", input.redirectUri);
  url.searchParams.set("scope", input.scope);
  url.searchParams.set("code_challenge", input.codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("state", input.state);

  if (input.extraParams?.trim()) {
    const extra = new URLSearchParams(input.extraParams);

    extra.forEach((value, key) => {
      if (!url.searchParams.has(key)) {
        url.searchParams.set(key, value);
      }
    });
  }

  return url.toString();
}

export function calculateTokenExpiry(expiresIn?: number): Date | null {
  if (!expiresIn || expiresIn <= 0) {
    return null;
  }

  return new Date(Date.now() + expiresIn * 1000);
}

export function parseCallbackParameters(input: {
  callbackUrl?: string;
  code?: string;
  state?: string;
}): {
  code: string;
  state: string | null;
} {
  if (input.callbackUrl?.trim()) {
    const value = input.callbackUrl.trim();
    const callbackUrlMatch = value.match(/https?:\/\/[^\s"'<>]+/i);
    const callbackValue = callbackUrlMatch?.[0] ?? value;

    try {
      const url = new URL(callbackValue);
      const code = url.searchParams.get("code");
      const state = url.searchParams.get("state");

      if (code) {
        return {
          code,
          state: state?.trim() || null
        };
      }
    } catch {
      // The remote/browser flow may produce raw callback fragments instead of a full URL.
    }

    if (callbackValue.includes("#")) {
      const [code, state] = callbackValue.split("#", 2).map((item) => item?.trim());

      if (code && state) {
        return {
          code,
          state
        };
      }
    }

    const looseCodeMatch = callbackValue.match(/[?&#]code=([^&#\s]+)/i);
    const looseStateMatch = callbackValue.match(/[?&#]state=([^&#\s]+)/i);

    if (looseCodeMatch?.[1] && looseStateMatch?.[1]) {
      return {
        code: decodeURIComponent(looseCodeMatch[1]),
        state: decodeURIComponent(looseStateMatch[1])
      };
    }

    if (callbackValue.includes("code=")) {
      const params = new URLSearchParams(callbackValue);
      const code = params.get("code");
      const state = params.get("state");

      if (code && state) {
        return {
          code,
          state
        };
      }
    }

    if (!callbackValue.includes("://")) {
      return {
        code: callbackValue,
        state: null
      };
    }

    throw new Error(
      "Cole a URL final completa do localhost/127.0.0.1, use code#state, code=...&state=... ou informe o code cru da tentativa atual."
    );
  }

  if (!input.code?.trim()) {
    throw new Error("Authorization code is required.");
  }

  return {
    code: input.code.trim(),
    state: input.state?.trim() || null
  };
}

export function decodeJwtPayload(token: string | undefined): Record<string, unknown> | null {
  if (!token) {
    return null;
  }

  const parts = token.split(".");

  if (parts.length < 2 || !parts[1]) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8")) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function parseAudience(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  if (Array.isArray(value)) {
    const first = value.find((item) => typeof item === "string" && item.trim());
    return typeof first === "string" ? first.trim() : null;
  }

  return null;
}

function extractAccountIdFromAccessToken(payload: Record<string, unknown> | null): string | null {
  if (!payload) {
    return null;
  }

  const authClaim =
    chatGptAuthClaimPath in payload && payload[chatGptAuthClaimPath] && typeof payload[chatGptAuthClaimPath] === "object"
      ? (payload[chatGptAuthClaimPath] as Record<string, unknown>)
      : null;
  const accountId =
    authClaim && typeof authClaim.chatgpt_account_id === "string"
      ? authClaim.chatgpt_account_id.trim()
      : "";

  return accountId || null;
}

function extractAccountName(payload: Record<string, unknown> | null): string | null {
  if (!payload) {
    return null;
  }

  if (typeof payload.name === "string" && payload.name.trim()) {
    return payload.name.trim();
  }

  if (typeof payload.given_name === "string" && payload.given_name.trim()) {
    return payload.given_name.trim();
  }

  return null;
}

function extractTokenExpiry(payload: Record<string, unknown> | null): Date | null {
  return typeof payload?.exp === "number" ? new Date(payload.exp * 1000) : null;
}

export function extractChatGptTokenMetadata(input: {
  accessToken?: string;
  fallbackAccountId?: string | null;
  idToken?: string;
}): ChatGptTokenMetadata {
  const accessPayload = decodeJwtPayload(input.accessToken);
  const idPayload = decodeJwtPayload(input.idToken);

  return {
    accountEmail:
      typeof idPayload?.email === "string" && idPayload.email.trim() ? idPayload.email.trim() : null,
    accountId:
      extractAccountIdFromAccessToken(accessPayload) ??
      (input.fallbackAccountId?.trim() || null) ??
      (typeof idPayload?.sub === "string" && idPayload.sub.trim() ? idPayload.sub.trim() : null),
    accountName: extractAccountName(idPayload),
    clientId: parseAudience(idPayload?.aud ?? accessPayload?.aud),
    tokenExpiresAt: extractTokenExpiry(accessPayload) ?? extractTokenExpiry(idPayload)
  };
}

export async function exchangeCodeForToken(input: {
  clientId: string;
  clientSecret?: string;
  tokenEndpoint: string;
  redirectUri: string;
  code: string;
  codeVerifier: string;
}): Promise<OpenAITokenResponse> {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: input.clientId,
    code: input.code,
    code_verifier: input.codeVerifier,
    redirect_uri: input.redirectUri
  });

  if (input.clientSecret?.trim()) {
    body.set("client_secret", input.clientSecret.trim());
  }

  const response = await fetch(input.tokenEndpoint, {
    body,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "POST"
  });

  const payload = (await response.json().catch(() => null)) as
    | (OpenAITokenResponse & { error?: unknown; error_description?: unknown })
    | null;

  if (!response.ok || !payload?.access_token) {
    throw new Error(extractOAuthErrorMessage(payload, "OAuth token exchange failed."));
  }

  return payload;
}

export async function refreshOAuthToken(input: {
  clientId: string;
  clientSecret?: string;
  tokenEndpoint: string;
  refreshToken: string;
}): Promise<OpenAITokenResponse> {
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: input.clientId,
    refresh_token: input.refreshToken
  });

  if (input.clientSecret?.trim()) {
    body.set("client_secret", input.clientSecret.trim());
  }

  const response = await fetch(input.tokenEndpoint, {
    body,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "POST"
  });

  const payload = (await response.json().catch(() => null)) as
    | (OpenAITokenResponse & { error?: unknown; error_description?: unknown })
    | null;

  if (!response.ok || !payload?.access_token) {
    throw new Error(extractOAuthErrorMessage(payload, "OAuth token refresh failed."));
  }

  return payload;
}
