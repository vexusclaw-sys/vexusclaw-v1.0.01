<?php
$menuActive = 'plans';
?>
<!DOCTYPE html>
<html lang="pt-BR" style="color-scheme:dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>VexusClaw - Plans</title>
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap" rel="stylesheet">
<style>
:root{
  --bg:#07030f;--bg-card:#0d0820;--bg-surface:#110c28;--bg-sidebar:#09051a;--bg-input:#0a0618;
  --border:#251a55;--border-light:#1a1035;
  --accent:#b44dff;--accent2:#8a2be2;--accent-bright:#d088ff;
  --green:#44ffaa;--yellow:#ffbd2e;--gold:#ffcc44;--red:#ff4444;
  --px-s:-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000;
  --px-sa:-1px -1px 0 #3d0070,1px -1px 0 #3d0070,-1px 1px 0 #3d0070,1px 1px 0 #3d0070;
}
*{margin:0;padding:0;box-sizing:border-box;color:#fff}
html,body{height:100%;overflow:hidden}
body{background:var(--bg);font-family:'VT323',monospace}
button{font-family:inherit}
body::before{content:'';position:fixed;inset:0;z-index:0;pointer-events:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect x='0' y='0' width='1' height='1' fill='%23ffffff' opacity='0.007'/%3E%3Crect x='2' y='2' width='1' height='1' fill='%23ffffff' opacity='0.007'/%3E%3C/svg%3E");background-size:4px 4px}

.main{display:flex;flex-direction:column;overflow:hidden}
.page-hdr{padding:18px 24px 14px;border-bottom:2px solid var(--border);background:rgba(9,5,26,.55)}
.page-title{font-family:'Press Start 2P',monospace;font-size:.96rem;text-shadow:var(--px-s);margin-bottom:6px}
.page-desc{font-size:1.3rem;color:rgba(255,255,255,.42);line-height:1.4}
.page-body{padding:16px 18px 22px;flex:1;overflow:auto}
.page-body::-webkit-scrollbar{width:5px;height:5px}
.page-body::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}

.plans-grid{
  display:grid;
  grid-template-columns:repeat(3,minmax(280px,1fr));
  gap:14px;
  min-width:940px;
}
.plan-card{
  background:var(--bg-card);
  border:2px solid var(--border);
  border-radius:8px;
  box-shadow:4px 4px 0 rgba(0,0,0,.55);
  overflow:hidden;
  display:flex;
  flex-direction:column;
  position:relative;
}
.plan-card::before{
  content:'';
  position:absolute;
  top:0;left:0;right:0;height:2px;
  background:repeating-linear-gradient(90deg,var(--accent) 0,var(--accent) 4px,transparent 4px,transparent 8px);
  opacity:.28;
}
.plan-card.starter::before{background:repeating-linear-gradient(90deg,var(--green) 0,var(--green) 4px,transparent 4px,transparent 8px)}
.plan-card.elite::before{background:repeating-linear-gradient(90deg,var(--gold) 0,var(--gold) 4px,transparent 4px,transparent 8px)}
.plan-badge{
  position:absolute;top:12px;right:12px;
  padding:3px 7px;border-radius:3px;
  font-family:'Press Start 2P',monospace;font-size:.32rem;
}
.plan-badge.popular{background:linear-gradient(135deg,var(--accent),var(--accent2));box-shadow:2px 2px 0 #3d0070}
.plan-badge.elite{background:linear-gradient(135deg,#c8960c,#7a5500);box-shadow:2px 2px 0 rgba(0,0,0,.45)}
.plan-head{padding:18px 16px 14px}
.plan-tier{font-family:'Press Start 2P',monospace;font-size:.34rem;color:rgba(255,255,255,.35);margin-bottom:7px}
.plan-name{font-family:'Press Start 2P',monospace;font-size:.84rem;text-shadow:var(--px-s);margin-bottom:7px}
.plan-name.starter{color:var(--green)}
.plan-name.pro{color:var(--accent-bright)}
.plan-name.elite{color:var(--gold)}
.plan-desc{font-size:1.1rem;color:rgba(255,255,255,.42);line-height:1.4}
.plan-price{padding:12px 16px;border-top:1px solid var(--border-light);border-bottom:1px solid var(--border-light);background:rgba(0,0,0,.22)}
.price-line{display:flex;align-items:flex-end;gap:4px}
.price-currency{font-family:'Press Start 2P',monospace;font-size:.4rem;color:rgba(255,255,255,.4)}
.price-value{font-family:'Press Start 2P',monospace;font-size:1.38rem;line-height:1}
.price-value.starter{color:var(--green)}
.price-value.pro{color:var(--accent-bright)}
.price-value.elite{color:var(--gold)}
.price-period{font-size:1.02rem;color:rgba(255,255,255,.38)}
.price-note{font-size:.96rem;color:rgba(255,255,255,.28);margin-top:5px}
.feat-list{padding:12px 16px;display:flex;flex-direction:column;gap:6px;flex:1}
.feat{display:flex;gap:8px;align-items:flex-start}
.feat-mark{font-family:'Press Start 2P',monospace;font-size:.36rem;margin-top:4px;width:12px;flex-shrink:0}
.feat-mark.yes{color:var(--green)}
.feat-mark.star{color:var(--gold)}
.feat-text{font-size:1.08rem;color:rgba(255,255,255,.7);line-height:1.35}
.feat-text.muted{color:rgba(255,255,255,.35)}
.plan-foot{padding:12px 16px 16px}
.plan-btn{
  width:100%;
  padding:10px 12px;
  border-radius:4px;
  border:2px solid var(--border);
  background:var(--bg-surface);
  font-family:'Press Start 2P',monospace;
  font-size:.42rem;
  cursor:pointer;
  box-shadow:3px 3px 0 rgba(0,0,0,.45);
}
.plan-btn:hover{transform:translate(-1px,-1px)}
.plan-btn.pro{background:linear-gradient(135deg,var(--accent),var(--accent2));border-color:var(--accent2);box-shadow:3px 3px 0 #3d0070}
.plan-btn.elite{background:linear-gradient(135deg,#c8960c,#7a5500);border-color:#9b7100}
.plan-note{text-align:center;font-size:.95rem;color:rgba(255,255,255,.3);margin-top:7px}

@media(max-width:1100px){.plans-grid{min-width:900px}}
</style>
</head>
<body>
<?php include __DIR__ . '/topbar.php'; ?>
<?php include __DIR__ . '/sidebar.php'; ?>

<main class="main" id="mainContent">
  <div class="page-hdr">
    <div class="page-title">Plans</div>
    <div class="page-desc">Gerencie os planos e recursos disponiveis por nivel.</div>
  </div>

  <div class="page-body">
    <div class="plans-grid">
      <section class="plan-card starter">
        <div class="plan-head">
          <div class="plan-tier">PLANO 01</div>
          <div class="plan-name starter">Starter</div>
          <div class="plan-desc">Para quem esta comecando com automacao de IA.</div>
        </div>
        <div class="plan-price">
          <div class="price-line">
            <span class="price-currency">R$</span>
            <span class="price-value starter">297,00</span>
            <span class="price-period">/mes</span>
          </div>
          <div class="price-note">Cobrado mensalmente</div>
        </div>
        <div class="feat-list">
          <div class="feat"><span class="feat-mark yes">+</span><span class="feat-text">1 instancia gateway</span></div>
          <div class="feat"><span class="feat-mark yes">+</span><span class="feat-text">5 agentes simultaneos</span></div>
          <div class="feat"><span class="feat-mark yes">+</span><span class="feat-text">50k tokens por dia</span></div>
          <div class="feat"><span class="feat-mark yes">+</span><span class="feat-text">WhatsApp</span></div>
          <div class="feat"><span class="feat-mark yes">+</span><span class="feat-text">20 built-in skills</span></div>
          <div class="feat"><span class="feat-mark">-</span><span class="feat-text muted">Telegram / Discord</span></div>
        </div>
        <div class="plan-foot">
          <button class="plan-btn" type="button" onclick="goToCheckout('starter')">Comecar agora</button>
          <div class="plan-note">7 dias gratis sem cartao</div>
        </div>
      </section>

      <section class="plan-card">
        <div class="plan-badge popular">POPULAR</div>
        <div class="plan-head">
          <div class="plan-tier">PLANO 02</div>
          <div class="plan-name pro">Pro</div>
          <div class="plan-desc">Todos os canais, mais agentes e suporte rapido.</div>
        </div>
        <div class="plan-price">
          <div class="price-line">
            <span class="price-currency">R$</span>
            <span class="price-value pro">397,00</span>
            <span class="price-period">/mes</span>
          </div>
          <div class="price-note">Cobrado mensalmente</div>
        </div>
        <div class="feat-list">
          <div class="feat"><span class="feat-mark yes">+</span><span class="feat-text">3 instancias gateway</span></div>
          <div class="feat"><span class="feat-mark yes">+</span><span class="feat-text">15 agentes simultaneos</span></div>
          <div class="feat"><span class="feat-mark yes">+</span><span class="feat-text">200k tokens por dia</span></div>
          <div class="feat"><span class="feat-mark yes">+</span><span class="feat-text">WhatsApp, Telegram e Discord</span></div>
          <div class="feat"><span class="feat-mark yes">+</span><span class="feat-text">Todas as built-in skills</span></div>
          <div class="feat"><span class="feat-mark yes">+</span><span class="feat-text">5 workspace skills</span></div>
        </div>
        <div class="plan-foot">
          <button class="plan-btn pro" type="button" onclick="goToCheckout('pro')">Assinar Pro</button>
          <div class="plan-note">Mais popular entre clientes</div>
        </div>
      </section>

      <section class="plan-card elite">
        <div class="plan-badge elite">ELITE</div>
        <div class="plan-head">
          <div class="plan-tier">PLANO 03</div>
          <div class="plan-name elite">Elite</div>
          <div class="plan-desc">Poder total com suporte dedicado.</div>
        </div>
        <div class="plan-price">
          <div class="price-line">
            <span class="price-currency">R$</span>
            <span class="price-value elite">597,00</span>
            <span class="price-period">/mes</span>
          </div>
          <div class="price-note">Cobrado mensalmente</div>
        </div>
        <div class="feat-list">
          <div class="feat"><span class="feat-mark star">*</span><span class="feat-text">Instancias ilimitadas</span></div>
          <div class="feat"><span class="feat-mark star">*</span><span class="feat-text">Agentes ilimitados</span></div>
          <div class="feat"><span class="feat-mark star">*</span><span class="feat-text">1M tokens por dia</span></div>
          <div class="feat"><span class="feat-mark star">*</span><span class="feat-text">Todos os canais</span></div>
          <div class="feat"><span class="feat-mark star">*</span><span class="feat-text">Skills ilimitadas</span></div>
          <div class="feat"><span class="feat-mark star">*</span><span class="feat-text">SLA de 4h</span></div>
        </div>
        <div class="plan-foot">
          <button class="plan-btn elite" type="button" onclick="goToCheckout('elite')">Assinar Elite</button>
          <div class="plan-note">Para equipes e empresas</div>
        </div>
      </section>
    </div>
  </div>
</main>

<script>
function goToCheckout(plan){
  window.location.href='checkout.php?plan='+encodeURIComponent(plan);
}
</script>
<script src="vexus-ui.js"></script>
</body>
</html>
