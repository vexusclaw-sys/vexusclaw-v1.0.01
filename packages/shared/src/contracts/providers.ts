import type {
  OAuthAttemptStatus,
  ProviderConnectionMode,
  ProviderConnectionStatus,
  ProviderType
} from "../enums";

export interface ProviderConnectionDetails {
  id: string;
  provider: ProviderType;
  label: string;
  mode: ProviderConnectionMode;
  status: ProviderConnectionStatus;
  isPrimary: boolean;
  secretHint: string | null;
  lastError: string | null;
  tokenExpiresAt: string | null;
  scope: string | null;
  accountId: string | null;
  accountEmail: string | null;
  accountName: string | null;
  authState: string | null;
  isExperimental: boolean;
  updatedAt: string;
}

export interface ProviderConnectionInput {
  provider: ProviderType;
  label: string;
  apiKey?: string;
  mode?: "api_key" | "oauth_pkce" | "oauth_imported" | "oauth_stub";
  isPrimary?: boolean;
}

export interface OpenAIConnectionTestResult {
  ok: boolean;
  message: string;
  model?: string;
}

export interface ChatGptOAuthStartInput {
  label?: string;
  makePrimary?: boolean;
  returnToPath?: string;
}

export interface ChatGptOAuthStartResponse {
  attemptId: string;
  authorizeUrl: string;
  expiresAt: string;
}

export interface ChatGptOAuthManualCompleteInput {
  attemptId?: string;
  callbackUrl?: string;
  code?: string;
  state?: string;
}

export interface ChatGptSessionImportInput {
  authJson: string;
  label?: string;
  makePrimary?: boolean;
}

export interface ChatGptOAuthAttemptStatus {
  attemptId: string;
  status: OAuthAttemptStatus;
  expiresAt: string;
  providerConnectionId: string | null;
  lastError: string | null;
}
