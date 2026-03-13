import type { ReactNode } from "react";

import { SurfaceCard } from "@vexus/ui";

interface TableShellProps {
  title: string;
  description: string;
  columns: string[];
  children: ReactNode;
}

export function TableShell({ title, description, columns, children }: TableShellProps) {
  return (
    <SurfaceCard className="overflow-hidden p-0">
      <div className="border-b border-white/10 px-6 py-5">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <p className="mt-1 text-sm text-slate-300">{description}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10 text-left">
          <thead className="bg-white/[0.03]">
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  className="px-6 py-3 text-xs font-medium uppercase tracking-[0.24em] text-slate-400"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">{children}</tbody>
        </table>
      </div>
    </SurfaceCard>
  );
}
