import type { OnboardingStatus, UserStatus, WorkspaceRole } from "../enums";

export interface AuthSessionUser {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
}

export interface AuthSessionWorkspace {
  id: string;
  name: string;
  slug: string;
  domain: string | null;
  publicUrl: string | null;
  baseDomain: string | null;
  role: WorkspaceRole;
  onboardingStatus: OnboardingStatus;
}

export interface AuthSession {
  user: AuthSessionUser;
  workspace: AuthSessionWorkspace;
}
