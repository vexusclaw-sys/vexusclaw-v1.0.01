<?php $menuActive = 'cron'; ?>
<!DOCTYPE html>
<html lang="pt-BR" style="color-scheme:dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>VexusClaw — Tarefas Cron</title>
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
.tb-hamburger{width:34px;height:34px;display:flex;flex-direction:column;justify-content:center;
  align-items:center;gap:5px;cursor:pointer;border:none;background:none;border-radius:3px;
  transition:.2s;flex-shrink:0}
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
.tb-lbl{color:rgba(255,255,255,.38)}.tb-val{color:rgba(255,255,255,.8)}
.tb-avatar{width:32px;height:32px;background:linear-gradient(135deg,var(--accent),var(--accent2));border:2px solid var(--border);border-radius:3px;display:flex;align-items:center;justify-content:center;font-family:'Press Start 2P',monospace;font-size:.46rem;cursor:pointer;box-shadow:2px 2px 0 rgba(0,0,0,.4);flex-shrink:0;text-shadow:var(--px-s)}
@media(max-width:600px){.tb-badge{display:none}}

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
.banner-x{cursor:pointer;opacity:.4;font-size:1.2rem;margin-left:6px}.banner-x:hover{opacity:1}

/* ══ SIDEBAR ══ */
.sidebar{position:fixed;top:var(--topbar-h);left:0;bottom:0;z-index:200;width:var(--sidebar-w);
  background:var(--bg-sidebar);border-right:2px solid var(--border);
  display:flex;flex-direction:column;overflow-y:auto;overflow-x:hidden;
  transition:transform .25s cubic-bezier(.4,0,.2,1)}
.sidebar::-webkit-scrollbar{width:3px}
.sidebar::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}
@media(max-width:768px){.sidebar{transform:translateX(-100%)}}
.sidebar.open{transform:translateX(0)!important}
.sg-label{padding:9px 14px 6px;font-family:'Press Start 2P',monospace;font-size:.38rem;color:rgba(255,255,255,.22);letter-spacing:1px}
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
.main{position:fixed;top:calc(var(--topbar-h) + 37px);left:var(--sidebar-w);right:0;bottom:0;
  overflow-y:auto;overflow-x:hidden;transition:left .25s cubic-bezier(.4,0,.2,1)}
.main::-webkit-scrollbar{width:5px}
.main::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}
@media(max-width:768px){.main{left:0}}

/* ══ PAGE HEADER ══ */
.page-hdr{padding:20px 26px 14px;border-bottom:2px solid var(--border);background:rgba(9,5,26,.5);
  display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap}
.page-title{font-family:'Press Start 2P',monospace;font-size:.9rem;text-shadow:var(--px-s);margin-bottom:5px}
.page-desc{font-family:'VT323',monospace;font-size:1.2rem;color:rgba(255,255,255,.38)}
.page-body{padding:20px 26px 60px;display:flex;flex-direction:column;gap:16px}
@media(max-width:600px){.page-hdr,.page-body{padding-left:14px;padding-right:14px}}

/* ══ CARD ══ */
.card{background:var(--bg-card);border:2px solid var(--border);border-radius:6px;
  box-shadow:4px 4px 0 rgba(0,0,0,.5);overflow:hidden;position:relative}
.card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;
  background:repeating-linear-gradient(90deg,var(--accent) 0,var(--accent) 4px,transparent 4px,transparent 8px);opacity:.25}
.card-hdr{padding:14px 18px 11px;border-bottom:2px solid var(--border-light);
  display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
.card-title{font-family:'Press Start 2P',monospace;font-size:.58rem;text-shadow:var(--px-s);margin-bottom:3px}
.card-desc{font-family:'VT323',monospace;font-size:1rem;color:rgba(255,255,255,.35)}
.card-body{padding:16px 18px}

/* ══ BUTTONS ══ */
.btn{padding:9px 14px;border:2px solid var(--border);border-radius:4px;font-family:'Press Start 2P',monospace;font-size:.44rem;text-shadow:var(--px-s);cursor:pointer;transition:.2s;box-shadow:2px 2px 0 rgba(0,0,0,.4);background:var(--bg-surface)}
.btn:hover{border-color:var(--accent);background:rgba(180,77,255,.1);transform:translate(-1px,-1px)}
.btn:active{transform:translate(1px,1px)}
.btn-primary{background:linear-gradient(135deg,var(--accent),var(--accent2));border-color:var(--accent2);box-shadow:3px 3px 0 #3d0070}
.btn-primary:hover{box-shadow:4px 4px 0 #3d0070}
.btn-danger{background:linear-gradient(135deg,#cc2200,#aa1800);border-color:#aa1800;box-shadow:3px 3px 0 #550800}
.btn-sm{padding:6px 10px;font-size:.38rem}
.btn-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap}

/* ══ FIELDS ══ */
.field-wrap{display:flex;flex-direction:column;gap:5px}
.field-label{font-family:'Press Start 2P',monospace;font-size:.44rem;color:rgba(255,255,255,.5);text-shadow:var(--px-s)}
.field-input{padding:10px 12px;background:var(--bg-input);border:2px solid var(--border);
  box-shadow:inset 2px 2px 0 rgba(0,0,0,.4),2px 2px 0 rgba(0,0,0,.3);border-radius:4px;
  font-family:'VT323',monospace;font-size:1.2rem;color:#fff;outline:none;transition:.2s;width:100%}
.field-input:focus{border-color:var(--accent);box-shadow:inset 2px 2px 0 rgba(0,0,0,.4),0 0 0 3px rgba(180,77,255,.06)}
.field-input::placeholder{color:rgba(255,255,255,.2)}
.field-select{appearance:none;-webkit-appearance:none;cursor:pointer;
  background:var(--bg-input) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10'%3E%3Crect x='4' y='6' width='2' height='2' fill='%23555'/%3E%3Crect x='2' y='4' width='2' height='2' fill='%23555'/%3E%3Crect x='6' y='4' width='2' height='2' fill='%23555'/%3E%3C/svg%3E") no-repeat right 10px center}
.textarea-input{resize:vertical;min-height:90px;line-height:1.5}

/* ══ SECTION LABEL ══ */
.section-label{font-family:'Press Start 2P',monospace;font-size:.46rem;color:rgba(255,255,255,.45);
  text-shadow:var(--px-s);margin-bottom:8px;margin-top:16px;display:flex;align-items:center;gap:8px}
.section-label::after{content:'';flex:1;height:1px;
  background:repeating-linear-gradient(90deg,var(--border) 0,var(--border) 4px,transparent 4px,transparent 8px)}
.section-label:first-child{margin-top:0}

/* ══ TOGGLE ROW ══ */
.toggle-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 13px;
  background:var(--bg-surface);border:2px solid var(--border);border-radius:4px;margin-bottom:8px;
  box-shadow:2px 2px 0 rgba(0,0,0,.3)}
.toggle-name{font-family:'Press Start 2P',monospace;font-size:.48rem;text-shadow:var(--px-s)}
.toggle-desc{font-family:'VT323',monospace;font-size:1.05rem;color:rgba(255,255,255,.35);line-height:1.4;margin-top:3px}
.toggle-switch{flex-shrink:0;width:38px;height:22px;background:rgba(255,255,255,.08);
  border:2px solid rgba(255,255,255,.15);border-radius:11px;cursor:pointer;position:relative;transition:.25s}
.toggle-switch.on{background:rgba(68,255,170,.22);border-color:var(--green);box-shadow:0 0 8px rgba(68,255,170,.15)}
.toggle-switch::after{content:'';position:absolute;top:2px;left:2px;width:14px;height:14px;
  background:rgba(255,255,255,.3);border-radius:3px;transition:.25s}
.toggle-switch.on::after{left:calc(100% - 16px);background:var(--green)}

/* ══ ACCORDION ══ */
.acc-wrap{border:2px solid var(--border);border-radius:4px;overflow:hidden;margin-top:10px;box-shadow:2px 2px 0 rgba(0,0,0,.3)}
.acc-hdr{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;cursor:pointer;background:var(--bg-surface);transition:.2s;user-select:none}
.acc-hdr:hover{background:rgba(180,77,255,.07)}
.acc-title{font-family:'Press Start 2P',monospace;font-size:.5rem;text-shadow:var(--px-s);color:rgba(255,255,255,.8)}
.acc-chev{width:12px;height:12px;image-rendering:pixelated;opacity:.4;transition:.3s;flex-shrink:0}
.acc-chev.open{transform:rotate(180deg)}
.acc-body{background:var(--bg-card);padding:14px;border-top:2px solid var(--border-light);display:none}
.acc-body.open{display:block;animation:pgIn .2s ease-out}

/* ══ STEPPER ══ */
.stepper{display:flex;align-items:stretch;background:var(--bg-input);border:2px solid var(--border);border-radius:4px;overflow:hidden;box-shadow:2px 2px 0 rgba(0,0,0,.3);width:fit-content;min-width:130px}
.stepper-btn{width:34px;flex-shrink:0;display:flex;align-items:center;justify-content:center;background:var(--bg-surface);cursor:pointer;font-size:1.3rem;color:rgba(255,255,255,.5);transition:.2s;border:none;border-right:1px solid var(--border)}
.stepper-btn:last-child{border-right:none;border-left:1px solid var(--border)}
.stepper-btn:hover{background:rgba(180,77,255,.12);color:#fff}
.stepper-val{flex:1;text-align:center;padding:9px 6px;font-family:'Press Start 2P',monospace;font-size:.6rem;border:none;background:transparent;outline:none;color:#fff;min-width:40px}

/* ══ TAB GROUP ══ */
.tab-group{display:flex;background:var(--bg-input);border:2px solid var(--border);border-radius:4px;overflow:hidden;box-shadow:2px 2px 0 rgba(0,0,0,.3)}
.tab-opt{flex:1;padding:9px 10px;text-align:center;font-family:'Press Start 2P',monospace;font-size:.4rem;color:rgba(255,255,255,.35);cursor:pointer;transition:.2s;border-right:1px solid var(--border)}
.tab-opt:last-child{border-right:none}
.tab-opt:hover{background:rgba(180,77,255,.06);color:rgba(255,255,255,.65)}
.tab-opt.active{background:linear-gradient(135deg,var(--accent),var(--accent2));color:#fff;text-shadow:var(--px-s)}

/* ══ JOB LIST ══ */
.job-list{display:flex;flex-direction:column;gap:0}
.job-row{display:flex;align-items:stretch;border-bottom:2px solid var(--border-light);transition:.15s;position:relative;overflow:hidden}
.job-row:last-child{border-bottom:none}
.job-row::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:transparent;transition:.2s}
.job-row.enabled::before{background:var(--green);box-shadow:0 0 6px rgba(68,255,170,.3)}
.job-row.disabled::before{background:rgba(255,255,255,.1)}
.job-row:hover{background:rgba(180,77,255,.04)}
.job-main{flex:1;padding:14px 18px 14px 20px;cursor:pointer;min-width:0}
.job-name-row{display:flex;align-items:center;gap:8px;margin-bottom:5px;flex-wrap:wrap}
.job-name{font-family:'Press Start 2P',monospace;font-size:.52rem;text-shadow:var(--px-s)}
.job-badge{padding:2px 7px;border-radius:2px;font-family:'Press Start 2P',monospace;font-size:.34rem;box-shadow:1px 1px 0 rgba(0,0,0,.3)}
.job-badge.on{background:rgba(68,255,170,.12);border:1px solid rgba(68,255,170,.3);color:var(--green)}
.job-badge.off{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);color:rgba(255,255,255,.35)}
.job-schedule{font-family:'Press Start 2P',monospace;font-size:.38rem;color:var(--accent-bright);text-shadow:var(--px-sa);margin-bottom:5px}
.job-desc{font-family:'VT323',monospace;font-size:1.1rem;color:rgba(255,255,255,.35);line-height:1.4}
.job-meta{display:flex;align-items:center;gap:10px;margin-top:6px;flex-wrap:wrap}
.job-tag{font-family:'VT323',monospace;font-size:.95rem;color:rgba(255,255,255,.3);padding:1px 7px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:2px}
.job-actions{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;padding:14px 12px;border-left:2px solid var(--border-light);flex-shrink:0}
.job-action-btn{width:30px;height:30px;display:flex;align-items:center;justify-content:center;background:var(--bg-surface);border:2px solid var(--border);border-radius:3px;cursor:pointer;transition:.2s;box-shadow:2px 2px 0 rgba(0,0,0,.3)}
.job-action-btn:hover{border-color:var(--accent);background:rgba(180,77,255,.1)}
.job-action-btn.del:hover{border-color:var(--red);background:rgba(255,68,68,.08)}
.job-action-btn.run:hover{border-color:var(--green);background:rgba(68,255,170,.08)}
.job-action-btn svg{width:13px;height:13px;image-rendering:pixelated;opacity:.6}
.job-action-btn:hover svg{opacity:1}
.empty-list{padding:40px 0;text-align:center}
.empty-list-t{font-family:'Press Start 2P',monospace;font-size:.6rem;color:rgba(255,255,255,.14);margin-bottom:10px}
.empty-list-d{font-family:'VT323',monospace;font-size:1.1rem;color:rgba(255,255,255,.22)}

/* ══ JOB FORM ══ */
.job-form{background:var(--bg-card);border:2px solid var(--border);border-radius:6px;
  box-shadow:4px 4px 0 rgba(0,0,0,.5);overflow:hidden;position:relative;
  display:none}
.job-form.open{display:block;animation:pgIn .25s ease-out both}
.job-form::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;
  background:repeating-linear-gradient(90deg,var(--green) 0,var(--green) 4px,transparent 4px,transparent 8px);opacity:.35}
.jf-hdr{padding:14px 18px 12px;border-bottom:2px solid var(--border-light);
  display:flex;align-items:center;justify-content:space-between}
.jf-title{font-family:'Press Start 2P',monospace;font-size:.6rem;text-shadow:var(--px-s);color:var(--green)}
.jf-close{width:28px;height:28px;display:flex;align-items:center;justify-content:center;
  background:none;border:2px solid var(--border);border-radius:3px;cursor:pointer;
  font-size:1rem;opacity:.5;transition:.2s}
.jf-close:hover{opacity:1;border-color:var(--red)}
.jf-body{padding:18px}
.form-2col{display:grid;grid-template-columns:1fr 1fr;gap:14px}
@media(max-width:640px){.form-2col{grid-template-columns:1fr}}
.form-3col{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px}
@media(max-width:640px){.form-3col{grid-template-columns:1fr}}

/* schedule builder */
.schedule-builder{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.sch-word{font-family:'Press Start 2P',monospace;font-size:.44rem;color:rgba(255,255,255,.4);white-space:nowrap}
.sch-num{width:80px;padding:10px 10px;background:var(--bg-input);border:2px solid var(--border);
  box-shadow:inset 2px 2px 0 rgba(0,0,0,.4);border-radius:4px;
  font-family:'Press Start 2P',monospace;font-size:.6rem;color:#fff;outline:none;text-align:center;transition:.2s}
.sch-num:focus{border-color:var(--accent)}
.sch-unit{padding:10px 12px;background:var(--bg-input);border:2px solid var(--border);
  box-shadow:inset 2px 2px 0 rgba(0,0,0,.4);border-radius:4px;
  font-family:'Press Start 2P',monospace;font-size:.5rem;color:rgba(255,255,255,.7);outline:none;cursor:pointer;
  appearance:none;-webkit-appearance:none;transition:.2s}
.sch-unit:focus{border-color:var(--accent)}
.cron-preview{font-family:'VT323',monospace;font-size:1.1rem;color:rgba(180,77,255,.7);
  padding:8px 12px;background:rgba(180,77,255,.05);border:1px solid rgba(180,77,255,.15);
  border-radius:3px;letter-spacing:1px;white-space:nowrap}

/* delivery tabs */
.delivery-tabs{display:flex;gap:0;background:var(--bg-input);border:2px solid var(--border);border-radius:4px;overflow:hidden;margin-bottom:12px}
.dtab{flex:1;padding:9px 10px;text-align:center;font-family:'Press Start 2P',monospace;font-size:.4rem;color:rgba(255,255,255,.35);cursor:pointer;transition:.2s;border-right:1px solid var(--border)}
.dtab:last-child{border-right:none}
.dtab:hover{background:rgba(180,77,255,.06);color:rgba(255,255,255,.65)}
.dtab.active{background:linear-gradient(135deg,var(--accent),var(--accent2));color:#fff}
.dtab-pane{display:none}
.dtab-pane.active{display:block;animation:pgIn .2s ease-out}

/* model selector chips */
.model-chips{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}
.model-chip{padding:7px 12px;background:var(--bg-surface);border:2px solid var(--border);border-radius:4px;font-family:'Press Start 2P',monospace;font-size:.38rem;color:rgba(255,255,255,.4);cursor:pointer;transition:.2s;box-shadow:2px 2px 0 rgba(0,0,0,.3)}
.model-chip:hover{border-color:var(--accent);color:rgba(255,255,255,.8)}
.model-chip.selected{background:rgba(180,77,255,.15);border-color:var(--accent);color:var(--accent-bright);text-shadow:var(--px-sa)}

/* next run badge */
.next-run-badge{display:inline-flex;align-items:center;gap:6px;padding:5px 11px;
  background:rgba(255,189,46,.07);border:1px solid rgba(255,189,46,.25);border-radius:3px;
  font-family:'Press Start 2P',monospace;font-size:.38rem;color:var(--yellow)}

/* run now flash */
@keyframes flash{0%,100%{background:transparent}50%{background:rgba(68,255,170,.12)}}
.job-row.flash{animation:flash .5s ease-out}

@keyframes pgIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes rowOut{to{opacity:0;transform:translateX(30px);max-height:0;padding:0;border:0}}
</style>
</head>
<body>

<!-- TOPBAR -->
<?php include __DIR__ . '/topbar.php'; ?>

<!-- SIDEBAR -->
<?php include __DIR__ . '/sidebar.php'; ?>

<!-- MAIN -->
<main class="main" style="animation:pgIn .3s ease-out both">

  <!-- PAGE HEADER -->
  <div class="page-hdr">
    <div>
      <div class="page-title">Tarefas Cron</div>
      <div class="page-desc">Agendar tarefas recorrentes para agentes do gateway.</div>
    </div>
    <div class="btn-row">
      <div class="next-run-badge">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><rect x="4" y="1" width="2" height="4" fill="currentColor" opacity=".8"/><rect x="4" y="4" width="3" height="2" fill="currentColor" opacity=".6"/><rect x="1" y="1" width="8" height="8" fill="currentColor" opacity=".08"/><rect x="1" y="1" width="8" height="2" fill="currentColor" opacity=".3"/></svg>
        Próximo: <span id="nextRunEl">calculando...</span>
      </div>
      <button class="btn btn-primary" onclick="openForm()">
        <svg style="width:11px;height:11px;vertical-align:middle;margin-right:5px;image-rendering:pixelated" viewBox="0 0 12 12" fill="none"><rect x="5" y="1" width="2" height="10" fill="currentColor"/><rect x="1" y="5" width="10" height="2" fill="currentColor"/></svg>
        Novo Job
      </button>
    </div>
  </div>

  <div class="page-body">

    <!-- ══ JOB FORM ══ -->
    <div class="job-form" id="jobForm">
      <div class="jf-hdr">
        <div class="jf-title" id="formTitle">Novo Job</div>
        <button class="jf-close" onclick="closeForm()">✕</button>
      </div>
      <div class="jf-body">

        <!-- Name + Description + Agent -->
        <div class="form-2col" style="margin-bottom:14px">
          <div class="field-wrap">
            <label class="field-label">Nome *</label>
            <input class="field-input" id="fName" type="text" placeholder="ex: daily-summary">
          </div>
          <div class="field-wrap">
            <label class="field-label">Agent ID *</label>
            <input class="field-input" id="fAgentId" type="text" placeholder="ex: main" value="main">
          </div>
        </div>
        <div class="field-wrap" style="margin-bottom:14px">
          <label class="field-label">Descrição</label>
          <input class="field-input" id="fDesc" type="text" placeholder="Descrição curta desta tarefa">
        </div>

        <!-- Enabled + Schedule -->
        <div class="form-2col" style="margin-bottom:14px">
          <div>
            <div class="section-label">Habilitado</div>
            <div class="toggle-row" style="margin-bottom:0">
              <div><div class="toggle-name">Enabled</div><div class="toggle-desc">Ativar execução desta tarefa.</div></div>
              <div class="toggle-switch on" id="fEnabled" onclick="this.classList.toggle('on')"></div>
            </div>
          </div>
          <div>
            <div class="section-label">Wake Mode</div>
            <div class="tab-group">
              <div class="tab-opt active" onclick="tabSel(this)">Now</div>
              <div class="tab-opt" onclick="tabSel(this)">Delayed</div>
              <div class="tab-opt" onclick="tabSel(this)">Scheduled</div>
            </div>
          </div>
        </div>

        <!-- Schedule builder -->
        <div class="section-label">Schedule</div>
        <div class="schedule-builder">
          <span class="sch-word">Every</span>
          <input class="sch-num" id="schNum" type="number" value="30" min="1" oninput="updateCronPreview()">
          <select class="sch-unit" id="schUnit" onchange="updateCronPreview()">
            <option value="minutes">Minutes</option>
            <option value="hours">Hours</option>
            <option value="days">Days</option>
          </select>
          <div class="cron-preview" id="cronPreview">*/30 * * * *</div>
        </div>
        <div style="margin-top:8px;font-family:'VT323',monospace;font-size:1.05rem;color:rgba(255,255,255,.3)" id="scheduleHint">Executa a cada 30 minutos.</div>

        <!-- Session -->
        <div class="form-2col" style="margin-top:14px">
          <div class="field-wrap">
            <label class="field-label">Session</label>
            <select class="field-input field-select" id="fSession">
              <option value="isolated" selected>Isolated</option>
              <option value="shared">Shared</option>
              <option value="agent:main:main">agent:main:main</option>
              <option value="agent:main:cron">agent:main:cron</option>
            </select>
          </div>
          <div class="field-wrap">
            <label class="field-label">Session Key Override</label>
            <input class="field-input" id="fSessionKey" type="text" placeholder="agent:main:main">
          </div>
        </div>

        <!-- Prompt -->
        <div class="field-wrap" style="margin-top:14px">
          <label class="field-label">Prompt da Tarefa *</label>
          <textarea class="field-input textarea-input" id="fPrompt" placeholder="Descreva a tarefa que o agente deve executar..."></textarea>
        </div>

        <!-- Delivery -->
        <div class="section-label">Delivery</div>
        <div class="delivery-tabs">
          <div class="dtab active" onclick="dTab(this,'announce')">Announce Summary</div>
          <div class="dtab" onclick="dTab(this,'last')">Last Channel</div>
          <div class="dtab" onclick="dTab(this,'to')">To (Specific)</div>
          <div class="dtab" onclick="dTab(this,'none')">None</div>
        </div>
        <div class="dtab-pane active" id="dp-announce">
          <p style="font-family:'VT323',monospace;font-size:1.1rem;color:rgba(255,255,255,.35);line-height:1.5">Envia um resumo anunciando a conclusão da tarefa para o canal padrão do agente.</p>
        </div>
        <div class="dtab-pane" id="dp-last">
          <p style="font-family:'VT323',monospace;font-size:1.1rem;color:rgba(255,255,255,.35);line-height:1.5">Entrega o resultado para o último canal ativo da sessão do agente.</p>
        </div>
        <div class="dtab-pane" id="dp-to">
          <div class="field-wrap" style="margin-top:8px">
            <label class="field-label">Destination</label>
            <input class="field-input" id="fDeliveryTo" type="text" placeholder="ex: whatsapp:5511999999999 ou session-key">
          </div>
        </div>
        <div class="dtab-pane" id="dp-none">
          <p style="font-family:'VT323',monospace;font-size:1.1rem;color:rgba(255,255,255,.35)">Tarefa executada silenciosamente — sem entrega de resultado.</p>
        </div>

        <!-- Advanced -->
        <div class="acc-wrap">
          <div class="acc-hdr" onclick="toggleAcc2(this)">
            <span class="acc-title">Avançado</span>
            <svg class="acc-chev" viewBox="0 0 12 12" fill="none"><rect x="5" y="7" width="2" height="2" fill="currentColor"/><rect x="3" y="5" width="2" height="2" fill="currentColor"/><rect x="7" y="5" width="2" height="2" fill="currentColor"/><rect x="1" y="3" width="2" height="2" fill="currentColor"/><rect x="9" y="3" width="2" height="2" fill="currentColor"/></svg>
          </div>
          <div class="acc-body">

            <div class="form-2col" style="margin-bottom:14px">
              <div class="field-wrap">
                <label class="field-label">Account ID</label>
                <input class="field-input" type="text" placeholder="default" value="default">
              </div>
              <div class="field-wrap">
                <label class="field-label">Thinking</label>
                <select class="field-input field-select">
                  <option>low</option>
                  <option>medium</option>
                  <option>high</option>
                  <option>none</option>
                </select>
              </div>
            </div>

            <div class="field-wrap" style="margin-bottom:12px">
              <label class="field-label">Model Override</label>
              <input class="field-input" id="fModel" type="text" placeholder="openai/gpt-5.2" value="openai/gpt-5.2">
              <div class="model-chips">
                <div class="model-chip selected" onclick="selectModel(this,'openai/gpt-5.2')">gpt-5.2</div>
                <div class="model-chip" onclick="selectModel(this,'openai/gpt-4o')">gpt-4o</div>
                <div class="model-chip" onclick="selectModel(this,'anthropic/claude-sonnet-4-6')">claude-sonnet-4-6</div>
                <div class="model-chip" onclick="selectModel(this,'anthropic/claude-opus-4-6')">claude-opus-4-6</div>
                <div class="model-chip" onclick="selectModel(this,'google/gemini-2.5-pro')">gemini-2.5-pro</div>
              </div>
            </div>

            <div class="toggle-row"><div><div class="toggle-name">Delete after run</div><div class="toggle-desc">Remover a tarefa após a primeira execução bem-sucedida.</div></div><div class="toggle-switch" onclick="this.classList.toggle('on')"></div></div>
            <div class="toggle-row"><div><div class="toggle-name">Clear agent override</div><div class="toggle-desc">Limpar overrides do agente após cada execução.</div></div><div class="toggle-switch" onclick="this.classList.toggle('on')"></div></div>
            <div class="toggle-row"><div><div class="toggle-name">Light context</div><div class="toggle-desc">Usar contexto mínimo para economizar tokens.</div></div><div class="toggle-switch" onclick="this.classList.toggle('on')"></div></div>
            <div class="toggle-row"><div><div class="toggle-name">Failure alerts</div><div class="toggle-desc">Notificar falhas de execução no canal padrão.</div></div><div class="toggle-switch on" onclick="this.classList.toggle('on')"></div></div>
            <div class="toggle-row" style="margin-bottom:0"><div><div class="toggle-name">Best effort delivery</div><div class="toggle-desc">Tentar entrega mesmo em caso de erros parciais.</div></div><div class="toggle-switch on" onclick="this.classList.toggle('on')"></div></div>

          </div>
        </div>

        <!-- Form actions -->
        <div class="btn-row" style="margin-top:18px">
          <button class="btn btn-primary" onclick="submitJob()">
            <svg style="width:10px;height:10px;vertical-align:middle;margin-right:5px;image-rendering:pixelated" viewBox="0 0 10 10" fill="none"><rect x="1" y="5" width="6" height="2" fill="currentColor" opacity=".8"/><rect x="5" y="3" width="2" height="2" fill="currentColor" opacity=".7"/><rect x="5" y="7" width="2" height="2" fill="currentColor" opacity=".7"/><rect x="7" y="1" width="2" height="2" fill="currentColor" opacity=".6"/><rect x="7" y="9" width="2" height="2" fill="currentColor" opacity=".6"/></svg>
            Adicionar Job
          </button>
          <button class="btn" onclick="closeForm()">Cancelar</button>
          <span style="font-family:'VT323',monospace;font-size:1rem;color:rgba(255,255,255,.3);padding:0 4px">* obrigatório</span>
        </div>

      </div>
    </div>

    <!-- ══ JOB LIST ══ -->
    <div class="card">
      <div class="card-hdr">
        <div>
          <div class="card-title">Jobs Agendados</div>
          <div class="card-desc" id="jobCountDesc">0 jobs · 0 ativos</div>
        </div>
        <div class="btn-row">
          <button class="btn btn-sm" onclick="toggleAllJobs()">Toggle All</button>
          <button class="btn btn-sm" id="refreshJobsBtn" onclick="refreshJobs()">Refresh</button>
        </div>
      </div>
      <div class="job-list" id="jobList">
        <div class="empty-list">
          <div class="empty-list-t">[ sem jobs ]</div>
          <div class="empty-list-d">Clique em "Novo Job" para criar uma tarefa cron.</div>
        </div>
      </div>
    </div>

  </div><!-- /page-body -->
</main>

<script>
/* ── SIDEBAR ── */
const sidebar=document.getElementById('sidebar');
const overlay=document.getElementById('sbOverlay');
const hamburger=document.getElementById('tbHamburger');
let sbOpen=false;
function toggleSidebar(){sbOpen=!sbOpen;sidebar.classList.toggle('open',sbOpen);overlay.classList.toggle('show',sbOpen);hamburger.classList.toggle('open',sbOpen)}
function closeSidebar(){sbOpen=false;sidebar.classList.remove('open');overlay.classList.remove('show');hamburger.classList.remove('open')}

/* ── STATE ── */
let jobs=[];
let editingId=null;

/* ── DEMO JOBS pre-loaded ── */
jobs=[
  {
    id:'job_1',name:'daily-report',agentId:'main',
    desc:'Gera relatório diário de atividade e envia resumo.',
    enabled:true,
    schedNum:1,schedUnit:'days',
    session:'isolated',sessionKey:'agent:main:main',
    prompt:'Gere um relatório resumido das atividades do dia, incluindo mensagens processadas, tokens usados e erros. Envie um resumo formatado.',
    delivery:'announce',deliveryTo:'',
    model:'openai/gpt-5.2',thinking:'low',
    deleteAfter:false,clearOverride:false,lightCtx:false,
    failureAlerts:true,bestEffort:true,wakeMode:'Now',
    lastRun:'2m ago',nextRun:null
  },
  {
    id:'job_2',name:'whatsapp-heartbeat',agentId:'main',
    desc:'Verifica saúde do canal WhatsApp a cada 15 minutos.',
    enabled:true,
    schedNum:15,schedUnit:'minutes',
    session:'isolated',sessionKey:'',
    prompt:'Verifique a saúde do canal WhatsApp. Se desconectado, tente reconectar e envie um alerta.',
    delivery:'none',deliveryTo:'',
    model:'openai/gpt-4o',thinking:'none',
    deleteAfter:false,clearOverride:true,lightCtx:true,
    failureAlerts:true,bestEffort:false,wakeMode:'Now',
    lastRun:'12m ago',nextRun:'3m'
  },
  {
    id:'job_3',name:'token-cleanup',agentId:'gpt-plus-1',
    desc:'Limpa sessões expiradas e libera contexto.',
    enabled:false,
    schedNum:6,schedUnit:'hours',
    session:'shared',sessionKey:'agent:main:main',
    prompt:'Identifique sessões com mais de 24h inativas e execute limpeza de contexto. Retorne quantas sessões foram limpas.',
    delivery:'last',deliveryTo:'',
    model:'anthropic/claude-sonnet-4-6',thinking:'low',
    deleteAfter:false,clearOverride:false,lightCtx:false,
    failureAlerts:false,bestEffort:true,wakeMode:'Delayed',
    lastRun:'2h ago',nextRun:null
  }
];

/* ── CRON PREVIEW ── */
function updateCronPreview(){
  const n=parseInt(document.getElementById('schNum').value)||30;
  const u=document.getElementById('schUnit').value;
  let expr='';
  let hint='';
  if(u==='minutes'){expr=`*/${n} * * * *`;hint=`Executa a cada ${n} minuto${n!==1?'s':''}.`}
  else if(u==='hours'){expr=`0 */${n} * * *`;hint=`Executa a cada ${n} hora${n!==1?'s':''}.`}
  else if(u==='days'){expr=`0 0 */${n} * *`;hint=`Executa a cada ${n} dia${n!==1?'s':''}.`}
  document.getElementById('cronPreview').textContent=expr;
  document.getElementById('scheduleHint').textContent=hint;
}
updateCronPreview();

/* ── NEXT RUN TIMER ── */
function updateNextRun(){
  const active=jobs.filter(j=>j.enabled);
  if(!active.length){document.getElementById('nextRunEl').textContent='nenhum job ativo';return}
  const j=active.find(x=>x.nextRun)||active[0];
  document.getElementById('nextRunEl').textContent=j.nextRun||'~'+j.schedNum+' '+j.schedUnit;
}
updateNextRun();

/* ── FORM ── */
function openForm(jobId){
  editingId=jobId||null;
  const form=document.getElementById('jobForm');
  form.classList.add('open');
  document.getElementById('formTitle').textContent=jobId?'Editar Job':'Novo Job';
  if(jobId){
    const j=jobs.find(x=>x.id===jobId);
    if(j){
      document.getElementById('fName').value=j.name;
      document.getElementById('fAgentId').value=j.agentId;
      document.getElementById('fDesc').value=j.desc;
      document.getElementById('fEnabled').classList.toggle('on',j.enabled);
      document.getElementById('schNum').value=j.schedNum;
      document.getElementById('schUnit').value=j.schedUnit;
      document.getElementById('fSession').value=j.session;
      document.getElementById('fSessionKey').value=j.sessionKey;
      document.getElementById('fPrompt').value=j.prompt;
      document.getElementById('fModel').value=j.model;
      document.querySelectorAll('.model-chip').forEach(c=>{
        c.classList.toggle('selected',c.textContent===j.model.split('/')[1]||c.getAttribute('onclick').includes(j.model));
      });
      updateCronPreview();
    }
  } else {
    document.getElementById('fName').value='';
    document.getElementById('fDesc').value='';
    document.getElementById('fPrompt').value='';
    document.getElementById('fEnabled').classList.add('on');
  }
  form.scrollIntoView({behavior:'smooth',block:'start'});
}
function closeForm(){
  document.getElementById('jobForm').classList.remove('open');
  editingId=null;
}

function submitJob(){
  const name=document.getElementById('fName').value.trim();
  const agentId=document.getElementById('fAgentId').value.trim();
  const prompt=document.getElementById('fPrompt').value.trim();
  if(!name||!agentId||!prompt){
    alert('Nome, Agent ID e Prompt são obrigatórios.');return;
  }
  const j={
    id:editingId||'job_'+Date.now(),
    name,agentId,
    desc:document.getElementById('fDesc').value,
    enabled:document.getElementById('fEnabled').classList.contains('on'),
    schedNum:parseInt(document.getElementById('schNum').value)||30,
    schedUnit:document.getElementById('schUnit').value,
    session:document.getElementById('fSession').value,
    sessionKey:document.getElementById('fSessionKey').value,
    prompt,
    delivery:'announce',deliveryTo:'',
    model:document.getElementById('fModel').value,
    thinking:'low',
    deleteAfter:false,clearOverride:false,lightCtx:false,
    failureAlerts:true,bestEffort:true,wakeMode:'Now',
    lastRun:'nunca',nextRun:null
  };
  if(editingId){
    const idx=jobs.findIndex(x=>x.id===editingId);
    if(idx>-1)jobs[idx]=j;
  } else {
    jobs.unshift(j);
  }
  renderJobs();
  closeForm();
  updateNextRun();
}

/* ── RENDER JOBS ── */
function renderJobs(){
  const list=document.getElementById('jobList');
  const active=jobs.filter(j=>j.enabled).length;
  document.getElementById('jobCountDesc').textContent=`${jobs.length} job${jobs.length!==1?'s':''} · ${active} ativo${active!==1?'s':''}`;
  if(!jobs.length){
    list.innerHTML=`<div class="empty-list"><div class="empty-list-t">[ sem jobs ]</div><div class="empty-list-d">Clique em "Novo Job" para criar uma tarefa cron.</div></div>`;
    return;
  }
  list.innerHTML='';
  jobs.forEach(j=>{
    const row=document.createElement('div');
    row.className='job-row '+(j.enabled?'enabled':'disabled');
    row.dataset.id=j.id;

    const schedLabel=`Every ${j.schedNum} ${j.schedUnit}`;
    const cronExpr=j.schedUnit==='minutes'?`*/${j.schedNum} * * * *`:j.schedUnit==='hours'?`0 */${j.schedNum} * * *`:`0 0 */${j.schedNum} * *`;

    row.innerHTML=`
      <div class="job-main" onclick="openForm('${j.id}')">
        <div class="job-name-row">
          <span class="job-name">${esc(j.name)}</span>
          <span class="job-badge ${j.enabled?'on':'off'}">${j.enabled?'ATIVO':'INATIVO'}</span>
        </div>
        <div class="job-schedule">${schedLabel} · <span style="opacity:.6">${cronExpr}</span></div>
        <div class="job-desc">${esc(j.desc||j.prompt.slice(0,80)+(j.prompt.length>80?'...':''))}</div>
        <div class="job-meta">
          <span class="job-tag">agent:${esc(j.agentId)}</span>
          <span class="job-tag">${esc(j.model.split('/')[1]||j.model)}</span>
          <span class="job-tag">session:${esc(j.session)}</span>
          ${j.lightCtx?'<span class="job-tag" style="color:var(--yellow)">light-ctx</span>':''}
          ${j.deleteAfter?'<span class="job-tag" style="color:var(--red)">delete-after</span>':''}
          <span style="margin-left:auto;font-family:\'VT323\',monospace;font-size:1rem;color:rgba(255,255,255,.28)">último: ${esc(j.lastRun)}</span>
        </div>
      </div>
      <div class="job-actions">
        <div class="job-action-btn run" title="Executar agora" onclick="runNow('${j.id}');event.stopPropagation()">
          <svg viewBox="0 0 14 14" fill="none"><rect x="3" y="2" width="2" height="10" fill="var(--green)" opacity=".8"/><rect x="5" y="3" width="2" height="8" fill="var(--green)" opacity=".7"/><rect x="7" y="4" width="2" height="6" fill="var(--green)" opacity=".6"/><rect x="9" y="5" width="2" height="4" fill="var(--green)" opacity=".5"/><rect x="11" y="6" width="2" height="2" fill="var(--green)" opacity=".4"/></svg>
        </div>
        <div class="job-action-btn" title="${j.enabled?'Desativar':'Ativar'}" onclick="toggleJob('${j.id}');event.stopPropagation()">
          <svg viewBox="0 0 14 14" fill="none"><rect x="2" y="6" width="10" height="2" fill="currentColor" opacity=".6"/><rect x="6" y="2" width="2" height="10" fill="${j.enabled?'var(--green)':'currentColor'}" opacity=".${j.enabled?'8':'4'}"/></svg>
        </div>
        <div class="job-action-btn del" title="Remover" onclick="deleteJob('${j.id}');event.stopPropagation()">
          <svg viewBox="0 0 14 14" fill="none"><rect x="2" y="4" width="10" height="2" fill="currentColor" opacity=".5"/><rect x="4" y="6" width="2" height="6" fill="currentColor" opacity=".4"/><rect x="8" y="6" width="2" height="6" fill="currentColor" opacity=".4"/><rect x="5" y="1" width="4" height="2" fill="currentColor" opacity=".4"/></svg>
        </div>
      </div>`;
    list.appendChild(row);
  });
}
renderJobs();

/* ── ACTIONS ── */
function toggleJob(id){
  const j=jobs.find(x=>x.id===id);if(!j)return;
  j.enabled=!j.enabled;
  renderJobs();updateNextRun();
}

function runNow(id){
  const j=jobs.find(x=>x.id===id);if(!j)return;
  const row=document.querySelector(`.job-row[data-id="${id}"]`);
  if(row){row.classList.add('flash');setTimeout(()=>row.classList.remove('flash'),500)}
  j.lastRun='agora';
  renderJobs();
}

function deleteJob(id){
  if(!confirm('Remover este job?'))return;
  const row=document.querySelector(`.job-row[data-id="${id}"]`);
  if(row){
    row.style.transition='opacity .25s,transform .25s';
    row.style.opacity='0';row.style.transform='translateX(20px)';
    setTimeout(()=>{jobs=jobs.filter(x=>x.id!==id);renderJobs();updateNextRun()},250);
  }
}

function toggleAllJobs(){
  const anyOn=jobs.some(j=>j.enabled);
  jobs.forEach(j=>j.enabled=!anyOn);
  renderJobs();updateNextRun();
}

function refreshJobs(){
  const btn=document.getElementById('refreshJobsBtn');
  const orig=btn.textContent;
  btn.innerHTML='<svg style="width:11px;height:11px;animation:spin .7s linear infinite;vertical-align:middle;image-rendering:pixelated" viewBox="0 0 16 16" fill="none"><rect x="4" y="2" width="8" height="2" fill="currentColor" opacity=".7"/><rect x="2" y="4" width="2" height="8" fill="currentColor" opacity=".5"/><rect x="12" y="4" width="2" height="8" fill="currentColor" opacity=".5"/><rect x="4" y="12" width="8" height="2" fill="currentColor" opacity=".5"/></svg>';
  setTimeout(()=>{btn.textContent=orig;renderJobs()},900);
}

/* ── HELPERS ── */
function tabSel(el){el.closest('.tab-group,.delivery-tabs').querySelectorAll('.tab-opt,.dtab').forEach(t=>t.classList.remove('active'));el.classList.add('active')}

function toggleAcc2(hdr){
  const body=hdr.nextElementSibling;
  const chev=hdr.querySelector('.acc-chev');
  body.classList.toggle('open');if(chev)chev.classList.toggle('open');
}

function dTab(btn,pane){
  document.querySelectorAll('.dtab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.dtab-pane').forEach(p=>p.classList.remove('active'));
  btn.classList.add('active');
  const dp=document.getElementById('dp-'+pane);if(dp)dp.classList.add('active');
}

function selectModel(chip,model){
  document.querySelectorAll('.model-chip').forEach(c=>c.classList.remove('selected'));
  chip.classList.add('selected');
  document.getElementById('fModel').value=model;
}

function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}

/* spin */
const st=document.createElement('style');st.textContent='@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}';
document.head.appendChild(st);

/* auto-update uptime */
setInterval(updateNextRun,30000);
</script>
<script src="vexus-ui.js"></script>
</body>
</html>
