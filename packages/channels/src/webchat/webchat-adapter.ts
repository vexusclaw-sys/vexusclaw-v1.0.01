import type { ChannelAdapter, ChannelEvent, ChannelSendPayload } from "@vexus/sdk";

export class WebChatChannelAdapter implements ChannelAdapter {
  key = "webchat" as const;
  label = "WebChat";

  async getStatus(_connectionId: string): Promise<"disconnected" | "connecting" | "connected" | "error"> {
    return "connected";
  }

  async normalizeInbound(payload: unknown): Promise<ChannelEvent> {
    const data = payload as Record<string, string | undefined>;

    return {
      workspaceId: data.workspaceId ?? "unknown-workspace",
      channelConnectionId: data.channelConnectionId ?? "unknown-channel",
      externalUserId: data.externalUserId ?? "visitor",
      externalConversationId: data.externalConversationId,
      message: data.message ?? "",
      receivedAt: new Date().toISOString()
    };
  }

  async sendMessage(_connectionId: string, _payload: ChannelSendPayload): Promise<void> {
    return;
  }
}
