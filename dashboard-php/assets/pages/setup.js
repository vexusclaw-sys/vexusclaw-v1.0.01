(function () {
  if (!document.getElementById("setupProviderType")) {
    return;
  }

  function checklistRow(label, value) {
    return '<div class="item"><div class="item-k">' + window.VexusApi.escapeHtml(label) + '</div><div class="item-v">' + window.VexusApi.escapeHtml(value) + "</div></div>";
  }

  function syncProviderVisibility() {
    var providerType = document.getElementById("setupProviderType").value;
    document.getElementById("setupOpenAiWrap").style.display = providerType === "openai" ? "block" : "none";
  }

  async function loadStatus() {
    var status = await window.VexusAuth.getSetupStatus(true);
    var box = document.getElementById("setupStatusBox");
    box.className = "status-box " + (status.isReady ? "ok" : "warn");
    box.textContent = status.isReady
      ? "Setup concluido. Voce pode revisar provider ou atualizar o agente inicial."
      : "Etapa atual: " + status.currentStep + " | provider configurado: " + status.providerConfigured + " | admin configurado: " + status.adminConfigured;
    document.getElementById("setupWorkspaceName").textContent = status.workspaceName || "-";
    document.getElementById("setupWorkspaceSlug").textContent = status.workspaceSlug || "-";
    document.getElementById("setupWorkspaceDomain").textContent = status.domain || "-";
    document.getElementById("setupWorkspaceUrl").textContent = status.publicUrl || "-";
    document.getElementById("setupChecklist").innerHTML = [
      checklistRow("Bootstrapped", String(status.isBootstrapped)),
      checklistRow("Admin", String(status.adminConfigured)),
      checklistRow("Provider", String(status.providerConfigured)),
      checklistRow("Ready", String(status.isReady)),
      checklistRow("Provider Type", status.providerType || "n/a"),
      checklistRow("Admin Email", status.adminEmail || "n/a")
    ].join("");
    return status;
  }

  async function saveProvider() {
    var providerType = document.getElementById("setupProviderType").value;
    var label = document.getElementById("setupProviderLabel").value.trim() || "Primary provider";
    var payload = {
      providerType: providerType,
      label: label
    };
    if (providerType === "openai") {
      payload.mode = "api_key";
      payload.apiKey = document.getElementById("setupOpenAiKey").value.trim();
    } else if (providerType === "chatgpt_oauth") {
      payload.mode = "oauth_stub";
    } else {
      payload.mode = "skip";
    }
    await window.VexusApi.post("/setup/provider", payload);
    await loadStatus();
  }

  async function finalizeSetup() {
    await window.VexusApi.post("/setup/finalize", {
      agentName: document.getElementById("setupAgentName").value.trim(),
      agentRole: document.getElementById("setupAgentRole").value.trim(),
      instructions: document.getElementById("setupAgentInstructions").value.trim(),
      tone: document.getElementById("setupAgentTone").value.trim(),
      provisionWhatsApp: document.getElementById("setupProvisionWhatsapp").checked
    });
    window.location.replace("/overview");
  }

  document.addEventListener("DOMContentLoaded", async function () {
    var session = await window.VexusAuth.ensureAuthenticated({ requireSetup: false });
    if (!session) {
      return;
    }
    document.getElementById("setupProviderType").addEventListener("change", syncProviderVisibility);
    document.getElementById("saveProviderBtn").addEventListener("click", function () {
      saveProvider().catch(function (error) {
        document.getElementById("saveProviderHint").textContent = error.message || "Falha ao salvar provider.";
      });
    });
    document.getElementById("finishSetupBtn").addEventListener("click", function () {
      finalizeSetup().catch(function (error) {
        document.getElementById("finishSetupHint").textContent = error.message || "Falha ao finalizar setup.";
      });
    });
    syncProviderVisibility();
    loadStatus().catch(function () {});
  });
})();
