import { SurfaceCard } from "@vexus/ui";

import { PageHeader } from "../../../components/page-header";

export default function WebChatPreviewPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="WebChat preview"
        title="Embeddable widget preview"
        description="Preview the future website widget shell, tone and layout before the channel is fully wired."
      />

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <SurfaceCard className="space-y-4">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Widget settings</p>
          <div className="space-y-3 text-sm text-slate-200">
            <p>Title: VEXUS Assistant</p>
            <p>Accent: Mission cyan</p>
            <p>Position: Bottom right</p>
            <p>Mode: WebChat preview scaffold</p>
          </div>
        </SurfaceCard>

        <SurfaceCard className="flex min-h-[28rem] flex-col justify-between">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Conversation canvas</p>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-200">
              Hello. I am ready to simulate a future VEXUSCLAW web conversation flow.
            </div>
            <div className="rounded-2xl border border-mission-300/20 bg-mission-300/8 p-4 text-sm text-slate-100">
              Great. Once ETAPA 3 lands, this preview will connect to the gateway and persist the session.
            </div>
          </div>
          <div className="mt-6 rounded-full border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-500">
            Type a message...
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
}
