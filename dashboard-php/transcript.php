<?php
$menuActive = 'sessions';
require __DIR__ . '/includes/app-bootstrap.php';
?>
<!DOCTYPE html>
<html lang="pt-BR" style="color-scheme:dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>VexusClaw - Transcript</title>
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap" rel="stylesheet">
<style>
:root{--bg:#07030f;--bg-card:#0d0820;--bg-surface:#110c28;--border:#251a55;--border-light:#1a1035;--accent:#b44dff;--accent2:#8a2be2;--green:#44ffaa;--yellow:#ffbd2e;--red:#ff4444;--px-s:-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000}
*{box-sizing:border-box;color:#fff}
html,body{height:100%;overflow:hidden}
body{margin:0;background:var(--bg);font-family:'VT323',monospace}
.main{display:flex;flex-direction:column;overflow:hidden}
.page-hdr{padding:18px 24px 14px;border-bottom:2px solid var(--border);background:rgba(9,5,26,.55);display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap}
.page-title{font-family:'Press Start 2P',monospace;font-size:.84rem;line-height:1.8;text-shadow:var(--px-s);margin-bottom:6px}
.page-desc{font-size:1.2rem;color:rgba(255,255,255,.42)}
.page-body{padding:14px 18px 18px;overflow:auto;display:grid;grid-template-columns:1.25fr .75fr;gap:12px}
.page-body::-webkit-scrollbar{width:5px}.page-body::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}
.card{background:var(--bg-card);border:2px solid var(--border);border-radius:6px;box-shadow:4px 4px 0 rgba(0,0,0,.45);overflow:hidden}
.card-hdr{padding:14px 16px 12px;border-bottom:2px solid var(--border-light)}
.card-title{font-family:'Press Start 2P',monospace;font-size:.58rem;line-height:1.8;text-shadow:var(--px-s)}
.card-sub{font-size:1.08rem;color:rgba(255,255,255,.4)}
.card-body{padding:14px 16px}
.btn{padding:9px 12px;border:2px solid var(--border);border-radius:4px;background:var(--bg-surface);cursor:pointer;font-family:'Press Start 2P',monospace;font-size:.42rem;box-shadow:2px 2px 0 rgba(0,0,0,.35)}
.btn:hover{border-color:var(--accent)}
.messages{display:flex;flex-direction:column;gap:10px}
.msg{padding:12px;border:1px solid var(--border);border-radius:5px;background:var(--bg-surface)}
.msg-role{font-family:'Press Start 2P',monospace;font-size:.38rem;color:rgba(255,255,255,.55);margin-bottom:8px}
.msg-role.user{color:var(--yellow)}.msg-role.assistant{color:var(--green)}.msg-role.tool{color:var(--accent)}
.msg-body{font-size:1.12rem;line-height:1.5;white-space:pre-wrap}
.meta-list{display:flex;flex-direction:column;gap:10px}
.meta-item{padding:10px 12px;background:var(--bg-surface);border:1px solid var(--border);border-radius:4px}
.meta-k{font-family:'Press Start 2P',monospace;font-size:.4rem;color:rgba(255,255,255,.58)}
.meta-v{font-size:1.08rem;color:rgba(255,255,255,.82);margin-top:4px;line-height:1.45;word-break:break-word}
.empty{padding:12px;border:1px dashed rgba(255,255,255,.15);border-radius:4px;color:rgba(255,255,255,.45)}
@media(max-width:980px){.page-body{grid-template-columns:1fr}}
</style>
</head>
<body>
<?php include __DIR__ . '/topbar.php'; ?>
<?php include __DIR__ . '/sidebar.php'; ?>
<main class="main" id="mainContent">
  <div class="page-hdr">
    <div>
      <div class="page-title" id="transcriptTitle">Transcript</div>
      <div class="page-desc" id="transcriptMeta">Carregando sessao...</div>
    </div>
    <button class="btn" id="transcriptRefreshBtn" type="button">Refresh</button>
  </div>
  <div class="page-body">
    <section class="card">
      <div class="card-hdr">
        <div class="card-title">Mensagens</div>
        <div class="card-sub">Transcript real persistido no backend.</div>
      </div>
      <div class="card-body">
        <div class="messages" id="transcriptMessages">
          <div class="empty">Nenhuma mensagem carregada ainda.</div>
        </div>
      </div>
    </section>
    <section class="card">
      <div class="card-hdr">
        <div class="card-title">Resumo</div>
        <div class="card-sub">Metadados da sessao, agente e canal.</div>
      </div>
      <div class="card-body">
        <div class="meta-list" id="transcriptSummary"></div>
      </div>
    </section>
  </div>
</main>
<script src="/assets/vexus-api.js"></script>
<script src="/assets/vexus-auth.js"></script>
<script src="/assets/pages/transcript.js"></script>
</body>
</html>
