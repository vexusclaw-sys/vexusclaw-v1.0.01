<?php
$menuActive = 'api_docs';
$endpoints = [
  ['m' => 'GET', 'p' => '/health', 'a' => 'public', 'd' => 'Health check do gateway e status geral do runtime.'],
  ['m' => 'GET', 'p' => '/api/version', 'a' => 'token', 'd' => 'Versao atual, commit e metadata da instancia.'],
  ['m' => 'GET', 'p' => '/api/config', 'a' => 'token', 'd' => 'Retorna configuracao efetiva (com redactions).'],
  ['m' => 'PUT', 'p' => '/api/config', 'a' => 'token + approval', 'd' => 'Aplica alteracoes de configuracao com reload conforme policy.'],
  ['m' => 'GET', 'p' => '/api/agents', 'a' => 'token', 'd' => 'Lista agentes, workspace, identidade e estado.'],
  ['m' => 'POST', 'p' => '/api/agents/{id}/dispatch', 'a' => 'token', 'd' => 'Dispara execucao para o agente alvo com payload de mensagem.'],
  ['m' => 'GET', 'p' => '/api/sessions', 'a' => 'token', 'd' => 'Lista sessoes com filtros por status e agente.'],
  ['m' => 'POST', 'p' => '/api/sessions/{key}/send', 'a' => 'token', 'd' => 'Envia mensagem para uma sessao existente.'],
  ['m' => 'GET', 'p' => '/api/logs', 'a' => 'token', 'd' => 'Consulta logs com filtros de level/source/timestamp.'],
  ['m' => 'GET', 'p' => '/api/cron/jobs', 'a' => 'token', 'd' => 'Lista jobs cron agendados e ultimo status de execucao.'],
  ['m' => 'POST', 'p' => '/api/cron/jobs', 'a' => 'token', 'd' => 'Cria novo job cron com schedule e prompt de tarefa.'],
  ['m' => 'POST', 'p' => '/hooks', 'a' => 'hooks token', 'd' => 'Entrada de webhooks para mapeamentos de automacao.'],
];
?>
<!DOCTYPE html>
<html lang="pt-BR" style="color-scheme:dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>VexusClaw - Documenta&ccedil;&atilde;o API</title>
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap" rel="stylesheet">
<style>
:root{--bg:#07030f;--bg-card:#0d0820;--bg-surface:#110c28;--bg-sidebar:#09051a;--bg-input:#0a0618;--border:#251a55;--border-light:#1a1035;--accent:#b44dff;--accent2:#8a2be2;--green:#44ffaa;--yellow:#ffbd2e;--red:#ff4444;--blue:#53b7ff;--px-s:-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000}
*{margin:0;padding:0;box-sizing:border-box;color:#fff}
html,body{height:100%;overflow:hidden}
body{background:var(--bg);font-family:'VT323',monospace;font-size:18px}
input,button{font-family:inherit}
body::before{content:'';position:fixed;inset:0;z-index:0;pointer-events:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect x='0' y='0' width='1' height='1' fill='%23ffffff' opacity='0.007'/%3E%3Crect x='2' y='2' width='1' height='1' fill='%23ffffff' opacity='0.007'/%3E%3C/svg%3E");background-size:4px 4px}
.main{display:flex;flex-direction:column;overflow:hidden}
.page-hdr{padding:18px 24px 14px;border-bottom:2px solid var(--border);background:rgba(9,5,26,.55);display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}
.page-title{font-family:'Press Start 2P',monospace;font-size:.96rem;text-shadow:var(--px-s);margin-bottom:6px}
.page-desc{font-size:1.3rem;color:rgba(255,255,255,.42);line-height:1.4}
.page-body{padding:14px 18px 18px;flex:1;overflow:auto;display:flex;flex-direction:column;gap:12px}
.page-body::-webkit-scrollbar{width:5px}.page-body::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.card{background:var(--bg-card);border:2px solid var(--border);border-radius:6px;box-shadow:4px 4px 0 rgba(0,0,0,.5);overflow:hidden}
.card-hdr{padding:14px 16px 12px;border-bottom:2px solid var(--border-light)}
.card-title{font-family:'Press Start 2P',monospace;font-size:.66rem;text-shadow:var(--px-s)}
.card-sub{font-size:1.16rem;color:rgba(255,255,255,.4);margin-top:4px;line-height:1.4}
.card-body{padding:12px 16px}
.code{display:block;background:var(--bg-input);border:1px solid var(--border);border-radius:4px;padding:10px 11px;font-family:'VT323',monospace;font-size:1.14rem;line-height:1.5;white-space:pre-wrap}
.ep{padding:11px 16px;border-top:1px solid rgba(37,26,85,.5);display:grid;grid-template-columns:128px 1fr 170px;gap:10px;align-items:start}
.ep:first-child{border-top:none}
.method{display:inline-block;padding:4px 7px;border-radius:3px;border:1px solid;font-family:'Press Start 2P',monospace;font-size:.39rem}
.m-get{color:var(--green);border-color:rgba(68,255,170,.35);background:rgba(68,255,170,.08)}
.m-post{color:var(--blue);border-color:rgba(83,183,255,.35);background:rgba(83,183,255,.08)}
.m-put{color:var(--yellow);border-color:rgba(255,189,46,.35);background:rgba(255,189,46,.08)}
.ep-path{font-family:'Press Start 2P',monospace;font-size:.46rem;line-height:1.8;color:rgba(255,255,255,.88)}
.ep-desc{margin-top:5px;font-size:1.14rem;color:rgba(255,255,255,.75);line-height:1.42}
.auth{font-size:1.1rem;color:rgba(255,255,255,.65)}
.toolbar{padding:10px 16px;border-bottom:2px solid var(--border-light);display:flex;gap:8px;flex-wrap:wrap}
.inp{padding:8px 10px;background:var(--bg-input);border:2px solid var(--border);border-radius:4px;font-size:1.15rem;outline:none;min-width:220px}
.btn{padding:8px 11px;border:2px solid var(--border);border-radius:4px;font-family:'Press Start 2P',monospace;font-size:.43rem;background:var(--bg-surface);cursor:pointer}
.btn-primary{background:linear-gradient(135deg,var(--accent),var(--accent2));border-color:var(--accent2)}
@media(max-width:980px){.grid{grid-template-columns:1fr}.ep{grid-template-columns:1fr;gap:6px}}
@media(max-width:860px){.page-body{padding:10px}.page-hdr{padding:14px}}
</style>
</head>
<body>
<?php include __DIR__ . '/topbar.php'; ?>
<?php include __DIR__ . '/sidebar.php'; ?>
<main class="main" id="mainContent">
  <div class="page-hdr">
    <div><div class="page-title">Documenta&ccedil;&atilde;o API</div><div class="page-desc">Refer&ecirc;ncia r&aacute;pida de endpoints, autentica&ccedil;&atilde;o e payloads.</div></div>
    <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn" type="button">OpenAPI</button><button class="btn btn-primary" type="button">Try Request</button></div>
  </div>
  <div class="page-body">
    <section class="grid">
      <article class="card">
        <div class="card-hdr"><div class="card-title">Quick Start</div><div class="card-sub">Auth token + base URL</div></div>
        <div class="card-body">
          <code class="code">BASE_URL=http://localhost:18789
TOKEN=seu_gateway_token

curl -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/version"</code>
        </div>
      </article>
      <article class="card">
        <div class="card-hdr"><div class="card-title">Sample Config Update</div><div class="card-sub">PUT /api/config</div></div>
        <div class="card-body">
          <code class="code">{
  "gateway": { "port": 18789 },
  "logging": { "level": "info" },
  "tools": { "exec": { "security": "allowlist" } }
}</code>
        </div>
      </article>
    </section>

    <section class="card">
      <div class="card-hdr"><div><div class="card-title">Endpoints</div><div class="card-sub">Gateway, agents, sessions, logs, cron e hooks.</div></div></div>
      <div class="toolbar"><input class="inp" id="q" type="text" placeholder="Search path, auth or description"></div>
      <div id="list">
        <?php foreach ($endpoints as $ep): ?>
          <?php $s = strtolower($ep['m'] . ' ' . $ep['p'] . ' ' . $ep['a'] . ' ' . $ep['d']); ?>
          <article class="ep" data-search="<?php echo htmlspecialchars($s, ENT_QUOTES, 'UTF-8'); ?>">
            <div>
              <?php $mc = strtolower($ep['m']); ?>
              <span class="method m-<?php echo $mc; ?>"><?php echo htmlspecialchars($ep['m'], ENT_QUOTES, 'UTF-8'); ?></span>
            </div>
            <div>
              <div class="ep-path"><?php echo htmlspecialchars($ep['p'], ENT_QUOTES, 'UTF-8'); ?></div>
              <div class="ep-desc"><?php echo htmlspecialchars($ep['d'], ENT_QUOTES, 'UTF-8'); ?></div>
            </div>
            <div class="auth"><?php echo htmlspecialchars($ep['a'], ENT_QUOTES, 'UTF-8'); ?></div>
          </article>
        <?php endforeach; ?>
      </div>
    </section>
  </div>
</main>
<script>
(function(){
  var q=document.getElementById('q');
  var rows=[].slice.call(document.querySelectorAll('.ep'));
  function run(){
    var term=(q.value||'').toLowerCase().trim();
    rows.forEach(function(r){
      var ok=!term||(r.getAttribute('data-search')||'').indexOf(term)!==-1;
      r.style.display=ok?'grid':'none';
    });
  }
  q.addEventListener('input',run); run();
})();
</script>
<script src="vexus-ui.js"></script>
</body>
</html>
