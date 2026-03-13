(function () {
  if (!document.getElementById("settingsWorkspaceName")) {
    return;
  }

  var state = {
    oauthAttempt: null,
    settings: null
  };

  function providerBadgeClass(status, provider) {
    if (provider === "mock") {
      return "badge mock";
    }
    if (status === "connected") {
      return "badge connected";
    }
    if (status === "error") {
      return "badge error";
    }
    return "badge pending";
  }

  function renderProviders() {
    var container = document.getElementById("settingsProviderList");
    var providers = state.settings ? state.settings.providers || [] : [];
    container.innerHTML = providers.length ? providers.map(function (provider) {
      return [
        '<div class="provider-item">',
        '<div class="provider-top"><div><div class="provider-name">' + window.VexusApi.escapeHtml(provider.label) + '</div><div class="provider-meta">' +
          window.VexusApi.escapeHtml(provider.provider + " · " + provider.mode + " · updated " + window.VexusApi.formatDateTime(provider.updatedAt)) +
          (provider.secretHint ? "<br>hint: " + window.VexusApi.escapeHtml(provider.secretHint) : "") +
          (provider.lastError ? "<br>error: " + window.VexusApi.escapeHtml(provider.lastError) : "") +
          '</div></div><span class="' + providerBadgeClass(provider.status, provider.provider) + '">' + window.VexusApi.escapeHtml(provider.status) + (provider.isPrimary ? " · primary" : "") + "</span></div>",
        '<div class="btn-row" style="margin-top:10px">' +
          (provider.isPrimary ? "" : '<button class="btn btn-green" data-primary="' + provider.id + '" type="button">Tornar primario</button>') +
          '<button class="btn btn-danger" data-delete="' + provider.id + '" type="button">Remover</button>' +
        "</div>",
        "</div>"
      ].join("");
    }).join("") : '<div class="status-box">Nenhum provider conectado ainda.</div>';

    container.querySelectorAll("[data-primary]").forEach(function (button) {
      button.addEventListener("click", async function () {
        await window.VexusApi.patch("/providers/connections/" + button.dataset.primary + "/primary", {});
        await loadSettings();
      });
    });
    container.querySelectorAll("[data-delete]").forEach(function (button) {
      button.addEventListener("click", async function () {
        await window.VexusApi.delete("/providers/connections/" + button.dataset.delete);
        await loadSettings();
      });
    });
  }

  async function loadSettings() {
    state.settings = await window.VexusApi.get("/settings");
    document.getElementById("settingsWorkspaceName").value = state.settings.workspace.name || "";
    document.getElementById("settingsWorkspaceSlug").value = state.settings.workspace.slug || "";
    document.getElementById("settingsWorkspaceDomain").value = state.settings.workspace.domain || "";
    document.getElementById("settingsWorkspaceUrl").value = state.settings.workspace.publicUrl || "";
    document.getElementById("settingsStatusBox").className = "status-box " + (state.settings.setup.isReady ? "ok" : "");
    document.getElementById("settingsStatusBox").textContent = "Workspace " + state.settings.workspace.name + " · onboarding " + state.settings.workspace.onboardingStatus;
    renderProviders();
  }

  async function connectOpenAi() {
    var apiKey = document.getElementById("settingsOpenAiKey").value.trim();
    await window.VexusApi.post("/providers/connections", {
      apiKey: apiKey,
      isPrimary: true,
      label: document.getElementById("settingsOpenAiLabel").value.trim() || "OpenAI Primary",
      mode: "api_key",
      provider: "openai"
    });
    document.getElementById("settingsOpenAiKey").value = "";
    await loadSettings();
  }

  async function startOauth() {
    state.oauthAttempt = await window.VexusApi.post("/providers/chatgpt/oauth/start", {
      label: "ChatGPT OAuth",
      makePrimary: true,
      returnToPath: "/settings"
    });
    document.getElementById("settingsOauthBox").textContent =
      "Attempt " + state.oauthAttempt.attemptId + " · expira em " + state.oauthAttempt.expiresAt;
    window.open(state.oauthAttempt.authorizeUrl, "vexusclaw-oauth", "width=640,height=760");
  }

  async function importSession() {
    await window.VexusApi.post("/providers/chatgpt/import-session", {
      authJson: document.getElementById("settingsSessionJson").value,
      label: "Imported ChatGPT Session",
      makePrimary: true
    });
    document.getElementById("settingsSessionJson").value = "";
    await loadSettings();
  }

  document.addEventListener("DOMContentLoaded", async function () {
    var session = await window.VexusAuth.ensureAuthenticated({ requireSetup: false });
    if (!session) {
      return;
    }
    document.getElementById("saveWorkspaceBtn").addEventListener("click", function () {
      window.VexusApi.patch("/settings", {
        workspaceName: document.getElementById("settingsWorkspaceName").value.trim()
      }).then(loadSettings).catch(function (error) {
        document.getElementById("saveWorkspaceHint").textContent = error.message || "Falha ao salvar workspace.";
      });
    });
    document.getElementById("settingsTestOpenAiBtn").addEventListener("click", function () {
      window.VexusApi.post("/providers/openai/test", {
        apiKey: document.getElementById("settingsOpenAiKey").value.trim()
      }).then(function (result) {
        document.getElementById("settingsStatusBox").textContent = result.message;
      }).catch(function (error) {
        document.getElementById("settingsStatusBox").textContent = error.message || "Falha ao testar API key.";
      });
    });
    document.getElementById("settingsConnectOpenAiBtn").addEventListener("click", function () {
      connectOpenAi().catch(function (error) {
        document.getElementById("settingsStatusBox").textContent = error.message || "Falha ao conectar OpenAI.";
      });
    });
    document.getElementById("settingsStartOauthBtn").addEventListener("click", function () {
      startOauth().catch(function (error) {
        document.getElementById("settingsOauthBox").textContent = error.message || "Falha ao iniciar OAuth.";
      });
    });
    document.getElementById("settingsImportSessionBtn").addEventListener("click", function () {
      importSession().catch(function (error) {
        document.getElementById("settingsOauthBox").textContent = error.message || "Falha ao importar sessao.";
      });
    });
    loadSettings().catch(function () {});
  });
})();
