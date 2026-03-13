import { SurfaceCard } from "@vexus/ui";

import { PageHeader } from "../../../components/page-header";

const skills = [
  ["CRM Sync", "sales", "contacts:read, contacts:write"],
  ["Calendar Helper", "operations", "calendar:read, calendar:write"],
  ["Sales Assistant", "revenue", "deals:read"],
  ["File Search", "knowledge", "files:read"],
  ["System Monitor", "observability", "system:read"]
] as const;

export default function SkillsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Skills"
        title="CloudHub-ready catalog"
        description="The skill surface is scaffolded with manifests, permissions and lifecycle states so the ecosystem can expand without reworking the product core."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {skills.map(([name, category, permissions]) => (
          <SurfaceCard key={name} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">{name}</h2>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-300">
                {category}
              </span>
            </div>
            <p className="text-sm leading-6 text-slate-300">Required permissions: {permissions}</p>
            <button className="rounded-full border border-mission-300/30 px-4 py-2 text-sm font-medium text-mission-100 transition hover:bg-mission-300/10">
              Install skill
            </button>
          </SurfaceCard>
        ))}
      </div>
    </div>
  );
}
