(function () {
  if (!document.getElementById("sessionsBody")) {
    return;
  }

  var state = {
    items: []
  };

  function renderRows() {
    var tbody = document.getElementById("sessionsBody");
    var rows = state.items.slice();
    var minutes = parseInt(document.getElementById("filterMinutes").value || "0", 10);
    if (minutes > 0) {
      rows = rows.filter(function (item) {
        return Date.now() - new Date(item.updatedAt).getTime() <= minutes * 60 * 1000;
      });
    }
    tbody.innerHTML = rows.map(function (item) {
      var messageCount = item.messageCount || 0;
      var barWidth = Math.min(100, Math.max(4, messageCount * 5));
      return [
        "<tr>",
        '<td class="key-cell"><div class="key-val"><a href="/transcript?id=' + item.id + '" style="color:inherit;text-decoration:none">' + window.VexusApi.escapeHtml(item.id) + "</a></div>" +
          '<div class="key-sub">' + window.VexusApi.escapeHtml(item.externalUserId || item.visitorName || item.channelName || "sem usuario") + "</div></td>",
        '<td class="kind-cell"><span class="kind-badge ' + window.VexusApi.escapeHtml(item.channelType) + '">' + window.VexusApi.escapeHtml(item.channelType) + "</span></td>",
        '<td class="updated-cell">' + window.VexusApi.escapeHtml(window.VexusApi.formatRelativeTime(item.lastMessageAt || item.updatedAt)) + "</td>",
        '<td class="tokens-cell"><div class="token-bar-wrap"><div class="token-bar" style="width:' + barWidth + '%;background:var(--accent)"></div></div><div class="token-val">' + window.VexusApi.escapeHtml(String(messageCount)) + " msgs</div></td>",
        '<td class="sel-cell thinking-cell"><select class="px-select" disabled><option selected>' + window.VexusApi.escapeHtml(item.status) + "</option></select></td>",
        '<td class="del-cell"><a class="del-btn" style="display:inline-block;text-decoration:none" href="/transcript?id=' + item.id + '">Open</a></td>',
        "</tr>"
      ].join("");
    }).join("");
  }

  async function loadSessions() {
    var limit = parseInt(document.getElementById("filterLimit").value || "50", 10);
    var payload = await window.VexusApi.get("/sessions?page=1&pageSize=" + Math.max(1, Math.min(limit, 100)));
    state.items = payload.items || [];
    renderRows();
  }

  window.handleRefresh = function () {
    loadSessions().catch(function () {});
  };
  window.toggleCheck = function (id) {
    var el = document.getElementById(id);
    if (el) {
      el.classList.toggle("checked");
    }
  };

  document.addEventListener("DOMContentLoaded", async function () {
    var session = await window.VexusAuth.ensureAuthenticated();
    if (!session) {
      return;
    }
    var headers = document.querySelectorAll("#sessionsTable th");
    if (headers[3]) {
      headers[3].textContent = "Messages";
    }
    if (headers[4]) {
      headers[4].textContent = "Status";
    }
    if (headers[5]) {
      headers[5].textContent = "Transcript";
    }
    document.getElementById("filterMinutes").addEventListener("input", renderRows);
    document.getElementById("filterLimit").addEventListener("change", loadSessions);
    loadSessions().catch(function () {});
  });
})();
