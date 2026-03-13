ALTER TYPE "ProviderType" ADD VALUE IF NOT EXISTS 'CHATGPT_OAUTH';
ALTER TYPE "ProviderConnectionMode" ADD VALUE IF NOT EXISTS 'OAUTH_PKCE';

CREATE TYPE "OAuthAttemptStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'EXPIRED');

ALTER TABLE "ProviderConnection"
ADD COLUMN "accessTokenEncrypted" TEXT,
ADD COLUMN "refreshTokenEncrypted" TEXT,
ADD COLUMN "tokenExpiresAt" TIMESTAMP(3),
ADD COLUMN "scope" TEXT,
ADD COLUMN "accountId" TEXT,
ADD COLUMN "authState" TEXT;

CREATE TABLE "OAuthSessionAttempt" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "initiatedById" TEXT,
    "provider" "ProviderType" NOT NULL,
    "state" TEXT NOT NULL,
    "codeVerifierEncrypted" TEXT NOT NULL,
    "redirectUri" TEXT NOT NULL,
    "returnToPath" TEXT,
    "requestedLabel" TEXT,
    "makePrimary" BOOLEAN NOT NULL DEFAULT true,
    "status" "OAuthAttemptStatus" NOT NULL DEFAULT 'PENDING',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "lastError" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OAuthSessionAttempt_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "OAuthSessionAttempt_state_key" ON "OAuthSessionAttempt"("state");
CREATE INDEX "OAuthSessionAttempt_workspaceId_status_idx" ON "OAuthSessionAttempt"("workspaceId", "status");
CREATE INDEX "OAuthSessionAttempt_provider_status_idx" ON "OAuthSessionAttempt"("provider", "status");
CREATE INDEX "OAuthSessionAttempt_expiresAt_idx" ON "OAuthSessionAttempt"("expiresAt");
CREATE INDEX "ProviderConnection_workspaceId_provider_isPrimary_idx" ON "ProviderConnection"("workspaceId", "provider", "isPrimary");
CREATE INDEX "ProviderConnection_tokenExpiresAt_idx" ON "ProviderConnection"("tokenExpiresAt");

ALTER TABLE "OAuthSessionAttempt"
ADD CONSTRAINT "OAuthSessionAttempt_workspaceId_fkey"
FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "OAuthSessionAttempt"
ADD CONSTRAINT "OAuthSessionAttempt_initiatedById_fkey"
FOREIGN KEY ("initiatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
