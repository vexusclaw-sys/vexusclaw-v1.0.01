<?php
$menuActive = 'logs';
$logEntries = [
  ['ts' => '2026-03-13 12:44:02', 'lvl' => 'INFO', 'src' => 'gateway.http', 'msg' => 'Gateway listener started on :18789'],
  ['ts' => '2026-03-13 12:44:04', 'lvl' => 'INFO', 'src' => 'control-ui', 'msg' => 'Control UI mounted at /openclaw'],
  ['ts' => '2026-03-13 12:44:09', 'lvl' => 'WARN', 'src' => 'diagnostics.cache-trace', 'msg' => 'Cache trace disabled; skipping snapshot write'],
  ['ts' => '2026-03-13 12:44:15', 'lvl' => 'INFO', 'src' => 'channels.whatsapp', 'msg' => 'Heartbeat OK (latency 82ms)'],
  ['ts' => '2026-03-13 12:44:21', 'lvl' => 'INFO', 'src' => 'auth.profile', 'msg' => 'Loaded auth profile openai-codex:default'],
  ['ts' => '2026-03-13 12:44:30', 'lvl' => 'ERROR', 'src' => 'tools.exec', 'msg' => 'Blocked command by Exec Security policy (allowlist)'],
  ['ts' => '2026-03-13 12:44:38', 'lvl' => 'INFO', 'src' => 'agents.runtime', 'msg' => 'Agent main initialized with workspace /root/.openclaw/workspace'],
  ['ts' => '2026-03-13 12:44:50', 'lvl' => 'DEBUG', 'src' => 'models.router', 'msg' => 'Resolved provider litellm -> model openai-pool'],
  ['ts' => '2026-03-13 12:44:58', 'lvl' => 'WARN', 'src' => 'session.maintenance', 'msg' => 'Session store reached 82% of high-water target'],
  ['ts' => '2026-03-13 12:45:06', 'lvl' => 'INFO', 'src' => 'cron.scheduler', 'msg' => 'Cron tick completed; 0 pending retries'],
  ['ts' => '2026-03-13 12:45:14', 'lvl' => 'INFO', 'src' => 'hooks', 'msg' => 'Hooks endpoint idle; no inbound requests'],
  ['ts' => '2026-03-13 12:45:22', 'lvl' => 'INFO', 'src' => 'gateway.health', 'msg' => 'Health status OK'],
];
?>
<!DOCTYPE html>
<html lang="pt-BR" style="color-scheme:dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>VexusClaw - Logs</title>
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap" rel="stylesheet">
<style>
:root{--bg:#07030f;--bg-card:#0d0820;--bg-surface:#110c28;--bg-sidebar:#09051a;--bg-input:#0a0618;--border:#251a55;--border-light:#1a1035;--accent:#b44dff;--accent2:#8a2be2;--green:#44ffaa;--yellow:#ffbd2e;--red:#ff4444;--px-s:-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000}
*{margin:0;padding:0;box-sizing:border-box;color:#fff}
html,body{height:100%;overflow:hidden}
body{background:var(--bg);font-family:'VT323',monospace;font-size:18px}
input,select,button{font-family:inherit}
body::before{content:'';position:fixed;inset:0;z-index:0;pointer-events:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect x='0' y='0' width='1' height='1' fill='%23ffffff' opacity='0.007'/%3E%3Crect x='2' y='2' width='1' height='1' fill='%23ffffff' opacity='0.007'/%3E%3C/svg%3E");background-size:4px 4px}
.main{display:flex;flex-direction:column;overflow:hidden}
.page-hdr{padding:18px 24px 14px;border-bottom:2px solid var(--border);background:rgba(9,5,26,.55);display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}
.page-title{font-family:'Press Start 2P',monospace;font-size:.96rem;text-shadow:var(--px-s);margin-bottom:6px}
.page-desc{font-size:1.3rem;color:rgba(255,255,255,.42);line-height:1.4}
.page-body{padding:14px 18px 18px;flex:1;overflow:auto;display:flex;flex-direction:column;gap:12px}
.page-body::-webkit-scrollbar{width:5px}.page-body::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}
.card{background:var(--bg-card);border:2px solid var(--border);border-radius:6px;box-shadow:4px 4px 0 rgba(0,0,0,.5);overflow:hidden}
.card-hdr{padding:14px 16px 12px;border-bottom:2px solid var(--border-light);display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap}
.card-title{font-family:'Press Start 2P',monospace;font-size:.66rem;text-shadow:var(--px-s)}
.card-sub{font-size:1.16rem;color:rgba(255,255,255,.4);line-height:1.4}
.toolbar{padding:10px 16px;border-bottom:2px solid var(--border-light);display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.inp{padding:8px 10px;background:var(--bg-input);border:2px solid var(--border);border-radius:4px;font-size:1.16rem;outline:none}
.inp:focus{border-color:var(--accent)}
.btn{padding:8px 11px;border:2px solid var(--border);border-radius:4px;font-family:'Press Start 2P',monospace;font-size:.43rem;background:var(--bg-surface);cursor:pointer}
.btn-primary{background:linear-gradient(135deg,var(--accent),var(--accent2));border-color:var(--accent2)}
.stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
.stat{padding:10px;border:1px solid var(--border);border-radius:4px;background:var(--bg-surface)}
.stat-k{font-family:'Press Start 2P',monospace;font-size:.42rem;color:rgba(255,255,255,.6)}
.stat-v{font-family:'Press Start 2P',monospace;font-size:.7rem;margin-top:8px}
.log-list{display:flex;flex-direction:column}
.log-row{padding:11px 16px;border-top:1px solid rgba(37,26,85,.5);display:grid;grid-template-columns:190px 86px 240px 1fr;gap:10px;align-items:start}
.log-row:first-child{border-top:none}
.log-ts{color:rgba(255,255,255,.55)}
.log-lvl{font-family:'Press Start 2P',monospace;font-size:.38rem;padding:4px 6px;border-radius:3px;border:1px solid}
.lvl-info{color:var(--green);border-color:rgba(68,255,170,.35);background:rgba(68,255,170,.08)}
.lvl-warn{color:var(--yellow);border-color:rgba(255,189,46,.35);background:rgba(255,189,46,.08)}
.lvl-error{color:rgba(255,120,120,.95);border-color:rgba(255,68,68,.35);background:rgba(255,68,68,.08)}
.lvl-debug{color:rgba(190,190,255,.95);border-color:rgba(120,120,255,.35);background:rgba(120,120,255,.08)}
.log-src{font-family:'Press Start 2P',monospace;font-size:.42rem;line-height:1.8;color:rgba(255,255,255,.72)}
.log-msg{line-height:1.45;font-size:1.14rem;color:rgba(255,255,255,.85)}
.empty{padding:16px;color:rgba(255,255,255,.45)}
@media(max-width:980px){.stats{grid-template-columns:1fr 1fr}.log-row{grid-template-columns:1fr;gap:6px}}
@media(max-width:860px){.page-body{padding:10px}.page-hdr{padding:14px}}
</style>
</head>
<body>
<?php include __DIR__ . '/topbar.php'; ?>
<?php include __DIR__ . '/sidebar.php'; ?>
<main class="main" id="mainContent">
  <div class="page-hdr">
    <div><div class="page-title">Logs</div><div class="page-desc">Fluxo de eventos de gateway, ferramentas, sess&otilde;es e canais.</div></div>
    <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn" type="button">Download</button><button class="btn btn-primary" type="button">Refresh</button></div>
  </div>
  <div class="page-body">
    <section class="stats">
      <article class="stat"><div class="stat-k">Total</div><div class="stat-v" id="stat-total">0</div></article>
      <article class="stat"><div class="stat-k">INFO</div><div class="stat-v" id="stat-info">0</div></article>
      <article class="stat"><div class="stat-k">WARN</div><div class="stat-v" id="stat-warn">0</div></article>
      <article class="stat"><div class="stat-k">ERROR</div><div class="stat-v" id="stat-error">0</div></article>
    </section>
    <section class="card">
      <div class="card-hdr"><div><div class="card-title">Log Stream</div><div class="card-sub">Filter por n&iacute;vel, origem ou texto.</div></div></div>
      <div class="toolbar">
        <input class="inp" id="q" type="text" placeholder="Search logs" style="min-width:220px">
        <select class="inp" id="lvl"><option value="">All levels</option><option>INFO</option><option>WARN</option><option>ERROR</option><option>DEBUG</option></select>
        <input class="inp" id="src" type="text" placeholder="Source contains..." style="min-width:190px">
      </div>
      <div class="log-list" id="logList">
        <?php foreach ($logEntries as $row): ?>
          <?php $s = strtolower($row['ts'] . ' ' . $row['lvl'] . ' ' . $row['src'] . ' ' . $row['msg']); ?>
          <article class="log-row" data-search="<?php echo htmlspecialchars($s, ENT_QUOTES, 'UTF-8'); ?>" data-level="<?php echo htmlspecialchars($row['lvl'], ENT_QUOTES, 'UTF-8'); ?>" data-source="<?php echo htmlspecialchars(strtolower($row['src']), ENT_QUOTES, 'UTF-8'); ?>">
            <div class="log-ts"><?php echo htmlspecialchars($row['ts'], ENT_QUOTES, 'UTF-8'); ?></div>
            <div><span class="log-lvl lvl-<?php echo strtolower($row['lvl']); ?>"><?php echo htmlspecialchars($row['lvl'], ENT_QUOTES, 'UTF-8'); ?></span></div>
            <div class="log-src"><?php echo htmlspecialchars($row['src'], ENT_QUOTES, 'UTF-8'); ?></div>
            <div class="log-msg"><?php echo htmlspecialchars($row['msg'], ENT_QUOTES, 'UTF-8'); ?></div>
          </article>
        <?php endforeach; ?>
      </div>
      <div class="empty" id="empty" style="display:none">No log entries match the current filters.</div>
    </section>
  </div>
</main>
<script>
(function(){
  var q=document.getElementById('q'),lvl=document.getElementById('lvl'),src=document.getElementById('src');
  var rows=[].slice.call(document.querySelectorAll('.log-row'));
  var empty=document.getElementById('empty');
  var statTotal=document.getElementById('stat-total'),statInfo=document.getElementById('stat-info'),statWarn=document.getElementById('stat-warn'),statError=document.getElementById('stat-error');
  function run(){
    var tq=(q.value||'').toLowerCase().trim(),tl=lvl.value||'',ts=(src.value||'').toLowerCase().trim();
    var total=0,info=0,warn=0,error=0;
    rows.forEach(function(r){
      var ok=(!tq||r.dataset.search.indexOf(tq)!==-1)&&(!tl||r.dataset.level===tl)&&(!ts||r.dataset.source.indexOf(ts)!==-1);
      r.style.display=ok?'grid':'none';
      if(ok){
        total++;
        if(r.dataset.level==='INFO'){info++;}
        if(r.dataset.level==='WARN'){warn++;}
        if(r.dataset.level==='ERROR'){error++;}
      }
    });
    empty.style.display=total?'none':'block';
    statTotal.textContent=total; statInfo.textContent=info; statWarn.textContent=warn; statError.textContent=error;
  }
  [q,lvl,src].forEach(function(el){el.addEventListener('input',run);el.addEventListener('change',run);});
  run();
})();
</script>
<script src="/assets/vexus-api.js"></script>
<script src="/assets/vexus-auth.js"></script>
<script src="/assets/pages/logs.js"></script>
<script src="vexus-ui.js"></script>
</body>
</html>
