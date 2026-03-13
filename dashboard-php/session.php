<?php $menuActive = 'sessions'; ?>
<!DOCTYPE html>
<html lang="pt-BR" style="color-scheme:dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>VexusClaw — Sessões</title>
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap" rel="stylesheet">
<style>
:root{
  --bg:#07030f;--bg-card:#0d0820;--bg-surface:#110c28;--bg-sidebar:#09051a;--bg-input:#0a0618;
  --border:#251a55;--border-light:#1a1035;
  --accent:#b44dff;--accent2:#8a2be2;--accent-bright:#d088ff;
  --green:#44ffaa;--yellow:#ffbd2e;--red:#ff4444;
  --px-s:-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000;
  --px-sa:-1px -1px 0 #3d0070,1px -1px 0 #3d0070,-1px 1px 0 #3d0070,1px 1px 0 #3d0070;
  --sidebar-w:210px;--topbar-h:48px;
}
*{margin:0;padding:0;box-sizing:border-box;color:#fff}
html,body{height:100%;overflow:hidden}
body{background:var(--bg);font-family:'VT323',monospace;font-size:18px}
::selection{background:var(--accent2)}
a{text-decoration:none;color:inherit}
input,select,textarea,button{font-family:inherit}

body::before{content:'';position:fixed;inset:0;z-index:0;pointer-events:none;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect x='0' y='0' width='1' height='1' fill='%23ffffff' opacity='0.007'/%3E%3Crect x='2' y='2' width='1' height='1' fill='%23ffffff' opacity='0.007'/%3E%3C/svg%3E");
  background-size:4px 4px}

/* ══ TOPBAR ══ */
.topbar{position:fixed;top:0;left:0;right:0;z-index:200;height:var(--topbar-h);
  background:rgba(9,5,26,.97);border-bottom:2px solid var(--border);
  display:flex;align-items:center;padding:0 14px;
  box-shadow:0 2px 0 rgba(180,77,255,.05)}
.topbar::after{content:'';position:absolute;bottom:-4px;left:0;right:0;height:2px;
  background:repeating-linear-gradient(90deg,var(--accent) 0,var(--accent) 4px,transparent 4px,transparent 8px);opacity:.1}
.tb-hamburger{width:32px;height:32px;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:5px;cursor:pointer;border:none;background:none;border-radius:3px;transition:.2s;flex-shrink:0}
.tb-hamburger:hover{background:rgba(180,77,255,.1)}
.tb-hamburger span{display:block;width:18px;height:2px;background:rgba(255,255,255,.5);border-radius:1px}
.tb-logo{display:flex;align-items:center;gap:8px;margin-left:10px;margin-right:auto}
.tb-logo img{width:24px;height:24px;image-rendering:pixelated;filter:drop-shadow(0 0 5px rgba(180,77,255,.5))}
.tb-logo-name{font-family:'Press Start 2P',monospace;font-size:.52rem;text-shadow:var(--px-sa)}
.tb-logo-sub{font-family:'Press Start 2P',monospace;font-size:.28rem;color:rgba(255,255,255,.28);letter-spacing:2px}
.logo-blink{color:var(--accent-bright);animation:blink .9s step-end infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
.tb-right{display:flex;align-items:center;gap:8px}
.tb-badge{display:flex;align-items:center;gap:5px;padding:5px 9px;background:var(--bg-surface);border:1px solid var(--border);border-radius:3px;font-family:'Press Start 2P',monospace;font-size:.33rem;text-shadow:var(--px-s);box-shadow:2px 2px 0 rgba(0,0,0,.4)}
.tb-dot{width:7px;height:7px;border-radius:2px;flex-shrink:0;box-shadow:0 0 5px currentColor}
.tb-dot.green{background:var(--green);color:var(--green)}
.tb-dot.yellow{background:var(--yellow);color:var(--yellow)}
.tb-lbl{color:rgba(255,255,255,.38)}
.tb-val{color:rgba(255,255,255,.8)}
.tb-icon-btn{width:30px;height:30px;display:flex;align-items:center;justify-content:center;background:var(--bg-surface);border:1px solid var(--border);border-radius:3px;cursor:pointer;transition:.2s;box-shadow:2px 2px 0 rgba(0,0,0,.3)}
.tb-icon-btn:hover{border-color:var(--accent);background:rgba(180,77,255,.1)}
.tb-icon-btn svg{width:15px;height:15px;image-rendering:pixelated;opacity:.55}
.tb-icon-btn:hover svg{opacity:1}
.tb-avatar{width:30px;height:30px;background:linear-gradient(135deg,var(--accent),var(--accent2));border:2px solid var(--border);border-radius:3px;display:flex;align-items:center;justify-content:center;font-family:'Press Start 2P',monospace;font-size:.4rem;cursor:pointer;box-shadow:2px 2px 0 rgba(0,0,0,.4);flex-shrink:0;text-shadow:var(--px-s)}

/* ══ UPDATE BANNER ══ */
.update-banner{position:fixed;top:var(--topbar-h);left:var(--sidebar-w);right:0;z-index:150;
  padding:8px 20px;background:rgba(180,77,255,.07);border-bottom:2px solid rgba(180,77,255,.18);
  display:flex;align-items:center;justify-content:center;gap:12px;
  font-family:'Press Start 2P',monospace;font-size:.34rem;text-shadow:var(--px-s)}
.banner-text{color:var(--accent-bright);text-shadow:var(--px-sa)}
.banner-text span{color:rgba(255,255,255,.4)}
.banner-btn{padding:5px 10px;background:linear-gradient(135deg,var(--accent),var(--accent2));border:none;border-radius:3px;font-family:'Press Start 2P',monospace;font-size:.32rem;color:#fff;text-shadow:var(--px-s);cursor:pointer;box-shadow:2px 2px 0 #3d0070;transition:.15s}
.banner-btn:hover{transform:translate(-1px,-1px);box-shadow:3px 3px 0 #3d0070}
.banner-x{cursor:pointer;opacity:.35;transition:.2s;font-size:1rem;margin-left:4px}
.banner-x:hover{opacity:.9}

/* ══ SIDEBAR ══ */
.sidebar{position:fixed;top:var(--topbar-h);left:0;bottom:0;z-index:100;width:var(--sidebar-w);
  background:var(--bg-sidebar);border-right:2px solid var(--border);display:flex;flex-direction:column;overflow-y:auto;overflow-x:hidden}
.sidebar::-webkit-scrollbar{width:3px}
.sidebar::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}
.sg-label{display:flex;align-items:center;justify-content:space-between;padding:8px 14px 5px;
  font-family:'Press Start 2P',monospace;font-size:.28rem;color:rgba(255,255,255,.2);text-shadow:var(--px-s);letter-spacing:1px}
.sg-minus{color:rgba(255,255,255,.18);cursor:pointer;font-size:.75rem}
.nav-item{display:flex;align-items:center;gap:8px;padding:8px 14px;cursor:pointer;transition:.15s;border-left:2px solid transparent}
.nav-item:hover{background:rgba(180,77,255,.07);border-left-color:rgba(180,77,255,.18)}
.nav-item.active{background:rgba(180,77,255,.12);border-left-color:var(--accent)}
.nav-item svg{width:14px;height:14px;image-rendering:pixelated;flex-shrink:0;opacity:.45}
.nav-item:hover svg,.nav-item.active svg{opacity:.9}
.nav-lbl{font-family:'Press Start 2P',monospace;font-size:.36rem;color:rgba(255,255,255,.45);text-shadow:var(--px-s)}
.nav-item.active .nav-lbl{color:var(--accent-bright);text-shadow:var(--px-sa)}
.nav-badge{margin-left:auto;padding:2px 5px;background:var(--accent);border-radius:2px;font-family:'Press Start 2P',monospace;font-size:.28rem;text-shadow:var(--px-s);box-shadow:1px 1px 0 #3d0070}
.px-div{height:2px;background:repeating-linear-gradient(90deg,var(--accent) 0,var(--accent) 4px,transparent 4px,transparent 8px);opacity:.1}
.sb-bottom{margin-top:auto;border-top:2px solid var(--border);padding:10px 14px;display:flex;align-items:center;gap:8px}
.sb-avatar{width:26px;height:26px;background:linear-gradient(135deg,var(--accent),var(--accent2));border-radius:3px;display:flex;align-items:center;justify-content:center;font-family:'Press Start 2P',monospace;font-size:.34rem;flex-shrink:0;text-shadow:var(--px-s)}
.sb-name{font-family:'Press Start 2P',monospace;font-size:.34rem;text-shadow:var(--px-s);display:block}
.sb-status{font-family:'VT323',monospace;font-size:.8rem;color:var(--green);display:flex;align-items:center;gap:3px}
.sb-status::before{content:'';width:5px;height:5px;background:var(--green);border-radius:1px;box-shadow:0 0 4px var(--green)}

/* ══ MAIN ══ */
.main{position:fixed;top:calc(var(--topbar-h) + 36px);left:var(--sidebar-w);right:0;bottom:0;
  display:flex;flex-direction:column;overflow:hidden}

/* ══ PAGE HEADER ══ */
.page-hdr{padding:20px 26px 14px;border-bottom:2px solid var(--border);background:rgba(9,5,26,.5);flex-shrink:0}
.page-title{font-family:'Press Start 2P',monospace;font-size:.9rem;text-shadow:var(--px-s);margin-bottom:5px}
.page-desc{font-family:'VT323',monospace;font-size:1.22rem;color:rgba(255,255,255,.4)}

/* ══ CARD ══ */
.card{background:var(--bg-card);border:2px solid var(--border);border-radius:6px;
  box-shadow:4px 4px 0 rgba(0,0,0,.5);overflow:hidden;position:relative;flex-shrink:0}
.card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;
  background:repeating-linear-gradient(90deg,var(--accent) 0,var(--accent) 4px,transparent 4px,transparent 8px);opacity:.22}
.card-hdr{padding:14px 20px 12px;border-bottom:2px solid var(--border-light);display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap}
.card-title{font-family:'Press Start 2P',monospace;font-size:.58rem;text-shadow:var(--px-s);margin-bottom:3px}
.card-desc{font-family:'VT323',monospace;font-size:1.1rem;color:rgba(255,255,255,.35)}

/* ══ FILTERS ROW ══ */
.filters-row{display:flex;align-items:flex-end;gap:12px;padding:14px 20px;border-bottom:2px solid var(--border-light);flex-wrap:wrap}
.filter-group{display:flex;flex-direction:column;gap:5px}
.filter-label{font-family:'Press Start 2P',monospace;font-size:.34rem;color:rgba(255,255,255,.45);text-shadow:var(--px-s)}
.filter-input{padding:8px 10px;background:var(--bg-input);border:2px solid var(--border);
  box-shadow:inset 2px 2px 0 rgba(0,0,0,.35),2px 2px 0 rgba(0,0,0,.3);border-radius:4px;
  font-family:'VT323',monospace;font-size:1.2rem;color:#fff;outline:none;width:130px;transition:.2s}
.filter-input:focus{border-color:var(--accent);box-shadow:inset 2px 2px 0 rgba(0,0,0,.35),2px 2px 0 rgba(100,30,200,.2),0 0 0 3px rgba(180,77,255,.05)}
.filter-input::placeholder{color:rgba(255,255,255,.2)}
.filter-input.wide{width:90px}
.checkbox-row{display:flex;align-items:center;gap:6px;cursor:pointer;padding-bottom:9px}
.px-checkbox{width:16px;height:16px;border:2px solid var(--border);background:var(--bg-input);border-radius:3px;display:flex;align-items:center;justify-content:center;transition:.2s;flex-shrink:0;box-shadow:inset 1px 1px 0 rgba(0,0,0,.3)}
.px-checkbox.checked{background:var(--accent);border-color:var(--accent2);box-shadow:1px 1px 0 #3d0070}
.px-checkbox.checked::after{content:'';width:8px;height:6px;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 6'%3E%3Crect x='0' y='3' width='2' height='2' fill='white'/%3E%3Crect x='2' y='4' width='2' height='2' fill='white'/%3E%3Crect x='4' y='2' width='2' height='2' fill='white'/%3E%3Crect x='6' y='0' width='2' height='2' fill='white'/%3E%3C/svg%3E") no-repeat center;background-size:contain}
.checkbox-label{font-family:'Press Start 2P',monospace;font-size:.35rem;color:rgba(255,255,255,.52);text-shadow:var(--px-s)}
.store-label{font-family:'VT323',monospace;font-size:1.12rem;color:rgba(255,255,255,.38);padding-bottom:9px;margin-left:auto}

/* ══ TABLE ══ */
.sessions-scroll{flex:1;overflow-y:auto;overflow-x:auto}
.sessions-scroll::-webkit-scrollbar{width:5px;height:5px}
.sessions-scroll::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}
.sessions-table{width:100%;border-collapse:collapse;min-width:900px}
.sessions-table th{position:sticky;top:0;z-index:10;padding:9px 14px;background:var(--bg-surface);
  border-bottom:2px solid var(--border);font-family:'Press Start 2P',monospace;font-size:.34rem;
  color:rgba(255,255,255,.35);text-shadow:var(--px-s);text-align:left;font-weight:400;
  white-space:nowrap;letter-spacing:.5px}
.sessions-table th:first-child{padding-left:20px}
.sessions-table th.h-key,
.sessions-table th.h-updated,
.sessions-table th.h-tokens,
.sessions-table th.h-thinking,
.sessions-table th.h-actions{font-size:.44rem;color:rgba(255,255,255,.58)}
.sessions-table td{padding:0;border-bottom:1px solid rgba(37,26,85,.35);vertical-align:middle}
.sessions-table tr:last-child td{border-bottom:none}
.sessions-table tr:hover td{background:rgba(180,77,255,.04)}

/* key cell */
.key-cell{padding:12px 14px 12px 20px;min-width:220px}
.key-val{font-family:'Press Start 2P',monospace;font-size:.42rem;color:var(--accent-bright);text-shadow:var(--px-sa);word-break:break-all;line-height:1.8;cursor:pointer;transition:.2s}
.key-val:hover{color:#fff}
.key-sub{font-family:'VT323',monospace;font-size:1.08rem;color:rgba(255,255,255,.35);margin-top:3px}

/* label cell */
.label-cell{padding:12px 14px;min-width:130px}
.label-input{padding:7px 10px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);
  border-radius:3px;font-family:'VT323',monospace;font-size:1.08rem;color:rgba(255,255,255,.52);
  outline:none;width:120px;transition:.2s}
.label-input:focus{border-color:var(--accent);background:rgba(180,77,255,.06);color:#fff}
.label-input::placeholder{color:rgba(255,255,255,.2);font-style:italic}

/* kind cell */
.kind-cell{padding:12px 14px;white-space:nowrap}
.kind-badge{display:inline-flex;align-items:center;padding:3px 8px;border-radius:3px;font-family:'VT323',monospace;font-size:1.08rem}
.kind-badge.group{background:rgba(180,77,255,.12);border:1px solid rgba(180,77,255,.25);color:var(--accent-bright)}
.kind-badge.direct{background:rgba(68,255,170,.08);border:1px solid rgba(68,255,170,.18);color:rgba(68,255,170,.8)}

/* updated cell */
.updated-cell{padding:12px 14px;font-family:'Press Start 2P',monospace;font-size:.41rem;color:rgba(255,255,255,.62);text-shadow:var(--px-s);white-space:nowrap}

/* tokens cell */
.tokens-cell{padding:12px 14px;min-width:185px}
.token-bar-wrap{width:100%;height:4px;background:rgba(255,255,255,.06);border-radius:2px;margin-bottom:4px;overflow:hidden;border:1px solid rgba(255,255,255,.04)}
.token-bar{height:100%;border-radius:2px;transition:.5s}
.token-val{font-family:'Press Start 2P',monospace;font-size:.4rem;color:rgba(255,255,255,.62);text-shadow:var(--px-s);white-space:nowrap}

/* select dropdown */
.sel-cell{padding:12px 10px;min-width:110px}
.sel-cell.thinking-cell{padding-left:22px;min-width:155px}
.sel-cell.thinking-cell .px-select{min-width:130px}
.px-select{padding:5px 8px;background:var(--bg-surface);border:1px solid var(--border);border-radius:3px;
  font-family:'VT323',monospace;font-size:1.05rem;color:rgba(255,255,255,.72);outline:none;cursor:pointer;
  width:100%;transition:.2s;appearance:none;-webkit-appearance:none;box-shadow:1px 1px 0 rgba(0,0,0,.3)}
.px-select:focus{border-color:var(--accent);color:#fff}
.px-select:hover{border-color:rgba(180,77,255,.4);color:#fff}

/* delete btn */
.del-cell{padding:12px 14px 12px 10px;text-align:right}
.del-btn{padding:6px 12px;background:rgba(255,68,68,.08);border:1px solid rgba(255,68,68,.25);border-radius:3px;
  font-family:'Press Start 2P',monospace;font-size:.4rem;color:rgba(255,68,68,.75);text-shadow:var(--px-s);
  cursor:pointer;transition:.2s;box-shadow:2px 2px 0 rgba(0,0,0,.3)}
.del-btn:hover{background:rgba(255,68,68,.18);border-color:var(--red);color:var(--red);transform:translate(-1px,-1px);box-shadow:3px 3px 0 rgba(0,0,0,.3)}
.del-btn:active{transform:translate(1px,1px);box-shadow:1px 1px 0 rgba(0,0,0,.3)}

/* ══ BUTTONS ══ */
.btn{padding:8px 15px;border:2px solid var(--border);border-radius:4px;font-family:'Press Start 2P',monospace;font-size:.4rem;text-shadow:var(--px-s);cursor:pointer;transition:.2s;box-shadow:2px 2px 0 rgba(0,0,0,.4);background:var(--bg-surface);color:#fff}
.btn:hover{border-color:var(--accent);background:rgba(180,77,255,.1);transform:translate(-1px,-1px);box-shadow:3px 3px 0 rgba(0,0,0,.4)}
.btn:active{transform:translate(1px,1px);box-shadow:1px 1px 0}

@keyframes rowIn{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)}}
@keyframes rowDel{from{opacity:1;transform:translateX(0)}to{opacity:0;transform:translateX(20px)}}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
</style>
</head>
<body>

<!-- TOPBAR -->
<?php include __DIR__ . '/topbar.php'; ?>

<!-- SIDEBAR -->
<?php include __DIR__ . '/sidebar.php'; ?>

<!-- MAIN -->
<main class="main" id="mainContent">
  <div class="page-hdr">
    <div class="page-title">Sessões</div>
    <div class="page-desc">Inspecionar sessões ativas e ajustar padrões por sessão.</div>
  </div>

  <!-- Sessions Card -->
  <div class="card" style="margin:16px 26px 0;border-radius:6px 6px 0 0">
    <div class="card-hdr">
      <div>
        <div class="card-title">Sessions</div>
        <div class="card-desc">Active session keys and per-session overrides.</div>
      </div>
      <button class="btn" id="refreshBtn" onclick="handleRefresh()">Refresh</button>
    </div>

    <!-- Filters -->
    <div class="filters-row">
      <div class="filter-group">
        <span class="filter-label">Active within (minutes)</span>
        <input class="filter-input" type="number" id="filterMinutes" placeholder="" value="">
      </div>
      <div class="filter-group">
        <span class="filter-label">Limit</span>
        <input class="filter-input wide" type="number" id="filterLimit" value="120">
      </div>
      <div class="checkbox-row" onclick="toggleCheck('cbGlobal')" style="margin-top:18px">
        <div class="px-checkbox checked" id="cbGlobal"></div>
        <span class="checkbox-label">Include global</span>
      </div>
      <div class="checkbox-row" onclick="toggleCheck('cbUnknown')" style="margin-top:18px">
        <div class="px-checkbox" id="cbUnknown"></div>
        <span class="checkbox-label">Include unknown</span>
      </div>
      <div class="store-label">Store: (multiple)</div>
    </div>
  </div>

  <!-- Table -->
  <div class="sessions-scroll" style="margin:0 26px 20px;background:var(--bg-card);border:2px solid var(--border);border-top:none;border-radius:0 0 6px 6px;box-shadow:4px 4px 0 rgba(0,0,0,.5)">
    <table class="sessions-table" id="sessionsTable">
      <thead>
        <tr>
          <th class="h-key">Key</th>
          <th>Kind</th>
          <th class="h-updated">Updated</th>
          <th class="h-tokens">Tokens</th>
          <th class="h-thinking">Thinking</th>
          <th class="h-actions">Actions</th>
        </tr>
      </thead>
      <tbody id="sessionsBody">
        <!-- rows injected by JS -->
      </tbody>
    </table>
  </div>
</main>

<script>
const SESSIONS=[
  {key:'agent:main:whatsapp:group:1203634063073370920@g.us',sub:'whatsapp:g-vexuspay-testes',kind:'group',updated:'just now',tokens:8683,thinking:'inherit',verbose:'inherit',reasoning:'inherit'},
  {key:'agent:main:main',sub:'openclaw-tui',kind:'direct',updated:'11m ago',tokens:40837,thinking:'inherit',verbose:'inherit',reasoning:'inherit'},
  {key:'agent:gpt-plus-1:main',sub:'openclaw-tui',kind:'direct',updated:'14m ago',tokens:137087,thinking:'inherit',verbose:'inherit',reasoning:'inherit'},
  {key:'agent:main:openai:a1b2c3d4-e5f6-7890-abcd-ef1234567890',sub:'',kind:'direct',updated:'1h ago',tokens:24561,thinking:'inherit',verbose:'inherit',reasoning:'inherit'},
  {key:'agent:main:openai:b2c3d4e5-f6a7-8901-bcde-f12345678901',sub:'',kind:'direct',updated:'2h ago',tokens:18340,thinking:'inherit',verbose:'inherit',reasoning:'inherit'},
  {key:'agent:main:openai:c3d4e5f6-a7b8-9012-cdef-123456789012',sub:'',kind:'direct',updated:'3d ago',tokens:9598,thinking:'inherit',verbose:'inherit',reasoning:'inherit'},
  {key:'agent:main:openai:d4e5f6a7-b8c9-0123-defa-234567890123',sub:'',kind:'direct',updated:'3d ago',tokens:9605,thinking:'inherit',verbose:'inherit',reasoning:'inherit'},
  {key:'agent:main:openai:e5f6a7b8-c9d0-1234-efab-345678901234',sub:'',kind:'direct',updated:'3d ago',tokens:9593,thinking:'inherit',verbose:'inherit',reasoning:'inherit'},
  {key:'agent:main:openai:f6a7b8c9-d0e1-2345-fabc-456789012345',sub:'',kind:'direct',updated:'3d ago',tokens:9604,thinking:'inherit',verbose:'inherit',reasoning:'inherit'},
  {key:'agent:main:openai:a7b8c9d0-e1f2-3456-abcd-567890123456',sub:'',kind:'direct',updated:'3d ago',tokens:9595,thinking:'inherit',verbose:'inherit',reasoning:'inherit'},
  {key:'agent:main:openai:b8c9d0e1-f2a3-4567-bcde-678901234567',sub:'',kind:'direct',updated:'3d ago',tokens:9593,thinking:'inherit',verbose:'inherit',reasoning:'inherit'},
  {key:'agent:main:openai:c9d0e1f2-a3b4-5678-cdef-789012345678',sub:'',kind:'direct',updated:'3d ago',tokens:9566,thinking:'inherit',verbose:'inherit',reasoning:'inherit'},
];
const MAX_TOKENS=272000;

function getTokenColor(pct){
  if(pct>0.8)return'#ff4444';
  if(pct>0.5)return'var(--yellow)';
  return'var(--accent)';
}

function renderRows(data){
  const tbody=document.getElementById('sessionsBody');
  tbody.innerHTML='';
  data.forEach((s,i)=>{
    const pct=s.tokens/MAX_TOKENS;
    const color=getTokenColor(pct);
    const tr=document.createElement('tr');
    tr.id='row-'+i;
    tr.style.animation=`rowIn .25s ease-out ${i*0.03}s both`;
    tr.innerHTML=`
      <td class="key-cell">
        <div class="key-val" title="${s.key}">${s.key}</div>
        ${s.sub?`<div class="key-sub">${s.sub}</div>`:''}
      </td>
      <td class="kind-cell"><span class="kind-badge ${s.kind}">${s.kind}</span></td>
      <td class="updated-cell">${s.updated}</td>
      <td class="tokens-cell">
        <div class="token-bar-wrap"><div class="token-bar" style="width:${Math.max(pct*100,0.5)}%;background:${color}"></div></div>
        <div class="token-val">${s.tokens.toLocaleString()} / ${MAX_TOKENS.toLocaleString()}</div>
      </td>
      <td class="sel-cell thinking-cell"><select class="px-select"><option>inherit</option><option>enabled</option><option>disabled</option></select></td>
      <td class="del-cell"><button class="del-btn" onclick="deleteRow(${i})">Delete</button></td>`;
    tbody.appendChild(tr);
  });
}

function deleteRow(i){
  const row=document.getElementById('row-'+i);
  if(!row)return;
  row.style.animation='rowDel .25s ease-in both';
  setTimeout(()=>{
    SESSIONS.splice(i,1);
    renderRows(SESSIONS);
  },240);
}

function handleRefresh(){
  const btn=document.getElementById('refreshBtn');
  btn.innerHTML='<svg style="width:12px;height:12px;animation:spin .7s linear infinite;image-rendering:pixelated;vertical-align:middle" viewBox="0 0 16 16" fill="none"><rect x="4" y="2" width="8" height="2" fill="currentColor" opacity=".7"/><rect x="2" y="4" width="2" height="8" fill="currentColor" opacity=".5"/><rect x="12" y="4" width="2" height="8" fill="currentColor" opacity=".5"/><rect x="4" y="12" width="8" height="2" fill="currentColor" opacity=".5"/></svg>';
  setTimeout(()=>{btn.textContent='Refresh';renderRows(SESSIONS);},900);
}

function toggleCheck(id){
  document.getElementById(id).classList.toggle('checked');
}

renderRows(SESSIONS);
</script>
<script src="/assets/vexus-api.js"></script>
<script src="/assets/vexus-auth.js"></script>
<script src="/assets/pages/sessions.js"></script>
<script src="vexus-ui.js"></script>
</body>
</html>
