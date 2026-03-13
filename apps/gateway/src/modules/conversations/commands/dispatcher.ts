import { formatCommandError } from "./format";
import { handleAgentCommands } from "./handlers/agents";
import { handleHelpCommands } from "./handlers/help";
import { handleModelCommands } from "./handlers/models";
import { handleSkillCommands } from "./handlers/skills";
import { parseSlashCommand } from "./parser";
import type { ConversationCommandContext, ConversationCommandResult } from "./types";

export async function dispatchConversationCommand(
  context: ConversationCommandContext,
  message: string
): Promise<ConversationCommandResult | null> {
  const command = parseSlashCommand(message);

  if (!command) {
    return null;
  }

  try {
    const handlers = [handleHelpCommands, handleAgentCommands, handleModelCommands, handleSkillCommands];

    for (const handler of handlers) {
      const result = await handler({
        command,
        context
      } as never);

      if (result) {
        return result;
      }
    }

    return {
      command,
      reply: `Unknown command: /${command.name}. Use /commands to list the supported commands.`
    };
  } catch (error) {
    context.logger.error(
      {
        command: command.normalized,
        error,
        sessionId: context.session.id,
        workspaceId: context.workspaceId
      },
      "Conversation command execution failed"
    );

    return {
      assistantPayload: {
        commandError: true
      },
      command,
      reply: formatCommandError(error instanceof Error ? error.message : "Unknown command failure.")
    };
  }
}
