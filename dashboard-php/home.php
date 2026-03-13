<?php $menuActive = 'chat'; ?>
<!DOCTYPE html>
<html lang="pt-BR" style="color-scheme:dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>VexusClaw — Chat</title>
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
.tb-logo-name{font-family:'Press Start 2P',monospace;font-size:.62rem;text-shadow:var(--px-sa)}
.tb-logo-sub{font-family:'Press Start 2P',monospace;font-size:.35rem;color:rgba(255,255,255,.28);letter-spacing:2px}
.logo-blink{color:var(--accent-bright);animation:blink .9s step-end infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
.tb-right{display:flex;align-items:center;gap:8px}
.tb-badge{display:flex;align-items:center;gap:5px;padding:5px 10px;background:var(--bg-surface);border:1px solid var(--border);border-radius:3px;font-family:'Press Start 2P',monospace;font-size:.4rem;text-shadow:var(--px-s);box-shadow:2px 2px 0 rgba(0,0,0,.4)}
.tb-dot{width:7px;height:7px;border-radius:2px;flex-shrink:0;box-shadow:0 0 5px currentColor}
.tb-dot.green{background:var(--green);color:var(--green)}
.tb-dot.yellow{background:var(--yellow);color:var(--yellow)}
.tb-lbl{color:rgba(255,255,255,.38)}
.tb-val{color:rgba(255,255,255,.8)}
.tb-icon-btn{width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:var(--bg-surface);border:1px solid var(--border);border-radius:3px;cursor:pointer;transition:.2s;box-shadow:2px 2px 0 rgba(0,0,0,.3)}
.tb-icon-btn:hover{border-color:var(--accent);background:rgba(180,77,255,.1)}
.tb-icon-btn svg{width:16px;height:16px;image-rendering:pixelated;opacity:.55}
.tb-icon-btn:hover svg{opacity:1}
.tb-avatar{width:32px;height:32px;background:linear-gradient(135deg,var(--accent),var(--accent2));border:2px solid var(--border);border-radius:3px;display:flex;align-items:center;justify-content:center;font-family:'Press Start 2P',monospace;font-size:.46rem;cursor:pointer;box-shadow:2px 2px 0 rgba(0,0,0,.4);flex-shrink:0;text-shadow:var(--px-s)}

/* ══ UPDATE BANNER ══ */
.update-banner{position:fixed;top:var(--topbar-h);left:var(--sidebar-w);right:0;z-index:150;
  padding:8px 20px;background:rgba(180,77,255,.07);border-bottom:2px solid rgba(180,77,255,.18);
  display:flex;align-items:center;justify-content:center;gap:12px;
  font-family:'Press Start 2P',monospace;font-size:.4rem;text-shadow:var(--px-s)}
.banner-text{color:var(--accent-bright);text-shadow:var(--px-sa)}
.banner-text span{color:rgba(255,255,255,.4)}
.banner-btn{padding:6px 12px;background:linear-gradient(135deg,var(--accent),var(--accent2));border:none;border-radius:3px;font-family:'Press Start 2P',monospace;font-size:.38rem;color:#fff;text-shadow:var(--px-s);cursor:pointer;box-shadow:2px 2px 0 #3d0070;transition:.15s}
.banner-btn:hover{transform:translate(-1px,-1px);box-shadow:3px 3px 0 #3d0070}
.banner-x{cursor:pointer;opacity:.35;transition:.2s;font-size:1.2rem;margin-left:4px}
.banner-x:hover{opacity:.9}

/* ══ SIDEBAR ══ */
.sidebar{position:fixed;top:var(--topbar-h);left:0;bottom:0;z-index:100;width:var(--sidebar-w);
  background:var(--bg-sidebar);border-right:2px solid var(--border);display:flex;flex-direction:column;overflow-y:auto;overflow-x:hidden}
.sidebar::-webkit-scrollbar{width:3px}
.sidebar::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}
.sg-label{display:flex;align-items:center;justify-content:space-between;padding:8px 14px 5px;
  font-family:'Press Start 2P',monospace;font-size:.46rem;color:rgba(255,255,255,.2);text-shadow:var(--px-s);letter-spacing:1px}
.sg-minus{color:rgba(255,255,255,.18);cursor:pointer;font-size:1rem}
.nav-item{display:flex;align-items:center;gap:8px;padding:10px 14px;cursor:pointer;transition:.15s;border-left:2px solid transparent}
.nav-item:hover{background:rgba(180,77,255,.07);border-left-color:rgba(180,77,255,.18)}
.nav-item.active{background:rgba(180,77,255,.12);border-left-color:var(--accent)}
.nav-item svg{width:16px;height:16px;image-rendering:pixelated;flex-shrink:0;opacity:.45}
.nav-item:hover svg,.nav-item.active svg{opacity:.9}
.nav-lbl{font-family:'Press Start 2P',monospace;font-size:.54rem;color:rgba(255,255,255,.45);text-shadow:var(--px-s)}
.nav-item.active .nav-lbl{color:var(--accent-bright);text-shadow:var(--px-sa)}
.nav-badge{margin-left:auto;padding:3px 7px;background:var(--accent);border-radius:2px;font-family:'Press Start 2P',monospace;font-size:.44rem;text-shadow:var(--px-s);box-shadow:1px 1px 0 #3d0070}
.px-div{height:2px;background:repeating-linear-gradient(90deg,var(--accent) 0,var(--accent) 4px,transparent 4px,transparent 8px);opacity:.1}
.sb-bottom{margin-top:auto;border-top:2px solid var(--border);padding:10px 14px;display:flex;align-items:center;gap:8px}
.sb-avatar{width:28px;height:28px;background:linear-gradient(135deg,var(--accent),var(--accent2));border-radius:3px;display:flex;align-items:center;justify-content:center;font-family:'Press Start 2P',monospace;font-size:.4rem;flex-shrink:0;text-shadow:var(--px-s)}
.sb-name{font-family:'Press Start 2P',monospace;font-size:.4rem;text-shadow:var(--px-s);display:block}
.sb-status{font-family:'VT323',monospace;font-size:1rem;color:var(--green);display:flex;align-items:center;gap:3px}
.sb-status::before{content:'';width:6px;height:6px;background:var(--green);border-radius:1px;box-shadow:0 0 4px var(--green)}

/* ══ MAIN ══ */
.main{position:fixed;top:calc(var(--topbar-h) + 38px);left:var(--sidebar-w);right:0;bottom:0;
  display:flex;flex-direction:column;overflow:hidden}
.main.no-banner{top:var(--topbar-h)}

/* ══ PAGE HEADER ══ */
.chat-page-hdr{padding:14px 24px 12px;border-bottom:2px solid var(--border);background:rgba(9,5,26,.6);
  flex-shrink:0;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
.chat-page-title{font-family:'Press Start 2P',monospace;font-size:.82rem;text-shadow:var(--px-s);margin-bottom:4px}
.chat-page-desc{font-family:'VT323',monospace;font-size:1.2rem;color:rgba(255,255,255,.38)}

/* header actions */
.hdr-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.session-sel{display:flex;align-items:center;background:var(--bg-surface);border:2px solid var(--border);border-radius:4px;box-shadow:2px 2px 0 rgba(0,0,0,.4);overflow:hidden}
.sess-val{padding:7px 12px;font-family:'Press Start 2P',monospace;font-size:.44rem;text-shadow:var(--px-s);white-space:nowrap;cursor:pointer}
.sess-arr{padding:7px 10px;border-left:2px solid var(--border);cursor:pointer;display:flex;align-items:center;background:rgba(180,77,255,.04);transition:.2s}
.sess-arr:hover{background:rgba(180,77,255,.12)}
.hdr-sep{width:2px;height:28px;background:var(--border);flex-shrink:0}
.hdr-btn{width:36px;height:36px;display:flex;align-items:center;justify-content:center;background:var(--bg-surface);border:2px solid var(--border);border-radius:4px;cursor:pointer;transition:.2s;box-shadow:2px 2px 0 rgba(0,0,0,.3);flex-shrink:0}
.hdr-btn:hover{border-color:var(--accent);background:rgba(180,77,255,.1)}
.hdr-btn.danger{border-color:rgba(255,68,68,.3);background:rgba(255,68,68,.06)}
.hdr-btn.danger:hover{border-color:var(--red);background:rgba(255,68,68,.12)}
.hdr-btn.warn{border-color:rgba(255,189,46,.3);background:rgba(255,189,46,.06)}
.hdr-btn.warn:hover{border-color:var(--yellow);background:rgba(255,189,46,.12)}
.hdr-btn svg{width:18px;height:18px;image-rendering:pixelated;opacity:.65}
.hdr-btn:hover svg,.hdr-btn.danger:hover svg,.hdr-btn.warn:hover svg{opacity:1}

/* ══ CHAT AREA ══ */
.chat-area{flex:1;overflow-y:auto;padding:20px 28px;display:flex;flex-direction:column;gap:16px}
.chat-area::-webkit-scrollbar{width:5px}
.chat-area::-webkit-scrollbar-track{background:transparent}
.chat-area::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}

/* date divider */
.date-div{display:flex;align-items:center;gap:10px;padding:2px 0;margin:4px 0}
.date-div::before,.date-div::after{content:'';flex:1;height:1px;background:repeating-linear-gradient(90deg,var(--border) 0,var(--border) 4px,transparent 4px,transparent 8px)}
.date-div span{font-family:'Press Start 2P',monospace;font-size:.35rem;color:rgba(255,255,255,.2);flex-shrink:0;white-space:nowrap}

/* user message (right) */
.msg-row-right{display:flex;align-items:flex-end;gap:10px;justify-content:flex-end}
.msg-meta-right{display:flex;align-items:center;gap:8px;margin-bottom:5px;justify-content:flex-end}
.msg-sender{font-family:'VT323',monospace;font-size:1.1rem;color:rgba(255,255,255,.35)}
.msg-time{font-family:'VT323',monospace;font-size:1.1rem;color:rgba(255,255,255,.28)}
.msg-bubble-right{max-width:62%;background:rgba(180,77,255,.1);border:2px solid rgba(180,77,255,.22);
  border-radius:8px 2px 8px 8px;padding:13px 16px;box-shadow:3px 3px 0 rgba(0,0,0,.4)}
.msg-bubble-right p{font-family:'VT323',monospace;font-size:1.25rem;color:rgba(255,255,255,.85);line-height:1.55}
.msg-bubble-right p+p{margin-top:4px}
.msg-av-r{width:32px;height:32px;background:linear-gradient(135deg,var(--accent),var(--accent2));border-radius:4px;
  display:flex;align-items:center;justify-content:center;font-family:'Press Start 2P',monospace;
  font-size:.44rem;flex-shrink:0;box-shadow:2px 2px 0 rgba(0,0,0,.4);text-shadow:var(--px-s)}

/* bot message (left) */
.msg-row-left{display:flex;align-items:flex-start;gap:10px}
.msg-av-l{width:36px;height:36px;flex-shrink:0;border-radius:4px;border:2px solid var(--border);background:var(--bg-surface);
  display:flex;align-items:center;justify-content:center;overflow:hidden;box-shadow:2px 2px 0 rgba(0,0,0,.4)}
.msg-av-l img{width:30px;height:30px;image-rendering:pixelated}
.msg-bot-wrap{max-width:62%}
.msg-bot-name{font-family:'Press Start 2P',monospace;font-size:.60rem;color:var(--accent-bright);text-shadow:var(--px-sa);margin-bottom:5px;display:flex;align-items:center;gap:8px}
.msg-bot-time{font-family:'Press Start 2P',monospace;font-size:.34rem;color:rgba(255,255,255,.22);font-weight:normal}
.msg-bubble-left{background:var(--bg-surface);border:2px solid var(--border);border-radius:2px 8px 8px 8px;
  padding:13px 16px;box-shadow:3px 3px 0 rgba(0,0,0,.4);
  font-family:'VT323',monospace;font-size:1.25rem;color:rgba(255,255,255,.88);line-height:1.55}
.msg-bubble-left code{font-family:'VT323',monospace;background:rgba(180,77,255,.12);border:1px solid rgba(180,77,255,.2);padding:1px 6px;border-radius:2px;color:var(--accent-bright)}

/* typing */
.typing-wrap{display:flex;align-items:center;gap:5px;padding:11px 16px;background:var(--bg-surface);
  border:2px solid var(--border);border-radius:2px 8px 8px 8px;box-shadow:3px 3px 0 rgba(0,0,0,.4);width:fit-content}
.t-dot{width:9px;height:9px;background:var(--accent);border-radius:2px;animation:tBounce 1.2s ease-in-out infinite;box-shadow:1px 1px 0 rgba(0,0,0,.3)}
.t-dot:nth-child(2){animation-delay:.2s}.t-dot:nth-child(3){animation-delay:.4s}
@keyframes tBounce{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-7px);opacity:1}}

/* ══ INPUT AREA ══ */
.chat-input-area{border-top:2px solid var(--border);padding:12px 24px 14px;background:rgba(9,5,26,.85);
  flex-shrink:0;display:flex;align-items:flex-end;gap:10px}
.input-wrap{flex:1;position:relative}
.chat-input{width:100%;min-height:54px;max-height:160px;padding:14px 16px;
  background:var(--bg-surface);border:2px solid var(--border);
  box-shadow:inset 2px 2px 0 rgba(0,0,0,.35),3px 3px 0 rgba(0,0,0,.3);border-radius:5px;
  font-family:'VT323',monospace;font-size:1.3rem;color:#fff;outline:none;resize:none;line-height:1.5;transition:.2s}
.chat-input:focus{border-color:var(--accent);box-shadow:inset 2px 2px 0 rgba(0,0,0,.35),3px 3px 0 rgba(100,30,200,.25),0 0 0 3px rgba(180,77,255,.06)}
.chat-input::placeholder{color:rgba(255,255,255,.18)}
.input-btns{display:flex;flex-direction:column;gap:8px}
.btn-new{padding:10px 14px;background:var(--bg-surface);border:2px solid var(--border);border-radius:4px;
  font-family:'Press Start 2P',monospace;font-size:.42rem;color:rgba(255,255,255,.55);text-shadow:var(--px-s);
  cursor:pointer;transition:.2s;box-shadow:2px 2px 0 rgba(0,0,0,.3);white-space:nowrap}
.btn-new:hover{border-color:var(--accent);color:#fff;background:rgba(180,77,255,.08)}
.btn-send{padding:11px 18px;background:linear-gradient(135deg,var(--accent),var(--accent2));border:none;border-radius:4px;
  font-family:'Press Start 2P',monospace;font-size:.44rem;color:#fff;text-shadow:var(--px-s);
  cursor:pointer;transition:.2s;box-shadow:3px 3px 0 #3d0070;white-space:nowrap;display:flex;align-items:center;gap:8px}
.btn-send:hover{transform:translate(-1px,-1px);box-shadow:4px 4px 0 #3d0070}
.btn-send:active{transform:translate(1px,1px);box-shadow:1px 1px 0 #3d0070}
.btn-send svg{width:15px;height:15px;image-rendering:pixelated}

/* message animation */
@keyframes msgIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
</style>
</head>
<body>

<!-- TOPBAR -->
<?php include __DIR__ . '/topbar.php'; ?>

<!-- SIDEBAR -->
<?php include __DIR__ . '/sidebar.php'; ?>

<!-- MAIN -->
<main class="main" id="mainContent">

  <!-- Page Header -->
  <div class="chat-page-hdr">
    <div>
      <div class="chat-page-title">Chat</div>
      <div class="chat-page-desc">Sessão de chat direta com o gateway para intervenções rápidas.</div>
    </div>
    <div class="hdr-actions">
      <!-- Session selector -->
      <div class="session-sel">
        <span class="sess-val" id="sessVal">vexusclaw-tui</span>
        <div class="sess-arr" onclick="cycleSess()">
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <rect x="5" y="7" width="2" height="2" fill="currentColor" opacity=".5"/>
            <rect x="3" y="5" width="2" height="2" fill="currentColor" opacity=".5"/>
            <rect x="7" y="5" width="2" height="2" fill="currentColor" opacity=".5"/>
            <rect x="1" y="3" width="2" height="2" fill="currentColor" opacity=".5"/>
            <rect x="9" y="3" width="2" height="2" fill="currentColor" opacity=".5"/>
          </svg>
        </div>
      </div>

      <!-- Refresh -->
      <div class="hdr-btn" title="Recarregar" onclick="botMsg('Sessão recarregada! Gateway OK. ✓')">
        <svg viewBox="0 0 18 18" fill="none"><rect x="4" y="2" width="10" height="2" fill="currentColor" opacity=".6"/><rect x="2" y="4" width="2" height="10" fill="currentColor" opacity=".5"/><rect x="14" y="4" width="2" height="10" fill="currentColor" opacity=".5"/><rect x="4" y="14" width="10" height="2" fill="currentColor" opacity=".5"/><rect x="8" y="2" width="5" height="2" fill="currentColor" opacity=".7"/><rect x="6" y="0" width="2" height="2" fill="currentColor" opacity=".5"/></svg>
      </div>

      <div class="hdr-sep"></div>

      <!-- Stop -->
      <div class="hdr-btn danger" title="Parar Agente" onclick="botMsg('[SISTEMA] Agente pausado.')">
        <svg viewBox="0 0 18 18" fill="none"><rect x="3" y="3" width="12" height="12" fill="var(--red)" opacity=".3"/><rect x="3" y="3" width="12" height="2" fill="var(--red)" opacity=".6"/><rect x="3" y="13" width="12" height="2" fill="var(--red)" opacity=".5"/><rect x="3" y="5" width="2" height="8" fill="var(--red)" opacity=".5"/><rect x="13" y="5" width="2" height="8" fill="var(--red)" opacity=".5"/><rect x="6" y="6" width="6" height="6" fill="var(--red)" opacity=".5"/></svg>
      </div>

      <!-- Screenshot -->
      <div class="hdr-btn" title="Capturar tela">
        <svg viewBox="0 0 18 18" fill="none"><rect x="1" y="3" width="16" height="12" fill="currentColor" opacity=".15"/><rect x="1" y="3" width="16" height="2" fill="currentColor" opacity=".5"/><rect x="1" y="13" width="16" height="2" fill="currentColor" opacity=".4"/><rect x="1" y="5" width="2" height="8" fill="currentColor" opacity=".4"/><rect x="15" y="5" width="2" height="8" fill="currentColor" opacity=".4"/><rect x="5" y="1" width="8" height="2" fill="currentColor" opacity=".35"/><rect x="6" y="6" width="6" height="5" fill="currentColor" opacity=".2"/><rect x="7" y="7" width="4" height="3" fill="var(--accent)" opacity=".4"/></svg>
      </div>

      <!-- Timer -->
      <div class="hdr-btn warn" title="Timeout da sessão">
        <svg viewBox="0 0 18 18" fill="none"><rect x="4" y="2" width="10" height="14" fill="var(--yellow)" opacity=".15"/><rect x="4" y="2" width="10" height="2" fill="var(--yellow)" opacity=".5"/><rect x="4" y="14" width="10" height="2" fill="var(--yellow)" opacity=".4"/><rect x="4" y="4" width="2" height="10" fill="var(--yellow)" opacity=".4"/><rect x="12" y="4" width="2" height="10" fill="var(--yellow)" opacity=".4"/><rect x="8" y="6" width="2" height="5" fill="var(--yellow)" opacity=".8"/><rect x="8" y="10" width="4" height="2" fill="var(--yellow)" opacity=".6"/></svg>
      </div>
    </div>
  </div>

  <!-- Chat Area -->
  <div class="chat-area" id="chatArea">

    <div class="date-div"><span>Qui 12 Mar 2026 · 22:51</span></div>

    <!-- User msg 1 -->
    <div class="msg-row-right" style="animation:msgIn .3s ease-out both">
      <div>
        <div class="msg-meta-right">
          <span class="msg-sender">vexusclaw-tui (gateway-client)</span>
          <span class="msg-time">22:51</span>
        </div>
        <div class="msg-bubble-right">
          <p>System: [2026-03-12 22:51:18 GMT-3] WhatsApp gateway connected.</p>
          <p>[Thu 2026-03-12 22:52 GMT-3] oi</p>
        </div>
      </div>
      <div class="msg-av-r">U</div>
    </div>

    <!-- Bot msg 1 -->
    <div class="msg-row-left" style="animation:msgIn .3s ease-out .05s both">
      <div class="msg-av-l">
        <img src="https://community.aseprite.org/uploads/default/original/2X/0/0eff0e4064297cbbe7383108c2f7322c758a5e1f.gif" alt="" draggable="false">
      </div>
      <div class="msg-bot-wrap">
        <div class="msg-bot-name">VexusClaw <span class="msg-bot-time">22:51</span></div>
        <div class="msg-bubble-left">Oi 👋</div>
      </div>
    </div>

    <!-- User msg 2 -->
    <div class="msg-row-right" style="animation:msgIn .3s ease-out .1s both">
      <div>
        <div class="msg-meta-right">
          <span class="msg-sender">vexusclaw-tui (gateway-client)</span>
          <span class="msg-time">22:52</span>
        </div>
        <div class="msg-bubble-right">
          <p>System: [2026-03-12 22:51:18 GMT-3] WhatsApp gateway connected.</p>
          <p>[Thu 2026-03-12 22:52 GMT-3] oi</p>
        </div>
      </div>
      <div class="msg-av-r">U</div>
    </div>

    <!-- Bot msg 2 -->
    <div class="msg-row-left" style="animation:msgIn .3s ease-out .15s both">
      <div class="msg-av-l">
        <img src="https://community.aseprite.org/uploads/default/original/2X/0/0eff0e4064297cbbe7383108c2f7322c758a5e1f.gif" alt="" draggable="false">
      </div>
      <div class="msg-bot-wrap">
        <div class="msg-bot-name">VexusClaw <span class="msg-bot-time">22:52</span></div>
        <div class="msg-bubble-left">Oi 👋 Como posso te ajudar hoje?</div>
      </div>
    </div>

    <!-- Typing indicator (hidden) -->
    <div class="msg-row-left" id="typingRow" style="display:none">
      <div class="msg-av-l">
        <img src="https://community.aseprite.org/uploads/default/original/2X/0/0eff0e4064297cbbe7383108c2f7322c758a5e1f.gif" alt="" draggable="false">
      </div>
      <div>
        <div class="msg-bot-name">VexusClaw</div>
        <div class="typing-wrap">
          <div class="t-dot"></div>
          <div class="t-dot"></div>
          <div class="t-dot"></div>
        </div>
      </div>
    </div>

  </div><!-- /chat-area -->

  <!-- Input Area -->
  <div class="chat-input-area">
    <div class="input-wrap">
      <textarea class="chat-input" id="chatInput"
        placeholder="Message (↵ to send, Shift+↵ for line breaks, paste images)"
        rows="1"></textarea>
    </div>
    <div class="input-btns">
      <button class="btn-new" onclick="newSession()">Nova sessão</button>
      <button class="btn-send" onclick="sendMsg()">
        Enviar
        <svg viewBox="0 0 16 16" fill="none">
          <rect x="1" y="7" width="11" height="2" fill="currentColor"/>
          <rect x="9" y="5" width="2" height="2" fill="currentColor"/>
          <rect x="9" y="9" width="2" height="2" fill="currentColor"/>
          <rect x="11" y="3" width="2" height="2" fill="currentColor"/>
          <rect x="11" y="11" width="2" height="2" fill="currentColor"/>
          <rect x="13" y="1" width="2" height="2" fill="currentColor"/>
          <rect x="13" y="13" width="2" height="2" fill="currentColor"/>
        </svg>
      </button>
    </div>
  </div>

</main>

<script>
/* ── banner ── */
function closeBanner(){
  document.getElementById('updateBanner').style.display='none';
  document.getElementById('mainContent').classList.add('no-banner');
}

/* ── session cycle ── */
const SESSIONS=['vexusclaw-tui','whatsapp-main','telegram-bot','discord-srv','api-client'];
let sIdx=0;
function cycleSess(){
  sIdx=(sIdx+1)%SESSIONS.length;
  document.getElementById('sessVal').textContent=SESSIONS[sIdx];
}

/* ── auto resize textarea ── */
const inp=document.getElementById('chatInput');
inp.addEventListener('input',()=>{inp.style.height='auto';inp.style.height=Math.min(inp.scrollHeight,160)+'px'});
inp.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMsg()}});

/* ── send ── */
const REPLIES=[
  'Entendido! Processando sua solicitação... ⚡',
  'Feito! Executado com sucesso. ✓',
  'Analisando... Um momento. 🔍',
  'Comando recebido. Executando agora! 🚀',
  'Tudo certo! Gateway operacional. ✅',
  'Skill ativada! Processando... ⚙️',
  'Roger that! Missão aceita. 🎯',
  'Processando via <code>agent:main:main</code>... aguarde.',
];
let rIdx=0;

function sendMsg(){
  const val=inp.value.trim();
  if(!val)return;
  const area=document.getElementById('chatArea');
  const typing=document.getElementById('typingRow');
  const now=new Date();
  const t=pad(now.getHours())+':'+pad(now.getMinutes());

  // user bubble
  const row=document.createElement('div');
  row.className='msg-row-right';
  row.style.animation='msgIn .3s ease-out both';
  row.innerHTML=`
    <div>
      <div class="msg-meta-right">
        <span class="msg-sender">${esc(document.getElementById('sessVal').textContent)} (gateway-client)</span>
        <span class="msg-time">${t}</span>
      </div>
      <div class="msg-bubble-right"><p>${esc(val)}</p></div>
    </div>
    <div class="msg-av-r">U</div>`;
  area.insertBefore(row,typing);
  inp.value='';inp.style.height='auto';

  // show typing
  typing.style.display='flex';
  area.appendChild(typing);
  scroll();

  // bot reply
  setTimeout(()=>{
    typing.style.display='none';
    botMsg(REPLIES[rIdx%REPLIES.length],t);
    rIdx++;
  },700+Math.random()*700);
}

function botMsg(text,time){
  const area=document.getElementById('chatArea');
  const typing=document.getElementById('typingRow');
  const now=new Date();
  const t=time||pad(now.getHours())+':'+pad(now.getMinutes());
  const row=document.createElement('div');
  row.className='msg-row-left';
  row.style.animation='msgIn .3s ease-out both';
  row.innerHTML=`
    <div class="msg-av-l">
      <img src="https://community.aseprite.org/uploads/default/original/2X/0/0eff0e4064297cbbe7383108c2f7322c758a5e1f.gif" alt="" draggable="false">
    </div>
    <div class="msg-bot-wrap">
      <div class="msg-bot-name">VexusClaw <span class="msg-bot-time">${t}</span></div>
      <div class="msg-bubble-left">${text}</div>
    </div>`;
  area.insertBefore(row,typing);
  scroll();
}

function newSession(){
  const area=document.getElementById('chatArea');
  const typing=document.getElementById('typingRow');
  const now=new Date();
  const div=document.createElement('div');
  div.className='date-div';
  div.innerHTML=`<span>Nova sessão · ${pad(now.getHours())}:${pad(now.getMinutes())}</span>`;
  area.insertBefore(div,typing);
  botMsg('Nova sessão iniciada! Como posso te ajudar? 🧙✨');
}

function scroll(){requestAnimationFrame(()=>{const a=document.getElementById('chatArea');a.scrollTop=a.scrollHeight})}
function pad(n){return String(n).padStart(2,'0')}
function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}

// initial scroll
setTimeout(scroll,100);
</script>
<script src="vexus-ui.js"></script>
</body>
</html>
