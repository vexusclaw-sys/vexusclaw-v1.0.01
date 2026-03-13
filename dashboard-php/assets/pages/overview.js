(function () {
  if (!document.getElementById("ovGatewayUrl")) {
    return;
  }

  function statusText(status) {
    return String(status || "ok").toUpperCase();
  }

  async function loadOverview() {
    var overview = await window.VexusApi.get("/overview");
    window.VexusAuth.setHealthBadge(overview.systemStatus);

    document.getElementById("ovGatewayUrl").value = window.location.origin + "/api";
    document.getElementById("ovGatewayToken").value = "cookie-session";
    document.getElementById("ovGatewayPassword").value = "managed-by-auth";
    document.getElementById("ovSessionKey").value = overview.onboarding.workspaceSlug || "workspace";
    document.getElementById("ovSystemStatus").textContent = statusText(overview.systemStatus);
    document.getElementById("ovLastActivity").textContent = window.VexusApi.formatRelativeTime(overview.whatsapp.lastActivityAt);
    document.getElementById("ovTick").textContent = overview.health.checks.length + " checks";
    document.getElementById("ovLastUpdated").textContent = window.VexusApi.formatDateTime(overview.health.timestamp);
    document.getElementById("ovSnapshotTip").textContent = overview.whatsapp.lastError
      ? overview.whatsapp.lastError
      : "Public URL: " + (overview.instance.publicUrl || "n/a");
    document.getElementById("ovInstancesCount").textContent = "1";
    document.getElementById("ovInstancesDesc").textContent = overview.instance.hostname || "instancia central";
    document.getElementById("ovSessionsCount").textContent = String(overview.totals.sessions);
    document.getElementById("ovSessionsDesc").textContent = "Agentes: " + overview.totals.agents + " | Canais: " + overview.totals.channels;
    document.getElementById("ovCronStatus").textContent = overview.provider.connected ? "Provider OK" : "Provider pendente";
    document.getElementById("ovCronStatus").style.color = overview.provider.connected ? "var(--green)" : "var(--yellow)";
    document.getElementById("ovCronDesc").textContent = overview.provider.label || "Configure um provider em Settings";
    var version = document.getElementById("tbVersionValue");
    if (version) {
      version.textContent = overview.health.version;
    }
  }

  document.addEventListener("DOMContentLoaded", async function () {
    var session = await window.VexusAuth.ensureAuthenticated();
    if (!session) {
      return;
    }
    document.getElementById("ovConnectBtn").addEventListener("click", function () {
      window.location.href = "/settings";
    });
    document.getElementById("ovRefreshBtn").addEventListener("click", function () {
      loadOverview().catch(function (error) {
        document.getElementById("ovConnectHint").textContent = error.message || "Falha ao atualizar overview.";
      });
    });
    loadOverview().catch(function (error) {
      document.getElementById("ovConnectHint").textContent = error.message || "Falha ao carregar overview.";
    });
  });
})();
