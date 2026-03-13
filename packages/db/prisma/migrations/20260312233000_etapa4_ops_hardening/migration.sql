-- AlterTable
ALTER TABLE "Message"
ADD COLUMN "externalMessageId" TEXT;

-- CreateIndex
CREATE INDEX "Message_workspaceId_role_createdAt_idx"
ON "Message"("workspaceId", "role", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Message_workspaceId_externalMessageId_key"
ON "Message"("workspaceId", "externalMessageId");
