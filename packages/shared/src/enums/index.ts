export const workspaceRoles = ["owner", "admin", "operator"] as const;
export const userStatuses = ["active", "invited", "suspended"] as const;
export const workspaceStatuses = ["active", "setup", "suspended"] as const;
export const onboardingStatuses = ["pending", "in_progress", "completed"] as const;
export const providerTypes = ["openai", "chatgpt_oauth", "mock"] as const;
export const providerConnectionModes = ["api_key", "oauth_pkce", "oauth_imported", "oauth_stub"] as const;
export const providerConnectionStatuses = ["connected", "pending", "error", "disabled"] as const;
export const oauthAttemptStatuses = ["pending", "completed", "failed", "expired"] as const;
export const selfHostTokenStatuses = ["active", "revoked"] as const;
export const selfHostDnsRecordStatuses = ["pending", "active", "error"] as const;
export const agentStatuses = ["draft", "active", "disabled"] as const;
export const channelTypes = ["whatsapp", "webchat"] as const;
export const channelStatuses = ["disconnected", "connecting", "qr_required", "connected", "error"] as const;
export const sessionStatuses = ["open", "idle", "handover_pending", "closed"] as const;
export const messageRoles = ["system", "user", "assistant", "tool"] as const;
export const memoryItemTypes = ["fact", "note", "summary", "file_reference"] as const;
export const skillStatuses = ["draft", "published", "deprecated", "disabled"] as const;
export const automationJobStatuses = ["queued", "running", "success", "failed", "paused"] as const;
export const auditActionTypes = ["create", "update", "delete", "login", "logout", "execute", "reconnect"] as const;
export const channelEventTypes = [
  "connected",
  "disconnected",
  "qr_required",
  "reconnecting",
  "inbound_message",
  "outbound_message",
  "error"
] as const;
export const healthStates = ["ok", "degraded", "down"] as const;
export const setupSteps = ["welcome", "domain", "admin", "provider", "channels", "agent", "finalize"] as const;

export type WorkspaceRole = (typeof workspaceRoles)[number];
export type UserStatus = (typeof userStatuses)[number];
export type WorkspaceStatus = (typeof workspaceStatuses)[number];
export type OnboardingStatus = (typeof onboardingStatuses)[number];
export type ProviderType = (typeof providerTypes)[number];
export type ProviderConnectionMode = (typeof providerConnectionModes)[number];
export type ProviderConnectionStatus = (typeof providerConnectionStatuses)[number];
export type OAuthAttemptStatus = (typeof oauthAttemptStatuses)[number];
export type SelfHostTokenStatus = (typeof selfHostTokenStatuses)[number];
export type SelfHostDnsRecordStatus = (typeof selfHostDnsRecordStatuses)[number];
export type AgentStatus = (typeof agentStatuses)[number];
export type ChannelType = (typeof channelTypes)[number];
export type ChannelStatus = (typeof channelStatuses)[number];
export type SessionStatus = (typeof sessionStatuses)[number];
export type MessageRole = (typeof messageRoles)[number];
export type MemoryItemType = (typeof memoryItemTypes)[number];
export type SkillStatus = (typeof skillStatuses)[number];
export type AutomationJobStatus = (typeof automationJobStatuses)[number];
export type AuditActionType = (typeof auditActionTypes)[number];
export type ChannelEventType = (typeof channelEventTypes)[number];
export type HealthState = (typeof healthStates)[number];
export type SetupStep = (typeof setupSteps)[number];
