<?php $menuActive = 'instances'; ?>
<!DOCTYPE html>
<html lang="pt-BR" style="color-scheme:dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>VexusClaw — Instâncias</title>
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
body{background:var(--bg);font-family:'VT323',monospace;font-size:16px}
::selection{background:var(--accent2)}
a{text-decoration:none;color:inherit}

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
.main{position:fixed;top:calc(var(--topbar-h) + 36px);left:var(--sidebar-w);right:0;bottom:0;overflow-y:auto;overflow-x:hidden}
.main::-webkit-scrollbar{width:5px}
.main::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}

/* ══ PAGE ══ */
.page-hdr{padding:22px 26px 16px;border-bottom:2px solid var(--border);background:rgba(9,5,26,.5);position:relative;z-index:1}
.page-title{font-family:'Press Start 2P',monospace;font-size:.82rem;text-shadow:var(--px-s);margin-bottom:6px}
.page-desc{font-family:'VT323',monospace;font-size:1.05rem;color:rgba(255,255,255,.38)}
.page-body{padding:22px 26px;display:flex;flex-direction:column;gap:16px;position:relative;z-index:1}

/* ══ CARD ══ */
.card{background:var(--bg-card);border:2px solid var(--border);border-radius:6px;
  box-shadow:4px 4px 0 rgba(0,0,0,.5),0 0 30px rgba(180,77,255,.03);overflow:hidden;position:relative}
.card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;
  background:repeating-linear-gradient(90deg,var(--accent) 0,var(--accent) 4px,transparent 4px,transparent 8px);opacity:.22}
.card-hdr{padding:16px 20px 12px;border-bottom:2px solid var(--border-light);display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
.card-title{font-family:'Press Start 2P',monospace;font-size:.56rem;text-shadow:var(--px-s);margin-bottom:4px}
.card-desc{font-family:'VT323',monospace;font-size:.95rem;color:rgba(255,255,255,.32)}
.card-body{padding:0}

/* ══ BUTTONS ══ */
.btn{padding:8px 15px;border:2px solid var(--border);border-radius:4px;font-family:'Press Start 2P',monospace;font-size:.36rem;text-shadow:var(--px-s);cursor:pointer;transition:.2s;box-shadow:2px 2px 0 rgba(0,0,0,.4);background:var(--bg-surface);color:#fff}
.btn:hover{border-color:var(--accent);background:rgba(180,77,255,.1);transform:translate(-1px,-1px);box-shadow:3px 3px 0 rgba(0,0,0,.4)}
.btn:active{transform:translate(1px,1px);box-shadow:1px 1px 0 rgba(0,0,0,.4)}
.btn-primary{background:linear-gradient(135deg,var(--accent),var(--accent2));border-color:var(--accent2);box-shadow:3px 3px 0 #3d0070}
.btn-primary:hover{border-color:var(--accent-bright);box-shadow:4px 4px 0 #3d0070}

/* ══ INSTANCE ROW ══ */
.instance-row{padding:16px 20px;border-bottom:1px solid rgba(37,26,85,.4);transition:.2s;cursor:default}
.instance-row:last-child{border-bottom:none}
.instance-row:hover{background:rgba(180,77,255,.04)}
.inst-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:6px}
.inst-name{font-family:'Press Start 2P',monospace;font-size:.52rem;text-shadow:var(--px-s);color:#fff}
.inst-meta{text-align:right;display:flex;flex-direction:column;gap:3px;flex-shrink:0;margin-left:20px}
.inst-meta-row{font-family:'Press Start 2P',monospace;font-size:.3rem;color:rgba(255,255,255,.35);text-shadow:var(--px-s)}
.inst-meta-row span{color:rgba(255,255,255,.65)}
.inst-sub{font-family:'VT323',monospace;font-size:.95rem;color:rgba(255,255,255,.28);margin-bottom:10px}
.inst-tags{display:flex;flex-wrap:wrap;gap:6px}
.inst-tag{padding:4px 10px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:3px;
  font-family:'VT323',monospace;font-size:.95rem;color:rgba(255,255,255,.45);transition:.2s}
.inst-tag:hover{background:rgba(180,77,255,.08);border-color:rgba(180,77,255,.25);color:rgba(255,255,255,.75)}
.inst-tag.gateway{border-color:rgba(180,77,255,.3);color:var(--accent-bright);background:rgba(180,77,255,.08)}
.inst-tag.linux{border-color:rgba(68,255,170,.2);color:rgba(68,255,170,.7);background:rgba(68,255,170,.05)}
.inst-tag.version{border-color:rgba(255,189,46,.2);color:rgba(255,189,46,.7);background:rgba(255,189,46,.05)}

/* status dot */
.inst-status-dot{width:8px;height:8px;border-radius:2px;background:var(--green);box-shadow:0 0 6px rgba(68,255,170,.5);flex-shrink:0;animation:statusPulse 2s ease-in-out infinite}
@keyframes statusPulse{0%,100%{opacity:1;box-shadow:0 0 6px rgba(68,255,170,.5)}50%{opacity:.7;box-shadow:0 0 12px rgba(68,255,170,.8)}}

/* empty state */
.empty-state{padding:40px 20px;text-align:center}
.empty-title{font-family:'Press Start 2P',monospace;font-size:.44rem;color:rgba(255,255,255,.18);text-shadow:var(--px-s);margin-bottom:10px}
.empty-desc{font-family:'VT323',monospace;font-size:1rem;color:rgba(255,255,255,.2)}

/* add instance btn */
.add-inst-btn{display:flex;align-items:center;gap:8px;padding:10px 20px;background:rgba(180,77,255,.06);border:1px dashed rgba(180,77,255,.2);border-radius:4px;cursor:pointer;transition:.2s;font-family:'Press Start 2P',monospace;font-size:.36rem;color:rgba(255,255,255,.3);text-shadow:var(--px-s);width:100%}
.add-inst-btn:hover{background:rgba(180,77,255,.1);border-color:rgba(180,77,255,.4);color:var(--accent-bright)}

/* refresh animation */
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
.spinning{animation:spin .7s linear infinite}

/* page-in */
@keyframes pgIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.page-body{animation:pgIn .3s ease-out both}
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
    <div class="page-title">Instâncias</div>
    <div class="page-desc">Beacons de presença de clientes e nós conectados.</div>
  </div>
  <div class="page-body">

    <!-- Connected Instances Card -->
    <div class="card">
      <div class="card-hdr">
        <div>
          <div class="card-title">Connected Instances</div>
          <div class="card-desc">Presence beacons from the gateway and clients.</div>
        </div>
        <button class="btn" id="refreshBtn" onclick="handleRefresh()">Refresh</button>
      </div>
      <div class="card-body" id="instanceList">

        <!-- Instance 1 -->
        <div class="instance-row" id="inst-srv952686">
          <div class="inst-top">
            <div style="display:flex;align-items:center;gap:10px">
              <div class="inst-status-dot"></div>
              <span class="inst-name">srv952686</span>
            </div>
            <div class="inst-meta">
              <div class="inst-meta-row">just now</div>
              <div class="inst-meta-row">Last input <span>n/a</span></div>
              <div class="inst-meta-row">Reason <span>self</span></div>
            </div>
          </div>
          <div class="inst-sub">srv952686 (72.60.9.29) gateway 2026.3.7</div>
          <div class="inst-tags">
            <span class="inst-tag gateway">gateway</span>
            <span class="inst-tag">linux 6.8.0-101-generic</span>
            <span class="inst-tag linux">Linux</span>
            <span class="inst-tag">x64</span>
            <span class="inst-tag version">2026.3.7</span>
          </div>
        </div>

        <!-- Add instance row -->
        <div style="padding:10px 20px">
          <button class="add-inst-btn" onclick="addInstance()">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect x="5" y="1" width="2" height="10" fill="currentColor"/>
              <rect x="1" y="5" width="10" height="2" fill="currentColor"/>
            </svg>
            Registrar nova instância
          </button>
        </div>

      </div>
    </div>

    <!-- Stats row -->
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px">
      <div style="background:var(--bg-card);border:2px solid var(--border);border-radius:6px;padding:16px 18px;box-shadow:3px 3px 0 rgba(0,0,0,.4);position:relative;overflow:hidden">
        <div style="position:absolute;top:0;left:0;right:0;height:2px;background:repeating-linear-gradient(90deg,var(--green) 0,var(--green) 4px,transparent 4px,transparent 8px);opacity:.3"></div>
        <span style="font-family:'Press Start 2P',monospace;font-size:.3rem;color:rgba(255,255,255,.3);text-shadow:var(--px-s);display:block;margin-bottom:8px;letter-spacing:1px">INSTÂNCIAS ATIVAS</span>
        <span id="activeCount" style="font-family:'Press Start 2P',monospace;font-size:1.6rem;text-shadow:var(--px-s);color:var(--green);text-shadow:0 0 12px rgba(68,255,170,.3);display:block;margin-bottom:6px">1</span>
        <span style="font-family:'VT323',monospace;font-size:.95rem;color:rgba(255,255,255,.28)">Online agora</span>
      </div>
      <div style="background:var(--bg-card);border:2px solid var(--border);border-radius:6px;padding:16px 18px;box-shadow:3px 3px 0 rgba(0,0,0,.4);position:relative;overflow:hidden">
        <div style="position:absolute;top:0;left:0;right:0;height:2px;background:repeating-linear-gradient(90deg,var(--accent) 0,var(--accent) 4px,transparent 4px,transparent 8px);opacity:.25"></div>
        <span style="font-family:'Press Start 2P',monospace;font-size:.3rem;color:rgba(255,255,255,.3);text-shadow:var(--px-s);display:block;margin-bottom:8px;letter-spacing:1px">TIPO</span>
        <span style="font-family:'Press Start 2P',monospace;font-size:1rem;text-shadow:var(--px-s);color:var(--accent-bright);display:block;margin-bottom:6px">gateway</span>
        <span style="font-family:'VT323',monospace;font-size:.95rem;color:rgba(255,255,255,.28)">Modo de operação</span>
      </div>
      <div style="background:var(--bg-card);border:2px solid var(--border);border-radius:6px;padding:16px 18px;box-shadow:3px 3px 0 rgba(0,0,0,.4);position:relative;overflow:hidden">
        <div style="position:absolute;top:0;left:0;right:0;height:2px;background:repeating-linear-gradient(90deg,var(--yellow) 0,var(--yellow) 4px,transparent 4px,transparent 8px);opacity:.2"></div>
        <span style="font-family:'Press Start 2P',monospace;font-size:.3rem;color:rgba(255,255,255,.3);text-shadow:var(--px-s);display:block;margin-bottom:8px;letter-spacing:1px">VERSÃO</span>
        <span style="font-family:'Press Start 2P',monospace;font-size:1rem;text-shadow:var(--px-s);color:var(--yellow);display:block;margin-bottom:6px">2026.3.7</span>
        <span style="font-family:'VT323',monospace;font-size:.95rem;color:rgba(255,255,255,.28)">Gateway build</span>
      </div>
    </div>

  </div>
</main>

<script>
let instances=[
  {id:'srv952686',ip:'72.60.9.29',time:'just now',lastInput:'n/a',reason:'self',tags:['gateway','linux 6.8.0-101-generic','Linux','x64','2026.3.7']},
];
let refreshing=false;

function handleRefresh(){
  if(refreshing)return;
  refreshing=true;
  const btn=document.getElementById('refreshBtn');
  btn.innerHTML='<svg id="spinSvg" style="width:14px;height:14px;animation:spin .7s linear infinite;image-rendering:pixelated" viewBox="0 0 16 16" fill="none"><rect x="4" y="2" width="8" height="2" fill="currentColor" opacity=".7"/><rect x="2" y="4" width="2" height="8" fill="currentColor" opacity=".5"/><rect x="12" y="4" width="2" height="8" fill="currentColor" opacity=".5"/><rect x="4" y="12" width="8" height="2" fill="currentColor" opacity=".5"/></svg>';
  setTimeout(()=>{
    refreshing=false;
    btn.textContent='Refresh';
    // flash the instance row
    const row=document.getElementById('inst-srv952686');
    row.style.background='rgba(68,255,170,.06)';
    setTimeout(()=>{row.style.background=''},500);
  },900);
}

let newInstCount=0;
function addInstance(){
  newInstCount++;
  const id='client-'+Math.random().toString(36).slice(2,10);
  const ips=['10.0.0.'+Math.floor(Math.random()*254+1),'192.168.1.'+Math.floor(Math.random()*254+1),'172.16.0.'+Math.floor(Math.random()*254+1)];
  const ip=ips[Math.floor(Math.random()*ips.length)];
  const list=document.getElementById('instanceList');
  const addBtn=list.lastElementChild;
  const row=document.createElement('div');
  row.className='instance-row';
  row.id='inst-'+id;
  row.style.animation='pgIn .35s ease-out both';
  row.innerHTML=`
    <div class="inst-top">
      <div style="display:flex;align-items:center;gap:10px">
        <div class="inst-status-dot"></div>
        <span class="inst-name">${id}</span>
      </div>
      <div class="inst-meta">
        <div class="inst-meta-row">just now</div>
        <div class="inst-meta-row">Last input <span>n/a</span></div>
        <div class="inst-meta-row">Reason <span>connect</span></div>
      </div>
    </div>
    <div class="inst-sub">${id} (${ip}) client 2026.3.7</div>
    <div class="inst-tags">
      <span class="inst-tag">client</span>
      <span class="inst-tag linux">Linux</span>
      <span class="inst-tag">x64</span>
      <span class="inst-tag version">2026.3.7</span>
    </div>`;
  list.insertBefore(row,addBtn);
  document.getElementById('activeCount').textContent=list.querySelectorAll('.instance-row').length;
}

// @keyframes for spin
const st=document.createElement('style');
st.textContent='@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}@keyframes pgIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}';
document.head.appendChild(st);
</script>
<script src="vexus-ui.js"></script>
</body>
</html>
