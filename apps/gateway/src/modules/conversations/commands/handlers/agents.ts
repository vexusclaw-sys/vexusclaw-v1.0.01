import { AgentStatus } from "@vexus/db";

import { formatUnauthorizedMutationReply, isCommandMutationAllowed } from "../auth";
import { formatAgentList, formatAgentStatus } from "../format";
import type { ConversationCommandContext, ConversationCommandResult, ParsedSlashCommand } from "../types";

function resolveAgentSelection(
  value: string,
  agents: Array<{
    id: string;
    slug: string;
  }>
) {
  const trimmed = value.trim();
  const indexMatch = /^#?(\d+)$/.exec(trimmed);

  if (indexMatch) {
    const index = Number.parseInt(indexMatch[1] ?? "0", 10) - 1;
    return agents[index] ?? null;
  }

  return agents.find((agent) => agent.slug === trimmed.toLowerCase()) ?? null;
}

export async function handleAgentCommands(input: {
  command: ParsedSlashCommand;
  context: ConversationCommandContext;
}): Promise<ConversationCommandResult | null> {
  if (input.command.name !== "agents" && input.command.name !== "agent") {
    return null;
  }

  const agents = await input.context.prisma.agent.findMany({
    where: {
      deletedAt: null,
      status: AgentStatus.ACTIVE,
      workspaceId: input.context.workspaceId
    },
    orderBy: [
      {
        isDefault: "desc"
      },
      {
        createdAt: "asc"
      }
    ]
  });

  const selectedAgentId = input.context.selections.selectedAgentId ?? input.context.currentAgent.id;

  if (input.command.name === "agents") {
    return {
      command: input.command,
      reply: formatAgentList({
        agents: agents.map((agent) => ({
          isDefault: agent.isDefault,
          isSelected: agent.id === selectedAgentId,
          name: agent.name,
          slug: agent.slug,
          status: agent.status.toLowerCase()
        }))
      })
    };
  }

  if (!input.command.argsText) {
    return {
      command: input.command,
      reply: formatAgentStatus({
        currentAgentName: input.context.currentAgent.name,
        currentAgentSlug: input.context.currentAgent.slug
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

  const target = resolveAgentSelection(
    input.command.argsText,
    agents.map((agent) => ({
      id: agent.id,
      slug: agent.slug
    }))
  );

  if (!target) {
    return {
      command: input.command,
      reply: "Agent not found. Use /agents to list the available agent slugs and indexes."
    };
  }

  const agent = agents.find((entry) => entry.id === target.id)!;

  return {
    command: input.command,
    reply: `Agent set to ${agent.name} (${agent.slug}). New messages in this conversation will use this agent.`,
    sessionMetadataPatch: {
      selectedAgentId: agent.id
    }
  };
}
