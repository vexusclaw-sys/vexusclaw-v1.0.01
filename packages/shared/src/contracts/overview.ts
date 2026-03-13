import type { ChannelStatus, HealthState, ProviderType } from "../enums";
import type { HealthReport } from "./api";
import type { SetupStatusResponse } from "./setup";

export interface MissionControlOverview {
  systemStatus: HealthState;
  health: HealthReport;
  onboarding: SetupStatusResponse;
  instance: {
    hostname: string | null;
    publicUrl: string | null;
    baseDomain: string | null;
    resolvedHost: string | null;
    matchedBySubdomain: boolean;
  };
  totals: {
    agents: number;
    channels: number;
    sessions: number;
    connectedChannels: number;
  };
  provider: {
    connected: boolean;
    type: ProviderType | null;
    label: string | null;
  };
  whatsapp: {
    id: string | null;
    status: ChannelStatus;
    qrRequired: boolean;
    lastActivityAt: string | null;
    lastError: string | null;
  };
}
