"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@vexus/shared";

import { primaryNavigation } from "../lib/navigation";
import { useSessionStore } from "../lib/session-store";

export function Sidebar() {
  const pathname = usePathname();
  const session = useSessionStore((state) => state.session);

  return (
    <aside className="hidden w-80 shrink-0 flex-col border-r border-white/10 bg-slate-950/60 px-6 py-8 backdrop-blur xl:flex">
      <div className="space-y-2 border-b border-white/10 pb-8">
        <p className="text-xs uppercase tracking-[0.34em] text-mission-300/80">VEXUSCLAW</p>
        <h2 className="text-2xl font-semibold text-white">Mission Control</h2>
        <p className="text-sm leading-6 text-slate-300">
          Self-hosted command center for multi-channel agent operations, memory and orchestration.
        </p>
      </div>

      <nav className="mt-8 space-y-2">
        {primaryNavigation.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                active
                  ? "border border-mission-300/20 bg-mission-300/10 text-white"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-3xl border border-white/10 bg-white/[0.03] p-5">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Workspace status</p>
        <p className="mt-3 text-lg font-semibold text-white">
          {session?.workspace.name ?? "VEXUSCLAW"}
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          {session?.workspace.onboardingStatus === "completed"
            ? "WhatsApp is the primary operational channel. Mission Control is live."
            : "Setup is still in progress. Complete provider and channel provisioning to go live."}
        </p>
      </div>
    </aside>
  );
}
