"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import type {
  ChatGptOAuthStartResponse,
  ProviderConnectionDetails
} from "@vexus/shared";
import { SurfaceCard } from "@vexus/ui";

import { ApiClientError, apiPost, apiRequest } from "../lib/api";
import { queryKeys } from "../lib/query-keys";
import { CopyButton } from "./copy-button";

type OAuthUiState = "aguardando" | "autenticando" | "conectado" | "erro" | "idle";
const localCodexRedirectUri = "http://localhost:1455/auth/callback";

interface ChatGptOAuthPanelProps {
  returnToPath: string;
  suggestedLabel: string;
  title?: string;
}

function providerTone(provider: ProviderConnectionDetails | null): string {
  if (!provider) {
    return "Nenhum provider ChatGPT OAuth conectado ainda.";
  }

  const emailSuffix = provider.accountEmail ? ` · ${provider.accountEmail}` : "";
  return `${provider.label}${emailSuffix} · status ${provider.status}`;
}

export function ChatGptOAuthPanel({
  returnToPath,
  suggestedLabel,
  title = "Entrar com ChatGPT (experimental)"
}: ChatGptOAuthPanelProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [manualCallbackUrl, setManualCallbackUrl] = useState("");
  const [oauthError, setOauthError] = useState<string | null>(null);
  const [oauthState, setOauthState] = useState<OAuthUiState>("idle");
  const [authorizeUrl, setAuthorizeUrl] = useState<string | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [attemptExpiresAt, setAttemptExpiresAt] = useState<string | null>(null);

  const providersQuery = useQuery({
    queryFn: () => apiRequest<ProviderConnectionDetails[]>("/providers"),
    queryKey: queryKeys.providers
  });
  const providers = providersQuery.data ?? [];
  const oauthProvider = useMemo(
    () =>
      providers.find((provider) => provider.provider === "chatgpt_oauth" && provider.status === "connected") ??
      providers.find((provider) => provider.provider === "chatgpt_oauth") ??
      null,
    [providers]
  );

  useEffect(() => {
    const listener = (event: MessageEvent) => {
      if (typeof window === "undefined") {
        return;
      }

      if (event.origin !== window.location.origin) {
        return;
      }

      const payload =
        event.data && typeof event.data === "object"
          ? (event.data as Record<string, unknown>)
          : null;

      if (!payload || payload.type !== "vexusclaw:chatgpt-oauth") {
        return;
      }

      const status = payload.status === "success" ? "conectado" : "erro";
      const message =
        typeof payload.message === "string"
          ? payload.message
          : status === "conectado"
            ? "Conexao concluida com sucesso."
            : "A conexao OAuth falhou.";

      setOauthState(status);
      setOauthError(status === "erro" ? message : null);

      void Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.providers }),
        queryClient.invalidateQueries({ queryKey: queryKeys.settings }),
        queryClient.invalidateQueries({ queryKey: queryKeys.overview })
      ]);

      if (status === "conectado") {
        toast.success(message);
      } else {
        toast.error(message);
      }
    };

    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, [queryClient]);

  const startMutation = useMutation({
    mutationFn: () =>
      apiPost<ChatGptOAuthStartResponse>("/providers/chatgpt/oauth/start", {
        label: suggestedLabel,
        makePrimary: true,
        returnToPath
      }),
    onSuccess: (result) => {
      setAuthorizeUrl(result.authorizeUrl);
      setAttemptId(result.attemptId);
      setAttemptExpiresAt(result.expiresAt);
      setOauthError(null);
      setOauthState("aguardando");
      toast.success("Link de conexao ChatGPT gerado.");
    },
    onError: (error) => {
      if (error instanceof ApiClientError && error.status === 401) {
        const message = "Sua sessao expirou. Entre no Mission Control novamente.";
        setOauthState("erro");
        setOauthError(message);
        toast.error(message);
        router.replace("/login");
        return;
      }

      const message =
        error instanceof ApiClientError ? error.message : "Nao foi possivel iniciar o fluxo ChatGPT OAuth.";
      setOauthState("erro");
      setOauthError(message);
      toast.error(message);
    }
  });

  const manualCompleteMutation = useMutation({
    mutationFn: () =>
      apiPost<ProviderConnectionDetails>("/providers/chatgpt/oauth/complete-manual", {
        attemptId: attemptId ?? undefined,
        callbackUrl: manualCallbackUrl.trim()
      }),
    onSuccess: async (provider) => {
      setOauthState("conectado");
      setOauthError(null);
      setManualCallbackUrl("");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.providers }),
        queryClient.invalidateQueries({ queryKey: queryKeys.settings }),
        queryClient.invalidateQueries({ queryKey: queryKeys.overview })
      ]);
      toast.success(`Conexao concluida. Provider ativo: ${provider.label}.`);
    },
    onError: (error) => {
      if (error instanceof ApiClientError && error.status === 401) {
        const message = "Sua sessao expirou. Entre no Mission Control novamente.";
        setOauthState("erro");
        setOauthError(message);
        toast.error(message);
        router.replace("/login");
        return;
      }

      const message =
        error instanceof ApiClientError ? error.message : "Nao foi possivel concluir o callback manual.";
      setOauthState("erro");
      setOauthError(message);
      toast.error(message);
    }
  });

  const openInNewTab = async () => {
    let url = authorizeUrl;

    if (!url) {
      const result = await startMutation.mutateAsync();
      url = result.authorizeUrl;
    }

    setOauthState("autenticando");

    const nextTab = window.open(url, "_blank", "noopener,noreferrer");

    if (!nextTab) {
      setOauthState("erro");
      setOauthError("Seu navegador bloqueou a nova aba. Copie o link de conexao e abra manualmente.");
      toast.error("Nova aba bloqueada pelo navegador.");
      return;
    }

    nextTab.focus();
    toast.message("Login aberto em nova aba. Se terminar em localhost, copie a URL final e cole no fallback manual.");
  };

  return (
    <SurfaceCard className="space-y-4 border border-white/10 bg-white/[0.02]">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">ChatGPT sign-in</p>
        <h3 className="mt-2 text-lg font-semibold text-white">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Fluxo experimental baseado em OAuth Authorization Code + PKCE no estilo Codex/OpenClaw.
          A API key continua sendo o caminho estavel. Este login usa callback local e, em servidor
          remoto, normalmente depende do fallback manual.
        </p>
      </div>

      {oauthProvider ? (
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
          <p className="text-sm font-medium text-white">Provider ChatGPT OAuth conectado</p>
          <p className="mt-2 text-sm leading-6 text-slate-200">{providerTone(oauthProvider)}</p>
          <p className="mt-2 text-sm leading-6 text-slate-200">
            Expira em: {oauthProvider.tokenExpiresAt ?? "nao informado pelo provedor"}
          </p>
        </div>
      ) : null}

      <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4">
        <p className="text-sm font-medium text-white">Experimental</p>
        <p className="mt-2 text-sm leading-6 text-slate-200">
          A API key continua sendo o modo estavel. Esse fluxo usa sign-in tipo Codex/ChatGPT com
          callback local, pode exigir copiar a URL final manualmente e depende do navegador e da
          OpenAI aceitarem o fluxo atual.
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-200">
          Redirect atual do experimento: <span className="break-all font-medium text-white">{localCodexRedirectUri}</span>
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-200">
          Em VPS/remoto, o caminho mais fiel ao OpenClaw e abrir o login no seu navegador local.
          Se quiser tentar captura automatica, use port-forward da porta <span className="font-medium text-white">1455</span>.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">
        <p className="font-medium text-white">Como usar agora</p>
        <p className="mt-2 leading-6">
          1. Gere o link. 2. Abra o login em nova aba. 3. Se a OpenAI terminar em localhost/127.0.0.1,
          copie a URL final do navegador. 4. Cole abaixo em Concluir callback manual.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <button
          className="rounded-full border border-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:border-mission-300/30 hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={startMutation.isPending}
          onClick={() => startMutation.mutate()}
          type="button"
        >
          {startMutation.isPending ? "Gerando..." : "Gerar link de conexao"}
        </button>
        <button
          className="rounded-full bg-mission-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-mission-300 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={startMutation.isPending}
          onClick={() => void openInNewTab()}
          type="button"
        >
          Abrir login em nova aba
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">
        <p>Estado atual: <span className="font-medium text-white">{oauthState}</span></p>
        <p className="mt-2">Attempt ID: <span className="break-all text-white">{attemptId ?? "ainda nao gerado"}</span></p>
        <p className="mt-2">
          Expira em: <span className="text-white">{attemptExpiresAt ?? "aguardando geracao"}</span>
        </p>
        {authorizeUrl ? (
          <div className="mt-4 flex flex-wrap gap-3">
            <CopyButton label="Copiar link de conexao" value={authorizeUrl} />
            <CopyButton label="Copiar redirect local" value={localCodexRedirectUri} />
            <a
              className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white transition hover:border-mission-300/30 hover:bg-white/[0.04]"
              href={authorizeUrl}
              rel="noreferrer"
              target="_blank"
            >
              Abrir em nova aba
            </a>
          </div>
        ) : null}
      </div>

      <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <p className="text-sm font-medium text-white">Fallback manual</p>
        <p className="text-sm leading-6 text-slate-300">
          Esse experimento segue o modelo local do Codex/OpenClaw. Se a aba terminar em{" "}
          <span className="font-medium text-white">{localCodexRedirectUri}</span> ou equivalente em
          localhost/127.0.0.1, copie a URL final completa e cole aqui. Tambem aceitamos{" "}
          <span className="font-medium text-white">code#state</span> ou{" "}
          <span className="font-medium text-white">code=...&state=...</span>. Se voce colar so o{" "}
          <span className="font-medium text-white">code</span>, usamos a tentativa atual quando
          possivel.
        </p>
        <textarea
          className="min-h-28 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-white outline-none transition focus:border-mission-300/50"
          onChange={(event) => setManualCallbackUrl(event.target.value)}
          placeholder="http://localhost:1455/auth/callback?code=...&state=... ou code#state ou code cru"
          value={manualCallbackUrl}
        />
        <button
          className="rounded-full border border-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-mission-300/30 hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={manualCompleteMutation.isPending || !manualCallbackUrl.trim()}
          onClick={() => manualCompleteMutation.mutate()}
          type="button"
        >
          {manualCompleteMutation.isPending ? "Concluindo..." : "Concluir callback manual"}
        </button>
      </div>

      {oauthError ? (
        <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm leading-6 text-rose-100">
          {oauthError}
        </div>
      ) : null}
    </SurfaceCard>
  );
}
