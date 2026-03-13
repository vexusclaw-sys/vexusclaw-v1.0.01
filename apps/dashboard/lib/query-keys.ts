export const queryKeys = {
  agents: ["agents"] as const,
  authSession: ["auth", "session"] as const,
  channels: ["channels"] as const,
  channelLogs: (filters: Record<string, string | number | undefined>) => ["channel-logs", filters] as const,
  logs: (filters: Record<string, string | number | undefined>) => ["logs", filters] as const,
  overview: ["overview"] as const,
  providers: ["providers"] as const,
  sessionDetail: (sessionId: string | null) => ["sessions", "detail", sessionId] as const,
  sessions: (filters: Record<string, string | number | undefined>) => ["sessions", filters] as const,
  settings: ["settings"] as const,
  setupStatus: ["setup", "status"] as const
};
