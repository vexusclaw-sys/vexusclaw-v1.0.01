"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import type {
  AgentDetails,
  AgentListResponse,
  OpenAIConnectionTestResult,
  ProviderConnectionDetails
} from "@vexus/shared";
import { StatusPill, SurfaceCard } from "@vexus/ui";

import { ChatGptOAuthPanel } from "../../../components/chatgpt-oauth-panel";
import { ChatGptSessionImportPanel } from "../../../components/chatgpt-session-import-panel";
import { EmptyState } from "../../../components/empty-state";
import { PageHeader } from "../../../components/page-header";
import { ApiClientError, apiPatch, apiPost, apiRequest } from "../../../lib/api";
import { queryKeys } from "../../../lib/query-keys";

type AgentModalMode = "create" | "edit";
type AgentModalStep = "details" | "provider";

function toneForStatus(status: AgentDetails["status"]): "ok" | "degraded" | "down" {
  if (status === "active") {
    return "ok";
  }

  if (status === "disabled") {
    return "down";
  }

  return "degraded";
}

function providerLabel(provider: ProviderConnectionDetails): string {
  if (provider.provider === "openai") {
    return "OpenAI API key";
  }

  if (provider.provider === "chatgpt_oauth") {
    return "ChatGPT OAuth";
  }

  return "Mock";
}

function validateAgentInput(input: {
  instructions: string;
  name: string;
  role: string;
  tone: string;
}): string | null {
  if (input.name.trim().length < 2) {
    return "Informe um nome de agente com pelo menos 2 caracteres.";
  }

  if (input.role.trim().length < 2) {
    return "Informe a funcao principal do agente.";
  }

  if (input.tone.trim().length < 2) {
    return "Informe o estilo de conversa do agente.";
  }

  if (input.instructions.trim().length < 4) {
    return "As instrucoes base precisam ter pelo menos 4 caracteres.";
  }

  return null;
}

export function AgentsView() {
  const queryClient = useQueryClient();
  const [activeAgent, setActiveAgent] = useState<AgentDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<AgentModalMode>("create");
  const [modalStep, setModalStep] = useState<AgentModalStep>("details");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [tone, setTone] = useState("Direto e operacional");
  const [operatorAddressing, setOperatorAddressing] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [openAIApiKey, setOpenAIApiKey] = useState("");

  const agentsQuery = useQuery({
    queryFn: () => apiRequest<AgentListResponse>("/agents"),
    queryKey: queryKeys.agents
  });

  const providersQuery = useQuery({
    queryFn: () => apiRequest<ProviderConnectionDetails[]>("/providers"),
    queryKey: queryKeys.providers
  });

  const sortedAgents = useMemo(
    () =>
      [...(agentsQuery.data?.items ?? [])].sort((left, right) =>
        left.isDefault === right.isDefault ? 0 : left.isDefault ? -1 : 1
      ),
    [agentsQuery.data?.items]
  );

  const realPrimaryProvider = useMemo(
    () =>
      providersQuery.data?.find(
        (provider) =>
          provider.provider !== "mock" && provider.isPrimary && provider.status === "connected"
      ) ??
      providersQuery.data?.find(
        (provider) => provider.provider !== "mock" && provider.status === "connected"
      ) ??
      null,
    [providersQuery.data]
  );

  const mockProvider = useMemo(
    () => providersQuery.data?.find((provider) => provider.provider === "mock" && provider.status === "connected") ?? null,
    [providersQuery.data]
  );

  const instructionsLength = instructions.trim().length;

  const resetForm = () => {
    setActiveAgent(null);
    setDescription("");
    setInstructions("");
    setIsModalOpen(false);
    setModalMode("create");
    setModalStep("details");
    setName("");
    setOpenAIApiKey("");
    setOperatorAddressing("");
    setRole("");
    setTone("Direto e operacional");
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (agent: AgentDetails, step: AgentModalStep = "details") => {
    setActiveAgent(agent);
    setDescription(agent.description ?? "");
    setInstructions(agent.instructions);
    setIsModalOpen(true);
    setModalMode("edit");
    setModalStep(step);
    setName(agent.name);
    setOpenAIApiKey("");
    setOperatorAddressing(agent.operatorAddressing ?? "");
    setRole(agent.role);
    setTone(agent.tone);
  };

  const testOpenAIMutation = useMutation({
    mutationFn: async () => {
      const apiKey = openAIApiKey.trim();

      if (!apiKey) {
        throw new Error("Informe a API key da OpenAI para testar a conexao.");
      }

      const result = await apiPost<OpenAIConnectionTestResult>("/providers/openai/test", {
        apiKey
      });

      if (!result.ok) {
        throw new Error(result.message);
      }

      return result;
    },
    onSuccess: (result) => {
      toast.success(result.model ? `OpenAI conectado. Modelo detectado: ${result.model}` : result.message);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Nao foi possivel validar a chave da OpenAI.");
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (): Promise<AgentDetails> => {
      const validationError = validateAgentInput({
        instructions,
        name,
        role,
        tone
      });

      if (validationError) {
        throw new Error(validationError);
      }

      const payload = {
        description: description || undefined,
        instructions,
        name,
        operatorAddressing: operatorAddressing || undefined,
        role,
        tone
      };

      if (modalMode === "edit" && activeAgent) {
        return apiPatch<AgentDetails>(`/agents/${activeAgent.id}`, payload);
      }

      return apiPost<AgentDetails>("/agents", payload);
    },
    onSuccess: async (agent) => {
      setActiveAgent(agent);
      setModalMode("edit");
      setModalStep("provider");

      await queryClient.invalidateQueries({
        queryKey: queryKeys.agents
      });

      if (realPrimaryProvider) {
        toast.success(`Agente salvo. O provider atual ja esta pronto: ${realPrimaryProvider.label}.`);
      } else {
        toast.success("Agente salvo. Agora conecte o modelo no passo seguinte.");
      }
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiClientError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Nao foi possivel salvar o agente."
      );
    }
  });

  const connectOpenAIMutation = useMutation({
    mutationFn: async () => {
      const apiKey = openAIApiKey.trim();

      if (!apiKey) {
        throw new Error("Informe a API key da OpenAI para conectar este workspace.");
      }

      const result = await apiPost<OpenAIConnectionTestResult>("/providers/openai/test", {
        apiKey
      });

      if (!result.ok) {
        throw new Error(result.message);
      }

      return apiPost<ProviderConnectionDetails>("/providers/connections", {
        apiKey,
        isPrimary: true,
        label: activeAgent ? `${activeAgent.name} OpenAI` : "VEXUSCLAW OpenAI",
        mode: "api_key",
        provider: "openai"
      });
    },
    onSuccess: async (provider) => {
      setOpenAIApiKey("");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.overview }),
        queryClient.invalidateQueries({ queryKey: queryKeys.providers }),
        queryClient.invalidateQueries({ queryKey: queryKeys.settings })
      ]);
      toast.success(`Provider conectado com sucesso: ${provider.label}.`);
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiClientError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Nao foi possivel conectar a OpenAI."
      );
    }
  });

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Agents"
        title="Fleet de agentes"
        description="Crie quantos agentes quiser. Primeiro voce salva os dados do agente; em seguida a VEXUSCLAW abre o passo de conexao do modelo real, sem te travar no provider mock."
        actions={
          <button
            className="rounded-full bg-mission-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-mission-300"
            onClick={openCreateModal}
            type="button"
          >
            Novo agente
          </button>
        }
      />

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <SurfaceCard className="max-h-[92vh] w-full max-w-5xl overflow-y-auto border border-white/10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  {modalMode === "create" ? "Provisionar agente" : "Editar agente"}
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  {modalMode === "create" ? "Criar novo agente" : `Editar ${activeAgent?.name ?? "agente"}`}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                  Primeiro voce salva os dados do agente. Em seguida a VEXUSCLAW abre o passo de
                  modelo para gerar o link do OpenAI Codex/ChatGPT OAuth ou conectar via API key.
                </p>
              </div>
              <button
                className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white transition hover:border-mission-300/30 hover:bg-white/[0.04]"
                onClick={resetForm}
                type="button"
              >
                Fechar
              </button>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  modalStep === "details"
                    ? "bg-mission-400 text-slate-950"
                    : "border border-white/10 text-white hover:border-mission-300/30 hover:bg-white/[0.04]"
                }`}
                onClick={() => setModalStep("details")}
                type="button"
              >
                Dados do agente
              </button>
              <button
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  modalStep === "provider"
                    ? "bg-mission-400 text-slate-950"
                    : "border border-white/10 text-white hover:border-mission-300/30 hover:bg-white/[0.04]"
                } disabled:cursor-not-allowed disabled:opacity-50`}
                disabled={!activeAgent}
                onClick={() => setModalStep("provider")}
                type="button"
              >
                Modelo e conexao
              </button>
            </div>

            {modalStep === "details" ? (
              <div className="mt-8 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                <div className="space-y-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="space-y-2">
                      <span className="text-sm font-medium text-white">Nome do agente</span>
                      <input
                        className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-mission-300/50"
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Ex.: Qualificador comercial"
                        value={name}
                      />
                    </label>
                    <label className="space-y-2">
                      <span className="text-sm font-medium text-white">Funcao principal</span>
                      <input
                        className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-mission-300/50"
                        onChange={(event) => setRole(event.target.value)}
                        placeholder="Ex.: Qualificar leads do WhatsApp"
                        value={role}
                      />
                    </label>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="space-y-2">
                      <span className="text-sm font-medium text-white">Estilo de conversa</span>
                      <input
                        className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-mission-300/50"
                        onChange={(event) => setTone(event.target.value)}
                        placeholder="Ex.: Consultivo, premium e direto"
                        value={tone}
                      />
                    </label>
                    <label className="space-y-2">
                      <span className="text-sm font-medium text-white">Como ele deve te chamar?</span>
                      <input
                        className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-mission-300/50"
                        onChange={(event) => setOperatorAddressing(event.target.value)}
                        placeholder="Ex.: chefe, Douglas, operador"
                        value={operatorAddressing}
                      />
                    </label>
                  </div>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-white">Descricao curta</span>
                    <textarea
                      className="min-h-24 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-mission-300/50"
                      onChange={(event) => setDescription(event.target.value)}
                      placeholder="Resumo rapido da responsabilidade desse agente."
                      value={description}
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-white">Instrucoes base do agente</span>
                    <textarea
                      className="min-h-48 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-mission-300/50"
                      onChange={(event) => setInstructions(event.target.value)}
                      placeholder="Explique como o agente deve se comportar, priorizar contexto, tratar leads e quando escalar."
                      value={instructions}
                    />
                    <p className="text-xs text-slate-400">
                      Minimo de 4 caracteres. Atual: {instructionsLength}.
                    </p>
                  </label>
                </div>

                <SurfaceCard className="space-y-4 border border-white/10 bg-white/[0.02]">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Resumo do agente</p>
                  <div className="space-y-3 text-sm text-slate-300">
                    <p>Nome: {name || "A definir"}</p>
                    <p>Funcao: {role || "A definir"}</p>
                    <p>Estilo: {tone || "A definir"}</p>
                    <p>Como te chama: {operatorAddressing || "Padrao do workspace"}</p>
                    <p>Provider atual do workspace: {realPrimaryProvider ? `${providerLabel(realPrimaryProvider)} / ${realPrimaryProvider.label}` : mockProvider ? `Mock / ${mockProvider.label}` : "Nenhum"}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-slate-300">
                    Ao salvar, a VEXUSCLAW abre o proximo passo para voce conectar o modelo do
                    workspace que esse agente vai usar.
                  </div>
                </SurfaceCard>
              </div>
            ) : (
              <div className="mt-8 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                <div className="space-y-5">
                  <SurfaceCard className="space-y-4 border border-mission-300/20 bg-mission-400/10">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-mission-100">Passo 2 de 2</p>
                      <h3 className="mt-2 text-lg font-semibold text-white">Conectar modelo do agente</h3>
                    </div>
                    <p className="text-sm leading-6 text-slate-200">
                      O agente <span className="font-semibold text-white">{activeAgent?.name ?? (name || "novo agente")}</span>{" "}
                      ja foi salvo. Agora gere o link do ChatGPT / OpenAI Codex ou conecte uma API key
                      oficial para esse workspace.
                    </p>
                    <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-4 text-sm leading-6 text-slate-200">
                      Dica operacional: se o callback automatico nao concluir, use o campo de fallback manual
                      logo ao lado para colar a URL retornada pelo provedor.
                    </div>
                  </SurfaceCard>

                  <SurfaceCard className="space-y-4 border border-white/10 bg-white/[0.02]">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Agente selecionado</p>
                      <h3 className="mt-2 text-lg font-semibold text-white">{activeAgent?.name ?? name}</h3>
                    </div>
                    <p className="text-sm leading-6 text-slate-300">
                      O provider e do workspace. Depois de conectado, este agente passa a usar o
                      provider primario real do Mission Control.
                    </p>
                    {realPrimaryProvider ? (
                      <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                        <p className="text-sm font-medium text-white">Provider real atual</p>
                        <p className="mt-2 text-sm leading-6 text-slate-200">
                          {providerLabel(realPrimaryProvider)} · {realPrimaryProvider.label} · status {realPrimaryProvider.status}
                        </p>
                      </div>
                    ) : mockProvider ? (
                      <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4">
                        <p className="text-sm font-medium text-white">Workspace ainda em fallback mock</p>
                        <p className="mt-2 text-sm leading-6 text-slate-200">
                          {mockProvider.label}. Isso nao bloqueia criar agentes, mas ainda nao e um modelo real.
                        </p>
                      </div>
                    ) : null}
                  </SurfaceCard>

                  <ChatGptOAuthPanel
                    returnToPath="/agents"
                    suggestedLabel={
                      activeAgent?.name?.trim()
                        ? `${activeAgent.name.trim()} ChatGPT`
                        : "ChatGPT OAuth"
                    }
                    title="Entrar com ChatGPT / OpenAI Codex (experimental)"
                  />

                  <ChatGptSessionImportPanel
                    suggestedLabel={
                      activeAgent?.name?.trim()
                        ? `${activeAgent.name.trim()} Imported ChatGPT Session`
                        : "Imported ChatGPT Session"
                    }
                    title="Importar sessao ChatGPT / OpenAI Codex (experimental)"
                  />

                  <SurfaceCard className="space-y-4 border border-white/10 bg-white/[0.02]">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">OpenAI API key</p>
                      <h3 className="mt-2 text-lg font-semibold text-white">Modo oficial estavel</h3>
                    </div>
                    <label className="space-y-2">
                      <span className="text-sm font-medium text-white">OpenAI API key</span>
                      <input
                        className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-white outline-none transition focus:border-mission-300/50"
                        onChange={(event) => setOpenAIApiKey(event.target.value)}
                        placeholder="sk-..."
                        type="password"
                        value={openAIApiKey}
                      />
                    </label>
                    <div className="flex flex-wrap gap-3">
                      <button
                        className="rounded-full border border-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-mission-300/30 hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={testOpenAIMutation.isPending || !openAIApiKey.trim()}
                        onClick={() => testOpenAIMutation.mutate()}
                        type="button"
                      >
                        {testOpenAIMutation.isPending ? "Testando..." : "Testar chave OpenAI"}
                      </button>
                      <button
                        className="rounded-full bg-mission-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-mission-300 disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={connectOpenAIMutation.isPending || !openAIApiKey.trim()}
                        onClick={() => connectOpenAIMutation.mutate()}
                        type="button"
                      >
                        {connectOpenAIMutation.isPending ? "Conectando..." : "Conectar OpenAI agora"}
                      </button>
                    </div>
                  </SurfaceCard>
                </div>

                <SurfaceCard className="space-y-4 border border-white/10 bg-white/[0.02]">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Resumo operacional</p>
                  <div className="space-y-3 text-sm leading-6 text-slate-300">
                    <p>Agente: {activeAgent?.name ?? (name || "Nao definido")}</p>
                    <p>
                      Provider real atual:{" "}
                      {realPrimaryProvider
                        ? `${providerLabel(realPrimaryProvider)} / ${realPrimaryProvider.label}`
                        : "Nenhum provider real conectado"}
                    </p>
                    <p>
                      Fallback atual:{" "}
                      {mockProvider ? `${mockProvider.label} (mock)` : "Nenhum fallback mock provisionado"}
                    </p>
                    <p>
                      Proximo passo: gerar o link do ChatGPT ou colar a URL no fallback manual se o
                      retorno automatico falhar.
                    </p>
                  </div>
                </SurfaceCard>
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              {modalStep === "details" ? (
                <button
                  className="rounded-full bg-mission-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-mission-300 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={saveMutation.isPending}
                  onClick={() => saveMutation.mutate()}
                  type="button"
                >
                  {saveMutation.isPending
                    ? "Salvando..."
                    : modalMode === "create"
                      ? "Criar agente e abrir modelo"
                      : "Salvar agente e abrir modelo"}
                </button>
              ) : (
                <button
                  className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-mission-300/30 hover:bg-white/[0.04]"
                  onClick={() => setModalStep("details")}
                  type="button"
                >
                  Voltar para dados do agente
                </button>
              )}
              <button
                className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-mission-300/30 hover:bg-white/[0.04]"
                onClick={resetForm}
                type="button"
              >
                Fechar
              </button>
            </div>
          </SurfaceCard>
        </div>
      ) : null}

      {agentsQuery.isLoading ? (
        <div className="grid gap-4 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <SurfaceCard key={index} className="space-y-4">
              <div className="h-6 w-40 rounded-full bg-white/10" />
              <div className="h-16 rounded-2xl bg-white/[0.03]" />
              <div className="h-20 rounded-2xl bg-white/[0.03]" />
            </SurfaceCard>
          ))}
        </div>
      ) : null}

      {!agentsQuery.isLoading && !sortedAgents.length ? (
        <EmptyState
          actionLabel="Novo agente"
          description="Ainda nao existem agentes alem do setup inicial. Crie o primeiro agente operacional desta workspace."
          title="Nenhum agente encontrado"
        />
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        {sortedAgents.map((agent) => (
          <SurfaceCard key={agent.id} className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-white">{agent.name}</h2>
                <p className="mt-1 text-sm text-slate-400">{agent.role}</p>
              </div>
              <StatusPill tone={toneForStatus(agent.status)}>
                {agent.status === "active" ? "Ativo" : agent.status}
              </StatusPill>
            </div>
            <p className="text-sm leading-6 text-slate-300">
              {agent.description || agent.instructions}
            </p>
            <div className="grid gap-2 text-sm text-slate-400">
              <p>Estilo: {agent.tone}</p>
              <p>Como te chama: {agent.operatorAddressing ?? "Padrao do workspace"}</p>
              <p>Tools: {agent.tools.join(", ")}</p>
              <p>
                Channels:{" "}
                {agent.availableChannels.length
                  ? agent.availableChannels
                      .map((channel) => channel === "whatsapp" ? "WhatsApp" : "WebChat")
                      .join(", ")
                  : "Nenhum canal provisionado"}
              </p>
              <p>Slug: {agent.slug}</p>
              <p>
                Provider real:{" "}
                {realPrimaryProvider
                  ? `${providerLabel(realPrimaryProvider)} / ${realPrimaryProvider.label}`
                  : "Nenhum provider real conectado"}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-mission-300/30 hover:bg-white/[0.04]"
                onClick={() => openEditModal(agent, "details")}
                type="button"
              >
                Editar agente
              </button>
              <button
                className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-mission-300/30 hover:bg-white/[0.04]"
                onClick={() => openEditModal(agent, "provider")}
                type="button"
              >
                Conectar ChatGPT
              </button>
            </div>
          </SurfaceCard>
        ))}
      </div>
    </div>
  );
}
