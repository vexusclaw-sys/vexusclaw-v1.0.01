import type { VexusEnv } from "@vexus/config";

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function normalizeDeviceSuffix(value: string): string {
  return value.replace(/:\d+(?=@)/, "");
}

function buildSenderVariants(value: string): string[] {
  const trimmed = value.trim().toLowerCase();

  if (!trimmed) {
    return [];
  }

  const normalized = normalizeDeviceSuffix(trimmed);
  const bare = normalized.replace(/@.*$/, "");
  const digits = bare.replace(/\D/g, "");

  return Array.from(new Set([trimmed, normalized, bare, digits].filter(Boolean)));
}

export function resolveAllowedCommandSenders(env: VexusEnv, channelConfig: unknown): string[] {
  const config = asRecord(channelConfig);
  const commands = asRecord(config?.commands);
  const configured =
    Array.isArray(commands?.allowedSenders) && commands?.allowedSenders.length > 0
      ? commands.allowedSenders
      : env.WHATSAPP_COMMAND_ALLOWED_SENDERS.split(",");

  return configured
    .flatMap((value) => (typeof value === "string" ? buildSenderVariants(value) : []))
    .filter(Boolean);
}

export function isCommandMutationAllowed(input: {
  channelConfig: unknown;
  env: VexusEnv;
  externalUserId: string;
}): boolean {
  const allowed = resolveAllowedCommandSenders(input.env, input.channelConfig);

  if (allowed.length === 0) {
    return false;
  }

  const senderVariants = buildSenderVariants(input.externalUserId);
  return senderVariants.some((variant) => allowed.includes(variant));
}

export function formatUnauthorizedMutationReply(): string {
  return "This command is restricted. Add your sender to commands.allowedSenders or WHATSAPP_COMMAND_ALLOWED_SENDERS.";
}
