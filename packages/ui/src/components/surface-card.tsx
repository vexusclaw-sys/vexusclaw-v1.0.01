import type { HTMLAttributes } from "react";

import { cn } from "@vexus/shared";

export function SurfaceCard({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-[0_24px_80px_-28px_rgba(0,0,0,0.75)] backdrop-blur-xl",
        className
      )}
      {...props}
    />
  );
}
