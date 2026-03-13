import type { ChannelAdapter, ChannelEvent, ChannelSendPayload } from "@vexus/sdk";

export class WhatsAppChannelAdapter implements ChannelAdapter {
  key = "whatsapp" as const;
  label = "WhatsApp";

  async getStatus(_connectionId: string): Promise<"disconnected" | "connecting" | "connected" | "error"> {
    return "disconnected";
  }

  async normalizeInbound(payload: unknown): Promise<ChannelEvent> {
    const data = payload as Record<string, string | undefined>;

    return {
      workspaceId: data.workspaceId ?? "unknown-workspace",
      channelConnectionId: data.channelConnectionId ?? "unknown-channel",
      externalUserId: data.externalUserId ?? "unknown-user",
      externalConversationId: data.externalConversationId,
      message: data.message ?? "",
      receivedAt: new Date().toISOString()
    };
  }

  async sendMessage(_connectionId: string, _payload: ChannelSendPayload): Promise<void> {
    return;
  }
}
