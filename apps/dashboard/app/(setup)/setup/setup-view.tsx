"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import type { AuthSession, SetupStatusResponse } from "@vexus/shared";
import { SurfaceCard } from "@vexus/ui";

import { ApiClientError, apiPost, apiRequest } from "../../../lib/api";
import { queryKeys } from "../../../lib/query-keys";
import { useSessionStore } from "../../../lib/session-store";
import { CopyButton } from "../../../components/copy-button";

const steps = [
  {
    description: "Confirm workspace identity, public domain and initial control-plane target.",
    id: "domain",
    title: "Domain"
  },
  {
    description: "Create the first owner account and persist credentials in the platform database.",
    id: "admin",
    title: "Admin"
  },
  {
    description: "Connect OpenAI or activate the internal mock provider to unblock Mission Control.",
    id: "provider",
    title: "Provider"
  },
  {
    description: "Prepare the WhatsApp-first channel posture before the workspace goes live.",
    id: "channels",
    title: "Channels"
  },
  {
    description: "Provision the first agent profile and finalize operational readiness.",
    id: "finalize",
    title: "Finalize"
  }
] as const;

export function SetupView() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const session = useSessionStore((state) => state.session);
  const setSession = useSessionStore((state) => state.setSession);

  const setupQuery = useQuery({
    queryFn: () => apiRequest<SetupStatusResponse>("/setup/status"),
    queryKey: queryKeys.setupStatus
  });

  const [workspaceName, setWorkspaceName] = useState("VEXUSCLAW Mission Control");
  const [adminName, setAdminName] = useState("VEXUSCLAW Owner");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [providerMode, setProviderMode] = useState<"openai" | "mock">("openai");
  const [providerApiKey, setProviderApiKey] = useState("");
  const [agentName, setAgentName] = useState("VEXUSCLAW Concierge");
  const [agentRole, setAgentRole] = useState("WhatsApp operations lead");
  const [agentTone, setAgentTone] = useState("Direct, operational and premium");
  const [instructions, setInstructions] = useState(
    "Act as the primary WhatsApp-first operator assistant for Mission Control. Surface status clearly, keep the operation steady and escalate risks early."
  );

  useEffect(() => {
    if (!setupQuery.data) {
      return;
    }

    setWorkspaceName(setupQuery.data.workspaceName ?? "VEXUSCLAW Mission Control");
    setAdminEmail(setupQuery.data.adminEmail ?? "");
  }, [setupQuery.data]);

  useEffect(() => {
    if (!setupQuery.data?.isReady) {
      return;
    }

    router.replace(session ? "/overview" : "/login");
  }, [router, session, setupQuery.data]);

  const bootstrapMutation = useMutation({
    mutationFn: () =>
      apiPost<SetupStatusResponse>("/setup/bootstrap", {
        domain: setupQuery.data?.baseDomain ?? "vexusclaw.com",
        workspaceName
      }),
    onSuccess: async (status) => {
      toast.success("Workspace bootstrap persisted.");
      await queryClient.setQueryData(queryKeys.setupStatus, status);
    },
    onError: (error) => {
      toast.error(error instanceof ApiClientError ? error.message : "Bootstrap failed.");
    }
  });

  const adminMutation = useMutation({
    mutationFn: () =>
      apiPost<{
        session: AuthSession;
        setup: SetupStatusResponse;
      }>("/setup/admin", {
        email: adminEmail,
        name: adminName,
        password: adminPassword
      }),
    onSuccess: async (payload) => {
      setSession(payload.session);
      await queryClient.setQueryData(queryKeys.authSession, payload.session);
      await queryClient.setQueryData(queryKeys.setupStatus, payload.setup);
      toast.success("Owner account created and authenticated.");
    },
    onError: (error) => {
      toast.error(error instanceof ApiClientError ? error.message : "Admin setup failed.");
    }
  });

  const providerMutation = useMutation({
    mutationFn: () =>
      apiPost<SetupStatusResponse>("/setup/provider", {
        apiKey: providerMode === "openai" ? providerApiKey : undefined,
        mode: providerMode === "openai" ? "api_key" : "skip",
        providerType: providerMode === "openai" ? "openai" : "mock"
      }),
    onSuccess: async (status) => {
      await queryClient.setQueryData(queryKeys.setupStatus, status);
      toast.success(
        providerMode === "openai" ? "OpenAI configured for Mission Control." : "Mock provider activated."
      );
    },
    onError: (error) => {
      toast.error(error instanceof ApiClientError ? error.message : "Provider setup failed.");
    }
  });

  const finalizeMutation = useMutation({
    mutationFn: () =>
      apiPost<SetupStatusResponse>("/setup/finalize", {
        agentName,
        agentRole,
        instructions,
        tone: agentTone
      }),
    onSuccess: async (status) => {
      await queryClient.setQueryData(queryKeys.setupStatus, status);
      await queryClient.invalidateQueries({
        queryKey: queryKeys.authSession
      });
      toast.success("VEXUSCLAW is now ready for Mission Control.");
      router.replace("/overview");
    },
    onError: (error) => {
      toast.error(error instanceof ApiClientError ? error.message : "Finalize step failed.");
    }
  });

  const status = setupQuery.data;
  const baseDomain = status?.baseDomain ?? "vexusclaw.com";
  const isBootstrapped = status?.isBootstrapped ?? false;
  const isAdminConfigured = status?.adminConfigured ?? false;
  const isProviderConfigured = status?.providerConfigured ?? false;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-6 py-10 lg:px-10">
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.34em] text-mission-300/80">VEXUSCLAW setup</p>
        <h1 className="text-4xl font-semibold tracking-tight text-white">Bootstrap your WhatsApp-first control plane</h1>
        <p className="max-w-3xl text-base leading-8 text-slate-300">
          Persist the workspace, owner account, provider and first agent directly into the platform database.
          WhatsApp remains the primary operational channel from day one.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-slate-300">
            Base domain: <span className="font-medium text-white">{baseDomain}</span>
          </div>
          {status?.publicUrl ? <CopyButton value={status.publicUrl} /> : null}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.68fr_1.32fr]">
        <SurfaceCard className="space-y-4">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Setup progress</p>
          {setupQuery.isLoading ? (
            <div className="rounded-2xl border border-white/10 p-4 text-sm text-slate-300">
              Loading setup state...
            </div>
          ) : null}
          <div className="space-y-3">
            {steps.map((step, index) => {
              const complete =
                (step.id === "domain" && isBootstrapped) ||
                (step.id === "admin" && isAdminConfigured) ||
                (step.id === "provider" && isProviderConfigured) ||
                (step.id === "channels" && isProviderConfigured) ||
                (step.id === "finalize" && status?.isReady);

              return (
                <div key={step.id} className="flex items-start gap-3 rounded-2xl border border-white/10 p-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-mission-300/10 text-sm font-semibold text-mission-200">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-white">{step.title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-300">{step.description}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.24em] text-slate-500">
                      {complete ? "Completed" : status?.currentStep === step.id ? "Current step" : "Pending"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </SurfaceCard>

        <div className="space-y-6">
          <SurfaceCard className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Step 1</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Workspace and subdomain</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <input
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-mission-300/50"
                onChange={(event) => setWorkspaceName(event.target.value)}
                placeholder="Workspace name"
                value={workspaceName}
              />
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Assigned public URL</p>
                <p className="mt-2 break-all text-sm font-medium text-white">
                  {status?.publicUrl ?? `Automatico em userxxxxx.${baseDomain}`}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  O subdominio do workspace e gerado automaticamente no bootstrap.
                </p>
              </div>
            </div>
            <button
              className="rounded-full bg-mission-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-mission-300 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={bootstrapMutation.isPending || !workspaceName}
              onClick={() => bootstrapMutation.mutate()}
              type="button"
            >
              {bootstrapMutation.isPending ? "Persistindo..." : "Gerar subdominio"}
            </button>
          </SurfaceCard>

          <SurfaceCard className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Step 2</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Admin owner account</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <input
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-mission-300/50"
                onChange={(event) => setAdminName(event.target.value)}
                placeholder="Owner name"
                value={adminName}
              />
              <input
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-mission-300/50"
                onChange={(event) => setAdminEmail(event.target.value)}
                placeholder="owner@example.com"
                type="email"
                value={adminEmail}
              />
            </div>
            <input
              className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-mission-300/50"
              onChange={(event) => setAdminPassword(event.target.value)}
              placeholder="Strong initial password"
              type="password"
              value={adminPassword}
            />
            <button
              className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-mission-300/30 hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={adminMutation.isPending || !isBootstrapped || !adminName || !adminEmail || adminPassword.length < 12}
              onClick={() => adminMutation.mutate()}
              type="button"
            >
              {adminMutation.isPending ? "Criando conta..." : "Criar admin"}
            </button>
          </SurfaceCard>

          <SurfaceCard className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Step 3</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Provider connection</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <button
                className={`rounded-2xl border px-4 py-4 text-left transition ${
                  providerMode === "openai"
                    ? "border-mission-300/40 bg-mission-300/10"
                    : "border-white/10 bg-white/[0.03]"
                }`}
                onClick={() => setProviderMode("openai")}
                type="button"
              >
                <p className="text-sm font-semibold text-white">OpenAI API Key</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Connect the production provider immediately.
                </p>
              </button>
              <button
                className={`rounded-2xl border px-4 py-4 text-left transition ${
                  providerMode === "mock"
                    ? "border-mission-300/40 bg-mission-300/10"
                    : "border-white/10 bg-white/[0.03]"
                }`}
                onClick={() => setProviderMode("mock")}
                type="button"
              >
                <p className="text-sm font-semibold text-white">Mock fallback</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Keep the platform operational while the real key is added later.
                </p>
              </button>
            </div>
            {providerMode === "openai" ? (
              <input
                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-mission-300/50"
                onChange={(event) => setProviderApiKey(event.target.value)}
                placeholder="sk-proj-..."
                value={providerApiKey}
              />
            ) : null}
            <button
              className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-mission-300/30 hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={providerMutation.isPending || !isAdminConfigured || (providerMode === "openai" && !providerApiKey)}
              onClick={() => providerMutation.mutate()}
              type="button"
            >
              {providerMutation.isPending ? "Configurando provider..." : "Salvar provider"}
            </button>
          </SurfaceCard>

          <SurfaceCard className="space-y-4">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Step 4</p>
            <h2 className="text-2xl font-semibold text-white">WhatsApp priority</h2>
            <p className="text-sm leading-6 text-slate-300">
              Finalization provisions the primary WhatsApp connection, generates the first QR lifecycle and keeps
              WebChat as a secondary structural channel for later expansion.
            </p>
            {status?.publicUrl ? (
              <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/5 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-emerald-200/80">Workspace URL</p>
                <p className="mt-3 break-all text-sm font-semibold text-emerald-100">{status.publicUrl}</p>
              </div>
            ) : null}
          </SurfaceCard>

          <SurfaceCard className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Step 5</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">First agent</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <input
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-mission-300/50"
                onChange={(event) => setAgentName(event.target.value)}
                placeholder="Agent name"
                value={agentName}
              />
              <input
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-mission-300/50"
                onChange={(event) => setAgentRole(event.target.value)}
                placeholder="Agent role"
                value={agentRole}
              />
            </div>
            <input
              className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-mission-300/50"
              onChange={(event) => setAgentTone(event.target.value)}
              placeholder="Operational tone"
              value={agentTone}
            />
            <textarea
              className="min-h-36 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-mission-300/50"
              onChange={(event) => setInstructions(event.target.value)}
              placeholder="Operational instructions"
              value={instructions}
            />
            <button
              className="rounded-full bg-mission-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-mission-300 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={finalizeMutation.isPending || !isProviderConfigured || !agentName || !agentRole || !agentTone || instructions.length < 12}
              onClick={() => finalizeMutation.mutate()}
              type="button"
            >
              {finalizeMutation.isPending ? "Finalizando..." : "Abrir Mission Control"}
            </button>
          </SurfaceCard>
        </div>
      </div>
    </div>
  );
}
