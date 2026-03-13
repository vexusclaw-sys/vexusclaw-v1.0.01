import type { ReactNode } from "react";

import { SessionGate } from "../../components/session-gate";
import { Sidebar } from "../../components/sidebar";
import { Topbar } from "../../components/topbar";

export default function MissionControlLayout({ children }: { children: ReactNode }) {
  return (
    <SessionGate>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <Topbar />
          <main className="flex-1 px-6 py-8 lg:px-10">{children}</main>
        </div>
      </div>
    </SessionGate>
  );
}
