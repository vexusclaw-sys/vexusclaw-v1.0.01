<?php $menuActive = 'overview'; ?>
<!DOCTYPE html>
<html lang="pt-BR" style="color-scheme:dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>VexusClaw — Gateway Dashboard</title>
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
a{text-decoration:none;color:inherit}
input,select,textarea,button{font-family:inherit}

body::before{content:'';position:fixed;inset:0;z-index:0;pointer-events:none;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect x='0' y='0' width='1' height='1' fill='%23ffffff' opacity='0.007'/%3E%3Crect x='2' y='2' width='1' height='1' fill='%23ffffff' opacity='0.007'/%3E%3C/svg%3E");
  background-size:4px 4px}

/* ══ TOPBAR ══ */
.topbar{position:fixed;top:0;left:0;right:0;z-index:300;height:var(--topbar-h);
  background:rgba(9,5,26,.97);border-bottom:2px solid var(--border);
  display:flex;align-items:center;padding:0 14px;gap:0}
.topbar::after{content:'';position:absolute;bottom:-4px;left:0;right:0;height:2px;
  background:repeating-linear-gradient(90deg,var(--accent) 0,var(--accent) 4px,transparent 4px,transparent 8px);opacity:.1}
.tb-hamburger{width:34px;height:34px;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:5px;cursor:pointer;border:none;background:none;border-radius:3px;transition:.2s;flex-shrink:0}
.tb-hamburger:hover{background:rgba(180,77,255,.12)}
.tb-hamburger span{display:block;width:18px;height:2px;background:rgba(255,255,255,.55);border-radius:1px;transition:.3s}
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
.tb-badge{display:flex;align-items:center;gap:5px;padding:5px 9px;background:var(--bg-surface);border:1px solid var(--border);border-radius:3px;font-family:'Press Start 2P',monospace;font-size:.38rem;text-shadow:var(--px-s);box-shadow:2px 2px 0 rgba(0,0,0,.4)}
.tb-dot{width:7px;height:7px;border-radius:2px;flex-shrink:0;box-shadow:0 0 5px currentColor}
.tb-dot.green{background:var(--green);color:var(--green)}
.tb-dot.yellow{background:var(--yellow);color:var(--yellow)}
.tb-lbl{color:rgba(255,255,255,.38)}
.tb-val{color:rgba(255,255,255,.8)}
.tb-icon-btn{width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:var(--bg-surface);border:1px solid var(--border);border-radius:3px;cursor:pointer;transition:.2s;box-shadow:2px 2px 0 rgba(0,0,0,.3)}
.tb-icon-btn:hover{border-color:var(--accent);background:rgba(180,77,255,.1)}
.tb-icon-btn svg{width:15px;height:15px;image-rendering:pixelated;opacity:.55}
.tb-icon-btn:hover svg{opacity:1}
.tb-avatar{width:32px;height:32px;background:linear-gradient(135deg,var(--accent),var(--accent2));border:2px solid var(--border);border-radius:3px;display:flex;align-items:center;justify-content:center;font-family:'Press Start 2P',monospace;font-size:.46rem;cursor:pointer;box-shadow:2px 2px 0 rgba(0,0,0,.4);flex-shrink:0;text-shadow:var(--px-s)}
/* hide some badges on small screens */
@media(max-width:600px){.tb-badge{display:none}.tb-icon-btn{display:none}}

/* ══ MOBILE OVERLAY ══ */
.sb-overlay{display:none;position:fixed;inset:0;z-index:150;background:rgba(0,0,0,.6);backdrop-filter:blur(2px)}
.sb-overlay.show{display:block}

/* ══ UPDATE BANNER ══ */
.update-banner{position:fixed;top:var(--topbar-h);left:0;right:0;z-index:200;
  padding:8px 20px;background:rgba(180,77,255,.08);border-bottom:2px solid rgba(180,77,255,.2);
  display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;
  font-family:'Press Start 2P',monospace;font-size:.38rem;text-shadow:var(--px-s)}
.banner-text{color:var(--accent-bright);text-shadow:var(--px-sa)}
.banner-text span{color:rgba(255,255,255,.4)}
.banner-btn{padding:5px 11px;background:linear-gradient(135deg,var(--accent),var(--accent2));border:none;border-radius:3px;font-family:'Press Start 2P',monospace;font-size:.36rem;color:#fff;text-shadow:var(--px-s);cursor:pointer;box-shadow:2px 2px 0 #3d0070;transition:.15s}
.banner-btn:hover{transform:translate(-1px,-1px);box-shadow:3px 3px 0 #3d0070}
.banner-x{cursor:pointer;opacity:.4;transition:.2s;font-size:1.2rem;margin-left:6px;line-height:1}
.banner-x:hover{opacity:1}

/* ══ SIDEBAR ══ */
.sidebar{position:fixed;top:var(--topbar-h);left:0;bottom:0;z-index:200;width:var(--sidebar-w);
  background:var(--bg-sidebar);border-right:2px solid var(--border);
  display:flex;flex-direction:column;overflow-y:auto;overflow-x:hidden;
  transition:transform .25s cubic-bezier(.4,0,.2,1)}
.sidebar::-webkit-scrollbar{width:3px}
.sidebar::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}
/* mobile: sidebar starts hidden */
@media(max-width:768px){
  .sidebar{transform:translateX(-100%)}
  .sidebar.open{transform:translateX(0)}
}
.sg-label{display:flex;align-items:center;justify-content:space-between;padding:9px 14px 6px;
  font-family:'Press Start 2P',monospace;font-size:.38rem;color:rgba(255,255,255,.22);text-shadow:var(--px-s);letter-spacing:1px}
.sg-minus{color:rgba(255,255,255,.2);cursor:pointer;font-size:.9rem;line-height:1}
.nav-item{display:flex;align-items:center;gap:9px;padding:10px 14px;cursor:pointer;transition:.15s;border-left:2px solid transparent}
.nav-item:hover{background:rgba(180,77,255,.07);border-left-color:rgba(180,77,255,.18)}
.nav-item.active{background:rgba(180,77,255,.13);border-left-color:var(--accent)}
.nav-item svg{width:15px;height:15px;image-rendering:pixelated;flex-shrink:0;opacity:.45}
.nav-item:hover svg,.nav-item.active svg{opacity:.9}
.nav-lbl{font-family:'Press Start 2P',monospace;font-size:.46rem;color:rgba(255,255,255,.45);text-shadow:var(--px-s)}
.nav-item.active .nav-lbl{color:var(--accent-bright);text-shadow:var(--px-sa)}
.nav-badge{margin-left:auto;padding:2px 6px;background:var(--accent);border-radius:2px;font-family:'Press Start 2P',monospace;font-size:.35rem;text-shadow:var(--px-s);box-shadow:1px 1px 0 #3d0070}
.px-div{height:2px;background:repeating-linear-gradient(90deg,var(--accent) 0,var(--accent) 4px,transparent 4px,transparent 8px);opacity:.1}
.sb-bottom{margin-top:auto;border-top:2px solid var(--border);padding:10px 14px;display:flex;align-items:center;gap:8px}
.sb-avatar{width:28px;height:28px;background:linear-gradient(135deg,var(--accent),var(--accent2));border-radius:3px;display:flex;align-items:center;justify-content:center;font-family:'Press Start 2P',monospace;font-size:.42rem;flex-shrink:0;text-shadow:var(--px-s)}
.sb-name{font-family:'Press Start 2P',monospace;font-size:.42rem;text-shadow:var(--px-s);display:block}
.sb-status{font-family:'VT323',monospace;font-size:1rem;color:var(--green);display:flex;align-items:center;gap:4px}
.sb-status::before{content:'';width:5px;height:5px;background:var(--green);border-radius:1px;box-shadow:0 0 4px var(--green)}

/* ══ MAIN ══ */
.main{position:fixed;top:calc(var(--topbar-h) + 38px);left:var(--sidebar-w);right:0;bottom:0;
  display:flex;flex-direction:column;overflow:hidden;transition:left .25s cubic-bezier(.4,0,.2,1)}
.main.no-banner{top:var(--topbar-h)}
@media(max-width:768px){.main{left:0}}

/* ══ PAGES ══ */
.page{display:none;flex:1;overflow-y:auto;overflow-x:hidden;height:100%}
.page.active{display:block;animation:pgIn .25s ease-out both}
@keyframes pgIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.page::-webkit-scrollbar{width:5px}
.page::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}
.page-hdr{padding:20px 26px 14px;border-bottom:2px solid var(--border);background:rgba(9,5,26,.5)}
.page-title{font-family:'Press Start 2P',monospace;font-size:.9rem;text-shadow:var(--px-s);margin-bottom:5px}
.page-desc{font-family:'VT323',monospace;font-size:1.2rem;color:rgba(255,255,255,.38)}
.page-body{padding:20px 26px;display:flex;flex-direction:column;gap:16px}
@media(max-width:600px){.page-hdr{padding:14px 16px 10px}.page-body{padding:14px 16px}}

/* ══ CARD ══ */
.card{background:var(--bg-card);border:2px solid var(--border);border-radius:6px;
  box-shadow:4px 4px 0 rgba(0,0,0,.5);overflow:hidden;position:relative}
.card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;
  background:repeating-linear-gradient(90deg,var(--accent) 0,var(--accent) 4px,transparent 4px,transparent 8px);opacity:.25}
.card-hdr{padding:14px 18px 11px;border-bottom:2px solid var(--border-light)}
.card-title{font-family:'Press Start 2P',monospace;font-size:.62rem;text-shadow:var(--px-s);margin-bottom:4px}
.card-desc{font-family:'VT323',monospace;font-size:1.1rem;color:rgba(255,255,255,.35)}
.card-body{padding:16px 18px}

/* ══ FORMS ══ */
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
@media(max-width:600px){.form-grid{grid-template-columns:1fr}}
.field-wrap{display:flex;flex-direction:column;gap:5px}
.field-label{font-family:'Press Start 2P',monospace;font-size:.44rem;color:rgba(255,255,255,.55);text-shadow:var(--px-s)}
.field-input{padding:10px 12px;background:var(--bg-input);border:2px solid var(--border);
  box-shadow:inset 2px 2px 0 rgba(0,0,0,.4),2px 2px 0 rgba(0,0,0,.3);border-radius:4px;
  font-family:'VT323',monospace;font-size:1.25rem;color:#fff;outline:none;transition:.2s;width:100%}
.field-input:focus{border-color:var(--accent);box-shadow:inset 2px 2px 0 rgba(0,0,0,.4),2px 2px 0 rgba(100,30,200,.25),0 0 0 3px rgba(180,77,255,.06)}
.field-input::placeholder{color:rgba(255,255,255,.2)}
.field-select{appearance:none;-webkit-appearance:none;cursor:pointer;
  background:var(--bg-input) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10'%3E%3Crect x='4' y='6' width='2' height='2' fill='%23666'/%3E%3Crect x='2' y='4' width='2' height='2' fill='%23666'/%3E%3Crect x='6' y='4' width='2' height='2' fill='%23666'/%3E%3C/svg%3E") no-repeat right 10px center}

/* ══ BUTTONS ══ */
.btn-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:4px}
.btn{padding:9px 15px;border:2px solid var(--border);border-radius:4px;font-family:'Press Start 2P',monospace;font-size:.46rem;text-shadow:var(--px-s);cursor:pointer;transition:.2s;box-shadow:2px 2px 0 rgba(0,0,0,.4);background:var(--bg-surface)}
.btn:hover{border-color:var(--accent);background:rgba(180,77,255,.1);transform:translate(-1px,-1px);box-shadow:3px 3px 0 rgba(0,0,0,.4)}
.btn:active{transform:translate(1px,1px);box-shadow:1px 1px 0}
.btn-primary{background:linear-gradient(135deg,var(--accent),var(--accent2));border-color:var(--accent2);box-shadow:3px 3px 0 #3d0070}
.btn-primary:hover{box-shadow:4px 4px 0 #3d0070}
.btn-danger{background:linear-gradient(135deg,#cc2200,#aa1800);border-color:#aa1800;box-shadow:3px 3px 0 #550800}
.btn-hint{font-family:'VT323',monospace;font-size:1.1rem;color:rgba(255,255,255,.3)}

/* ══ SNAPSHOT ══ */
.snapshot-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:10px}
@media(max-width:500px){.snapshot-grid{grid-template-columns:1fr 1fr}}
.snap-cell{background:var(--bg-surface);border:2px solid var(--border);border-radius:4px;padding:11px 13px;box-shadow:2px 2px 0 rgba(0,0,0,.4)}
.snap-lbl{font-family:'Press Start 2P',monospace;font-size:.34rem;color:rgba(255,255,255,.3);text-shadow:var(--px-s);display:block;margin-bottom:6px;letter-spacing:.5px}
.snap-val{font-family:'Press Start 2P',monospace;font-size:.9rem;text-shadow:var(--px-s);display:block}
.snap-val.ok{color:var(--green);text-shadow:0 0 10px rgba(68,255,170,.3)}
.snap-val.big{font-size:1.6rem}
.snap-cell-wide{grid-column:1/-1;background:var(--bg-surface);border:2px solid var(--border);border-radius:4px;padding:11px 13px;box-shadow:2px 2px 0 rgba(0,0,0,.4)}
.snap-just{font-family:'Press Start 2P',monospace;font-size:.9rem;text-shadow:var(--px-s);color:#fff}
.snap-tip{font-family:'VT323',monospace;font-size:1.1rem;color:rgba(255,255,255,.38);line-height:1.5}

/* ══ STATS ══ */
.stats-row{display:grid;grid-template-columns:1fr;gap:14px}
.stat-card{background:var(--bg-card);border:2px solid var(--border);border-radius:6px;padding:15px 17px;box-shadow:3px 3px 0 rgba(0,0,0,.4);position:relative;overflow:hidden}
.stat-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:repeating-linear-gradient(90deg,var(--accent) 0,var(--accent) 4px,transparent 4px,transparent 8px);opacity:.2}
.stat-lbl{font-family:'Press Start 2P',monospace;font-size:.38rem;color:rgba(255,255,255,.35);display:block;margin-bottom:9px;letter-spacing:.5px}
.stat-val{font-family:'Press Start 2P',monospace;font-size:1.8rem;text-shadow:var(--px-s);display:block;margin-bottom:6px}
.stat-desc{font-family:'VT323',monospace;font-size:1.1rem;color:rgba(255,255,255,.3);line-height:1.4}

/* ══ NOTES ══ */
.notes-grid{display:grid;grid-template-columns:1fr;gap:14px}
.note-title{font-family:'Press Start 2P',monospace;font-size:.48rem;margin-bottom:6px;color:rgba(255,255,255,.8)}
.note-desc{font-family:'VT323',monospace;font-size:1.1rem;color:rgba(255,255,255,.35);line-height:1.5}

/* ══ STATUS ROWS ══ */
.status-rows{display:flex;flex-direction:column}
.status-row{display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid rgba(37,26,85,.5)}
.status-row:last-child{border-bottom:none}
.sr-label{font-family:'VT323',monospace;font-size:1.25rem;color:rgba(255,255,255,.5)}
.sr-val{font-family:'Press Start 2P',monospace;font-size:.46rem}
.sr-val.yes{color:var(--green)}
.sr-val.ago{color:rgba(255,255,255,.7)}

/* ══ ACCORDION ══ */
.accordion{border:2px solid var(--border);border-radius:4px;overflow:hidden;margin-bottom:8px;box-shadow:2px 2px 0 rgba(0,0,0,.3)}
.acc-header{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;cursor:pointer;background:var(--bg-surface);transition:.2s;user-select:none;gap:8px}
.acc-header:hover{background:rgba(180,77,255,.07)}
.acc-title{font-family:'Press Start 2P',monospace;font-size:.5rem;text-shadow:var(--px-s);color:rgba(255,255,255,.8)}
.acc-right{display:flex;align-items:center;gap:8px;flex-shrink:0}
.acc-count{font-family:'VT323',monospace;font-size:1.1rem;color:rgba(255,255,255,.3)}
.acc-plus{padding:3px 8px;background:rgba(180,77,255,.15);border:1px solid rgba(180,77,255,.3);border-radius:3px;font-family:'Press Start 2P',monospace;font-size:.36rem;color:var(--accent-bright);cursor:pointer;transition:.2s;display:flex;align-items:center;gap:4px}
.acc-plus:hover{background:rgba(180,77,255,.25)}
.acc-chevron{width:12px;height:12px;image-rendering:pixelated;opacity:.4;transition:.3s;flex-shrink:0}
.acc-chevron.open{transform:rotate(180deg)}
.acc-body{background:var(--bg-card);padding:12px 14px;border-top:2px solid var(--border-light);display:none}
.acc-body.open{display:block;animation:pgIn .2s ease-out}
.acc-empty{font-family:'VT323',monospace;font-size:1.1rem;color:rgba(255,255,255,.25);text-align:center;padding:14px 0}

/* ══ TOGGLE ══ */
.toggle-row{display:flex;align-items:flex-start;justify-content:space-between;padding:10px 13px;background:var(--bg-surface);border:2px solid var(--border);border-radius:4px;margin-bottom:8px;box-shadow:2px 2px 0 rgba(0,0,0,.3);gap:10px}
.toggle-name{font-family:'Press Start 2P',monospace;font-size:.48rem;text-shadow:var(--px-s);margin-bottom:4px}
.toggle-desc{font-family:'VT323',monospace;font-size:1.1rem;color:rgba(255,255,255,.35);line-height:1.4}
.toggle-tags{display:flex;gap:5px;margin-top:5px;flex-wrap:wrap}
.tag{padding:2px 6px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:2px;font-family:'VT323',monospace;font-size:.95rem;color:rgba(255,255,255,.35)}
.toggle-switch{flex-shrink:0;margin-top:2px;width:38px;height:22px;background:rgba(255,255,255,.08);border:2px solid rgba(255,255,255,.15);border-radius:11px;cursor:pointer;position:relative;transition:.25s}
.toggle-switch.on{background:rgba(68,255,170,.25);border-color:var(--green);box-shadow:0 0 8px rgba(68,255,170,.2)}
.toggle-switch::after{content:'';position:absolute;top:2px;left:2px;width:14px;height:14px;background:rgba(255,255,255,.3);border-radius:3px;transition:.25s}
.toggle-switch.on::after{left:calc(100% - 16px);background:var(--green)}

/* ══ TAB GROUP ══ */
.tab-group{display:flex;background:var(--bg-input);border:2px solid var(--border);border-radius:4px;overflow:hidden;box-shadow:2px 2px 0 rgba(0,0,0,.3);flex-wrap:wrap}
.tab-opt{flex:1;min-width:0;padding:9px 10px;text-align:center;font-family:'Press Start 2P',monospace;font-size:.42rem;text-shadow:var(--px-s);color:rgba(255,255,255,.35);cursor:pointer;transition:.2s;border-right:1px solid var(--border)}
.tab-opt:last-child{border-right:none}
.tab-opt:hover{background:rgba(180,77,255,.06);color:rgba(255,255,255,.65)}
.tab-opt.active{background:linear-gradient(135deg,var(--accent),var(--accent2));color:#fff}

/* ══ STEPPER ══ */
.stepper{display:flex;align-items:stretch;background:var(--bg-input);border:2px solid var(--border);border-radius:4px;overflow:hidden;box-shadow:2px 2px 0 rgba(0,0,0,.3);width:100%}
.stepper-btn{width:38px;flex-shrink:0;display:flex;align-items:center;justify-content:center;background:var(--bg-surface);cursor:pointer;font-size:1.4rem;color:rgba(255,255,255,.5);transition:.2s;border:none;border-right:1px solid var(--border)}
.stepper-btn:last-child{border-right:none;border-left:1px solid var(--border)}
.stepper-btn:hover{background:rgba(180,77,255,.12);color:#fff}
.stepper-val{flex:1;text-align:center;padding:9px 8px;font-family:'Press Start 2P',monospace;font-size:.62rem;text-shadow:var(--px-s);border:none;background:transparent;outline:none;color:#fff}

/* ══ ITEM ROW ══ */
.item-row{display:flex;align-items:center;justify-content:space-between;padding:9px 11px;background:var(--bg-surface);border:1px solid var(--border);border-radius:3px;margin-bottom:6px;gap:8px}
.item-num{font-family:'Press Start 2P',monospace;font-size:.44rem;color:rgba(255,255,255,.3);flex-shrink:0}
.item-del{width:22px;height:22px;display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:.35;transition:.2s;background:none;border:none;flex-shrink:0}
.item-del:hover{opacity:.9;background:rgba(255,68,68,.1);border-radius:3px}

/* ══ SECTION LABEL ══ */
.section-label{font-family:'Press Start 2P',monospace;font-size:.46rem;color:rgba(255,255,255,.5);text-shadow:var(--px-s);margin-bottom:7px;margin-top:12px;display:flex;align-items:center;gap:8px}
.section-label::after{content:'';flex:1;height:1px;background:repeating-linear-gradient(90deg,var(--border) 0,var(--border) 4px,transparent 4px,transparent 8px)}
.inline-info{display:flex;align-items:center;justify-content:space-between;padding:8px 0}
.inline-key{font-family:'VT323',monospace;font-size:1.2rem;color:rgba(255,255,255,.4)}
.inline-val{font-family:'Press Start 2P',monospace;font-size:.46rem;color:rgba(255,255,255,.65)}

/* ══ CANAL WRAP ══ */
.canal-wrap{max-width:620px}

/* ══ CHAT PAGE ══ */
.chat-page{display:flex;flex-direction:column;height:100%;overflow:hidden}
.chat-hdr{padding:12px 22px 10px;border-bottom:2px solid var(--border);background:rgba(9,5,26,.6);flex-shrink:0;display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}
.chat-title-wrap{}
.chat-page-title{font-family:'Press Start 2P',monospace;font-size:.82rem;text-shadow:var(--px-s);margin-bottom:3px}
.chat-page-desc{font-family:'VT323',monospace;font-size:1.15rem;color:rgba(255,255,255,.38)}
.chat-actions{display:flex;align-items:center;gap:7px;flex-wrap:wrap}
.session-sel{display:flex;align-items:center;background:var(--bg-surface);border:2px solid var(--border);border-radius:4px;box-shadow:2px 2px 0 rgba(0,0,0,.4);overflow:hidden}
.sess-val{padding:7px 11px;font-family:'Press Start 2P',monospace;font-size:.44rem;text-shadow:var(--px-s);cursor:pointer;white-space:nowrap}
.sess-arr{padding:7px 9px;border-left:2px solid var(--border);cursor:pointer;display:flex;align-items:center;background:rgba(180,77,255,.04);transition:.2s}
.sess-arr:hover{background:rgba(180,77,255,.15)}
.hdr-sep{width:2px;height:26px;background:var(--border);flex-shrink:0}
.hdr-btn{width:34px;height:34px;display:flex;align-items:center;justify-content:center;background:var(--bg-surface);border:2px solid var(--border);border-radius:3px;cursor:pointer;transition:.2s;box-shadow:2px 2px 0 rgba(0,0,0,.3)}
.hdr-btn:hover{border-color:var(--accent);background:rgba(180,77,255,.1)}
.hdr-btn.danger{border-color:rgba(255,68,68,.3);background:rgba(255,68,68,.06)}
.hdr-btn.danger:hover{border-color:var(--red)}
.hdr-btn.warn{border-color:rgba(255,189,46,.3);background:rgba(255,189,46,.06)}
.hdr-btn.warn:hover{border-color:var(--yellow)}
.hdr-btn svg{width:16px;height:16px;image-rendering:pixelated;opacity:.6}
.hdr-btn:hover svg,.hdr-btn.danger:hover svg,.hdr-btn.warn:hover svg{opacity:1}

/* chat area */
.chat-area{flex:1;overflow-y:auto;padding:18px 22px;display:flex;flex-direction:column;gap:14px;min-height:0}
.chat-area::-webkit-scrollbar{width:4px}
.chat-area::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}

/* date divider */
.date-div{display:flex;align-items:center;gap:8px;padding:2px 0}
.date-div::before,.date-div::after{content:'';flex:1;height:1px;background:repeating-linear-gradient(90deg,var(--border) 0,var(--border) 4px,transparent 4px,transparent 8px)}
.date-div span{font-family:'Press Start 2P',monospace;font-size:.36rem;color:rgba(255,255,255,.2);flex-shrink:0}

/* messages */
.msg-row-right{display:flex;align-items:flex-end;gap:8px;justify-content:flex-end}
.msg-row-left{display:flex;align-items:flex-start;gap:8px}
.msg-r-wrap{}
.msg-meta-r{display:flex;justify-content:flex-end;align-items:center;gap:8px;margin-bottom:4px}
.msg-meta-txt{font-family:'VT323',monospace;font-size:1rem;color:rgba(255,255,255,.28)}
.msg-r{max-width:clamp(200px,60vw,500px);background:rgba(180,77,255,.1);border:2px solid rgba(180,77,255,.2);border-radius:6px 2px 6px 6px;padding:10px 13px;box-shadow:2px 2px 0 rgba(0,0,0,.4)}
.msg-r p{font-family:'VT323',monospace;font-size:1.25rem;color:rgba(255,255,255,.82);line-height:1.5}
.msg-av-r{width:28px;height:28px;background:linear-gradient(135deg,var(--accent),var(--accent2));border-radius:3px;display:flex;align-items:center;justify-content:center;font-family:'Press Start 2P',monospace;font-size:.44rem;flex-shrink:0;box-shadow:2px 2px 0 rgba(0,0,0,.4)}
.msg-av-l{width:30px;height:30px;flex-shrink:0;border-radius:3px;border:2px solid var(--border);background:var(--bg-surface);display:flex;align-items:center;justify-content:center;overflow:hidden;box-shadow:2px 2px 0 rgba(0,0,0,.4)}
.msg-av-l img{width:26px;height:26px;image-rendering:pixelated}
.msg-bot-wrap{max-width:clamp(200px,60vw,500px)}
.msg-bot-name{font-family:'Press Start 2P',monospace;font-size:.44rem;color:var(--accent-bright);text-shadow:var(--px-sa);margin-bottom:4px;display:flex;align-items:center;gap:8px}
.msg-bot-time{font-family:'VT323',monospace;font-size:1rem;color:rgba(255,255,255,.28);font-weight:normal}
.msg-l{background:var(--bg-surface);border:2px solid var(--border);border-radius:2px 6px 6px 6px;padding:10px 13px;box-shadow:2px 2px 0 rgba(0,0,0,.4);font-family:'VT323',monospace;font-size:1.25rem;color:rgba(255,255,255,.85);line-height:1.5}

/* typing */
.typing-ind{display:flex;align-items:center;gap:5px;padding:10px 13px;background:var(--bg-surface);border:2px solid var(--border);border-radius:2px 6px 6px 6px;box-shadow:2px 2px 0 rgba(0,0,0,.4);width:fit-content}
.t-dot{width:8px;height:8px;background:var(--accent);border-radius:2px;animation:tBounce 1.2s ease-in-out infinite}
.t-dot:nth-child(2){animation-delay:.2s}.t-dot:nth-child(3){animation-delay:.4s}
@keyframes tBounce{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-6px);opacity:1}}

/* input */
.chat-input-area{border-top:2px solid var(--border);padding:10px 22px 14px;background:rgba(9,5,26,.85);flex-shrink:0;display:flex;align-items:flex-end;gap:10px}
.chat-input{flex:1;min-height:50px;max-height:140px;padding:12px 14px;background:var(--bg-surface);border:2px solid var(--border);box-shadow:inset 2px 2px 0 rgba(0,0,0,.35),2px 2px 0 rgba(0,0,0,.3);border-radius:4px;font-family:'VT323',monospace;font-size:1.3rem;color:#fff;outline:none;resize:none;line-height:1.5;transition:.2s}
.chat-input:focus{border-color:var(--accent);box-shadow:inset 2px 2px 0 rgba(0,0,0,.35),2px 2px 0 rgba(100,30,200,.2),0 0 0 3px rgba(180,77,255,.05)}
.chat-input::placeholder{color:rgba(255,255,255,.2)}
.chat-btns{display:flex;flex-direction:column;gap:7px}
.btn-new-sess{padding:8px 13px;background:var(--bg-surface);border:2px solid var(--border);border-radius:4px;font-family:'Press Start 2P',monospace;font-size:.4rem;color:rgba(255,255,255,.5);cursor:pointer;transition:.2s;box-shadow:2px 2px 0 rgba(0,0,0,.3)}
.btn-new-sess:hover{border-color:var(--accent);color:#fff;background:rgba(180,77,255,.08)}
.btn-send{padding:10px 15px;background:linear-gradient(135deg,var(--accent),var(--accent2));border:none;border-radius:4px;font-family:'Press Start 2P',monospace;font-size:.42rem;color:#fff;text-shadow:var(--px-s);cursor:pointer;transition:.2s;box-shadow:3px 3px 0 #3d0070;display:flex;align-items:center;gap:7px;white-space:nowrap}
.btn-send:hover{transform:translate(-1px,-1px);box-shadow:4px 4px 0 #3d0070}
.btn-send:active{transform:translate(1px,1px);box-shadow:1px 1px 0 #3d0070}
.btn-send svg{width:14px;height:14px;image-rendering:pixelated}

/* ══ EMPTY PAGE ══ */
.empty-pg{padding:60px 26px;text-align:center}
.empty-pg-t{font-family:'Press Start 2P',monospace;font-size:.7rem;color:rgba(255,255,255,.14);margin-bottom:14px}
.empty-pg-d{font-family:'VT323',monospace;font-size:1.25rem;color:rgba(255,255,255,.22)}

@keyframes msgIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
</style>
</head>
<body>

<!-- ══ OVERLAY (mobile) ══ -->
<!-- ══ TOPBAR ══ -->
<?php include __DIR__ . '/topbar.php'; ?>

<!-- ══ UPDATE BANNER ══ -->
<!-- ══ SIDEBAR ══ -->
<?php include __DIR__ . '/sidebar.php'; ?>

<!-- ══ MAIN ══ -->
<main class="main" id="mainArea">

  <!-- ════ CHAT PAGE ════ -->
  <div class="page" id="chat" style="display:none;flex-direction:column;height:100%">
    <div class="chat-page" style="height:100%">

      <!-- Chat Header -->
      <div class="chat-hdr">
        <div class="chat-title-wrap">
          <div class="chat-page-title">Chat</div>
          <div class="chat-page-desc">Sessão direta com o gateway.</div>
        </div>
        <div class="chat-actions">
          <div class="session-sel">
            <span class="sess-val" id="sessVal">vexusclaw-tui</span>
            <div class="sess-arr" onclick="cycleSess()">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><rect x="5" y="7" width="2" height="2" fill="currentColor" opacity=".5"/><rect x="3" y="5" width="2" height="2" fill="currentColor" opacity=".5"/><rect x="7" y="5" width="2" height="2" fill="currentColor" opacity=".5"/><rect x="1" y="3" width="2" height="2" fill="currentColor" opacity=".5"/><rect x="9" y="3" width="2" height="2" fill="currentColor" opacity=".5"/></svg>
            </div>
          </div>
          <div class="hdr-sep"></div>
          <div class="hdr-btn" title="Refresh" onclick="chatAddBot('Gateway recarregado! ✓')"><svg viewBox="0 0 16 16" fill="none"><rect x="4" y="2" width="8" height="2" fill="currentColor" opacity=".6"/><rect x="2" y="4" width="2" height="8" fill="currentColor" opacity=".5"/><rect x="12" y="4" width="2" height="8" fill="currentColor" opacity=".5"/><rect x="4" y="12" width="8" height="2" fill="currentColor" opacity=".5"/></svg></div>
          <div class="hdr-btn danger" title="Stop" onclick="chatAddBot('[SISTEMA] Agente pausado.')"><svg viewBox="0 0 16 16" fill="none"><rect x="3" y="3" width="10" height="10" fill="var(--red)" opacity=".3"/><rect x="3" y="3" width="10" height="2" fill="var(--red)" opacity=".6"/><rect x="3" y="11" width="10" height="2" fill="var(--red)" opacity=".5"/><rect x="3" y="5" width="2" height="6" fill="var(--red)" opacity=".5"/><rect x="11" y="5" width="2" height="6" fill="var(--red)" opacity=".5"/></svg></div>
          <div class="hdr-btn warn" title="Timeout"><svg viewBox="0 0 16 16" fill="none"><rect x="7" y="2" width="2" height="6" fill="var(--yellow)" opacity=".8"/><rect x="7" y="7" width="4" height="2" fill="var(--yellow)" opacity=".6"/><rect x="4" y="1" width="8" height="12" fill="var(--yellow)" opacity=".08"/><rect x="4" y="1" width="8" height="2" fill="var(--yellow)" opacity=".35"/></svg></div>
        </div>
      </div>

      <!-- Messages -->
      <div class="chat-area" id="chatArea">
        <div class="date-div"><span>Qui 12 Mar 2026 · 22:51</span></div>

        <!-- user -->
        <div class="msg-row-right" style="animation:msgIn .3s ease-out both">
          <div class="msg-r-wrap">
            <div class="msg-meta-r">
              <span class="msg-meta-txt">vexusclaw-tui (gateway-client)</span>
              <span class="msg-meta-txt">22:51</span>
            </div>
            <div class="msg-r"><p>System: [2026-03-12 22:51] WhatsApp gateway connected.</p><p>oi</p></div>
          </div>
          <div class="msg-av-r">U</div>
        </div>

        <!-- bot -->
        <div class="msg-row-left" style="animation:msgIn .3s ease-out .08s both">
          <div class="msg-av-l"><img src="https://community.aseprite.org/uploads/default/original/2X/0/0eff0e4064297cbbe7383108c2f7322c758a5e1f.gif" alt="" draggable="false"></div>
          <div class="msg-bot-wrap">
            <div class="msg-bot-name">VexusClaw <span class="msg-bot-time">22:51</span></div>
            <div class="msg-l">Oi 👋</div>
          </div>
        </div>

        <!-- user 2 -->
        <div class="msg-row-right" style="animation:msgIn .3s ease-out .14s both">
          <div class="msg-r-wrap">
            <div class="msg-meta-r">
              <span class="msg-meta-txt">vexusclaw-tui (gateway-client)</span>
              <span class="msg-meta-txt">22:52</span>
            </div>
            <div class="msg-r"><p>Tudo certo com o gateway hoje?</p></div>
          </div>
          <div class="msg-av-r">U</div>
        </div>

        <!-- bot 2 -->
        <div class="msg-row-left" style="animation:msgIn .3s ease-out .2s both">
          <div class="msg-av-l"><img src="https://community.aseprite.org/uploads/default/original/2X/0/0eff0e4064297cbbe7383108c2f7322c758a5e1f.gif" alt="" draggable="false"></div>
          <div class="msg-bot-wrap">
            <div class="msg-bot-name">VexusClaw <span class="msg-bot-time">22:52</span></div>
            <div class="msg-l">Tudo operacional! ✅ 3 instâncias ativas, 42 sessões, WhatsApp conectado.</div>
          </div>
        </div>

        <!-- typing (hidden) -->
        <div class="msg-row-left" id="typingRow" style="display:none">
          <div class="msg-av-l"><img src="https://community.aseprite.org/uploads/default/original/2X/0/0eff0e4064297cbbe7383108c2f7322c758a5e1f.gif" alt="" draggable="false"></div>
          <div>
            <div class="msg-bot-name">VexusClaw</div>
            <div class="typing-ind"><div class="t-dot"></div><div class="t-dot"></div><div class="t-dot"></div></div>
          </div>
        </div>
      </div>

      <!-- Input -->
      <div class="chat-input-area">
        <textarea class="chat-input" id="chatInput" rows="1" placeholder="Mensagem (↵ enviar, Shift+↵ nova linha)"></textarea>
        <div class="chat-btns">
          <button class="btn-new-sess" onclick="newSession()">Nova sessão</button>
          <button class="btn-send" onclick="sendMsg()">
            Enviar
            <svg viewBox="0 0 14 14" fill="none"><rect x="1" y="6" width="9" height="2" fill="currentColor"/><rect x="8" y="4" width="2" height="2" fill="currentColor"/><rect x="8" y="8" width="2" height="2" fill="currentColor"/><rect x="10" y="2" width="2" height="2" fill="currentColor"/><rect x="10" y="10" width="2" height="2" fill="currentColor"/><rect x="12" y="0" width="2" height="2" fill="currentColor"/><rect x="12" y="12" width="2" height="2" fill="currentColor"/></svg>
          </button>
        </div>
      </div>

    </div>
  </div><!-- /chat -->

  <!-- ════ VISÃO GERAL ════ -->
  <div class="page active" id="visao">
    <div class="page-hdr">
      <div class="page-title">Visão Geral</div>
      <div class="page-desc">Status do gateway, pontos de entrada e leitura rápida de saúde.</div>
    </div>
    <div class="page-body">
      <div style="display:grid;grid-template-columns:1fr;gap:18px;align-items:start">
        <!-- Gateway Access -->
        <div class="card">
          <div class="card-hdr">
            <div class="card-title">Acesso ao Gateway</div>
            <div class="card-desc">Onde o dashboard se conecta e como se autentica.</div>
          </div>
          <div class="card-body">
            <div class="form-grid" style="margin-bottom:14px">
              <div class="field-wrap"><label class="field-label">URL WebSocket</label><input class="field-input" id="ovGatewayUrl" type="text" value="ws://localhost:18789"></div>
              <div class="field-wrap"><label class="field-label">Token do Gateway</label><input class="field-input" id="ovGatewayToken" type="text" value="d3af1ea33fc835…"></div>
              <div class="field-wrap"><label class="field-label">Senha</label><input class="field-input" id="ovGatewayPassword" type="password" placeholder="system or shared password"></div>
              <div class="field-wrap"><label class="field-label">Chave de Sessão</label><input class="field-input" id="ovSessionKey" type="text" value="agent:main:main"></div>
            </div>
            <div class="field-wrap" style="margin-bottom:14px">
              <label class="field-label">Idioma</label>
              <select class="field-input field-select"><option>Português</option><option selected>English</option><option>Español</option></select>
            </div>
            <div class="btn-row">
              <button class="btn btn-primary" id="ovConnectBtn">Conectar</button>
              <button class="btn" id="ovRefreshBtn">Atualizar</button>
              <span class="btn-hint" id="ovConnectHint">Clique em Conectar para aplicar.</span>
            </div>
          </div>
        </div>
        <!-- Snapshot -->
        <div class="card">
          <div class="card-hdr"><div class="card-title">Snapshot</div><div class="card-desc">Informações do último handshake.</div></div>
          <div class="card-body">
            <div class="snapshot-grid">
              <div class="snap-cell"><span class="snap-lbl">STATUS</span><span class="snap-val ok" id="ovSystemStatus">OK</span></div>
              <div class="snap-cell"><span class="snap-lbl">ATIVIDADE</span><span class="snap-val big" id="ovLastActivity">5m</span></div>
              <div class="snap-cell"><span class="snap-lbl">TICK</span><span class="snap-val" id="ovTick" style="color:rgba(255,255,255,.5)">n/a</span></div>
              <div class="snap-cell" style="grid-column:1/-1"><span class="snap-lbl">ÚLTIMA ATUALIZAÇÃO</span><span class="snap-just" id="ovLastUpdated">just now</span></div>
              <div class="snap-cell-wide"><p class="snap-tip" id="ovSnapshotTip">Use Canais para vincular WhatsApp, Telegram, Discord ou iMessage.</p></div>
            </div>
          </div>
        </div>
      </div>
      <!-- Stats -->
      <div class="stats-row">
        <div class="stat-card"><span class="stat-lbl">INSTÂNCIAS</span><span class="stat-val" id="ovInstancesCount">3</span><span class="stat-desc" id="ovInstancesDesc">Beacons nos últimos 5 min.</span></div>
        <div class="stat-card"><span class="stat-lbl">SESSÕES</span><span class="stat-val" id="ovSessionsCount">42</span><span class="stat-desc" id="ovSessionsDesc">Chaves rastreadas pelo gateway.</span></div>
        <div class="stat-card"><span class="stat-lbl">CRON</span><span class="stat-val" id="ovCronStatus" style="color:var(--green);text-shadow:0 0 12px rgba(68,255,170,.3)">Ativado</span><span class="stat-desc" id="ovCronDesc">Próximo despertar: n/a</span></div>
      </div>
      <!-- Notes -->
      <div class="card">
        <div class="card-hdr"><div class="card-title">Notas</div><div class="card-desc">Lembretes rápidos.</div></div>
        <div class="card-body">
          <div class="notes-grid">
            <div><div class="note-title">Tailscale serve</div><div class="note-desc">Prefira o modo serve para manter o gateway em loopback com autenticação tailnet.</div></div>
            <div><div class="note-title">Higiene de sessão</div><div class="note-desc">Use /new ou sessions.patch para redefinir o contexto.</div></div>
            <div><div class="note-title">Lembretes de Cron</div><div class="note-desc">Use sessões isoladas para execuções recorrentes.</div></div>
          </div>
        </div>
      </div>
    </div>
  </div><!-- /visao -->

  <!-- ════ CANAIS ════ -->
  <div class="page" id="canais">
    <div class="page-hdr"><div class="page-title">Canais</div><div class="page-desc">Gerenciar canais e configurações.</div></div>
    <div class="page-body">
      <div class="canal-wrap">
        <!-- WhatsApp card -->
        <div class="card" style="margin-bottom:0">
          <div class="card-hdr">
            <div style="display:flex;align-items:center;gap:10px">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="1" width="18" height="22" rx="3" fill="#25D366" opacity=".15"/><rect x="3" y="1" width="18" height="2" fill="#25D366" opacity=".5"/><rect x="3" y="21" width="18" height="2" fill="#25D366" opacity=".4"/><rect x="3" y="3" width="2" height="18" fill="#25D366" opacity=".4"/><rect x="19" y="3" width="2" height="18" fill="#25D366" opacity=".4"/><rect x="8" y="6" width="8" height="8" rx="4" fill="#25D366" opacity=".35"/><rect x="6" y="14" width="12" height="2" fill="#25D366" opacity=".3"/><rect x="7" y="16" width="10" height="2" fill="#25D366" opacity=".2"/></svg>
              <div><div class="card-title" style="margin-bottom:2px">WhatsApp</div><div class="card-desc">Link WhatsApp Web e monitorar conexão.</div></div>
            </div>
          </div>
          <div class="card-body">
            <div class="status-rows" style="margin-bottom:14px">
              <div class="status-row"><span class="sr-label">Configured</span><span class="sr-val yes">Yes</span></div>
              <div class="status-row"><span class="sr-label">Linked</span><span class="sr-val yes">Yes</span></div>
              <div class="status-row"><span class="sr-label">Running</span><span class="sr-val yes">Yes</span></div>
              <div class="status-row"><span class="sr-label">Connected</span><span class="sr-val yes">Yes</span></div>
              <div class="status-row"><span class="sr-label">Last connect</span><span class="sr-val ago">9m ago</span></div>
              <div class="status-row"><span class="sr-label">Last message</span><span class="sr-val ago">7m ago</span></div>
              <div class="status-row"><span class="sr-label">Auth age</span><span class="sr-val ago">8m</span></div>
            </div>
            <div class="btn-row">
              <button class="btn btn-primary" style="font-size:.42rem;padding:8px 12px">Show QR</button>
              <button class="btn" style="font-size:.42rem;padding:8px 12px">Relink</button>
              <button class="btn" style="font-size:.42rem;padding:8px 12px">Wait for scan</button>
              <button class="btn btn-danger" style="font-size:.42rem;padding:8px 12px">Logout</button>
              <button class="btn" style="font-size:.42rem;padding:8px 12px">Refresh</button>
            </div>
          </div>
        </div>

        <!-- Accordions -->
        <div class="accordion"><div class="acc-header" onclick="toggleAcc(this)"><span class="acc-title">Accounts</span><div class="acc-right"><button class="acc-plus" onclick="addEntry('acc-accounts','entry');event.stopPropagation()"><svg width="8" height="8" viewBox="0 0 8 8" fill="none"><rect x="3" y="1" width="2" height="6" fill="currentColor"/><rect x="1" y="3" width="6" height="2" fill="currentColor"/></svg>Add</button><svg class="acc-chevron" viewBox="0 0 12 12" fill="none"><rect x="5" y="7" width="2" height="2" fill="currentColor"/><rect x="3" y="5" width="2" height="2" fill="currentColor"/><rect x="7" y="5" width="2" height="2" fill="currentColor"/><rect x="1" y="3" width="2" height="2" fill="currentColor"/><rect x="9" y="3" width="2" height="2" fill="currentColor"/></svg></div></div><div class="acc-body"><div id="acc-accounts"><div class="acc-empty">No custom entries.</div></div></div></div>

        <div class="accordion"><div class="acc-header" onclick="toggleAcc(this)"><span class="acc-title">Ack Reaction</span><svg class="acc-chevron" viewBox="0 0 12 12" fill="none"><rect x="5" y="7" width="2" height="2" fill="currentColor"/><rect x="3" y="5" width="2" height="2" fill="currentColor"/><rect x="7" y="5" width="2" height="2" fill="currentColor"/><rect x="1" y="3" width="2" height="2" fill="currentColor"/><rect x="9" y="3" width="2" height="2" fill="currentColor"/></svg></div>
          <div class="acc-body">
            <div class="toggle-row" style="margin-bottom:10px"><span class="toggle-name">Direct</span><div class="toggle-switch on" onclick="this.classList.toggle('on')"></div></div>
            <div class="field-wrap" style="margin-bottom:12px"><label class="field-label">Emoji</label><input class="field-input" type="text" placeholder="👋"></div>
            <div class="field-wrap"><label class="field-label">Group</label><div class="tab-group"><div class="tab-opt" onclick="tabSelect(this)">always</div><div class="tab-opt active" onclick="tabSelect(this)">mentions</div><div class="tab-opt" onclick="tabSelect(this)">never</div></div></div>
          </div>
        </div>

        <div class="accordion"><div class="acc-header" onclick="toggleAcc(this)"><span class="acc-title">Actions</span><svg class="acc-chevron" viewBox="0 0 12 12" fill="none"><rect x="5" y="7" width="2" height="2" fill="currentColor"/><rect x="3" y="5" width="2" height="2" fill="currentColor"/><rect x="7" y="5" width="2" height="2" fill="currentColor"/><rect x="1" y="3" width="2" height="2" fill="currentColor"/><rect x="9" y="3" width="2" height="2" fill="currentColor"/></svg></div>
          <div class="acc-body"><div class="toggle-row"><span class="toggle-name">Polls</span><div class="toggle-switch" onclick="this.classList.toggle('on')"></div></div><div class="toggle-row"><span class="toggle-name">Reactions</span><div class="toggle-switch" onclick="this.classList.toggle('on')"></div></div><div class="toggle-row"><span class="toggle-name">Send Message</span><div class="toggle-switch" onclick="this.classList.toggle('on')"></div></div></div>
        </div>

        <div class="accordion"><div class="acc-header" onclick="toggleAcc(this)"><span class="acc-title">Allow From</span><div class="acc-right"><span class="acc-count">1 item</span><button class="acc-plus" onclick="addEntry('acc-allowfrom','entry');event.stopPropagation()"><svg width="8" height="8" viewBox="0 0 8 8" fill="none"><rect x="3" y="1" width="2" height="6" fill="currentColor"/><rect x="1" y="3" width="6" height="2" fill="currentColor"/></svg>Add</button><svg class="acc-chevron" viewBox="0 0 12 12" fill="none"><rect x="5" y="7" width="2" height="2" fill="currentColor"/><rect x="3" y="5" width="2" height="2" fill="currentColor"/><rect x="7" y="5" width="2" height="2" fill="currentColor"/><rect x="1" y="3" width="2" height="2" fill="currentColor"/><rect x="9" y="3" width="2" height="2" fill="currentColor"/></svg></div></div>
          <div class="acc-body"><div id="acc-allowfrom"><div class="item-row"><span class="item-num">#1</span><input class="field-input" style="flex:1;margin:0 10px" type="text" value="*"><button class="item-del" onclick="delItem(this)"><svg viewBox="0 0 12 12" fill="none"><rect x="2" y="2" width="2" height="8" fill="currentColor" opacity=".5"/><rect x="8" y="2" width="2" height="8" fill="currentColor" opacity=".5"/></svg></button></div></div></div>
        </div>

        <div class="accordion"><div class="acc-header" onclick="toggleAcc(this)"><span class="acc-title">Block Streaming</span><div class="acc-right"><div class="toggle-switch" onclick="this.classList.toggle('on');event.stopPropagation()" style="margin-right:4px"></div><svg class="acc-chevron" viewBox="0 0 12 12" fill="none"><rect x="5" y="7" width="2" height="2" fill="currentColor"/><rect x="3" y="5" width="2" height="2" fill="currentColor"/><rect x="7" y="5" width="2" height="2" fill="currentColor"/><rect x="1" y="3" width="2" height="2" fill="currentColor"/><rect x="9" y="3" width="2" height="2" fill="currentColor"/></svg></div></div><div class="acc-body"><p style="font-family:'VT323',monospace;font-size:1.1rem;color:rgba(255,255,255,.35)">Bloqueia todas as respostas em streaming.</p></div></div>

        <div class="accordion"><div class="acc-header" onclick="toggleAcc(this)"><span class="acc-title">Block Streaming Coalesce</span><svg class="acc-chevron" viewBox="0 0 12 12" fill="none"><rect x="5" y="7" width="2" height="2" fill="currentColor"/><rect x="3" y="5" width="2" height="2" fill="currentColor"/><rect x="7" y="5" width="2" height="2" fill="currentColor"/><rect x="1" y="3" width="2" height="2" fill="currentColor"/><rect x="9" y="3" width="2" height="2" fill="currentColor"/></svg></div><div class="acc-body"><div class="toggle-row"><span class="toggle-name">Enabled</span><div class="toggle-switch" onclick="this.classList.toggle('on')"></div></div></div></div>

        <div class="section-label">DM History Limit</div>
        <div class="stepper"><button class="stepper-btn" onclick="stepperChange('dmHistLimit',-1)">−</button><input class="stepper-val" id="dmHistLimit" type="number" value="0" min="0"><button class="stepper-btn" onclick="stepperChange('dmHistLimit',1)">+</button><div style="flex:2"></div></div>

        <div class="section-label" style="margin-top:14px">WhatsApp DM Policy</div>
        <p style="font-family:'VT323',monospace;font-size:1.1rem;color:rgba(255,255,255,.32);margin-bottom:8px;line-height:1.5">Controle de acesso às DMs ("pairing" recomendado).</p>
        <div class="tab-group"><div class="tab-opt" onclick="tabSelect(this)">pairing</div><div class="tab-opt" onclick="tabSelect(this)">allowlist</div><div class="tab-opt active" onclick="tabSelect(this)">open</div><div class="tab-opt" onclick="tabSelect(this)">disabled</div></div>

        <div class="accordion" style="margin-top:8px"><div class="acc-header" onclick="toggleAcc(this)"><span class="acc-title">Dms</span><svg class="acc-chevron open" viewBox="0 0 12 12" fill="none"><rect x="5" y="7" width="2" height="2" fill="currentColor"/><rect x="3" y="5" width="2" height="2" fill="currentColor"/><rect x="7" y="5" width="2" height="2" fill="currentColor"/><rect x="1" y="3" width="2" height="2" fill="currentColor"/><rect x="9" y="3" width="2" height="2" fill="currentColor"/></svg></div>
          <div class="acc-body open">
            <div class="toggle-row" style="margin-bottom:10px"><span class="toggle-name">Enabled</span><div class="toggle-switch on" onclick="this.classList.toggle('on')"></div></div>
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px"><span class="field-label">Group Allow From</span><button class="acc-plus" onclick="addEntry('acc-grpallow','entry')"><svg width="8" height="8" viewBox="0 0 8 8" fill="none"><rect x="3" y="1" width="2" height="6" fill="currentColor"/><rect x="1" y="3" width="6" height="2" fill="currentColor"/></svg>Add</button></div>
            <div id="acc-grpallow"><div class="acc-empty">No items.</div></div>
          </div>
        </div>

        <div class="section-label">Group Policy</div>
        <div class="tab-group"><div class="tab-opt" onclick="tabSelect(this)">open</div><div class="tab-opt" onclick="tabSelect(this)">disabled</div><div class="tab-opt active" onclick="tabSelect(this)">allowlist</div></div>

        <div class="accordion"><div class="acc-header" onclick="toggleAcc(this)"><span class="acc-title">Groups</span><svg class="acc-chevron" viewBox="0 0 12 12" fill="none"><rect x="5" y="7" width="2" height="2" fill="currentColor"/><rect x="3" y="5" width="2" height="2" fill="currentColor"/><rect x="7" y="5" width="2" height="2" fill="currentColor"/><rect x="1" y="3" width="2" height="2" fill="currentColor"/><rect x="9" y="3" width="2" height="2" fill="currentColor"/></svg></div><div class="acc-body"><div class="toggle-row"><span class="toggle-name">Enabled</span><div class="toggle-switch" onclick="this.classList.toggle('on')"></div></div></div></div>
        <div class="accordion"><div class="acc-header" onclick="toggleAcc(this)"><span class="acc-title">Heartbeat</span><svg class="acc-chevron" viewBox="0 0 12 12" fill="none"><rect x="5" y="7" width="2" height="2" fill="currentColor"/><rect x="3" y="5" width="2" height="2" fill="currentColor"/><rect x="7" y="5" width="2" height="2" fill="currentColor"/><rect x="1" y="3" width="2" height="2" fill="currentColor"/><rect x="9" y="3" width="2" height="2" fill="currentColor"/></svg></div><div class="acc-body"><p style="font-family:'VT323',monospace;font-size:1.1rem;color:rgba(255,255,255,.35)">Heartbeats periódicos para manter conexão.</p></div></div>
        <div class="accordion"><div class="acc-header" onclick="toggleAcc(this)"><span class="acc-title">Markdown</span><svg class="acc-chevron" viewBox="0 0 12 12" fill="none"><rect x="5" y="7" width="2" height="2" fill="currentColor"/><rect x="3" y="5" width="2" height="2" fill="currentColor"/><rect x="7" y="5" width="2" height="2" fill="currentColor"/><rect x="1" y="3" width="2" height="2" fill="currentColor"/><rect x="9" y="3" width="2" height="2" fill="currentColor"/></svg></div><div class="acc-body"><div class="toggle-row"><span class="toggle-name">Enabled</span><div class="toggle-switch on" onclick="this.classList.toggle('on')"></div></div></div></div>

        <div class="section-label">History Limit</div>
        <div class="stepper"><button class="stepper-btn" onclick="stepperChange('histLimit',-1)">−</button><input class="stepper-val" id="histLimit" type="number" value="5" min="0"><button class="stepper-btn" onclick="stepperChange('histLimit',1)">+</button><div style="flex:2"></div></div>

        <div class="section-label" style="margin-top:12px">Media Max Mb</div>
        <div class="stepper"><button class="stepper-btn" onclick="stepperChange('mediaMb',-10)">−</button><input class="stepper-val" id="mediaMb" type="number" value="50" min="0"><button class="stepper-btn" onclick="stepperChange('mediaMb',10)">+</button><div style="flex:2"></div></div>

        <div class="section-label" style="margin-top:12px">Message Prefix</div>
        <input class="field-input" type="text" placeholder="" style="width:100%">
        <div class="section-label" style="margin-top:12px">Response Prefix</div>
        <input class="field-input" type="text" placeholder="" style="width:100%">

        <div class="accordion" style="margin-top:8px"><div class="acc-header" style="cursor:default"><div class="toggle-info"><div class="toggle-name">WhatsApp Self-Phone Mode</div><div class="toggle-desc">Mesmo número para bot e usuário.</div><div class="toggle-tags"><span class="tag">network</span><span class="tag">channels</span></div></div><div class="toggle-switch" onclick="this.classList.toggle('on')"></div></div></div>
        <div class="accordion"><div class="acc-header" style="cursor:default"><span class="toggle-name">Send Read Receipts</span><div class="toggle-switch" onclick="this.classList.toggle('on')"></div></div></div>

        <div class="section-label">Text Chunk Limit</div>
        <div class="stepper"><button class="stepper-btn" onclick="stepperChange('textChunk',-1)">−</button><input class="stepper-val" id="textChunk" type="number" value="0" min="0"><button class="stepper-btn" onclick="stepperChange('textChunk',1)">+</button><div style="flex:2"></div></div>

        <div style="background:var(--bg-surface);border:2px solid var(--border);border-radius:4px;padding:10px 13px;box-shadow:2px 2px 0 rgba(0,0,0,.3);margin-top:10px">
          <div class="inline-info" style="border-bottom:1px solid rgba(37,26,85,.5)"><span class="inline-key">groupPolicy</span><span class="inline-val">allowlist</span></div>
          <div class="inline-info"><span class="inline-key">dmPolicy</span><span class="inline-val">open</span></div>
        </div>

        <div class="btn-row" style="margin-top:10px;padding-bottom:30px">
          <button class="btn btn-primary">Save</button>
          <button class="btn">Reload</button>
        </div>
      </div>
    </div>
  </div><!-- /canais -->

  <!-- ════ EMPTY ════ -->
  <div class="page" id="pg-empty">
    <div class="page-hdr"><div class="page-title" id="emptyTitle">Em breve</div><div class="page-desc">Esta página ainda não foi implementada.</div></div>
    <div class="empty-pg"><div class="empty-pg-t">[ página vazia ]</div><div class="empty-pg-d">Conteúdo a ser implementado.</div></div>
  </div>

</main>

<script>
/* ── BANNER ── */
function closeBanner(){
  document.getElementById('updateBanner').style.display='none';
  document.getElementById('mainArea').classList.add('no-banner');
}

/* ── SIDEBAR MOBILE ── */
const sidebar=document.getElementById('sidebar');
const overlay=document.getElementById('sbOverlay');
const hamburger=document.getElementById('tbHamburger');
let sidebarOpen=false;

function toggleSidebar(){
  sidebarOpen=!sidebarOpen;
  sidebar.classList.toggle('open',sidebarOpen);
  overlay.classList.toggle('show',sidebarOpen);
  hamburger.classList.toggle('open',sidebarOpen);
}
function closeSidebar(){
  sidebarOpen=false;
  sidebar.classList.remove('open');
  overlay.classList.remove('show');
  hamburger.classList.remove('open');
}
/* ── NAV ── */
function nav(el,label){
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  el.classList.add('active');
  const pg=el.dataset.page;
  document.querySelectorAll('.page').forEach(p=>{p.classList.remove('active');p.style.display='none'});
  const target=document.getElementById(pg);
  if(target){
    if(pg==='chat'){target.style.display='flex'}else{target.style.display='block'}
    target.classList.add('active');
    if(pg==='chat')setTimeout(()=>{const c=document.getElementById('chatArea');if(c)c.scrollTop=c.scrollHeight},50);
    if(pg==='pg-empty'&&label){document.getElementById('emptyTitle').textContent=label}
  }
  // close sidebar on mobile after nav
  if(window.innerWidth<=768)closeSidebar();
}

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
function stepperChange(id,delta){
  const inp=document.getElementById(id);
  let v=(parseInt(inp.value)||0)+delta;
  if(v<0)v=0;
  inp.value=v;
}

/* ── LIST ENTRIES ── */
function addEntry(listId,prefix){
  const list=document.getElementById(listId);
  const empty=list.querySelector('.acc-empty');if(empty)empty.remove();
  const n=list.querySelectorAll('.item-row').length+1;
  const row=document.createElement('div');row.className='item-row';
  row.innerHTML=`<span class="item-num">#${n}</span><input class="field-input" style="flex:1;margin:0 10px" type="text" placeholder="${prefix} ${n}"><button class="item-del" onclick="delItem(this)"><svg viewBox="0 0 12 12" fill="none"><rect x="2" y="2" width="2" height="8" fill="currentColor" opacity=".5"/><rect x="8" y="2" width="2" height="8" fill="currentColor" opacity=".5"/><rect x="4" y="4" width="4" height="4" fill="currentColor" opacity=".3"/></svg></button>`;
  list.appendChild(row);
  row.querySelector('input').focus();
}
function delItem(btn){
  const row=btn.closest('.item-row'),list=row.parentElement;
  row.remove();
  if(!list.querySelector('.item-row')){const e=document.createElement('div');e.className='acc-empty';e.textContent='No items.';list.appendChild(e)}
}

/* ── CHAT ── */
const SESS=['vexusclaw-tui','whatsapp-main','telegram-bot','discord-srv','api-client'];
let sIdx=0;
function cycleSess(){sIdx=(sIdx+1)%SESS.length;document.getElementById('sessVal').textContent=SESS[sIdx]}

const chatInp=document.getElementById('chatInput');
chatInp.addEventListener('input',()=>{chatInp.style.height='auto';chatInp.style.height=Math.min(chatInp.scrollHeight,140)+'px'});
chatInp.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMsg()}});

const REPLIES=['Entendido! Processando... ⚡','Feito! ✓','Analisando... 🔍','Executando! 🚀','Gateway OK. ✅','Missão aceita. 🎯'];
let rIdx=0;

function sendMsg(){
  const v=chatInp.value.trim();if(!v)return;
  const area=document.getElementById('chatArea');
  const typing=document.getElementById('typingRow');
  const t=now();
  const row=document.createElement('div');
  row.className='msg-row-right';row.style.animation='msgIn .3s ease-out both';
  row.innerHTML=`<div class="msg-r-wrap"><div class="msg-meta-r"><span class="msg-meta-txt">${esc(document.getElementById('sessVal').textContent)} (gateway-client)</span><span class="msg-meta-txt">${t}</span></div><div class="msg-r"><p>${esc(v)}</p></div></div><div class="msg-av-r">U</div>`;
  area.insertBefore(row,typing);
  chatInp.value='';chatInp.style.height='auto';
  typing.style.display='flex';area.appendChild(typing);scroll();
  setTimeout(()=>{typing.style.display='none';chatAddBot(REPLIES[rIdx%REPLIES.length]);rIdx++},700+Math.random()*700);
}

function chatAddBot(text){
  const area=document.getElementById('chatArea');
  const typing=document.getElementById('typingRow');
  const t=now();
  const row=document.createElement('div');
  row.className='msg-row-left';row.style.animation='msgIn .3s ease-out both';
  row.innerHTML=`<div class="msg-av-l"><img src="https://community.aseprite.org/uploads/default/original/2X/0/0eff0e4064297cbbe7383108c2f7322c758a5e1f.gif" alt="" draggable="false"></div><div class="msg-bot-wrap"><div class="msg-bot-name">VexusClaw <span class="msg-bot-time">${t}</span></div><div class="msg-l">${text}</div></div>`;
  area.insertBefore(row,typing);scroll();
}

function newSession(){
  const area=document.getElementById('chatArea');
  const typing=document.getElementById('typingRow');
  const d=document.createElement('div');d.className='date-div';
  d.innerHTML=`<span>Nova sessão · ${now()}</span>`;
  area.insertBefore(d,typing);
  chatAddBot('Nova sessão iniciada! 🧙✨');
}

function scroll(){requestAnimationFrame(()=>{const a=document.getElementById('chatArea');if(a)a.scrollTop=a.scrollHeight})}
function now(){const d=new Date();return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')}
function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}

// Fix chat page display on load
document.getElementById('chat').style.display='none';
setTimeout(scroll,200);
</script>
<script src="/assets/vexus-api.js"></script>
<script src="/assets/vexus-auth.js"></script>
<script src="/assets/pages/overview.js"></script>
<script src="vexus-ui.js"></script>
</body>
</html>
