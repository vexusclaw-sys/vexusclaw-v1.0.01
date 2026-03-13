import { SurfaceCard } from "@vexus/ui";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
}

export function EmptyState({ title, description, actionLabel }: EmptyStateProps) {
  return (
    <SurfaceCard className="flex min-h-64 flex-col items-start justify-between gap-6">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.24em] text-mission-300/75">Ready for expansion</p>
        <h2 className="text-2xl font-semibold text-white">{title}</h2>
        <p className="max-w-xl text-sm leading-6 text-slate-300">{description}</p>
      </div>
      {actionLabel ? (
        <button className="rounded-full border border-mission-300/30 bg-mission-400/10 px-5 py-2 text-sm font-medium text-mission-100 transition hover:border-mission-200/50 hover:bg-mission-400/20">
          {actionLabel}
        </button>
      ) : null}
    </SurfaceCard>
  );
}
