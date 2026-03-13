import type { MemoryStore } from "@vexus/sdk";

export class NullMemoryStore implements MemoryStore {
  async remember(): Promise<void> {
    return;
  }

  async findRelevant(): Promise<string[]> {
    return [];
  }
}
