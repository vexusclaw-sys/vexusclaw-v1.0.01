import { SurfaceCard } from "@vexus/ui";

import { PageHeader } from "../../../components/page-header";

export default function AutomationsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Automations"
        title="Queue and job control"
        description="BullMQ-backed automation workloads, retries and failure posture will be surfaced here with operator-first visibility."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {[
          ["Queued jobs", "18"],
          ["Running workers", "4"],
          ["Failed executions", "2"]
        ].map(([label, value]) => (
          <SurfaceCard key={label}>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{label}</p>
            <p className="mt-4 text-3xl font-semibold text-white">{value}</p>
          </SurfaceCard>
        ))}
      </div>

      <SurfaceCard className="space-y-4">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Recent incidents</p>
        <div className="space-y-3">
          {[
            "Retry scheduled for sync queue after transient provider timeout.",
            "Paused campaign enrichment job due to missing provider credentials.",
            "Backfill worker completed file metadata normalization."
          ].map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-200">
              {item}
            </div>
          ))}
        </div>
      </SurfaceCard>
    </div>
  );
}
