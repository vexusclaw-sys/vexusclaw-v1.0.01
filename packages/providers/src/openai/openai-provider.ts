import os from "node:os";

import OpenAI from "openai";

import { readEnv } from "@vexus/config";
import type {
  AgentRuntimeContext,
  ProviderAdapter,
  ProviderCompletion,
  ProviderMessage
} from "@vexus/sdk";

interface OpenAIRuntimeOptions {
  apiKeyMetadataKey: string;
  configuredCheck: (env: ReturnType<typeof readEnv>) => boolean;
  key: ProviderAdapter["key"];
  label: string;
}

interface ResponsesUsagePayload {
  input_tokens?: number;
  input_tokens_details?: {
    cached_tokens?: number;
  };
  output_tokens?: number;
  total_tokens?: number;
}

interface ResponsesPayload {
  error?: {
    code?: string;
    message?: string;
    type?: string;
  };
}

interface CodexRequestInputContent {
  text: string;
  type: "input_text";
}

interface CodexRequestUserMessage {
  content: CodexRequestInputContent[];
  role: "user";
}

interface CodexRequestAssistantContent {
  annotations: [];
  text: string;
  type: "output_text";
}

interface CodexRequestAssistantMessage {
  content: CodexRequestAssistantContent[];
  id: string;
  phase?: "commentary" | "final_answer";
  role: "assistant";
  status: "completed";
  type: "message";
}

type CodexRequestMessage = CodexRequestAssistantMessage | CodexRequestUserMessage;

interface CodexCompletedResponse {
  model?: string;
  status?: string;
  usage?: ResponsesUsagePayload;
}

interface CodexResponseCompletedEvent {
  response?: CodexCompletedResponse;
  type: "response.completed" | "response.done";
}

interface CodexResponseFailedEvent {
  response?: {
    error?: {
      message?: string;
    };
  };
  type: "response.failed";
}

interface CodexResponseTextDeltaEvent {
  delta?: string;
  type: "response.output_text.delta" | "response.refusal.delta";
}

interface CodexResponseItemDoneEvent {
  item?: {
    content?: Array<
      | {
          text?: string;
          type: "output_text";
        }
      | {
          refusal?: string;
          type: "refusal";
        }
    >;
    type?: string;
  };
  type: "response.output_item.done";
}

interface CodexErrorEvent {
  code?: string;
  message?: string;
  type: "error";
}

type CodexSseEvent =
  | CodexErrorEvent
  | CodexResponseCompletedEvent
  | CodexResponseFailedEvent
  | CodexResponseItemDoneEvent
  | CodexResponseTextDeltaEvent;

interface CodexStreamResult {
  content: string;
  usage?: ProviderCompletion["usage"];
  model?: string;
}

class BaseOpenAIProviderAdapter implements ProviderAdapter {
  readonly key: ProviderAdapter["key"];
  readonly label: string;
  readonly supportsStreaming = true;
  private readonly apiKeyMetadataKey: string;
  private readonly configuredCheck: OpenAIRuntimeOptions["configuredCheck"];

  constructor(options: OpenAIRuntimeOptions) {
    this.apiKeyMetadataKey = options.apiKeyMetadataKey;
    this.configuredCheck = options.configuredCheck;
    this.key = options.key;
    this.label = options.label;
  }

  async isConfigured(): Promise<boolean> {
    return this.configuredCheck(readEnv());
  }

  protected resolveRuntimeToken(context: AgentRuntimeContext): string | undefined {
    const metadata =
      context.metadata && typeof context.metadata === "object"
        ? (context.metadata as Record<string, unknown>)
        : null;

    return metadata && typeof metadata[this.apiKeyMetadataKey] === "string"
      ? (metadata[this.apiKeyMetadataKey] as string)
      : undefined;
  }

  protected resolveRuntimeModel(context: AgentRuntimeContext, fallbackModel: string): string {
    const metadata =
      context.metadata && typeof context.metadata === "object"
        ? (context.metadata as Record<string, unknown>)
        : null;

    return metadata && typeof metadata.providerModel === "string" && metadata.providerModel.trim()
      ? metadata.providerModel.trim()
      : fallbackModel;
  }

  async chat(messages: ProviderMessage[], context: AgentRuntimeContext): Promise<ProviderCompletion> {
    const env = readEnv();
    const runtimeToken = this.resolveRuntimeToken(context);
    const fallbackApiKey =
      this.key === "openai" && typeof env.OPENAI_API_KEY === "string" ? env.OPENAI_API_KEY : undefined;
    const apiKey = runtimeToken ?? fallbackApiKey;

    if (!apiKey) {
      throw new Error(`${this.label} credentials are not configured.`);
    }

    const client = new OpenAI({
      apiKey
    });

    const completion = await client.chat.completions.create({
      messages: messages.map((message) => ({
        content: message.content,
        role: message.role === "tool" ? "assistant" : message.role
      })),
      model: this.resolveRuntimeModel(context, "gpt-4o-mini")
    });

    const choice = completion.choices[0]?.message?.content;

    return {
      content: choice ?? messages.at(-1)?.content ?? `${this.label} response unavailable.`,
      model: completion.model,
      provider: this.key,
      usage: completion.usage
        ? {
            estimatedCostUsd: undefined,
            inputTokens: completion.usage.prompt_tokens,
            outputTokens: completion.usage.completion_tokens
          }
        : undefined
    };
  }
}

function buildCodexInput(messages: ProviderMessage[]): CodexRequestMessage[] {
  return messages
    .filter((message) => message.role !== "system")
    .map((message, index) => {
      if (message.role === "assistant") {
        return {
          content: [
            {
              annotations: [],
              text: message.content,
              type: "output_text"
            }
          ],
          id: `msg_${index}`,
          role: "assistant",
          status: "completed",
          type: "message"
        } satisfies CodexRequestAssistantMessage;
      }

      return {
        content: [
          {
            text: message.content,
            type: "input_text"
          }
        ],
        role: "user"
      } satisfies CodexRequestUserMessage;
    });
}

function extractSystemPrompt(messages: ProviderMessage[]): string | undefined {
  const system = messages.find((message) => message.role === "system");
  const content = system?.content?.trim();

  return content ? content : undefined;
}

function isCloudflareChallenge(body: string): boolean {
  const lower = body.toLowerCase();
  return (
    lower.includes("enable javascript and cookies to continue") ||
    lower.includes("__cf_chl_opt") ||
    lower.includes("challenge-platform")
  );
}

function extractJsonError(body: string): string | null {
  try {
    const parsed = JSON.parse(body) as ResponsesPayload;
    return typeof parsed.error?.message === "string" ? parsed.error.message : null;
  } catch {
    return null;
  }
}

function buildCodexUserAgent(): string {
  return `pi (${os.platform()} ${os.release()}; ${os.arch()})`;
}

function buildCodexFriendlyRateLimitMessage(body: string, status: number): string | null {
  try {
    const parsed = JSON.parse(body) as ResponsesPayload & {
      error?: {
        code?: string;
        plan_type?: string;
        resets_at?: number;
      };
    };
    const error = parsed.error;
    const code = error?.code ?? error?.type ?? "";

    if (!/usage_limit_reached|usage_not_included|rate_limit_exceeded/i.test(code) && status !== 429) {
      return null;
    }

    const plan = typeof error?.plan_type === "string" ? ` (${error.plan_type.toLowerCase()} plan)` : "";
    const mins =
      typeof error?.resets_at === "number"
        ? Math.max(0, Math.round((error.resets_at * 1000 - Date.now()) / 60_000))
        : undefined;
    const when = typeof mins === "number" ? ` Try again in ~${mins} min.` : "";

    return `You have hit your ChatGPT usage limit${plan}.${when}`.trim();
  } catch {
    return status === 429 ? "You have hit your ChatGPT usage limit." : null;
  }
}

function extractCodexEventMessage(event: CodexSseEvent): string | null {
  if (event.type === "error") {
    return event.message ?? event.code ?? `Codex request failed: ${JSON.stringify(event)}`;
  }

  if (event.type === "response.failed") {
    return (
      event.response?.error?.message ??
      `Codex response failed: ${JSON.stringify(event.response?.error ?? event)}`
    );
  }

  return null;
}

function extractCodexUsage(usage?: ResponsesUsagePayload): ProviderCompletion["usage"] | undefined {
  if (!usage) {
    return undefined;
  }

  const cachedTokens = usage.input_tokens_details?.cached_tokens ?? 0;
  const inputTokens =
    typeof usage.input_tokens === "number" ? Math.max(0, usage.input_tokens - cachedTokens) : undefined;

  return {
    estimatedCostUsd: undefined,
    inputTokens,
    outputTokens: usage.output_tokens
  };
}

async function* parseSseEvents(response: Response): AsyncGenerator<CodexSseEvent> {
  if (!response.body) {
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    let splitIndex = buffer.indexOf("\n\n");

    while (splitIndex !== -1) {
      const chunk = buffer.slice(0, splitIndex);
      buffer = buffer.slice(splitIndex + 2);

      const data = chunk
        .split("\n")
        .filter((line) => line.startsWith("data:"))
        .map((line) => line.slice(5).trim())
        .join("\n")
        .trim();

      if (data && data !== "[DONE]") {
        try {
          yield JSON.parse(data) as CodexSseEvent;
        } catch {
          // Ignore malformed events and continue parsing the stream.
        }
      }

      splitIndex = buffer.indexOf("\n\n");
    }
  }
}

async function parseCodexResponse(response: Response): Promise<CodexStreamResult> {
  let content = "";
  let fallbackText = "";
  let model: string | undefined;
  let usage: ProviderCompletion["usage"] | undefined;
  let sawCompletion = false;

  for await (const event of parseSseEvents(response)) {
    const errorMessage = extractCodexEventMessage(event);

    if (errorMessage) {
      throw new Error(errorMessage);
    }

    if (event.type === "response.output_text.delta" || event.type === "response.refusal.delta") {
      if (typeof event.delta === "string") {
        content += event.delta;
      }
      continue;
    }

    if (event.type === "response.output_item.done" && event.item?.type === "message") {
      const text = event.item.content
        ?.map((part) => {
          if (part.type === "output_text") {
            return part.text ?? "";
          }

          return part.refusal ?? "";
        })
        .join("")
        .trim();

      if (text) {
        fallbackText = text;
      }

      continue;
    }

    if (event.type === "response.completed" || event.type === "response.done") {
      sawCompletion = true;
      model = event.response?.model;
      usage = extractCodexUsage(event.response?.usage);
    }
  }

  if (!content.trim() && !fallbackText && !sawCompletion) {
    throw new Error("Codex stream ended without a completed response.");
  }

  return {
    content: content.trim() || fallbackText,
    model,
    usage
  };
}

function shouldRetryCodexError(error: unknown, attempt: number): boolean {
  if (attempt >= 2 || !(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();

  return (
    message.includes("codex request failed") ||
    message.includes("codex response failed") ||
    message.includes("stream ended without a completed response") ||
    message.includes("fetch failed") ||
    message.includes("terminated")
  );
}

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export class OpenAIProviderAdapter extends BaseOpenAIProviderAdapter {
  constructor() {
    super({
      apiKeyMetadataKey: "openaiApiKey",
      configuredCheck: (env) => Boolean(env.OPENAI_API_KEY),
      key: "openai",
      label: "OpenAI"
    });
  }
}

export class ChatGptOAuthProviderAdapter implements ProviderAdapter {
  readonly key = "chatgpt_oauth" as const;
  readonly label = "ChatGPT OAuth";
  readonly supportsStreaming = true;

  async isConfigured(): Promise<boolean> {
    const env = readEnv();
    return env.OPENAI_CHATGPT_OAUTH_ENABLED && Boolean(env.OPENAI_CHATGPT_OAUTH_CLIENT_ID.trim());
  }

  async chat(messages: ProviderMessage[], context: AgentRuntimeContext): Promise<ProviderCompletion> {
    const env = readEnv();
    const metadata =
      context.metadata && typeof context.metadata === "object"
        ? (context.metadata as Record<string, unknown>)
        : null;
    const accessToken =
      metadata && typeof metadata.chatgptAccessToken === "string"
        ? metadata.chatgptAccessToken
        : undefined;
    const accountId =
      metadata && typeof metadata.chatgptAccountId === "string"
        ? metadata.chatgptAccountId
        : undefined;
    const providerModel =
      metadata && typeof metadata.providerModel === "string" && metadata.providerModel.trim()
        ? metadata.providerModel.trim()
        : env.OPENAI_CHATGPT_RUNTIME_MODEL;

    if (!accessToken) {
      throw new Error("ChatGPT OAuth credentials are not configured.");
    }

    if (!accountId) {
      throw new Error("ChatGPT OAuth accountId is missing. Reconnect or import the session again.");
    }

    if (env.OPENAI_CHATGPT_RUNTIME_TRANSPORT !== "sse") {
      throw new Error(
        `Unsupported ChatGPT Codex transport: ${env.OPENAI_CHATGPT_RUNTIME_TRANSPORT}.`
      );
    }

    for (let attempt = 1; attempt <= 2; attempt += 1) {
      try {
        const response = await fetch(`${env.OPENAI_CHATGPT_RUNTIME_BASE_URL}/codex/responses`, {
          body: JSON.stringify({
            include: ["reasoning.encrypted_content"],
            input: buildCodexInput(messages),
            instructions: extractSystemPrompt(messages),
            model: providerModel,
            parallel_tool_calls: true,
            prompt_cache_key: context.sessionId,
            store: false,
            stream: true,
            text: {
              verbosity: env.OPENAI_CHATGPT_RUNTIME_TEXT_VERBOSITY
            },
            tool_choice: "auto"
          }),
          headers: {
            Accept: "text/event-stream",
            Authorization: `Bearer ${accessToken}`,
            "chatgpt-account-id": accountId,
            "Content-Type": "application/json",
            "OpenAI-Beta": "responses=experimental",
            originator: env.OPENAI_CHATGPT_RUNTIME_ORIGINATOR,
            session_id: context.sessionId,
            "User-Agent": buildCodexUserAgent()
          },
          method: "POST"
        });

        if (!response.ok) {
          const rawBody = await response.text();

          if (response.status === 403 && isCloudflareChallenge(rawBody)) {
            throw new Error(
              "ChatGPT Codex runtime is blocked by chatgpt.com anti-bot protection on this server. This OAuth session needs a local/browser-side runtime or a provider with server-to-server access."
            );
          }

          const message =
            buildCodexFriendlyRateLimitMessage(rawBody, response.status) ?? extractJsonError(rawBody);

          throw new Error(
            message ?? `ChatGPT Codex runtime request failed with status ${response.status}.`
          );
        }

        const payload = await parseCodexResponse(response);
        const text = payload.content || messages.at(-1)?.content || "ChatGPT OAuth response unavailable.";

        return {
          content: text,
          model: payload.model ?? providerModel,
          provider: this.key,
          usage: payload.usage
        };
      } catch (error) {
        if (!shouldRetryCodexError(error, attempt)) {
          throw error;
        }

        await sleep(250);
      }
    }

    throw new Error("ChatGPT Codex runtime exhausted its retry budget.");
  }
}
