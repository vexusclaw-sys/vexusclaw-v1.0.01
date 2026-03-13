import { z } from "zod";

import { HttpError } from "../../../app/errors";
import { extractChatGptTokenMetadata } from "./oauth";

const importedTokensSchema = z.object({
  access_token: z.string().trim().min(1),
  account_id: z.string().trim().min(1).optional().nullable(),
  id_token: z.string().trim().min(1).optional().nullable(),
  refresh_token: z.string().trim().min(1).optional().nullable()
});

const importedAuthJsonSchema = z.object({
  OPENAI_API_KEY: z.string().trim().optional().nullable(),
  auth_mode: z.string().trim().optional().default("chatgpt"),
  last_refresh: z.string().trim().optional().nullable(),
  tokens: importedTokensSchema
});

export interface ImportedChatGptSession {
  accessToken: string;
  accountEmail: string | null;
  accountId: string | null;
  accountName: string | null;
  authMode: string;
  clientId: string | null;
  derivedLabel: string;
  lastRefreshAt: Date | null;
  rawIdToken: string | null;
  refreshToken: string | null;
  tokenExpiresAt: Date | null;
}

function asDateOrNull(value: string | null | undefined): Date | null {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function normalizeImportedPayload(raw: unknown): unknown {
  if (!raw || typeof raw !== "object") {
    return raw;
  }

  const record = raw as Record<string, unknown>;

  if ("tokens" in record) {
    return raw;
  }

  if ("access_token" in record || "id_token" in record || "refresh_token" in record) {
    return {
      auth_mode: "chatgpt",
      tokens: record
    };
  }

  return raw;
}

export function parseImportedChatGptSession(rawAuthJson: string): ImportedChatGptSession {
  let parsedUnknown: unknown;

  try {
    parsedUnknown = JSON.parse(rawAuthJson);
  } catch {
    throw new HttpError(
      400,
      "O auth.json precisa ser um JSON valido exportado do Codex/ChatGPT.",
      "CHATGPT_IMPORT_INVALID_JSON"
    );
  }

  const parsed = importedAuthJsonSchema.safeParse(normalizeImportedPayload(parsedUnknown));

  if (!parsed.success) {
    throw new HttpError(
      400,
      "Formato de auth.json invalido. Esperado: auth_mode, tokens.access_token, tokens.refresh_token opcional, tokens.id_token opcional e tokens.account_id opcional.",
      "CHATGPT_IMPORT_INVALID_FORMAT"
    );
  }

  const metadata = extractChatGptTokenMetadata({
    accessToken: parsed.data.tokens.access_token,
    fallbackAccountId: parsed.data.tokens.account_id ?? null,
    idToken: parsed.data.tokens.id_token ?? undefined
  });
  const accountEmail = metadata.accountEmail;
  const derivedLabel = accountEmail
    ? `Imported ChatGPT Session · ${accountEmail}`
    : "Imported ChatGPT Session";

  return {
    accessToken: parsed.data.tokens.access_token,
    accountEmail,
    accountId: metadata.accountId,
    accountName: metadata.accountName,
    authMode: parsed.data.auth_mode,
    clientId: metadata.clientId,
    derivedLabel,
    lastRefreshAt: asDateOrNull(parsed.data.last_refresh ?? null),
    rawIdToken: parsed.data.tokens.id_token?.trim() || null,
    refreshToken: parsed.data.tokens.refresh_token?.trim() || null,
    tokenExpiresAt: metadata.tokenExpiresAt
  };
}
