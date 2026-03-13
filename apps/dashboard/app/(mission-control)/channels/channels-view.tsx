"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import type {
  ChannelConnectionDetails,
  ChannelEventType,
  ChannelListResponse,
  ChannelLogListResponse
} from "@vexus/shared";
import { StatusPill, SurfaceCard } from "@vexus/ui";

import { EmptyState } from "../../../components/empty-state";
import { PageHeader } from "../../../components/page-header";
import { TableShell } from "../../../components/table-shell";
import { ApiClientError, apiPost, apiRequest } from "../../../lib/api";
import { queryKeys } from "../../../lib/query-keys";

const eventTypeOptions: Array<{ label: string; value?: ChannelEventType }> = [
  { label: "All" },
  { label: "Connected", value: "connected" },
  { label: "Disconnected", value: "disconnected" },
  { label: "QR", value: "qr_required" },
  { label: "Reconnect", value: "reconnecting" },
  { label: "Inbound", value: "inbound_message" },
  { label: "Outbound", value: "outbound_message" },
  { label: "Error", value: "error" }
];

function toneForStatus(status: string): "ok" | "degraded" | "down" {
  if (status === "connected") {
    return "ok";
  }

  if (status === "error" || status === "disconnected") {
    return "down";
  }

  return "degraded";
}

export function ChannelsView() {
  const queryClient = useQueryClient();
  const [logPage, setLogPage] = useState(1);
  const [logType, setLogType] = useState<ChannelEventType | undefined>();

  const channelsQuery = useQuery({
    queryFn: () => apiRequest<ChannelListResponse>("/channels"),
    queryKey: queryKeys.channels,
    refetchInterval: 10_000
  });

  const channels = channelsQuery.data?.items ?? [];
  const whatsapp = channels.find((channel) => channel.type === "whatsapp");
  const webchat = channels.find((channel) => channel.type === "webchat");

  const logFilters = useMemo(
    () => ({
      channelConnectionId: whatsapp?.id,
      page: logPage,
      pageSize: 10,
      type: logType
    }),
    [logPage, logType, whatsapp?.id]
  );

  const logsQuery = useQuery({
    enabled: Boolean(whatsapp?.id),
    queryFn: () => {
      const params = new URLSearchParams();

      if (logFilters.type) {
        params.set("type", logFilters.type);
      }

      params.set("page", logFilters.page.toString());
      params.set("pageSize", logFilters.pageSize.toString());

      return apiRequest<ChannelLogListResponse>(`/channels/${whatsapp?.id}/logs?${params.toString()}`);
    },
    queryKey: queryKeys.channelLogs(logFilters),
    refetchInterval: 10_000
  });

  const refreshChannels = async () => {
    await queryClient.invalidateQueries({
      queryKey: queryKeys.channels
    });
    await queryClient.invalidateQueries({
      queryKey: queryKeys.channelLogs(logFilters)
    });
    await queryClient.invalidateQueries({
      queryKey: queryKeys.logs({})
    });
    await queryClient.invalidateQueries({
      queryKey: queryKeys.overview
    });
    await queryClient.invalidateQueries({
      queryKey: queryKeys.settings
    });
  };

  const connectMutation = useMutation({
    mutationFn: () => apiPost<ChannelConnectionDetails>("/channels/whatsapp"),
    onSuccess: async () => {
      toast.success("WhatsApp lifecycle started. QR generated.");
      await refreshChannels();
    },
    onError: (error) => {
      toast.error(error instanceof ApiClientError ? error.message : "Failed to start WhatsApp.");
    }
  });

  const reconnectMutation = useMutation({
    mutationFn: (channelId: string) => apiPost<ChannelConnectionDetails>(`/channels/${channelId}/reconnect`),
    onSuccess: async () => {
      toast.success("WhatsApp reconnect flow triggered.");
      await refreshChannels();
    },
    onError: (error) => {
      toast.error(error instanceof ApiClientError ? error.message : "Reconnect failed.");
    }
  });

  const resetMutation = useMutation({
    mutationFn: (channelId: string) => apiPost<ChannelConnectionDetails>(`/channels/${channelId}/reset`),
    onSuccess: async () => {
      toast.success("WhatsApp reset completed.");
      await refreshChannels();
    },
    onError: (error) => {
      toast.error(error instanceof ApiClientError ? error.message : "Reset failed.");
    }
  });

  const qrMutation = useMutation({
    mutationFn: (channelId: string) =>
      apiRequest<{
        id: string;
        qrCodeData: string | null;
        qrExpiresAt: string | null;
        status: string;
      }>(`/channels/${channelId}/qr`),
    onSuccess: async () => {
      toast.success("QR lifecycle refreshed.");
      await refreshChannels();
    },
    onError: (error) => {
      toast.error(error instanceof ApiClientError ? error.message : "QR refresh failed.");
    }
  });

  const busy =
    connectMutation.isPending ||
    reconnectMutation.isPending ||
    resetMutation.isPending ||
    qrMutation.isPending;

  return (
    <div className="space-y-8">
      <PageHeader
        actions={
          whatsapp ? (
            <div className="flex flex-wrap gap-3">
              <button
                className="rounded-full bg-mission-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-mission-300 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={busy}
                onClick={() => reconnectMutation.mutate(whatsapp.id)}
                type="button"
              >
                {reconnectMutation.isPending ? "Reconectando..." : "Reconectar"}
              </button>
              <button
                className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-rose-300/30 hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-60"
                disabled={busy}
                onClick={() => resetMutation.mutate(whatsapp.id)}
                type="button"
              >
                {resetMutation.isPending ? "Resetando..." : "Resetar sessao"}
              </button>
            </div>
          ) : (
            <button
              className="rounded-full bg-mission-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-mission-300 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={connectMutation.isPending}
              onClick={() => connectMutation.mutate()}
              type="button"
            >
              {connectMutation.isPending ? "Provisionando..." : "Conectar WhatsApp"}
            </button>
          )
        }
        eyebrow="Channels"
        title="WhatsApp command surface"
        description="Operate the primary WhatsApp connector, inspect runtime events and control reconnect or reset actions from one operational surface."
      />

      {!whatsapp && !channelsQuery.isLoading ? (
        <EmptyState
          actionLabel="Conectar WhatsApp"
          description="No primary WhatsApp channel exists yet. Provision the first connector to unlock QR lifecycle management."
          title="WhatsApp not provisioned"
        />
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <SurfaceCard className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Primary channel</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">WhatsApp</h2>
            </div>
            {whatsapp ? <StatusPill tone={toneForStatus(whatsapp.status)}>{whatsapp.status}</StatusPill> : null}
          </div>

          {whatsapp ? (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  ["Status", whatsapp.status.replace("_", " ")],
                  ["Last connected", whatsapp.lastConnectedAt ?? "No successful pairing yet"],
                  ["Last activity", whatsapp.lastActivityAt ?? "No traffic yet"],
                  ["Last error", whatsapp.lastError ?? "No errors recorded"],
                  ["Updated", whatsapp.updatedAt],
                  ["Session state", whatsapp.sessionState ? JSON.stringify(whatsapp.sessionState) : "Not established"]
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{label}</p>
                    <p className="mt-3 text-sm leading-6 text-white">{value}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-mission-300/30 hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={busy}
                  onClick={() => reconnectMutation.mutate(whatsapp.id)}
                  type="button"
                >
                  Reconnect
                </button>
                <button
                  className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-mission-300/30 hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={busy}
                  onClick={() => qrMutation.mutate(whatsapp.id)}
                  type="button"
                >
                  {qrMutation.isPending ? "Atualizando QR..." : "Refresh QR"}
                </button>
                <button
                  className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-rose-300/30 hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={busy}
                  onClick={() => resetMutation.mutate(whatsapp.id)}
                  type="button"
                >
                  Reset
                </button>
              </div>
            </>
          ) : (
            <p className="text-sm leading-6 text-slate-300">
              The first connection action will create the WhatsApp channel record and generate a QR-required state.
            </p>
          )}
        </SurfaceCard>

        <SurfaceCard className="space-y-4">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">QR lifecycle</p>
          {whatsapp?.qrCodeData ? (
            <div className="space-y-4">
              <Image
                alt="WhatsApp QR"
                className="mx-auto aspect-square w-full max-w-xs rounded-3xl border border-white/10 bg-white p-4"
                height={320}
                src={whatsapp.qrCodeData}
                unoptimized
                width={320}
              />
              <p className="text-center text-sm text-slate-300">
                QR expires at {whatsapp.qrExpiresAt ?? "unknown"}.
              </p>
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center text-sm leading-6 text-slate-300">
              No QR is active yet. Start the connection or reconnect the channel to generate one.
            </div>
          )}
        </SurfaceCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SurfaceCard className="space-y-4">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Secondary surface</p>
          <h2 className="text-2xl font-semibold text-white">WebChat</h2>
          <p className="text-sm leading-6 text-slate-300">
            WebChat remains available as an experimental structural channel while WhatsApp leads the first production rollout.
          </p>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Status</p>
            <p className="mt-3 text-sm font-medium text-white">
              {webchat ? webchat.status.replace("_", " ") : "Not provisioned"}
            </p>
          </div>
        </SurfaceCard>

        <TableShell
          columns={["Connection", "Type", "Status", "Updated"]}
          description="Persisted channel posture from the gateway database."
          title="Channel inventory"
        >
          {channels.map((channel) => (
            <tr key={channel.id} className="text-sm text-slate-200">
              <td className="px-6 py-4 font-medium text-white">{channel.name}</td>
              <td className="px-6 py-4 uppercase tracking-[0.24em] text-slate-300">{channel.type}</td>
              <td className="px-6 py-4">{channel.status}</td>
              <td className="px-6 py-4 text-slate-300">{channel.updatedAt}</td>
            </tr>
          ))}
        </TableShell>
      </div>

      <SurfaceCard className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Runtime events</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">WhatsApp operational logs</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {eventTypeOptions.map((option) => {
              const active = logType === option.value || (!logType && !option.value);

              return (
                <button
                  key={option.label}
                  className={`rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] transition ${
                    active
                      ? "border-mission-300/30 bg-mission-300/10 text-white"
                      : "border-white/10 text-slate-300 hover:border-mission-300/20 hover:bg-white/[0.04]"
                  }`}
                  onClick={() => {
                    setLogPage(1);
                    setLogType(option.value);
                  }}
                  type="button"
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <TableShell
          columns={["Event", "Message", "Payload", "Timestamp"]}
          description="Filtered event stream generated by the live WhatsApp runtime."
          title="WhatsApp runtime events"
        >
          {logsQuery.isLoading ? (
            <tr>
              <td className="px-6 py-8 text-sm text-slate-400" colSpan={4}>
                Loading runtime events...
              </td>
            </tr>
          ) : null}
          {logsQuery.isError ? (
            <tr>
              <td className="px-6 py-8 text-sm text-rose-200" colSpan={4}>
                {(logsQuery.error as Error).message || "Failed to load channel logs."}
              </td>
            </tr>
          ) : null}
          {(logsQuery.data?.items ?? whatsapp?.recentLogs ?? []).map((log) => (
            <tr key={log.id} className="align-top text-sm text-slate-200">
              <td className="px-6 py-4 uppercase tracking-[0.2em] text-slate-300">{log.type}</td>
              <td className="px-6 py-4">{log.message}</td>
              <td className="px-6 py-4 text-xs leading-6 text-slate-400">
                {log.payload ? JSON.stringify(log.payload) : "No payload"}
              </td>
              <td className="px-6 py-4 text-slate-300">{log.createdAt}</td>
            </tr>
          ))}
        </TableShell>

        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-400">
            Showing page {logsQuery.data?.page ?? 1} of {logsQuery.data?.totalPages ?? 1}
          </p>
          <div className="flex gap-3">
            <button
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-white transition hover:border-mission-300/30 hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={logPage <= 1}
              onClick={() => setLogPage((current) => Math.max(current - 1, 1))}
              type="button"
            >
              Previous
            </button>
            <button
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-white transition hover:border-mission-300/30 hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={!logsQuery.data?.hasNextPage}
              onClick={() => setLogPage((current) => current + 1)}
              type="button"
            >
              Next
            </button>
          </div>
        </div>
      </SurfaceCard>
    </div>
  );
}
