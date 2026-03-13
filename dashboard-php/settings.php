<?php
$menuActive = 'settings';
require __DIR__ . '/includes/app-bootstrap.php';
?>
<!DOCTYPE html>
<html lang="pt-BR" style="color-scheme:dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>VexusClaw - Settings</title>
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap" rel="stylesheet">
<style>
:root{--bg:#07030f;--bg-card:#0d0820;--bg-surface:#110c28;--bg-input:#0a0618;--border:#251a55;--border-light:#1a1035;--accent:#b44dff;--accent2:#8a2be2;--green:#44ffaa;--yellow:#ffbd2e;--red:#ff4444;--blue:#44aaff;--px-s:-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000}
*{box-sizing:border-box;color:#fff}
html,body{height:100%;overflow:hidden}
body{margin:0;background:var(--bg);font-family:'VT323',monospace}
.main{display:flex;flex-direction:column;overflow:hidden}
.page-hdr{padding:18px 24px 14px;border-bottom:2px solid var(--border);background:rgba(9,5,26,.55)}
.page-title{font-family:'Press Start 2P',monospace;font-size:.96rem;line-height:1.7;text-shadow:var(--px-s);margin-bottom:6px}
.page-desc{font-size:1.26rem;color:rgba(255,255,255,.42)}
.page-body{padding:14px 18px 18px;overflow:auto;display:grid;grid-template-columns:1fr 1fr;gap:12px}
.page-body::-webkit-scrollbar{width:5px}.page-body::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}
.card{background:var(--bg-card);border:2px solid var(--border);border-radius:6px;box-shadow:4px 4px 0 rgba(0,0,0,.45);overflow:hidden}
.card-hdr{padding:14px 16px 12px;border-bottom:2px solid var(--border-light)}
.card-title{font-family:'Press Start 2P',monospace;font-size:.62rem;line-height:1.7;text-shadow:var(--px-s)}
.card-sub{font-size:1.12rem;color:rgba(255,255,255,.4)}
.card-body{padding:14px 16px}
.field{display:flex;flex-direction:column;gap:5px;margin-bottom:12px}
.label{font-family:'Press Start 2P',monospace;font-size:.42rem;color:rgba(255,255,255,.55);text-shadow:var(--px-s)}
.input,.textarea{width:100%;padding:10px 12px;background:var(--bg-input);border:2px solid var(--border);border-radius:4px;font-family:'VT323',monospace;font-size:1.18rem;outline:none}
.input:focus,.textarea:focus{border-color:var(--accent)}
.btn-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.btn{padding:9px 12px;border:2px solid var(--border);border-radius:4px;background:var(--bg-surface);cursor:pointer;font-family:'Press Start 2P',monospace;font-size:.42rem;box-shadow:2px 2px 0 rgba(0,0,0,.35)}
.btn:hover{border-color:var(--accent)}
.btn-primary{background:linear-gradient(135deg,var(--accent),var(--accent2));border-color:var(--accent2)}
.btn-green{border-color:rgba(68,255,170,.35);background:rgba(68,255,170,.08);color:var(--green)}
.btn-danger{border-color:rgba(255,68,68,.35);background:rgba(255,68,68,.08);color:var(--red)}
.hint{font-size:1rem;color:rgba(255,255,255,.38);line-height:1.45}
.provider-list{display:flex;flex-direction:column;gap:10px}
.provider-item{padding:12px;border:1px solid var(--border);border-radius:5px;background:var(--bg-surface)}
.provider-top{display:flex;justify-content:space-between;gap:10px;align-items:flex-start}
.provider-name{font-family:'Press Start 2P',monospace;font-size:.48rem;line-height:1.65}
.provider-meta{font-size:1.06rem;color:rgba(255,255,255,.55);line-height:1.45;margin-top:6px}
.badge{padding:4px 8px;border-radius:3px;border:1px solid;font-family:'Press Start 2P',monospace;font-size:.34rem}
.badge.connected{border-color:rgba(68,255,170,.35);background:rgba(68,255,170,.08);color:var(--green)}
.badge.pending{border-color:rgba(255,189,46,.35);background:rgba(255,189,46,.08);color:var(--yellow)}
.badge.error{border-color:rgba(255,68,68,.35);background:rgba(255,68,68,.08);color:var(--red)}
.badge.mock{border-color:rgba(255,255,255,.2);background:rgba(255,255,255,.06);color:rgba(255,255,255,.72)}
.stack{display:flex;flex-direction:column;gap:10px}
.status-box{padding:12px 14px;border:1px solid rgba(180,77,255,.22);background:rgba(180,77,255,.08);border-radius:4px;font-size:1.12rem;line-height:1.45}
.status-box.ok{border-color:rgba(68,255,170,.28);background:rgba(68,255,170,.08)}
@media(max-width:980px){.page-body{grid-template-columns:1fr}}
</style>
</head>
<body>
<?php include __DIR__ . '/topbar.php'; ?>
<?php include __DIR__ . '/sidebar.php'; ?>
<main class="main" id="mainContent">
  <div class="page-hdr">
    <div class="page-title">Settings</div>
    <div class="page-desc">Workspace, providers, URL publica e operacoes administrativas sem criar backend paralelo em PHP.</div>
  </div>
  <div class="page-body">
    <section class="card">
      <div class="card-hdr">
        <div class="card-title">Workspace</div>
        <div class="card-sub">Os dados abaixo saem do endpoint real de settings.</div>
      </div>
      <div class="card-body">
        <div class="status-box" id="settingsStatusBox">Carregando settings...</div>
        <div class="field" style="margin-top:14px">
          <label class="label">Nome do workspace</label>
          <input class="input" id="settingsWorkspaceName" type="text" placeholder="Workspace">
        </div>
        <div class="field">
          <label class="label">Slug</label>
          <input class="input" id="settingsWorkspaceSlug" type="text" disabled>
        </div>
        <div class="field">
          <label class="label">Dominio</label>
          <input class="input" id="settingsWorkspaceDomain" type="text" disabled>
        </div>
        <div class="field">
          <label class="label">Public URL</label>
          <input class="input" id="settingsWorkspaceUrl" type="text" disabled>
        </div>
        <div class="btn-row">
          <button class="btn btn-primary" id="saveWorkspaceBtn" type="button">Salvar workspace</button>
          <span class="hint" id="saveWorkspaceHint">O dominio calculado continua sendo controlado pelo backend.</span>
        </div>
      </div>
    </section>
    <section class="card">
      <div class="card-hdr">
        <div class="card-title">Provider Connections</div>
        <div class="card-sub">Lista real de providers do workspace atual.</div>
      </div>
      <div class="card-body">
        <div class="provider-list" id="settingsProviderList"></div>
      </div>
    </section>
    <section class="card">
      <div class="card-hdr">
        <div class="card-title">OpenAI API key</div>
        <div class="card-sub">Conexao oficial e estavel.</div>
      </div>
      <div class="card-body">
        <div class="field">
          <label class="label">Label</label>
          <input class="input" id="settingsOpenAiLabel" type="text" placeholder="OpenAI Primary">
        </div>
        <div class="field">
          <label class="label">API key</label>
          <input class="input" id="settingsOpenAiKey" type="password" placeholder="sk-...">
        </div>
        <div class="btn-row">
          <button class="btn" id="settingsTestOpenAiBtn" type="button">Testar chave</button>
          <button class="btn btn-primary" id="settingsConnectOpenAiBtn" type="button">Conectar OpenAI</button>
        </div>
      </div>
    </section>
    <section class="card">
      <div class="card-hdr">
        <div class="card-title">ChatGPT OAuth experimental</div>
        <div class="card-sub">Fluxo remoto ainda experimental; mantido sem duplicar auth em PHP.</div>
      </div>
      <div class="card-body">
        <div class="field">
          <label class="label">JSON auth/session</label>
          <textarea class="textarea" id="settingsSessionJson" rows="8" placeholder='{"auth_mode":"oauth","tokens":{"access_token":"..."}}'></textarea>
        </div>
        <div class="btn-row">
          <button class="btn" id="settingsStartOauthBtn" type="button">Gerar link OAuth</button>
          <button class="btn btn-primary" id="settingsImportSessionBtn" type="button">Importar sessao</button>
        </div>
        <div class="stack" style="margin-top:12px">
          <div class="status-box" id="settingsOauthBox">Nenhuma tentativa OAuth ativa.</div>
        </div>
      </div>
    </section>
  </div>
</main>
<script src="/assets/vexus-api.js"></script>
<script src="/assets/vexus-auth.js"></script>
<script src="/assets/pages/settings.js"></script>
</body>
</html>
