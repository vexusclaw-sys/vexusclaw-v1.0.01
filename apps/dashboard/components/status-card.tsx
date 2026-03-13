import { SurfaceCard } from "@vexus/ui";

interface StatusCardProps {
  label: string;
  value: string;
  delta: string;
  description: string;
  tone?: "ok" | "degraded" | "down";
}

const toneStyles = {
  degraded: "border-amber-400/20 bg-amber-400/10 text-amber-200",
  down: "border-rose-400/20 bg-rose-400/10 text-rose-200",
  ok: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
} as const;

export function StatusCard({ label, value, delta, description, tone = "ok" }: StatusCardProps) {
  return (
    <SurfaceCard className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-mission-300/40 to-transparent" />
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{label}</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-white">{value}</p>
          </div>
          <span className={`rounded-full border px-3 py-1 text-xs font-medium ${toneStyles[tone]}`}>
            {delta}
          </span>
        </div>
        <p className="max-w-xs text-sm leading-6 text-slate-300">{description}</p>
      </div>
    </SurfaceCard>
  );
}
