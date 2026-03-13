import type { ChannelType, OnboardingStatus, ProviderType, SetupStep } from "../enums";

export interface SetupStatusResponse {
  workspaceId: string | null;
  workspaceName: string | null;
  workspaceSlug: string | null;
  domain: string | null;
  publicUrl: string | null;
  baseDomain: string | null;
  onboardingStatus: OnboardingStatus;
  currentStep: SetupStep | string;
  isBootstrapped: boolean;
  adminConfigured: boolean;
  providerConfigured: boolean;
  isReady: boolean;
  primaryChannel: ChannelType;
  providerType: ProviderType | null;
  completedAt: string | null;
  adminEmail: string | null;
}

export interface SetupBootstrapInput {
  workspaceName: string;
  domain: string;
  workspaceSlug?: string;
}

export interface SetupAdminInput {
  name: string;
  email: string;
  password: string;
}

export interface SetupProviderInput {
  providerType: ProviderType;
  mode?: "api_key" | "oauth_pkce" | "oauth_stub" | "skip";
  apiKey?: string;
  label?: string;
}

export interface SetupFinalizeInput {
  agentName?: string;
  agentRole?: string;
  instructions?: string;
  tone?: string;
  createDefaultAgent?: boolean;
  provisionWhatsApp?: boolean;
}
