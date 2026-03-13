-- CreateEnum
CREATE TYPE "ChannelEventType" AS ENUM (
    'CONNECTED',
    'DISCONNECTED',
    'QR_REQUIRED',
    'RECONNECTING',
    'INBOUND_MESSAGE',
    'OUTBOUND_MESSAGE',
    'ERROR'
);

-- CreateTable
CREATE TABLE "ChannelEventLog" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "channelConnectionId" TEXT NOT NULL,
    "type" "ChannelEventType" NOT NULL,
    "message" TEXT NOT NULL,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChannelEventLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ChannelEventLog_workspaceId_createdAt_idx" ON "ChannelEventLog"("workspaceId", "createdAt");

-- CreateIndex
CREATE INDEX "ChannelEventLog_channelConnectionId_createdAt_idx" ON "ChannelEventLog"("channelConnectionId", "createdAt");

-- CreateIndex
CREATE INDEX "ChannelEventLog_type_createdAt_idx" ON "ChannelEventLog"("type", "createdAt");

-- AddForeignKey
ALTER TABLE "ChannelEventLog"
ADD CONSTRAINT "ChannelEventLog_workspaceId_fkey"
FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChannelEventLog"
ADD CONSTRAINT "ChannelEventLog_channelConnectionId_fkey"
FOREIGN KEY ("channelConnectionId") REFERENCES "ChannelConnection"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;
