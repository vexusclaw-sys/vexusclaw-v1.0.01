import type { ChannelAdapter } from "@vexus/sdk";
import type { ChannelType } from "@vexus/shared";

export class ChannelRegistry {
  private readonly channels = new Map<ChannelType, ChannelAdapter>();

  register(channel: ChannelAdapter): void {
    this.channels.set(channel.key, channel);
  }

  get(type: ChannelType): ChannelAdapter {
    const adapter = this.channels.get(type);

    if (!adapter) {
      throw new Error(`Channel ${type} is not registered.`);
    }

    return adapter;
  }

  list(): ChannelAdapter[] {
    return [...this.channels.values()];
  }
}
