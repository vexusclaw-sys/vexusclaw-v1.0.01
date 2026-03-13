<?php $menuActive = 'agents'; ?>
<!DOCTYPE html>
<html lang="pt-BR" style="color-scheme:dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>VexusClaw - Agentes</title>
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap" rel="stylesheet">
<style>
:root{
  --bg:#07030f;--bg-card:#0d0820;--bg-surface:#110c28;--bg-sidebar:#09051a;--bg-input:#0a0618;
  --border:#251a55;--border-light:#1a1035;
  --accent:#b44dff;--accent2:#8a2be2;--accent-bright:#d088ff;
  --green:#44ffaa;--yellow:#ffbd2e;--red:#ff4444;--blue:#44aaff;
  --px-s:-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000;
  --px-sa:-1px -1px 0 #3d0070,1px -1px 0 #3d0070,-1px 1px 0 #3d0070,1px 1px 0 #3d0070;
}
*{margin:0;padding:0;box-sizing:border-box;color:#fff}
html,body{height:100%;overflow:hidden}
body{background:var(--bg);font-family:'VT323',monospace;font-size:18px}
input,button,textarea,select{font-family:inherit}

body::before{content:'';position:fixed;inset:0;z-index:0;pointer-events:none;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect x='0' y='0' width='1' height='1' fill='%23ffffff' opacity='0.007'/%3E%3Crect x='2' y='2' width='1' height='1' fill='%23ffffff' opacity='0.007'/%3E%3C/svg%3E");
  background-size:4px 4px}

.main{display:flex;flex-direction:column;overflow:hidden}

.page-hdr{padding:18px 24px 14px;border-bottom:2px solid var(--border);background:rgba(9,5,26,.55);display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
.page-title{font-family:'Press Start 2P',monospace;font-size:.8rem;text-shadow:var(--px-s);margin-bottom:6px}
.page-desc{font-family:'VT323',monospace;font-size:1.15rem;color:rgba(255,255,255,.42)}
.page-body{padding:16px 20px 20px;flex:1;overflow:auto}
.page-body::-webkit-scrollbar{width:5px}
.page-body::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}

.agents-layout{display:grid;grid-template-columns:340px 1fr;gap:14px;align-items:start}

.card{background:var(--bg-card);border:2px solid var(--border);border-radius:6px;box-shadow:4px 4px 0 rgba(0,0,0,.5);overflow:hidden;position:relative}
.card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:repeating-linear-gradient(90deg,var(--accent) 0,var(--accent) 4px,transparent 4px,transparent 8px);opacity:.22}
.card-hdr{padding:14px 16px 11px;border-bottom:2px solid var(--border-light);display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}
.card-title{font-family:'Press Start 2P',monospace;font-size:.6rem;text-shadow:var(--px-s)}
.card-sub{font-family:'VT323',monospace;font-size:1.05rem;color:rgba(255,255,255,.35)}
.card-body{padding:12px 14px}

.btn{padding:8px 12px;border:2px solid var(--border);border-radius:4px;font-family:'Press Start 2P',monospace;font-size:.4rem;text-shadow:var(--px-s);cursor:pointer;transition:.2s;box-shadow:2px 2px 0 rgba(0,0,0,.35);background:var(--bg-surface);color:#fff}
.btn:hover{border-color:var(--accent);background:rgba(180,77,255,.1)}
.btn-primary{background:linear-gradient(135deg,var(--accent),var(--accent2));border-color:var(--accent2);box-shadow:3px 3px 0 #3d0070}
.btn-primary:hover{background:linear-gradient(135deg,var(--accent-bright),var(--accent));border-color:var(--accent)}
.btn-green{background:linear-gradient(135deg,rgba(68,255,170,.2),rgba(68,255,170,.08));border-color:rgba(68,255,170,.45);color:var(--green)}
.btn-green:hover{background:rgba(68,255,170,.18);border-color:var(--green)}
.btn-yellow{background:rgba(255,189,46,.08);border-color:rgba(255,189,46,.35);color:var(--yellow)}
.btn-yellow:hover{background:rgba(255,189,46,.15);border-color:var(--yellow)}
.btn-sm{padding:6px 9px;font-size:.33rem}
.btn-xs{padding:4px 7px;font-size:.3rem}

.agents-list{display:flex;flex-direction:column;max-height:calc(100vh - 250px);overflow:auto}
.agents-list::-webkit-scrollbar{width:4px}
.agents-list::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}
.agent-row{display:flex;align-items:center;gap:10px;padding:10px 12px;border-bottom:1px solid rgba(37,26,85,.45);cursor:pointer;transition:.15s;background:none;border-left:none;border-right:none;border-top:none;width:100%;text-align:left}
.agent-row:hover{background:rgba(180,77,255,.07)}
.agent-row.active{background:rgba(180,77,255,.13)}
.agent-row:last-child{border-bottom:none}
.agent-icon{width:26px;height:26px;border-radius:4px;border:1px solid var(--border);background:var(--bg-surface);display:flex;align-items:center;justify-content:center;font-family:'Press Start 2P',monospace;font-size:.58rem;flex-shrink:0;text-shadow:var(--px-s)}
.agent-icon.bot{font-size:.82rem}
.agent-text{min-width:0;flex:1}
.agent-name{font-family:'Press Start 2P',monospace;font-size:.45rem;color:#fff;text-shadow:var(--px-s);line-height:1.7;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.agent-sub{font-family:'VT323',monospace;font-size:1rem;color:rgba(255,255,255,.35);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

.agent-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;flex-wrap:wrap;padding:14px 16px 10px;border-bottom:2px solid var(--border-light)}
.agent-id-wrap{display:flex;align-items:center;gap:10px}
.agent-avatar{width:34px;height:34px;border-radius:4px;border:2px solid var(--border);background:linear-gradient(135deg,var(--accent),var(--accent2));display:flex;align-items:center;justify-content:center;font-family:'Press Start 2P',monospace;font-size:.7rem;text-shadow:var(--px-s)}
.agent-id{font-family:'Press Start 2P',monospace;font-size:.54rem;text-shadow:var(--px-s);margin-bottom:4px}
.agent-blurb{font-family:'VT323',monospace;font-size:1.05rem;color:rgba(255,255,255,.36)}
.meta-tags{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.meta-tag{padding:4px 8px;border-radius:3px;border:1px solid rgba(255,255,255,.14);font-family:'Press Start 2P',monospace;font-size:.34rem;color:rgba(255,255,255,.65);background:rgba(255,255,255,.04)}
.meta-tag.default{border-color:rgba(68,255,170,.35);color:var(--green);background:rgba(68,255,170,.08)}

.tabs{display:flex;gap:2px;padding:10px 14px;border-bottom:2px solid var(--border-light);flex-wrap:wrap}
.tab{padding:8px 10px;border:1px solid transparent;border-radius:4px;font-family:'Press Start 2P',monospace;font-size:.34rem;color:rgba(255,255,255,.45);background:none;cursor:pointer;transition:.15s}
.tab:hover{color:#fff;background:rgba(180,77,255,.07)}
.tab.active{color:#fff;border-color:rgba(180,77,255,.28);background:rgba(180,77,255,.15)}

.section{padding:14px}
.section-hdr{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:10px}
.section-title{font-family:'Press Start 2P',monospace;font-size:.52rem;text-shadow:var(--px-s);margin-bottom:4px}
.section-desc{font-family:'VT323',monospace;font-size:1rem;color:rgba(255,255,255,.38)}
.actions{display:flex;gap:6px;flex-wrap:wrap}

.notice{padding:10px 12px;border:1px solid rgba(180,77,255,.28);background:rgba(180,77,255,.07);border-radius:4px;font-family:'VT323',monospace;font-size:1rem;color:rgba(255,255,255,.75);margin-bottom:12px}
.notice-green{border-color:rgba(68,255,170,.28);background:rgba(68,255,170,.06);color:rgba(255,255,255,.8)}
.notice-yellow{border-color:rgba(255,189,46,.28);background:rgba(255,189,46,.06);color:rgba(255,255,255,.8)}
.notice-blue{border-color:rgba(68,170,255,.28);background:rgba(68,170,255,.06);color:rgba(255,255,255,.8)}
.filter-row{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:10px}
.filter-input{width:280px;max-width:100%;padding:9px 11px;background:var(--bg-input);border:2px solid var(--border);border-radius:4px;box-shadow:inset 2px 2px 0 rgba(0,0,0,.35),2px 2px 0 rgba(0,0,0,.25);font-family:'VT323',monospace;font-size:1.12rem;outline:none;color:#fff}
.filter-input:focus{border-color:var(--accent)}
.filter-count{font-family:'Press Start 2P',monospace;font-size:.36rem;color:rgba(255,255,255,.45)}

.group-title{font-family:'Press Start 2P',monospace;font-size:.44rem;color:rgba(255,255,255,.65);margin:10px 0 8px;display:flex;align-items:center;justify-content:space-between}
.skill-list{display:flex;flex-direction:column;gap:8px}
.skill-item{padding:11px 12px;background:var(--bg-surface);border:1px solid var(--border);border-radius:4px;box-shadow:2px 2px 0 rgba(0,0,0,.3)}
.skill-name{font-family:'Press Start 2P',monospace;font-size:.4rem;text-shadow:var(--px-s);margin-bottom:6px;line-height:1.7}
.skill-desc{font-family:'VT323',monospace;font-size:1.04rem;color:rgba(255,255,255,.72);line-height:1.45}
.skill-meta{display:flex;gap:6px;flex-wrap:wrap;margin-top:7px}
.skill-tag{padding:3px 7px;border-radius:3px;font-family:'Press Start 2P',monospace;font-size:.3rem;border:1px solid}
.skill-tag.eligible{border-color:rgba(68,255,170,.35);background:rgba(68,255,170,.08);color:var(--green)}
.skill-tag.blocked{border-color:rgba(255,68,68,.35);background:rgba(255,68,68,.08);color:var(--red)}
.skill-tag.scope{border-color:rgba(255,255,255,.2);background:rgba(255,255,255,.06);color:rgba(255,255,255,.65)}
.skill-missing{margin-top:6px;font-family:'VT323',monospace;font-size:1rem;color:var(--yellow)}

.builtin-box{padding:10px 12px;border:1px dashed rgba(255,255,255,.2);border-radius:4px;background:rgba(255,255,255,.03);font-family:'VT323',monospace;font-size:1.05rem;color:rgba(255,255,255,.5)}

/* ═══════════════════════════════════════════
   MODAL SYSTEM
═══════════════════════════════════════════ */
.modal-overlay{
  position:fixed;inset:0;z-index:1000;
  background:rgba(7,3,15,.85);
  backdrop-filter:blur(4px);
  display:flex;align-items:center;justify-content:center;
  padding:16px;
  opacity:0;pointer-events:none;transition:opacity .2s;
}
.modal-overlay.open{opacity:1;pointer-events:all}

.modal{
  background:var(--bg-card);
  border:2px solid var(--border);
  border-radius:8px;
  box-shadow:6px 6px 0 rgba(0,0,0,.6),0 0 40px rgba(180,77,255,.12);
  width:100%;max-width:680px;
  max-height:90vh;
  display:flex;flex-direction:column;
  position:relative;
  overflow:hidden;
  transform:translateY(12px);transition:transform .2s;
}
.modal-overlay.open .modal{transform:translateY(0)}
.modal::before{
  content:'';position:absolute;top:0;left:0;right:0;height:3px;
  background:repeating-linear-gradient(90deg,var(--accent) 0,var(--accent) 6px,transparent 6px,transparent 12px);
  opacity:.5;
}

.modal-hdr{
  padding:16px 18px 12px;
  border-bottom:2px solid var(--border-light);
  display:flex;align-items:flex-start;justify-content:space-between;gap:12px;
  flex-shrink:0;
}
.modal-title-wrap{}
.modal-title{font-family:'Press Start 2P',monospace;font-size:.84rem;text-shadow:var(--px-s);margin-bottom:6px}
.modal-subtitle{font-family:'Press Start 2P',monospace;font-size:.5rem;color:var(--accent-bright);text-shadow:var(--px-sa);margin-bottom:4px}
.modal-desc{font-family:'VT323',monospace;font-size:1.28rem;color:rgba(255,255,255,.42);line-height:1.4;max-width:560px}
.modal-close{
  width:34px;height:34px;border-radius:4px;border:1px solid var(--border);
  background:var(--bg-surface);color:rgba(255,255,255,.6);
  display:flex;align-items:center;justify-content:center;
  font-family:'Press Start 2P',monospace;font-size:.62rem;
  cursor:pointer;flex-shrink:0;transition:.15s;
}
.modal-close:hover{border-color:var(--accent);color:#fff;background:rgba(180,77,255,.15)}

/* Wizard tabs */
.modal-wizard-tabs{
  display:flex;padding:10px 18px 0;border-bottom:2px solid var(--border-light);
  gap:0;flex-shrink:0;
}
.wiz-tab{
  padding:10px 15px;
  border:1px solid transparent;border-bottom:none;border-radius:4px 4px 0 0;
  font-family:'Press Start 2P',monospace;font-size:.44rem;
  color:rgba(255,255,255,.38);background:none;cursor:default;
  position:relative;bottom:-2px;
  display:flex;align-items:center;gap:6px;
}
.wiz-tab.done{color:var(--green)}
.wiz-tab.active{color:#fff;border-color:var(--border);border-bottom-color:var(--bg-card);background:var(--bg-card)}
.wiz-tab-num{
  width:20px;height:20px;border-radius:3px;
  border:1px solid currentColor;
  display:flex;align-items:center;justify-content:center;
  font-size:.34rem;flex-shrink:0;
}
.wiz-tab.done .wiz-tab-num{background:rgba(68,255,170,.15);border-color:var(--green)}

.modal-body{padding:16px 18px;overflow-y:auto;flex:1}
.modal-body::-webkit-scrollbar{width:4px}
.modal-body::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}

.modal-footer{
  padding:12px 18px;border-top:2px solid var(--border-light);
  display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;
  flex-shrink:0;background:rgba(9,5,26,.4);
}

/* Form fields */
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px}
.form-grid.single{grid-template-columns:1fr}
.form-group{display:flex;flex-direction:column;gap:5px}
.form-label{font-family:'Press Start 2P',monospace;font-size:.44rem;color:rgba(255,255,255,.6);text-shadow:var(--px-s)}
.form-input,.form-select,.form-textarea{
  padding:10px 12px;
  background:var(--bg-input);
  border:2px solid var(--border);
  border-radius:4px;
  box-shadow:inset 2px 2px 0 rgba(0,0,0,.35),2px 2px 0 rgba(0,0,0,.2);
  font-family:'VT323',monospace;font-size:1.28rem;
  outline:none;color:#fff;width:100%;
  transition:.15s;
}
.form-input:focus,.form-select:focus,.form-textarea:focus{border-color:var(--accent);box-shadow:inset 2px 2px 0 rgba(0,0,0,.35),2px 2px 0 rgba(0,0,0,.2),0 0 0 2px rgba(180,77,255,.15)}
.form-textarea{resize:vertical;min-height:96px;line-height:1.45}
.form-select{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23b44dff'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 10px center}
.form-hint{font-family:'VT323',monospace;font-size:1.1rem;color:rgba(255,255,255,.35);line-height:1.45}
.form-hint.warn{color:var(--yellow)}
.char-count{font-family:'VT323',monospace;font-size:1.05rem;color:rgba(255,255,255,.3)}
.char-count.ok{color:var(--green)}

/* Agent summary box */
.agent-summary{
  background:var(--bg-surface);border:1px solid var(--border);border-radius:5px;
  padding:12px 14px;margin-top:12px;
}
.agent-summary-title{font-family:'Press Start 2P',monospace;font-size:.5rem;color:rgba(255,255,255,.5);text-shadow:var(--px-s);margin-bottom:10px}
.summary-row{display:flex;gap:8px;margin-bottom:7px;align-items:flex-start}
.summary-row:last-child{margin-bottom:0}
.summary-key{font-family:'Press Start 2P',monospace;font-size:.37rem;color:rgba(255,255,255,.4);min-width:120px;padding-top:2px;flex-shrink:0}
.summary-val{font-family:'VT323',monospace;font-size:1.2rem;color:rgba(255,255,255,.8);line-height:1.35}
.summary-val.accent{color:var(--accent-bright)}

/* Step 2 specific */
.step2-agent-pill{
  display:inline-flex;align-items:center;gap:8px;
  padding:8px 12px;background:var(--bg-surface);border:1px solid var(--border);border-radius:4px;
  margin-bottom:12px;
}
.step2-agent-pill .pill-avatar{
  width:26px;height:26px;border-radius:3px;
  background:linear-gradient(135deg,var(--accent),var(--accent2));
  display:flex;align-items:center;justify-content:center;
  font-family:'Press Start 2P',monospace;font-size:.45rem;text-shadow:var(--px-s);
}
.step2-agent-pill .pill-name{font-family:'Press Start 2P',monospace;font-size:.46rem;color:#fff;text-shadow:var(--px-s)}
.step2-agent-pill .pill-note{font-family:'VT323',monospace;font-size:1.08rem;color:rgba(255,255,255,.35);margin-left:4px}

.provider-card{
  background:var(--bg-surface);border:1px solid var(--border);border-radius:5px;
  padding:12px 14px;margin-bottom:10px;
}
.provider-card-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;gap:10px;flex-wrap:wrap}
.provider-name{font-family:'Press Start 2P',monospace;font-size:.52rem;text-shadow:var(--px-s)}
.provider-badge{
  padding:3px 8px;border-radius:3px;font-family:'Press Start 2P',monospace;font-size:.36rem;border:1px solid;
}
.badge-connected{border-color:rgba(68,255,170,.4);background:rgba(68,255,170,.1);color:var(--green)}
.badge-experimental{border-color:rgba(255,189,46,.35);background:rgba(255,189,46,.07);color:var(--yellow)}
.badge-stable{border-color:rgba(68,170,255,.35);background:rgba(68,170,255,.07);color:var(--blue)}
.badge-mock{border-color:rgba(255,255,255,.2);background:rgba(255,255,255,.05);color:rgba(255,255,255,.5)}
.provider-meta{font-family:'VT323',monospace;font-size:1.16rem;color:rgba(255,255,255,.5);margin-bottom:8px;line-height:1.45}
.provider-actions{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}

.attempt-box{
  background:rgba(180,77,255,.05);border:1px solid rgba(180,77,255,.2);border-radius:4px;
  padding:10px 12px;margin:8px 0;font-family:'VT323',monospace;font-size:1.12rem;
}
.attempt-row{display:flex;justify-content:space-between;gap:8px;margin-bottom:4px;flex-wrap:wrap}
.attempt-row:last-child{margin-bottom:0}
.attempt-label{color:rgba(255,255,255,.4);font-size:1rem}
.attempt-val{color:rgba(255,255,255,.8);word-break:break-all}
.attempt-status{display:flex;align-items:center;gap:6px;margin-bottom:8px}
.status-dot{width:7px;height:7px;border-radius:50%;background:var(--yellow);box-shadow:0 0 6px var(--yellow);flex-shrink:0}
.status-dot.green{background:var(--green);box-shadow:0 0 6px var(--green)}
.status-label{font-family:'Press Start 2P',monospace;font-size:.38rem;color:rgba(255,255,255,.55)}

.fallback-box{
  background:var(--bg-input);border:2px solid var(--border);border-radius:4px;
  padding:10px 12px;margin-top:10px;
}
.fallback-title{font-family:'Press Start 2P',monospace;font-size:.48rem;color:rgba(255,255,255,.55);text-shadow:var(--px-s);margin-bottom:6px}
.fallback-desc{font-family:'VT323',monospace;font-size:1.14rem;color:rgba(255,255,255,.42);line-height:1.45;margin-bottom:8px}
.fallback-input{width:100%;padding:8px 10px;background:var(--bg);border:2px solid var(--border);border-radius:4px;font-family:'VT323',monospace;font-size:1.2rem;outline:none;color:#fff}
.fallback-input:focus{border-color:var(--accent)}

.how-list{counter-reset:how;margin:8px 0}
.how-item{display:flex;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.05)}
.how-item:last-child{border-bottom:none}
.how-num{font-family:'Press Start 2P',monospace;font-size:.42rem;color:var(--accent);flex-shrink:0;padding-top:2px}
.how-text{font-family:'VT323',monospace;font-size:1.12rem;color:rgba(255,255,255,.65);line-height:1.45}

.upload-area{
  border:2px dashed rgba(255,255,255,.2);border-radius:4px;padding:18px;
  text-align:center;cursor:pointer;transition:.2s;margin-bottom:8px;
}
.upload-area:hover{border-color:rgba(180,77,255,.5);background:rgba(180,77,255,.05)}
.upload-icon{font-family:'Press Start 2P',monospace;font-size:1.2rem;margin-bottom:8px;display:block}
.upload-text{font-family:'VT323',monospace;font-size:1.2rem;color:rgba(255,255,255,.45)}

.op-summary{
  background:var(--bg);border:2px solid var(--border);border-radius:5px;
  padding:12px 14px;margin-top:12px;
}
.op-summary-title{font-family:'Press Start 2P',monospace;font-size:.48rem;color:rgba(255,255,255,.45);text-shadow:var(--px-s);margin-bottom:10px;display:flex;align-items:center;gap:6px}
.op-summary-title::before{content:'▶';font-size:.28rem;color:var(--accent)}

.divider{height:1px;background:var(--border-light);margin:12px 0}
.section-label{font-family:'Press Start 2P',monospace;font-size:.44rem;color:rgba(255,255,255,.45);text-shadow:var(--px-s);margin-bottom:8px;display:flex;align-items:center;gap:6px}
.section-label::before{content:'';display:inline-block;width:6px;height:6px;background:var(--accent);border-radius:1px}

/* Modal-specific button boost */
.modal .btn{font-size:.5rem;padding:10px 13px}
.modal .btn-sm{font-size:.44rem;padding:8px 11px}
.modal .btn-xs{font-size:.4rem;padding:7px 9px}

@media(max-width:980px){
  .agents-layout{grid-template-columns:1fr}
  .agents-list{max-height:300px}
}
@media(max-width:640px){
  .page-hdr{padding:14px 14px 10px}
  .page-body{padding:10px}
  .actions .btn{font-size:.33rem;padding:8px 9px}
  .tab{font-size:.29rem;padding:7px 8px}
  .form-grid{grid-template-columns:1fr}
  .modal{max-height:95vh}
}
</style>
</head>
<body>

<?php include __DIR__ . '/topbar.php'; ?>
<?php include __DIR__ . '/sidebar.php'; ?>

<main class="main" id="mainContent">
  <div class="page-hdr">
    <div>
      <div class="page-title">Agentes</div>
      <div class="page-desc">Gerenciar espacos de trabalho, ferramentas e identidades de agentes.</div>
    </div>
    <button class="btn btn-primary" id="createAgentBtn" type="button">+ Criar Agente</button>
  </div>

  <div class="page-body">
    <div class="agents-layout">
      <section class="card">
        <div class="card-hdr">
          <div>
            <div class="card-title">Agents</div>
            <div class="card-sub"><span id="agentsConfigured">29</span> configured.</div>
          </div>
          <button class="btn" id="refreshAgentsBtn" type="button">Refresh</button>
        </div>
        <div class="agents-list" id="agentsList"></div>
      </section>

      <section class="card">
        <div class="agent-head">
          <div class="agent-id-wrap">
            <div class="agent-avatar" id="agentAvatar">R</div>
            <div>
              <div class="agent-id" id="agentTitle">main</div>
              <div class="agent-blurb">Agent workspace and routing.</div>
            </div>
          </div>
          <div class="meta-tags">
            <span class="meta-tag" id="agentWorkspaceTag">main</span>
            <span class="meta-tag default" id="agentIdentityTag">default</span>
          </div>
        </div>

        <div class="tabs" id="agentTabs">
          <button class="tab active" type="button">Overview</button>
          <button class="tab" type="button">Files</button>
          <button class="tab" type="button">Tools</button>
          <button class="tab" type="button">Skills</button>
          <button class="tab" type="button">Channels</button>
          <button class="tab" type="button">Cron Jobs</button>
        </div>

        <div class="section">
          <div class="section-hdr">
            <div>
              <div class="section-title">Skills</div>
              <div class="section-desc">Per-agent skill allowlist e workspace skills. <span id="skillsRatio">62/62</span></div>
            </div>
            <div class="actions">
              <button class="btn" type="button">Use All</button>
              <button class="btn" type="button">Disable All</button>
              <button class="btn" type="button">Reload Config</button>
              <button class="btn" type="button">Refresh</button>
              <button class="btn btn-primary" type="button">Save</button>
            </div>
          </div>

          <div class="notice">
            All skills are enabled. Disabling any skill will create a per-agent allowlist.
          </div>

          <div class="filter-row">
            <input class="filter-input" id="skillFilterInput" type="text" placeholder="Filter">
            <div class="filter-count" id="shownCount">62 shown</div>
          </div>

          <div class="group-title">
            <span>Workspace Skills <span id="workspaceCount">11</span></span>
          </div>
          <div class="skill-list" id="workspaceSkillsList"></div>

          <div class="group-title">
            <span>Built-in Skills 51</span>
          </div>
          <div class="builtin-box">
            Built-in runtime skills are available for this agent. This view is focused on workspace-level skills.
          </div>
        </div>
      </section>
    </div>
  </div>
</main>

<!-- ═══════════════════════════════════════════
     MODAL 1 — Provisionar Agente (Passo 1)
═══════════════════════════════════════════ -->
<div class="modal-overlay" id="modalStep1">
  <div class="modal">
    <div class="modal-hdr">
      <div class="modal-title-wrap">
        <div class="modal-title">Provisionar agente</div>
        <div class="modal-subtitle">Criar novo agente</div>
        <div class="modal-desc">Primeiro voce salva os dados do agente. Em seguida a VEXUSCLAW abre o passo de modelo para gerar o link do OpenAI Codex/ChatGPT OAuth ou conectar via API key.</div>
      </div>
      <button class="modal-close" id="closeModal1" type="button">✕</button>
    </div>

    <div class="modal-wizard-tabs">
      <div class="wiz-tab active" id="wiz1tab1">
        <div class="wiz-tab-num">1</div>
        Dados do agente
      </div>
      <div class="wiz-tab" id="wiz1tab2">
        <div class="wiz-tab-num">2</div>
        Modelo e conexao
      </div>
    </div>

    <div class="modal-body">
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">Nome do agente</label>
          <input class="form-input" id="newAgentName" type="text" placeholder="ex: vendas-pro" autocomplete="off">
          <div class="form-hint">Minimo de 4 caracteres. Atual: <span id="nameLen">0</span>.</div>
        </div>
        <div class="form-group">
          <label class="form-label">Funcao principal</label>
          <select class="form-select" id="newAgentRole">
            <option value="">Selecionar...</option>
            <option value="sales">Vendas e CRM</option>
            <option value="support">Suporte ao cliente</option>
            <option value="dev">Desenvolvimento</option>
            <option value="ops">Operacoes</option>
            <option value="content">Conteudo e marketing</option>
            <option value="finance">Financeiro</option>
            <option value="custom">Personalizado</option>
          </select>
        </div>
      </div>

      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">Estilo de conversa</label>
          <select class="form-select" id="newAgentStyle">
            <option value="direct">Direto e operacional</option>
            <option value="formal">Formal e preciso</option>
            <option value="friendly">Amigavel e proativo</option>
            <option value="technical">Tecnico e detalhado</option>
            <option value="concise">Conciso</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Como ele deve te chamar?</label>
          <input class="form-input" id="newAgentCallMe" type="text" placeholder="Padrao do workspace">
        </div>
      </div>

      <div class="form-grid single">
        <div class="form-group">
          <label class="form-label">Descricao curta</label>
          <input class="form-input" id="newAgentDesc" type="text" placeholder="Uma linha descrevendo o agente">
        </div>
      </div>

      <div class="form-grid single">
        <div class="form-group">
          <label class="form-label">Instrucoes base do agente</label>
          <textarea class="form-textarea" id="newAgentInstructions" placeholder="Defina o comportamento, tom, limites e objetivos deste agente..."></textarea>
        </div>
      </div>

      <div class="agent-summary" id="agentSummary">
        <div class="agent-summary-title">Resumo do agente</div>
        <div class="summary-row">
          <div class="summary-key">Nome</div>
          <div class="summary-val accent" id="sumName">A definir</div>
        </div>
        <div class="summary-row">
          <div class="summary-key">Funcao</div>
          <div class="summary-val" id="sumRole">A definir</div>
        </div>
        <div class="summary-row">
          <div class="summary-key">Estilo</div>
          <div class="summary-val" id="sumStyle">Direto e operacional</div>
        </div>
        <div class="summary-row">
          <div class="summary-key">Como te chama</div>
          <div class="summary-val" id="sumCallMe">Padrao do workspace</div>
        </div>
        <div class="divider"></div>
        <div class="summary-row">
          <div class="summary-key">Provider</div>
          <div class="summary-val" id="sumProvider">ChatGPT OAuth / teste ChatGPT</div>
        </div>
        <div style="margin-top:8px">
          <div class="notice" style="margin-bottom:0;font-size:.95rem">
            Ao salvar, a VEXUSCLAW abre o proximo passo para voce conectar o modelo do workspace que esse agente vai usar.
          </div>
        </div>
      </div>
    </div>

    <div class="modal-footer">
      <button class="btn" id="cancelModal1" type="button">Fechar</button>
      <button class="btn btn-primary" id="goToStep2Btn" type="button">Criar agente e abrir modelo ▶</button>
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════════════
     MODAL 2 — Conectar Modelo (Passo 2)
═══════════════════════════════════════════ -->
<div class="modal-overlay" id="modalStep2">
  <div class="modal" style="max-width:720px">
    <div class="modal-hdr">
      <div class="modal-title-wrap">
        <div class="modal-title" id="step2Title">Editar agente</div>
        <div class="modal-subtitle">Provisionar agente</div>
        <div class="modal-desc">Primeiro voce salva os dados do agente. Em seguida a VEXUSCLAW abre o passo de modelo para gerar o link do OpenAI Codex/ChatGPT OAuth ou conectar via API key.</div>
      </div>
      <button class="modal-close" id="closeModal2" type="button">✕</button>
    </div>

    <div class="modal-wizard-tabs">
      <div class="wiz-tab done" id="wiz2tab1">
        <div class="wiz-tab-num">✓</div>
        Dados do agente
      </div>
      <div class="wiz-tab active" id="wiz2tab2">
        <div class="wiz-tab-num">2</div>
        Modelo e conexao
      </div>
    </div>

    <div class="modal-body">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;flex-wrap:wrap">
        <div class="notice" style="margin-bottom:0;flex:1;font-size:.95rem">
          <b style="font-family:'Press Start 2P',monospace;font-size:.44rem">Passo 2 de 2 · Conectar modelo do agente</b><br><br>
          O agente <span id="step2AgentName" style="color:var(--accent-bright);font-family:'Press Start 2P',monospace;font-size:.42rem"></span> ja foi salvo. Agora gere o link do ChatGPT / OpenAI Codex ou conecte uma API key oficial para esse workspace.
        </div>
      </div>

      <div class="notice notice-yellow" style="margin-bottom:12px;font-size:.95rem">
        Dica operacional: se o callback automatico nao concluir, use o campo de fallback manual logo ao lado para colar a URL retornada pelo provedor.
      </div>

      <div class="step2-agent-pill">
        <div class="pill-avatar" id="step2PillAvatar">A</div>
        <div class="pill-name" id="step2PillName">agente</div>
        <div class="pill-note">O provider e do workspace. Depois de conectado, este agente passa a usar o provider primario real do Mission Control.</div>
      </div>

      <!-- Provider real -->
      <div class="section-label">Provider real atual</div>
      <div class="provider-card" id="agentCurrentProviderCard">
        <div class="provider-card-hdr">
          <div class="provider-name" id="agentCurrentProviderName">ChatGPT OAuth · teste ChatGPT · status connected</div>
          <span class="provider-badge badge-connected" id="agentCurrentProviderBadge">connected</span>
        </div>
      </div>

      <!-- ChatGPT sign-in -->
      <div class="section-label">ChatGPT sign-in</div>
      <div class="provider-card">
        <div class="provider-card-hdr">
          <div class="provider-name">Entrar com ChatGPT / OpenAI Codex <span style="font-size:.32rem;color:rgba(255,255,255,.4)">(experimental)</span></div>
          <span class="provider-badge badge-experimental">Experimental</span>
        </div>
        <div class="provider-meta">
          Fluxo experimental baseado em OAuth Authorization Code + PKCE no estilo Codex/OpenClaw. A API key continua sendo o caminho estavel. Este login usa callback local e, em servidor remoto, normalmente depende do fallback manual.
        </div>

        <div class="notice notice-green" id="agentOauthNotice" style="margin-bottom:10px;font-size:.95rem">
          <b style="font-family:'Press Start 2P',monospace;font-size:.3rem">Provider ChatGPT OAuth conectado</b><br>
          teste ChatGPT · uprisetechbr@gmail.com · status connected<br>
          Expira em: 2026-03-22T23:12:11.747Z
        </div>

        <div class="notice notice-yellow" style="margin-bottom:10px;font-size:.95rem">
          <b style="font-family:'Press Start 2P',monospace;font-size:.28rem">Experimental</b> — A API key continua sendo o modo estavel. Esse fluxo usa sign-in tipo Codex/ChatGPT com callback local, pode exigir copiar a URL final manualmente e depende do navegador e da OpenAI aceitarem o fluxo atual.<br><br>
          Redirect atual do experimento: <code style="background:rgba(0,0,0,.3);padding:2px 5px;border-radius:2px;font-family:'VT323',monospace">http://localhost:1455/auth/callback</code><br><br>
          Em VPS/remoto, o caminho mais fiel ao OpenClaw e abrir o login no seu navegador local. Se quiser tentar captura automatica, use port-forward da porta 1455.
        </div>

        <div class="section-label" style="margin-top:12px">Como usar agora</div>
        <div class="how-list">
          <div class="how-item"><div class="how-num">1</div><div class="how-text">Gere o link.</div></div>
          <div class="how-item"><div class="how-num">2</div><div class="how-text">Abra o login em nova aba.</div></div>
          <div class="how-item"><div class="how-num">3</div><div class="how-text">Se a OpenAI terminar em localhost/127.0.0.1, copie a URL final do navegador.</div></div>
          <div class="how-item"><div class="how-num">4</div><div class="how-text">Cole abaixo em Concluir callback manual.</div></div>
        </div>

        <div class="provider-actions" style="margin-top:10px">
          <button class="btn btn-primary btn-sm" type="button" id="generateLinkBtn">Gerar link de conexao</button>
          <button class="btn btn-sm" type="button" id="openOauthWindowBtn">Abrir login em nova aba</button>
        </div>

        <div class="attempt-box" id="attemptBox" style="display:none">
          <div class="attempt-status">
            <div class="status-dot" id="attemptDot"></div>
            <div class="status-label" id="attemptStatusLabel">Estado atual: aguardando</div>
          </div>
          <div class="attempt-row">
            <span class="attempt-label">Attempt ID:</span>
            <span class="attempt-val" id="attemptId">—</span>
          </div>
          <div class="attempt-row">
            <span class="attempt-label">Expira em:</span>
            <span class="attempt-val" id="attemptExpiry">—</span>
          </div>
          <div class="provider-actions" style="margin-top:10px">
            <button class="btn btn-xs" type="button" id="copyOauthLinkBtn">Copiar link de conexao</button>
            <button class="btn btn-xs" type="button" id="copyOauthRedirectBtn">Copiar redirect local</button>
            <button class="btn btn-xs" type="button" id="openOauthAttemptBtn">Abrir em nova aba</button>
          </div>
        </div>

        <div class="fallback-box" style="margin-top:10px">
          <div class="fallback-title">Fallback manual</div>
          <div class="fallback-desc">
            Esse experimento segue o modelo local do Codex/OpenClaw. Se a aba terminar em <code style="font-family:'VT323',monospace;background:rgba(0,0,0,.3);padding:1px 4px;border-radius:2px">http://localhost:1455/auth/callback</code> ou equivalente em localhost/127.0.0.1, copie a URL final completa e cole aqui. Tambem aceitamos <code style="font-family:'VT323',monospace;background:rgba(0,0,0,.3);padding:1px 4px;border-radius:2px">code#state</code> ou <code style="font-family:'VT323',monospace;background:rgba(0,0,0,.3);padding:1px 4px;border-radius:2px">code=...&state=...</code>. Se voce colar so o code, usamos a tentativa atual quando possivel.
          </div>
          <input class="fallback-input" id="manualCallbackInput" type="text" placeholder="Cole aqui a URL ou code retornado...">
          <div style="margin-top:8px">
            <button class="btn btn-green btn-sm" id="completeManualCallbackBtn" type="button">Concluir callback manual</button>
          </div>
        </div>
      </div>

      <!-- Session import -->
      <div class="section-label">ChatGPT/Codex session import</div>
      <div class="provider-card">
        <div class="provider-card-hdr">
          <div class="provider-name">Importar sessao ChatGPT / OpenAI Codex <span style="font-size:.32rem;color:rgba(255,255,255,.4)">(experimental)</span></div>
          <span class="provider-badge badge-experimental">Experimental</span>
        </div>
        <div class="provider-meta">Alternativa pratica ao callback localhost. Importe um auth.json ja autenticado do Codex/ChatGPT e salve a sessao OAuth no workspace.</div>

        <div class="notice" style="margin-bottom:10px;font-size:.9rem">
          O arquivo e enviado ao backend apenas para extrair e criptografar a sessao. Nunca exibimos tokens de volta na UI e o modo estavel continua sendo OpenAI API key.
        </div>

        <div class="section-label">Formato aceito</div>
        <div class="notice notice-blue" style="margin-bottom:10px;font-size:.9rem">
          JSON completo do <code style="font-family:'VT323',monospace">~/.codex/auth.json</code> com <code style="font-family:'VT323',monospace">auth_mode</code>, <code style="font-family:'VT323',monospace">tokens.access_token</code>, <code style="font-family:'VT323',monospace">tokens.refresh_token</code>, <code style="font-family:'VT323',monospace">tokens.id_token</code> e <code style="font-family:'VT323',monospace">tokens.account_id</code> opcional.
        </div>

        <div class="upload-area" id="uploadArea">
          <span class="upload-icon">📁</span>
          <div class="upload-text">Upload auth.json</div>
          <div class="upload-text" style="font-size:.85rem;margin-top:4px;color:rgba(255,255,255,.25)">Clique ou arraste o arquivo aqui</div>
        </div>

        <div style="margin-bottom:8px">
          <div class="section-label">Colar JSON manualmente</div>
          <textarea class="form-textarea" id="sessionJsonInput" style="font-size:1.16rem;font-family:'VT323',monospace" placeholder='{"auth_mode":"oauth","tokens":{"access_token":"..."}}'></textarea>
          <button class="btn btn-sm" id="importSessionJsonBtn" style="margin-top:6px" type="button">Importar JSON colado</button>
        </div>
      </div>

      <!-- API key -->
      <div class="section-label">OpenAI API key</div>
      <div class="provider-card">
        <div class="provider-card-hdr">
          <div class="provider-name">OpenAI API key</div>
          <span class="provider-badge badge-stable">Modo oficial estavel</span>
        </div>
        <div class="form-group">
          <input class="form-input" id="openAiApiKeyInput" type="password" placeholder="sk-...">
        </div>
        <div class="provider-actions" style="margin-top:10px">
          <button class="btn btn-sm" id="testOpenAiBtn" type="button">Testar chave OpenAI</button>
          <button class="btn btn-primary btn-sm" id="connectOpenAiBtn" type="button">Conectar OpenAI agora</button>
        </div>
      </div>

      <!-- Operational summary -->
      <div class="op-summary">
        <div class="op-summary-title">Resumo operacional</div>
        <div class="summary-row">
          <div class="summary-key">Agente</div>
          <div class="summary-val accent" id="opSumAgent">—</div>
        </div>
        <div class="summary-row">
          <div class="summary-key">Provider real</div>
          <div class="summary-val">ChatGPT OAuth / teste ChatGPT</div>
        </div>
        <div class="summary-row">
          <div class="summary-key">Fallback atual</div>
          <div class="summary-val" style="color:rgba(255,255,255,.5)">VEXUSCLAW Mock Provider (mock)</div>
        </div>
        <div class="summary-row">
          <div class="summary-key">Proximo passo</div>
          <div class="summary-val" style="color:var(--yellow)">Gerar o link do ChatGPT ou colar a URL no fallback manual se o retorno automatico falhar.</div>
        </div>
      </div>
    </div>

    <div class="modal-footer">
      <button class="btn" id="backToStep1Btn" type="button">◀ Voltar para dados do agente</button>
      <button class="btn" id="closeModal2Footer" type="button">Fechar</button>
    </div>
  </div>
</div>

<script>
/* ═══ DATA ═══ */
const AGENTS = [
  { id:'main', handle:'main', workspace:'main', identity:'default', icon:'bot' },
  { id:'2', handle:'2', workspace:'2', identity:'default', icon:'bot' },
  { id:'adssadasda', handle:'adssadasda', workspace:'adssadasda', identity:'default', icon:'bot' },
  { id:'alana', handle:'alana', workspace:'alana', identity:'default', icon:'bot' },
  { id:'alanaextratoragmailcom', handle:'alanaextratoragmailcom', workspace:'alanaextratoragmailcom', identity:'default', icon:'bot' },
  { id:'Claw', handle:'claw', workspace:'claw', identity:'default', icon:'C' },
  { id:'conta_oauth_171811', handle:'conta_oauth_171811', workspace:'conta_oauth_171811', identity:'default', icon:'bot' },
  { id:'cs', handle:'cs', workspace:'cs', identity:'default', icon:'bot' },
  { id:'cu', handle:'cu', workspace:'cu', identity:'default', icon:'bot' },
  { id:'debug-oauth-url-228726', handle:'debug-oauth-url-228726', workspace:'debug-oauth-url-228726', identity:'default', icon:'bot' },
  { id:'debug-pkce-match', handle:'debug-pkce-match', workspace:'debug-pkce-match', identity:'default', icon:'bot' },
  { id:'debug-pkce-match-2', handle:'debug-pkce-match-2', workspace:'debug-pkce-match-2', identity:'default', icon:'bot' },
  { id:'debug-pkce-match-4', handle:'debug-pkce-match-4', workspace:'debug-pkce-match-4', identity:'default', icon:'bot' },
  { id:'diagnostico', handle:'diagnostico', workspace:'diagnostico', identity:'default', icon:'bot' },
  { id:'gpt-plus-1', handle:'gpt-plus-1', workspace:'gpt-plus-1', identity:'default', icon:'bot' },
  { id:'gpt-plus-2', handle:'gpt-plus-2', workspace:'gpt-plus-2', identity:'default', icon:'bot' },
  { id:'gpt-plus-3', handle:'gpt-plus-3', workspace:'gpt-plus-3', identity:'default', icon:'bot' },
  { id:'gpt-plus-4', handle:'gpt-plus-4', workspace:'gpt-plus-4', identity:'default', icon:'bot' },
  { id:'iiptv1708gmailcom', handle:'iiptv1708gmailcom', workspace:'iiptv1708gmailcom', identity:'default', icon:'bot' },
  { id:'pussy', handle:'pussy', workspace:'pussy', identity:'default', icon:'bot' },
  { id:'teste', handle:'teste', workspace:'teste', identity:'default', icon:'bot' },
  { id:'teste-agora', handle:'teste-agora', workspace:'teste-agora', identity:'default', icon:'bot' },
  { id:'teste-auth-99', handle:'teste-auth-99', workspace:'teste-auth-99', identity:'default', icon:'bot' },
  { id:'teste-auth-link', handle:'teste-auth-link', workspace:'teste-auth-link', identity:'default', icon:'bot' },
  { id:'teste-debug', handle:'teste-debug', workspace:'teste-debug', identity:'default', icon:'bot' },
  { id:'teste-login-fix', handle:'teste-login-fix', workspace:'teste-login-fix', identity:'default', icon:'bot' },
  { id:'teste-wizard', handle:'teste-wizard', workspace:'teste-wizard', identity:'default', icon:'bot' },
  { id:'teste2', handle:'teste2', workspace:'teste2', identity:'default', icon:'bot' },
  { id:'tigrincuzudogmailcom', handle:'tigrincuzudogmailcom', workspace:'tigrincuzudogmailcom', identity:'default', icon:'bot' }
];

const WORKSPACE_SKILLS = [
  { name:'api-gateway', desc:'Connect to 100+ APIs (Google Workspace, Microsoft 365, GitHub, Notion, Slack, Airtable, HubSpot, etc.) with managed OAuth. Use this skill when users want to interact with external services.', scope:'openclaw-workspaceeligible', state:'eligible' },
  { name:'automation-workflows', desc:'Design and implement automation workflows to save time and scale operations as a solopreneur. Use when identifying repetitive tasks to automate, building workflows across tools, setting up triggers and actions.', scope:'openclaw-workspaceeligible', state:'eligible' },
  { name:'frontend-design', desc:'Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, or applications.', scope:'openclaw-workspaceeligible', state:'eligible' },
  { name:'frontend-design-ultimate', desc:'Create distinctive, production-grade static sites with React, Tailwind CSS, and shadcn/ui. Generates bold, memorable designs from plain text requirements.', scope:'openclaw-workspaceeligible', state:'eligible' },
  { name:'google-drive', desc:'Google Drive API integration with managed OAuth. List, search, create, and manage files and folders.', scope:'openclaw-workspaceeligible', state:'eligible' },
  { name:'google-sheets', desc:'Google Sheets API integration with managed OAuth. Read and write spreadsheet data, create sheets, apply formatting, and manage ranges.', scope:'openclaw-workspaceeligible', state:'eligible' },
  { name:'n8n', desc:'Manage n8n workflows and automations via API. Use when working with n8n workflows, executions, automation tasks, activation/deactivation.', scope:'openclaw-workspaceblocked', state:'blocked', missing:'Missing: env:N8N_API_KEY, env:N8N_BASE_URL' },
  { name:'opencode-controller', desc:'Control and operate Opencode via slash commands. Use this skill to manage sessions, select models, switch agents (plan/build).', scope:'openclaw-workspaceeligible', state:'eligible' },
  { name:'security-auditor', desc:'Use when reviewing code for security vulnerabilities, implementing authentication flows, auditing OWASP Top 10, configuring CORS/CSP headers.', scope:'openclaw-workspaceeligible', state:'eligible' },
  { name:'ui-ux-pro-max', desc:'UI/UX design intelligence and implementation guidance for polished interfaces. Use for UX flows, information architecture, visual style direction.', scope:'openclaw-workspaceeligible', state:'eligible' },
  { name:'woocommerce', desc:'WooCommerce REST API integration with managed OAuth. Access products, orders, customers, coupons, shipping, taxes, reports, and webhooks.', scope:'openclaw-workspaceeligible', state:'eligible' }
];

const ROLE_LABELS = {
  '':'A definir','sales':'Vendas e CRM','support':'Suporte ao cliente','dev':'Desenvolvimento',
  'ops':'Operacoes','content':'Conteudo e marketing','finance':'Financeiro','custom':'Personalizado'
};
const STYLE_LABELS = {
  'direct':'Direto e operacional','formal':'Formal e preciso','friendly':'Amigavel e proativo',
  'technical':'Tecnico e detalhado','concise':'Conciso'
};

let selectedAgent = AGENTS[0];

/* ═══ AGENTS LIST ═══ */
function iconMarkup(iconType){ return iconType==='C'?'C':'&#129302;'; }

function renderAgents(){
  const wrap = document.getElementById('agentsList');
  wrap.innerHTML='';
  AGENTS.forEach((agent)=>{
    const row=document.createElement('button');
    row.type='button';
    row.className='agent-row'+(agent.id===selectedAgent.id?' active':'');
    row.innerHTML=
      '<div class="agent-icon'+(agent.icon==='bot'?' bot':'')+'">'+iconMarkup(agent.icon)+'</div>'+
      '<div class="agent-text">'+
      '<div class="agent-name">'+esc(agent.id)+'</div>'+
      '<div class="agent-sub">'+esc(agent.handle)+'</div>'+
      '</div>';
    row.addEventListener('click',()=>{ selectedAgent=agent; renderAgents(); syncAgentDetail(); });
    wrap.appendChild(row);
  });
  document.getElementById('agentsConfigured').textContent=String(AGENTS.length);
}

function syncAgentDetail(){
  document.getElementById('agentTitle').textContent=selectedAgent.id;
  document.getElementById('agentWorkspaceTag').textContent=selectedAgent.workspace;
  document.getElementById('agentIdentityTag').textContent=selectedAgent.identity;
  document.getElementById('agentAvatar').innerHTML=iconMarkup(selectedAgent.icon);
}

/* ═══ SKILLS ═══ */
function renderWorkspaceSkills(){
  const filter=(document.getElementById('skillFilterInput').value||'').toLowerCase().trim();
  const filtered=WORKSPACE_SKILLS.filter((skill)=>{
    if(!filter){return true;}
    return skill.name.toLowerCase().includes(filter)||skill.desc.toLowerCase().includes(filter)||skill.scope.toLowerCase().includes(filter);
  });
  const list=document.getElementById('workspaceSkillsList');
  list.innerHTML='';
  filtered.forEach((skill)=>{
    const item=document.createElement('div');
    item.className='skill-item';
    item.innerHTML=
      '<div class="skill-name">'+esc(skill.name)+'</div>'+
      '<div class="skill-desc">'+esc(skill.desc)+'</div>'+
      '<div class="skill-meta">'+
      '<span class="skill-tag scope">'+esc(skill.scope)+'</span>'+
      '<span class="skill-tag '+skill.state+'">'+skill.state+'</span>'+
      '</div>'+
      (skill.missing?'<div class="skill-missing">'+esc(skill.missing)+'</div>':'');
    list.appendChild(item);
  });
  document.getElementById('workspaceCount').textContent=String(filtered.length);
  document.getElementById('shownCount').textContent=String(filtered.length+51)+' shown';
}

/* ═══ TABS ═══ */
function bindTabs(){
  document.querySelectorAll('#agentTabs .tab').forEach((tab)=>{
    tab.addEventListener('click',()=>{
      document.querySelectorAll('#agentTabs .tab').forEach((x)=>x.classList.remove('active'));
      tab.classList.add('active');
    });
  });
}

/* ═══ REFRESH ═══ */
function bindRefresh(){
  const btn=document.getElementById('refreshAgentsBtn');
  btn.addEventListener('click',()=>{
    btn.textContent='Refreshing...'; btn.disabled=true;
    setTimeout(()=>{ btn.textContent='Refresh'; btn.disabled=false; renderAgents(); renderWorkspaceSkills(); },550);
  });
}

/* ═══ MODAL UTILITIES ═══ */
function openModal(id){ document.getElementById(id).classList.add('open'); }
function closeModal(id){ document.getElementById(id).classList.remove('open'); }

function closeAll(){ closeModal('modalStep1'); closeModal('modalStep2'); }

document.getElementById('closeModal1').addEventListener('click',()=>closeModal('modalStep1'));
document.getElementById('cancelModal1').addEventListener('click',()=>closeModal('modalStep1'));
document.getElementById('closeModal2').addEventListener('click',()=>closeAll());
document.getElementById('closeModal2Footer').addEventListener('click',()=>closeAll());
document.getElementById('backToStep1Btn').addEventListener('click',()=>{
  closeModal('modalStep2');
  openModal('modalStep1');
});

// Close on overlay click
['modalStep1','modalStep2'].forEach((id)=>{
  document.getElementById(id).addEventListener('click',(e)=>{
    if(e.target===document.getElementById(id)){ closeModal(id); }
  });
});

/* ═══ MODAL 1: live summary ═══ */
const nameInput=document.getElementById('newAgentName');
const roleSelect=document.getElementById('newAgentRole');
const styleSelect=document.getElementById('newAgentStyle');
const callMeInput=document.getElementById('newAgentCallMe');

function updateSummary(){
  const name=nameInput.value.trim();
  const len=nameInput.value.length;
  document.getElementById('nameLen').textContent=String(len);
  document.getElementById('sumName').textContent=name||'A definir';
  document.getElementById('sumRole').textContent=ROLE_LABELS[roleSelect.value]||'A definir';
  document.getElementById('sumStyle').textContent=STYLE_LABELS[styleSelect.value]||'Direto e operacional';
  document.getElementById('sumCallMe').textContent=callMeInput.value.trim()||'Padrao do workspace';
}

[nameInput,callMeInput].forEach((el)=>el.addEventListener('input',updateSummary));
[roleSelect,styleSelect].forEach((el)=>el.addEventListener('change',updateSummary));

/* ═══ OPEN CREATE MODAL ═══ */
document.getElementById('createAgentBtn').addEventListener('click',()=>{
  // reset form
  nameInput.value=''; roleSelect.value=''; styleSelect.value='direct';
  callMeInput.value='';
  document.getElementById('newAgentDesc').value='';
  document.getElementById('newAgentInstructions').value='';
  document.getElementById('nameLen').textContent='0';
  updateSummary();
  openModal('modalStep1');
});

/* ═══ GO TO STEP 2 ═══ */
document.getElementById('goToStep2Btn').addEventListener('click',()=>{
  const name=nameInput.value.trim();
  if(name.length<4){
    nameInput.focus();
    nameInput.style.borderColor='var(--red)';
    setTimeout(()=>{nameInput.style.borderColor='';},1200);
    return;
  }

  // populate step 2
  const initial=name.charAt(0).toUpperCase();
  document.getElementById('step2Title').textContent='Editar '+name;
  document.getElementById('step2AgentName').textContent=name;
  document.getElementById('step2PillAvatar').textContent=initial;
  document.getElementById('step2PillName').textContent=name;
  document.getElementById('opSumAgent').textContent=name;

  closeModal('modalStep1');
  openModal('modalStep2');
});

/* ═══ GENERATE LINK BUTTON (attempt simulation) ═══ */
document.getElementById('generateLinkBtn').addEventListener('click',()=>{
  const box=document.getElementById('attemptBox');
  box.style.display='block';

  function makeUUID(){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,(c)=>{
      const r=Math.random()*16|0;
      return (c==='x'?r:(r&0x3|0x8)).toString(16);
    });
  }
  const expiry=new Date(Date.now()+35*60*1000).toISOString();
  document.getElementById('attemptId').textContent=makeUUID();
  document.getElementById('attemptExpiry').textContent=expiry;
  document.getElementById('attemptStatusLabel').textContent='Estado atual: aguardando';
  document.getElementById('attemptDot').className='status-dot';
  document.getElementById('generateLinkBtn').textContent='Regenerar link';
});

/* ═══ ESC to close ═══ */
document.addEventListener('keydown',(e)=>{
  if(e.key==='Escape'){
    if(document.getElementById('modalStep2').classList.contains('open')){ closeAll(); }
    else if(document.getElementById('modalStep1').classList.contains('open')){ closeModal('modalStep1'); }
  }
});

/* ═══ UTIL ═══ */
function esc(v){
  return String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

/* ═══ INIT ═══ */
document.getElementById('skillFilterInput').addEventListener('input',renderWorkspaceSkills);
bindTabs();
bindRefresh();
renderAgents();
syncAgentDetail();
renderWorkspaceSkills();
updateSummary();
</script>
<script src="/assets/vexus-api.js"></script>
<script src="/assets/vexus-auth.js"></script>
<script src="/assets/pages/agents.js"></script>
<script src="vexus-ui.js"></script>
</body>
</html>
