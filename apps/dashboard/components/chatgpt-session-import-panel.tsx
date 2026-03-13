"use client";

import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { ProviderConnectionDetails } from "@vexus/shared";
import { SurfaceCard } from "@vexus/ui";

import { ApiClientError, apiPost, apiRequest } from "../lib/api";
import { queryKeys } from "../lib/query-keys";

interface ChatGptSessionImportPanelProps {
  suggestedLabel: string;
  title?: string;
}

function providerTone(provider: ProviderConnectionDetails | null): string {
  if (!provider) {
    return "Nenhuma sessao importada neste workspace.";
  }

  const emailSuffix = provider.accountEmail ? ` · ${provider.accountEmail}` : "";
  return `${provider.label}${emailSuffix} · status ${provider.status} · modo ${provider.mode}`;
}

export function ChatGptSessionImportPanel({
  suggestedLabel,
  title = "Importar sessao ChatGPT/Codex (experimental)"
}: ChatGptSessionImportPanelProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const queryClient = useQueryClient();
  const router = useRouter();
  const [manualAuthJson, setManualAuthJson] = useState("");
  const [importError, setImportError] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const providersQuery = useQuery({
    queryFn: () => apiRequest<ProviderConnectionDetails[]>("/providers"),
    queryKey: queryKeys.providers
  });
  const providers = providersQuery.data ?? [];
  const importedProvider =
    providers.find(
      (provider) =>
        provider.provider === "chatgpt_oauth" &&
        (provider.mode === "oauth_imported" || provider.authState === "imported_session")
    ) ?? null;

  const importMutation = useMutation({
    mutationFn: (authJson: string) =>
      apiPost<ProviderConnectionDetails>("/providers/chatgpt/import-session", {
        authJson,
        label: suggestedLabel,
        makePrimary: true
      }),
    onSuccess: async (provider) => {
      setImportError(null);
      setManualAuthJson("");
      setSelectedFileName(null);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.providers }),
        queryClient.invalidateQueries({ queryKey: queryKeys.settings }),
        queryClient.invalidateQueries({ queryKey: queryKeys.overview })
      ]);
      toast.success(
        provider.accountEmail
          ? `Sessao importada com sucesso: ${provider.accountEmail}.`
          : `Sessao importada com sucesso: ${provider.label}.`
      );
    },
    onError: (error) => {
      if (error instanceof ApiClientError && error.status === 401) {
        const message = "Sua sessao expirou. Entre no Mission Control novamente.";
        setImportError(message);
        toast.error(message);
        router.replace("/login");
        return;
      }

      const message =
        error instanceof ApiClientError
          ? error.message
          : "Nao foi possivel importar a sessao ChatGPT/Codex.";
      setImportError(message);
      toast.error(message);
    }
  });

  const handleManualImport = () => {
    if (!manualAuthJson.trim()) {
      setImportError("Cole o conteudo do auth.json para continuar.");
      return;
    }

    importMutation.mutate(manualAuthJson.trim());
  };

  const handleFileSelection = async (file: File | null) => {
    if (!file) {
      return;
    }

    try {
      setSelectedFileName(file.name);
      setImportError(null);
      importMutation.mutate(await file.text());
    } catch (error) {
      const message = error instanceof Error ? error.message : "Nao foi possivel ler o arquivo auth.json.";
      setImportError(message);
      toast.error(message);
    }
  };

  return (
    <SurfaceCard className="space-y-4 border border-white/10 bg-white/[0.02]">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">ChatGPT/Codex session import</p>
        <h3 className="mt-2 text-lg font-semibold text-white">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Alternativa pratica ao callback localhost. Importe um <span className="font-medium text-white">auth.json</span>{" "}
          ja autenticado do Codex/ChatGPT e salve a sessao OAuth no workspace.
        </p>
      </div>

      <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4">
        <p className="text-sm font-medium text-white">Experimental</p>
        <p className="mt-2 text-sm leading-6 text-slate-200">
          O arquivo e enviado ao backend apenas para extrair e criptografar a sessao. Nunca exibimos
          tokens de volta na UI e o modo estavel continua sendo <span className="font-medium text-white">OpenAI API key</span>.
        </p>
      </div>

      {importedProvider ? (
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
          <p className="text-sm font-medium text-white">Sessao importada conectada</p>
          <p className="mt-2 text-sm leading-6 text-slate-200">{providerTone(importedProvider)}</p>
          <p className="mt-2 text-sm leading-6 text-slate-200">
            Expira em: {importedProvider.tokenExpiresAt ?? "nao informado pelo auth.json"}
          </p>
        </div>
      ) : null}

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">
        <p className="font-medium text-white">Formato aceito</p>
        <p className="mt-2 leading-6">
          JSON completo do <span className="font-medium text-white">~/.codex/auth.json</span> com{" "}
          <span className="font-medium text-white">auth_mode</span>,{" "}
          <span className="font-medium text-white">tokens.access_token</span>,{" "}
          <span className="font-medium text-white">tokens.refresh_token</span>,{" "}
          <span className="font-medium text-white">tokens.id_token</span> e{" "}
          <span className="font-medium text-white">tokens.account_id</span> opcional.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          ref={fileInputRef}
          accept="application/json,.json"
          className="hidden"
          onChange={(event) => void handleFileSelection(event.target.files?.[0] ?? null)}
          type="file"
        />
        <button
          className="rounded-full bg-mission-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-mission-300 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={importMutation.isPending}
          onClick={() => fileInputRef.current?.click()}
          type="button"
        >
          {importMutation.isPending ? "Importando..." : "Upload auth.json"}
        </button>
        {selectedFileName ? (
          <p className="self-center text-sm text-slate-400">Arquivo selecionado: {selectedFileName}</p>
        ) : null}
      </div>

      <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <p className="text-sm font-medium text-white">Colar JSON manualmente</p>
        <textarea
          className="min-h-32 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-white outline-none transition focus:border-mission-300/50"
          onChange={(event) => setManualAuthJson(event.target.value)}
          placeholder='{"auth_mode":"chatgpt","tokens":{"access_token":"...","refresh_token":"...","id_token":"...","account_id":"..."}}'
          value={manualAuthJson}
        />
        <button
          className="rounded-full border border-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-mission-300/30 hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={importMutation.isPending || !manualAuthJson.trim()}
          onClick={handleManualImport}
          type="button"
        >
          {importMutation.isPending ? "Importando..." : "Importar JSON colado"}
        </button>
      </div>

      {importError ? (
        <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm leading-6 text-rose-100">
          {importError}
        </div>
      ) : null}
    </SurfaceCard>
  );
}
