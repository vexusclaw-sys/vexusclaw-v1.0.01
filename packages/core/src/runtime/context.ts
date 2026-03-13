import type { AgentRuntimeContext } from "@vexus/sdk";

export interface RuntimeSessionContext extends AgentRuntimeContext {
  workspaceSlug?: string;
  providerKey?: string;
}
