import type { WorkspaceRole } from "@vexus/shared";

export interface AccessTokenPayload {
  sub: string;
  email: string;
  workspaceId: string;
  role: WorkspaceRole;
  tokenType: "access";
}
