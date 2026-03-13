(function () {
  var sessionCache = null;
  var setupCache = null;

  function initials(input) {
    var raw = String(input || "").trim();
    if (!raw) {
      return "V";
    }
    var parts = raw.split(/\s+/).filter(Boolean);
    if (parts.length === 1) {
      return parts[0].slice(0, 1).toUpperCase();
    }
    return (parts[0].slice(0, 1) + parts[1].slice(0, 1)).toUpperCase();
  }

  function applyChrome(session) {
    if (!session || !session.user) {
      return;
    }
    var avatar = initials(session.user.name || session.user.email);
    [
      document.getElementById("tbAvatar"),
      document.getElementById("sbAvatar")
    ].forEach(function (element) {
      if (element) {
        element.textContent = avatar;
      }
    });
    var sbName = document.getElementById("sbName");
    if (sbName) {
      sbName.textContent = session.user.name || session.user.email;
    }
    var sbStatus = document.getElementById("sbStatus");
    if (sbStatus) {
      sbStatus.textContent = session.workspace && session.workspace.onboardingStatus === "completed" ? "online" : "setup";
    }
  }

  function setHealthBadge(status) {
    var healthValue = document.getElementById("tbHealthValue");
    var dot = document.getElementById("tbHealthDot");
    if (!healthValue || !dot) {
      return;
    }
    healthValue.textContent = String(status || "ok").toUpperCase();
    dot.className = "tb-dot " + (status === "down" ? "yellow" : "green");
    healthValue.style.color = status === "down" ? "var(--yellow)" : "var(--green)";
  }

  async function getSession(force) {
    if (!force && sessionCache) {
      return sessionCache;
    }
    try {
      sessionCache = await window.VexusApi.get("/auth/me");
      applyChrome(sessionCache);
      return sessionCache;
    } catch (error) {
      if (error && error.status === 401) {
        sessionCache = null;
        return null;
      }
      throw error;
    }
  }

  async function getSetupStatus(force) {
    if (!force && setupCache) {
      return setupCache;
    }
    setupCache = await window.VexusApi.get("/setup/status");
    return setupCache;
  }

  async function ensureAuthenticated(options) {
    var settings = options || {};
    var session = await getSession(settings.force === true);
    if (!session) {
      window.location.replace("/login");
      return null;
    }
    if (settings.requireSetup !== false) {
      var setup = await getSetupStatus(true);
      if (setup && setup.isBootstrapped && !setup.isReady && window.location.pathname !== "/setup") {
        window.location.replace("/setup");
        return null;
      }
    }
    return session;
  }

  async function redirectAuthenticatedUser(defaultPath) {
    var session = await getSession(true);
    if (!session) {
      return null;
    }
    var setup = await getSetupStatus(true);
    window.location.replace(setup && setup.isBootstrapped && !setup.isReady ? "/setup" : (defaultPath || "/overview"));
    return session;
  }

  async function logout() {
    try {
      await window.VexusApi.post("/auth/logout", {});
    } catch (error) {}
    sessionCache = null;
    setupCache = null;
    window.location.replace("/login");
  }

  window.VexusAuth = {
    applyChrome: applyChrome,
    ensureAuthenticated: ensureAuthenticated,
    getSession: getSession,
    getSetupStatus: getSetupStatus,
    logout: logout,
    redirectAuthenticatedUser: redirectAuthenticatedUser,
    setHealthBadge: setHealthBadge
  };
})();
