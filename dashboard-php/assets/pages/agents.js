(function () {
  if (!document.getElementById("agentsList")) {
    return;
  }

  var state = {
    agents: [],
    currentAgent: null,
    mode: "create",
    oauthAttempt: null,
    oauthPollTimer: null,
    providers: []
  };

  var ROLE_LABELS = {
    sales: "Vendas e CRM",
    support: "Suporte ao cliente",
    dev: "Desenvolvimento",
    ops: "Operacoes",
    content: "Conteudo e marketing",
    finance: "Financeiro",
    custom: "Personalizado"
  };

  var STYLE_LABELS = {
    direct: "Direto e operacional",
    formal: "Formal e preciso",
    friendly: "Amigavel e proativo",
    technical: "Tecnico e detalhado",
    concise: "Conciso"
  };

  function $(id) {
    return document.getElementById(id);
  }

  function initials(value) {
    var raw = String(value || "").trim();
    if (!raw) {
      return "A";
    }
    return raw.slice(0, 1).toUpperCase();
  }

  function replaceNode(id) {
    var node = $(id);
    if (!node || !node.parentNode) {
      return node;
    }
    var clone = node.cloneNode(true);
    node.parentNode.replaceChild(clone, node);
    return clone;
  }

  function escapeHtml(value) {
    return window.VexusApi.escapeHtml(value == null ? "" : value);
  }

  function openModal(id) {
    var modal = $(id);
    if (modal) {
      modal.classList.add("open");
    }
  }

  function closeModal(id) {
    var modal = $(id);
    if (modal) {
      modal.classList.remove("open");
    }
  }

  function closeAllModals() {
    closeModal("modalStep1");
    closeModal("modalStep2");
  }

  function getSelectedAgent() {
    if (state.currentAgent) {
      return state.currentAgent;
    }
    return state.agents[0] || null;
  }

  function toneLabel(value) {
    return STYLE_LABELS[value] || value || "Direto e operacional";
  }

  function roleLabel(value) {
    return ROLE_LABELS[value] || value || "A definir";
  }

  function getPrimaryProvider() {
    if (!state.providers.length) {
      return null;
    }
    return state.providers.find(function (provider) {
      return provider.isPrimary;
    }) || state.providers[0];
  }

  function getConnectedChatGptProvider() {
    return state.providers.find(function (provider) {
      return provider.provider === "chatgpt_oauth" && provider.status === "connected";
    }) || null;
  }

  function providerBadgeClass(provider) {
    if (!provider) {
      return "provider-badge badge-mock";
    }
    if (provider.provider === "mock") {
      return "provider-badge badge-mock";
    }
    if (provider.status === "connected") {
      return "provider-badge badge-connected";
    }
    if (provider.provider === "chatgpt_oauth") {
      return "provider-badge badge-experimental";
    }
    return "provider-badge badge-stable";
  }

  function updateSummary() {
    var name = $("newAgentName").value.trim();
    var role = $("newAgentRole").value;
    var style = $("newAgentStyle").value;
    var callMe = $("newAgentCallMe").value.trim();
    $("nameLen").textContent = String(name.length);
    $("sumName").textContent = name || "A definir";
    $("sumRole").textContent = roleLabel(role);
    $("sumStyle").textContent = toneLabel(style);
    $("sumCallMe").textContent = callMe || "Padrao do workspace";

    var provider = getPrimaryProvider();
    $("sumProvider").textContent = provider
      ? provider.label + " · " + provider.provider + " · " + provider.status
      : "Nenhum provider conectado";
  }

  function renderTools(agent) {
    var tools = agent && Array.isArray(agent.tools) ? agent.tools : [];
    var filter = String($("skillFilterInput").value || "").trim().toLowerCase();
    var visible = tools.filter(function (tool) {
      return !filter || String(tool).toLowerCase().indexOf(filter) !== -1;
    });
    $("workspaceSkillsList").innerHTML = visible.length ? visible.map(function (tool) {
      return [
        '<div class="skill-item">',
        '<div class="skill-name">' + escapeHtml(tool) + "</div>",
        '<div class="skill-desc">Ferramenta ou skill liberada para este agente.</div>',
        '<div class="skill-meta">',
        '<span class="skill-tag eligible">enabled</span>',
        '<span class="skill-tag scope">runtime</span>',
        "</div>",
        "</div>"
      ].join("");
    }).join("") : '<div class="builtin-box">Nenhuma ferramenta explicita cadastrada para este agente.</div>';
    $("workspaceCount").textContent = String(visible.length);
    $("shownCount").textContent = String(visible.length) + " shown";
    $("skillsRatio").textContent = String(visible.length) + "/" + String(tools.length);
  }

  function renderAgentDetails(agent) {
    if (!agent) {
      $("agentAvatar").textContent = "A";
      $("agentTitle").textContent = "Nenhum agente";
      var blurb = document.querySelector(".agent-blurb");
      if (blurb) {
        blurb.textContent = "Crie o primeiro agente para este workspace.";
      }
      $("agentWorkspaceTag").textContent = "workspace";
      $("agentIdentityTag").textContent = "pendente";
      $("agentIdentityTag").classList.remove("default");
      renderTools(null);
      return;
    }

    $("agentAvatar").textContent = initials(agent.name);
    $("agentTitle").textContent = agent.name;
    var desc = document.querySelector(".agent-blurb");
    if (desc) {
      desc.textContent = agent.description || (roleLabel(agent.role) + " · " + toneLabel(agent.tone));
    }
    $("agentWorkspaceTag").textContent = agent.slug;
    $("agentIdentityTag").textContent = agent.isDefault ? "default" : agent.status;
    if (agent.isDefault) {
      $("agentIdentityTag").classList.add("default");
    } else {
      $("agentIdentityTag").classList.remove("default");
    }
    renderTools(agent);
  }

  function renderAgentList() {
    var wrap = $("agentsList");
    wrap.innerHTML = state.agents.map(function (agent) {
      return [
        '<button class="agent-row' + (state.currentAgent && state.currentAgent.id === agent.id ? " active" : "") + '" data-agent-id="' + escapeHtml(agent.id) + '" type="button">',
        '<div class="agent-icon bot">&#129302;</div>',
        '<div class="agent-text">',
        '<div class="agent-name">' + escapeHtml(agent.name) + "</div>",
        '<div class="agent-sub">' + escapeHtml(agent.slug + " · " + roleLabel(agent.role)) + "</div>",
        "</div>",
        "</button>"
      ].join("");
    }).join("");

    wrap.querySelectorAll("[data-agent-id]").forEach(function (button) {
      button.addEventListener("click", function () {
        var agent = state.agents.find(function (item) {
          return item.id === button.dataset.agentId;
        });
        if (!agent) {
          return;
        }
        state.currentAgent = agent;
        renderAgentList();
        renderAgentDetails(agent);
      });
      button.addEventListener("dblclick", function () {
        var agent = state.agents.find(function (item) {
          return item.id === button.dataset.agentId;
        });
        if (agent) {
          openEditModal(agent);
        }
      });
    });

    $("agentsConfigured").textContent = String(state.agents.length);
    renderAgentDetails(getSelectedAgent());
  }

  function fillForm(agent) {
    $("newAgentName").value = agent ? agent.name || "" : "";
    $("newAgentRole").value = agent ? agent.role || "" : "";
    $("newAgentStyle").value = agent ? agent.tone || "direct" : "direct";
    $("newAgentCallMe").value = agent ? agent.operatorAddressing || "" : "";
    $("newAgentDesc").value = agent ? agent.description || "" : "";
    $("newAgentInstructions").value = agent ? agent.instructions || "" : "";
    updateSummary();
  }

  function openCreateModal() {
    state.mode = "create";
    state.currentAgent = getSelectedAgent();
    fillForm(null);
    $("step2Title").textContent = "Conectar modelo";
    openModal("modalStep1");
  }

  function openEditModal(agent) {
    state.mode = "edit";
    state.currentAgent = agent;
    fillForm(agent);
    $("step2Title").textContent = "Editar agente";
    openModal("modalStep1");
  }

  function collectAgentPayload() {
    var payload = {
      description: $("newAgentDesc").value.trim(),
      instructions: $("newAgentInstructions").value.trim(),
      name: $("newAgentName").value.trim(),
      operatorAddressing: $("newAgentCallMe").value.trim(),
      role: $("newAgentRole").value.trim(),
      tone: $("newAgentStyle").value.trim()
    };

    if (payload.name.length < 2) {
      throw new Error("Informe um nome de agente com pelo menos 2 caracteres.");
    }
    if (payload.role.length < 2) {
      throw new Error("Selecione a funcao principal do agente.");
    }
    if (payload.instructions.length < 4) {
      throw new Error("Defina as instrucoes base do agente.");
    }

    return payload;
  }

  function setStep2Agent(agent) {
    var target = agent || getSelectedAgent();
    var name = target ? target.name : "agente";
    $("step2AgentName").textContent = name;
    $("step2PillName").textContent = name;
    $("step2PillAvatar").textContent = initials(name);
    $("opSumAgent").textContent = name;
  }

  function renderProviderSummary() {
    var provider = getPrimaryProvider();
    var currentProviderName = $("agentCurrentProviderName");
    var currentProviderBadge = $("agentCurrentProviderBadge");
    if (!provider) {
      currentProviderName.textContent = "Nenhum provider conectado";
      currentProviderBadge.textContent = "pending";
      currentProviderBadge.className = "provider-badge badge-mock";
    } else {
      var identity = provider.accountEmail || provider.accountName || provider.secretHint || "workspace";
      currentProviderName.textContent = provider.label + " · " + provider.provider + " · " + identity;
      currentProviderBadge.textContent = provider.status + (provider.isPrimary ? " · primary" : "");
      currentProviderBadge.className = providerBadgeClass(provider);
    }

    var oauthProvider = getConnectedChatGptProvider();
    var notice = $("agentOauthNotice");
    if (oauthProvider) {
      notice.className = "notice notice-green";
      notice.innerHTML = [
        "<b style=\"font-family:'Press Start 2P',monospace;font-size:.3rem\">Provider ChatGPT OAuth conectado</b><br>",
        escapeHtml(oauthProvider.label) + " · " +
          escapeHtml(oauthProvider.accountEmail || oauthProvider.accountName || "workspace") + " · status " +
          escapeHtml(oauthProvider.status) +
          (oauthProvider.tokenExpiresAt ? "<br>Expira em: " + escapeHtml(oauthProvider.tokenExpiresAt) : "")
      ].join("");
    } else {
      notice.className = "notice notice-yellow";
      notice.innerHTML = "<b style=\"font-family:'Press Start 2P',monospace;font-size:.3rem\">Provider ChatGPT OAuth ainda nao conectado</b><br>Use o fluxo PKCE ou importe um auth.json para ativar o modo experimental.";
    }
    updateSummary();
  }

  function renderAttemptStatus(attempt) {
    state.oauthAttempt = attempt;
    $("attemptBox").style.display = "block";
    $("attemptId").textContent = attempt.attemptId || "—";
    $("attemptExpiry").textContent = attempt.expiresAt ? window.VexusApi.formatDateTime(attempt.expiresAt) : "—";
    $("attemptStatusLabel").textContent = "Estado atual: " + (attempt.status || "pending");
    $("attemptDot").className = "status-dot" + (attempt.status === "completed" ? " green" : "");
  }

  function stopPollingAttempt() {
    if (state.oauthPollTimer) {
      clearInterval(state.oauthPollTimer);
      state.oauthPollTimer = null;
    }
  }

  function startPollingAttempt() {
    stopPollingAttempt();
    if (!state.oauthAttempt || !state.oauthAttempt.attemptId) {
      return;
    }
    state.oauthPollTimer = setInterval(function () {
      window.VexusApi.get("/providers/chatgpt/oauth/attempts/" + state.oauthAttempt.attemptId)
        .then(function (attempt) {
          renderAttemptStatus(attempt);
          if (attempt.status === "completed" || attempt.status === "failed" || attempt.status === "expired") {
            stopPollingAttempt();
            if (attempt.status === "completed") {
              loadProviders().catch(function () {});
            }
          }
        })
        .catch(function () {});
    }, 4000);
  }

  async function loadProviders() {
    state.providers = await window.VexusApi.get("/providers");
    renderProviderSummary();
  }

  async function loadAgents() {
    var payload = await window.VexusApi.get("/agents");
    state.agents = payload.items || [];
    if (!state.currentAgent && state.agents.length) {
      state.currentAgent = state.agents[0];
    } else if (state.currentAgent) {
      state.currentAgent = state.agents.find(function (item) {
        return item.id === state.currentAgent.id;
      }) || state.agents[0] || null;
    }
    renderAgentList();
  }

  async function saveAgent() {
    var payload = collectAgentPayload();
    var done = window.VexusApi.setButtonBusy($("goToStep2Btn"), state.mode === "edit" ? "Salvando..." : "Criando...");
    try {
      var agent;
      if (state.mode === "edit" && state.currentAgent && state.currentAgent.id) {
        agent = await window.VexusApi.patch("/agents/" + state.currentAgent.id, payload);
      } else {
        agent = await window.VexusApi.post("/agents", payload);
      }
      state.currentAgent = agent;
      await loadAgents();
      await loadProviders();
      setStep2Agent(agent);
      closeModal("modalStep1");
      openModal("modalStep2");
    } finally {
      done();
    }
  }

  async function startOauthAttempt(openWindow) {
    var agent = getSelectedAgent();
    var done = window.VexusApi.setButtonBusy($("generateLinkBtn"), "Gerando...");
    try {
      var attempt = await window.VexusApi.post("/providers/chatgpt/oauth/start", {
        label: agent ? "ChatGPT OAuth · " + agent.name : "ChatGPT OAuth",
        makePrimary: true,
        returnToPath: "/agents"
      });
      attempt.status = "pending";
      renderAttemptStatus(attempt);
      setStep2Agent(agent);
      startPollingAttempt();
      if (openWindow) {
        window.open(attempt.authorizeUrl, "vexusclaw-oauth", "width=720,height=840");
      }
      return attempt;
    } finally {
      done();
    }
  }

  async function completeManualCallback() {
    var value = $("manualCallbackInput").value.trim();
    if (!value) {
      throw new Error("Cole a URL final ou o code retornado pelo provedor.");
    }
    var done = window.VexusApi.setButtonBusy($("completeManualCallbackBtn"), "Concluindo...");
    try {
      await window.VexusApi.post("/providers/chatgpt/oauth/complete-manual", {
        attemptId: state.oauthAttempt ? state.oauthAttempt.attemptId : undefined,
        callbackUrl: value
      });
      $("manualCallbackInput").value = "";
      stopPollingAttempt();
      await loadProviders();
    } finally {
      done();
    }
  }

  async function importSessionJson(authJson) {
    var done = window.VexusApi.setButtonBusy($("importSessionJsonBtn"), "Importando...");
    try {
      await window.VexusApi.post("/providers/chatgpt/import-session", {
        authJson: authJson,
        label: "Imported ChatGPT Session",
        makePrimary: true
      });
      $("sessionJsonInput").value = "";
      await loadProviders();
    } finally {
      done();
    }
  }

  async function testOpenAi() {
    var apiKey = $("openAiApiKeyInput").value.trim();
    if (apiKey.length < 10) {
      throw new Error("Informe uma API key OpenAI valida.");
    }
    var done = window.VexusApi.setButtonBusy($("testOpenAiBtn"), "Testando...");
    try {
      var result = await window.VexusApi.post("/providers/openai/test", {
        apiKey: apiKey
      });
      $("agentCurrentProviderName").textContent = result.message + (result.model ? " · " + result.model : "");
    } finally {
      done();
    }
  }

  async function connectOpenAi() {
    var apiKey = $("openAiApiKeyInput").value.trim();
    if (apiKey.length < 10) {
      throw new Error("Informe uma API key OpenAI valida.");
    }
    var agent = getSelectedAgent();
    var done = window.VexusApi.setButtonBusy($("connectOpenAiBtn"), "Conectando...");
    try {
      await window.VexusApi.post("/providers/connections", {
        apiKey: apiKey,
        isPrimary: true,
        label: agent ? "OpenAI · " + agent.name : "OpenAI Primary",
        mode: "api_key",
        provider: "openai"
      });
      $("openAiApiKeyInput").value = "";
      await loadProviders();
    } finally {
      done();
    }
  }

  function bindUploadArea() {
    var uploadArea = $("uploadArea");
    if (!uploadArea) {
      return;
    }
    var input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json,.json";
    input.style.display = "none";
    uploadArea.parentNode.insertBefore(input, uploadArea.nextSibling);

    input.addEventListener("change", function () {
      if (!input.files || !input.files[0]) {
        return;
      }
      input.files[0].text().then(function (text) {
        return importSessionJson(text);
      }).catch(function (error) {
        $("agentCurrentProviderName").textContent = error.message || "Falha ao importar sessao.";
      }).finally(function () {
        input.value = "";
      });
    });

    uploadArea.addEventListener("click", function () {
      input.click();
    });
    uploadArea.addEventListener("dragover", function (event) {
      event.preventDefault();
    });
    uploadArea.addEventListener("drop", function (event) {
      event.preventDefault();
      var file = event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0];
      if (!file) {
        return;
      }
      file.text().then(function (text) {
        return importSessionJson(text);
      }).catch(function (error) {
        $("agentCurrentProviderName").textContent = error.message || "Falha ao importar sessao.";
      });
    });
  }

  function bindCoreActions() {
    var createButton = replaceNode("createAgentBtn");
    var refreshButton = replaceNode("refreshAgentsBtn");
    var saveButton = replaceNode("goToStep2Btn");
    var generateLinkButton = replaceNode("generateLinkBtn");
    var openOauthButton = replaceNode("openOauthWindowBtn");
    var copyOauthLinkButton = replaceNode("copyOauthLinkBtn");
    var copyOauthRedirectButton = replaceNode("copyOauthRedirectBtn");
    var openOauthAttemptButton = replaceNode("openOauthAttemptBtn");
    var completeManualButton = replaceNode("completeManualCallbackBtn");
    var importSessionButton = replaceNode("importSessionJsonBtn");
    var testOpenAiButton = replaceNode("testOpenAiBtn");
    var connectOpenAiButton = replaceNode("connectOpenAiBtn");

    createButton.addEventListener("click", openCreateModal);
    refreshButton.addEventListener("click", function () {
      loadAgents().then(loadProviders).catch(function (error) {
        $("agentCurrentProviderName").textContent = error.message || "Falha ao atualizar agentes.";
      });
    });
    saveButton.addEventListener("click", function () {
      saveAgent().catch(function (error) {
        $("sumProvider").textContent = error.message || "Falha ao salvar agente.";
      });
    });
    generateLinkButton.addEventListener("click", function () {
      startOauthAttempt(false).catch(function (error) {
        $("agentOauthNotice").textContent = error.message || "Falha ao gerar link OAuth.";
      });
    });
    openOauthButton.addEventListener("click", function () {
      var promise = state.oauthAttempt && state.oauthAttempt.authorizeUrl
        ? Promise.resolve(state.oauthAttempt)
        : startOauthAttempt(false);
      promise.then(function (attempt) {
        window.open(attempt.authorizeUrl, "vexusclaw-oauth", "width=720,height=840");
      }).catch(function (error) {
        $("agentOauthNotice").textContent = error.message || "Falha ao abrir o login OAuth.";
      });
    });
    copyOauthLinkButton.addEventListener("click", function () {
      if (!state.oauthAttempt || !state.oauthAttempt.authorizeUrl) {
        $("attemptStatusLabel").textContent = "Estado atual: gere o link primeiro";
        return;
      }
      navigator.clipboard.writeText(state.oauthAttempt.authorizeUrl).then(function () {
        $("attemptStatusLabel").textContent = "Estado atual: link copiado";
      }).catch(function () {});
    });
    copyOauthRedirectButton.addEventListener("click", function () {
      navigator.clipboard.writeText("http://localhost:1455/auth/callback").then(function () {
        $("attemptStatusLabel").textContent = "Estado atual: redirect copiado";
      }).catch(function () {});
    });
    openOauthAttemptButton.addEventListener("click", function () {
      if (state.oauthAttempt && state.oauthAttempt.authorizeUrl) {
        window.open(state.oauthAttempt.authorizeUrl, "_blank");
      }
    });
    completeManualButton.addEventListener("click", function () {
      completeManualCallback().catch(function (error) {
        $("attemptStatusLabel").textContent = error.message || "Falha ao concluir callback manual.";
      });
    });
    importSessionButton.addEventListener("click", function () {
      importSessionJson($("sessionJsonInput").value.trim()).catch(function (error) {
        $("agentCurrentProviderName").textContent = error.message || "Falha ao importar sessao.";
      });
    });
    testOpenAiButton.addEventListener("click", function () {
      testOpenAi().catch(function (error) {
        $("agentCurrentProviderName").textContent = error.message || "Falha ao testar OpenAI.";
      });
    });
    connectOpenAiButton.addEventListener("click", function () {
      connectOpenAi().catch(function (error) {
        $("agentCurrentProviderName").textContent = error.message || "Falha ao conectar OpenAI.";
      });
    });

    $("skillFilterInput").addEventListener("input", function () {
      renderTools(getSelectedAgent());
    });
    ["newAgentName", "newAgentCallMe", "newAgentDesc", "newAgentInstructions"].forEach(function (id) {
      $(id).addEventListener("input", updateSummary);
    });
    ["newAgentRole", "newAgentStyle"].forEach(function (id) {
      $(id).addEventListener("change", updateSummary);
    });
  }

  document.addEventListener("DOMContentLoaded", async function () {
    var session = await window.VexusAuth.ensureAuthenticated();
    if (!session) {
      return;
    }

    bindCoreActions();
    bindUploadArea();
    updateSummary();

    try {
      await loadAgents();
      await loadProviders();
      setStep2Agent(getSelectedAgent());
    } catch (error) {
      $("agentsList").innerHTML = '<div class="builtin-box">' + escapeHtml(error.message || "Falha ao carregar agentes.") + "</div>";
    }

    window.addEventListener("beforeunload", stopPollingAttempt);
    ["closeModal2", "closeModal2Footer", "backToStep1Btn"].forEach(function (id) {
      var button = $(id);
      if (!button) {
        return;
      }
      button.addEventListener("click", function () {
        if (id !== "backToStep1Btn") {
          stopPollingAttempt();
        }
      });
    });
  });

  window.closeAllAgentModals = closeAllModals;
})();
