"use client";

import { StatusPill } from "@vexus/ui";

import { LogoutButton } from "./logout-button";
import { useSessionStore } from "../lib/session-store";

export function Topbar() {
  const session = useSessionStore((state) => state.session);

  return (
    <header className="flex flex-col gap-4 border-b border-white/10 bg-slate-950/40 px-6 py-5 backdrop-blur lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Workspace</p>
        <h1 className="mt-2 text-xl font-semibold text-white">
          {session?.workspace.name ?? "VEXUSCLAW Mission Control"}
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          {session?.workspace.publicUrl ?? "Subdominio automatico pendente"}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <StatusPill tone="ok">Mission Control</StatusPill>
        <StatusPill tone={session?.workspace.onboardingStatus === "completed" ? "ok" : "degraded"}>
          {session?.workspace.onboardingStatus === "completed" ? "Setup complete" : "Setup in progress"}
        </StatusPill>
        <LogoutButton />
      </div>
    </header>
  );
}
