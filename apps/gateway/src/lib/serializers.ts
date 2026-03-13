import type {
  ChannelEventLog,
  ChannelConnection,
  ChannelStatus as PrismaChannelStatus,
  ChannelType as PrismaChannelType,
  Message,
  ProviderConnection,
  ProviderConnectionStatus as PrismaProviderConnectionStatus,
  ProviderType as PrismaProviderType,
  Session,
  SetupState,
  UserStatus as PrismaUserStatus,
  Workspace,
  WorkspaceMember,
  WorkspaceRole as PrismaWorkspaceRole
} from "@vexus/db";
import type {
  AuthSession,
  ChannelEventLogItem,
  ChannelConnectionDetails,
  ChannelStatus,
  ChannelType,
  MessageRole,
  OnboardingStatus,
  ProviderConnectionMode,
  ProviderConnectionDetails,
  ProviderConnectionStatus,
  ProviderType,
  SessionDetailsResponse,
  SessionListItem,
  SessionStatus,
  SessionTranscriptMessage,
  SetupStatusResponse,
  UserStatus,
  WorkspaceRole
} from "@vexus/shared";

function lowerEnum<T extends string>(value: string | null | undefined, fallback?: T): T {
  if (!value) {
    if (fallback) {
      return fallback;
    }

    throw new Error("Missing enum value");
  }

  return value.toLowerCase() as T;
}

export function serializeAuthSession(input: {
  membership: WorkspaceMember & {
    workspace: Workspace;
    user: {
      id: string;
      name: string;
      email: string;
      status: PrismaUserStatus;
    };
  };
}): AuthSession {
  const { membership } = input;

  return {
    user: {
      id: membership.user.id,
      name: membership.user.name,
      email: membership.user.email,
      status: lowerEnum<UserStatus>(membership.user.status)
    },
    workspace: {
      id: membership.workspace.id,
      name: membership.workspace.name,
      slug: membership.workspace.slug,
      domain: membership.workspace.domain,
      publicUrl: null,
      baseDomain: null,
      role: lowerEnum<WorkspaceRole>(membership.role as PrismaWorkspaceRole),
      onboardingStatus: lowerEnum<OnboardingStatus>(membership.workspace.onboardingStatus)
    }
  };
}

export function serializeSetupStatus(input: {
  workspace: Workspace | null;
  setupState: SetupState | null;
  providerConfigured?: boolean;
}): SetupStatusResponse {
  const { workspace, setupState } = input;

  if (!workspace) {
    return {
      workspaceId: null,
      workspaceName: null,
      workspaceSlug: null,
      domain: null,
      publicUrl: null,
      baseDomain: null,
      onboardingStatus: "pending",
      currentStep: "welcome",
      isBootstrapped: false,
      adminConfigured: false,
      providerConfigured: false,
      isReady: false,
      primaryChannel: "whatsapp",
      providerType: null,
      completedAt: null,
      adminEmail: null
    };
  }

  const onboardingStatus = lowerEnum<OnboardingStatus>(workspace.onboardingStatus);

  return {
    workspaceId: workspace.id,
    workspaceName: workspace.name,
    workspaceSlug: workspace.slug,
    domain: setupState?.domain ?? workspace.domain,
    publicUrl: null,
    baseDomain: null,
    onboardingStatus,
    currentStep: setupState?.currentStep ?? "welcome",
    isBootstrapped: setupState?.isBootstrapped ?? false,
    adminConfigured: setupState?.adminConfigured ?? false,
    providerConfigured: input.providerConfigured ?? setupState?.providerConfigured ?? false,
    isReady: onboardingStatus === "completed" && Boolean(setupState?.completedAt),
    primaryChannel: lowerEnum<ChannelType>(setupState?.primaryChannel ?? "WHATSAPP"),
    providerType: setupState?.providerType
      ? lowerEnum<ProviderType>(setupState.providerType)
      : null,
    completedAt: setupState?.completedAt?.toISOString() ?? null,
    adminEmail: setupState?.adminEmail ?? null
  };
}

export function serializeProviderConnection(
  connection: Pick<
    ProviderConnection,
    | "accountId"
    | "authState"
    | "config"
    | "id"
    | "isPrimary"
    | "label"
    | "lastError"
    | "mode"
    | "provider"
    | "scope"
    | "secretHint"
    | "status"
    | "tokenExpiresAt"
    | "updatedAt"
  >
): ProviderConnectionDetails {
  const config =
    connection.config && typeof connection.config === "object"
      ? (connection.config as Record<string, unknown>)
      : null;

  return {
    id: connection.id,
    provider: lowerEnum<ProviderType>(connection.provider as PrismaProviderType),
    label: connection.label,
    mode: lowerEnum<ProviderConnectionMode>(connection.mode),
    status: lowerEnum<ProviderConnectionStatus>(
      connection.status as PrismaProviderConnectionStatus
    ),
    isPrimary: connection.isPrimary,
    secretHint: connection.secretHint,
    lastError: connection.lastError,
    tokenExpiresAt: connection.tokenExpiresAt?.toISOString() ?? null,
    scope: connection.scope,
    accountId: connection.accountId,
    accountEmail:
      config && typeof config.accountEmail === "string" ? config.accountEmail : null,
    accountName:
      config && typeof config.accountName === "string" ? config.accountName : null,
    authState: connection.authState,
    isExperimental: lowerEnum<ProviderType>(connection.provider as PrismaProviderType) === "chatgpt_oauth",
    updatedAt: connection.updatedAt.toISOString()
  };
}

export function serializeChannelConnection(
  connection: Pick<
    ChannelConnection,
    | "id"
    | "name"
    | "type"
    | "status"
    | "isPrimary"
    | "qrCodeData"
    | "qrExpiresAt"
    | "lastError"
    | "lastConnectedAt"
    | "lastActivityAt"
    | "updatedAt"
    | "sessionState"
  > & {
    eventLogs?: Array<Pick<ChannelEventLog, "id" | "type" | "message" | "createdAt">>;
  }
): ChannelConnectionDetails {
  return {
    id: connection.id,
    name: connection.name,
    type: lowerEnum<ChannelType>(connection.type as PrismaChannelType),
    status: lowerEnum<ChannelStatus>(connection.status as PrismaChannelStatus),
    isPrimary: connection.isPrimary,
    qrCodeData: connection.qrCodeData,
    qrExpiresAt: connection.qrExpiresAt?.toISOString() ?? null,
    lastError: connection.lastError,
    lastConnectedAt: connection.lastConnectedAt?.toISOString() ?? null,
    lastActivityAt: connection.lastActivityAt?.toISOString() ?? null,
    updatedAt: connection.updatedAt.toISOString(),
    sessionState: (connection.sessionState as Record<string, unknown> | null) ?? null,
    recentLogs: connection.eventLogs?.map((log) =>
      serializeChannelEventLog({
        ...log,
        channelConnection: {
          id: connection.id,
          name: connection.name,
          type: connection.type
        },
        payload: null
      })
    )
  };
}

export function serializeChannelEventLog(
  log: Pick<ChannelEventLog, "id" | "type" | "message" | "payload" | "createdAt"> & {
    channelConnection?: Pick<ChannelConnection, "id" | "name" | "type"> | null;
  }
): ChannelEventLogItem {
  return {
    channelConnectionId: log.channelConnection?.id ?? "",
    channelName: log.channelConnection?.name ?? null,
    channelType: log.channelConnection?.type
      ? lowerEnum<ChannelType>(log.channelConnection.type)
      : null,
    id: log.id,
    payload: (log.payload as Record<string, unknown> | null) ?? null,
    type: lowerEnum(log.type),
    message: log.message,
    createdAt: log.createdAt.toISOString()
  };
}

export function serializeSessionListItem(
  session: Pick<
    Session,
    | "id"
    | "status"
    | "externalUserId"
    | "externalConversationId"
    | "visitorName"
    | "lastMessageAt"
    | "startedAt"
    | "updatedAt"
  > & {
    agent: {
      id: string;
      name: string;
    };
    channelConnection: {
      id: string;
      name: string;
      type: PrismaChannelType;
      status: PrismaChannelStatus;
    };
    messages?: Array<Pick<Message, "content" | "createdAt">>;
    _count?: {
      messages: number;
    };
  }
): SessionListItem {
  const latestMessage = session.messages?.[0] ?? null;

  return {
    id: session.id,
    status: lowerEnum<SessionStatus>(session.status),
    channelConnectionId: session.channelConnection.id,
    channelName: session.channelConnection.name,
    channelType: lowerEnum<ChannelType>(session.channelConnection.type),
    channelStatus: lowerEnum<ChannelStatus>(session.channelConnection.status),
    agentId: session.agent.id,
    agentName: session.agent.name,
    externalUserId: session.externalUserId,
    externalConversationId: session.externalConversationId,
    visitorName: session.visitorName,
    lastMessageAt: session.lastMessageAt.toISOString(),
    startedAt: session.startedAt.toISOString(),
    updatedAt: session.updatedAt.toISOString(),
    lastPreview: latestMessage?.content ?? null,
    messageCount: session._count?.messages ?? 0
  };
}

export function serializeSessionTranscriptMessage(
  message: Pick<
    Message,
    | "id"
    | "role"
    | "content"
    | "tokenInput"
    | "tokenOutput"
    | "estimatedCostUsd"
    | "payload"
    | "externalMessageId"
    | "createdAt"
  >
): SessionTranscriptMessage {
  return {
    id: message.id,
    externalMessageId: message.externalMessageId ?? null,
    role: lowerEnum<MessageRole>(message.role),
    content: message.content,
    tokenInput: message.tokenInput ?? null,
    tokenOutput: message.tokenOutput ?? null,
    estimatedCostUsd: message.estimatedCostUsd?.toString() ?? null,
    payload: (message.payload as Record<string, unknown> | null) ?? null,
    createdAt: message.createdAt.toISOString()
  };
}

export function serializeSessionDetails(
  session: Pick<
    Session,
    | "id"
    | "status"
    | "externalUserId"
    | "externalConversationId"
    | "visitorName"
    | "summary"
    | "metadata"
    | "startedAt"
    | "lastMessageAt"
    | "closedAt"
  > & {
    agent: {
      id: string;
      name: string;
    };
    channelConnection: {
      id: string;
      name: string;
      type: PrismaChannelType;
      status: PrismaChannelStatus;
      lastActivityAt: Date | null;
      lastError: string | null;
    };
    messages: Array<
      Pick<
        Message,
        | "id"
        | "externalMessageId"
        | "role"
        | "content"
        | "tokenInput"
        | "tokenOutput"
        | "estimatedCostUsd"
        | "payload"
        | "createdAt"
      >
    >;
  }
): SessionDetailsResponse {
  return {
    id: session.id,
    status: lowerEnum<SessionStatus>(session.status),
    channelConnectionId: session.channelConnection.id,
    channelName: session.channelConnection.name,
    channelType: lowerEnum<ChannelType>(session.channelConnection.type),
    channelStatus: lowerEnum<ChannelStatus>(session.channelConnection.status),
    channelLastActivityAt: session.channelConnection.lastActivityAt?.toISOString() ?? null,
    channelLastError: session.channelConnection.lastError ?? null,
    agentId: session.agent.id,
    agentName: session.agent.name,
    externalUserId: session.externalUserId,
    externalConversationId: session.externalConversationId,
    visitorName: session.visitorName,
    summary: session.summary,
    metadata: (session.metadata as Record<string, unknown> | null) ?? null,
    startedAt: session.startedAt.toISOString(),
    lastMessageAt: session.lastMessageAt.toISOString(),
    closedAt: session.closedAt?.toISOString() ?? null,
    messageCount: session.messages.length,
    messages: session.messages.map((message) => serializeSessionTranscriptMessage(message))
  };
}
