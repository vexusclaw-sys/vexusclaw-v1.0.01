<?php
$menuActive = 'config';
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Cache-Control: post-check=0, pre-check=0', false);
header('Pragma: no-cache');
header('Expires: 0');

$sections = [
  [
    'title' => 'Setup Wizard',
    'desc' => 'Setup wizard state and history.',
    'rows' => [
      ['name' => 'Wizard Last Run Timestamp', 'value' => '2026-03-08T11:47:58.472Z', 'tags' => ['advanced']],
      ['name' => 'Wizard Last Run Command', 'value' => 'onboard', 'tags' => ['advanced']],
      ['name' => 'Wizard Last Run Mode', 'value' => 'local | remote', 'tags' => ['advanced']],
      ['name' => 'Wizard Last Run Version', 'value' => '2026.3.7', 'tags' => ['advanced']],
    ],
  ],
  [
    'title' => 'Updates',
    'desc' => 'Auto-update settings and release channel.',
    'rows' => [
      ['name' => 'Auto Update Enabled', 'value' => 'false', 'tags' => ['advanced']],
      ['name' => 'Auto Update Beta Check Interval (hours)', 'value' => '1', 'tags' => ['performance']],
      ['name' => 'Auto Update Stable Delay (hours)', 'value' => '6', 'tags' => ['advanced']],
      ['name' => 'Update Channel', 'value' => 'stable | beta | dev', 'tags' => ['advanced']],
      ['name' => 'Update Check on Start', 'value' => 'true', 'tags' => ['automation']],
    ],
  ],
  [
    'title' => 'Diagnostics',
    'desc' => 'Diagnostics flags, cache trace and OpenTelemetry.',
    'rows' => [
      ['name' => 'Diagnostics Enabled', 'value' => 'true', 'tags' => ['observability']],
      ['name' => 'Cache Trace Enabled', 'value' => 'false', 'tags' => ['observability', 'storage']],
      ['name' => 'Cache Trace File Path', 'value' => '$OPENCLAW_STATE_DIR/logs/cache-trace.jsonl', 'tags' => ['observability', 'storage']],
      ['name' => 'OpenTelemetry Enabled', 'value' => 'false', 'tags' => ['observability']],
      ['name' => 'OpenTelemetry Protocol', 'value' => 'http/protobuf | grpc', 'tags' => ['observability']],
      ['name' => 'OpenTelemetry Trace Sample Rate', 'value' => '1.0', 'tags' => ['observability']],
    ],
  ],
  [
    'title' => 'Gateway',
    'desc' => 'Gateway server settings (port, auth, bind, control UI, TLS).',
    'rows' => [
      ['name' => 'Gateway Mode', 'value' => 'local | remote', 'tags' => ['network']],
      ['name' => 'Gateway Port', 'value' => '18789', 'tags' => ['network']],
      ['name' => 'Gateway Bind Mode', 'value' => 'auto | lan | loopback | custom | tailnet', 'tags' => ['network']],
      ['name' => 'Gateway Auth Mode', 'value' => 'none | token | password | trusted-proxy', 'tags' => ['network']],
      ['name' => 'Control UI Enabled', 'value' => 'true', 'tags' => ['network']],
      ['name' => 'Control UI Base Path', 'value' => '/openclaw', 'tags' => ['network', 'storage']],
      ['name' => 'Control UI Assets Root', 'value' => 'dist/control-ui', 'tags' => ['network']],
      ['name' => 'Config Reload Mode', 'value' => 'off | restart | hot | hybrid', 'tags' => ['network', 'reliability']],
      ['name' => 'Gateway TLS Enabled', 'value' => 'false', 'tags' => ['network']],
    ],
  ],
  [
    'title' => 'Agents',
    'desc' => 'Agent defaults, workspace and ACP controls.',
    'rows' => [
      ['name' => 'Workspace', 'value' => '/root/.openclaw/workspace', 'tags' => ['advanced']],
      ['name' => 'Max Concurrent', 'value' => '4', 'tags' => ['performance']],
      ['name' => 'Bootstrap Max Chars', 'value' => '20000', 'tags' => ['performance']],
      ['name' => 'Bootstrap Total Max Chars', 'value' => '150000', 'tags' => ['performance']],
      ['name' => 'ACP Enabled', 'value' => 'false', 'tags' => ['advanced']],
      ['name' => 'ACP Dispatch Enabled', 'value' => 'true', 'tags' => ['advanced']],
      ['name' => 'ACP Stream Delivery Mode', 'value' => 'live | final_only', 'tags' => ['advanced']],
    ],
  ],
  [
    'title' => 'Authentication',
    'desc' => 'API keys, auth profiles and cooldown policy.',
    'rows' => [
      ['name' => 'Auth Profiles', 'value' => 'openai-codex:default', 'tags' => ['auth', 'access', 'storage']],
      ['name' => 'Billing Backoff (hours)', 'value' => '5', 'tags' => ['auth', 'access', 'reliability']],
      ['name' => 'Billing Backoff Cap (hours)', 'value' => '24', 'tags' => ['auth', 'access', 'performance']],
      ['name' => 'Failover Window (hours)', 'value' => '24', 'tags' => ['auth', 'access']],
    ],
  ],
  [
    'title' => 'Tools',
    'desc' => 'Exec, policy allow/deny and web tools.',
    'rows' => [
      ['name' => 'Tool Profile', 'value' => 'minimal | coding | messaging | full', 'tags' => ['storage', 'tools']],
      ['name' => 'Tool Allowlist', 'value' => '0 items', 'tags' => ['access', 'tools']],
      ['name' => 'Tool Denylist', 'value' => '0 items', 'tags' => ['access', 'tools']],
      ['name' => 'Enable Elevated Tool Access', 'value' => 'false', 'tags' => ['tools']],
      ['name' => 'Exec Host', 'value' => 'sandbox | gateway | node', 'tags' => ['tools']],
      ['name' => 'Exec Security', 'value' => 'deny | allowlist | full', 'tags' => ['tools']],
      ['name' => 'Exec Ask', 'value' => 'off | on-miss | always', 'tags' => ['tools']],
      ['name' => 'Enable Link Understanding', 'value' => 'true', 'tags' => ['tools']],
    ],
  ],
  [
    'title' => 'Session',
    'desc' => 'Session routing, reset and maintenance policy.',
    'rows' => [
      ['name' => 'Session Scope', 'value' => 'per-sender | global', 'tags' => ['storage']],
      ['name' => 'DM Session Scope', 'value' => 'main | per-peer | per-channel-peer | per-account-channel-peer', 'tags' => ['storage']],
      ['name' => 'Session Maintenance Mode', 'value' => 'enforce | warn', 'tags' => ['storage']],
      ['name' => 'Session Max Entries', 'value' => '50000', 'tags' => ['performance', 'storage']],
      ['name' => 'Session Prune After', 'value' => '30d', 'tags' => ['storage']],
      ['name' => 'Session Reset Mode', 'value' => 'daily | idle', 'tags' => ['storage']],
      ['name' => 'Thread Binding Enabled', 'value' => 'true', 'tags' => ['storage']],
    ],
  ],
  [
    'title' => 'Cron',
    'desc' => 'Scheduled jobs, retry policy and retention.',
    'rows' => [
      ['name' => 'Cron Enabled', 'value' => 'true', 'tags' => ['automation']],
      ['name' => 'Cron Max Concurrent Runs', 'value' => '3', 'tags' => ['performance', 'automation']],
      ['name' => 'Cron Retry Max Attempts', 'value' => '3', 'tags' => ['reliability', 'performance', 'automation']],
      ['name' => 'Cron Retry Backoff (ms)', 'value' => '[30000, 60000, 300000]', 'tags' => ['reliability', 'automation']],
      ['name' => 'Cron Session Retention', 'value' => '24h', 'tags' => ['storage', 'automation']],
    ],
  ],
  [
    'title' => 'Hooks',
    'desc' => 'Webhooks, hook mappings and internal hooks.',
    'rows' => [
      ['name' => 'Hooks Enabled', 'value' => 'false', 'tags' => ['advanced']],
      ['name' => 'Hooks Endpoint Path', 'value' => '/hooks', 'tags' => ['storage']],
      ['name' => 'Hooks Max Body Bytes', 'value' => '1048576', 'tags' => ['performance']],
      ['name' => 'Hook Mappings', 'value' => '0 items', 'tags' => ['advanced']],
      ['name' => 'Hooks Auth Token', 'value' => '****', 'tags' => ['security', 'auth']],
    ],
  ],
  [
    'title' => 'Models',
    'desc' => 'Model catalog and provider routing.',
    'rows' => [
      ['name' => 'Model Catalog Mode', 'value' => 'merge | replace', 'tags' => ['models']],
      ['name' => 'Provider', 'value' => 'litellm', 'tags' => ['models']],
      ['name' => 'Model Provider Base URL', 'value' => 'http://127.0.0.1:4000/v1', 'tags' => ['models']],
      ['name' => 'Model Provider Auth Mode', 'value' => 'api-key | aws-sdk | oauth | token', 'tags' => ['models']],
      ['name' => 'Model Entry', 'value' => 'openai-pool', 'tags' => ['models']],
    ],
  ],
  [
    'title' => 'Channels / UI / Logging',
    'desc' => 'WhatsApp policy, UI preferences and log controls.',
    'rows' => [
      ['name' => 'WhatsApp DM Policy', 'value' => 'pairing | allowlist | open | disabled', 'tags' => ['access', 'network', 'channels']],
      ['name' => 'WhatsApp Message Debounce (ms)', 'value' => '0', 'tags' => ['network', 'performance', 'channels']],
      ['name' => 'Assistant Name', 'value' => 'VexusClaw', 'tags' => ['advanced']],
      ['name' => 'Accent Color', 'value' => '#b44dff', 'tags' => ['advanced']],
      ['name' => 'Log Level', 'value' => 'info', 'tags' => ['observability']],
      ['name' => 'Console Log Style', 'value' => 'pretty | compact | json', 'tags' => ['observability']],
      ['name' => 'Sensitive Data Redaction Mode', 'value' => 'off | tools', 'tags' => ['privacy', 'observability']],
    ],
  ],
];
?>
<!DOCTYPE html>
<html lang="pt-BR" style="color-scheme:dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>VexusClaw - Configuracoes</title>
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap" rel="stylesheet">
<style>
:root{--bg:#07030f;--bg-card:#0d0820;--bg-surface:#110c28;--bg-sidebar:#09051a;--bg-input:#0a0618;--border:#251a55;--border-light:#1a1035;--accent:#b44dff;--accent2:#8a2be2;--green:#44ffaa;--yellow:#ffbd2e;--red:#ff4444;--px-s:-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000}
*{margin:0;padding:0;box-sizing:border-box;color:#fff}
html,body{height:100%;overflow:hidden}
body{background:var(--bg);font-family:'VT323',monospace}
input,button{font-family:inherit}
body::before{content:'';position:fixed;inset:0;z-index:0;pointer-events:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect x='0' y='0' width='1' height='1' fill='%23ffffff' opacity='0.007'/%3E%3Crect x='2' y='2' width='1' height='1' fill='%23ffffff' opacity='0.007'/%3E%3C/svg%3E");background-size:4px 4px}
.main{display:flex;flex-direction:column;overflow:hidden}
.page-hdr{padding:18px 24px 14px;border-bottom:2px solid var(--border);background:rgba(9,5,26,.55);display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}
.page-title{font-family:'Press Start 2P',monospace;font-size:.96rem;text-shadow:var(--px-s);margin-bottom:6px}
.page-desc{font-size:1.3rem;color:rgba(255,255,255,.42);line-height:1.4;max-width:860px}
.page-body{padding:14px 18px 18px;flex:1;overflow:auto;display:flex;flex-direction:column;gap:12px}
.page-body::-webkit-scrollbar{width:5px}
.page-body::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}
.card{background:var(--bg-card);border:2px solid var(--border);border-radius:6px;box-shadow:4px 4px 0 rgba(0,0,0,.5)}
.toolbar{padding:10px 12px;display:flex;flex-wrap:wrap;align-items:center;gap:8px}
.inp{padding:8px 10px;background:var(--bg-input);border:2px solid var(--border);border-radius:4px;font-size:1.16rem;outline:none;min-width:260px}
.inp:focus{border-color:var(--accent)}
.meta{margin-left:auto;color:rgba(255,255,255,.55);font-size:1.08rem}
.cfg-list{display:flex;flex-direction:column;gap:10px}
.cfg-card{background:var(--bg-card);border:2px solid var(--border);border-radius:6px;box-shadow:4px 4px 0 rgba(0,0,0,.5);overflow:hidden}
.cfg-hdr{padding:12px 14px;border-bottom:2px solid var(--border-light);background:rgba(17,12,40,.6)}
.cfg-title{font-family:'Press Start 2P',monospace;font-size:.66rem;line-height:1.5;text-shadow:var(--px-s)}
.cfg-desc{font-size:1.14rem;color:rgba(255,255,255,.42);line-height:1.42;margin-top:5px}
.cfg-body{display:flex;flex-direction:column}
.cfg-row{padding:10px 14px;border-top:1px solid rgba(37,26,85,.5);display:grid;grid-template-columns:minmax(220px,1.25fr) minmax(180px,1fr) auto;gap:10px;align-items:center}
.cfg-row:first-child{border-top:none}
.cfg-name{font-family:'Press Start 2P',monospace;font-size:.45rem;color:rgba(255,255,255,.8);line-height:1.55}
.cfg-val{font-size:1.15rem;color:rgba(255,255,255,.92);line-height:1.38;word-break:break-word}
.cfg-tags{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end}
.tag{padding:3px 7px;border:1px solid var(--border);border-radius:999px;background:var(--bg-surface);font-family:'Press Start 2P',monospace;font-size:.36rem;line-height:1.3;color:rgba(255,255,255,.65)}
.empty{padding:14px 16px;border:2px dashed var(--border);border-radius:6px;background:rgba(17,12,40,.5);font-size:1.18rem;color:rgba(255,255,255,.45)}
@media(max-width:980px){
  .cfg-row{grid-template-columns:1fr;align-items:flex-start}
  .cfg-tags{justify-content:flex-start}
  .meta{margin-left:0}
}
@media(max-width:860px){
  .page-hdr{padding:14px}
  .page-body{padding:10px}
  .inp{min-width:100%}
}
</style>
</head>
<body>
<?php include __DIR__ . '/topbar.php'; ?>
<?php include __DIR__ . '/sidebar.php'; ?>
<main class="main" id="mainContent">
  <div class="page-hdr">
    <div>
      <div class="page-title">Configuracoes</div>
      <div class="page-desc">Organizacao da superficie de configuracao: setup, sessoes, hooks, modelos, canais e operacao.</div>
    </div>
  </div>

  <div class="page-body">
    <section class="card toolbar">
      <input class="inp" id="filterInput" type="text" placeholder="Search key, value or section">
      <div class="meta" id="shownCount">0 / 0 secoes</div>
    </section>

    <div class="cfg-list" id="sectionList">
      <?php foreach ($sections as $section): ?>
        <?php
          $search = strtolower($section['title'] . ' ' . $section['desc']);
          foreach ($section['rows'] as $row) {
            $search .= ' ' . strtolower($row['name'] . ' ' . $row['value'] . ' ' . implode(' ', $row['tags']));
          }
        ?>
        <section class="cfg-card" data-search="<?php echo htmlspecialchars($search, ENT_QUOTES, 'UTF-8'); ?>">
          <div class="cfg-hdr">
            <div class="cfg-title"><?php echo htmlspecialchars($section['title'], ENT_QUOTES, 'UTF-8'); ?></div>
            <div class="cfg-desc"><?php echo htmlspecialchars($section['desc'], ENT_QUOTES, 'UTF-8'); ?></div>
          </div>
          <div class="cfg-body">
            <?php foreach ($section['rows'] as $row): ?>
              <?php $rowSearch = strtolower($row['name'] . ' ' . $row['value'] . ' ' . implode(' ', $row['tags'])); ?>
              <article class="cfg-row" data-search="<?php echo htmlspecialchars($rowSearch, ENT_QUOTES, 'UTF-8'); ?>">
                <div class="cfg-name"><?php echo htmlspecialchars($row['name'], ENT_QUOTES, 'UTF-8'); ?></div>
                <div class="cfg-val"><?php echo htmlspecialchars($row['value'], ENT_QUOTES, 'UTF-8'); ?></div>
                <div class="cfg-tags">
                  <?php foreach ($row['tags'] as $tag): ?>
                    <span class="tag"><?php echo htmlspecialchars($tag, ENT_QUOTES, 'UTF-8'); ?></span>
                  <?php endforeach; ?>
                </div>
              </article>
            <?php endforeach; ?>
          </div>
        </section>
      <?php endforeach; ?>
    </div>

    <div id="emptyState" class="empty" style="display:none">Nenhuma secao encontrada para o filtro atual.</div>
  </div>
</main>

<script>
(function(){
  var input=document.getElementById('filterInput');
  var cards=[].slice.call(document.querySelectorAll('.cfg-card'));
  var shown=document.getElementById('shownCount');
  var empty=document.getElementById('emptyState');

  function run(){
    var term=(input.value||'').toLowerCase().trim();
    var visible=0;

    cards.forEach(function(card){
      var cardMatch=!term||card.dataset.search.indexOf(term)!==-1;
      var rows=[].slice.call(card.querySelectorAll('.cfg-row'));
      var rowVisible=0;

      rows.forEach(function(row){
        var ok=cardMatch||!term||row.dataset.search.indexOf(term)!==-1;
        row.style.display=ok?'grid':'none';
        if(ok){rowVisible++;}
      });

      var showCard=cardMatch||rowVisible>0||!term;
      card.style.display=showCard?'block':'none';
      if(showCard){visible++;}
    });

    shown.textContent=visible+' / '+cards.length+' secoes';
    empty.style.display=visible?'none':'block';
  }

  input.addEventListener('input',run);
  run();
})();
</script>
<script src="vexus-ui.js"></script>
</body>
</html>
