(function () {
  if (!document.getElementById("transcriptMessages")) {
    return;
  }

  function summaryRow(label, value) {
    return '<div class="meta-item"><div class="meta-k">' + window.VexusApi.escapeHtml(label) + '</div><div class="meta-v">' + window.VexusApi.escapeHtml(value || "n/a") + "</div></div>";
  }

  function messageMarkup(message) {
    return [
      '<div class="msg">',
      '<div class="msg-role ' + window.VexusApi.escapeHtml(message.role) + '">' + window.VexusApi.escapeHtml(message.role) + " · " + window.VexusApi.escapeHtml(window.VexusApi.formatDateTime(message.createdAt)) + "</div>",
      '<div class="msg-body">' + window.VexusApi.escapeHtml(message.content || "") + "</div>",
      "</div>"
    ].join("");
  }

  async function loadTranscript() {
    var id = new URLSearchParams(window.location.search).get("id");
    if (!id) {
      document.getElementById("transcriptMessages").innerHTML = '<div class="empty">Sessao nao informada.</div>';
      return;
    }
    var details = await window.VexusApi.get("/sessions/" + encodeURIComponent(id));
    document.getElementById("transcriptTitle").textContent = "Transcript · " + id;
    document.getElementById("transcriptMeta").textContent = details.agentName + " · " + details.channelName + " · " + details.status;
    document.getElementById("transcriptMessages").innerHTML = (details.messages || []).length
      ? details.messages.map(messageMarkup).join("")
      : '<div class="empty">Nenhuma mensagem persistida para esta sessao.</div>';
    document.getElementById("transcriptSummary").innerHTML = [
      summaryRow("Agent", details.agentName),
      summaryRow("Channel", details.channelName + " (" + details.channelType + ")"),
      summaryRow("Visitor", details.externalUserId || details.visitorName || "n/a"),
      summaryRow("Started", window.VexusApi.formatDateTime(details.startedAt)),
      summaryRow("Updated", window.VexusApi.formatDateTime(details.updatedAt)),
      summaryRow("Messages", String((details.messages || []).length))
    ].join("");
  }

  document.addEventListener("DOMContentLoaded", async function () {
    var session = await window.VexusAuth.ensureAuthenticated();
    if (!session) {
      return;
    }
    document.getElementById("transcriptRefreshBtn").addEventListener("click", function () {
      loadTranscript().catch(function () {});
    });
    loadTranscript().catch(function () {});
  });
})();
