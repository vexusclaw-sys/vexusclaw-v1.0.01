<!DOCTYPE html>
<html lang="pt-BR" style="color-scheme:dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>VexusClaw — Checkout</title>
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap" rel="stylesheet">
<style>
:root{
  --bg:#07030f;--bg-card:#0d0820;--bg-surface:#110c28;--bg-input:#0a0618;
  --border:#251a55;--border-light:#1a1035;
  --accent:#b44dff;--accent2:#8a2be2;--accent-bright:#d088ff;
  --green:#44ffaa;--yellow:#ffbd2e;--gold:#ffcc44;--red:#ff4444;
  --px-s:-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000;
  --px-sa:-1px -1px 0 #3d0070,1px -1px 0 #3d0070,-1px 1px 0 #3d0070,1px 1px 0 #3d0070;
  --px-g:-1px -1px 0 #1a4a00,1px -1px 0 #1a4a00,-1px 1px 0 #1a4a00,1px 1px 0 #1a4a00;
}
*{margin:0;padding:0;box-sizing:border-box;color:#fff}
html,body{min-height:100%;background:var(--bg);font-family:'VT323',monospace;font-size:20px}
input,select,button{font-family:inherit}
body::before{content:'';position:fixed;inset:0;z-index:0;pointer-events:none;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect x='0' y='0' width='1' height='1' fill='%23ffffff' opacity='0.007'/%3E%3Crect x='2' y='2' width='1' height='1' fill='%23ffffff' opacity='0.007'/%3E%3C/svg%3E");background-size:4px 4px}

/* ══════════════════════════════
   OUTER WRAP
══════════════════════════════ */
.page{position:relative;z-index:1;min-height:100vh;
  display:flex;flex-direction:column;align-items:center;
  padding:36px 20px 80px}

/* ══════════════════════════════
   STEPPER
══════════════════════════════ */
.stepper{display:flex;align-items:center;gap:0;margin-bottom:36px;width:100%;max-width:560px}

.step-node{display:flex;flex-direction:column;align-items:center;gap:7px;flex-shrink:0;position:relative;z-index:1}
.step-circle{
  width:48px;height:48px;border-radius:4px;
  display:flex;align-items:center;justify-content:center;
  font-family:'Press Start 2P',monospace;font-size:.62rem;
  border:2px solid var(--border);background:var(--bg-surface);
  box-shadow:3px 3px 0 rgba(0,0,0,.5);
  transition:all .3s;
}
.step-circle.active{
  background:linear-gradient(135deg,var(--accent),var(--accent2));
  border-color:var(--accent2);box-shadow:3px 3px 0 #3d0070;
  text-shadow:var(--px-s);animation:step-pulse 2s ease-in-out infinite;
}
.step-circle.done{
  background:rgba(68,255,170,.12);border-color:var(--green);
  color:var(--green);text-shadow:var(--px-g);box-shadow:3px 3px 0 rgba(0,0,0,.4);
}
@keyframes step-pulse{0%,100%{box-shadow:3px 3px 0 #3d0070}50%{box-shadow:3px 3px 0 #3d0070,0 0 12px rgba(180,77,255,.4)}}
.step-label{font-family:'Press Start 2P',monospace;font-size:.42rem;
  color:rgba(255,255,255,.25);white-space:nowrap;transition:color .3s}
.step-node.active .step-label{color:var(--accent-bright)}
.step-node.done .step-label{color:var(--green)}

.step-line{flex:1;height:3px;margin:0 4px;margin-bottom:24px;position:relative;overflow:hidden;
  background:var(--border);border-radius:1px}
.step-line-fill{height:100%;width:0%;background:var(--green);
  box-shadow:0 0 6px rgba(68,255,170,.4);border-radius:1px;transition:width .5s ease}
.step-line.done .step-line-fill{width:100%}

/* ══════════════════════════════
   CARD SHELL
══════════════════════════════ */
.checkout-card{
  width:100%;max-width:560px;
  background:var(--bg-card);border:2px solid var(--border);border-radius:8px;
  box-shadow:5px 5px 0 rgba(0,0,0,.6);overflow:hidden;position:relative;
}
.checkout-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;
  background:repeating-linear-gradient(90deg,var(--accent) 0,var(--accent) 4px,transparent 4px,transparent 8px);opacity:.35}

.card-hdr{padding:20px 24px 16px;border-bottom:2px solid var(--border-light);
  display:flex;align-items:center;gap:12px}
.card-hdr-icon{width:32px;height:32px;background:linear-gradient(135deg,var(--accent),var(--accent2));
  border-radius:4px;box-shadow:2px 2px 0 #3d0070;display:flex;align-items:center;justify-content:center;
  font-family:'Press Start 2P',monospace;font-size:.5rem;flex-shrink:0;text-shadow:var(--px-s)}
.card-hdr-title{font-family:'Press Start 2P',monospace;font-size:.84rem;text-shadow:var(--px-s)}
.card-hdr-sub{font-family:'VT323',monospace;font-size:1.3rem;color:rgba(255,255,255,.35);margin-top:3px}

.card-body{padding:22px 24px;display:flex;flex-direction:column;gap:16px}

/* ══════════════════════════════
   FIELDS
══════════════════════════════ */
.field{display:flex;flex-direction:column;gap:6px}
.field-row{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.field-row-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px}
@media(max-width:480px){.field-row,.field-row-3{grid-template-columns:1fr}}
.lbl{font-family:'Press Start 2P',monospace;font-size:.44rem;color:rgba(255,255,255,.42);letter-spacing:.5px}
.inp{width:100%;padding:10px 13px;
  background:var(--bg-input);border:2px solid var(--border);border-radius:4px;
  box-shadow:inset 2px 2px 0 rgba(0,0,0,.4);
  font-family:'VT323',monospace;font-size:1.32rem;outline:none;transition:.2s}
.inp:focus{border-color:var(--accent);box-shadow:inset 2px 2px 0 rgba(0,0,0,.4),0 0 0 2px rgba(180,77,255,.12)}
.inp::placeholder{color:rgba(255,255,255,.18)}
.inp.err{border-color:var(--red);animation:shake .3s ease}
@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}

/* ══════════════════════════════
   PAYMENT TABS
══════════════════════════════ */
.pay-tabs{display:flex;gap:10px}
.pay-tab{flex:1;padding:11px 8px;background:var(--bg-input);border:2px solid var(--border);
  border-radius:5px;font-family:'Press Start 2P',monospace;font-size:.44rem;
  cursor:pointer;transition:.15s;text-align:center;
  display:flex;flex-direction:column;align-items:center;gap:6px;
  box-shadow:2px 2px 0 rgba(0,0,0,.35)}
.pay-tab:hover{border-color:rgba(180,77,255,.35);background:rgba(180,77,255,.05)}
.pay-tab.active{border-color:var(--accent);background:rgba(180,77,255,.1);box-shadow:2px 2px 0 #3d0070}
.pay-tab svg{width:22px;height:22px;opacity:.4;transition:.15s}
.pay-tab.active svg,.pay-tab:hover svg{opacity:.9}
.pay-tab-lbl{color:rgba(255,255,255,.4);transition:.15s}
.pay-tab.active .pay-tab-lbl{color:var(--accent-bright)}

/* credit form */
.pay-section{display:none;flex-direction:column;gap:14px;animation:fade-in .2s ease}
.pay-section.show{display:flex}
@keyframes fade-in{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}

.card-num-wrap{position:relative}
.card-num-wrap .inp{padding-right:50px;letter-spacing:2px}
.card-brand{position:absolute;right:10px;top:50%;transform:translateY(-50%);
  width:34px;height:22px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);
  border-radius:3px;display:flex;align-items:center;justify-content:center}
.card-brand svg{width:22px;height:14px;opacity:.5}

/* pix */
.pix-wrap{display:flex;flex-direction:column;align-items:center;gap:14px;padding:6px 0}
.pix-qr{width:148px;height:148px;background:var(--bg-surface);border:2px solid var(--border);
  border-radius:5px;display:flex;align-items:center;justify-content:center;box-shadow:3px 3px 0 rgba(0,0,0,.4)}
.pix-code{font-family:'VT323',monospace;font-size:.95rem;color:rgba(255,255,255,.35);
  background:var(--bg-input);border:1px solid var(--border);border-radius:3px;
  padding:8px 12px;word-break:break-all;text-align:center;width:100%;line-height:1.4}
.btn-pix-copy{padding:7px 14px;background:rgba(68,255,170,.07);border:2px solid rgba(68,255,170,.22);
  border-radius:3px;font-family:'Press Start 2P',monospace;font-size:.3rem;cursor:pointer;color:var(--green);transition:.15s}
.btn-pix-copy:hover{background:rgba(68,255,170,.13);border-color:var(--green)}
.pix-hint{font-family:'VT323',monospace;font-size:1rem;color:rgba(255,255,255,.3);text-align:center;line-height:1.5}

/* boleto */
.boleto-notice{padding:12px 14px;background:rgba(255,189,46,.04);border:1px solid rgba(255,189,46,.14);
  border-radius:4px;font-family:'VT323',monospace;font-size:1.1rem;color:rgba(255,255,255,.45);line-height:1.55}
.boleto-notice b{color:var(--yellow)}

/* ══════════════════════════════
   REVIEW STEP
══════════════════════════════ */
.review-plan{display:flex;align-items:center;justify-content:space-between;
  padding:14px 16px;background:rgba(180,77,255,.06);border:2px solid rgba(180,77,255,.2);
  border-radius:5px;margin-bottom:4px}
.review-plan-name{font-family:'Press Start 2P',monospace;font-size:.66rem;color:var(--accent-bright);text-shadow:var(--px-sa)}
.review-plan-price{font-family:'Press Start 2P',monospace;font-size:.96rem;color:var(--accent-bright);text-shadow:var(--px-sa)}

.review-rows{display:flex;flex-direction:column;gap:0;border:2px solid var(--border);border-radius:5px;overflow:hidden}
.review-row{display:flex;justify-content:space-between;align-items:center;
  padding:9px 14px;border-bottom:1px solid var(--border-light);
  font-family:'VT323',monospace;font-size:1.3rem}
.review-row:last-child{border-bottom:none}
.review-row-lbl{color:rgba(255,255,255,.4)}
.review-row-val{color:rgba(255,255,255,.8);text-align:right}
.review-row-val.green{color:var(--green)}

.review-total{display:flex;justify-content:space-between;align-items:baseline;
  padding:14px 0 4px;margin-top:4px;border-top:2px solid var(--border-light)}
.review-total-lbl{font-family:'Press Start 2P',monospace;font-size:.52rem;color:rgba(255,255,255,.6)}
.review-total-amt{font-family:'Press Start 2P',monospace;font-size:1.25rem;color:var(--accent-bright);text-shadow:var(--px-sa)}

.trial-note{font-family:'VT323',monospace;font-size:1.2rem;color:rgba(255,255,255,.28);
  text-align:center;padding:8px 0;line-height:1.5}

/* coupon row */
.coupon-row{display:flex;gap:8px}
.coupon-inp{flex:1;padding:9px 12px;background:var(--bg-input);border:2px solid var(--border);
  border-radius:4px;font-family:'VT323',monospace;font-size:1.24rem;outline:none;
  box-shadow:inset 2px 2px 0 rgba(0,0,0,.4);transition:.2s;letter-spacing:1px}
.coupon-inp:focus{border-color:var(--accent)}
.coupon-inp::placeholder{color:rgba(255,255,255,.18);letter-spacing:0}
.coupon-btn{padding:9px 14px;background:var(--bg-surface);border:2px solid var(--border);
  border-radius:4px;font-family:'Press Start 2P',monospace;font-size:.4rem;cursor:pointer;
  box-shadow:2px 2px 0 rgba(0,0,0,.35);transition:.15s;flex-shrink:0}
.coupon-btn:hover{border-color:var(--accent);background:rgba(180,77,255,.08)}
.coupon-fb{font-family:'VT323',monospace;font-size:1rem;min-height:18px;transition:.2s}
.coupon-fb.ok{color:var(--green)}.coupon-fb.err{color:var(--red)}

/* ══════════════════════════════
   NAV BUTTONS
══════════════════════════════ */
.card-footer{padding:16px 24px 20px;border-top:2px solid var(--border-light);
  display:flex;gap:10px;align-items:center;justify-content:space-between}
.btn-back{padding:10px 16px;background:var(--bg-surface);border:2px solid var(--border);
  border-radius:4px;font-family:'Press Start 2P',monospace;font-size:.46rem;
  cursor:pointer;box-shadow:2px 2px 0 rgba(0,0,0,.35);transition:.15s;display:flex;align-items:center;gap:7px}
.btn-back:hover{border-color:var(--accent);background:rgba(180,77,255,.07)}
.btn-next{flex:1;padding:12px;background:linear-gradient(135deg,var(--accent),var(--accent2));
  border:2px solid var(--accent2);border-radius:4px;
  font-family:'Press Start 2P',monospace;font-size:.54rem;
  cursor:pointer;box-shadow:3px 3px 0 #3d0070;transition:.2s;text-shadow:var(--px-s)}
.btn-next:hover{box-shadow:5px 5px 0 #3d0070;transform:translate(-1px,-2px)}
.btn-next:active{transform:translate(1px,1px);box-shadow:1px 1px 0 #3d0070}
.btn-next:disabled{opacity:.4;cursor:not-allowed;transform:none;box-shadow:2px 2px 0 #3d0070}

/* secure strip */
.secure-strip{display:flex;align-items:center;justify-content:center;gap:16px;
  margin-top:14px;flex-wrap:wrap}
.secure-item{font-family:'Press Start 2P',monospace;font-size:.34rem;
  color:rgba(255,255,255,.22);display:flex;align-items:center;gap:5px}
.secure-item svg{width:13px;height:13px;opacity:.35}

/* progress bar on submit */
.progress-bar{height:3px;background:var(--border);border-radius:1px;overflow:hidden;
  margin:10px 24px 0;display:none}
.progress-bar.show{display:block}
.progress-fill{height:100%;width:0%;background:var(--green);
  box-shadow:0 0 6px rgba(68,255,170,.5);border-radius:1px;transition:width .4s ease}

/* ══════════════════════════════
   SUCCESS
══════════════════════════════ */
.success-screen{display:none;flex-direction:column;align-items:center;
  text-align:center;padding:40px 24px;gap:14px;animation:fade-in .4s ease}
.success-screen.show{display:flex}
.success-icon{font-family:'Press Start 2P',monospace;font-size:2.8rem;
  color:var(--green);text-shadow:var(--px-g);animation:pop .5s cubic-bezier(.2,1.4,.4,1) both}
@keyframes pop{from{transform:scale(0);opacity:0}to{transform:scale(1);opacity:1}}
.success-title{font-family:'Press Start 2P',monospace;font-size:.94rem;line-height:1.8;
  color:var(--accent-bright);text-shadow:var(--px-sa)}
.success-sub{font-family:'VT323',monospace;font-size:1.4rem;color:rgba(255,255,255,.4);
  max-width:380px;line-height:1.5}
.success-dash-btn{margin-top:10px;padding:12px 26px;
  background:linear-gradient(135deg,var(--accent),var(--accent2));
  border:2px solid var(--accent2);border-radius:4px;box-shadow:4px 4px 0 #3d0070;
  font-family:'Press Start 2P',monospace;font-size:.5rem;cursor:pointer;transition:.2s}
.success-dash-btn:hover{box-shadow:6px 6px 0 #3d0070;transform:translate(-1px,-2px)}
</style>
</head>
<body>
<div class="page">

  <!-- STEPPER -->
  <div class="stepper" id="stepper">
    <div class="step-node active" id="sn1">
      <div class="step-circle" id="sc1">1</div>
      <div class="step-label">Conta</div>
    </div>
    <div class="step-line" id="sl1"><div class="step-line-fill" id="sf1"></div></div>
    <div class="step-node" id="sn2">
      <div class="step-circle" id="sc2">2</div>
      <div class="step-label">Pagamento</div>
    </div>
    <div class="step-line" id="sl2"><div class="step-line-fill" id="sf2"></div></div>
    <div class="step-node" id="sn3">
      <div class="step-circle" id="sc3">3</div>
      <div class="step-label">Revisar</div>
    </div>
  </div>

  <!-- CHECKOUT CARD -->
  <div class="checkout-card" id="checkoutCard">

    <!-- ══ STEP 1 ══ -->
    <div id="step1">
      <div class="card-hdr">
        <div class="card-hdr-icon">1</div>
        <div>
          <div class="card-hdr-title">Dados da conta</div>
          <div class="card-hdr-sub">Informações de acesso e contato</div>
        </div>
      </div>
      <div class="card-body">
        <div class="field-row">
          <div class="field">
            <label class="lbl">Nome completo</label>
            <input class="inp" type="text" placeholder="João da Silva" id="f1name">
          </div>
          <div class="field">
            <label class="lbl">E-mail</label>
            <input class="inp" type="email" placeholder="joao@email.com" id="f1email">
          </div>
        </div>
        <div class="field-row">
          <div class="field">
            <label class="lbl">CPF / CNPJ</label>
            <input class="inp" type="text" placeholder="000.000.000-00" id="f1cpf" oninput="maskCpf(this)">
          </div>
          <div class="field">
            <label class="lbl">Telefone</label>
            <input class="inp" type="tel" placeholder="(11) 9 0000-0000" id="f1phone" oninput="maskPhone(this)">
          </div>
        </div>
        <div class="field">
          <label class="lbl">Senha de acesso</label>
          <input class="inp" type="password" placeholder="Mínimo 8 caracteres" id="f1pass">
        </div>
      </div>
      <div class="card-footer">
        <div></div>
        <button class="btn-next" onclick="goStep(2)">Continuar ▶</button>
      </div>
    </div>

    <!-- ══ STEP 2 ══ -->
    <div id="step2" style="display:none">
      <div class="card-hdr">
        <div class="card-hdr-icon">2</div>
        <div>
          <div class="card-hdr-title">Pagamento</div>
          <div class="card-hdr-sub">Escolha a forma de pagamento</div>
        </div>
      </div>
      <div class="card-body">

        <div class="pay-tabs">
          <button class="pay-tab active" onclick="setMethod('credit')" id="tab-credit">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>
            <span class="pay-tab-lbl">Cartão</span>
          </button>
          <button class="pay-tab" onclick="setMethod('pix')" id="tab-pix">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            <span class="pay-tab-lbl">Pix</span>
          </button>
          <button class="pay-tab" onclick="setMethod('boleto')" id="tab-boleto">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="1"/><path d="M6 8v8M9 8v8M13 8v8M17 8v8" stroke-width="1.5"/></svg>
            <span class="pay-tab-lbl">Boleto</span>
          </button>
        </div>

        <!-- CREDIT -->
        <div class="pay-section show" id="sec-credit">
          <div class="field">
            <label class="lbl">Número do cartão</label>
            <div class="card-num-wrap">
              <input class="inp" type="text" placeholder="0000  0000  0000  0000" id="f2cardnum" oninput="maskCard(this)" maxlength="19">
              <div class="card-brand">
                <svg viewBox="0 0 32 20" fill="none"><rect width="32" height="20" rx="2" fill="#1a1035"/><circle cx="12" cy="10" r="6" fill="rgba(180,77,255,.3)"/><circle cx="20" cy="10" r="6" fill="rgba(180,77,255,.2)"/></svg>
              </div>
            </div>
          </div>
          <div class="field">
            <label class="lbl">Nome no cartão</label>
            <input class="inp" type="text" placeholder="JOAO DA SILVA" id="f2name" oninput="this.value=this.value.toUpperCase()">
          </div>
          <div class="field-row">
            <div class="field">
              <label class="lbl">Validade</label>
              <input class="inp" type="text" placeholder="MM/AA" id="f2exp" oninput="maskExpiry(this)" maxlength="5">
            </div>
            <div class="field">
              <label class="lbl">CVV</label>
              <input class="inp" type="text" placeholder="•••" id="f2cvv" maxlength="4" oninput="this.value=this.value.replace(/\D/g,'')">
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:9px">
            <input type="checkbox" id="saveCard" style="width:15px;height:15px;accent-color:var(--accent);cursor:pointer;flex-shrink:0">
            <label for="saveCard" style="font-family:'VT323',monospace;font-size:1.05rem;color:rgba(255,255,255,.4);cursor:pointer">Salvar cartão para próximas cobranças</label>
          </div>
        </div>

        <!-- PIX -->
        <div class="pay-section" id="sec-pix">
          <div class="pix-wrap">
            <div class="pix-qr"><canvas id="pixCanvas" width="128" height="128"></canvas></div>
            <div class="pix-code" id="pixCode">00020126580014br.gov.bcb.pix0136a629532e-7372-4bf1-befb-ff5ddb17f6ac5204000053039865802BR5913VexusClaw6009SaoPaulo62070503***63041D3D</div>
            <button class="btn-pix-copy" onclick="copyPix()">⎘ Copiar código Pix</button>
            <div class="pix-hint">Abra o banco → Pix → Ler QR Code<br>Confirmação em até 2 minutos.</div>
          </div>
        </div>

        <!-- BOLETO -->
        <div class="pay-section" id="sec-boleto">
          <div class="boleto-notice">
            Boleto com vencimento em <b>3 dias úteis</b>.<br>
            Compensação: <b>1–2 dias úteis</b> após pagamento.<br>
            O boleto será enviado ao seu e-mail ao confirmar.
          </div>
        </div>

      </div>
      <div class="card-footer">
        <button class="btn-back" onclick="goStep(1)">◀ Voltar</button>
        <button class="btn-next" onclick="goStep(3)">Revisar pedido ▶</button>
      </div>
    </div>

    <!-- ══ STEP 3 ══ -->
    <div id="step3" style="display:none">
      <div class="card-hdr">
        <div class="card-hdr-icon">3</div>
        <div>
          <div class="card-hdr-title">Revisar pedido</div>
          <div class="card-hdr-sub">Confira antes de finalizar</div>
        </div>
      </div>
      <div class="card-body">

        <!-- plan highlight -->
        <div class="review-plan">
          <div>
            <div style="font-family:'Press Start 2P',monospace;font-size:.28rem;color:rgba(255,255,255,.3);letter-spacing:1px;margin-bottom:5px">PLANO SELECIONADO</div>
            <div class="review-plan-name">✦ Pro</div>
          </div>
          <div class="review-plan-price">R$ 398,90<span style="font-size:.34rem;color:rgba(255,255,255,.35)">/mês</span></div>
        </div>

        <!-- rows -->
        <div class="review-rows">
          <div class="review-row"><span class="review-row-lbl">Conta</span><span class="review-row-val" id="rev-email">—</span></div>
          <div class="review-row"><span class="review-row-lbl">Pagamento</span><span class="review-row-val" id="rev-method">Cartão ••••</span></div>
          <div class="review-row"><span class="review-row-lbl">Ciclo</span><span class="review-row-val">Mensal</span></div>
          <div class="review-row"><span class="review-row-lbl">Trial</span><span class="review-row-val green">7 dias grátis</span></div>
          <div class="review-row" id="rev-discount-row" style="display:none">
            <span class="review-row-lbl">Cupom</span>
            <span class="review-row-val green" id="rev-discount">—</span>
          </div>
        </div>

        <!-- coupon -->
        <div class="coupon-row">
          <input class="coupon-inp" type="text" placeholder="Cupom de desconto" id="couponInp" oninput="this.value=this.value.toUpperCase()">
          <button class="coupon-btn" onclick="applyCoupon()">Aplicar</button>
        </div>
        <div class="coupon-fb" id="couponFb"></div>

        <!-- total -->
        <div class="review-total">
          <span class="review-total-lbl">Total hoje</span>
          <span class="review-total-amt">R$ 0,00</span>
        </div>
        <div class="trial-note">Após o trial: R$ 398,90/mês · Cancele quando quiser.</div>

      </div>

      <!-- progress bar -->
      <div class="progress-bar" id="progressBar">
        <div class="progress-fill" id="progressFill"></div>
      </div>

      <div class="card-footer">
        <button class="btn-back" onclick="goStep(2)">◀ Voltar</button>
        <button class="btn-next" id="submitBtn" onclick="handleSubmit()">Confirmar pagamento ▶</button>
      </div>
    </div>

    <!-- ══ SUCCESS ══ -->
    <div class="success-screen" id="successScreen">
      <div class="success-icon">✓</div>
      <div class="success-title">Pagamento<br>confirmado!</div>
      <div class="success-sub">Sua conta VexusClaw está sendo ativada. Verifique seu e-mail para as instruções de acesso.</div>
      <button class="success-dash-btn">Ir para o dashboard ▶</button>
    </div>

  </div>

  <!-- SECURE STRIP -->
  <div class="secure-strip" id="secureStrip">
    <div class="secure-item">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L3 7v5c0 5.25 3.75 10.2 9 11.4C17.25 22.2 21 17.25 21 12V7L12 2z"/></svg>
      SSL Seguro
    </div>
    <div class="secure-item">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
      PCI-DSS
    </div>
    <div class="secure-item">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      Stripe Payments
    </div>
    <div class="secure-item">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      Cancele quando quiser
    </div>
  </div>

</div>

<script>
var currentStep=1;
var payMethod='credit';
var discount=0;
var selectedPlan='pro';
var PLANS={
  starter:{label:'Starter',badge:'Starter',price:297.00},
  pro:{label:'Pro',badge:'Pro',price:397.00},
  elite:{label:'Elite',badge:'Elite',price:597.00}
};

function parsePlanFromUrl(){
  var q=new URLSearchParams(window.location.search);
  var raw=(q.get('plan')||q.get('plano')||'').toLowerCase().trim();
  return PLANS[raw]?raw:'pro';
}
function brl(value){
  return Number(value||0).toFixed(2).replace('.',',');
}
function getActivePlan(){
  return PLANS[selectedPlan]||PLANS.pro;
}
function applyPlanSelection(key){
  if(PLANS[key]) selectedPlan=key;
  var plan=getActivePlan();
  var planNameEl=document.querySelector('.review-plan-name');
  var planPriceEl=document.querySelector('.review-plan-price');
  var trialNoteEl=document.querySelector('.trial-note');
  if(planNameEl){planNameEl.textContent=plan.badge;}
  if(planPriceEl){
    planPriceEl.innerHTML='R$ '+brl(plan.price)+'<span style="font-size:.34rem;color:rgba(255,255,255,.35)">/mes</span>';
  }
  if(trialNoteEl){
    trialNoteEl.textContent='Apos o trial: R$ '+brl(plan.price)+'/mes - Cancele quando quiser.';
  }
  updateCouponPreview();
}
function updateCouponPreview(){
  var row=document.getElementById('rev-discount-row');
  var val=document.getElementById('rev-discount');
  if(!row||!val){return;}
  if(discount>0){
    var plan=getActivePlan();
    var d=brl(plan.price*(discount/100));
    row.style.display='flex';
    val.textContent='- R$ '+d+' ('+discount+'%)';
  }else{
    row.style.display='none';
  }
}

/* ── STEP NAV ── */
function goStep(n){
  if(n===2&&!validateStep1()) return;
  showStep(n);
}

function showStep(n){
  [1,2,3].forEach(function(i){
    document.getElementById('step'+i).style.display=i===n?'block':'none';
  });
  document.getElementById('successScreen').classList.remove('show');
  updateStepper(n);
  if(n===2&&payMethod==='pix') drawPixQR();
  if(n===3) populateReview();
  currentStep=n;
  window.scrollTo({top:0,behavior:'smooth'});
}

function updateStepper(active){
  [1,2,3].forEach(function(i){
    var cn=document.getElementById('sn'+i);
    var cc=document.getElementById('sc'+i);
    cn.className='step-node';cc.className='step-circle';
    if(i<active){cn.classList.add('done');cc.classList.add('done');cc.textContent='✓'}
    else if(i===active){cn.classList.add('active');cc.classList.add('active');cc.textContent=i}
    else{cc.textContent=i}
  });
  // lines
  [1,2].forEach(function(i){
    var sl=document.getElementById('sl'+i);
    var sf=document.getElementById('sf'+i);
    if(active>i){sl.classList.add('done');sf.style.width='100%'}
    else{sl.classList.remove('done');sf.style.width='0%'}
  });
}

/* ── VALIDATE STEP 1 ── */
function validateStep1(){
  var ok=true;
  var fields=['f1name','f1email','f1pass'];
  fields.forEach(function(id){
    var el=document.getElementById(id);
    if(!el.value.trim()){
      el.classList.add('err');
      el.addEventListener('input',function(){el.classList.remove('err')},{once:true});
      ok=false;
    }
  });
  if(!ok) toast('Preencha todos os campos obrigatórios.');
  return ok;
}

/* ── PAYMENT METHOD ── */
function setMethod(m){
  payMethod=m;
  ['credit','pix','boleto'].forEach(function(id){
    document.getElementById('tab-'+id).classList.remove('active');
    document.getElementById('sec-'+id).classList.remove('show');
  });
  document.getElementById('tab-'+m).classList.add('active');
  document.getElementById('sec-'+m).classList.add('show');
  if(m==='pix') drawPixQR();
}

/* ── REVIEW POPULATE ── */
function populateReview(){
  var email=document.getElementById('f1email').value||'—';
  document.getElementById('rev-email').textContent=email;
  applyPlanSelection(selectedPlan);
  var methodLabel={credit:'Cartão de crédito',pix:'Pix',boleto:'Boleto bancário'};
  var cardNum=document.getElementById('f2cardnum').value;
  var suffix=cardNum.length>=4?' ••••'+cardNum.replace(/\s/g,'').slice(-4):'';
  document.getElementById('rev-method').textContent=methodLabel[payMethod]+(payMethod==='credit'?suffix:'');
}

/* ── COUPON ── */
var COUPONS={'VEXUS20':{pct:20},'LAUNCH10':{pct:10}};
function applyCoupon(){
  var code=document.getElementById('couponInp').value.trim().toUpperCase();
  var fb=document.getElementById('couponFb');
  if(COUPONS[code]){
    discount=COUPONS[code].pct;
    var d=brl(getActivePlan().price*(discount/100));
    document.getElementById('rev-discount-row').style.display='flex';
    document.getElementById('rev-discount').textContent='− R$ '+d+' ('+discount+'%)';
    fb.textContent='✓ Cupom aplicado! '+discount+'% de desconto.';
    fb.className='coupon-fb ok';
  } else {
    discount=0;
    document.getElementById('rev-discount-row').style.display='none';
    fb.textContent='✗ Cupom inválido ou expirado.';
    fb.className='coupon-fb err';
  }
}

/* ── MASKS ── */
function maskCard(el){
  var v=el.value.replace(/\D/g,'').substring(0,16);
  el.value=v.replace(/(.{4})/g,'$1  ').trim();
}
function maskExpiry(el){
  var v=el.value.replace(/\D/g,'');
  if(v.length>2) v=v.substring(0,2)+'/'+v.substring(2,4);
  el.value=v;
}
function maskCpf(el){
  var v=el.value.replace(/\D/g,'').substring(0,11);
  v=v.replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d{1,2})$/,'$1-$2');
  el.value=v;
}
function maskPhone(el){
  var v=el.value.replace(/\D/g,'').substring(0,11);
  v=v.replace(/^(\d{2})(\d)/,'($1) $2').replace(/(\d{5})(\d)/,'$1-$2');
  el.value=v;
}

/* ── PIX QR ── */
function drawPixQR(){
  var c=document.getElementById('pixCanvas');
  var ctx=c.getContext('2d');
  var sz=128,cell=4,n=sz/cell;
  ctx.fillStyle='#0d0820';ctx.fillRect(0,0,sz,sz);
  ctx.fillStyle='rgba(180,77,255,.85)';
  for(var i=0;i<n;i++) for(var j=0;j<n;j++) if(Math.random()>.52) ctx.fillRect(i*cell,j*cell,cell-1,cell-1);
  [[0,0],[0,n-7],[n-7,0]].forEach(function(p){
    ctx.fillStyle='rgba(180,77,255,.9)';ctx.fillRect(p[0]*cell,p[1]*cell,7*cell,7*cell);
    ctx.fillStyle='#0d0820';ctx.fillRect((p[0]+1)*cell,(p[1]+1)*cell,5*cell,5*cell);
    ctx.fillStyle='rgba(180,77,255,.9)';ctx.fillRect((p[0]+2)*cell,(p[1]+2)*cell,3*cell,3*cell);
  });
}
function copyPix(){
  var k=document.getElementById('pixCode').textContent;
  navigator.clipboard.writeText(k).catch(function(){});
  toast('Código Pix copiado!');
}

/* ── SUBMIT ── */
function handleSubmit(){
  var btn=document.getElementById('submitBtn');
  var bar=document.getElementById('progressBar');
  var fill=document.getElementById('progressFill');
  btn.disabled=true;btn.textContent='Processando...';
  bar.classList.add('show');
  var w=0;var iv=setInterval(function(){
    w+=Math.random()*15;if(w>90)w=90;fill.style.width=w+'%';
  },180);
  setTimeout(function(){
    clearInterval(iv);fill.style.width='100%';
    setTimeout(function(){
      bar.classList.remove('show');fill.style.width='0%';
      // hide all steps, show success, update stepper dots all done
      [1,2,3].forEach(function(i){document.getElementById('step'+i).style.display='none'});
      document.getElementById('successScreen').classList.add('show');
      document.getElementById('stepper').style.display='none';
      document.getElementById('secureStrip').style.display='none';
      btn.disabled=false;btn.textContent='Confirmar pagamento ▶';
    },400);
  },2600);
}

/* ── TOAST ── */
function toast(msg){
  var el=document.createElement('div');
  el.style.cssText='position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:999;'
    +'padding:10px 18px;background:#0d0820;border:2px solid var(--green);border-radius:4px;'
    +'font-family:"Press Start 2P",monospace;font-size:.34rem;color:var(--green);'
    +'box-shadow:4px 4px 0 rgba(0,0,0,.6);white-space:nowrap';
  el.textContent=msg;document.body.appendChild(el);
  setTimeout(function(){el.style.transition='opacity .3s';el.style.opacity='0';setTimeout(function(){el.remove()},300)},2500);
}

selectedPlan=parsePlanFromUrl();
applyPlanSelection(selectedPlan);
</script>
</body>
</html>
