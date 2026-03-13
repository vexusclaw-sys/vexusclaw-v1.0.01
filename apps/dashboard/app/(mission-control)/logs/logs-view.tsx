"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import type { ChannelEventType, ChannelLogListResponse, ChannelListResponse } from "@vexus/shared";
import { SurfaceCard } from "@vexus/ui";

import { EmptyState } from "../../../components/empty-state";
import { PageHeader } from "../../../components/page-header";
import { TableShell } from "../../../components/table-shell";
import { apiRequest } from "../../../lib/api";
import { queryKeys } from "../../../lib/query-keys";

const typeOptions: Array<{ label: string; value?: ChannelEventType }> = [
  { label: "All" },
  { label: "Connected", value: "connected" },
  { label: "Disconnected", value: "disconnected" },
  { label: "QR Required", value: "qr_required" },
  { label: "Reconnecting", value: "reconnecting" },
  { label: "Inbound", value: "inbound_message" },
  { label: "Outbound", value: "outbound_message" },
  { label: "Error", value: "error" }
];

export function LogsView() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [channelConnectionId, setChannelConnectionId] = useState<string | undefined>();
  const [type, setType] = useState<ChannelEventType | undefined>();

  const channelsQuery = useQuery({
    queryFn: () => apiRequest<ChannelListResponse>("/channels"),
    queryKey: queryKeys.channels,
    refetchInterval: 10_000
  });

  const filters = useMemo(
    () => ({
      channelConnectionId,
      page,
      pageSize: 20,
      query: query || undefined,
      type
    }),
    [channelConnectionId, page, query, type]
  );

  const logsQuery = useQuery({
    queryFn: () => {
      const params = new URLSearchParams();

      if (filters.channelConnectionId) {
        params.set("channelConnectionId", filters.channelConnectionId);
      }

      if (filters.query) {
        params.set("query", filters.query);
      }

      if (filters.type) {
        params.set("type", filters.type);
      }

      params.set("page", filters.page.toString());
      params.set("pageSize", filters.pageSize.toString());

      return apiRequest<ChannelLogListResponse>(`/logs/channels?${params.toString()}`);
    },
    queryKey: queryKeys.logs(filters),
    refetchInterval: 10_000
  });

  const logs = logsQuery.data?.items ?? [];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Logs"
        title="Operational log stream"
        description="Inspect real WhatsApp connection events, filter by signal type and audit reconnects, QR lifecycle and inbound or outbound traffic."
      />

      <SurfaceCard className="space-y-4">
        <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr_1.2fr]">
          <select
            className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-mission-300/50"
            onChange={(event) => {
              setChannelConnectionId(event.target.value || undefined);
              setPage(1);
            }}
            value={channelConnectionId ?? ""}
          >
            <option value="">All channels</option>
            {(channelsQuery.data?.items ?? []).map((channel) => (
              <option key={channel.id} value={channel.id}>
                {channel.name}
              </option>
            ))}
          </select>

          <input
            className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-mission-300/50"
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Search event message..."
            value={query}
          />

          <div className="flex flex-wrap gap-2">
            {typeOptions.map((option) => {
              const active = type === option.value || (!type && !option.value);

              return (
                <button
                  key={option.label}
                  className={`rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] transition ${
                    active
                      ? "border-mission-300/30 bg-mission-300/10 text-white"
                      : "border-white/10 text-slate-300 hover:border-mission-300/20 hover:bg-white/[0.04]"
                  }`}
                  onClick={() => {
                    setType(option.value);
                    setPage(1);
                  }}
                  type="button"
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </SurfaceCard>

      {logs.length === 0 && !logsQuery.isLoading ? (
        <EmptyState
          description="No operational events matched the current filters."
          title="No logs found"
        />
      ) : null}

      <TableShell
        columns={["Time", "Channel", "Type", "Message", "Payload"]}
        description="Persisted channel event logs from the gateway."
        title="Channel event logs"
      >
        {logsQuery.isLoading ? (
          <tr>
            <td className="px-6 py-8 text-sm text-slate-400" colSpan={5}>
              Loading operational logs...
            </td>
          </tr>
        ) : null}
        {logsQuery.isError ? (
          <tr>
            <td className="px-6 py-8 text-sm text-rose-200" colSpan={5}>
              {(logsQuery.error as Error).message || "Failed to load logs."}
            </td>
          </tr>
        ) : null}
        {logs.map((log) => (
          <tr key={log.id} className="align-top text-sm text-slate-200">
            <td className="px-6 py-4 text-slate-300">{log.createdAt}</td>
            <td className="px-6 py-4">
              <p className="font-medium text-white">{log.channelName ?? "Unknown channel"}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">
                {log.channelType ?? "unknown"}
              </p>
            </td>
            <td className="px-6 py-4 uppercase tracking-[0.2em] text-slate-300">{log.type}</td>
            <td className="px-6 py-4">{log.message}</td>
            <td className="px-6 py-4 text-xs leading-6 text-slate-400">
              {log.payload ? JSON.stringify(log.payload) : "No payload"}
            </td>
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
            disabled={page <= 1}
            onClick={() => setPage((current) => Math.max(current - 1, 1))}
            type="button"
          >
            Previous
          </button>
          <button
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-white transition hover:border-mission-300/30 hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!logsQuery.data?.hasNextPage}
            onClick={() => setPage((current) => current + 1)}
            type="button"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
