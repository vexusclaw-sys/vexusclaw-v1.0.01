import { formatUnauthorizedMutationReply, isCommandMutationAllowed } from "../auth";
import { formatModelList, formatModelStatus } from "../format";
import { loadWorkspaceModelCatalog } from "../services/model-catalog";
import type { ConversationCommandContext, ConversationCommandResult, ParsedSlashCommand } from "../types";

const visibleModelLimit = 40;

function resolveModelSelection(value: string, keys: string[]): string | null {
  const trimmed = value.trim().toLowerCase();
  const indexMatch = /^#?(\d+)$/.exec(trimmed);

  if (indexMatch) {
    const index = Number.parseInt(indexMatch[1] ?? "0", 10) - 1;
    return keys[index] ?? null;
  }

  return keys.find((key) => key.toLowerCase() === trimmed) ?? null;
}

export async function handleModelCommands(input: {
  command: ParsedSlashCommand;
  context: ConversationCommandContext;
}): Promise<ConversationCommandResult | null> {
  if (input.command.name !== "models" && input.command.name !== "model") {
    return null;
  }

  const catalog = await loadWorkspaceModelCatalog({
    env: input.context.env,
    logger: input.context.logger,
    prisma: input.context.prisma,
    workspaceId: input.context.workspaceId
  });
  const currentSelection = input.context.selections.modelOverride ?? catalog.defaultSelection;
  const currentKey = `${currentSelection.providerType}/${currentSelection.model}`;

  if (input.command.name === "models") {
    const visibleModels = catalog.entries.slice(0, visibleModelLimit);

    return {
      command: input.command,
      reply: formatModelList({
        current: currentKey,
        models: visibleModels.map((entry) => ({
          connectionLabel: entry.connectionLabel,
          isCurrent: entry.key === currentKey,
          isDefault:
            entry.providerType === catalog.defaultSelection.providerType &&
            entry.model === catalog.defaultSelection.model,
          key: entry.key,
          source: entry.source
        })),
        truncatedCount: Math.max(0, catalog.entries.length - visibleModels.length)
      })
    };
  }

  const argsText = input.command.argsText.trim();

  if (!argsText || argsText === "status") {
    return {
      command: input.command,
      reply: formatModelStatus({
        current: currentKey,
        defaultModel: `${catalog.defaultSelection.providerType}/${catalog.defaultSelection.model}`,
        hasOverride: Boolean(input.context.selections.modelOverride)
      })
    };
  }

  if (
    !isCommandMutationAllowed({
      channelConfig: input.context.channelConnection.config,
      env: input.context.env,
      externalUserId: input.context.externalUserId
    })
  ) {
    return {
      command: input.command,
      reply: formatUnauthorizedMutationReply()
    };
  }

  const resolvedKey = resolveModelSelection(
    argsText,
    catalog.entries.map((entry) => entry.key)
  );

  if (!resolvedKey) {
    return {
      command: input.command,
      reply: "Model not found. Use /models to list the available provider/model entries."
    };
  }

  const target = catalog.entries.find((entry) => entry.key === resolvedKey)!;

  return {
    command: input.command,
    reply: `Model override set to ${target.key}.`,
    sessionMetadataPatch: {
      modelOverride: {
        model: target.model,
        providerType: target.providerType,
        setAt: new Date().toISOString()
      }
    }
  };
}
