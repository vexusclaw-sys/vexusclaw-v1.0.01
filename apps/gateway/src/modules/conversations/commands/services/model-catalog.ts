import { decryptSecret } from "@vexus/auth";
import type { VexusEnv } from "@vexus/config";
import type { PrismaClient } from "@vexus/db";
import { ProviderConnectionStatus } from "@vexus/db";
import type { ProviderType } from "@vexus/shared";

import type { ModelCatalogEntry, SessionModelOverride, WorkspaceModelCatalog } from "../types";

const openAiDefaultModel = "gpt-4o-mini";
const mockDefaultModel = "mock-default";

function toDefaultSelection(providerType: ProviderType, model: string): SessionModelOverride {
  return {
    model,
    providerType,
    setAt: new Date(0).toISOString()
  };
}

async function loadOpenAIModels(apiKey: string): Promise<string[]> {
  const response = await fetch("https://api.openai.com/v1/models", {
    headers: {
      Authorization: `Bearer ${apiKey}`
    },
    signal: AbortSignal.timeout(8_000)
  });

  if (!response.ok) {
    throw new Error(`OpenAI returned status ${response.status}.`);
  }

  const payload = (await response.json()) as {
    data?: Array<{ id?: string }>;
  };

  return Array.from(
    new Set(
      (payload.data ?? [])
        .map((entry) => entry.id?.trim())
        .filter((entry): entry is string => Boolean(entry))
        .sort((left, right) => left.localeCompare(right))
    )
  );
}

export async function loadWorkspaceModelCatalog(input: {
  env: VexusEnv;
  logger: {
    warn(payload: unknown, message: string): void;
  };
  prisma: PrismaClient;
  workspaceId: string;
}): Promise<WorkspaceModelCatalog> {
  const connections = await input.prisma.providerConnection.findMany({
    where: {
      deletedAt: null,
      status: ProviderConnectionStatus.CONNECTED,
      workspaceId: input.workspaceId
    },
    orderBy: [
      {
        isPrimary: "desc"
      },
      {
        updatedAt: "desc"
      }
    ]
  });

  const preferredByProvider = new Map<ProviderType, (typeof connections)[number]>();

  for (const connection of connections) {
    const providerType = connection.provider.toLowerCase() as ProviderType;

    if (!preferredByProvider.has(providerType)) {
      preferredByProvider.set(providerType, connection);
    }
  }

  const entries: ModelCatalogEntry[] = [];

  for (const [providerType, connection] of preferredByProvider.entries()) {
    if (providerType === "openai") {
      const apiKey = connection.encryptedSecret ? decryptSecret(connection.encryptedSecret) : "";

      try {
        const models = apiKey ? await loadOpenAIModels(apiKey) : [];

        if (models.length > 0) {
          entries.push(
            ...models.map((model) => ({
              connectionId: connection.id,
              connectionLabel: connection.label,
              isPrimary: connection.isPrimary,
              key: `openai/${model}`,
              model,
              providerType,
              source: "openai_api" as const
            }))
          );
          continue;
        }
      } catch (error) {
        input.logger.warn(
          {
            connectionId: connection.id,
            error,
            workspaceId: input.workspaceId
          },
          "OpenAI model catalog fetch failed"
        );
      }

      entries.push({
        connectionId: connection.id,
        connectionLabel: connection.label,
        isPrimary: connection.isPrimary,
        key: `openai/${openAiDefaultModel}`,
        model: openAiDefaultModel,
        providerType,
        source: "openai_default"
      });
      continue;
    }

    if (providerType === "chatgpt_oauth") {
      entries.push({
        connectionId: connection.id,
        connectionLabel: connection.label,
        isPrimary: connection.isPrimary,
        key: `chatgpt_oauth/${input.env.OPENAI_CHATGPT_RUNTIME_MODEL}`,
        model: input.env.OPENAI_CHATGPT_RUNTIME_MODEL,
        providerType,
        source: "chatgpt_runtime"
      });
      continue;
    }

    entries.push({
      connectionId: connection.id,
      connectionLabel: connection.label,
      isPrimary: connection.isPrimary,
      key: `mock/${mockDefaultModel}`,
      model: mockDefaultModel,
      providerType,
      source: "mock"
    });
  }

  if (entries.length === 0) {
    entries.push({
      connectionId: null,
      connectionLabel: "Fallback mock",
      isPrimary: true,
      key: `mock/${mockDefaultModel}`,
      model: mockDefaultModel,
      providerType: "mock",
      source: "mock"
    });
  }

  const primaryEntry = entries.find((entry) => entry.isPrimary) ?? entries[0]!;

  return {
    defaultSelection: toDefaultSelection(primaryEntry.providerType, primaryEntry.model),
    entries: entries.sort((left, right) => left.key.localeCompare(right.key))
  };
}
