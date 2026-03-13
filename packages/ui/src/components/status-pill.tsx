import type { HTMLAttributes } from "react";

import { cn } from "@vexus/shared";

const toneMap = {
  ok: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  degraded: "border-amber-400/30 bg-amber-400/10 text-amber-200",
  down: "border-rose-400/30 bg-rose-400/10 text-rose-200"
} as const;

export interface StatusPillProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: keyof typeof toneMap;
}

export function StatusPill({ className, tone = "ok", ...props }: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.24em]",
        toneMap[tone],
        className
      )}
      {...props}
    />
  );
}
