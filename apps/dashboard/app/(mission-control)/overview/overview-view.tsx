"use client";

import { useQuery } from "@tanstack/react-query";

import type { MissionControlOverview } from "@vexus/shared";
import { SurfaceCard } from "@vexus/ui";

import { apiRequest } from "../../../lib/api";
import { queryKeys } from "../../../lib/query-keys";
import { EmptyState } from "../../../components/empty-state";
import { PageHeader } from "../../../components/page-header";
import { CopyButton } from "../../../components/copy-button";
import { StatusCard } from "../../../components/status-card";
import { TableShell } from "../../../components/table-shell";

function statusTone(status: string): "ok" | "degraded" | "down" {
  if (status === "down" || status === "error") {
    return "down";
  }

  if (status === "degraded" || status === "qr_required" || status === "connecting") {
    return "degraded";
  }

  return "ok";
}

export function OverviewView() {
  const overviewQuery = useQuery({
    queryFn: () => apiRequest<MissionControlOverview>("/overview"),
    queryKey: queryKeys.overview
  });

  if (overviewQuery.isLoading) {
    return (
      <div className="space-y-8">
        <PageHeader
          description="Loading live platform status from the gateway."
          eyebrow="Overview"
          title="VEXUSCLAW Mission Control"
        />
        <div className="grid gap-4 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <StatusCard
              key={index}
              delta="Loading"
              description="Querying live workspace telemetry."
              label="Loading"
              tone="degraded"
              value="..."
            />
          ))}
        </div>
      </div>
    );
  }

  if (!overviewQuery.data) {
    return (
      <EmptyState
        actionLabel="Recarregar"
        description="Mission Control could not load the current workspace overview."
        title="Overview unavailable"
      />
    );
  }

  const overview = overviewQuery.data;
  const alerts = [
    overview.systemStatus !== "ok" ? "Infrastructure health is not fully green." : null,
    !overview.provider.connected ? "No primary provider is connected yet." : null,
    !overview.onboarding.isReady ? "Workspace onboarding is still incomplete." : null,
    overview.whatsapp.status !== "connected" ? "WhatsApp is not fully connected yet." : null
  ].filter(Boolean) as string[];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Overview"
        title="VEXUSCLAW Mission Control"
        description="Track infrastructure health, provider readiness, onboarding posture and the WhatsApp-first channel lifecycle from one operational surface."
        actions={
          overview.instance.publicUrl ? <CopyButton value={overview.instance.publicUrl} /> : null
        }
      />

      <div className="grid gap-4 xl:grid-cols-4">
        <StatusCard
          delta={overview.systemStatus.toUpperCase()}
          description="Aggregated readiness across gateway, Postgres and Redis."
          label="System"
          tone={statusTone(overview.systemStatus)}
          value={overview.systemStatus.toUpperCase()}
        />
        <StatusCard
          delta={overview.whatsapp.status.toUpperCase()}
          description="Primary WhatsApp channel state, QR requirement and last activity."
          label="WhatsApp"
          tone={statusTone(overview.whatsapp.status)}
          value={overview.whatsapp.status.replace("_", " ").toUpperCase()}
        />
        <StatusCard
          delta={`${overview.totals.connectedChannels}/${overview.totals.channels} live`}
          description="Agents already provisioned for Mission Control operations."
          label="Agents"
          tone="ok"
          value={overview.totals.agents.toString()}
        />
        <StatusCard
          delta={overview.provider.connected ? "Connected" : "Pending"}
          description="Primary inference runtime bound to the workspace."
          label="Provider"
          tone={overview.provider.connected ? "ok" : "degraded"}
          value={overview.provider.label ?? "Not configured"}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <TableShell
          columns={["Check", "Status", "Latency", "Details"]}
          description="Live healthchecks executed directly against the gateway runtime, Postgres and Redis."
          title="Infrastructure health"
        >
          {overview.health.checks.map((check) => (
            <tr key={check.name} className="text-sm text-slate-200">
              <td className="px-6 py-4 font-medium text-white">{check.name}</td>
              <td className="px-6 py-4 uppercase tracking-[0.24em] text-slate-300">{check.status}</td>
              <td className="px-6 py-4">{check.latencyMs ? `${check.latencyMs} ms` : "-"}</td>
              <td className="px-6 py-4 text-slate-300">
                {check.details ? JSON.stringify(check.details) : "No additional details"}
              </td>
            </tr>
          ))}
        </TableShell>

        <SurfaceCard>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Public instance</p>
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Workspace URL</p>
            <p className="mt-3 break-all text-base font-semibold text-white">
              {overview.instance.publicUrl ?? "Subdominio ainda nao provisionado"}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Base domain: {overview.instance.baseDomain ?? "not configured"}.
              {overview.instance.matchedBySubdomain
                ? " Current access is already resolved by the workspace host."
                : " Current access is still using the root host or a fallback address."}
            </p>
          </div>
        </SurfaceCard>

        <SurfaceCard>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Operational alerts</p>
          <div className="mt-5 space-y-4">
            {alerts.length ? (
              alerts.map((alert) => (
                <div key={alert} className="rounded-2xl border border-amber-400/15 bg-amber-400/5 p-4">
                  <p className="text-sm leading-6 text-amber-100">{alert}</p>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/5 p-4">
                <p className="text-sm leading-6 text-emerald-100">
                  All critical systems are aligned for live operation.
                </p>
              </div>
            )}
          </div>
        </SurfaceCard>
      </div>

      {overview.totals.sessions > 0 ? (
        <TableShell
          columns={["Metric", "Value"]}
          description="Mission Control operational counters currently backed by persisted workspace data."
          title="Workspace posture"
        >
          {[
            ["Sessions", overview.totals.sessions.toString()],
            ["Channels", overview.totals.channels.toString()],
            ["Connected channels", overview.totals.connectedChannels.toString()],
            ["Onboarding status", overview.onboarding.onboardingStatus]
          ].map(([label, value]) => (
            <tr key={label} className="text-sm text-slate-200">
              <td className="px-6 py-4 font-medium text-white">{label}</td>
              <td className="px-6 py-4">{value}</td>
            </tr>
          ))}
        </TableShell>
      ) : (
        <EmptyState
          description="No conversations are open yet. Once the first WhatsApp session starts, Mission Control will surface activity and session counters here."
          title="No active sessions yet"
        />
      )}
    </div>
  );
}
