(function () {
  if (!document.getElementById("logList")) {
    return;
  }

  var state = {
    rows: []
  };

  function normalizeLevel(item) {
    if (item.type === "error") {
      return "ERROR";
    }
    if (item.type === "qr_required" || item.type === "reconnecting") {
      return "WARN";
    }
    return "INFO";
  }

  function applyFilters() {
    var q = (document.getElementById("q").value || "").toLowerCase().trim();
    var lvl = document.getElementById("lvl").value || "";
    var src = (document.getElementById("src").value || "").toLowerCase().trim();
    var total = 0;
    var info = 0;
    var warn = 0;
    var error = 0;
    state.rows.forEach(function (row) {
      var ok = (!q || row.search.indexOf(q) !== -1) && (!lvl || row.level === lvl) && (!src || row.source.indexOf(src) !== -1);
      row.element.style.display = ok ? "grid" : "none";
      if (ok) {
        total += 1;
        if (row.level === "INFO") { info += 1; }
        if (row.level === "WARN") { warn += 1; }
        if (row.level === "ERROR") { error += 1; }
      }
    });
    document.getElementById("stat-total").textContent = String(total);
    document.getElementById("stat-info").textContent = String(info);
    document.getElementById("stat-warn").textContent = String(warn);
    document.getElementById("stat-error").textContent = String(error);
    document.getElementById("empty").style.display = total ? "none" : "block";
  }

  async function loadLogs() {
    var payload = await window.VexusApi.get("/logs/channels?page=1&pageSize=100");
    var container = document.getElementById("logList");
    state.rows = (payload.items || []).map(function (item) {
      var level = normalizeLevel(item);
      var source = ((item.channelType || "channel") + "." + (item.channelName || item.channelConnectionId)).toLowerCase();
      var search = (item.createdAt + " " + level + " " + source + " " + item.message).toLowerCase();
      var element = document.createElement("article");
      element.className = "log-row";
      element.innerHTML =
        '<div class="log-ts">' + window.VexusApi.escapeHtml(window.VexusApi.formatDateTime(item.createdAt)) + '</div>' +
        '<div><span class="log-lvl lvl-' + level.toLowerCase() + '">' + level + "</span></div>" +
        '<div class="log-src">' + window.VexusApi.escapeHtml(source) + "</div>" +
        '<div class="log-msg">' + window.VexusApi.escapeHtml(item.message) + "</div>";
      container.appendChild(element);
      return {
        element: element,
        level: level,
        search: search,
        source: source
      };
    });
    applyFilters();
  }

  document.addEventListener("DOMContentLoaded", async function () {
    var session = await window.VexusAuth.ensureAuthenticated();
    if (!session) {
      return;
    }
    document.getElementById("logList").innerHTML = "";
    ["q", "lvl", "src"].forEach(function (id) {
      var input = document.getElementById(id);
      input.addEventListener("input", applyFilters);
      input.addEventListener("change", applyFilters);
    });
    loadLogs().catch(function () {});
  });
})();
