import { formatCommandList } from "../format";
import type { ConversationCommandResult, ParsedSlashCommand } from "../types";

export async function handleHelpCommands(input: {
  command: ParsedSlashCommand;
}): Promise<ConversationCommandResult | null> {
  if (input.command.name !== "help" && input.command.name !== "commands") {
    return null;
  }

  return {
    command: input.command,
    reply: formatCommandList()
  };
}
