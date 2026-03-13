import type { ParsedSlashCommand } from "./types";

const slashCommandPattern = /^\/([a-z][a-z0-9-]*)(?::|\b)([\s\S]*)$/i;

export function parseSlashCommand(text: string): ParsedSlashCommand | null {
  const normalized = text.trim();

  if (!normalized.startsWith("/")) {
    return null;
  }

  const match = slashCommandPattern.exec(normalized);

  if (!match) {
    return null;
  }

  const argsText = match[2]?.trim() ?? "";

  return {
    argsText,
    name: (match[1] ?? "").toLowerCase(),
    normalized,
    raw: text,
    tokens: argsText ? argsText.split(/\s+/g).filter(Boolean) : []
  };
}
