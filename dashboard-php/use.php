<?php $menuActive = 'usage'; ?>
<!DOCTYPE html>
<html lang="pt-BR" style="color-scheme:dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>VexusClaw — Uso</title>
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap" rel="stylesheet">
<style>
:root{
  --bg:#07030f;--bg-card:#0d0820;--bg-surface:#110c28;--bg-sidebar:#09051a;--bg-input:#0a0618;
  --border:#251a55;--border-light:#1a1035;
  --accent:#b44dff;--accent2:#8a2be2;--accent-bright:#d088ff;
  --green:#44ffaa;--yellow:#ffbd2e;--red:#ff4444;
  --px-s:-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000;
  --px-sa:-1px -1px 0 #3d0070,1px -1px 0 #3d0070,-1px 1px 0 #3d0070,1px 1px 0 #3d0070;
  --sidebar-w:220px;--topbar-h:50px;
}
*{margin:0;padding:0;box-sizing:border-box;color:#fff}
html,body{height:100%;overflow:hidden}
body{background:var(--bg);font-family:'VT323',monospace;font-size:17px}
::selection{background:var(--accent2)}
input,select,textarea,button{font-family:inherit}

body::before{content:'';position:fixed;inset:0;z-index:0;pointer-events:none;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect x='0' y='0' width='1' height='1' fill='%23ffffff' opacity='0.007'/%3E%3Crect x='2' y='2' width='1' height='1' fill='%23ffffff' opacity='0.007'/%3E%3C/svg%3E");
  background-size:4px 4px}

/* ══ TOPBAR ══ */
.topbar{position:fixed;top:0;left:0;right:0;z-index:300;height:var(--topbar-h);
  background:rgba(9,5,26,.97);border-bottom:2px solid var(--border);
  display:flex;align-items:center;padding:0 14px}
.tb-hamburger{width:34px;height:34px;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:5px;cursor:pointer;border:none;background:none;border-radius:3px;transition:.2s;flex-shrink:0}
.tb-hamburger:hover{background:rgba(180,77,255,.1)}
.tb-hamburger span{display:block;width:18px;height:2px;background:rgba(255,255,255,.5);border-radius:1px}
.tb-logo{display:flex;align-items:center;gap:8px;margin-left:10px;margin-right:auto}
.tb-logo img{width:24px;height:24px;image-rendering:pixelated;filter:drop-shadow(0 0 5px rgba(180,77,255,.5))}
.tb-logo-name{font-family:'Press Start 2P',monospace;font-size:.62rem;text-shadow:var(--px-sa)}
.tb-logo-sub{font-family:'Press Start 2P',monospace;font-size:.32rem;color:rgba(255,255,255,.28);letter-spacing:2px}
.logo-blink{color:var(--accent-bright);animation:blink .9s step-end infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
.tb-right{display:flex;align-items:center;gap:7px}
.tb-badge{display:flex;align-items:center;gap:5px;padding:5px 9px;background:var(--bg-surface);border:1px solid var(--border);border-radius:3px;font-family:'Press Start 2P',monospace;font-size:.38rem;text-shadow:var(--px-s);box-shadow:2px 2px 0 rgba(0,0,0,.4)}
.tb-dot{width:7px;height:7px;border-radius:2px;flex-shrink:0;box-shadow:0 0 5px currentColor}
.tb-dot.green{background:var(--green);color:var(--green)}
.tb-dot.yellow{background:var(--yellow);color:var(--yellow)}
.tb-lbl{color:rgba(255,255,255,.38)}
.tb-val{color:rgba(255,255,255,.8)}
.tb-icon-btn{width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:var(--bg-surface);border:1px solid var(--border);border-radius:3px;cursor:pointer;transition:.2s;box-shadow:2px 2px 0 rgba(0,0,0,.3)}
.tb-icon-btn:hover{border-color:var(--accent);background:rgba(180,77,255,.1)}
.tb-icon-btn svg{width:15px;height:15px;image-rendering:pixelated;opacity:.55}
.tb-avatar{width:32px;height:32px;background:linear-gradient(135deg,var(--accent),var(--accent2));border:2px solid var(--border);border-radius:3px;display:flex;align-items:center;justify-content:center;font-family:'Press Start 2P',monospace;font-size:.46rem;cursor:pointer;box-shadow:2px 2px 0 rgba(0,0,0,.4);flex-shrink:0;text-shadow:var(--px-s)}
@media(max-width:600px){.tb-badge,.tb-icon-btn{display:none}}

/* ══ UPDATE BANNER ══ */
.update-banner{position:fixed;top:var(--topbar-h);left:var(--sidebar-w);right:0;z-index:200;
  padding:8px 20px;background:rgba(180,77,255,.07);border-bottom:2px solid rgba(180,77,255,.18);
  display:flex;align-items:center;justify-content:center;gap:12px;
  font-family:'Press Start 2P',monospace;font-size:.38rem;text-shadow:var(--px-s)}
.banner-text{color:var(--accent-bright);text-shadow:var(--px-sa)}
.banner-text span{color:rgba(255,255,255,.4)}
.banner-btn{padding:5px 11px;background:linear-gradient(135deg,var(--accent),var(--accent2));border:none;border-radius:3px;font-family:'Press Start 2P',monospace;font-size:.36rem;color:#fff;cursor:pointer;box-shadow:2px 2px 0 #3d0070;transition:.15s}
.banner-btn:hover{transform:translate(-1px,-1px)}
.banner-x{cursor:pointer;opacity:.4;font-size:1.2rem;margin-left:6px}
.banner-x:hover{opacity:1}
@media(max-width:768px){.update-banner{left:0}}

/* ══ SIDEBAR ══ */
.sidebar{position:fixed;top:var(--topbar-h);left:0;bottom:0;z-index:200;width:var(--sidebar-w);
  background:var(--bg-sidebar);border-right:2px solid var(--border);
  display:flex;flex-direction:column;overflow-y:auto;overflow-x:hidden;
  transition:transform .25s cubic-bezier(.4,0,.2,1)}
.sidebar::-webkit-scrollbar{width:3px}
.sidebar::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}
@media(max-width:768px){.sidebar{transform:translateX(-100%)}}
.sg-label{display:flex;align-items:center;justify-content:space-between;padding:9px 14px 6px;
  font-family:'Press Start 2P',monospace;font-size:.38rem;color:rgba(255,255,255,.22);letter-spacing:1px}
.sg-minus{opacity:.3;font-size:.9rem}
.nav-item{display:flex;align-items:center;gap:9px;padding:10px 14px;cursor:pointer;transition:.15s;border-left:2px solid transparent}
.nav-item:hover{background:rgba(180,77,255,.07);border-left-color:rgba(180,77,255,.18)}
.nav-item.active{background:rgba(180,77,255,.13);border-left-color:var(--accent)}
.nav-item svg{width:15px;height:15px;image-rendering:pixelated;flex-shrink:0;opacity:.45}
.nav-item:hover svg,.nav-item.active svg{opacity:.9}
.nav-lbl{font-family:'Press Start 2P',monospace;font-size:.46rem;color:rgba(255,255,255,.45);text-shadow:var(--px-s)}
.nav-item.active .nav-lbl{color:var(--accent-bright);text-shadow:var(--px-sa)}
.nav-badge{margin-left:auto;padding:2px 6px;background:var(--accent);border-radius:2px;font-family:'Press Start 2P',monospace;font-size:.35rem;box-shadow:1px 1px 0 #3d0070}
.px-div{height:2px;background:repeating-linear-gradient(90deg,var(--accent) 0,var(--accent) 4px,transparent 4px,transparent 8px);opacity:.1}
.sb-bottom{margin-top:auto;border-top:2px solid var(--border);padding:10px 14px;display:flex;align-items:center;gap:8px}
.sb-avatar{width:28px;height:28px;background:linear-gradient(135deg,var(--accent),var(--accent2));border-radius:3px;display:flex;align-items:center;justify-content:center;font-family:'Press Start 2P',monospace;font-size:.42rem;flex-shrink:0}
.sb-name{font-family:'Press Start 2P',monospace;font-size:.42rem;display:block}
.sb-status{font-family:'VT323',monospace;font-size:1rem;color:var(--green);display:flex;align-items:center;gap:4px}
.sb-status::before{content:'';width:5px;height:5px;background:var(--green);border-radius:1px;box-shadow:0 0 4px var(--green)}

/* ══ MAIN ══ */
.main{position:fixed;top:calc(var(--topbar-h) + 38px);left:var(--sidebar-w);right:0;bottom:0;
  overflow-y:auto;overflow-x:hidden}
.main::-webkit-scrollbar{width:5px}
.main::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}
@media(max-width:768px){.main{left:0}}

/* ══ PAGE ══ */
.page-hdr{padding:20px 26px 14px;border-bottom:2px solid var(--border);background:rgba(9,5,26,.5)}
.page-title{font-family:'Press Start 2P',monospace;font-size:.9rem;text-shadow:var(--px-s);margin-bottom:5px}
.page-desc{font-family:'VT323',monospace;font-size:1.2rem;color:rgba(255,255,255,.38)}
.page-body{padding:20px 26px;display:flex;flex-direction:column;gap:16px}
@media(max-width:600px){.page-hdr{padding:14px 16px 10px}.page-body{padding:12px 14px}}

/* ══ CARD ══ */
.card{background:var(--bg-card);border:2px solid var(--border);border-radius:6px;
  box-shadow:4px 4px 0 rgba(0,0,0,.5);overflow:hidden;position:relative}
.card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;
  background:repeating-linear-gradient(90deg,var(--accent) 0,var(--accent) 4px,transparent 4px,transparent 8px);opacity:.25}
.card-hdr{padding:14px 18px 12px;border-bottom:2px solid var(--border-light);display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}
.card-title{font-family:'Press Start 2P',monospace;font-size:.62rem;text-shadow:var(--px-s)}
.card-body{padding:16px 18px}

/* ══ BUTTONS ══ */
.btn{padding:8px 14px;border:2px solid var(--border);border-radius:4px;font-family:'Press Start 2P',monospace;font-size:.44rem;text-shadow:var(--px-s);cursor:pointer;transition:.2s;box-shadow:2px 2px 0 rgba(0,0,0,.4);background:var(--bg-surface)}
.btn:hover{border-color:var(--accent);background:rgba(180,77,255,.1);transform:translate(-1px,-1px)}
.btn:active{transform:translate(1px,1px);box-shadow:1px 1px 0}
.btn-primary{background:linear-gradient(135deg,var(--accent),var(--accent2));border-color:var(--accent2);box-shadow:3px 3px 0 #3d0070}
.btn-primary:hover{box-shadow:4px 4px 0 #3d0070}
.btn-active{background:linear-gradient(135deg,var(--accent),var(--accent2));border-color:var(--accent2);box-shadow:3px 3px 0 #3d0070}

/* ══ FILTERS CARD ══ */
.filters-card{background:var(--bg-card);border:2px solid var(--border);border-radius:6px;box-shadow:4px 4px 0 rgba(0,0,0,.5);overflow:hidden;position:relative;padding:16px 18px}
.filters-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:repeating-linear-gradient(90deg,var(--accent) 0,var(--accent) 4px,transparent 4px,transparent 8px);opacity:.25}
.filters-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;flex-wrap:wrap;gap:8px}
.filters-label{font-family:'Press Start 2P',monospace;font-size:.52rem;text-shadow:var(--px-s)}
.filters-hint{font-family:'VT323',monospace;font-size:1.1rem;color:rgba(255,255,255,.32);margin-left:10px}
.filters-btns-right{display:flex;gap:8px;align-items:center}
.range-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:12px}
.range-presets{display:flex;gap:4px}
.preset-btn{padding:7px 12px;background:var(--bg-surface);border:2px solid var(--border);border-radius:4px;font-family:'Press Start 2P',monospace;font-size:.42rem;cursor:pointer;transition:.2s;box-shadow:2px 2px 0 rgba(0,0,0,.3)}
.preset-btn:hover{border-color:var(--accent);background:rgba(180,77,255,.08)}
.preset-btn.active{background:linear-gradient(135deg,rgba(180,77,255,.25),rgba(138,43,226,.25));border-color:var(--accent);color:var(--accent-bright)}
.range-sep{font-family:'VT323',monospace;font-size:1.2rem;color:rgba(255,255,255,.3)}
.date-input{padding:7px 10px;background:var(--bg-input);border:2px solid var(--border);border-radius:4px;font-family:'VT323',monospace;font-size:1.1rem;color:#fff;outline:none;transition:.2s;cursor:pointer;min-width:130px}
.date-input:focus{border-color:var(--accent)}
.tz-select{padding:7px 10px;background:var(--bg-input);border:2px solid var(--border);border-radius:4px;font-family:'VT323',monospace;font-size:1.1rem;color:rgba(255,255,255,.7);outline:none;cursor:pointer;appearance:none;-webkit-appearance:none;padding-right:24px;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10'%3E%3Crect x='4' y='6' width='2' height='2' fill='%23666'/%3E%3Crect x='2' y='4' width='2' height='2' fill='%23666'/%3E%3Crect x='6' y='4' width='2' height='2' fill='%23666'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 8px center}
.metric-toggle{display:flex;background:var(--bg-input);border:2px solid var(--border);border-radius:4px;overflow:hidden;box-shadow:2px 2px 0 rgba(0,0,0,.3)}
.metric-btn{padding:7px 13px;font-family:'Press Start 2P',monospace;font-size:.42rem;cursor:pointer;transition:.2s;background:none;border:none;color:rgba(255,255,255,.4)}
.metric-btn:hover{background:rgba(180,77,255,.07);color:rgba(255,255,255,.7)}
.metric-btn.active{background:linear-gradient(135deg,var(--accent),var(--accent2));color:#fff;text-shadow:var(--px-s)}
.refresh-btn{padding:8px 16px;background:linear-gradient(135deg,var(--red),#cc2200);border:none;border-radius:4px;font-family:'Press Start 2P',monospace;font-size:.44rem;color:#fff;text-shadow:var(--px-s);cursor:pointer;box-shadow:3px 3px 0 #550800;transition:.2s}
.refresh-btn:hover{transform:translate(-1px,-1px);box-shadow:4px 4px 0 #550800}
.refresh-btn:active{transform:translate(1px,1px);box-shadow:1px 1px 0 #550800}
.filter-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.filter-text-input{flex:1;min-width:200px;padding:8px 12px;background:var(--bg-input);border:2px solid var(--border);border-radius:4px;font-family:'VT323',monospace;font-size:1.1rem;color:#fff;outline:none;transition:.2s}
.filter-text-input:focus{border-color:var(--accent)}
.filter-text-input::placeholder{color:rgba(255,255,255,.2)}
.filter-client-btn{padding:8px 12px;background:var(--bg-surface);border:2px solid var(--border);border-radius:4px;font-family:'Press Start 2P',monospace;font-size:.4rem;color:rgba(255,255,255,.5);cursor:pointer;transition:.2s;box-shadow:2px 2px 0 rgba(0,0,0,.3);white-space:nowrap}
.filter-client-btn:hover{border-color:var(--accent);color:#fff}
.filter-count{font-family:'Press Start 2P',monospace;font-size:.38rem;color:rgba(255,255,255,.3);white-space:nowrap;padding:8px 10px;background:var(--bg-input);border:2px solid var(--border);border-radius:4px}
.filter-tip{font-family:'VT323',monospace;font-size:1rem;color:rgba(255,255,255,.3);padding:6px 0 0}

/* ══ CHART CARD ══ */
.chart-card{background:var(--bg-card);border:2px solid var(--border);border-radius:6px;box-shadow:4px 4px 0 rgba(0,0,0,.5);overflow:hidden;position:relative}
.chart-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:repeating-linear-gradient(90deg,var(--accent) 0,var(--accent) 4px,transparent 4px,transparent 8px);opacity:.25}
.chart-hdr{padding:14px 18px 12px;border-bottom:2px solid var(--border-light);display:flex;align-items:flex-start;justify-content:space-between;gap:10px}
.chart-title{font-family:'Press Start 2P',monospace;font-size:.56rem;text-shadow:var(--px-s);margin-bottom:3px}
.chart-desc{font-family:'VT323',monospace;font-size:1rem;color:rgba(255,255,255,.3)}
.chart-total{font-family:'Press Start 2P',monospace;font-size:1.1rem;text-shadow:var(--px-s);color:rgba(255,255,255,.6)}
.chart-area{padding:10px 18px 14px;position:relative;min-height:130px;display:flex;align-items:center;justify-content:center}
/* actual bars */
.bars-wrap{width:100%;height:100px;display:flex;align-items:flex-end;gap:3px;padding:0 4px}
.bar-col{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;transition:.2s}
.bar-col:hover .bar-inner{filter:brightness(1.3)}
.bar-inner{width:100%;border-radius:2px 2px 0 0;transition:height .4s cubic-bezier(.4,0,.2,1),opacity .2s}
.bar-col.empty .bar-inner{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06)}
.bar-col.filled .bar-inner{background:linear-gradient(180deg,var(--accent),var(--accent2));box-shadow:0 0 8px rgba(180,77,255,.3)}
.bar-label{font-family:'Press Start 2P',monospace;font-size:.28rem;color:rgba(255,255,255,.2);margin-top:2px;white-space:nowrap}
.no-data-msg{font-family:'Press Start 2P',monospace;font-size:.44rem;color:rgba(255,255,255,.2);text-align:center;padding:30px 0}

/* ══ BOTTOM ROW ══ */
.bottom-row{display:grid;grid-template-columns:1fr 1fr;gap:16px}
@media(max-width:700px){.bottom-row{grid-template-columns:1fr}}

/* daily usage */
.du-card{background:var(--bg-card);border:2px solid var(--border);border-radius:6px;box-shadow:4px 4px 0 rgba(0,0,0,.5);overflow:hidden;position:relative}
.du-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:repeating-linear-gradient(90deg,var(--green) 0,var(--green) 4px,transparent 4px,transparent 8px);opacity:.2}
.du-hdr{padding:14px 18px 12px;border-bottom:2px solid var(--border-light)}
.du-title{font-family:'Press Start 2P',monospace;font-size:.56rem;text-shadow:var(--px-s);margin-bottom:3px}
.du-body{padding:12px 18px;min-height:200px;display:flex;flex-direction:column}
.du-bars{flex:1;display:flex;align-items:flex-end;gap:4px;min-height:130px;padding:8px 0}
.du-bar-col{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer}
.du-bar-col:hover .du-bar-inner{filter:brightness(1.3)}
.du-bar-inner{width:100%;border-radius:2px 2px 0 0;transition:height .5s cubic-bezier(.4,0,.2,1)}
.du-label{font-family:'Press Start 2P',monospace;font-size:.28rem;color:rgba(255,255,255,.2)}
.du-no-data{font-family:'Press Start 2P',monospace;font-size:.44rem;color:rgba(255,255,255,.2);text-align:center;flex:1;display:flex;align-items:center;justify-content:center}
.du-legend{display:flex;gap:12px;padding:8px 0 2px;flex-wrap:wrap}
.du-legend-item{display:flex;align-items:center;gap:5px;font-family:'Press Start 2P',monospace;font-size:.34rem;color:rgba(255,255,255,.4)}
.du-dot{width:8px;height:8px;border-radius:2px}

/* sessions panel */
.sess-card{background:var(--bg-card);border:2px solid var(--border);border-radius:6px;box-shadow:4px 4px 0 rgba(0,0,0,.5);overflow:hidden;position:relative;display:flex;flex-direction:column}
.sess-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:repeating-linear-gradient(90deg,var(--yellow) 0,var(--yellow) 4px,transparent 4px,transparent 8px);opacity:.2}
.sess-hdr{padding:14px 18px 12px;border-bottom:2px solid var(--border-light);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px}
.sess-hdr-left{font-family:'Press Start 2P',monospace;font-size:.56rem;text-shadow:var(--px-s)}
.sess-hdr-count{font-family:'Press Start 2P',monospace;font-size:.42rem;color:rgba(255,255,255,.3)}
.sess-meta-row{padding:10px 18px;border-bottom:2px solid var(--border-light);display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}
.sess-stats{display:flex;align-items:center;gap:10px}
.sess-stat-val{font-family:'Press Start 2P',monospace;font-size:.42rem;color:rgba(255,255,255,.5)}
.sess-stat-sep{color:rgba(255,255,255,.15);font-size:.6rem}
.sess-tabs{display:flex;background:var(--bg-input);border:2px solid var(--border);border-radius:4px;overflow:hidden}
.sess-tab{padding:6px 11px;font-family:'Press Start 2P',monospace;font-size:.38rem;cursor:pointer;transition:.2s;background:none;border:none;color:rgba(255,255,255,.4)}
.sess-tab:hover{background:rgba(180,77,255,.07);color:rgba(255,255,255,.7)}
.sess-tab.active{background:linear-gradient(135deg,var(--accent),var(--accent2));color:#fff}
.sess-sort-row{padding:8px 18px;border-bottom:2px solid var(--border-light);display:flex;align-items:center;gap:8px}
.sess-sort-label{font-family:'Press Start 2P',monospace;font-size:.38rem;color:rgba(255,255,255,.3)}
.sess-sort-sel{padding:5px 8px;background:var(--bg-surface);border:1px solid var(--border);border-radius:3px;font-family:'VT323',monospace;font-size:1rem;color:rgba(255,255,255,.6);outline:none;cursor:pointer;appearance:none;-webkit-appearance:none}
.sess-body{padding:10px 18px;flex:1;min-height:140px;display:flex;align-items:center;justify-content:center}
.sess-no-data{font-family:'Press Start 2P',monospace;font-size:.42rem;color:rgba(255,255,255,.2);text-align:center}

/* session row (when data exists) */
.sess-item{padding:10px 0;border-bottom:1px solid rgba(37,26,85,.4);display:flex;align-items:center;justify-content:space-between;gap:10px;width:100%}
.sess-item:last-child{border-bottom:none}
.sess-item-key{font-family:'Press Start 2P',monospace;font-size:.36rem;color:var(--accent-bright);text-shadow:var(--px-sa);word-break:break-all;line-height:1.8}
.sess-item-tokens{font-family:'VT323',monospace;font-size:1rem;color:rgba(255,255,255,.4);white-space:nowrap}
.sess-item-bar{width:100%;height:3px;background:rgba(255,255,255,.06);border-radius:2px;margin-top:4px}
.sess-item-bar-fill{height:100%;border-radius:2px;background:linear-gradient(90deg,var(--accent),var(--accent2))}

/* pin/export */
.pin-btn{padding:7px 12px;background:var(--bg-surface);border:2px solid var(--border);border-radius:4px;font-family:'Press Start 2P',monospace;font-size:.4rem;color:rgba(255,255,255,.5);cursor:pointer;transition:.2s;box-shadow:2px 2px 0 rgba(0,0,0,.3)}
.pin-btn:hover{border-color:var(--accent);color:#fff}
.export-btn{padding:7px 12px;background:var(--bg-surface);border:2px solid var(--border);border-radius:4px;font-family:'Press Start 2P',monospace;font-size:.4rem;color:rgba(255,255,255,.5);cursor:pointer;transition:.2s;box-shadow:2px 2px 0 rgba(0,0,0,.3);display:flex;align-items:center;gap:5px}
.export-btn:hover{border-color:var(--accent);color:#fff}

/* tooltip */
.chart-tooltip{position:absolute;background:var(--bg-surface);border:2px solid var(--border);border-radius:4px;padding:8px 12px;font-family:'Press Start 2P',monospace;font-size:.38rem;text-shadow:var(--px-s);box-shadow:3px 3px 0 rgba(0,0,0,.5);pointer-events:none;display:none;z-index:10;white-space:nowrap}

@keyframes pgIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes barIn{from{transform:scaleY(0);transform-origin:bottom}to{transform:scaleY(1);transform-origin:bottom}}
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

  <div class="page-hdr">
    <div class="page-title">Uso</div>
    <div class="page-desc">Veja onde os tokens vão, quando as sessões aumentam e o que impulsiona o custo.</div>
  </div>

  <div class="page-body">

    <!-- ══ FILTERS CARD ══ -->
    <div class="filters-card">
      <div class="filters-top">
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
          <span class="filters-label">Filtros</span>
          <span class="filters-hint">Selecione um período e clique em Atualizar para carregar o uso.</span>
        </div>
        <div class="filters-btns-right">
          <button class="pin-btn" id="pinBtn" onclick="togglePin()">Pin</button>
          <div class="export-btn" onclick="showExportMenu()">
            Export
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><rect x="3" y="4" width="2" height="2" fill="currentColor" opacity=".5"/><rect x="1" y="6" width="2" height="2" fill="currentColor" opacity=".5"/><rect x="5" y="6" width="2" height="2" fill="currentColor" opacity=".5"/><rect x="3" y="0" width="2" height="4" fill="currentColor" opacity=".6"/></svg>
            ▾
          </div>
        </div>
      </div>

      <!-- Date range row -->
      <div class="range-row">
        <div class="range-presets">
          <button class="preset-btn active" onclick="setPreset(this,'today')">Today</button>
          <button class="preset-btn" onclick="setPreset(this,'7d')">7d</button>
          <button class="preset-btn" onclick="setPreset(this,'30d')">30d</button>
        </div>
        <input class="date-input" type="date" id="dateFrom" value="2026-03-12">
        <span class="range-sep">to</span>
        <input class="date-input" type="date" id="dateTo" value="2026-03-12">
        <select class="tz-select">
          <option>Local</option>
          <option>UTC</option>
          <option>GMT-3</option>
        </select>
        <div class="metric-toggle">
          <button class="metric-btn active" id="btnTokens" onclick="setMetric('tokens')">Tokens</button>
          <button class="metric-btn" id="btnCost" onclick="setMetric('cost')">Cost</button>
        </div>
        <button class="refresh-btn" id="refreshBtn" onclick="doRefresh()">Refresh</button>
      </div>

      <!-- Filter text row -->
      <div class="filter-row">
        <input class="filter-text-input" type="text" id="filterInput"
          placeholder="Filtrar sessões (ex: key:agent:main:cron* model:gpt-4o has:errors minTokens:2000)"
          oninput="applyFilter()">
        <button class="filter-client-btn" onclick="applyFilter()">Filter (client-side)</button>
        <div class="filter-count" id="filterCount">0 sessões no período</div>
      </div>
      <div class="filter-tip">Dica: use filtros ou clique nas barras para filtrar por dias.</div>
    </div>

    <!-- ══ ACTIVITY BY TIME CARD ══ -->
    <div class="chart-card">
      <div class="chart-hdr">
        <div>
          <div class="chart-title">Atividade por Tempo</div>
          <div class="chart-desc">Estimativas requerem timestamps de sessão.</div>
        </div>
        <div class="chart-total" id="chartTotal">0 tokens</div>
      </div>
      <div class="chart-area" id="chartArea">
        <div class="no-data-msg" id="chartNoData">Sem dados de timeline ainda.</div>
        <div class="bars-wrap" id="barsWrap" style="display:none"></div>
        <div class="chart-tooltip" id="chartTooltip"></div>
      </div>
    </div>

    <!-- ══ BOTTOM ROW ══ -->
    <div class="bottom-row">

      <!-- Daily Usage -->
      <div class="du-card">
        <div class="du-hdr">
          <div class="du-title">Uso Diário</div>
        </div>
        <div class="du-body">
          <div class="du-no-data" id="duNoData">Sem dados</div>
          <div class="du-bars" id="duBars" style="display:none"></div>
          <div class="du-legend" id="duLegend" style="display:none">
            <div class="du-legend-item"><div class="du-dot" style="background:var(--accent)"></div>Tokens</div>
            <div class="du-legend-item"><div class="du-dot" style="background:var(--green)"></div>Sessões</div>
            <div class="du-legend-item"><div class="du-dot" style="background:var(--red);opacity:.7"></div>Erros</div>
          </div>
        </div>
      </div>

      <!-- Sessions -->
      <div class="sess-card">
        <div class="sess-hdr">
          <span class="sess-hdr-left">Sessões</span>
          <span class="sess-hdr-count" id="sessShown">0 mostradas</span>
        </div>
        <div class="sess-meta-row">
          <div class="sess-stats">
            <span class="sess-stat-val" id="sessAvg">0 avg</span>
            <span class="sess-stat-sep">/</span>
            <span class="sess-stat-val" id="sessErrors" style="color:rgba(255,68,68,.7)">0 erros</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px">
            <div class="sess-tabs">
              <button class="sess-tab active" onclick="sessTab(this,'all')">Todas</button>
              <button class="sess-tab" onclick="sessTab(this,'recent')">Vistas recente</button>
            </div>
          </div>
        </div>
        <div class="sess-sort-row">
          <span class="sess-sort-label">Ordenar</span>
          <select class="sess-sort-sel" onchange="sortSessions(this.value)">
            <option value="recent">Recente</option>
            <option value="tokens">Mais tokens</option>
            <option value="errors">Com erros</option>
          </select>
          <span style="margin-left:auto;font-family:'Press Start 2P',monospace;font-size:.34rem;color:rgba(255,255,255,.2)" id="sessArrow">↓</span>
        </div>
        <div class="sess-body" id="sessBody">
          <div class="sess-no-data">Sem sessões no período</div>
        </div>
      </div>

    </div><!-- /bottom-row -->

  </div><!-- /page-body -->
</main>

<script>
/* ── STATE ── */
let metric='tokens';
let pinned=false;
let currentData=[];
let filterStr='';

/* ── PRESET ── */
function setPreset(btn,preset){
  document.querySelectorAll('.preset-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  const today=new Date();
  const fmt=d=>d.toISOString().slice(0,10);
  const from=new Date(today);
  if(preset==='7d')from.setDate(today.getDate()-6);
  else if(preset==='30d')from.setDate(today.getDate()-29);
  document.getElementById('dateFrom').value=fmt(from);
  document.getElementById('dateTo').value=fmt(today);
}

/* ── METRIC ── */
function setMetric(m){
  metric=m;
  document.getElementById('btnTokens').classList.toggle('active',m==='tokens');
  document.getElementById('btnCost').classList.toggle('active',m==='cost');
  renderAll();
}

/* ── REFRESH ── */
function doRefresh(){
  const btn=document.getElementById('refreshBtn');
  btn.innerHTML='<svg style="width:12px;height:12px;animation:spin .7s linear infinite;vertical-align:middle;image-rendering:pixelated" viewBox="0 0 16 16" fill="none"><rect x="4" y="2" width="8" height="2" fill="currentColor" opacity=".7"/><rect x="2" y="4" width="2" height="8" fill="currentColor" opacity=".5"/><rect x="12" y="4" width="2" height="8" fill="currentColor" opacity=".5"/><rect x="4" y="12" width="8" height="2" fill="currentColor" opacity=".5"/></svg>';
  setTimeout(()=>{
    btn.textContent='Refresh';
    // Generate fake data for demo
    generateDemoData();
  },1000);
}

/* ── GENERATE DEMO DATA ── */
function generateDemoData(){
  const presetActive=document.querySelector('.preset-btn.active')?.textContent||'Today';
  const days=presetActive==='30d'?30:presetActive==='7d'?7:1;
  
  const sessions=[];
  const keyPrefixes=['agent:main:main','agent:main:whatsapp:group','agent:gpt-plus-1:main','agent:main:openai'];
  for(let i=0;i<Math.floor(Math.random()*8)+3;i++){
    sessions.push({
      key:keyPrefixes[i%keyPrefixes.length]+(i>3?':'+Math.random().toString(36).slice(2,10):''),
      tokens:Math.floor(Math.random()*120000)+5000,
      errors:Math.random()>.7?Math.floor(Math.random()*5):0,
      updated:Math.floor(Math.random()*60)+'m ago'
    });
  }
  currentData=sessions;

  const totalTokens=sessions.reduce((a,b)=>a+b.tokens,0);
  
  // generate hourly/daily bar data
  const barCount=days===1?24:days;
  const bars=[];
  for(let i=0;i<barCount;i++){
    const hasData=Math.random()>.3;
    bars.push({
      val:hasData?Math.floor(Math.random()*80000)+1000:0,
      label:days===1?String(i).padStart(2,'0')+'h':(days===7?['Seg','Ter','Qua','Qui','Sex','Sab','Dom'][i%7]:String(i+1))
    });
  }

  // Update chart total
  document.getElementById('chartTotal').textContent=
    metric==='tokens'?fmtTokens(totalTokens):('$'+((totalTokens/1000000)*15).toFixed(4));
  
  // Update filter count
  document.getElementById('filterCount').textContent=sessions.length+' sessões no período';

  renderBars(bars,totalTokens);
  renderDailyUsage(bars);
  renderSessions(sessions);
}

/* ── RENDER BARS ══ */
function renderBars(bars,total){
  const noData=document.getElementById('chartNoData');
  const wrap=document.getElementById('barsWrap');
  
  if(!bars||bars.every(b=>b.val===0)){
    noData.style.display='block';wrap.style.display='none';
    document.getElementById('chartTotal').textContent='0 tokens';
    return;
  }
  noData.style.display='none';wrap.style.display='flex';
  wrap.innerHTML='';
  const max=Math.max(...bars.map(b=>b.val));
  bars.forEach((b,i)=>{
    const col=document.createElement('div');
    col.className='bar-col '+(b.val>0?'filled':'empty');
    const h=b.val>0?Math.max((b.val/max)*88,4):4;
    col.innerHTML=`<div class="bar-inner" style="height:${h}px"></div><div class="bar-label">${b.label}</div>`;
    col.addEventListener('mouseenter',e=>showTooltip(e,b,i));
    col.addEventListener('mouseleave',()=>hideTooltip());
    col.addEventListener('click',()=>filterByBar(b));
    wrap.appendChild(col);
  });
}

function renderDailyUsage(bars){
  const noData=document.getElementById('duNoData');
  const barsEl=document.getElementById('duBars');
  const legend=document.getElementById('duLegend');
  
  if(!bars||bars.every(b=>b.val===0)){
    noData.style.display='flex';barsEl.style.display='none';legend.style.display='none';
    return;
  }
  noData.style.display='none';barsEl.style.display='flex';legend.style.display='flex';
  barsEl.innerHTML='';
  const max=Math.max(...bars.map(b=>b.val));
  bars.slice(-14).forEach(b=>{
    const col=document.createElement('div');
    col.className='du-bar-col';
    const h=b.val>0?Math.max((b.val/max)*100,4):4;
    col.innerHTML=`<div class="du-bar-inner" style="height:${h}px;background:${b.val>0?'linear-gradient(180deg,var(--accent),var(--accent2))':'rgba(255,255,255,.06)'}"></div><div class="du-label">${b.label}</div>`;
    barsEl.appendChild(col);
  });
}

function renderSessions(sessions){
  const body=document.getElementById('sessBody');
  const shown=document.getElementById('sessShown');
  const avg=document.getElementById('sessAvg');
  const errEl=document.getElementById('sessErrors');
  
  if(!sessions||sessions.length===0){
    body.innerHTML='<div class="sess-no-data">Sem sessões no período</div>';
    shown.textContent='0 mostradas';avg.textContent='0 avg';errEl.textContent='0 erros';
    return;
  }
  
  const filtered=filterStr?sessions.filter(s=>s.key.toLowerCase().includes(filterStr)):sessions;
  document.getElementById('filterCount').textContent=filtered.length+' sessões no período';
  shown.textContent=filtered.length+' mostradas';
  const avgTokens=Math.floor(filtered.reduce((a,b)=>a+b.tokens,0)/filtered.length);
  const totalErrors=filtered.reduce((a,b)=>a+b.errors,0);
  avg.textContent=fmtTokens(avgTokens)+' avg';
  errEl.textContent=totalErrors+' erros';
  
  const max=Math.max(...filtered.map(s=>s.tokens));
  body.innerHTML='';
  const wrap=document.createElement('div');wrap.style.width='100%';
  filtered.forEach(s=>{
    const pct=(s.tokens/max)*100;
    const row=document.createElement('div');row.className='sess-item';
    row.innerHTML=`
      <div style="flex:1;min-width:0">
        <div class="sess-item-key" title="${s.key}">${s.key}</div>
        <div class="sess-item-bar"><div class="sess-item-bar-fill" style="width:${pct}%"></div></div>
      </div>
      <div style="text-align:right;flex-shrink:0">
        <div style="font-family:'Press Start 2P',monospace;font-size:.34rem;color:rgba(255,255,255,.6);margin-bottom:3px">${fmtTokens(s.tokens)}</div>
        ${s.errors>0?`<div style="font-family:'VT323',monospace;font-size:.9rem;color:var(--red)">${s.errors} err</div>`:''}
      </div>`;
    wrap.appendChild(row);
  });
  body.appendChild(wrap);
}

/* ── FILTER ── */
function applyFilter(){
  filterStr=document.getElementById('filterInput').value.toLowerCase();
  if(currentData.length)renderSessions(currentData);
}

/* ── TOOLTIP ── */
function showTooltip(e,b,i){
  const tt=document.getElementById('chartTooltip');
  tt.style.display='block';
  tt.innerHTML=`${b.label}: ${fmtTokens(b.val)} ${metric}`;
  const rect=e.target.getBoundingClientRect();
  const areaRect=document.getElementById('chartArea').getBoundingClientRect();
  tt.style.left=(rect.left-areaRect.left)+'px';
  tt.style.top='6px';
}
function hideTooltip(){document.getElementById('chartTooltip').style.display='none'}

/* ── FILTER BY BAR ── */
function filterByBar(b){
  document.getElementById('filterInput').value='day:'+b.label;
  filterStr='day:'+b.label.toLowerCase();
}

/* ── SORT ── */
function sortSessions(by){
  if(!currentData.length)return;
  const sorted=[...currentData];
  if(by==='tokens')sorted.sort((a,b)=>b.tokens-a.tokens);
  else if(by==='errors')sorted.sort((a,b)=>b.errors-a.errors);
  else sorted.sort((a,b)=>a.key.localeCompare(b.key));
  renderSessions(sorted);
}

/* ── SESS TAB ── */
function sessTab(btn,tab){
  document.querySelectorAll('.sess-tab').forEach(t=>t.classList.remove('active'));
  btn.classList.add('active');
  if(tab==='recent'&&currentData.length){
    renderSessions([...currentData].slice(0,3));
  } else {
    renderSessions(currentData);
  }
}

/* ── PIN ── */
function togglePin(){
  pinned=!pinned;
  const btn=document.getElementById('pinBtn');
  btn.style.background=pinned?'linear-gradient(135deg,var(--accent),var(--accent2))':'';
  btn.style.borderColor=pinned?'var(--accent2)':'';
  btn.style.color=pinned?'#fff':'';
  btn.textContent=pinned?'Pinned':'Pin';
}

/* ── EXPORT MENU ── */
function showExportMenu(){
  alert('Export: CSV / JSON / PNG');
}

/* ── RENDER ALL ── */
function renderAll(){
  if(currentData.length)doRefresh();
}

/* ── HELPERS ── */
function fmtTokens(n){
  if(n>=1000000)return(n/1000000).toFixed(1)+'M';
  if(n>=1000)return(n/1000).toFixed(1)+'k';
  return String(n);
}

// spin keyframe
const st=document.createElement('style');
st.textContent='@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}';
document.head.appendChild(st);
</script>
<script src="vexus-ui.js"></script>
</body>
</html>
