import type {
  SelfHostDnsRecordStatus,
  SelfHostTokenStatus
} from "../enums";

export interface SelfHostInstallTokenDetails {
  id: string;
  label: string;
  email: string | null;
  status: SelfHostTokenStatus;
  expiresAt: string | null;
  lastUsedAt: string | null;
  activationCount: number;
  createdAt: string;
}

export interface SelfHostDnsRecordDetails {
  id: string;
  slug: string;
  fqdn: string;
  ipAddress: string;
  status: SelfHostDnsRecordStatus;
  lastError: string | null;
  lastSyncedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SelfHostClaimInput {
  ipAddress?: string;
}

export interface SelfHostClaimResponse extends SelfHostDnsRecordDetails {
  ready: boolean;
}
