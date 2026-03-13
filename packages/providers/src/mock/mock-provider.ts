import type { AgentRuntimeContext, ProviderAdapter, ProviderCompletion, ProviderMessage } from "@vexus/sdk";

export class MockProviderAdapter implements ProviderAdapter {
  key = "mock" as const;
  label = "Mock Provider";
  supportsStreaming = false;

  async isConfigured(): Promise<boolean> {
    return true;
  }

  async chat(messages: ProviderMessage[], context: AgentRuntimeContext): Promise<ProviderCompletion> {
    const latestMessage = messages.at(-1)?.content ?? "Hello from VEXUSCLAW.";

    return {
      content: `Mock response for agent ${context.agentId}: ${latestMessage}`,
      provider: this.key,
      model: "mock-simulated-v1"
    };
  }
}
