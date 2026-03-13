<?php $menuActive = 'channels'; ?>
<!DOCTYPE html>
<html lang="pt-BR" style="color-scheme:dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>VexusClaw — WhatsApp</title>
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap" rel="stylesheet">
<style>
:root{
  --bg:#07030f;--bg-card:#0d0820;--bg-surface:#110c28;--bg-sidebar:#09051a;--bg-input:#0a0618;
  --border:#251a55;--border-light:#1a1035;
  --accent:#b44dff;--accent2:#8a2be2;--accent-bright:#d088ff;
  --green:#44ffaa;--yellow:#ffbd2e;--red:#ff4444;
  --wa:#25D366;--wa2:#128C7E;--wa-dim:rgba(37,211,102,.15);
  --px-s:-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000;
  --px-sa:-1px -1px 0 #3d0070,1px -1px 0 #3d0070,-1px 1px 0 #3d0070,1px 1px 0 #3d0070;
  --px-wa:-1px -1px 0 #0a3d20,1px -1px 0 #0a3d20,-1px 1px 0 #0a3d20,1px 1px 0 #0a3d20;
  --sidebar-w:220px;--topbar-h:50px;
}
*{margin:0;padding:0;box-sizing:border-box;color:#fff}
html,body{height:100%;overflow:hidden}
body{background:var(--bg);font-family:'VT323',monospace;font-size:17px}
::selection{background:var(--accent2)}
input,select,textarea,button{font-family:inherit}

/* dither */
body::before{content:'';position:fixed;inset:0;z-index:0;pointer-events:none;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect x='0' y='0' width='1' height='1' fill='%23ffffff' opacity='0.007'/%3E%3Crect x='2' y='2' width='1' height='1' fill='%23ffffff' opacity='0.007'/%3E%3C/svg%3E");
  background-size:4px 4px}

/* ══ TOPBAR ══ */
.topbar{position:fixed;top:0;left:0;right:0;z-index:300;height:var(--topbar-h);
  background:rgba(9,5,26,.97);border-bottom:2px solid var(--border);
  display:flex;align-items:center;padding:0 14px}
.tb-hamburger{width:34px;height:34px;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:5px;cursor:pointer;border:none;background:none;border-radius:3px;transition:.2s;flex-shrink:0}
.tb-hamburger:hover{background:rgba(180,77,255,.1)}
.tb-hamburger span{display:block;width:18px;height:2px;background:rgba(255,255,255,.5);border-radius:1px;transition:.3s}
.tb-hamburger.open span:nth-child(1){transform:translateY(7px) rotate(45deg)}
.tb-hamburger.open span:nth-child(2){opacity:0;transform:scaleX(0)}
.tb-hamburger.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
.tb-logo{display:flex;align-items:center;gap:8px;margin-left:10px;margin-right:auto}
.tb-logo img{width:24px;height:24px;image-rendering:pixelated;filter:drop-shadow(0 0 5px rgba(180,77,255,.5))}
.tb-logo-name{font-family:'Press Start 2P',monospace;font-size:.62rem;text-shadow:var(--px-sa)}
.tb-logo-sub{font-family:'Press Start 2P',monospace;font-size:.32rem;color:rgba(255,255,255,.28);letter-spacing:2px}
.logo-blink{color:var(--accent-bright);animation:blink .9s step-end infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
.tb-right{display:flex;align-items:center;gap:7px}
.tb-badge{display:flex;align-items:center;gap:5px;padding:5px 9px;background:var(--bg-surface);border:1px solid var(--border);border-radius:3px;font-family:'Press Start 2P',monospace;font-size:.38rem;box-shadow:2px 2px 0 rgba(0,0,0,.4)}
.tb-dot{width:7px;height:7px;border-radius:2px;flex-shrink:0;box-shadow:0 0 5px currentColor}
.tb-dot.green{background:var(--green);color:var(--green)}
.tb-dot.yellow{background:var(--yellow);color:var(--yellow)}
.tb-lbl{color:rgba(255,255,255,.38)}
.tb-val{color:rgba(255,255,255,.8)}
.tb-icon-btn{width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:var(--bg-surface);border:1px solid var(--border);border-radius:3px;cursor:pointer;transition:.2s;box-shadow:2px 2px 0 rgba(0,0,0,.3)}
.tb-icon-btn:hover{border-color:var(--accent)}
.tb-icon-btn svg{width:15px;height:15px;image-rendering:pixelated;opacity:.55}
.tb-avatar{width:32px;height:32px;background:linear-gradient(135deg,var(--accent),var(--accent2));border:2px solid var(--border);border-radius:3px;display:flex;align-items:center;justify-content:center;font-family:'Press Start 2P',monospace;font-size:.46rem;cursor:pointer;box-shadow:2px 2px 0 rgba(0,0,0,.4);flex-shrink:0;text-shadow:var(--px-s)}
@media(max-width:600px){.tb-badge,.tb-icon-btn{display:none}}

/* ══ OVERLAY ══ */
.sb-overlay{display:none;position:fixed;inset:0;z-index:150;background:rgba(0,0,0,.6);backdrop-filter:blur(2px)}
.sb-overlay.show{display:block}

/* ══ UPDATE BANNER ══ */
.update-banner{position:fixed;top:var(--topbar-h);left:0;right:0;z-index:200;
  padding:7px 20px;background:rgba(180,77,255,.07);border-bottom:2px solid rgba(180,77,255,.18);
  display:flex;align-items:center;justify-content:center;gap:12px;
  font-family:'Press Start 2P',monospace;font-size:.37rem}
.banner-text{color:var(--accent-bright);text-shadow:var(--px-sa)}
.banner-text span{color:rgba(255,255,255,.4)}
.banner-btn{padding:5px 10px;background:linear-gradient(135deg,var(--accent),var(--accent2));border:none;border-radius:3px;font-family:'Press Start 2P',monospace;font-size:.35rem;cursor:pointer;box-shadow:2px 2px 0 #3d0070}
.banner-x{cursor:pointer;opacity:.4;font-size:1.2rem;margin-left:6px}
.banner-x:hover{opacity:1}

/* ══ SIDEBAR ══ */
.sidebar{position:fixed;top:var(--topbar-h);left:0;bottom:0;z-index:200;width:var(--sidebar-w);
  background:var(--bg-sidebar);border-right:2px solid var(--border);
  display:flex;flex-direction:column;overflow-y:auto;overflow-x:hidden;
  transition:transform .25s cubic-bezier(.4,0,.2,1)}
.sidebar::-webkit-scrollbar{width:3px}
.sidebar::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}
@media(max-width:768px){.sidebar{transform:translateX(-100%)}}
.sidebar.open{transform:translateX(0) !important}
.sg-label{display:flex;align-items:center;justify-content:space-between;padding:9px 14px 6px;
  font-family:'Press Start 2P',monospace;font-size:.38rem;color:rgba(255,255,255,.22);letter-spacing:1px}
.nav-item{display:flex;align-items:center;gap:9px;padding:10px 14px;cursor:pointer;transition:.15s;border-left:2px solid transparent}
.nav-item:hover{background:rgba(180,77,255,.07);border-left-color:rgba(180,77,255,.18)}
.nav-item.active{background:rgba(37,211,102,.07);border-left-color:var(--wa)}
.nav-item svg{width:15px;height:15px;image-rendering:pixelated;flex-shrink:0;opacity:.45}
.nav-item:hover svg,.nav-item.active svg{opacity:.9}
.nav-lbl{font-family:'Press Start 2P',monospace;font-size:.46rem;color:rgba(255,255,255,.45);text-shadow:var(--px-s)}
.nav-item.active .nav-lbl{color:var(--wa);text-shadow:var(--px-wa)}
.nav-badge{margin-left:auto;padding:2px 6px;background:var(--accent);border-radius:2px;font-family:'Press Start 2P',monospace;font-size:.35rem;box-shadow:1px 1px 0 #3d0070}
.px-div{height:2px;background:repeating-linear-gradient(90deg,var(--accent) 0,var(--accent) 4px,transparent 4px,transparent 8px);opacity:.1}
.sb-bottom{margin-top:auto;border-top:2px solid var(--border);padding:10px 14px;display:flex;align-items:center;gap:8px}
.sb-avatar{width:28px;height:28px;background:linear-gradient(135deg,var(--accent),var(--accent2));border-radius:3px;display:flex;align-items:center;justify-content:center;font-family:'Press Start 2P',monospace;font-size:.42rem;flex-shrink:0}
.sb-name{font-family:'Press Start 2P',monospace;font-size:.42rem;display:block}
.sb-status{font-family:'VT323',monospace;font-size:1rem;color:var(--green);display:flex;align-items:center;gap:4px}
.sb-status::before{content:'';width:5px;height:5px;background:var(--green);border-radius:1px;box-shadow:0 0 4px var(--green)}

/* ══ MAIN ══ */
.main{position:fixed;top:calc(var(--topbar-h) + 37px);left:var(--sidebar-w);right:0;bottom:0;
  overflow-y:auto;overflow-x:hidden;transition:left .25s cubic-bezier(.4,0,.2,1)}
.main::-webkit-scrollbar{width:5px}
.main::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}
@media(max-width:768px){.main{left:0}}

/* ══ PAGE ══ */
.page-hdr{padding:0;border-bottom:2px solid var(--border)}
.page-body{padding:22px 26px;display:flex;flex-direction:column;gap:16px;padding-bottom:60px}
@media(max-width:600px){.page-body{padding:14px 14px 40px}}

/* ══ WA HERO ══ */
.wa-hero{background:linear-gradient(135deg,rgba(37,211,102,.06) 0%,rgba(18,140,126,.04) 50%,rgba(7,3,15,0) 100%);
  border-bottom:2px solid rgba(37,211,102,.12);padding:22px 26px;
  display:flex;align-items:flex-start;gap:20px;flex-wrap:wrap;position:relative;overflow:hidden}
.wa-hero::before{content:'';position:absolute;top:-30px;right:-30px;width:180px;height:180px;
  background:radial-gradient(circle,rgba(37,211,102,.08) 0%,transparent 70%);pointer-events:none}
.wa-hero-icon{width:56px;height:56px;background:rgba(37,211,102,.12);border:2px solid rgba(37,211,102,.25);
  border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;
  box-shadow:3px 3px 0 rgba(0,0,0,.5),0 0 20px rgba(37,211,102,.1)}
.wa-hero-info{flex:1;min-width:200px}
.wa-hero-title{font-family:'Press Start 2P',monospace;font-size:.9rem;text-shadow:var(--px-wa);color:var(--wa);margin-bottom:6px}
.wa-hero-sub{font-family:'VT323',monospace;font-size:1.2rem;color:rgba(255,255,255,.45);margin-bottom:12px}
.wa-hero-pills{display:flex;gap:6px;flex-wrap:wrap}
.pill{display:inline-flex;align-items:center;gap:5px;padding:5px 10px;background:rgba(37,211,102,.08);
  border:1px solid rgba(37,211,102,.2);border-radius:3px;
  font-family:'Press Start 2P',monospace;font-size:.38rem;text-shadow:var(--px-wa)}
.pill.connected{color:var(--wa)}
.pill.warn{color:var(--yellow);background:rgba(255,189,46,.08);border-color:rgba(255,189,46,.2);text-shadow:none}
.pill.err{color:var(--red);background:rgba(255,68,68,.08);border-color:rgba(255,68,68,.2);text-shadow:none}
.pill-dot{width:6px;height:6px;border-radius:1px;background:currentColor;box-shadow:0 0 4px currentColor}
.pill-dot.blink{animation:blink 1s step-end infinite}
.wa-hero-actions{display:flex;align-items:flex-start;gap:8px;flex-wrap:wrap;padding-top:4px}

/* ══ LAYOUT 2-COL ══ */
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:start}
@media(max-width:820px){.two-col{grid-template-columns:1fr}}

/* ══ CARD ══ */
.card{background:var(--bg-card);border:2px solid var(--border);border-radius:6px;
  box-shadow:4px 4px 0 rgba(0,0,0,.5);overflow:hidden;position:relative}
.card.wa-accent::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;
  background:repeating-linear-gradient(90deg,var(--wa) 0,var(--wa) 4px,transparent 4px,transparent 8px);opacity:.35}
.card:not(.wa-accent)::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;
  background:repeating-linear-gradient(90deg,var(--accent) 0,var(--accent) 4px,transparent 4px,transparent 8px);opacity:.25}
.card-hdr{padding:14px 18px 11px;border-bottom:2px solid var(--border-light);display:flex;align-items:center;justify-content:space-between;gap:10px}
.card-title{font-family:'Press Start 2P',monospace;font-size:.58rem;text-shadow:var(--px-s)}
.card-desc{font-family:'VT323',monospace;font-size:1rem;color:rgba(255,255,255,.35);margin-top:2px}
.card-body{padding:16px 18px}

/* ══ QR PANEL ══ */
.qr-panel{display:none;padding:20px 18px;border-top:2px solid var(--border-light);
  background:rgba(37,211,102,.03);flex-direction:column;align-items:center;gap:14px}
.qr-panel.show{display:flex;animation:pgIn .3s ease-out both}
.qr-box{width:160px;height:160px;background:#fff;border-radius:4px;padding:8px;
  box-shadow:0 0 20px rgba(37,211,102,.2),4px 4px 0 rgba(0,0,0,.5);
  display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden}
.qr-scanline{position:absolute;top:0;left:0;right:0;height:3px;
  background:linear-gradient(90deg,transparent,rgba(37,211,102,.8),transparent);
  animation:qrScan 2.5s linear infinite}
@keyframes qrScan{0%{top:0;opacity:0}5%{opacity:1}95%{opacity:1}100%{top:100%;opacity:0}}
.qr-inner{width:144px;height:144px;image-rendering:pixelated}
.qr-caption{font-family:'Press Start 2P',monospace;font-size:.42rem;color:rgba(255,255,255,.45);text-align:center;line-height:2}
.qr-caption span{color:var(--wa)}
.qr-timer{font-family:'Press Start 2P',monospace;font-size:.62rem;color:var(--yellow);text-shadow:0 0 8px rgba(255,189,46,.3)}

/* ══ STATUS GRID ══ */
.status-grid{display:grid;grid-template-columns:1fr 1fr;gap:0}
.status-cell{padding:11px 14px;border-bottom:1px solid rgba(37,26,85,.5);border-right:1px solid rgba(37,26,85,.5)}
.status-cell:nth-child(even){border-right:none}
.status-cell:nth-last-child(-n+2){border-bottom:none}
.status-key{font-family:'VT323',monospace;font-size:1.1rem;color:rgba(255,255,255,.4);margin-bottom:3px}
.status-val{font-family:'Press Start 2P',monospace;font-size:.48rem;text-shadow:var(--px-s)}
.status-val.yes{color:var(--wa);text-shadow:var(--px-wa)}
.status-val.no{color:var(--red)}
.status-val.ago{color:rgba(255,255,255,.7)}
.status-val.na{color:rgba(255,255,255,.3)}

/* live pulse */
.live-badge{display:inline-flex;align-items:center;gap:5px;padding:4px 9px;
  background:rgba(37,211,102,.1);border:1px solid rgba(37,211,102,.3);border-radius:3px;
  font-family:'Press Start 2P',monospace;font-size:.38rem;color:var(--wa);text-shadow:var(--px-wa)}
.live-dot{width:7px;height:7px;background:var(--wa);border-radius:1px;
  animation:pulse 1.5s ease-in-out infinite;box-shadow:0 0 5px var(--wa)}
@keyframes pulse{0%,100%{opacity:1;box-shadow:0 0 5px var(--wa)}50%{opacity:.4;box-shadow:0 0 2px var(--wa)}}

/* ══ BUTTONS ══ */
.btn{padding:9px 14px;border:2px solid var(--border);border-radius:4px;font-family:'Press Start 2P',monospace;font-size:.44rem;text-shadow:var(--px-s);cursor:pointer;transition:.2s;box-shadow:2px 2px 0 rgba(0,0,0,.4);background:var(--bg-surface)}
.btn:hover{border-color:var(--accent);background:rgba(180,77,255,.1);transform:translate(-1px,-1px);box-shadow:3px 3px 0 rgba(0,0,0,.4)}
.btn:active{transform:translate(1px,1px)}
.btn-wa{background:linear-gradient(135deg,rgba(37,211,102,.25),rgba(18,140,126,.2));border-color:rgba(37,211,102,.4);color:var(--wa);text-shadow:var(--px-wa)}
.btn-wa:hover{background:linear-gradient(135deg,rgba(37,211,102,.35),rgba(18,140,126,.3));border-color:var(--wa)}
.btn-primary{background:linear-gradient(135deg,var(--accent),var(--accent2));border-color:var(--accent2);box-shadow:3px 3px 0 #3d0070}
.btn-primary:hover{box-shadow:4px 4px 0 #3d0070}
.btn-danger{background:linear-gradient(135deg,#cc2200,#aa1800);border-color:#aa1800;box-shadow:3px 3px 0 #550800}
.btn-danger:hover{box-shadow:4px 4px 0 #550800}
.btn-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap}

/* ══ FIELD ══ */
.field-wrap{display:flex;flex-direction:column;gap:5px;margin-bottom:12px}
.field-label{font-family:'Press Start 2P',monospace;font-size:.44rem;color:rgba(255,255,255,.5);text-shadow:var(--px-s)}
.field-input{padding:10px 12px;background:var(--bg-input);border:2px solid var(--border);
  box-shadow:inset 2px 2px 0 rgba(0,0,0,.4),2px 2px 0 rgba(0,0,0,.3);border-radius:4px;
  font-family:'VT323',monospace;font-size:1.2rem;color:#fff;outline:none;transition:.2s;width:100%}
.field-input:focus{border-color:var(--accent);box-shadow:inset 2px 2px 0 rgba(0,0,0,.4),0 0 0 3px rgba(180,77,255,.06)}
.field-input::placeholder{color:rgba(255,255,255,.2)}
.field-select{appearance:none;-webkit-appearance:none;cursor:pointer;
  background:var(--bg-input) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10'%3E%3Crect x='4' y='6' width='2' height='2' fill='%23666'/%3E%3Crect x='2' y='4' width='2' height='2' fill='%23666'/%3E%3Crect x='6' y='4' width='2' height='2' fill='%23666'/%3E%3C/svg%3E") no-repeat right 10px center}

/* ══ SECTION LABEL ══ */
.section-label{font-family:'Press Start 2P',monospace;font-size:.46rem;color:rgba(255,255,255,.45);
  text-shadow:var(--px-s);margin-bottom:8px;margin-top:14px;display:flex;align-items:center;gap:8px}
.section-label::after{content:'';flex:1;height:1px;
  background:repeating-linear-gradient(90deg,var(--border) 0,var(--border) 4px,transparent 4px,transparent 8px)}

/* ══ ACCORDION ══ */
.accordion{border:2px solid var(--border);border-radius:4px;overflow:hidden;margin-bottom:8px;box-shadow:2px 2px 0 rgba(0,0,0,.3)}
.acc-header{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;cursor:pointer;background:var(--bg-surface);transition:.2s;user-select:none;gap:8px}
.acc-header:hover{background:rgba(180,77,255,.07)}
.acc-title{font-family:'Press Start 2P',monospace;font-size:.5rem;text-shadow:var(--px-s);color:rgba(255,255,255,.8)}
.acc-right{display:flex;align-items:center;gap:8px;flex-shrink:0}
.acc-count{font-family:'VT323',monospace;font-size:1.05rem;color:rgba(255,255,255,.3)}
.acc-plus{padding:3px 8px;background:rgba(180,77,255,.15);border:1px solid rgba(180,77,255,.3);border-radius:3px;font-family:'Press Start 2P',monospace;font-size:.36rem;color:var(--accent-bright);cursor:pointer;transition:.2s;display:flex;align-items:center;gap:4px}
.acc-plus:hover{background:rgba(180,77,255,.25)}
.acc-chevron{width:12px;height:12px;image-rendering:pixelated;opacity:.4;transition:.3s;flex-shrink:0}
.acc-chevron.open{transform:rotate(180deg)}
.acc-body{background:var(--bg-card);padding:14px;border-top:2px solid var(--border-light);display:none}
.acc-body.open{display:block;animation:pgIn .2s ease-out}
.acc-empty{font-family:'VT323',monospace;font-size:1.05rem;color:rgba(255,255,255,.25);text-align:center;padding:14px 0}

/* ══ TOGGLE ══ */
.toggle-row{display:flex;align-items:flex-start;justify-content:space-between;padding:10px 13px;background:var(--bg-surface);border:2px solid var(--border);border-radius:4px;margin-bottom:8px;box-shadow:2px 2px 0 rgba(0,0,0,.3);gap:10px}
.toggle-name{font-family:'Press Start 2P',monospace;font-size:.48rem;text-shadow:var(--px-s);margin-bottom:4px}
.toggle-desc{font-family:'VT323',monospace;font-size:1.05rem;color:rgba(255,255,255,.35);line-height:1.4}
.toggle-tags{display:flex;gap:5px;margin-top:5px;flex-wrap:wrap}
.tag{padding:2px 6px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:2px;font-family:'VT323',monospace;font-size:.95rem;color:rgba(255,255,255,.35)}
.toggle-switch{flex-shrink:0;margin-top:2px;width:38px;height:22px;background:rgba(255,255,255,.08);border:2px solid rgba(255,255,255,.15);border-radius:11px;cursor:pointer;position:relative;transition:.25s}
.toggle-switch.on{background:rgba(68,255,170,.22);border-color:var(--green);box-shadow:0 0 8px rgba(68,255,170,.15)}
.toggle-switch::after{content:'';position:absolute;top:2px;left:2px;width:14px;height:14px;background:rgba(255,255,255,.3);border-radius:3px;transition:.25s}
.toggle-switch.on::after{left:calc(100% - 16px);background:var(--green)}

/* ══ TAB GROUP ══ */
.tab-group{display:flex;background:var(--bg-input);border:2px solid var(--border);border-radius:4px;overflow:hidden;box-shadow:2px 2px 0 rgba(0,0,0,.3);flex-wrap:wrap}
.tab-opt{flex:1;min-width:0;padding:9px 10px;text-align:center;font-family:'Press Start 2P',monospace;font-size:.42rem;color:rgba(255,255,255,.35);cursor:pointer;transition:.2s;border-right:1px solid var(--border)}
.tab-opt:last-child{border-right:none}
.tab-opt:hover{background:rgba(180,77,255,.06);color:rgba(255,255,255,.65)}
.tab-opt.active{background:linear-gradient(135deg,var(--accent),var(--accent2));color:#fff;text-shadow:var(--px-s)}

/* ══ STEPPER ══ */
.stepper{display:flex;align-items:stretch;background:var(--bg-input);border:2px solid var(--border);border-radius:4px;overflow:hidden;box-shadow:2px 2px 0 rgba(0,0,0,.3);width:160px}
.stepper-btn{width:36px;flex-shrink:0;display:flex;align-items:center;justify-content:center;background:var(--bg-surface);cursor:pointer;font-size:1.3rem;color:rgba(255,255,255,.5);transition:.2s;border:none;border-right:1px solid var(--border)}
.stepper-btn:last-child{border-right:none;border-left:1px solid var(--border)}
.stepper-btn:hover{background:rgba(180,77,255,.12);color:#fff}
.stepper-val{flex:1;text-align:center;padding:9px 8px;font-family:'Press Start 2P',monospace;font-size:.6rem;border:none;background:transparent;outline:none;color:#fff}

/* ══ ITEM ROW ══ */
.item-row{display:flex;align-items:center;padding:9px 11px;background:var(--bg-surface);border:1px solid var(--border);border-radius:3px;margin-bottom:6px;gap:8px}
.item-num{font-family:'Press Start 2P',monospace;font-size:.42rem;color:rgba(255,255,255,.3);flex-shrink:0}
.item-del{width:22px;height:22px;display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:.35;transition:.2s;background:none;border:none;flex-shrink:0;margin-left:auto}
.item-del:hover{opacity:.9;background:rgba(255,68,68,.1);border-radius:3px}

/* ══ INLINE INFO ══ */
.inline-info-card{background:var(--bg-surface);border:2px solid var(--border);border-radius:4px;padding:10px 14px;box-shadow:2px 2px 0 rgba(0,0,0,.3);margin-top:8px}
.inline-row{display:flex;align-items:center;justify-content:space-between;padding:7px 0;border-bottom:1px solid rgba(37,26,85,.4)}
.inline-row:last-child{border-bottom:none}
.inline-key{font-family:'VT323',monospace;font-size:1.15rem;color:rgba(255,255,255,.4)}
.inline-val{font-family:'Press Start 2P',monospace;font-size:.46rem;color:rgba(255,255,255,.65)}

/* ══ LOG ══ */
.log-area{background:var(--bg-input);border:2px solid var(--border);border-radius:4px;padding:12px 14px;
  max-height:180px;overflow-y:auto;font-family:'VT323',monospace;font-size:1.1rem;line-height:1.8}
.log-area::-webkit-scrollbar{width:3px}
.log-area::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}
.log-line{display:flex;gap:10px;align-items:baseline}
.log-time{color:rgba(255,255,255,.25);flex-shrink:0}
.log-ok{color:var(--green)}
.log-warn{color:var(--yellow)}
.log-err{color:var(--red)}
.log-info{color:rgba(255,255,255,.5)}

@keyframes pgIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
</style>
</head>
<body>

<!-- TOPBAR -->
<?php include __DIR__ . '/topbar.php'; ?>

<!-- SIDEBAR -->
<?php include __DIR__ . '/sidebar.php'; ?>

<!-- MAIN -->
<main class="main" style="animation:pgIn .3s ease-out both">

  <!-- ══ HERO HEADER ══ -->
  <div class="wa-hero">
    <div class="wa-hero-icon">
      <!-- WhatsApp pixel icon -->
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect x="4" y="2" width="28" height="32" rx="4" fill="#25D366" opacity=".08"/>
        <rect x="4" y="2" width="28" height="3" fill="#25D366" opacity=".6"/>
        <rect x="4" y="31" width="28" height="3" fill="#25D366" opacity=".4"/>
        <rect x="4" y="5" width="3" height="26" fill="#25D366" opacity=".5"/>
        <rect x="29" y="5" width="3" height="26" fill="#25D366" opacity=".5"/>
        <!-- phone icon inside -->
        <rect x="12" y="8" width="12" height="14" rx="2" fill="#25D366" opacity=".2"/>
        <rect x="12" y="8" width="12" height="2" fill="#25D366" opacity=".5"/>
        <rect x="12" y="20" width="12" height="2" fill="#25D366" opacity=".4"/>
        <rect x="12" y="10" width="2" height="10" fill="#25D366" opacity=".4"/>
        <rect x="22" y="10" width="2" height="10" fill="#25D366" opacity=".4"/>
        <rect x="15" y="22" width="6" height="2" fill="#25D366" opacity=".35"/>
        <!-- chat bubble -->
        <rect x="9" y="24" width="16" height="8" rx="2" fill="#25D366" opacity=".3"/>
        <rect x="9" y="24" width="8" height="2" fill="#25D366" opacity=".5"/>
        <rect x="9" y="27" width="12" height="2" fill="#25D366" opacity=".3"/>
        <rect x="9" y="30" width="4" height="2" fill="#25D366" opacity=".4"/>
      </svg>
    </div>
    <div class="wa-hero-info">
      <div class="wa-hero-title">WhatsApp</div>
      <div class="wa-hero-sub">Canal de mensagens · Configuração e status de conexão</div>
      <div class="wa-hero-pills">
        <div class="pill connected"><div class="pill-dot blink"></div>Conectado</div>
        <div class="pill connected">Linked · 9m ago</div>
        <div class="pill warn">v2026.3.7</div>
        <div class="pill connected">DM Policy: open</div>
        <div class="pill connected">Group: allowlist</div>
      </div>
    </div>
    <div class="wa-hero-actions">
      <div class="live-badge"><div class="live-dot"></div>Ao vivo</div>
      <button class="btn btn-wa" onclick="toggleQR()" id="qrBtn">Show QR</button>
      <button class="btn" onclick="doRelink()">Relink</button>
      <button class="btn" onclick="waitScan()">Wait for scan</button>
      <button class="btn btn-danger" onclick="doLogout()">Logout</button>
      <button class="btn" id="refreshBtn" onclick="doRefresh()">Refresh</button>
    </div>
  </div>

  <div class="page-body">

    <!-- ══ TOP ROW ══ -->
    <div class="two-col">

      <!-- Status Card -->
      <div class="card wa-accent">
        <div class="card-hdr">
          <div>
            <div class="card-title">Status da Conexão</div>
            <div class="card-desc">Estado atual do cliente WhatsApp Web.</div>
          </div>
          <div id="statusLiveBadge" class="live-badge" style="font-size:.34rem"><div class="live-dot"></div>Live</div>
        </div>
        <div class="status-grid">
          <div class="status-cell"><div class="status-key">Configured</div><div class="status-val yes" id="sc-configured">Yes</div></div>
          <div class="status-cell"><div class="status-key">Linked</div><div class="status-val yes" id="sc-linked">Yes</div></div>
          <div class="status-cell"><div class="status-key">Running</div><div class="status-val yes" id="sc-running">Yes</div></div>
          <div class="status-cell"><div class="status-key">Connected</div><div class="status-val yes" id="sc-connected">Yes</div></div>
          <div class="status-cell"><div class="status-key">Last connect</div><div class="status-val ago" id="sc-lastconn">9m ago</div></div>
          <div class="status-cell"><div class="status-key">Last message</div><div class="status-val ago" id="sc-lastmsg">7m ago</div></div>
          <div class="status-cell"><div class="status-key">Auth age</div><div class="status-val ago" id="sc-authage">8m</div></div>
          <div class="status-cell"><div class="status-key">Uptime</div><div class="status-val ago" id="sc-uptime">00:09:14</div></div>
        </div>
        <!-- QR Panel -->
        <div class="qr-panel" id="qrPanel">
          <div class="qr-box">
            <div class="qr-scanline"></div>
            <canvas class="qr-inner" id="qrCanvas" width="144" height="144"></canvas>
          </div>
          <div class="qr-caption">
            Escaneie com <span>WhatsApp</span> no seu telefone.<br>
            Válido por <span id="qrCountdown">90s</span>
          </div>
          <div class="qr-timer" id="qrTimer" style="display:none">EXPIRADO</div>
          <button class="btn btn-wa" onclick="regenerateQR()" style="font-size:.42rem;padding:8px 14px">Regenerar QR</button>
        </div>
      </div>

      <!-- Activity Log -->
      <div class="card">
        <div class="card-hdr">
          <div>
            <div class="card-title">Log de Atividade</div>
            <div class="card-desc">Eventos recentes desta sessão WhatsApp.</div>
          </div>
          <button class="btn" style="font-size:.38rem;padding:6px 10px" onclick="clearLog()">Limpar</button>
        </div>
        <div class="card-body" style="padding:0">
          <div class="log-area" id="logArea">
            <div class="log-line"><span class="log-time">22:42:11</span><span class="log-ok">[OK]</span><span>WhatsApp Web authenticated</span></div>
            <div class="log-line"><span class="log-time">22:42:12</span><span class="log-ok">[OK]</span><span>Connection established</span></div>
            <div class="log-line"><span class="log-time">22:44:50</span><span class="log-info">[IN]</span><span>Message received · group · 1203634…@g.us</span></div>
            <div class="log-line"><span class="log-time">22:44:51</span><span class="log-ok">[OUT]</span><span>Response sent · 472 tokens</span></div>
            <div class="log-line"><span class="log-time">22:47:03</span><span class="log-info">[IN]</span><span>Message received · direct · agent:main:main</span></div>
            <div class="log-line"><span class="log-time">22:47:04</span><span class="log-ok">[OK]</span><span>Ack reaction sent · 👋</span></div>
            <div class="log-line"><span class="log-time">22:51:20</span><span class="log-ok">[OK]</span><span>Heartbeat · pong</span></div>
          </div>
        </div>
      </div>

    </div>

    <!-- ══ CONFIG ══ -->
    <div class="card">
      <div class="card-hdr">
        <div>
          <div class="card-title">Configuração do Canal</div>
          <div class="card-desc">Salve e recarregue para aplicar alterações ao runtime.</div>
        </div>
        <div class="btn-row">
          <button class="btn btn-primary" onclick="saveConfig()" style="font-size:.44rem">Save</button>
          <button class="btn" onclick="reloadConfig()" style="font-size:.44rem">Reload</button>
        </div>
      </div>
      <div class="card-body">

        <!-- Accounts -->
        <div class="accordion">
          <div class="acc-header" onclick="toggleAcc(this)">
            <span class="acc-title">Accounts</span>
            <div class="acc-right">
              <button class="acc-plus" onclick="addEntry('acc-accounts','account');event.stopPropagation()">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><rect x="3" y="1" width="2" height="6" fill="currentColor"/><rect x="1" y="3" width="6" height="2" fill="currentColor"/></svg>Add
              </button>
              <svg class="acc-chevron" viewBox="0 0 12 12" fill="none"><rect x="5" y="7" width="2" height="2" fill="currentColor"/><rect x="3" y="5" width="2" height="2" fill="currentColor"/><rect x="7" y="5" width="2" height="2" fill="currentColor"/><rect x="1" y="3" width="2" height="2" fill="currentColor"/><rect x="9" y="3" width="2" height="2" fill="currentColor"/></svg>
            </div>
          </div>
          <div class="acc-body"><div id="acc-accounts"><div class="acc-empty">Nenhuma entrada customizada.</div></div></div>
        </div>

        <!-- Ack Reaction -->
        <div class="accordion">
          <div class="acc-header" onclick="toggleAcc(this)">
            <span class="acc-title">Ack Reaction</span>
            <svg class="acc-chevron" viewBox="0 0 12 12" fill="none"><rect x="5" y="7" width="2" height="2" fill="currentColor"/><rect x="3" y="5" width="2" height="2" fill="currentColor"/><rect x="7" y="5" width="2" height="2" fill="currentColor"/><rect x="1" y="3" width="2" height="2" fill="currentColor"/><rect x="9" y="3" width="2" height="2" fill="currentColor"/></svg>
          </div>
          <div class="acc-body">
            <div class="toggle-row" style="margin-bottom:10px"><div><div class="toggle-name">Direct</div><div class="toggle-desc">Enviar reação ao receber DMs.</div></div><div class="toggle-switch on" onclick="this.classList.toggle('on')"></div></div>
            <div class="field-wrap"><label class="field-label">Emoji</label><input class="field-input" type="text" placeholder="👋" style="width:100px"></div>
            <div class="field-wrap"><label class="field-label">Group</label>
              <div class="tab-group" style="width:fit-content;min-width:280px">
                <div class="tab-opt" onclick="tabSelect(this)">always</div>
                <div class="tab-opt active" onclick="tabSelect(this)">mentions</div>
                <div class="tab-opt" onclick="tabSelect(this)">never</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="accordion">
          <div class="acc-header" onclick="toggleAcc(this)">
            <span class="acc-title">Actions</span>
            <svg class="acc-chevron" viewBox="0 0 12 12" fill="none"><rect x="5" y="7" width="2" height="2" fill="currentColor"/><rect x="3" y="5" width="2" height="2" fill="currentColor"/><rect x="7" y="5" width="2" height="2" fill="currentColor"/><rect x="1" y="3" width="2" height="2" fill="currentColor"/><rect x="9" y="3" width="2" height="2" fill="currentColor"/></svg>
          </div>
          <div class="acc-body">
            <div class="toggle-row"><div><div class="toggle-name">Polls</div><div class="toggle-desc">Criar e responder enquetes.</div></div><div class="toggle-switch" onclick="this.classList.toggle('on')"></div></div>
            <div class="toggle-row"><div><div class="toggle-name">Reactions</div><div class="toggle-desc">Reagir com emojis às mensagens.</div></div><div class="toggle-switch" onclick="this.classList.toggle('on')"></div></div>
            <div class="toggle-row"><div><div class="toggle-name">Send Message</div><div class="toggle-desc">Permitir que o agente envie mensagens proativamente.</div></div><div class="toggle-switch on" onclick="this.classList.toggle('on')"></div></div>
          </div>
        </div>

        <!-- Allow From -->
        <div class="accordion">
          <div class="acc-header" onclick="toggleAcc(this)">
            <span class="acc-title">Allow From</span>
            <div class="acc-right">
              <span class="acc-count" id="allowFromCount">1 item</span>
              <button class="acc-plus" onclick="addEntry('acc-allowfrom','entry');updateCount('acc-allowfrom','allowFromCount');event.stopPropagation()">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><rect x="3" y="1" width="2" height="6" fill="currentColor"/><rect x="1" y="3" width="6" height="2" fill="currentColor"/></svg>Add
              </button>
              <svg class="acc-chevron" viewBox="0 0 12 12" fill="none"><rect x="5" y="7" width="2" height="2" fill="currentColor"/><rect x="3" y="5" width="2" height="2" fill="currentColor"/><rect x="7" y="5" width="2" height="2" fill="currentColor"/><rect x="1" y="3" width="2" height="2" fill="currentColor"/><rect x="9" y="3" width="2" height="2" fill="currentColor"/></svg>
            </div>
          </div>
          <div class="acc-body">
            <p style="font-family:'VT323',monospace;font-size:1.05rem;color:rgba(255,255,255,.32);margin-bottom:10px">Padrões permitidos. Use * para todos.</p>
            <div id="acc-allowfrom">
              <div class="item-row"><span class="item-num">#1</span><input class="field-input" style="flex:1;margin:0 10px" type="text" value="*"><button class="item-del" onclick="delItem(this)"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="2" y="2" width="2" height="8" fill="currentColor" opacity=".5"/><rect x="8" y="2" width="2" height="8" fill="currentColor" opacity=".5"/><rect x="4" y="4" width="4" height="4" fill="currentColor" opacity=".3"/></svg></button></div>
            </div>
          </div>
        </div>

        <!-- Block Streaming -->
        <div class="accordion">
          <div class="acc-header" onclick="toggleAcc(this)">
            <span class="acc-title">Block Streaming</span>
            <div class="acc-right">
              <div class="toggle-switch" onclick="this.classList.toggle('on');event.stopPropagation()" style="margin-right:4px"></div>
              <svg class="acc-chevron" viewBox="0 0 12 12" fill="none"><rect x="5" y="7" width="2" height="2" fill="currentColor"/><rect x="3" y="5" width="2" height="2" fill="currentColor"/><rect x="7" y="5" width="2" height="2" fill="currentColor"/><rect x="1" y="3" width="2" height="2" fill="currentColor"/><rect x="9" y="3" width="2" height="2" fill="currentColor"/></svg>
            </div>
          </div>
          <div class="acc-body"><p style="font-family:'VT323',monospace;font-size:1.05rem;color:rgba(255,255,255,.35)">Bloqueia todas as respostas em streaming de serem processadas.</p></div>
        </div>

        <!-- Block Streaming Coalesce -->
        <div class="accordion">
          <div class="acc-header" onclick="toggleAcc(this)">
            <span class="acc-title">Block Streaming Coalesce</span>
            <svg class="acc-chevron" viewBox="0 0 12 12" fill="none"><rect x="5" y="7" width="2" height="2" fill="currentColor"/><rect x="3" y="5" width="2" height="2" fill="currentColor"/><rect x="7" y="5" width="2" height="2" fill="currentColor"/><rect x="1" y="3" width="2" height="2" fill="currentColor"/><rect x="9" y="3" width="2" height="2" fill="currentColor"/></svg>
          </div>
          <div class="acc-body"><div class="toggle-row"><div><div class="toggle-name">Enabled</div></div><div class="toggle-switch" onclick="this.classList.toggle('on')"></div></div></div>
        </div>

        <!-- Capabilities -->
        <div class="accordion">
          <div class="acc-header" onclick="toggleAcc(this)">
            <span class="acc-title">Capabilities</span>
            <div class="acc-right">
              <span class="acc-count">0 items</span>
              <button class="acc-plus" onclick="addEntry('acc-caps','capability');event.stopPropagation()"><svg width="8" height="8" viewBox="0 0 8 8" fill="none"><rect x="3" y="1" width="2" height="6" fill="currentColor"/><rect x="1" y="3" width="6" height="2" fill="currentColor"/></svg>Add</button>
              <svg class="acc-chevron" viewBox="0 0 12 12" fill="none"><rect x="5" y="7" width="2" height="2" fill="currentColor"/><rect x="3" y="5" width="2" height="2" fill="currentColor"/><rect x="7" y="5" width="2" height="2" fill="currentColor"/><rect x="1" y="3" width="2" height="2" fill="currentColor"/><rect x="9" y="3" width="2" height="2" fill="currentColor"/></svg>
            </div>
          </div>
          <div class="acc-body"><div id="acc-caps"><div class="acc-empty">Nenhuma capability. Clique em Add para criar.</div></div></div>
        </div>

        <!-- DM History Limit + WhatsApp DM Policy side by side -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:6px;align-items:start">
          <div>
            <div class="section-label">DM History Limit</div>
            <div class="stepper">
              <button class="stepper-btn" onclick="step('dmHistLimit',-1)">−</button>
              <input class="stepper-val" id="dmHistLimit" type="number" value="0" min="0">
              <button class="stepper-btn" onclick="step('dmHistLimit',1)">+</button>
            </div>
          </div>
          <div>
            <div class="section-label">History Limit</div>
            <div class="stepper">
              <button class="stepper-btn" onclick="step('histLimit',-1)">−</button>
              <input class="stepper-val" id="histLimit" type="number" value="5" min="0">
              <button class="stepper-btn" onclick="step('histLimit',1)">+</button>
            </div>
          </div>
        </div>

        <!-- WhatsApp DM Policy -->
        <div style="margin-top:14px">
          <div class="section-label">WhatsApp DM Policy</div>
          <p style="font-family:'VT323',monospace;font-size:1.05rem;color:rgba(255,255,255,.32);margin-bottom:8px;line-height:1.5">Controle de acesso DMs. "pairing" recomendado. "open" exige allowFrom=["*"].</p>
          <div style="display:flex;gap:5px;margin-bottom:8px">
            <span class="tag">access</span><span class="tag">network</span><span class="tag">channels</span>
          </div>
          <div class="tab-group" id="dmPolicyTabs">
            <div class="tab-opt" onclick="tabSelect(this)">pairing</div>
            <div class="tab-opt" onclick="tabSelect(this)">allowlist</div>
            <div class="tab-opt active" onclick="tabSelect(this)">open</div>
            <div class="tab-opt" onclick="tabSelect(this)">disabled</div>
          </div>
        </div>

        <!-- Dms Accordion -->
        <div class="accordion" style="margin-top:10px">
          <div class="acc-header" onclick="toggleAcc(this)">
            <span class="acc-title">Dms</span>
            <svg class="acc-chevron open" viewBox="0 0 12 12" fill="none"><rect x="5" y="7" width="2" height="2" fill="currentColor"/><rect x="3" y="5" width="2" height="2" fill="currentColor"/><rect x="7" y="5" width="2" height="2" fill="currentColor"/><rect x="1" y="3" width="2" height="2" fill="currentColor"/><rect x="9" y="3" width="2" height="2" fill="currentColor"/></svg>
          </div>
          <div class="acc-body open">
            <div class="toggle-row" style="margin-bottom:12px"><div><div class="toggle-name">Enabled</div><div class="toggle-desc">Habilitar processamento de DMs.</div></div><div class="toggle-switch on" onclick="this.classList.toggle('on')"></div></div>
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
              <span class="field-label">Group Allow From</span>
              <button class="acc-plus" onclick="addEntry('acc-grpallow','group')"><svg width="8" height="8" viewBox="0 0 8 8" fill="none"><rect x="3" y="1" width="2" height="6" fill="currentColor"/><rect x="1" y="3" width="6" height="2" fill="currentColor"/></svg>Add</button>
            </div>
            <div id="acc-grpallow"><div class="acc-empty">Nenhum item.</div></div>
          </div>
        </div>

        <!-- Group Policy -->
        <div style="margin-top:4px">
          <div class="section-label">Group Policy</div>
          <div class="tab-group" id="groupPolicyTabs">
            <div class="tab-opt" onclick="tabSelect(this)">open</div>
            <div class="tab-opt" onclick="tabSelect(this)">disabled</div>
            <div class="tab-opt active" onclick="tabSelect(this)">allowlist</div>
          </div>
        </div>

        <!-- Groups + Heartbeat + Markdown -->
        <div class="accordion"><div class="acc-header" onclick="toggleAcc(this)"><span class="acc-title">Groups</span><svg class="acc-chevron" viewBox="0 0 12 12" fill="none"><rect x="5" y="7" width="2" height="2" fill="currentColor"/><rect x="3" y="5" width="2" height="2" fill="currentColor"/><rect x="7" y="5" width="2" height="2" fill="currentColor"/><rect x="1" y="3" width="2" height="2" fill="currentColor"/><rect x="9" y="3" width="2" height="2" fill="currentColor"/></svg></div>
          <div class="acc-body">
            <div class="toggle-row"><div><div class="toggle-name">Enabled</div><div class="toggle-desc">Processar mensagens de grupos.</div></div><div class="toggle-switch" onclick="this.classList.toggle('on')"></div></div>
          </div>
        </div>

        <div class="accordion"><div class="acc-header" onclick="toggleAcc(this)"><span class="acc-title">Heartbeat</span><svg class="acc-chevron" viewBox="0 0 12 12" fill="none"><rect x="5" y="7" width="2" height="2" fill="currentColor"/><rect x="3" y="5" width="2" height="2" fill="currentColor"/><rect x="7" y="5" width="2" height="2" fill="currentColor"/><rect x="1" y="3" width="2" height="2" fill="currentColor"/><rect x="9" y="3" width="2" height="2" fill="currentColor"/></svg></div>
          <div class="acc-body">
            <p style="font-family:'VT323',monospace;font-size:1.05rem;color:rgba(255,255,255,.35);margin-bottom:10px">Enviar pings periódicos para manter a conexão ativa.</p>
            <div class="toggle-row"><div><div class="toggle-name">Enabled</div></div><div class="toggle-switch on" onclick="this.classList.toggle('on')"></div></div>
          </div>
        </div>

        <div class="accordion"><div class="acc-header" onclick="toggleAcc(this)"><span class="acc-title">Markdown</span><svg class="acc-chevron" viewBox="0 0 12 12" fill="none"><rect x="5" y="7" width="2" height="2" fill="currentColor"/><rect x="3" y="5" width="2" height="2" fill="currentColor"/><rect x="7" y="5" width="2" height="2" fill="currentColor"/><rect x="1" y="3" width="2" height="2" fill="currentColor"/><rect x="9" y="3" width="2" height="2" fill="currentColor"/></svg></div>
          <div class="acc-body">
            <div class="toggle-row"><div><div class="toggle-name">Enabled</div><div class="toggle-desc">Converter markdown em formatação WhatsApp (*bold*, _italic_).</div></div><div class="toggle-switch on" onclick="this.classList.toggle('on')"></div></div>
          </div>
        </div>

        <!-- Media Max Mb + Text Chunk Limit side by side -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:6px;align-items:start">
          <div>
            <div class="section-label">Media Max Mb</div>
            <div class="stepper">
              <button class="stepper-btn" onclick="step('mediaMb',-10)">−</button>
              <input class="stepper-val" id="mediaMb" type="number" value="50" min="0">
              <button class="stepper-btn" onclick="step('mediaMb',10)">+</button>
            </div>
          </div>
          <div>
            <div class="section-label">Text Chunk Limit</div>
            <div class="stepper">
              <button class="stepper-btn" onclick="step('textChunk',-1)">−</button>
              <input class="stepper-val" id="textChunk" type="number" value="0" min="0">
              <button class="stepper-btn" onclick="step('textChunk',1)">+</button>
            </div>
          </div>
        </div>

        <!-- Prefixes -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:6px">
          <div class="field-wrap">
            <label class="field-label">Message Prefix</label>
            <input class="field-input" type="text" placeholder="ex: [WA]">
          </div>
          <div class="field-wrap">
            <label class="field-label">Response Prefix</label>
            <input class="field-input" type="text" placeholder="ex: [BOT]">
          </div>
        </div>

        <!-- Self-Phone Mode + Send Read Receipts -->
        <div class="toggle-row" style="margin-top:8px">
          <div>
            <div class="toggle-name">WhatsApp Self-Phone Mode</div>
            <div class="toggle-desc">Configuração no mesmo telefone (bot usa seu número pessoal).</div>
            <div class="toggle-tags"><span class="tag">network</span><span class="tag">channels</span></div>
          </div>
          <div class="toggle-switch" onclick="this.classList.toggle('on')"></div>
        </div>
        <div class="toggle-row">
          <div>
            <div class="toggle-name">Send Read Receipts</div>
            <div class="toggle-desc">Enviar confirmação de leitura (✓✓) ao processar mensagens.</div>
          </div>
          <div class="toggle-switch" onclick="this.classList.toggle('on')"></div>
        </div>

        <!-- Current config summary -->
        <div class="inline-info-card" style="margin-top:4px">
          <div class="inline-row"><span class="inline-key">groupPolicy</span><span class="inline-val" id="sumGroupPolicy">allowlist</span></div>
          <div class="inline-row"><span class="inline-key">dmPolicy</span><span class="inline-val" id="sumDmPolicy">open</span></div>
          <div class="inline-row"><span class="inline-key">markdown</span><span class="inline-val" style="color:var(--green)">true</span></div>
          <div class="inline-row"><span class="inline-key">heartbeat</span><span class="inline-val" style="color:var(--green)">true</span></div>
          <div class="inline-row"><span class="inline-key">mediaMb</span><span class="inline-val" id="sumMediaMb">50</span></div>
        </div>

        <!-- Save -->
        <div class="btn-row" style="margin-top:16px">
          <button class="btn btn-primary" onclick="saveConfig()">Save</button>
          <button class="btn" onclick="reloadConfig()">Reload</button>
          <span style="font-family:'VT323',monospace;font-size:1.05rem;color:rgba(255,255,255,.28)">Última atualização: <span id="lastSaved">nunca</span></span>
        </div>

      </div><!-- /card-body -->
    </div><!-- /card -->

  </div><!-- /page-body -->
</main>

<script>
/* ── SIDEBAR MOBILE ── */
const sidebar=document.getElementById('sidebar');
const overlay=document.getElementById('sbOverlay');
const hamburger=document.getElementById('tbHamburger');
let sbOpen=false;
function toggleSidebar(){sbOpen=!sbOpen;sidebar.classList.toggle('open',sbOpen);overlay.classList.toggle('show',sbOpen);hamburger.classList.toggle('open',sbOpen)}
function closeSidebar(){sbOpen=false;sidebar.classList.remove('open');overlay.classList.remove('show');hamburger.classList.remove('open')}

/* ── ACCORDION ── */
function toggleAcc(hdr){
  const body=hdr.nextElementSibling;
  const chev=hdr.querySelector('.acc-chevron');
  body.classList.toggle('open');
  if(chev)chev.classList.toggle('open');
}

/* ── TABS ── */
function tabSelect(el){
  el.closest('.tab-group').querySelectorAll('.tab-opt').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
}

/* ── STEPPER ── */
function step(id,d){
  const el=document.getElementById(id);
  let v=(parseInt(el.value)||0)+d;if(v<0)v=0;
  el.value=v;
  if(id==='mediaMb')document.getElementById('sumMediaMb').textContent=v;
}

/* ── LIST ENTRIES ── */
function addEntry(listId,prefix){
  const list=document.getElementById(listId);
  const empty=list.querySelector('.acc-empty');if(empty)empty.remove();
  const n=list.querySelectorAll('.item-row').length+1;
  const row=document.createElement('div');row.className='item-row';
  row.innerHTML=`<span class="item-num">#${n}</span><input class="field-input" style="flex:1;margin:0 10px" type="text" placeholder="${prefix} ${n}"><button class="item-del" onclick="delItem(this)"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="2" y="2" width="2" height="8" fill="currentColor" opacity=".5"/><rect x="8" y="2" width="2" height="8" fill="currentColor" opacity=".5"/><rect x="4" y="4" width="4" height="4" fill="currentColor" opacity=".3"/></svg></button>`;
  list.appendChild(row);row.querySelector('input').focus();
}
function delItem(btn){
  const row=btn.closest('.item-row'),list=row.parentElement;
  row.remove();
  if(!list.querySelector('.item-row')){const e=document.createElement('div');e.className='acc-empty';e.textContent='Nenhum item.';list.appendChild(e)}
}
function updateCount(listId,countId){
  const n=document.getElementById(listId).querySelectorAll('.item-row').length;
  document.getElementById(countId).textContent=n+' item'+(n!==1?'s':'');
}

/* ── QR CODE ── */
let qrVisible=false;
let qrCountdown=90;
let qrTimer=null;

function generatePixelQR(canvas){
  const ctx=canvas.getContext('2d');
  const size=144;ctx.clearRect(0,0,size,size);
  // draw white bg
  ctx.fillStyle='#fff';ctx.fillRect(0,0,size,size);
  // pixel QR pattern
  const data=[
    [1,1,1,1,1,1,1,0,1,0,1,1,0,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,0,0,1,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,0,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,1,1,0,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,1,0,0,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,1,1,0,1,0,0,0,0,0,0,0,0,0],
    [1,0,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,0,1,1,0],
    [0,1,0,0,1,0,0,0,1,0,0,1,0,0,0,1,0,1,0,0,1],
    [1,1,1,0,1,1,1,0,1,1,0,0,1,1,1,0,1,1,1,0,1],
    [0,0,0,1,0,0,0,0,1,0,1,0,0,0,0,1,0,0,1,0,0],
    [1,0,1,0,1,0,1,0,0,1,1,0,1,0,1,0,1,0,1,0,1],
    [0,0,0,0,0,0,0,0,1,0,0,1,1,0,0,0,1,0,0,1,0],
    [1,1,1,1,1,1,1,0,0,1,0,0,1,0,1,0,0,1,0,1,1],
    [1,0,0,0,0,0,1,0,1,1,1,0,0,1,0,1,0,0,1,0,0],
    [1,0,1,1,1,0,1,0,0,0,1,1,1,0,1,1,1,0,1,1,0],
    [1,0,1,1,1,0,1,0,1,0,0,1,0,1,0,0,0,1,0,0,1],
    [1,0,1,1,1,0,1,0,0,1,1,0,1,0,1,0,1,1,0,1,0],
    [1,0,0,0,0,0,1,0,1,0,0,1,1,1,0,1,0,0,1,0,1],
    [1,1,1,1,1,1,1,0,0,1,0,0,1,0,1,1,0,1,0,1,1],
  ];
  const cellSize=Math.floor(size/data.length);
  data.forEach((row,y)=>{
    row.forEach((cell,x)=>{
      ctx.fillStyle=cell?'#000':'#fff';
      ctx.fillRect(x*cellSize,y*cellSize,cellSize,cellSize);
    });
  });
  // corner squares accent
  ctx.fillStyle='rgba(37,211,102,.15)';
  ctx.fillRect(0,0,cellSize*7,cellSize*7);
  ctx.fillRect(size-cellSize*7,0,cellSize*7,cellSize*7);
  ctx.fillRect(0,size-cellSize*7,cellSize*7,cellSize*7);
}

function toggleQR(){
  qrVisible=!qrVisible;
  const panel=document.getElementById('qrPanel');
  const btn=document.getElementById('qrBtn');
  if(qrVisible){
    panel.classList.add('show');
    btn.textContent='Hide QR';
    generatePixelQR(document.getElementById('qrCanvas'));
    startQRTimer();
    logEvent('QR code gerado — aguardando scan...','warn');
  } else {
    panel.classList.remove('show');
    btn.textContent='Show QR';
    if(qrTimer)clearInterval(qrTimer);
  }
}

function startQRTimer(){
  qrCountdown=90;
  document.getElementById('qrCountdown').textContent=qrCountdown+'s';
  document.getElementById('qrTimer').style.display='none';
  if(qrTimer)clearInterval(qrTimer);
  qrTimer=setInterval(()=>{
    qrCountdown--;
    if(qrCountdown<=0){
      clearInterval(qrTimer);
      document.getElementById('qrCountdown').textContent='0s';
      document.getElementById('qrTimer').style.display='block';
      logEvent('QR expirado.','err');
    } else {
      document.getElementById('qrCountdown').textContent=qrCountdown+'s';
    }
  },1000);
}

function regenerateQR(){
  generatePixelQR(document.getElementById('qrCanvas'));
  startQRTimer();
  logEvent('QR regenerado.','warn');
}

/* ── ACTIONS ── */
function doRefresh(){
  const btn=document.getElementById('refreshBtn');
  const orig=btn.textContent;
  btn.innerHTML='<svg style="width:11px;height:11px;animation:spin .7s linear infinite;vertical-align:middle;image-rendering:pixelated" viewBox="0 0 16 16" fill="none"><rect x="4" y="2" width="8" height="2" fill="currentColor" opacity=".7"/><rect x="2" y="4" width="2" height="8" fill="currentColor" opacity=".5"/><rect x="12" y="4" width="2" height="8" fill="currentColor" opacity=".5"/><rect x="4" y="12" width="8" height="2" fill="currentColor" opacity=".5"/></svg>';
  logEvent('Atualizando status...','info');
  setTimeout(()=>{btn.textContent=orig;logEvent('Status atualizado.','ok')},1200);
}

function doRelink(){
  logEvent('Desconectando para novo link...','warn');
  document.getElementById('sc-linked').textContent='No';
  document.getElementById('sc-linked').className='status-val no';
  setTimeout(()=>{
    document.getElementById('sc-linked').textContent='Yes';
    document.getElementById('sc-linked').className='status-val yes';
    logEvent('Relink OK.','ok');
  },2000);
}

function waitScan(){logEvent('Aguardando scan do QR...','warn');toggleQR()}

function doLogout(){
  if(confirm('Tem certeza? O WhatsApp será desconectado.')){
    ['sc-linked','sc-running','sc-connected'].forEach(id=>{
      const el=document.getElementById(id);el.textContent='No';el.className='status-val no';
    });
    logEvent('Logout executado. Canal desconectado.','err');
  }
}

function saveConfig(){
  logEvent('Configuração salva.','ok');
  const now=new Date();
  document.getElementById('lastSaved').textContent=
    String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0')+':'+String(now.getSeconds()).padStart(2,'0');
  // sync summary
  const dmActive=document.querySelector('#dmPolicyTabs .tab-opt.active');
  if(dmActive)document.getElementById('sumDmPolicy').textContent=dmActive.textContent;
  const gpActive=document.querySelector('#groupPolicyTabs .tab-opt.active');
  if(gpActive)document.getElementById('sumGroupPolicy').textContent=gpActive.textContent;
  document.getElementById('sumMediaMb').textContent=document.getElementById('mediaMb').value;
}

function reloadConfig(){
  logEvent('Recarregando configuração do runtime...','info');
  setTimeout(()=>logEvent('Runtime recarregado.','ok'),800);
}

/* ── LOG ── */
function logEvent(msg,type){
  const area=document.getElementById('logArea');
  const now=new Date();
  const t=String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0')+':'+String(now.getSeconds()).padStart(2,'0');
  const classMap={ok:'log-ok',warn:'log-warn',err:'log-err',info:'log-info'};
  const prefix={ok:'[OK]',warn:'[WARN]',err:'[ERR]',info:'[INFO]'}[type]||'[INFO]';
  const line=document.createElement('div');line.className='log-line';
  line.innerHTML=`<span class="log-time">${t}</span><span class="${classMap[type]||'log-info'}">${prefix}</span><span>${msg}</span>`;
  area.appendChild(line);
  area.scrollTop=area.scrollHeight;
}

function clearLog(){document.getElementById('logArea').innerHTML='';logEvent('Log limpo.','info')}

/* ── UPTIME COUNTER ── */
let uptimeSecs=554;
setInterval(()=>{
  uptimeSecs++;
  const h=Math.floor(uptimeSecs/3600);
  const m=Math.floor((uptimeSecs%3600)/60);
  const s=uptimeSecs%60;
  document.getElementById('sc-uptime').textContent=
    String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
},1000);

/* spin css */
const st=document.createElement('style');st.textContent='@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}';
document.head.appendChild(st);
</script>
<script src="/assets/vexus-api.js"></script>
<script src="/assets/vexus-auth.js"></script>
<script src="/assets/pages/channels.js"></script>
<script src="vexus-ui.js"></script>
</body>
</html>
