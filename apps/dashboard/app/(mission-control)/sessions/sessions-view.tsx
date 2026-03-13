"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

import type { SessionDetailsResponse, SessionListResponse, SessionStatus } from "@vexus/shared";
import { SurfaceCard } from "@vexus/ui";

import { EmptyState } from "../../../components/empty-state";
import { PageHeader } from "../../../components/page-header";
import { TableShell } from "../../../components/table-shell";
import { apiRequest } from "../../../lib/api";
import { queryKeys } from "../../../lib/query-keys";

const statusOptions: Array<{ label: string; value?: SessionStatus }> = [
  { label: "All" },
  { label: "Open", value: "open" },
  { label: "Idle", value: "idle" },
  { label: "Handover", value: "handover_pending" },
  { label: "Closed", value: "closed" }
];

function roleTone(role: string): string {
  if (role === "assistant") {
    return "border-mission-300/20 bg-mission-300/8";
  }

  if (role === "system" || role === "tool") {
    return "border-amber-400/20 bg-amber-400/8";
  }

  return "border-white/10 bg-white/[0.03]";
}

export function SessionsView() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<SessionStatus | undefined>();
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  const filters = useMemo(
    () => ({
      page,
      pageSize: 20,
      query: query || undefined,
      status: statusFilter
    }),
    [page, query, statusFilter]
  );

  const sessionsQuery = useQuery({
    queryFn: () => {
      const params = new URLSearchParams();

      if (filters.query) {
        params.set("query", filters.query);
      }

      if (filters.status) {
        params.set("status", filters.status);
      }

      params.set("page", filters.page.toString());
      params.set("pageSize", filters.pageSize.toString());

      return apiRequest<SessionListResponse>(`/sessions?${params.toString()}`);
    },
    queryKey: queryKeys.sessions(filters),
    refetchInterval: 10_000
  });

  const selectedSessionQuery = useQuery({
    enabled: Boolean(selectedSessionId),
    queryFn: () => apiRequest<SessionDetailsResponse>(`/sessions/${selectedSessionId}`),
    queryKey: queryKeys.sessionDetail(selectedSessionId),
    refetchInterval: 10_000
  });

  useEffect(() => {
    if (!sessionsQuery.data?.items.length) {
      setSelectedSessionId(null);
      return;
    }

    if (!selectedSessionId || !sessionsQuery.data.items.some((session) => session.id === selectedSessionId)) {
      setSelectedSessionId(sessionsQuery.data.items[0]?.id ?? null);
    }
  }, [selectedSessionId, sessionsQuery.data]);

  const sessions = sessionsQuery.data?.items ?? [];
  const selectedSession = selectedSessionQuery.data;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Sessions"
        title="Conversation timeline"
        description="Inspect persisted WhatsApp sessions, search by number and open the transcript with channel and delivery context."
      />

      <SurfaceCard className="space-y-4">
        <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
          <div className="flex flex-wrap gap-3">
            {statusOptions.map((option) => {
              const active = statusFilter === option.value || (!statusFilter && !option.value);

              return (
                <button
                  key={option.label}
                  className={`rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] transition ${
                    active
                      ? "border-mission-300/30 bg-mission-300/10 text-white"
                      : "border-white/10 text-slate-300 hover:border-mission-300/20 hover:bg-white/[0.04]"
                  }`}
                  onClick={() => {
                    setPage(1);
                    setStatusFilter(option.value);
                  }}
                  type="button"
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          <input
            className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-mission-300/50"
            onChange={(event) => {
              setPage(1);
              setQuery(event.target.value);
            }}
            placeholder="Search by number, conversation id or visitor name"
            value={query}
          />
        </div>
      </SurfaceCard>

      {sessions.length === 0 && !sessionsQuery.isLoading ? (
        <EmptyState
          description="No real sessions matched the current filters. Once WhatsApp traffic arrives, it will appear here with its transcript."
          title="No sessions available"
        />
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <TableShell
          columns={["Session", "Channel", "Agent", "Status", "Messages", "Last activity"]}
          description="Persisted sessions from the gateway, with searchable visitor identifiers and operational context."
          title="Live sessions"
        >
          {sessionsQuery.isLoading ? (
            <tr>
              <td className="px-6 py-8 text-sm text-slate-400" colSpan={6}>
                Loading real sessions from the gateway...
              </td>
            </tr>
          ) : null}
          {sessionsQuery.isError ? (
            <tr>
              <td className="px-6 py-8 text-sm text-rose-200" colSpan={6}>
                {(sessionsQuery.error as Error).message || "Failed to load sessions."}
              </td>
            </tr>
          ) : null}
          {sessions.map((session) => {
            const selected = selectedSessionId === session.id;

            return (
              <tr
                key={session.id}
                className={`cursor-pointer text-sm text-slate-200 transition ${
                  selected ? "bg-white/[0.04]" : "hover:bg-white/[0.02]"
                }`}
                onClick={() => setSelectedSessionId(session.id)}
              >
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <p className="font-medium text-white">{session.visitorName ?? session.externalUserId}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      {session.externalUserId}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p>{session.channelName}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">
                      {session.channelType} / {session.channelStatus}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">{session.agentName}</td>
                <td className="px-6 py-4 uppercase tracking-[0.2em] text-slate-300">{session.status}</td>
                <td className="px-6 py-4">{session.messageCount}</td>
                <td className="px-6 py-4 text-slate-300">{session.lastMessageAt}</td>
              </tr>
            );
          })}
        </TableShell>

        <SurfaceCard className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Transcript</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                {selectedSession?.visitorName ?? selectedSession?.externalUserId ?? "Select a session"}
              </h2>
            </div>
            {selectedSession ? (
              <div className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-300">
                {selectedSession.status}
              </div>
            ) : null}
          </div>

          {selectedSessionQuery.isLoading ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-sm leading-6 text-slate-300">
              Loading transcript from the gateway...
            </div>
          ) : selectedSessionQuery.isError ? (
            <div className="rounded-3xl border border-rose-400/20 bg-rose-400/10 p-8 text-sm leading-6 text-rose-100">
              {(selectedSessionQuery.error as Error).message || "Failed to load the transcript."}
            </div>
          ) : selectedSession ? (
            <>
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  ["Channel", `${selectedSession.channelName} / ${selectedSession.channelStatus}`],
                  ["Agent", selectedSession.agentName],
                  ["Started", selectedSession.startedAt],
                  ["Last activity", selectedSession.channelLastActivityAt ?? selectedSession.lastMessageAt],
                  ["Messages", selectedSession.messageCount.toString()],
                  ["Channel error", selectedSession.channelLastError ?? "No channel errors"]
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{label}</p>
                    <p className="mt-3 text-sm font-medium text-white">{value}</p>
                  </div>
                ))}
              </div>

              <div className="max-h-[40rem] space-y-3 overflow-y-auto pr-1">
                {selectedSession.messages.map((message) => (
                  <div key={message.id} className={`rounded-2xl border p-4 ${roleTone(message.role)}`}>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{message.role}</p>
                      <p className="text-xs text-slate-500">{message.createdAt}</p>
                    </div>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-100">
                      {message.content}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-400">
                      <span>External id: {message.externalMessageId ?? "not assigned"}</span>
                      <span>Tokens in: {message.tokenInput ?? 0}</span>
                      <span>Tokens out: {message.tokenOutput ?? 0}</span>
                      <span>Cost: {message.estimatedCostUsd ?? "-"}</span>
                    </div>
                    {message.payload ? (
                      <pre className="mt-3 overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/50 p-3 text-xs text-slate-300">
                        {JSON.stringify(message.payload, null, 2)}
                      </pre>
                    ) : null}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-sm leading-6 text-slate-300">
              Pick a session from the left panel to open the transcript.
            </div>
          )}
        </SurfaceCard>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">
          Showing page {sessionsQuery.data?.page ?? 1} of {sessionsQuery.data?.totalPages ?? 1}
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
            disabled={!sessionsQuery.data?.hasNextPage}
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
