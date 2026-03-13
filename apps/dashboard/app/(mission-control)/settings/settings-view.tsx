"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import type { ChannelListResponse, WorkspaceSettingsResponse } from "@vexus/shared";
import { SurfaceCard } from "@vexus/ui";

import { ApiClientError, apiPatch, apiPost, apiRequest } from "../../../lib/api";
import { queryKeys } from "../../../lib/query-keys";
import { ChatGptOAuthPanel } from "../../../components/chatgpt-oauth-panel";
import { ChatGptSessionImportPanel } from "../../../components/chatgpt-session-import-panel";
import { CopyButton } from "../../../components/copy-button";
import { PageHeader } from "../../../components/page-header";

export function SettingsView() {
  const queryClient = useQueryClient();
  const settingsQuery = useQuery({
    queryFn: () => apiRequest<WorkspaceSettingsResponse>("/settings"),
    queryKey: queryKeys.settings
  });
  const channelsQuery = useQuery({
    queryFn: () => apiRequest<ChannelListResponse>("/channels"),
    queryKey: queryKeys.channels,
    refetchInterval: 10_000
  });

  const [workspaceName, setWorkspaceName] = useState("");
  useEffect(() => {
    if (!settingsQuery.data) {
      return;
    }

    setWorkspaceName(settingsQuery.data.workspace.name);
  }, [settingsQuery.data]);

  const updateMutation = useMutation({
    mutationFn: () =>
      apiPatch<WorkspaceSettingsResponse>("/settings", {
        workspaceName
      }),
    onSuccess: async (settings) => {
      await queryClient.setQueryData(queryKeys.settings, settings);
      await queryClient.invalidateQueries({
        queryKey: queryKeys.overview
      });
      toast.success("Workspace settings updated.");
    },
    onError: (error) => {
      toast.error(error instanceof ApiClientError ? error.message : "Could not update settings.");
    }
  });

  const reconnectMutation = useMutation({
    mutationFn: (channelId: string) => apiPost(`/channels/${channelId}/reconnect`),
    onSuccess: async () => {
      toast.success("WhatsApp reconnect triggered.");
      await queryClient.invalidateQueries({
        queryKey: queryKeys.channels
      });
    },
    onError: (error) => {
      toast.error(error instanceof ApiClientError ? error.message : "Could not reconnect WhatsApp.");
    }
  });

  const resetMutation = useMutation({
    mutationFn: (channelId: string) => apiPost(`/channels/${channelId}/reset`),
    onSuccess: async () => {
      toast.success("WhatsApp reset completed.");
      await queryClient.invalidateQueries({
        queryKey: queryKeys.channels
      });
    },
    onError: (error) => {
      toast.error(error instanceof ApiClientError ? error.message : "Could not reset WhatsApp.");
    }
  });

  const settings = settingsQuery.data;
  const whatsapp = channelsQuery.data?.items.find((channel) => channel.type === "whatsapp");

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Settings"
        title="Workspace configuration"
        description="Review workspace identity, onboarding posture and provider bindings directly from the persisted backend state."
        actions={
          settings?.workspace.publicUrl ? <CopyButton value={settings.workspace.publicUrl} /> : null
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <SurfaceCard className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Workspace identity</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Mission Control configuration</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <input
              className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-mission-300/50"
              onChange={(event) => setWorkspaceName(event.target.value)}
              placeholder="Workspace name"
              value={workspaceName}
            />
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Public instance URL</p>
              <p className="mt-2 break-all text-sm font-medium text-white">
                {settings?.workspace.publicUrl ?? "Subdominio automatico ainda nao provisionado"}
              </p>
            </div>
          </div>
          <button
            className="rounded-full bg-mission-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-mission-300 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={updateMutation.isPending || !workspaceName}
            onClick={() => updateMutation.mutate()}
            type="button"
          >
            {updateMutation.isPending ? "Salvando..." : "Salvar ajustes"}
          </button>
        </SurfaceCard>

        <SurfaceCard className="space-y-4">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Operational posture</p>
          {settings ? (
            <div className="space-y-4">
              {[
                ["Workspace slug", settings.workspace.slug],
                ["Domain", settings.workspace.domain ?? "Not configured"],
                ["Public URL", settings.workspace.publicUrl ?? "Not configured"],
                ["Base domain", settings.workspace.baseDomain ?? "Not configured"],
                ["Onboarding", settings.workspace.onboardingStatus],
                ["Setup ready", settings.setup.isReady ? "Yes" : "No"],
                ["Primary channel", settings.setup.primaryChannel],
                ["Provider configured", settings.setup.providerConfigured ? "Yes" : "No"]
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{label}</p>
                  <p className="mt-3 text-sm font-medium text-white">{value}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-300">Loading workspace state...</p>
          )}
        </SurfaceCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {(settings?.providers ?? []).map((provider) => (
          <SurfaceCard key={provider.id}>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{provider.provider}</p>
            <p className="mt-3 text-lg font-semibold text-white">{provider.label}</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Status: {provider.status}. Mode: {provider.mode}. Secret hint: {provider.secretHint ?? "not exposed"}.
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Conta: {provider.accountEmail ?? provider.accountId ?? "nao informada"}.
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Expira em: {provider.tokenExpiresAt ?? "nao informado"}.
            </p>
          </SurfaceCard>
        ))}

        <SurfaceCard className="space-y-4">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">WhatsApp operations</p>
          {whatsapp ? (
            <>
              <div className="space-y-3">
                {[
                  ["Status", whatsapp.status],
                  ["Last connected", whatsapp.lastConnectedAt ?? "No successful pairing yet"],
                  ["Last activity", whatsapp.lastActivityAt ?? "No recent activity"],
                  ["Last error", whatsapp.lastError ?? "No errors recorded"]
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{label}</p>
                    <p className="mt-3 text-sm font-medium text-white">{value}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  className="rounded-full bg-mission-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-mission-300 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={reconnectMutation.isPending || resetMutation.isPending}
                  onClick={() => reconnectMutation.mutate(whatsapp.id)}
                  type="button"
                >
                  {reconnectMutation.isPending ? "Reconectando..." : "Reconectar"}
                </button>
                <button
                  className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-rose-300/30 hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={reconnectMutation.isPending || resetMutation.isPending}
                  onClick={() => resetMutation.mutate(whatsapp.id)}
                  type="button"
                >
                  {resetMutation.isPending ? "Resetando..." : "Resetar sessao"}
                </button>
              </div>
            </>
          ) : (
            <p className="text-sm leading-6 text-slate-300">
              The primary WhatsApp connector has not been provisioned yet.
            </p>
          )}
        </SurfaceCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChatGptSessionImportPanel suggestedLabel="Workspace Imported ChatGPT Session" />
        <ChatGptOAuthPanel returnToPath="/settings" suggestedLabel="Workspace ChatGPT OAuth" />
      </div>
    </div>
  );
}
