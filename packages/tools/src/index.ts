import type { AgentRuntimeContext, ToolAdapter, ToolInvocationResult } from "@vexus/sdk";

class SystemStatusTool implements ToolAdapter {
  key = "system.status";
  description = "Returns a lightweight system readiness snapshot.";
  permissions = ["system:read"];

  async execute(_input: Record<string, unknown>, context: AgentRuntimeContext): Promise<ToolInvocationResult> {
    return {
      ok: true,
      output: `Workspace ${context.workspaceId} session ${context.sessionId} is active.`,
      metadata: {
        agentId: context.agentId,
        channelConnectionId: context.channelConnectionId
      }
    };
  }
}

export function createDefaultTools(): ToolAdapter[] {
  return [new SystemStatusTool()];
}
