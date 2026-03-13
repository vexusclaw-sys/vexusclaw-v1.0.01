(function () {
  if (!document.getElementById("panelLogin")) {
    return;
  }

  function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
  }

  function showError(inputId, errorId, message) {
    var input = document.getElementById(inputId);
    var error = document.getElementById(errorId);
    if (input) {
      input.classList.add("error");
    }
    if (error) {
      error.textContent = message;
      error.classList.add("show");
    }
  }

  function clearError(inputId, errorId) {
    var input = document.getElementById(inputId);
    var error = document.getElementById(errorId);
    if (input) {
      input.classList.remove("error");
    }
    if (error) {
      error.classList.remove("show");
    }
  }

  function setSetupMode(setup) {
    var loginSwitch = document.querySelector("#panelLogin .auth-switch");
    var registerTitle = document.querySelector("#panelRegister .auth-title");
    var registerDesc = document.querySelector("#panelRegister .auth-desc");
    if (registerTitle) {
      registerTitle.textContent = setup && setup.isBootstrapped ? "Completar acesso admin" : "Criar workspace";
    }
    if (registerDesc) {
      registerDesc.textContent = setup && setup.isBootstrapped
        ? "Finalize o owner inicial da VEXUSCLAW"
        : "Bootstrap inicial do Mission Control";
    }
    if (loginSwitch && setup && setup.isReady) {
      loginSwitch.style.display = "";
    }
  }

  window.handleLogin = async function () {
    var email = document.getElementById("loginEmail").value.trim();
    var password = document.getElementById("loginPw").value;
    clearError("loginEmail", "loginEmailErr");
    clearError("loginPw", "loginPwErr");

    if (!isEmail(email)) {
      showError("loginEmail", "loginEmailErr", "Email invalido!");
      return;
    }
    if (!password) {
      showError("loginPw", "loginPwErr", "Digite sua senha!");
      return;
    }

    var done = window.VexusApi.setButtonBusy(document.getElementById("btnLogin"), "Entrando...");
    try {
      await window.VexusApi.post("/auth/login", {
        email: email,
        password: password
      });
      var setup = await window.VexusAuth.getSetupStatus(true);
      window.location.replace(setup && setup.isBootstrapped && !setup.isReady ? "/setup" : "/overview");
    } catch (error) {
      showError("loginPw", "loginPwErr", error.message || "Falha no login.");
      done();
    }
  };

  window.handleRegister = async function () {
    var workspaceName = document.getElementById("regWorkspaceName").value.trim();
    var adminName = document.getElementById("regAdminName").value.trim();
    var email = document.getElementById("regEmail").value.trim();
    var password = document.getElementById("regPw").value;
    clearError("regEmail", "regEmailErr");
    clearError("regPw", "regPwErr");

    if (workspaceName.length < 2) {
      showError("regWorkspaceName", "regEmailErr", "Informe o nome do workspace.");
      return;
    }
    if (adminName.length < 2) {
      showError("regAdminName", "regEmailErr", "Informe o nome do admin.");
      return;
    }
    if (!isEmail(email)) {
      showError("regEmail", "regEmailErr", "Email invalido!");
      return;
    }
    if (password.length < 12) {
      showError("regPw", "regPwErr", "Minimo 12 caracteres!");
      return;
    }

    var done = window.VexusApi.setButtonBusy(document.getElementById("btnRegister"), "Criando...");
    try {
      await window.VexusApi.post("/setup/bootstrap", {
        workspaceName: workspaceName,
        domain: window.location.hostname
      });
      await window.VexusApi.post("/setup/admin", {
        email: email,
        name: adminName,
        password: password
      });
      window.location.replace("/setup");
    } catch (error) {
      showError("regPw", "regPwErr", error.message || "Falha ao criar workspace.");
      done();
    }
  };

  window.handleForgot = function () {
    window.switchTo && window.switchTo("success");
    var successTitle = document.querySelector("#panelSuccess .auth-title");
    var successDesc = document.querySelector("#panelSuccess .auth-desc");
    if (successTitle) {
      successTitle.textContent = "Fluxo manual";
    }
    if (successDesc) {
      successDesc.textContent = "Use o owner inicial ou redefina a senha pelo backend.";
    }
  };

  window.handleGoogle = function () {
    window.alert("O login Google nao esta habilitado nesta stack. Use a autenticacao real da VEXUSCLAW.");
  };

  document.addEventListener("DOMContentLoaded", async function () {
    try {
      var session = await window.VexusAuth.getSession();
      if (session) {
        await window.VexusAuth.redirectAuthenticatedUser("/overview");
        return;
      }
      var setup = await window.VexusAuth.getSetupStatus(true);
      setSetupMode(setup);
    } catch (error) {
      setSetupMode(null);
    }
  });
})();
