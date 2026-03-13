<!DOCTYPE html>
<html lang="pt-BR" style="color-scheme:dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>VexusClaw — Planos</title>
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323:wght@400&display=swap" rel="stylesheet">
<style>
:root{
  --bg:#07030f;--bg-card:#0d0820;--bg-surface:#110c28;--bg-input:#0a0618;
  --border:#251a55;--border-light:#1a1035;
  --accent:#b44dff;--accent2:#8a2be2;--accent-bright:#d088ff;
  --green:#44ffaa;--yellow:#ffbd2e;--red:#ff4444;--cyan:#44ddff;
  --gold:#ffcc44;
  --px-s:-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000;
  --px-sa:-1px -1px 0 #3d0070,1px -1px 0 #3d0070,-1px 1px 0 #3d0070,1px 1px 0 #3d0070;
  --px-g:-1px -1px 0 #1a4a00,1px -1px 0 #1a4a00,-1px 1px 0 #1a4a00,1px 1px 0 #1a4a00;
  --px-gold:-1px -1px 0 #5a3a00,1px -1px 0 #5a3a00,-1px 1px 0 #5a3a00,1px 1px 0 #5a3a00;
}
*{margin:0;padding:0;box-sizing:border-box;color:#fff}
html{scroll-behavior:smooth}
body{background:var(--bg);font-family:'VT323',monospace;font-size:17px;min-height:100vh;overflow-x:hidden}
body::before{content:'';position:fixed;inset:0;z-index:0;pointer-events:none;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect x='0' y='0' width='1' height='1' fill='%23ffffff' opacity='0.007'/%3E%3Crect x='2' y='2' width='1' height='1' fill='%23ffffff' opacity='0.007'/%3E%3C/svg%3E");background-size:4px 4px}

/* ── SCANLINES ── */
body::after{content:'';position:fixed;inset:0;z-index:0;pointer-events:none;
  background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.03) 2px,rgba(0,0,0,.03) 4px)}

/* ── TOPBAR ── */
.topbar{position:sticky;top:0;z-index:100;height:50px;
  background:rgba(7,3,15,.97);border-bottom:2px solid var(--border);
  display:flex;align-items:center;padding:0 24px;gap:12px}
.tb-logo{display:flex;align-items:center;gap:9px}
.tb-logo img{width:24px;height:24px;image-rendering:pixelated;filter:drop-shadow(0 0 6px rgba(180,77,255,.6))}
.tb-logo-name{font-family:'Press Start 2P',monospace;font-size:.62rem;text-shadow:var(--px-sa)}
.tb-logo-sub{font-family:'Press Start 2P',monospace;font-size:.3rem;color:rgba(255,255,255,.28);letter-spacing:2px}
.logo-blink{color:var(--accent-bright);animation:blink .9s step-end infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
.tb-right{margin-left:auto;display:flex;align-items:center;gap:8px}
.tb-nav-link{font-family:'Press Start 2P',monospace;font-size:.38rem;color:rgba(255,255,255,.35);
  text-decoration:none;padding:5px 8px;border-radius:3px;transition:.15s}
.tb-nav-link:hover{color:var(--accent-bright);background:rgba(180,77,255,.08)}
.tb-nav-link.active{color:var(--accent-bright);text-shadow:var(--px-sa)}

/* ── PAGE WRAP ── */
.page{position:relative;z-index:1;padding-bottom:80px}

/* ── HERO ── */
.hero{text-align:center;padding:60px 24px 48px;position:relative}
.hero::before{content:'';position:absolute;inset:0;
  background:radial-gradient(ellipse 70% 60% at 50% 0%,rgba(180,77,255,.12) 0%,transparent 70%);pointer-events:none}
.hero-eyebrow{display:inline-flex;align-items:center;gap:8px;
  padding:5px 14px;background:rgba(180,77,255,.09);border:1px solid rgba(180,77,255,.25);
  border-radius:3px;margin-bottom:22px;
  font-family:'Press Start 2P',monospace;font-size:.36rem;color:var(--accent-bright);text-shadow:var(--px-sa)}
.hero-eyebrow::before{content:'';width:6px;height:6px;border-radius:1px;
  background:var(--accent);box-shadow:0 0 6px var(--accent);animation:pulse 1.4s ease-in-out infinite}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.85)}}
.hero-title{font-family:'Press Start 2P',monospace;font-size:1.4rem;text-shadow:var(--px-sa);
  line-height:1.7;margin-bottom:14px}
.hero-title span{color:var(--accent-bright)}
.hero-sub{font-family:'VT323',monospace;font-size:1.35rem;color:rgba(255,255,255,.45);max-width:520px;margin:0 auto 28px}

/* billing toggle */
.billing-toggle{display:inline-flex;align-items:center;gap:10px;
  background:var(--bg-surface);border:2px solid var(--border);border-radius:5px;padding:6px 10px;
  font-family:'Press Start 2P',monospace;font-size:.34rem}
.billing-toggle span{color:rgba(255,255,255,.5);cursor:pointer;transition:.2s;padding:4px 8px;border-radius:3px}
.billing-toggle span.on{color:var(--green);background:rgba(68,255,170,.1);text-shadow:var(--px-g)}
.billing-badge{padding:2px 7px;background:rgba(68,255,170,.12);border:1px solid rgba(68,255,170,.25);
  border-radius:2px;font-family:'Press Start 2P',monospace;font-size:.28rem;color:var(--green);margin-left:2px}

/* ── PLANS GRID ── */
.plans-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;
  max-width:1060px;margin:0 auto;padding:0 24px}
@media(max-width:900px){.plans-grid{grid-template-columns:1fr;max-width:480px}}

/* ── PLAN CARD ── */
.plan-card{
  background:var(--bg-card);border:2px solid var(--border);border-radius:8px;
  box-shadow:5px 5px 0 rgba(0,0,0,.6);
  display:flex;flex-direction:column;
  position:relative;overflow:hidden;
  transition:transform .2s,box-shadow .2s;
}
.plan-card:hover{transform:translate(-2px,-3px);box-shadow:7px 8px 0 rgba(0,0,0,.6)}

/* top dashed line */
.plan-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;
  background:repeating-linear-gradient(90deg,var(--c1,var(--accent)) 0,var(--c1,var(--accent)) 4px,transparent 4px,transparent 8px);
  opacity:.5}

/* POPULAR highlight */
.plan-card.popular{border-color:var(--accent);box-shadow:5px 5px 0 #3d0070}
.plan-card.popular:hover{box-shadow:7px 8px 0 #3d0070}
.plan-card.popular::before{opacity:1}

/* ELITE */
.plan-card.elite{--c1:var(--gold);border-color:rgba(255,204,68,.35);box-shadow:5px 5px 0 rgba(90,58,0,.7)}
.plan-card.elite:hover{box-shadow:7px 8px 0 rgba(90,58,0,.7)}
.plan-card.elite::before{opacity:.9}

/* badge */
.plan-badge{
  position:absolute;top:14px;right:14px;
  padding:3px 9px;border-radius:2px;
  font-family:'Press Start 2P',monospace;font-size:.3rem;
}
.plan-badge.hot{background:linear-gradient(135deg,var(--accent),var(--accent2));
  box-shadow:2px 2px 0 #3d0070;animation:badge-pulse 2s ease-in-out infinite}
.plan-badge.best{background:linear-gradient(135deg,#c8960c,#8a6200);
  box-shadow:2px 2px 0 rgba(0,0,0,.5)}
@keyframes badge-pulse{0%,100%{opacity:1}50%{opacity:.75}}

.plan-hdr{padding:24px 20px 18px}
.plan-tier{font-family:'Press Start 2P',monospace;font-size:.36rem;
  color:rgba(255,255,255,.35);letter-spacing:1px;margin-bottom:8px}
.plan-name{font-family:'Press Start 2P',monospace;font-size:.84rem;line-height:1.5;
  text-shadow:var(--px-s);margin-bottom:4px}
.plan-name.color-accent{color:var(--accent-bright);text-shadow:var(--px-sa)}
.plan-name.color-green{color:var(--green);text-shadow:var(--px-g)}
.plan-name.color-gold{color:var(--gold);text-shadow:var(--px-gold)}
.plan-desc{font-family:'VT323',monospace;font-size:1.1rem;color:rgba(255,255,255,.38);line-height:1.45;margin-top:6px}

.plan-price-wrap{padding:16px 20px;border-top:1px solid var(--border-light);border-bottom:1px solid var(--border-light);
  background:rgba(0,0,0,.2)}
.plan-price-row{display:flex;align-items:baseline;gap:5px}
.plan-currency{font-family:'Press Start 2P',monospace;font-size:.48rem;color:rgba(255,255,255,.45);margin-bottom:2px}
.plan-amount{font-family:'Press Start 2P',monospace;font-size:1.5rem;text-shadow:var(--px-s);line-height:1}
.plan-amount.color-accent{color:var(--accent-bright);text-shadow:var(--px-sa)}
.plan-amount.color-green{color:var(--green);text-shadow:var(--px-g)}
.plan-amount.color-gold{color:var(--gold);text-shadow:var(--px-gold)}
.plan-period{font-family:'VT323',monospace;font-size:1.1rem;color:rgba(255,255,255,.35)}
.plan-annual{font-family:'VT323',monospace;font-size:1rem;color:rgba(255,255,255,.3);margin-top:4px}
.plan-annual .save{color:var(--green)}

/* features */
.plan-features{padding:16px 20px;flex:1;display:flex;flex-direction:column;gap:0}
.feat-section-lbl{font-family:'Press Start 2P',monospace;font-size:.3rem;
  color:rgba(255,255,255,.25);letter-spacing:1px;margin:10px 0 8px}
.feat-section-lbl:first-child{margin-top:0}
.feat-row{display:flex;align-items:flex-start;gap:8px;padding:5px 0;
  border-bottom:1px solid rgba(255,255,255,.04)}
.feat-row:last-child{border-bottom:none}
.feat-icon{font-family:'Press Start 2P',monospace;font-size:.36rem;flex-shrink:0;margin-top:2px;width:14px;text-align:center}
.feat-icon.yes{color:var(--green);text-shadow:var(--px-g)}
.feat-icon.no{color:rgba(255,255,255,.18)}
.feat-icon.star{color:var(--gold);text-shadow:var(--px-gold)}
.feat-text{font-family:'VT323',monospace;font-size:1.1rem;color:rgba(255,255,255,.6);line-height:1.45}
.feat-text strong{color:rgba(255,255,255,.88);font-style:normal;font-weight:normal}
.feat-text .tag{display:inline-block;padding:1px 5px;border-radius:2px;
  font-family:'Press Start 2P',monospace;font-size:.26rem;margin-left:4px;vertical-align:middle}
.tag-new{background:rgba(68,255,170,.12);border:1px solid rgba(68,255,170,.3);color:var(--green)}
.tag-hot{background:rgba(180,77,255,.15);border:1px solid rgba(180,77,255,.3);color:var(--accent-bright)}
.tag-soon{background:rgba(255,189,46,.1);border:1px solid rgba(255,189,46,.25);color:var(--yellow)}

/* cta */
.plan-footer{padding:16px 20px 20px}
.plan-cta{
  display:block;width:100%;
  padding:12px;
  border-radius:4px;
  font-family:'Press Start 2P',monospace;font-size:.46rem;
  text-align:center;text-decoration:none;
  cursor:pointer;border:none;
  transition:.2s;line-height:1.5;
  box-shadow:3px 3px 0 rgba(0,0,0,.4);
}
.plan-cta:hover{transform:translate(-1px,-2px)}
.plan-cta:active{transform:translate(1px,1px)}
.cta-default{background:var(--bg-surface);border:2px solid var(--border);color:rgba(255,255,255,.7)}
.cta-default:hover{border-color:var(--accent);background:rgba(180,77,255,.1)}
.cta-accent{background:linear-gradient(135deg,var(--accent),var(--accent2));
  border:2px solid var(--accent2);box-shadow:3px 3px 0 #3d0070;color:#fff}
.cta-accent:hover{box-shadow:5px 5px 0 #3d0070}
.cta-gold{background:linear-gradient(135deg,#c8960c,#8a6200);
  border:2px solid #a37a00;box-shadow:3px 3px 0 rgba(0,0,0,.5);color:#fff}
.cta-gold:hover{box-shadow:5px 5px 0 rgba(0,0,0,.5)}
.plan-cta-note{font-family:'VT323',monospace;font-size:.95rem;color:rgba(255,255,255,.28);
  text-align:center;margin-top:8px}

/* ── DIVIDER ── */
.px-div{height:2px;background:repeating-linear-gradient(90deg,var(--accent) 0,var(--accent) 4px,transparent 4px,transparent 8px);opacity:.1;margin:40px 0 0}

/* ── COMPARE TABLE ── */
.compare-wrap{max-width:1060px;margin:32px auto 0;padding:0 24px}
.compare-title{font-family:'Press Start 2P',monospace;font-size:.64rem;text-shadow:var(--px-s);
  margin-bottom:18px;text-align:center}
.compare-table{width:100%;border-collapse:collapse;border:2px solid var(--border);border-radius:6px;overflow:hidden}
.compare-table th{font-family:'Press Start 2P',monospace;font-size:.34rem;
  padding:12px 14px;background:var(--bg-surface);border-bottom:2px solid var(--border);text-align:left}
.compare-table th:not(:first-child){text-align:center}
.compare-table td{font-family:'VT323',monospace;font-size:1.05rem;
  padding:9px 14px;border-bottom:1px solid var(--border-light);color:rgba(255,255,255,.6)}
.compare-table td:not(:first-child){text-align:center}
.compare-table tr:last-child td{border-bottom:none}
.compare-table tr:hover td{background:rgba(180,77,255,.04)}
.compare-table .row-lbl{color:rgba(255,255,255,.55);font-size:1.05rem}
.ct-yes{color:var(--green);font-family:'Press Start 2P',monospace;font-size:.36rem;text-shadow:var(--px-g)}
.ct-no{color:rgba(255,255,255,.18);font-family:'Press Start 2P',monospace;font-size:.36rem}
.ct-val{color:rgba(255,255,255,.8);font-family:'VT323',monospace;font-size:1.1rem}
.ct-th-1{color:rgba(255,255,255,.55)}
.ct-th-2{color:var(--accent-bright);text-shadow:var(--px-sa)}
.ct-th-3{color:var(--gold);text-shadow:var(--px-gold)}
@media(max-width:700px){.compare-wrap{display:none}}

/* ── FAQ ── */
.faq-wrap{max-width:680px;margin:40px auto 0;padding:0 24px}
.faq-title{font-family:'Press Start 2P',monospace;font-size:.64rem;text-shadow:var(--px-s);
  margin-bottom:18px;text-align:center}
.faq-item{border:2px solid var(--border);border-radius:5px;overflow:hidden;margin-bottom:8px;
  background:var(--bg-card)}
.faq-q{display:flex;align-items:center;justify-content:space-between;
  padding:12px 16px;cursor:pointer;transition:.15s;gap:12px}
.faq-q:hover{background:rgba(180,77,255,.06)}
.faq-q-text{font-family:'Press Start 2P',monospace;font-size:.38rem;line-height:1.6;text-shadow:var(--px-s)}
.faq-arrow{font-family:'Press Start 2P',monospace;font-size:.38rem;color:var(--accent);
  flex-shrink:0;transition:transform .2s}
.faq-item.open .faq-arrow{transform:rotate(90deg)}
.faq-a{display:none;padding:0 16px 14px;font-family:'VT323',monospace;font-size:1.1rem;
  color:rgba(255,255,255,.5);line-height:1.55;border-top:1px solid var(--border-light)}
.faq-a p{padding-top:12px}
.faq-item.open .faq-a{display:block}

/* ── FOOTER CTA ── */
.footer-cta{max-width:560px;margin:52px auto 0;padding:0 24px;text-align:center}
.footer-cta-box{background:var(--bg-card);border:2px solid var(--border);border-radius:8px;
  padding:30px 24px;position:relative;overflow:hidden;box-shadow:5px 5px 0 rgba(0,0,0,.5)}
.footer-cta-box::before{content:'';position:absolute;inset:0;
  background:radial-gradient(ellipse 80% 60% at 50% 0%,rgba(180,77,255,.07) 0%,transparent 70%);pointer-events:none}
.footer-cta-title{font-family:'Press Start 2P',monospace;font-size:.7rem;text-shadow:var(--px-sa);
  margin-bottom:10px;line-height:1.7;color:var(--accent-bright)}
.footer-cta-sub{font-family:'VT323',monospace;font-size:1.15rem;color:rgba(255,255,255,.4);
  margin-bottom:20px;line-height:1.45}
.footer-cta-btn{display:inline-block;padding:13px 28px;
  background:linear-gradient(135deg,var(--accent),var(--accent2));
  border:2px solid var(--accent2);border-radius:4px;box-shadow:4px 4px 0 #3d0070;
  font-family:'Press Start 2P',monospace;font-size:.48rem;cursor:pointer;
  text-decoration:none;transition:.2s}
.footer-cta-btn:hover{box-shadow:6px 6px 0 #3d0070;transform:translate(-1px,-2px)}

/* pixel star decoration */
.star-deco{position:absolute;font-family:'Press Start 2P',monospace;font-size:.5rem;pointer-events:none;opacity:0;animation:star-appear 3s ease-in-out infinite}
@keyframes star-appear{0%{opacity:0;transform:scale(.5)}10%{opacity:.6}90%{opacity:.6}100%{opacity:0;transform:scale(1.2)}}
</style>
</head>
<body>

<!-- TOPBAR -->
<header class="topbar">
  <div class="tb-logo">
    <img src="https://community.aseprite.org/uploads/default/original/2X/0/0eff0e4064297cbbe7383108c2f7322c758a5e1f.gif" alt="" draggable="false">
    <div>
      <div class="tb-logo-name">VexusClaw<span class="logo-blink">_</span></div>
      <div class="tb-logo-sub">GATEWAY AI</div>
    </div>
  </div>
  <div class="tb-right">
    <a href="#" class="tb-nav-link">Home</a>
    <a href="#" class="tb-nav-link">Integrações</a>
    <a href="#" class="tb-nav-link active">Planos</a>
    <a href="#" class="tb-nav-link">Login</a>
  </div>
</header>

<div class="page">

  <!-- HERO -->
  <div class="hero">
    <div class="hero-eyebrow">▶ ESCOLHA SEU PLANO</div>
    <div class="hero-title">Potência de <span>IA</span><br>no seu preço</div>
    <div class="hero-sub">Sem contratos. Cancele quando quiser. Comece em minutos.</div>
    <div class="billing-toggle">
      <span class="on" id="btnMonthly" onclick="setBilling('monthly')">Mensal</span>
      <span id="btnAnnual" onclick="setBilling('annual')">Anual <span class="billing-badge">-20%</span></span>
    </div>
  </div>

  <!-- PLANS -->
  <div class="plans-grid">

    <!-- STARTER -->
    <div class="plan-card" id="card-starter">
      <div class="plan-hdr">
        <div class="plan-tier">PLANO 01</div>
        <div class="plan-name color-green">Starter</div>
        <div class="plan-desc">Para quem está começando com automação de IA e quer explorar sem limites.</div>
      </div>
      <div class="plan-price-wrap">
        <div class="plan-price-row">
          <span class="plan-currency">R$</span>
          <span class="plan-amount color-green" id="price-starter">297,00</span>
          <span class="plan-period">/mês</span>
        </div>
        <div class="plan-annual" id="note-starter">Cobrado mensalmente</div>
      </div>
      <div class="plan-features">
        <div class="feat-section-lbl">GATEWAY</div>
        <div class="feat-row"><span class="feat-icon yes">✓</span><span class="feat-text"><strong>1 instância</strong> gateway</span></div>
        <div class="feat-row"><span class="feat-icon yes">✓</span><span class="feat-text"><strong>5 agentes</strong> simultâneos</span></div>
        <div class="feat-row"><span class="feat-icon yes">✓</span><span class="feat-text"><strong>50k tokens</strong>/dia</span></div>
        <div class="feat-row"><span class="feat-icon yes">✓</span><span class="feat-text">Sessões ilimitadas</span></div>
        <div class="feat-section-lbl">CANAIS</div>
        <div class="feat-row"><span class="feat-icon yes">✓</span><span class="feat-text">WhatsApp <span class="tag tag-new">NEW</span></span></div>
        <div class="feat-row"><span class="feat-icon no">✗</span><span class="feat-text" style="opacity:.35">Telegram</span></div>
        <div class="feat-row"><span class="feat-icon no">✗</span><span class="feat-text" style="opacity:.35">Discord</span></div>
        <div class="feat-section-lbl">SKILLS</div>
        <div class="feat-row"><span class="feat-icon yes">✓</span><span class="feat-text"><strong>20</strong> built-in skills</span></div>
        <div class="feat-row"><span class="feat-icon no">✗</span><span class="feat-text" style="opacity:.35">Workspace skills</span></div>
        <div class="feat-section-lbl">SUPORTE</div>
        <div class="feat-row"><span class="feat-icon yes">✓</span><span class="feat-text">Comunidade + Discord</span></div>
        <div class="feat-row"><span class="feat-icon no">✗</span><span class="feat-text" style="opacity:.35">Suporte prioritário</span></div>
      </div>
      <div class="plan-footer">
        <button class="plan-cta cta-default" onclick="selectPlan('starter')">Começar agora</button>
        <div class="plan-cta-note">Sem cartão para testar 7 dias</div>
      </div>
    </div>

    <!-- PRO (popular) -->
    <div class="plan-card popular" id="card-pro">
      <div class="plan-badge hot">✦ POPULAR</div>
      <div class="plan-hdr">
        <div class="plan-tier">PLANO 02</div>
        <div class="plan-name color-accent">Pro</div>
        <div class="plan-desc">O favorito dos devs. Todos os canais, mais agentes e suporte rápido.</div>
      </div>
      <div class="plan-price-wrap">
        <div class="plan-price-row">
          <span class="plan-currency">R$</span>
          <span class="plan-amount color-accent" id="price-pro">398,90</span>
          <span class="plan-period">/mês</span>
        </div>
        <div class="plan-annual" id="note-pro">Cobrado mensalmente</div>
      </div>
      <div class="plan-features">
        <div class="feat-section-lbl">GATEWAY</div>
        <div class="feat-row"><span class="feat-icon yes">✓</span><span class="feat-text"><strong>3 instâncias</strong> gateway</span></div>
        <div class="feat-row"><span class="feat-icon yes">✓</span><span class="feat-text"><strong>15 agentes</strong> simultâneos</span></div>
        <div class="feat-row"><span class="feat-icon yes">✓</span><span class="feat-text"><strong>200k tokens</strong>/dia</span></div>
        <div class="feat-row"><span class="feat-icon yes">✓</span><span class="feat-text">Sessões ilimitadas</span></div>
        <div class="feat-section-lbl">CANAIS</div>
        <div class="feat-row"><span class="feat-icon yes">✓</span><span class="feat-text">WhatsApp <span class="tag tag-new">NEW</span></span></div>
        <div class="feat-row"><span class="feat-icon yes">✓</span><span class="feat-text">Telegram <span class="tag tag-hot">BETA</span></span></div>
        <div class="feat-row"><span class="feat-icon yes">✓</span><span class="feat-text">Discord <span class="tag tag-hot">BETA</span></span></div>
        <div class="feat-section-lbl">SKILLS</div>
        <div class="feat-row"><span class="feat-icon yes">✓</span><span class="feat-text"><strong>Todas</strong> as built-in skills</span></div>
        <div class="feat-row"><span class="feat-icon yes">✓</span><span class="feat-text"><strong>5</strong> workspace skills</span></div>
        <div class="feat-section-lbl">SUPORTE</div>
        <div class="feat-row"><span class="feat-icon yes">✓</span><span class="feat-text">Email prioritário</span></div>
        <div class="feat-row"><span class="feat-icon yes">✓</span><span class="feat-text">Onboarding assistido</span></div>
      </div>
      <div class="plan-footer">
        <button class="plan-cta cta-accent" onclick="selectPlan('pro')">Assinar Pro</button>
        <div class="plan-cta-note">Mais popular entre nossos clientes</div>
      </div>
    </div>

    <!-- ELITE -->
    <div class="plan-card elite" id="card-elite">
      <div class="plan-badge best">★ ELITE</div>
      <div class="plan-hdr">
        <div class="plan-tier">PLANO 03</div>
        <div class="plan-name color-gold">Elite</div>
        <div class="plan-desc">Poder total. Sem limites de agentes, modelos premium e suporte dedicado.</div>
      </div>
      <div class="plan-price-wrap">
        <div class="plan-price-row">
          <span class="plan-currency">R$</span>
          <span class="plan-amount color-gold" id="price-elite">594,90</span>
          <span class="plan-period">/mês</span>
        </div>
        <div class="plan-annual" id="note-elite">Cobrado mensalmente</div>
      </div>
      <div class="plan-features">
        <div class="feat-section-lbl">GATEWAY</div>
        <div class="feat-row"><span class="feat-icon star">★</span><span class="feat-text"><strong>Ilimitado</strong> instâncias</span></div>
        <div class="feat-row"><span class="feat-icon star">★</span><span class="feat-text"><strong>Ilimitado</strong> agentes</span></div>
        <div class="feat-row"><span class="feat-icon star">★</span><span class="feat-text"><strong>1M tokens</strong>/dia</span></div>
        <div class="feat-row"><span class="feat-icon star">★</span><span class="feat-text">Sessões + memória persistente</span></div>
        <div class="feat-section-lbl">CANAIS</div>
        <div class="feat-row"><span class="feat-icon star">★</span><span class="feat-text">Todos os canais</span></div>
        <div class="feat-row"><span class="feat-icon star">★</span><span class="feat-text">iMessage <span class="tag tag-soon">EM BREVE</span></span></div>
        <div class="feat-row"><span class="feat-icon star">★</span><span class="feat-text">Signal <span class="tag tag-soon">EM BREVE</span></span></div>
        <div class="feat-section-lbl">SKILLS</div>
        <div class="feat-row"><span class="feat-icon star">★</span><span class="feat-text"><strong>Todas</strong> as skills</span></div>
        <div class="feat-row"><span class="feat-icon star">★</span><span class="feat-text"><strong>Ilimitado</strong> workspace skills</span></div>
        <div class="feat-section-lbl">SUPORTE</div>
        <div class="feat-row"><span class="feat-icon star">★</span><span class="feat-text">Gerente de conta dedicado</span></div>
        <div class="feat-row"><span class="feat-icon star">★</span><span class="feat-text">SLA 4h resposta</span></div>
      </div>
      <div class="plan-footer">
        <button class="plan-cta cta-gold" onclick="selectPlan('elite')">Assinar Elite</button>
        <div class="plan-cta-note">Para equipes e empresas</div>
      </div>
    </div>

  </div>

  <!-- COMPARE TABLE -->
  <div class="px-div"></div>
  <div class="compare-wrap">
    <div class="compare-title">Comparativo completo</div>
    <table class="compare-table">
      <thead>
        <tr>
          <th class="ct-th-1">Recurso</th>
          <th class="ct-th-2" style="color:var(--green)">Starter</th>
          <th class="ct-th-2">Pro ✦</th>
          <th class="ct-th-3">Elite ★</th>
        </tr>
      </thead>
      <tbody>
        <tr><td class="row-lbl">Instâncias</td><td class="ct-val">1</td><td class="ct-val">3</td><td class="ct-val">Ilimitado</td></tr>
        <tr><td class="row-lbl">Agentes</td><td class="ct-val">5</td><td class="ct-val">15</td><td class="ct-val">Ilimitado</td></tr>
        <tr><td class="row-lbl">Tokens/dia</td><td class="ct-val">50k</td><td class="ct-val">200k</td><td class="ct-val">1M</td></tr>
        <tr><td class="row-lbl">WhatsApp</td><td class="ct-yes">✓</td><td class="ct-yes">✓</td><td class="ct-yes">✓</td></tr>
        <tr><td class="row-lbl">Telegram</td><td class="ct-no">✗</td><td class="ct-yes">✓</td><td class="ct-yes">✓</td></tr>
        <tr><td class="row-lbl">Discord</td><td class="ct-no">✗</td><td class="ct-yes">✓</td><td class="ct-yes">✓</td></tr>
        <tr><td class="row-lbl">Tarefas Cron</td><td class="ct-yes">✓</td><td class="ct-yes">✓</td><td class="ct-yes">✓</td></tr>
        <tr><td class="row-lbl">Workspace Skills</td><td class="ct-no">✗</td><td class="ct-val">5</td><td class="ct-val">Ilimitado</td></tr>
        <tr><td class="row-lbl">Memória persistente</td><td class="ct-no">✗</td><td class="ct-no">✗</td><td class="ct-yes">✓</td></tr>
        <tr><td class="row-lbl">Suporte</td><td class="ct-val">Comunidade</td><td class="ct-val">Email prio.</td><td class="ct-val">Dedicado</td></tr>
        <tr><td class="row-lbl">SLA resposta</td><td class="ct-no">—</td><td class="ct-val">24h</td><td class="ct-val">4h</td></tr>
      </tbody>
    </table>
  </div>

  <!-- FAQ -->
  <div class="px-div"></div>
  <div class="faq-wrap">
    <div class="faq-title">Perguntas frequentes</div>

    <div class="faq-item" onclick="toggleFaq(this)">
      <div class="faq-q"><span class="faq-q-text">Posso mudar de plano depois?</span><span class="faq-arrow">▶</span></div>
      <div class="faq-a"><p>Sim. Você pode fazer upgrade ou downgrade a qualquer momento direto no painel. Upgrades têm efeito imediato. Downgrades entram no próximo ciclo de cobrança.</p></div>
    </div>
    <div class="faq-item" onclick="toggleFaq(this)">
      <div class="faq-q"><span class="faq-q-text">O que acontece se eu atingir o limite de tokens?</span><span class="faq-arrow">▶</span></div>
      <div class="faq-a"><p>O gateway pausa novas requisições até o próximo reset diário à meia-noite (UTC-3). Você recebe um aviso no painel quando atingir 80% do limite. É possível adquirir pacotes extras sem mudar de plano.</p></div>
    </div>
    <div class="faq-item" onclick="toggleFaq(this)">
      <div class="faq-q"><span class="faq-q-text">Como funciona o período de teste?</span><span class="faq-arrow">▶</span></div>
      <div class="faq-a"><p>O plano Starter oferece 7 dias gratuitos sem necessidade de cartão. Para Pro e Elite o trial é de 3 dias com cartão de crédito — você não é cobrado se cancelar antes.</p></div>
    </div>
    <div class="faq-item" onclick="toggleFaq(this)">
      <div class="faq-q"><span class="faq-q-text">Aceita pagamento via Pix?</span><span class="faq-arrow">▶</span></div>
      <div class="faq-a"><p>Sim! Aceitamos Pix, cartão de crédito (Visa, Master, Amex) e boleto bancário para planos anuais. Todas as transações são processadas via Stripe com segurança PCI-DSS.</p></div>
    </div>
    <div class="faq-item" onclick="toggleFaq(this)">
      <div class="faq-q"><span class="faq-q-text">Posso hospedar o gateway on-premise?</span><span class="faq-arrow">▶</span></div>
      <div class="faq-a"><p>Sim, nos planos Pro e Elite você pode rodar o gateway na sua própria infraestrutura. A licença cobre o uso; o suporte à instalação está incluído no Elite e disponível como add-on no Pro.</p></div>
    </div>
  </div>

  <!-- FOOTER CTA -->
  <div class="footer-cta">
    <div class="footer-cta-box">
      <div class="footer-cta-title">Pronto para começar?</div>
      <div class="footer-cta-sub">Junte-se a centenas de devs usando VexusClaw para automatizar com IA.</div>
      <a href="#" class="footer-cta-btn">Criar conta grátis ▶</a>
    </div>
  </div>

</div><!-- /page -->

<script>
/* billing toggle */
var PRICES={
  starter:{monthly:'297,00',annual:'237,60'},
  pro:{monthly:'398,90',annual:'319,12'},
  elite:{monthly:'594,90',annual:'475,92'}
};
var billing='monthly';
function setBilling(mode){
  billing=mode;
  document.getElementById('btnMonthly').className=mode==='monthly'?'on':'';
  document.getElementById('btnAnnual').className=mode==='annual'?'on':'';
  ['starter','pro','elite'].forEach(function(p){
    document.getElementById('price-'+p).textContent=PRICES[p][mode];
    var note=document.getElementById('note-'+p);
    if(mode==='annual'){
      note.innerHTML='<span class="save">Economia de 20% no anual</span>';
    } else {
      note.textContent='Cobrado mensalmente';
    }
  });
}

/* faq */
function toggleFaq(el){el.classList.toggle('open')}

/* plan select */
function selectPlan(plan){
  var msgs={
    starter:'Plano Starter selecionado! Redirecionando para o checkout...',
    pro:'Plano Pro selecionado! Redirecionando para o checkout...',
    elite:'Plano Elite selecionado! Seu gerente de conta entrará em contato.'
  };
  toast(msgs[plan]);
}

/* toast */
function toast(msg){
  var el=document.createElement('div');
  el.style.cssText='position:fixed;bottom:24px;right:24px;z-index:999;padding:12px 18px;'
    +'background:#0d0820;border:2px solid var(--green);border-radius:4px;'
    +'font-family:"Press Start 2P",monospace;font-size:.38rem;color:var(--green);'
    +'box-shadow:4px 4px 0 rgba(0,0,0,.6);max-width:320px;line-height:1.6';
  el.textContent=msg;document.body.appendChild(el);
  setTimeout(function(){el.style.transition='opacity .3s';el.style.opacity='0';setTimeout(function(){el.remove()},300)},3000);
}

/* pixel stars deco */
var STARS=['✦','★','♦','▲','●'];
function spawnStar(){
  var s=document.createElement('div');s.className='star-deco';
  s.textContent=STARS[Math.floor(Math.random()*STARS.length)];
  s.style.left=Math.random()*100+'vw';
  s.style.top=(80+Math.random()*400)+'px';
  var colors=['var(--accent-bright)','var(--green)','var(--gold)','var(--cyan)'];
  s.style.color=colors[Math.floor(Math.random()*colors.length)];
  s.style.animationDelay=Math.random()*2+'s';
  s.style.animationDuration=(3+Math.random()*3)+'s';
  document.querySelector('.page').appendChild(s);
  setTimeout(function(){s.remove()},6000);
}
setInterval(spawnStar,800);
</script>
<script src="vexus-ui.js"></script>
</body>
</html>
