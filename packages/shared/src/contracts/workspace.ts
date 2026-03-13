import type { OnboardingStatus } from "../enums";
import type { ProviderConnectionDetails } from "./providers";
import type { SetupStatusResponse } from "./setup";

export interface WorkspaceSettingsResponse {
  workspace: {
    id: string;
    name: string;
    slug: string;
    domain: string | null;
    publicUrl: string | null;
    baseDomain: string | null;
    onboardingStatus: OnboardingStatus;
  };
  setup: SetupStatusResponse;
  providers: ProviderConnectionDetails[];
}
