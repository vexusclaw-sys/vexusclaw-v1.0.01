-- CreateEnum
CREATE TYPE "SelfHostTokenStatus" AS ENUM ('ACTIVE', 'REVOKED');

-- CreateEnum
CREATE TYPE "SelfHostDnsRecordStatus" AS ENUM ('PENDING', 'ACTIVE', 'ERROR');

-- CreateTable
CREATE TABLE "SelfHostInstallToken" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "email" TEXT,
    "status" "SelfHostTokenStatus" NOT NULL DEFAULT 'ACTIVE',
    "expiresAt" TIMESTAMP(3),
    "lastUsedAt" TIMESTAMP(3),
    "activationCount" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SelfHostInstallToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SelfHostDnsRecord" (
    "id" TEXT NOT NULL,
    "installTokenId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "fqdn" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "cloudflareRecordId" TEXT,
    "status" "SelfHostDnsRecordStatus" NOT NULL DEFAULT 'PENDING',
    "lastError" TEXT,
    "lastSyncedAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SelfHostDnsRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SelfHostInstallToken_tokenHash_key" ON "SelfHostInstallToken"("tokenHash");

-- CreateIndex
CREATE INDEX "SelfHostInstallToken_status_createdAt_idx" ON "SelfHostInstallToken"("status", "createdAt");

-- CreateIndex
CREATE INDEX "SelfHostInstallToken_email_idx" ON "SelfHostInstallToken"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SelfHostDnsRecord_slug_key" ON "SelfHostDnsRecord"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "SelfHostDnsRecord_fqdn_key" ON "SelfHostDnsRecord"("fqdn");

-- CreateIndex
CREATE UNIQUE INDEX "SelfHostDnsRecord_installTokenId_key" ON "SelfHostDnsRecord"("installTokenId");

-- CreateIndex
CREATE INDEX "SelfHostDnsRecord_status_updatedAt_idx" ON "SelfHostDnsRecord"("status", "updatedAt");

-- AddForeignKey
ALTER TABLE "SelfHostDnsRecord"
ADD CONSTRAINT "SelfHostDnsRecord_installTokenId_fkey"
FOREIGN KEY ("installTokenId") REFERENCES "SelfHostInstallToken"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
