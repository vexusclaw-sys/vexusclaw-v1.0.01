(function () {
  const currentFile = ((window.location.pathname.split("/").pop() || "index.php") + "")
    .toLowerCase();
  const storageKey = "vexus-language";
  const textOriginals = new WeakMap();
  const attrOriginals = new WeakMap();
  const observed = new WeakSet();
  const autoTranslationCacheKey = "vexus-language-auto-cache-v1";
  const autoTranslationCache = loadAutoTranslationCache();
  const autoTranslationPending = new Map();
  let autoTranslationSaveTimer = 0;

  const exactTranslations = buildMap({
    "VexusClaw — Assistente Pessoal de IA": "VexusClaw — Personal AI Assistant",
    "VexusClaw — Recuperar Senha": "VexusClaw — Recover Password",
    "VexusClaw — Instâncias": "VexusClaw — Instances",
    "VexusClaw — Sessões": "VexusClaw — Sessions",
    "VexusClaw — Uso": "VexusClaw — Usage",
    "VexusClaw — Tarefas Cron": "VexusClaw — Cron Jobs",
    "VexusClaw — Integrações": "VexusClaw — Integrations",
    "VexusClaw x VirusTotal — Segurança para o ClawHub":
      "VexusClaw x VirusTotal — Security for ClawHub",
    "Versão": "Version",
    "Saúde": "Health",
    "Update disponível:": "Update available:",
    "Atualizar agora ▶": "Update now ▶",
    "Atualizar ▶": "Update ▶",
    "Controle": "Control",
    "Visão Geral": "Overview",
    "Canais": "Channels",
    "Canais · WhatsApp": "Channels · WhatsApp",
    "Instâncias": "Instances",
    "Sessões": "Sessions",
    "Uso": "Usage",
    "Tarefas Cron": "Cron Jobs",
    "Agente": "Agent",
    "Agentes": "Agents",
    "Habilidades": "Skills",
    "Nós": "Nodes",
    "Configurações": "Settings",
    "Config": "Config",
    "Docs": "Docs",
    "Início": "Home",
    "Integrações": "Integrations",
    "Começar": "Get Started",
    "Começar Agora": "Get Started Now",
    "Voltar ao login": "Back to login",
    "Esqueceu a Senha?": "Forgot Password?",
    "E-mail da conta": "Account email",
    "Enviar Código": "Send Code",
    "Lembrou a senha?": "Remembered your password?",
    "Entrar ▶": "Sign in ▶",
    "Código Enviado!": "Code Sent!",
    "Código de 6 dígitos": "6-digit code",
    "Verificar Código": "Verify Code",
    "Trocar e-mail": "Change email",
    "Nova Senha": "New Password",
    "Nova senha": "New password",
    "Confirmar senha": "Confirm password",
    "Redefinir Senha": "Reset Password",
    "Senha Redefinida!": "Password Reset!",
    "Ir para o Login": "Go to Login",
    "Termos de Serviço": "Terms of Service",
    "Política de Privacidade": "Privacy Policy",
    "e": "and",
    "Sessão de chat direta com o gateway para intervenções rápidas.":
      "Direct chat session with the gateway for quick interventions.",
    "Canal de mensagens · Configuração e status de conexão":
      "Messaging channel · Connection settings and status",
    "Status da Conexão": "Connection Status",
    "Estado atual do cliente WhatsApp Web.":
      "Current status of the WhatsApp Web client.",
    "Log de Atividade": "Activity Log",
    "Eventos recentes desta sessão WhatsApp.":
      "Recent events for this WhatsApp session.",
    "Configuração do Canal": "Channel Settings",
    "Salve e recarregue para aplicar alterações ao runtime.":
      "Save and reload to apply changes to runtime.",
    "Nenhuma entrada customizada.": "No custom entry.",
    "Padrões permitidos. Use * para todos.":
      "Allowed patterns. Use * for all.",
    "Enviar reação ao receber DMs.":
      "Send a reaction when receiving DMs.",
    "Criar e responder enquetes.": "Create and answer polls.",
    "Reagir com emojis às mensagens.": "React to messages with emojis.",
    "Permitir que o agente envie mensagens proativamente.":
      "Allow the agent to send proactive messages.",
    "Nenhuma capability. Clique em Add para criar.":
      "No capability. Click Add to create one.",
    'Controle de acesso DMs. "pairing" recomendado. "open" exige allowFrom=["*"].':
      'DM access control. "pairing" is recommended. "open" requires allowFrom=["*"].',
    "Habilitar processamento de DMs.": "Enable DM processing.",
    "Nenhum item.": "No item.",
    "Processar mensagens de grupos.": "Process group messages.",
    "Enviar pings periódicos para manter a conexão ativa.":
      "Send periodic pings to keep the connection active.",
    "Converter markdown em formatação WhatsApp (*bold*, _italic_).":
      "Convert markdown to WhatsApp formatting (*bold*, _italic_).",
    "Configuração no mesmo telefone (bot usa seu número pessoal).":
      "Same-phone setup (bot uses your personal number).",
    "Enviar confirmação de leitura (✓✓) ao processar mensagens.":
      "Send read receipts (✓✓) while processing messages.",
    "Última atualização:": "Last update:",
    "nunca": "never",
    "Agendar tarefas recorrentes para agentes do gateway.":
      "Schedule recurring tasks for gateway agents.",
    "Próximo:": "Next:",
    "calculando...": "calculating...",
    "Novo Job": "New Job",
    "Nome *": "Name *",
    "Descrição": "Description",
    "Habilitado": "Enabled",
    "Ativar execução desta tarefa.": "Enable this task.",
    "Prompt da Tarefa *": "Task Prompt *",
    "Adicionar Job": "Add Job",
    "Cancelar": "Cancel",
    "* obrigatório": "* required",
    "Jobs Agendados": "Scheduled Jobs",
    'Clique em "Novo Job" para criar uma tarefa cron.':
      'Click "New Job" to create a cron task.',
    "Conectado": "Connected",
    "Ao vivo": "Live",
    "Escaneie com": "Scan with",
    "no seu telefone.": "on your phone.",
    "Válido por": "Valid for",
    "Regenerar QR": "Regenerate QR",
    "Limpar": "Clear",
    "Salvar": "Save",
    "Recarregar": "Reload",
    "Mínimo de 8 caracteres!": "Minimum 8 characters!",
    "As senhas não coincidem!": "Passwords do not match!",
    "E-mail inválido. Tente novamente!": "Invalid email. Try again!",
    "Código inválido. Tente novamente!": "Invalid code. Try again!",
    "Não recebeu?": "Didn't receive it?",
    "Reenviar ▶": "Resend ▶",
    "para expirar": "until it expires",
    "Verifique sua caixa de entrada em": "Check your inbox at",
    "Sem pânico. Digite seu e-mail e enviaremos um código de recuperação.":
      "No panic. Enter your email and we will send a recovery code.",
    "Usaremos este e-mail para enviar o código de 6 dígitos.":
      "We will use this email to send the 6-digit code.",
    "Escolha uma senha forte para proteger sua conta.":
      "Choose a strong password to protect your account.",
    "Sua senha foi atualizada com sucesso. Agora você pode entrar com a nova senha.":
      "Your password has been updated successfully. You can now sign in with the new password.",
    "Configuracoes": "Settings",
    "Documentacao API": "API Documentation",
    "Fluxo de eventos de gateway, ferramentas, sessoes e canais.": "Gateway, tools, sessions and channels event stream.",
    "Filtro por nÃ­vel, origem ou texto.": "Filter by level, source or text.",
    "Todos os nÃ­veis": "All levels",
    "Nenhum log corresponde aos filtros atuais.": "No log entries match the current filters.",
    "Baixar": "Download",
    "ReferÃªncia rÃ¡pida de endpoints, autenticaÃ§Ã£o e payloads.": "Quick reference for endpoints, authentication and payloads.",
    "InÃ­cio rÃ¡pido": "Quick Start",
    "Token de auth + URL base": "Auth token + base URL",
    "Exemplo de atualizaÃ§Ã£o de config": "Sample Config Update",
    "Testar requisiÃ§Ã£o": "Try Request",
    "Gerenciar disponibilidade de habilidades e injecao de chaves de API.": "Manage skill availability and API key injection.",
    "Habilidades empacotadas, gerenciadas e do workspace.": "Bundled, managed, and workspace skills.",
    "Buscar habilidades": "Search skills",
    "Habilidades do workspace": "Workspace Skills",
    "Habilidades nativas": "Built-in Skills",
    "Nenhuma habilidade corresponde ao filtro atual.": "No skills match the current filter.",
    "Salvar chave": "Save key",
    "Dispositivos pareados, capacidades e exposicao de comandos.": "Paired devices, capabilities and command exposure.",
    "AprovaÃ§Ãµes de Exec": "Exec approvals",
    "VÃ­nculo de nÃ³ para Exec": "Exec node binding",
    "VÃ­nculo padrÃ£o": "Default binding",
    "PolÃ­tica de prompt padrÃ£o": "Default prompt policy",
    "Modo de seguranÃ§a padrÃ£o": "Default security mode",
    "SolicitaÃ§Ãµes de pareamento + tokens de papÃ©is.": "Pairing requests + role tokens.",
    "Dispositivos pareados e links ativos.": "Paired devices and live links.",
    "Nenhum nÃ³ encontrado.": "No nodes found.",
    "Nenhum nÃ³ com system.run disponÃ­vel.": "No nodes with system.run available.",
    "Qualquer nÃ³": "Any node",
    "SeguranÃ§a": "Security",
    "Escopo": "Scope",
    "Modo": "Mode",
    "Negar": "Deny",
    "Perguntar": "Ask",
    "Gerenciar espacos de trabalho, ferramentas e identidades de agentes.": "Manage workspaces, tools and agent identities.",
    "Workspace e roteamento do agente.": "Agent workspace and routing.",
    "VisÃ£o geral": "Overview",
    "Arquivos": "Files",
    "Criar agente e abrir modelo â–¶": "Create agent and open model â–¶",
    "Importar sessao ChatGPT / OpenAI Codex": "Import ChatGPT / OpenAI Codex session",
    "Conectar OpenAI agora": "Connect OpenAI now",
    "Inspecionar sessoes ativas e ajustar padroes por sessao.": "Inspect active sessions and adjust per-session defaults.",
    "Atualizado": "Updated",
    "RaciocÃ­nio": "Thinking",
    "Limite": "Limit",
    "Excluir": "Delete",
    "Armazenamento: (mÃºltiplo)": "Store: (multiple)",
    "Ativo em (minutos)": "Active within (minutes)",
    "Incluir global": "Include global",
    "Incluir desconhecido": "Include unknown",
    "Gerencie os planos e recursos disponiveis por nivel.": "Manage plans and features by tier.",
    "Todos os canais": "All channels",
    "Todos os canais, mais agentes e suporte rÃ¡pido.": "All channels, more agents and faster support.",
    "Para quem estÃ¡ comeÃ§ando com automaÃ§Ã£o de IA.": "For teams starting with AI automation.",
    "Para equipes e empresas": "For teams and companies",
    "Poder total com suporte dedicado.": "Full power with dedicated support.",
    "Mais popular entre clientes": "Most popular with customers",
    "Assinar Pro": "Subscribe Pro",
    "Assinar Elite": "Subscribe Elite",
    "7 dias grÃ¡tis sem cartÃ£o": "7 days free without card",
    "Filtro por nivel, origem ou texto.": "Filter by level, source or text.",
    "Todos os niveis": "All levels",
    "Referencia rapida de endpoints, autenticacao e payloads.": "Quick reference for endpoints, authentication and payloads.",
    "Inicio rapido": "Quick Start",
    "Exemplo de atualizacao de config": "Sample Config Update",
    "Testar requisicao": "Try Request",
    "Aprovacoes de Exec": "Exec approvals",
    "Vinculo de no para Exec": "Exec node binding",
    "Vinculo padrao": "Default binding",
    "Politica de prompt padrao": "Default prompt policy",
    "Modo de seguranca padrao": "Default security mode",
    "Solicitacoes de pareamento + tokens de papeis.": "Pairing requests + role tokens.",
    "Nenhum no encontrado.": "No nodes found.",
    "Nenhum no com system.run disponivel.": "No nodes with system.run available.",
    "Qualquer no": "Any node",
    "Seguranca": "Security",
    "Visao geral": "Overview",
    "Raciocinio": "Thinking",
    "Armazenamento: (multiplo)": "Store: (multiple)",
    "Todos os canais, mais agentes e suporte rapido.": "All channels, more agents and faster support.",
    "Para quem esta comecando com automacao de IA.": "For teams starting with AI automation.",
    "7 dias gratis sem cartao": "7 days free without card",
    "Versao": "Version",
    "Saude": "Health",
    "Atualizar agora ▶": "Update now ▶",
    "Atualizar ▶": "Update ▶",
    "Visao Geral": "Overview",
    "Sessoes": "Sessions",
    "Termos de Servico": "Terms of Service",
    "Politica de Privacidade": "Privacy Policy",
    "Enviar Codigo": "Send Code",
    "Codigo Enviado!": "Code Sent!",
    "Codigo de 6 digitos": "6-digit code",
    "Verificar Codigo": "Verify Code",
    "Nao recebeu?": "Didn't receive it?",
    "Reenviar ▶": "Resend ▶",
    "Ultima atualizacao:": "Last update:",
    "Proximo:": "Next:",
    "Minimo de 8 caracteres!": "Minimum 8 characters!",
    "As senhas nao coincidem!": "Passwords do not match!",
    "E-mail invalido. Tente novamente!": "Invalid email. Try again!",
    "Codigo invalido. Tente novamente!": "Invalid code. Try again!"
  });

  const phraseTranslations = [
    ["Ao continuar, você concorda com nossos", "By continuing, you agree to our"],
    ["Ver Documentação ▶", "View Documentation ▶"],
    ["Ver todas as 50+ integrações ▶", "View all 50+ integrations ▶"],
    ["Veja o que as pessoas criaram ▶", "See what people built ▶"],
    ["Browse ClawHub ▶", "Browse ClawHub ▶"],
    ["Receba atualizações sobre novas funcionalidades, integrações e sabedoria mística. Sem spam.",
      "Receive updates about new features, integrations and mystical wisdom. No spam."],
    ["Fique por Dentro", "Stay Updated"],
    ["Ao continuar, voce concorda com nossos", "By continuing, you agree to our"],
    ["Ver Documentacao ▶", "View Documentation ▶"],
    ["Ver todas as 50+ integracoes ▶", "View all 50+ integrations ▶"],
    ["Veja o que as pessoas criaram ▶", "See what people built ▶"],
    ["Ver Documentacao", "View Documentation"],
    ["Ver todas as 50+ integracoes", "View all 50+ integrations"],
    ["Veja o que as pessoas criaram", "See what people built"],
    ["Receba atualizacoes sobre novas funcionalidades, integracoes e sabedoria mistica. Sem spam.",
      "Receive updates about new features, integrations and mystical wisdom. No spam."]
  ];

  const dynamicPatterns = [
    {
      regex: /^(\d+)\s+sessões no período$/i,
      replace: (_, count) => count + " sessions in period"
    },
    {
      regex: /^(\d+)\s+mostradas$/i,
      replace: (_, count) => count + " shown"
    },
    {
      regex: /^(\d+)\s+erros$/i,
      replace: (_, count) => count + " errors"
    },
    {
      regex: /^último:\s*(.+)$/i,
      replace: (_, value) => "last: " + value
    },
    {
      regex: /^(\d+)\s+ativos$/i,
      replace: (_, count) => count + " active"
    },
    {
      regex: /^(\d+)\s+sessoes no periodo$/i,
      replace: (_, count) => count + " sessions in period"
    },
    {
      regex: /^ultimo:\s*(.+)$/i,
      replace: (_, value) => "last: " + value
    }
  ];
  const reverseTranslations = buildReverseMap(exactTranslations);
  const reversePhraseTranslations = [
    ["By continuing, you agree to our", "Ao continuar, voce concorda com nossos"],
    ["View Documentation â–¶", "Ver Documentacao â–¶"],
    ["View Documentation ▶", "Ver Documentacao ▶"],
    ["View all 50+ integrations â–¶", "Ver todas as 50+ integracoes â–¶"],
    ["View all 50+ integrations ▶", "Ver todas as 50+ integracoes ▶"],
    ["See what people built â–¶", "Veja o que as pessoas criaram â–¶"],
    ["See what people built ▶", "Veja o que as pessoas criaram ▶"],
    ["View Documentation", "Ver Documentacao"],
    ["View all 50+ integrations", "Ver todas as 50+ integracoes"],
    ["See what people built", "Veja o que as pessoas criaram"],
    ["Receive updates about new features, integrations and mystical wisdom. No spam.",
      "Receba atualizacoes sobre novas funcionalidades, integracoes e sabedoria mistica. Sem spam."],
    ["Stay Updated", "Fique por Dentro"]
  ];
  const reverseDynamicPatterns = [
    {
      regex: /^(\d+)\s+sessions in period$/i,
      replace: (_, count) => count + " sessoes no periodo"
    },
    {
      regex: /^(\d+)\s+shown$/i,
      replace: (_, count) => count + " mostradas"
    },
    {
      regex: /^(\d+)\s+errors$/i,
      replace: (_, count) => count + " erros"
    },
    {
      regex: /^last:\s*(.+)$/i,
      replace: (_, value) => "ultimo: " + value
    },
    {
      regex: /^(\d+)\s+active$/i,
      replace: (_, count) => count + " ativos"
    }
  ];

  injectStyles();
  wireTopbarLinks();
  wireDashboardLinks();
  wireCommonLinks();
  injectLanguageSwitch();
  applyHashNavigation();
  setLanguage(loadLanguage(), true);
  observeFutureNodes();

  function buildMap(source) {
    const map = new Map();
    Object.keys(source).forEach((key) => {
      map.set(normalizeText(key), {
        source: key,
        target: source[key]
      });
    });
    return map;
  }

  function buildReverseMap(map) {
    const reverse = new Map();
    map.forEach((entry) => {
      reverse.set(normalizeText(entry.target), entry.source);
    });
    return reverse;
  }

  function repairMojibake(value) {
    const raw = value || "";
    if (!/[\u00C3\u00C2\u00E2\u00F0]/.test(raw)) {
      return raw;
    }

    try {
      return decodeURIComponent(escape(raw));
    } catch (error) {
      return raw;
    }
  }

  function normalizeText(value) {
    return repairMojibake(value || "")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&quot;/gi, "\"")
      .replace(/&#039;/gi, "'")
      .replace(/&ccedil;/gi, "c")
      .replace(/&atilde;|&aacute;|&agrave;|&acirc;/gi, "a")
      .replace(/&otilde;|&oacute;|&ograve;|&ocirc;/gi, "o")
      .replace(/&eacute;|&ecirc;|&egrave;/gi, "e")
      .replace(/&iacute;|&igrave;/gi, "i")
      .replace(/&uacute;|&ugrave;/gi, "u")
      .replace(/[\u2014\u2013]/g, "-")
      .replace(/[\u2022\u00B7]/g, " ")
      .replace(/[\u201C\u201D]/g, "\"")
      .replace(/[\u2019`]/g, "'")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function preserveSpacing(original, translated) {
    const rawOriginal = original || "";
    const rawTranslated = (translated || "").trim();
    const leading = rawOriginal.match(/^\s*/)[0];
    const trailing = rawOriginal.match(/\s*$/)[0];
    return leading + rawTranslated + trailing;
  }

  function loadAutoTranslationCache() {
    try {
      const raw = window.localStorage.getItem(autoTranslationCacheKey);
      if (!raw) {
        return {};
      }

      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (error) {
      return {};
    }
  }

  function saveAutoTranslationCache() {
    if (autoTranslationSaveTimer) {
      clearTimeout(autoTranslationSaveTimer);
    }

    autoTranslationSaveTimer = window.setTimeout(function () {
      try {
        window.localStorage.setItem(
          autoTranslationCacheKey,
          JSON.stringify(autoTranslationCache)
        );
      } catch (error) {
        // Ignore quota / serialization errors.
      }
    }, 180);
  }

  function shouldAutoTranslate(value) {
    const text = repairMojibake(value || "").trim();
    if (!text || text.length < 2 || text.length > 1800) {
      return false;
    }
    if (!/[A-Za-zÀ-ÿ]/.test(text)) {
      return false;
    }
    if (/^(https?:\/\/|#|\/|@)/i.test(text)) {
      return false;
    }
    if (
      /^[A-Za-z0-9_.:-]+$/.test(text) &&
      text.indexOf(" ") === -1 &&
      /[\d_.:-]/.test(text)
    ) {
      return false;
    }
    if (/[\{\}\[\]<>]/.test(text)) {
      return false;
    }
    return true;
  }

  function extractAutoTranslation(payload, fallback) {
    if (!payload || !Array.isArray(payload[0])) {
      return fallback;
    }

    const text = payload[0]
      .map((chunk) => (Array.isArray(chunk) ? chunk[0] || "" : ""))
      .join("")
      .trim();
    return text || fallback;
  }

  function queueAutoTranslation(value, language, callback) {
    if (language !== "en" || !shouldAutoTranslate(value)) {
      return;
    }

    const sourceText = repairMojibake(value || "").trim();
    const cacheKey = "en::" + normalizeText(sourceText);
    const cached = autoTranslationCache[cacheKey];
    if (cached) {
      callback(cached);
      return;
    }

    if (autoTranslationPending.has(cacheKey)) {
      autoTranslationPending.get(cacheKey).push(callback);
      return;
    }

    autoTranslationPending.set(cacheKey, [callback]);

    const url =
      "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=" +
      encodeURIComponent(sourceText);

    fetch(url)
      .then((response) => (response.ok ? response.json() : null))
      .then((payload) => {
        const translated = extractAutoTranslation(payload, sourceText);
        autoTranslationCache[cacheKey] = translated;
        saveAutoTranslationCache();
        return translated;
      })
      .catch(() => sourceText)
      .then((translated) => {
        const listeners = autoTranslationPending.get(cacheKey) || [];
        autoTranslationPending.delete(cacheKey);
        listeners.forEach((listener) => {
          try {
            listener(translated);
          } catch (error) {
            // Ignore callback errors from detached nodes.
          }
        });
      });
  }

  function loadLanguage() {
    return window.localStorage.getItem(storageKey) === "en" ? "en" : "pt-BR";
  }

  function saveLanguage(language) {
    window.localStorage.setItem(storageKey, language);
  }

  function injectStyles() {
    if (document.getElementById("vexus-ui-style")) {
      return;
    }

    const style = document.createElement("style");
    style.id = "vexus-ui-style";
    style.textContent = [
      "html{font-size:112.5%}",
      "body{line-height:1.35}",
      ".vexus-lang-switch{display:inline-flex;align-items:center;gap:3px;padding:3px;background:var(--bg-surface,#110c28);border:1px solid var(--border,#251a55);border-radius:4px;box-shadow:2px 2px 0 rgba(0,0,0,.3);margin-left:8px}",
      ".vexus-lang-btn{border:none;background:transparent;color:rgba(255,255,255,.58);font-family:'Press Start 2P',monospace;font-size:.33rem;padding:6px 7px;border-radius:3px;cursor:pointer;line-height:1;white-space:nowrap}",
      ".vexus-lang-btn:hover{background:rgba(180,77,255,.08);color:#fff}",
      ".vexus-lang-btn.active{background:rgba(180,77,255,.16);color:#fff}",
      ".tb-logo[data-vexus-route],.topbar-logo[data-vexus-route],.nav-item[data-vexus-route],.topbar-btn[data-vexus-route],.topbar-cta[data-vexus-route],.topbar-back[data-vexus-route]{cursor:pointer}",
      ".sidebar .nav-lbl{font-size:.66rem !important}",
      ".sidebar .sg-label{font-size:.56rem !important}",
      ".topbar-btn,.topbar-back{font-size:.52rem !important}",
      "@media(max-width:768px){.vexus-lang-switch{padding:2px}.vexus-lang-btn{font-size:.34rem;padding:5px 6px}.sidebar .nav-lbl{font-size:.61rem !important}.sidebar .sg-label{font-size:.52rem !important}.topbar-btn,.topbar-back{font-size:.48rem !important}}"
    ].join("");
    document.head.appendChild(style);
  }

  function wireDashboardLinks() {
    const logo = document.querySelector(".tb-logo");
    if (logo) {
      setNavigation(logo, "vision.php");
    }

    document.querySelectorAll(".nav-item").forEach((item) => {
      const labelNode = item.querySelector(".nav-lbl");
      const label = labelNode ? labelNode.textContent : item.textContent;
      const route = routeForDashboardLabel(label);
      if (!route) {
        return;
      }

      setNavigation(item, route);
      item.classList.toggle("active", route === currentFile);
    });
  }

  function wireTopbarLinks() {
    const topbarLogo = document.querySelector(".topbar-logo");
    if (topbarLogo) {
      setNavigation(topbarLogo, "index.php#top");
    }

    document.querySelectorAll(".topbar-btn").forEach((button) => {
      const labelNode = button.querySelector("span");
      const label = labelNode ? labelNode.textContent : button.textContent;
      const route = routeForTopbarLabel(label);
      if (!route) {
        return;
      }

      setNavigation(button, route);
    });

    const cta = document.querySelector(".topbar-cta");
    if (cta) {
      setNavigation(cta, "login.php");
    }

    const back = document.querySelector(".topbar-back");
    if (back) {
      setNavigation(back, currentFile === "forgout.php" ? "login.php" : "index.php#top");
    }
  }

  function wireCommonLinks() {
    document.querySelectorAll("a, button, .cta, .feature-card, .section-link, .integrations-link, .latest-post-card, .px-btn, .switch-link").forEach((node) => {
      const text = node.textContent || "";
      const key = normalizeText(text);
      let route = "";

      if (key.includes("blog")) {
        route = "hll.php";
      } else if (key.includes("ver todos") || key.includes("view all")) {
        route = "inetgrations.php#showcase";
      } else if (key.includes("integrac")) {
        route = "inetgrations.php";
      } else if (key.includes("showcase") || key.includes("pessoas criaram") || key.includes("people built")) {
        route = "inetgrations.php#showcase";
      } else if (key.includes("clawhub")) {
        route = "hll.php";
      } else if (key.includes("comecar") || key.includes("get started") || key.includes("ir para o login")) {
        route = "login.php";
      } else if (key.includes("documentacao") || key.includes("documentation")) {
        route = "index.php#docs";
      } else if (key.includes("termos de servico") || key.includes("terms of service")) {
        route = "index.php#top";
      } else if (key.includes("politica de privacidade") || key.includes("privacy policy")) {
        route = "index.php#top";
      } else if (key === "inicio" || key === "home") {
        route = "index.php#top";
      }

      if (node.classList.contains("latest-post-card")) {
        route = "hll.php";
      }

      if (!route) {
        return;
      }

      setNavigation(node, route);
    });

    document.querySelectorAll(".footer-nav a, .breadcrumb a").forEach((anchor) => {
      const key = normalizeText(anchor.textContent);
      if (key === "inicio" || key === "home") {
        anchor.setAttribute("href", "index.php#top");
      } else if (key.includes("blog")) {
        anchor.setAttribute("href", "hll.php");
      } else if (key.includes("integrac")) {
        anchor.setAttribute("href", "inetgrations.php");
      }
    });
  }

  function injectLanguageSwitch() {
    if (document.querySelector(".vexus-lang-switch")) {
      return;
    }

    const wrapper = document.createElement("div");
    wrapper.className = "vexus-lang-switch";
    wrapper.innerHTML = [
      '<button type="button" class="vexus-lang-btn" data-lang="pt-BR">PT-BR</button>',
      '<button type="button" class="vexus-lang-btn" data-lang="en">EN</button>'
    ].join("");

    wrapper.querySelectorAll(".vexus-lang-btn").forEach((button) => {
      button.addEventListener("click", function () {
        setLanguage(this.getAttribute("data-lang") || "pt-BR");
      });
    });

    const dashboardRight = document.querySelector(".tb-right");
    const dashboardAvatar = document.querySelector(".tb-avatar");
    const topbarNav = document.querySelector(".topbar-nav");
    const topbarBack = document.querySelector(".topbar-back");
    const topbar = document.querySelector(".topbar");

    if (dashboardRight) {
      if (dashboardAvatar) {
        dashboardRight.insertBefore(wrapper, dashboardAvatar);
      } else {
        dashboardRight.appendChild(wrapper);
      }
      return;
    }

    if (topbarNav) {
      const cta = topbarNav.querySelector(".topbar-cta");
      if (cta) {
        topbarNav.insertBefore(wrapper, cta);
      } else {
        topbarNav.appendChild(wrapper);
      }
      return;
    }

    if (topbar && topbarBack) {
      topbar.insertBefore(wrapper, topbarBack);
      return;
    }

    if (topbar) {
      topbar.appendChild(wrapper);
    }
  }

  function setLanguage(language, skipSave) {
    const normalizedLanguage = language === "en" ? "en" : "pt-BR";
    if (!skipSave) {
      saveLanguage(normalizedLanguage);
    }

    restoreDocument();
    restoreDocumentTitle();
    translateDocument(document.body, normalizedLanguage);
    translateDocumentTitle(normalizedLanguage);
    document.documentElement.setAttribute("lang", normalizedLanguage === "en" ? "en" : "pt-BR");

    document.querySelectorAll(".vexus-lang-btn").forEach((button) => {
      button.classList.toggle(
        "active",
        (button.getAttribute("data-lang") || "pt-BR") === normalizedLanguage
      );
    });
  }

  function translateDocument(root, language) {
    if (!root) {
      return;
    }

    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          if (!node.nodeValue || !node.nodeValue.trim()) {
            return NodeFilter.FILTER_REJECT;
          }

          const parent = node.parentElement;
          if (!parent) {
            return NodeFilter.FILTER_REJECT;
          }

          if (
            parent.closest(".vexus-lang-switch") ||
            ["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA"].includes(parent.tagName)
          ) {
            return NodeFilter.FILTER_REJECT;
          }

          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    let textNode = null;
    while ((textNode = walker.nextNode())) {
      if (!textOriginals.has(textNode)) {
        textOriginals.set(textNode, textNode.nodeValue);
      }

      const originalText = textOriginals.get(textNode);
      const translatedText = translateValue(originalText, language);
      textNode.nodeValue = translatedText;

      if (
        language === "en" &&
        normalizeText(translatedText) === normalizeText(originalText)
      ) {
        queueAutoTranslation(originalText, language, function (resolved) {
          if (loadLanguage() !== language || !textOriginals.has(textNode)) {
            return;
          }

          if (textOriginals.get(textNode) !== originalText) {
            return;
          }

          textNode.nodeValue = preserveSpacing(originalText, resolved);
        });
      }
    }

    root.querySelectorAll("*").forEach((element) => {
      if (element.closest(".vexus-lang-switch")) {
        return;
      }

      const original = attrOriginals.get(element) || {};
      ["placeholder", "title", "aria-label"].forEach((attribute) => {
        if (!Object.prototype.hasOwnProperty.call(original, attribute)) {
          original[attribute] = element.getAttribute(attribute);
        }
      });
      attrOriginals.set(element, original);

      ["placeholder", "title", "aria-label"].forEach((attribute) => {
        const value = original[attribute];
        if (typeof value === "string" && value.trim()) {
          const translatedValue = translateValue(value, language);
          element.setAttribute(attribute, translatedValue);

          if (
            language === "en" &&
            normalizeText(translatedValue) === normalizeText(value)
          ) {
            queueAutoTranslation(value, language, function (resolved) {
              if (loadLanguage() !== language || !document.contains(element)) {
                return;
              }

              const originalMap = attrOriginals.get(element);
              if (!originalMap || originalMap[attribute] !== value) {
                return;
              }

              element.setAttribute(attribute, preserveSpacing(value, resolved));
            });
          }
        }
      });
    });
  }

  function restoreDocument() {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          return textOriginals.has(node)
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_REJECT;
        }
      }
    );

    let textNode = null;
    while ((textNode = walker.nextNode())) {
      textNode.nodeValue = textOriginals.get(textNode);
    }

    document.querySelectorAll("*").forEach((element) => {
      const original = attrOriginals.get(element);
      if (!original) {
        return;
      }

      Object.keys(original).forEach((attribute) => {
        const value = original[attribute];
        if (value === null || typeof value === "undefined") {
          element.removeAttribute(attribute);
        } else {
          element.setAttribute(attribute, value);
        }
      });
    });
  }

  function translateDocumentTitle(language) {
    const html = document.documentElement;
    if (!html.dataset.vexusOriginalTitle) {
      html.dataset.vexusOriginalTitle = document.title;
    }

    document.title = translateValue(html.dataset.vexusOriginalTitle, language);
  }

  function restoreDocumentTitle() {
    const html = document.documentElement;
    if (html.dataset.vexusOriginalTitle) {
      document.title = html.dataset.vexusOriginalTitle;
    }
  }

  function translateValue(value, language) {
    const raw = value || "";
    const trimmed = raw.trim();
    if (!trimmed) {
      return raw;
    }

    const leading = raw.match(/^\s*/)[0];
    const trailing = raw.match(/\s*$/)[0];
    const map = language === "en" ? exactTranslations : reverseTranslations;
    const patterns = language === "en" ? dynamicPatterns : reverseDynamicPatterns;
    const phrases = language === "en" ? phraseTranslations : reversePhraseTranslations;
    const exactMatch = map.get(normalizeText(trimmed));
    let translated = trimmed;
    if (exactMatch) {
      translated = typeof exactMatch === "string" ? exactMatch : exactMatch.target;
    }

    patterns.forEach((pattern) => {
      translated = translated.replace(pattern.regex, pattern.replace);
    });

    if (translated === trimmed) {
      phrases.forEach(([from, to]) => {
        translated = translated.split(from).join(to);
      });
    }

    return leading + translated + trailing;
  }

  function observeFutureNodes() {
    if (!document.body || observed.has(document.body)) {
      return;
    }

    observed.add(document.body);
    const observer = new MutationObserver((entries) => {
      const activeLanguage = loadLanguage();

      entries.forEach((entry) => {
        entry.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            translateDocument(node, activeLanguage);
          } else if (node.nodeType === Node.TEXT_NODE && node.parentElement) {
            translateDocument(node.parentElement, activeLanguage);
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  function routeForDashboardLabel(label) {
    const key = normalizeText(label);
    if (key.startsWith("chat")) {
      return "home.php";
    }
    if (key.startsWith("visao geral") || key.startsWith("overview")) {
      return "vision.php";
    }
    if (key.startsWith("canais") || key.startsWith("channels")) {
      return "channels.php";
    }
    if (key.startsWith("instancias") || key.startsWith("instances")) {
      return "instance.php";
    }
    if (key.startsWith("sessoes") || key.startsWith("sessions")) {
      return "session.php";
    }
    if (key === "uso" || key === "usage") {
      return "use.php";
    }
    if (key.startsWith("tarefas cron") || key.startsWith("cron jobs")) {
      return "cron.php";
    }
    if (key.startsWith("nos") || key.startsWith("nodes")) {
      return "nos.php";
    }
    if (key.startsWith("habilidades") || key.startsWith("skills")) {
      return "skills.php";
    }
    return "";
  }

  function routeForTopbarLabel(label) {
    const key = normalizeText(label);
    if (key === "inicio" || key === "home") {
      return "index.php#top";
    }
    if (key === "features") {
      return "index.php#features";
    }
    if (key.startsWith("integrac") || key.startsWith("integrations")) {
      return "inetgrations.php";
    }
    if (key === "docs") {
      return "index.php#docs";
    }
    if (key === "blog") {
      return "hll.php";
    }
    return "";
  }

  function setNavigation(element, target) {
    if (!element || !target || element.dataset.vexusRoute === target) {
      return;
    }

    element.dataset.vexusRoute = target;

    if (element.tagName === "A") {
      element.setAttribute("href", target);
    } else if (element.tagName !== "BUTTON") {
      element.setAttribute("role", "link");
      if (!element.hasAttribute("tabindex")) {
        element.tabIndex = 0;
      }
    }

    const handler = function (event) {
      if (event) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
      navigate(target);
    };

    element.addEventListener("click", handler, true);
    element.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        handler(event);
      }
    });
  }

  function navigate(target) {
    const parts = target.split("#");
    const file = (parts[0] || currentFile).toLowerCase();
    const hash = parts[1] ? "#" + parts[1] : "";

    if (file === currentFile) {
      if (hash) {
        if (window.location.hash !== hash) {
          history.replaceState(null, "", hash);
        }
        scrollToHash(hash);
        return;
      }

      if (currentFile === "vision.php") {
        window.location.href = target;
      }
      return;
    }

    window.location.href = target;
  }

  function applyHashNavigation() {
    if (!window.location.hash) {
      return;
    }

    window.setTimeout(function () {
      scrollToHash(window.location.hash);
    }, 60);
  }

  function scrollToHash(hash) {
    const targets = {
      "#top": function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      },
      "#features": function () {
        scrollToSelector(".features-grid");
      },
      "#docs": function () {
        scrollToSelector(".code-block, .quickstart-note");
      },
      "#showcase": function () {
        scrollToSelector(".showcase-grid");
      }
    };

    if (targets[hash]) {
      targets[hash]();
    }
  }

  function scrollToSelector(selector) {
    const element = document.querySelector(selector);
    if (!element) {
      return;
    }

    const block = element.closest("section") || element;
    block.scrollIntoView({ behavior: "smooth", block: "start" });
  }
})();
