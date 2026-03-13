<?php
$menuActive = 'settings';
require __DIR__ . '/includes/app-bootstrap.php';
?>
<!DOCTYPE html>
<html lang="pt-BR" style="color-scheme:dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>VexusClaw - Setup</title>
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap" rel="stylesheet">
<style>
:root{--bg:#07030f;--bg-card:#0d0820;--bg-surface:#110c28;--bg-input:#0a0618;--border:#251a55;--border-light:#1a1035;--accent:#b44dff;--accent2:#8a2be2;--green:#44ffaa;--yellow:#ffbd2e;--red:#ff4444;--px-s:-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000}
*{box-sizing:border-box;color:#fff}
html,body{height:100%;overflow:hidden}
body{margin:0;background:var(--bg);font-family:'VT323',monospace}
.main{display:flex;flex-direction:column;overflow:hidden}
.page-hdr{padding:18px 24px 14px;border-bottom:2px solid var(--border);background:rgba(9,5,26,.55)}
.page-title{font-family:'Press Start 2P',monospace;font-size:.96rem;line-height:1.7;text-shadow:var(--px-s);margin-bottom:6px}
.page-desc{font-size:1.26rem;color:rgba(255,255,255,.42)}
.page-body{padding:14px 18px 18px;overflow:auto;display:grid;grid-template-columns:1.15fr .85fr;gap:12px}
.page-body::-webkit-scrollbar{width:5px}.page-body::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}
.card{background:var(--bg-card);border:2px solid var(--border);border-radius:6px;box-shadow:4px 4px 0 rgba(0,0,0,.45);overflow:hidden}
.card-hdr{padding:14px 16px 12px;border-bottom:2px solid var(--border-light)}
.card-title{font-family:'Press Start 2P',monospace;font-size:.62rem;line-height:1.7;text-shadow:var(--px-s)}
.card-sub{font-size:1.12rem;color:rgba(255,255,255,.4)}
.card-body{padding:14px 16px}
.status-box{padding:12px 14px;border:1px solid rgba(180,77,255,.22);background:rgba(180,77,255,.08);border-radius:4px;font-size:1.12rem;line-height:1.45}
.status-box.ok{border-color:rgba(68,255,170,.28);background:rgba(68,255,170,.08)}
.status-box.warn{border-color:rgba(255,189,46,.28);background:rgba(255,189,46,.08)}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.field{display:flex;flex-direction:column;gap:5px;margin-bottom:12px}
.label{font-family:'Press Start 2P',monospace;font-size:.42rem;color:rgba(255,255,255,.55);text-shadow:var(--px-s)}
.input,.select,.textarea{width:100%;padding:10px 12px;background:var(--bg-input);border:2px solid var(--border);border-radius:4px;font-family:'VT323',monospace;font-size:1.2rem;outline:none}
.input:focus,.select:focus,.textarea:focus{border-color:var(--accent)}
.textarea{min-height:120px;resize:vertical}
.hint{font-size:1rem;color:rgba(255,255,255,.38);line-height:1.45}
.btn-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.btn{padding:9px 12px;border:2px solid var(--border);border-radius:4px;background:var(--bg-surface);cursor:pointer;font-family:'Press Start 2P',monospace;font-size:.42rem;box-shadow:2px 2px 0 rgba(0,0,0,.35)}
.btn:hover{border-color:var(--accent)}
.btn-primary{background:linear-gradient(135deg,var(--accent),var(--accent2));border-color:var(--accent2)}
.checkbox{display:flex;align-items:center;gap:8px;font-size:1.1rem;color:rgba(255,255,255,.75)}
.list{display:flex;flex-direction:column;gap:10px}
.item{padding:10px 12px;background:var(--bg-surface);border:1px solid var(--border);border-radius:4px}
.item-k{font-family:'Press Start 2P',monospace;font-size:.42rem;color:rgba(255,255,255,.58)}
.item-v{font-size:1.12rem;color:rgba(255,255,255,.82);margin-top:4px}
.muted{color:rgba(255,255,255,.4)}
@media(max-width:980px){.page-body{grid-template-columns:1fr}}
</style>
</head>
<body>
<?php include __DIR__ . '/topbar.php'; ?>
<?php include __DIR__ . '/sidebar.php'; ?>
<main class="main" id="mainContent">
  <div class="page-hdr">
    <div class="page-title">Setup</div>
    <div class="page-desc">Finalizar provider, agente inicial e bootstrap operacional do workspace.</div>
  </div>
  <div class="page-body">
    <section class="card">
      <div class="card-hdr">
        <div class="card-title">Provider Inicial</div>
        <div class="card-sub">Use o backend real da VEXUSCLAW para conectar OpenAI, Mock ou ChatGPT OAuth experimental.</div>
      </div>
      <div class="card-body">
        <div class="status-box warn" id="setupStatusBox">Carregando status do setup...</div>
        <div class="grid" style="margin-top:14px">
          <div class="field">
            <label class="label">Provider</label>
            <select class="select" id="setupProviderType">
              <option value="mock">Mock</option>
              <option value="openai">OpenAI API key</option>
              <option value="chatgpt_oauth">ChatGPT OAuth experimental</option>
            </select>
          </div>
          <div class="field">
            <label class="label">Label</label>
            <input class="input" id="setupProviderLabel" type="text" placeholder="Primary provider">
          </div>
        </div>
        <div class="field" id="setupOpenAiWrap">
          <label class="label">OpenAI API key</label>
          <input class="input" id="setupOpenAiKey" type="password" placeholder="sk-...">
          <div class="hint">Obrigatorio apenas quando o provider escolhido for OpenAI.</div>
        </div>
        <div class="btn-row">
          <button class="btn btn-primary" id="saveProviderBtn" type="button">Salvar provider</button>
          <span class="hint" id="saveProviderHint">O provider e salvo no workspace atual.</span>
        </div>
      </div>
    </section>
    <section class="card">
      <div class="card-hdr">
        <div class="card-title">Agente Inicial</div>
        <div class="card-sub">Os campos abaixo alimentam o endpoint real de finalize.</div>
      </div>
      <div class="card-body">
        <div class="field">
          <label class="label">Nome do agente</label>
          <input class="input" id="setupAgentName" type="text" placeholder="VexusClaw Prime">
        </div>
        <div class="grid">
          <div class="field">
            <label class="label">Papel</label>
            <input class="input" id="setupAgentRole" type="text" placeholder="Operacoes e atendimento">
          </div>
          <div class="field">
            <label class="label">Tom</label>
            <input class="input" id="setupAgentTone" type="text" placeholder="Direto e preciso">
          </div>
        </div>
        <div class="field">
          <label class="label">Instrucoes</label>
          <textarea class="textarea" id="setupAgentInstructions" placeholder="Explique objetivo, limites, voz e comportamento do agente."></textarea>
        </div>
        <label class="checkbox">
          <input id="setupProvisionWhatsapp" type="checkbox" checked>
          Provisionar o WhatsApp principal agora
        </label>
        <div class="btn-row" style="margin-top:14px">
          <button class="btn btn-primary" id="finishSetupBtn" type="button">Finalizar setup</button>
          <span class="hint" id="finishSetupHint">Quando concluido, o painel redireciona para a visao geral.</span>
        </div>
      </div>
    </section>
    <section class="card">
      <div class="card-hdr">
        <div class="card-title">Checklist</div>
        <div class="card-sub">Leitura rapida do estado atual do onboarding.</div>
      </div>
      <div class="card-body">
        <div class="list" id="setupChecklist"></div>
      </div>
    </section>
    <section class="card">
      <div class="card-hdr">
        <div class="card-title">Workspace</div>
        <div class="card-sub">Identidade calculada pelo backend.</div>
      </div>
      <div class="card-body">
        <div class="list">
          <div class="item"><div class="item-k">Workspace</div><div class="item-v" id="setupWorkspaceName">-</div></div>
          <div class="item"><div class="item-k">Slug</div><div class="item-v" id="setupWorkspaceSlug">-</div></div>
          <div class="item"><div class="item-k">Dominio</div><div class="item-v" id="setupWorkspaceDomain">-</div></div>
          <div class="item"><div class="item-k">Public URL</div><div class="item-v" id="setupWorkspaceUrl">-</div></div>
        </div>
      </div>
    </section>
  </div>
</main>
<script src="/assets/vexus-api.js"></script>
<script src="/assets/vexus-auth.js"></script>
<script src="/assets/pages/setup.js"></script>
</body>
</html>
