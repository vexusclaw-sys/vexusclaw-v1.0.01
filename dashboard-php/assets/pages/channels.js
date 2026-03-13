(function () {
  if (!document.getElementById("sc-configured")) {
    return;
  }

  var state = {
    channel: null,
    logs: [],
    pollingTimer: null,
    qrVisible: false
  };

  function escapeHtml(value) {
    return window.VexusApi.escapeHtml(value == null ? "" : value);
  }

  function $(id) {
    return document.getElementById(id);
  }

  function setStatusCell(id, value, tone) {
    var element = $(id);
    if (!element) {
      return;
    }
    element.textContent = value;
    element.className = "status-val " + (tone || "na");
  }

  function appendUiLog(kind, message, timestamp) {
    var logs = $("logArea");
    if (!logs) {
      return;
    }
    var time = timestamp ? new Date(timestamp).toLocaleTimeString("pt-BR") : new Date().toLocaleTimeString("pt-BR");
    var line = document.createElement("div");
    line.className = "log-line";
    line.innerHTML =
      '<span class="log-time">' + escapeHtml(time) + '</span>' +
      '<span class="' + escapeHtml(kind) + '">[' + escapeHtml(kind.replace("log-", "").toUpperCase()) + "]</span>" +
      "<span>" + escapeHtml(message) + "</span>";
    logs.prepend(line);
  }

  function renderLogEntries(logs) {
    var logArea = $("logArea");
    if (!logArea) {
      return;
    }
    if (!logs || !logs.length) {
      logArea.innerHTML = '<div class="log-line"><span class="log-time">--:--:--</span><span class="log-info">[INFO]</span><span>Nenhum evento recente.</span></div>';
      return;
    }
    logArea.innerHTML = logs.map(function (item) {
      var kind = "log-info";
      if (item.type === "connected" || item.type === "outbound_message") {
        kind = "log-ok";
      } else if (item.type === "error" || item.type === "disconnected") {
        kind = "log-err";
      } else if (item.type === "qr_required" || item.type === "reconnecting") {
        kind = "log-warn";
      }
      return [
        '<div class="log-line">',
        '<span class="log-time">' + escapeHtml(new Date(item.createdAt).toLocaleTimeString("pt-BR")) + "</span>",
        '<span class="' + kind + '">[' + escapeHtml(item.type) + "]</span>",
        "<span>" + escapeHtml(item.message) + "</span>",
        "</div>"
      ].join("");
    }).join("");
  }

  function setHeroPills(channel) {
    var wrap = document.querySelector(".wa-hero-pills");
    if (!wrap || !channel) {
      return;
    }

    var pills = [
      {
        className: channel.status === "connected" ? "pill connected" : channel.status === "qr_required" ? "pill warn" : "pill err",
        text: channel.status === "connected" ? "Conectado" : channel.status === "qr_required" ? "QR requerido" : channel.status
      },
      {
        className: "pill connected",
        text: "Updated · " + window.VexusApi.formatRelativeTime(channel.updatedAt)
      },
      {
        className: channel.lastError ? "pill err" : "pill warn",
        text: channel.lastError ? "Erro ativo" : channel.name
      },
      {
        className: "pill connected",
        text: "Primary: " + (channel.isPrimary ? "yes" : "no")
      },
      {
        className: channel.qrCodeData ? "pill warn" : "pill connected",
        text: channel.qrCodeData ? "QR pronto" : "Sem QR"
      }
    ];

    wrap.innerHTML = pills.map(function (pill) {
      return '<div class="' + pill.className + '"><div class="pill-dot' + (pill.className.indexOf("connected") !== -1 ? " blink" : "") + '"></div>' + escapeHtml(pill.text) + "</div>";
    }).join("");
  }

  function drawQr(qrCodeData) {
    var canvas = $("qrCanvas");
    if (!canvas) {
      return;
    }
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!qrCodeData) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#111111";
      ctx.font = "12px monospace";
      ctx.fillText("QR pendente", 22, canvas.height / 2);
      return;
    }
    var image = new Image();
    image.onload = function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
    image.src = qrCodeData;
  }

  function renderSummaryFromSessionState(channel) {
    var sessionState = channel && channel.sessionState ? channel.sessionState : {};
    $("sumGroupPolicy").textContent = sessionState.groupPolicy || "allowlist";
    $("sumDmPolicy").textContent = sessionState.dmPolicy || "open";
    $("sumMediaMb").textContent = sessionState.mediaMaxMb != null ? String(sessionState.mediaMaxMb) : "50";
  }

  function renderStatus(channel) {
    state.channel = channel;
    setHeroPills(channel);
    renderSummaryFromSessionState(channel);
    window.VexusAuth.setHealthBadge(channel.status === "error" ? "down" : "ok");

    setStatusCell("sc-configured", channel ? "Yes" : "No", channel ? "yes" : "no");
    setStatusCell("sc-linked", channel && (channel.status === "connected" || channel.status === "qr_required" || channel.status === "connecting") ? "Yes" : "No", channel && (channel.status === "connected" || channel.status === "qr_required" || channel.status === "connecting") ? "yes" : "no");
    setStatusCell("sc-running", channel && channel.status !== "disconnected" ? "Yes" : "No", channel && channel.status !== "disconnected" ? "yes" : "no");
    setStatusCell("sc-connected", channel && channel.status === "connected" ? "Yes" : "No", channel && channel.status === "connected" ? "yes" : "no");
    setStatusCell("sc-lastconn", channel && channel.lastConnectedAt ? window.VexusApi.formatRelativeTime(channel.lastConnectedAt) : "n/a", channel && channel.lastConnectedAt ? "ago" : "na");
    setStatusCell("sc-lastmsg", channel && channel.lastActivityAt ? window.VexusApi.formatRelativeTime(channel.lastActivityAt) : "n/a", channel && channel.lastActivityAt ? "ago" : "na");
    setStatusCell("sc-authage", channel && channel.updatedAt ? window.VexusApi.formatRelativeTime(channel.updatedAt) : "n/a", channel ? "ago" : "na");
    setStatusCell("sc-uptime", channel && channel.lastConnectedAt ? window.VexusApi.formatRelativeTime(channel.lastConnectedAt) : "n/a", channel && channel.lastConnectedAt ? "ago" : "na");

    $("statusLiveBadge").style.display = channel && channel.status === "connected" ? "inline-flex" : "none";
    if (channel && channel.lastError) {
      appendUiLog("log-err", channel.lastError, channel.updatedAt);
    }

    state.logs = (channel && channel.recentLogs) || [];
    renderLogEntries(state.logs);

    if (state.qrVisible) {
      drawQr(channel.qrCodeData);
      if (channel.qrExpiresAt) {
        $("qrCountdown").textContent = window.VexusApi.formatRelativeTime(channel.qrExpiresAt);
        $("qrTimer").style.display = new Date(channel.qrExpiresAt).getTime() <= Date.now() ? "block" : "none";
      } else {
        $("qrCountdown").textContent = "n/a";
        $("qrTimer").style.display = "none";
      }
    }
  }

  function disableAdvancedConfig() {
    var configCard = document.querySelector(".page-body > .card");
    if (!configCard) {
      return;
    }
    configCard.querySelectorAll("input, textarea, select").forEach(function (element) {
      element.setAttribute("readonly", "readonly");
      element.setAttribute("disabled", "disabled");
      element.title = "Este bloco ainda esta em modo leitura na dashboard PHP.";
    });
    configCard.querySelectorAll(".toggle-switch, .tab-opt, .acc-plus, .item-del, .stepper-btn").forEach(function (element) {
      element.style.pointerEvents = "none";
      element.style.opacity = "0.55";
      element.title = "Este bloco ainda esta em modo leitura na dashboard PHP.";
    });
    $("lastSaved").textContent = "modo leitura";
  }

  async function ensureChannel() {
    var payload = await window.VexusApi.get("/channels");
    var items = (payload && payload.items) || [];
    var channel = items.find(function (item) {
      return item.type === "whatsapp";
    }) || null;

    if (channel) {
      return channel;
    }

    appendUiLog("log-info", "Nenhum canal WhatsApp encontrado. Provisionando canal principal...");
    return window.VexusApi.post("/channels/whatsapp", {
      name: "VEXUSCLAW WhatsApp"
    });
  }

  async function loadConnection() {
    var channel = await ensureChannel();
    var details = await window.VexusApi.get("/channels/" + channel.id);
    renderStatus(details);
    return details;
  }

  async function loadQr(forceOpen) {
    if (!state.channel) {
      await loadConnection();
    }
    if (!state.channel) {
      return;
    }
    var qr = await window.VexusApi.get("/channels/" + state.channel.id + "/qr");
    state.qrVisible = forceOpen === true ? true : state.qrVisible;
    if (forceOpen === true) {
      $("qrPanel").classList.add("show");
      $("qrBtn").textContent = "Hide QR";
    }
    drawQr(qr.qrCodeData);
    $("qrCountdown").textContent = qr.qrExpiresAt ? window.VexusApi.formatRelativeTime(qr.qrExpiresAt) : "n/a";
    $("qrTimer").style.display = qr.qrExpiresAt && new Date(qr.qrExpiresAt).getTime() <= Date.now() ? "block" : "none";
    if (Array.isArray(qr.recentLogs)) {
      state.logs = qr.recentLogs;
      renderLogEntries(state.logs);
    }
  }

  function stopPolling() {
    if (state.pollingTimer) {
      clearInterval(state.pollingTimer);
      state.pollingTimer = null;
    }
  }

  function startPolling() {
    stopPolling();
    state.pollingTimer = setInterval(function () {
      loadConnection().then(function (channel) {
        if (state.qrVisible && channel.status === "qr_required") {
          return loadQr(false);
        }
        return null;
      }).catch(function () {});
    }, 12000);
  }

  async function reconnectChannel() {
    if (!state.channel) {
      await loadConnection();
    }
    var response = await window.VexusApi.post("/channels/" + state.channel.id + "/reconnect", {});
    renderStatus(response);
    appendUiLog("log-warn", "Reconexao solicitada manualmente.", response.updatedAt);
    if (response.status === "qr_required") {
      await loadQr(true);
    }
  }

  async function resetChannel() {
    if (!state.channel) {
      return;
    }
    var response = await window.VexusApi.post("/channels/" + state.channel.id + "/reset", {});
    renderStatus(response);
    appendUiLog("log-err", "Sessao WhatsApp resetada manualmente.", response.updatedAt);
    $("qrPanel").classList.remove("show");
    $("qrBtn").textContent = "Show QR";
    state.qrVisible = false;
  }

  function bindLegacyActions() {
    window.toggleQR = function () {
      state.qrVisible = !state.qrVisible;
      $("qrPanel").classList.toggle("show", state.qrVisible);
      $("qrBtn").textContent = state.qrVisible ? "Hide QR" : "Show QR";
      if (state.qrVisible) {
        loadQr(false).catch(function (error) {
          appendUiLog("log-err", error.message || "Falha ao carregar QR.");
        });
      }
    };

    window.doRelink = function () {
      reconnectChannel().catch(function (error) {
        appendUiLog("log-err", error.message || "Falha ao relinkar canal.");
      });
    };

    window.waitScan = function () {
      state.qrVisible = true;
      $("qrPanel").classList.add("show");
      $("qrBtn").textContent = "Hide QR";
      loadQr(true).catch(function (error) {
        appendUiLog("log-err", error.message || "Falha ao aguardar scan.");
      });
    };

    window.doLogout = function () {
      resetChannel().catch(function (error) {
        appendUiLog("log-err", error.message || "Falha ao resetar canal.");
      });
    };

    window.doRefresh = function () {
      loadConnection().catch(function (error) {
        appendUiLog("log-err", error.message || "Falha ao atualizar canal.");
      });
    };

    window.regenerateQR = function () {
      state.qrVisible = true;
      $("qrPanel").classList.add("show");
      $("qrBtn").textContent = "Hide QR";
      loadQr(true).catch(function (error) {
        appendUiLog("log-err", error.message || "Falha ao regenerar QR.");
      });
    };

    window.clearLog = function () {
      state.logs = [];
      renderLogEntries([]);
    };

    window.saveConfig = function () {
      appendUiLog("log-warn", "Configuracao avancada ainda esta em modo leitura nesta dashboard PHP.");
      $("lastSaved").textContent = "somente leitura";
    };

    window.reloadConfig = function () {
      disableAdvancedConfig();
      loadConnection().then(function () {
        $("lastSaved").textContent = "recarregado";
      }).catch(function (error) {
        appendUiLog("log-err", error.message || "Falha ao recarregar configuracao.");
      });
    };
  }

  document.addEventListener("DOMContentLoaded", async function () {
    var session = await window.VexusAuth.ensureAuthenticated();
    if (!session) {
      return;
    }

    bindLegacyActions();
    disableAdvancedConfig();

    try {
      await loadConnection();
      startPolling();
    } catch (error) {
      appendUiLog("log-err", error.message || "Falha ao carregar canal WhatsApp.");
    }

    window.addEventListener("beforeunload", stopPolling);
  });
})();
