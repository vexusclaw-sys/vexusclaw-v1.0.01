<!DOCTYPE html>
<html lang="pt-BR" data-theme="dark" style="color-scheme:dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>VexusClaw — Recuperar Senha</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap" rel="stylesheet">
<style>
:root{
  --bg:#07030f;--bg-card:#0d0820;--bg-surface:#110c28;
  --border:#251a55;
  --accent:#b44dff;--accent2:#8a2be2;--accent-bright:#d088ff;
  --green:#44ffaa;
  --yellow:#ffbd2e;
  --red:#ff4444;
  --px-s:-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000;
  --px-sa:-1px -1px 0 #3d0070,1px -1px 0 #3d0070,-1px 1px 0 #3d0070,1px 1px 0 #3d0070;
  --topbar-h:56px;
}
*{margin:0;padding:0;box-sizing:border-box;color:#fff}
html{scroll-behavior:smooth}
body{background:var(--bg);font-family:'VT323',monospace;font-size:18px;line-height:1.65;overflow-x:hidden;min-height:100vh;display:flex;flex-direction:column;padding-top:var(--topbar-h)}
::selection{background:var(--accent2);color:#fff}
a{color:#fff;text-decoration:none}

body::before{content:'';position:fixed;inset:0;z-index:0;pointer-events:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect x='0' y='0' width='1' height='1' fill='%23ffffff' opacity='0.012'/%3E%3Crect x='2' y='2' width='1' height='1' fill='%23ffffff' opacity='0.012'/%3E%3C/svg%3E");background-size:4px 4px}
body::after{content:'';position:fixed;inset:0;z-index:0;pointer-events:none;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.025) 2px,rgba(0,0,0,.025) 4px)}

.stars{position:fixed;inset:0;z-index:0;pointer-events:none}
.star{position:absolute;background:#fff;animation:twk var(--d) ease-in-out infinite;opacity:0;width:2px;height:2px}
@keyframes twk{0%,100%{opacity:.07;transform:scale(.7)}50%{opacity:var(--b);transform:scale(1.4)}}
.nebula{position:fixed;inset:0;z-index:0;pointer-events:none;background:radial-gradient(ellipse 60% 50% at 70% 10%,rgba(140,30,60,.06),transparent 70%),radial-gradient(ellipse 50% 40% at 20% 30%,rgba(100,30,200,.05),transparent 70%),radial-gradient(ellipse 60% 50% at 50% 80%,rgba(60,10,140,.04),transparent 60%)}
.orbs{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden}
.orb{position:absolute;border-radius:50%;filter:blur(80px);opacity:.06;animation:orbF var(--od) linear infinite}
@keyframes orbF{0%{transform:translate(0,0) scale(1)}33%{transform:translate(50px,-90px) scale(1.1)}66%{transform:translate(-40px,-50px) scale(.95)}100%{transform:translate(0,0) scale(1)}}

/* ===== TOPBAR ===== */
.topbar{position:fixed;top:0;left:0;right:0;z-index:999;height:var(--topbar-h);background:rgba(7,3,15,.93);backdrop-filter:blur(12px);border-bottom:2px solid var(--border);box-shadow:0 2px 0 rgba(180,77,255,.08),0 4px 20px rgba(0,0,0,.5);display:flex;align-items:center;padding:0 20px}
.topbar::after{content:'';position:absolute;bottom:-4px;left:0;right:0;height:2px;background:repeating-linear-gradient(90deg,var(--accent) 0,var(--accent) 4px,transparent 4px,transparent 8px);opacity:.2}
.topbar-logo{display:flex;align-items:center;gap:9px;font-family:'Press Start 2P',monospace;font-size:.6rem;color:#fff;text-shadow:var(--px-sa)}
.topbar-logo img{width:26px;height:26px;image-rendering:pixelated;filter:drop-shadow(0 0 6px rgba(180,77,255,.6))}
.logo-blink{color:var(--accent-bright);animation:blink .9s step-end infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
.topbar-back{margin-left:auto;display:flex;align-items:center;gap:6px;padding:7px 12px;font-family:'Press Start 2P',monospace;font-size:.4rem;color:rgba(255,255,255,.5);text-shadow:var(--px-s);background:none;border:1px solid transparent;cursor:pointer;border-radius:4px;transition:.2s}
.topbar-back:hover{background:rgba(180,77,255,.1);color:#fff;border-color:rgba(180,77,255,.2)}
.topbar-back svg{width:13px;height:13px;image-rendering:pixelated}

/* ===== LAYOUT ===== */
.auth-wrap{position:relative;z-index:1;flex:1;display:flex;align-items:center;justify-content:center;padding:40px 20px}

/* ===== CARD ===== */
.auth-card{width:100%;max-width:460px;background:var(--bg-card);border:2px solid var(--border);box-shadow:6px 6px 0 rgba(0,0,0,.6),0 0 60px rgba(180,77,255,.07);border-radius:8px;overflow:hidden;position:relative}
.auth-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:repeating-linear-gradient(90deg,var(--accent) 0,var(--accent) 4px,transparent 4px,transparent 8px)}
.auth-card::after{content:'';position:absolute;bottom:0;left:0;right:0;height:2px;background:repeating-linear-gradient(90deg,var(--accent2) 0,var(--accent2) 4px,transparent 4px,transparent 8px);opacity:.5}
.px-corner{position:absolute;width:6px;height:6px;background:var(--accent);opacity:.4;border-radius:1px;z-index:2}
.px-corner.tl{top:-1px;left:-1px}.px-corner.tr{top:-1px;right:-1px}
.px-corner.bl{bottom:-1px;left:-1px}.px-corner.br{bottom:-1px;right:-1px}
.card-scanline{position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,rgba(180,77,255,.35),transparent);animation:scanCard 3.5s ease-in-out infinite;pointer-events:none;z-index:3}
@keyframes scanCard{0%{top:-2px;opacity:0}10%{opacity:1}90%{opacity:.4}100%{top:100%;opacity:0}}

/* ===== PANELS ===== */
.panel{display:none}
.panel.active{display:block;animation:panelIn .45s cubic-bezier(.16,1,.3,1) both}
@keyframes panelIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}

/* ===== HEADER ===== */
.auth-header{text-align:center;padding:38px 38px 26px}
.auth-logo-wrap{display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:24px}
.auth-logo{width:44px;height:44px;image-rendering:pixelated;filter:drop-shadow(0 0 14px rgba(180,77,255,.6));animation:float 4s ease-in-out infinite}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
.auth-brand{font-family:'Press Start 2P',monospace;font-size:.7rem;text-shadow:var(--px-sa)}

.auth-title{font-family:'Press Start 2P',monospace;font-size:.82rem;font-weight:400;line-height:1.9;text-shadow:var(--px-s);margin-bottom:10px}
.auth-desc{font-family:'VT323',monospace;font-size:1.15rem;color:rgba(255,255,255,.45);line-height:1.5;max-width:300px;margin:0 auto}

/* ===== HP BAR ===== */
.auth-hp{display:flex;align-items:center;justify-content:center;gap:4px;margin-top:16px}
.auth-hp-label{font-family:'Press Start 2P',monospace;font-size:.35rem;color:var(--accent-bright);text-shadow:var(--px-sa);margin-right:3px}
.hp-pip{width:11px;height:11px;border:2px solid rgba(0,0,0,.5);border-radius:2px;box-shadow:1px 1px 0 rgba(0,0,0,.4);transition:background .3s,box-shadow .3s}
.hp-pip.empty{background:transparent;border-color:rgba(255,255,255,.1)}
.hp-pip.fill-accent{background:var(--accent)}
.hp-pip.fill-yellow{background:var(--yellow);border-color:rgba(0,0,0,.5)}
.hp-pip.fill-green{background:var(--green);border-color:rgba(0,0,0,.5);box-shadow:1px 1px 0 rgba(0,0,0,.4),0 0 8px rgba(68,255,170,.4)}
.hp-pip.fill-red{background:var(--red);border-color:rgba(0,0,0,.5)}

/* ===== STEP INDICATOR ===== */
.step-track{display:flex;align-items:center;justify-content:center;gap:0;margin:0 38px 4px;position:relative}
.step-track::before{content:'';position:absolute;left:calc(50% - 80px);right:calc(50% - 80px);height:2px;top:50%;background:repeating-linear-gradient(90deg,var(--border) 0,var(--border) 4px,transparent 4px,transparent 8px)}
.step-dot{width:28px;height:28px;border-radius:4px;border:2px solid var(--border);background:var(--bg-surface);display:flex;align-items:center;justify-content:center;font-family:'Press Start 2P',monospace;font-size:.36rem;color:rgba(255,255,255,.3);text-shadow:var(--px-s);position:relative;z-index:1;transition:.3s;flex-shrink:0}
.step-dot.active{border-color:var(--accent);background:rgba(180,77,255,.15);color:#fff;text-shadow:var(--px-sa);box-shadow:2px 2px 0 rgba(0,0,0,.4),0 0 10px rgba(180,77,255,.2)}
.step-dot.done{border-color:var(--green);background:rgba(68,255,170,.12);color:var(--green);text-shadow:0 0 6px rgba(68,255,170,.4)}
.step-line{flex:1;height:2px;background:repeating-linear-gradient(90deg,var(--border) 0,var(--border) 4px,transparent 4px,transparent 8px);max-width:60px;transition:.3s}
.step-line.done{background:repeating-linear-gradient(90deg,var(--green) 0,var(--green) 4px,transparent 4px,transparent 8px);opacity:.5}
.step-labels{display:flex;justify-content:space-between;margin:6px 38px 0;padding:0 4px}
.step-label{font-family:'Press Start 2P',monospace;font-size:.3rem;color:rgba(255,255,255,.2);text-shadow:var(--px-s);text-align:center;flex:1;transition:.3s}
.step-label.active{color:var(--accent-bright);text-shadow:var(--px-sa)}
.step-label.done{color:rgba(68,255,170,.6)}

/* ===== BODY ===== */
.auth-body{padding:20px 38px 36px}

/* ===== FIELD ===== */
.field{margin-bottom:18px}
.field-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:7px}
.field-label{font-family:'Press Start 2P',monospace;font-size:.44rem;color:rgba(255,255,255,.7);text-shadow:var(--px-s)}
.field input{width:100%;padding:14px 15px;background:rgba(7,3,15,.8);border:2px solid var(--border);box-shadow:inset 2px 2px 0 rgba(0,0,0,.4),3px 3px 0 rgba(0,0,0,.3);border-radius:4px;font-family:'VT323',monospace;font-size:1.2rem;color:#fff;outline:none;transition:.25s;-webkit-appearance:none}
.field input:focus{border-color:var(--accent);box-shadow:inset 2px 2px 0 rgba(0,0,0,.4),3px 3px 0 rgba(100,30,200,.3),0 0 0 3px rgba(180,77,255,.08)}
.field input::placeholder{color:rgba(255,255,255,.18)}
.field input.success{border-color:var(--green);box-shadow:inset 2px 2px 0 rgba(0,0,0,.4),3px 3px 0 rgba(68,255,170,.15)}
.field input.error{border-color:var(--red);box-shadow:inset 2px 2px 0 rgba(0,0,0,.4),3px 3px 0 rgba(255,68,68,.2)}
.field-error{font-family:'Press Start 2P',monospace;font-size:.36rem;color:#ff6666;text-shadow:0 0 6px rgba(255,68,68,.3);margin-top:6px;display:none;animation:errShake .3s ease-out}
.field-error.show{display:block}
@keyframes errShake{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}
.field-hint{font-family:'VT323',monospace;font-size:1rem;color:rgba(255,255,255,.3);margin-top:5px;line-height:1.4}

/* OTP row */
.otp-row{display:flex;gap:8px;justify-content:center;margin-bottom:6px}
.otp-input{width:52px;height:60px;text-align:center;padding:0;font-family:'Press Start 2P',monospace;font-size:.7rem;letter-spacing:0;background:rgba(7,3,15,.8);border:2px solid var(--border);box-shadow:inset 2px 2px 0 rgba(0,0,0,.4),3px 3px 0 rgba(0,0,0,.3);border-radius:4px;color:#fff;outline:none;transition:.25s;-webkit-appearance:none;caret-color:var(--accent)}
.otp-input:focus{border-color:var(--accent);box-shadow:inset 2px 2px 0 rgba(0,0,0,.4),3px 3px 0 rgba(100,30,200,.3),0 0 0 3px rgba(180,77,255,.1)}
.otp-input.filled{border-color:rgba(180,77,255,.45);background:rgba(180,77,255,.06)}
.otp-input.success{border-color:var(--green);background:rgba(68,255,170,.06)}
.otp-resend{text-align:center;font-family:'Press Start 2P',monospace;font-size:.36rem;color:rgba(255,255,255,.25);margin-top:8px}
.otp-resend-link{color:var(--accent-bright);cursor:pointer;transition:.2s}
.otp-resend-link:hover{color:#fff}
.otp-resend-link.disabled{color:rgba(255,255,255,.2);cursor:default;pointer-events:none}

/* password wrap */
.field-pw{position:relative}
.field-pw input{padding-right:46px}
.pw-toggle{position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;padding:4px;opacity:.4;transition:.2s}
.pw-toggle:hover{opacity:.9}
.pw-toggle svg{width:18px;height:18px;image-rendering:pixelated}

/* strength */
.pw-strength{margin-top:8px}
.strength-pips{display:flex;gap:4px;margin-bottom:5px}
.s-pip{flex:1;height:6px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.05);border-radius:1px;transition:.3s}
.s-pip.weak{background:#ff4444;border-color:#ff2222;box-shadow:0 0 4px rgba(255,68,68,.3)}
.s-pip.medium{background:#ffbd2e;border-color:#e6a800;box-shadow:0 0 4px rgba(255,189,46,.25)}
.s-pip.strong{background:var(--green);border-color:#22cc88;box-shadow:0 0 4px rgba(68,255,170,.3)}
.strength-label{font-family:'Press Start 2P',monospace;font-size:.33rem;color:rgba(255,255,255,.28)}
.strength-label.weak{color:#ff6666}
.strength-label.medium{color:#ffbd2e}
.strength-label.strong{color:var(--green)}

/* match indicator */
.pw-match{font-family:'Press Start 2P',monospace;font-size:.36rem;margin-top:6px;display:none}
.pw-match.show{display:block}
.pw-match.ok{color:var(--green)}
.pw-match.no{color:#ff6666}

/* ===== SUBMIT ===== */
.btn-submit{width:100%;padding:15px 20px;background:linear-gradient(135deg,var(--accent),var(--accent2));border:none;border-radius:5px;font-family:'Press Start 2P',monospace;font-size:.52rem;text-shadow:var(--px-s);color:#fff;cursor:pointer;transition:.2s;box-shadow:4px 4px 0 #3d0070;display:flex;align-items:center;justify-content:center;gap:9px;letter-spacing:1px}
.btn-submit:hover{transform:translate(-1px,-1px);box-shadow:5px 5px 0 #3d0070}
.btn-submit:active{transform:translate(2px,2px);box-shadow:1px 1px 0 #3d0070}
.btn-submit:disabled{opacity:.45;cursor:not-allowed;transform:none;box-shadow:2px 2px 0 #3d0070}
.btn-submit svg{width:14px;height:14px;image-rendering:pixelated;flex-shrink:0}
.btn-submit.loading{opacity:.7;pointer-events:none}

/* ghost btn */
.btn-ghost{width:100%;padding:13px 20px;background:var(--bg-surface);border:2px solid var(--border);box-shadow:3px 3px 0 rgba(0,0,0,.5);border-radius:5px;font-family:'Press Start 2P',monospace;font-size:.46rem;text-shadow:var(--px-s);color:rgba(255,255,255,.6);cursor:pointer;transition:.2s;display:flex;align-items:center;justify-content:center;gap:8px;margin-top:10px}
.btn-ghost:hover{border-color:var(--accent);color:#fff;transform:translate(-1px,-1px);box-shadow:4px 4px 0 rgba(100,30,200,.35)}
.btn-ghost svg{width:13px;height:13px;image-rendering:pixelated}

/* ===== TERMS ===== */
.auth-terms{font-family:'VT323',monospace;font-size:.95rem;color:rgba(255,255,255,.28);text-align:center;margin-top:16px;line-height:1.5}
.auth-terms a{color:rgba(180,77,255,.6);text-decoration:underline;text-underline-offset:2px}
.auth-terms a:hover{color:var(--accent-bright)}

/* ===== SWITCH ===== */
.auth-switch{background:rgba(7,3,15,.5);border-top:2px solid var(--border);padding:18px 38px;text-align:center;font-family:'VT323',monospace;font-size:1.08rem;color:rgba(255,255,255,.4)}
.switch-link{color:var(--accent-bright);cursor:pointer;transition:.2s;font-family:'Press Start 2P',monospace;font-size:.42rem;text-shadow:var(--px-sa)}
.switch-link:hover{color:#fff}

/* ===== SUCCESS ICON ===== */
.success-icon{width:72px;height:72px;margin:0 auto 20px;display:flex;align-items:center;justify-content:center;position:relative}
.success-icon svg{width:64px;height:64px;image-rendering:pixelated;animation:successPop .5s cubic-bezier(.16,1,.3,1) both}
@keyframes successPop{from{transform:scale(0) rotate(-20deg);opacity:0}60%{transform:scale(1.2) rotate(5deg)}to{transform:scale(1) rotate(0);opacity:1}}
.success-ring{position:absolute;inset:-6px;border:2px solid var(--green);border-radius:6px;opacity:0;animation:ringPulse 1s ease-out .4s both}
@keyframes ringPulse{0%{transform:scale(.7);opacity:.8}100%{transform:scale(1.3);opacity:0}}

/* pixel particle burst */
.px-particles{position:fixed;inset:0;pointer-events:none;z-index:1100}
.px-particle{position:absolute;border-radius:1px;opacity:0;transform:translate(-50%,-50%) scale(0)}
@keyframes pxBurst{0%{opacity:1;transform:translate(-50%,-50%) translate(var(--tx),var(--ty)) scale(1.3)}80%{opacity:.4}100%{opacity:0;transform:translate(-50%,-50%) translate(calc(var(--tx)*3.5),calc(var(--ty)*3.5)) scale(0)}}

/* timer countdown */
.countdown-ring{display:flex;align-items:center;justify-content:center;gap:6px;margin-bottom:14px}
.countdown-num{font-family:'Press Start 2P',monospace;font-size:.9rem;color:var(--accent-bright);text-shadow:var(--px-sa);min-width:28px;text-align:center}
.countdown-label{font-family:'VT323',monospace;font-size:1rem;color:rgba(255,255,255,.35)}
.countdown-bar{height:4px;background:rgba(255,255,255,.06);border-radius:2px;overflow:hidden;margin-bottom:18px;border:1px solid rgba(255,255,255,.04)}
.countdown-fill{height:100%;background:linear-gradient(90deg,var(--accent),var(--accent-bright));border-radius:2px;transition:width .98s linear}

/* ===== RESPONSIVE ===== */
@media(max-width:500px){
  .auth-header{padding:28px 22px 20px}
  .auth-body{padding:16px 22px 28px}
  .auth-switch{padding:16px 22px}
  .step-track{margin:0 22px 4px}
  .step-labels{margin:6px 22px 0}
  .auth-title{font-size:.65rem}
  .otp-input{width:42px;height:52px;font-size:.58rem}
}
</style>
</head>
<body>

<div class="stars" id="stars"></div>
<div class="nebula"></div>
<div class="orbs" id="orbs"></div>
<div class="px-particles" id="particles"></div>

<!-- TOPBAR -->
<nav class="topbar">
  <a href="index.php#top" class="topbar-logo">
    <img src="https://community.aseprite.org/uploads/default/original/2X/0/0eff0e4064297cbbe7383108c2f7322c758a5e1f.gif" alt="VexusClaw" draggable="false">
    VexusClaw<span class="logo-blink">_</span>
  </a>
  <a href="login.php" class="topbar-back">
    <svg viewBox="0 0 14 14" fill="none">
      <rect x="0" y="6" width="10" height="2" fill="currentColor"/>
      <rect x="2" y="4" width="2" height="2" fill="currentColor"/>
      <rect x="2" y="8" width="2" height="2" fill="currentColor"/>
      <rect x="4" y="2" width="2" height="2" fill="currentColor"/>
      <rect x="4" y="10" width="2" height="2" fill="currentColor"/>
    </svg>
    Voltar ao login
  </a>
</nav>

<div class="auth-wrap">
  <div class="auth-card" id="authCard">
    <div class="px-corner tl"></div><div class="px-corner tr"></div>
    <div class="px-corner bl"></div><div class="px-corner br"></div>
    <div class="card-scanline"></div>

    <!-- ══════════ STEP INDICATOR ══════════ -->
    <div style="padding-top:28px">
      <div class="step-track">
        <div class="step-dot active" id="sd1">1</div>
        <div class="step-line" id="sl1"></div>
        <div class="step-dot" id="sd2">2</div>
        <div class="step-line" id="sl2"></div>
        <div class="step-dot" id="sd3">3</div>
      </div>
      <div class="step-labels">
        <span class="step-label active" id="slb1">Email</span>
        <span class="step-label" id="slb2">Código</span>
        <span class="step-label" id="slb3">Nova Senha</span>
      </div>
    </div>

    <!-- ══════════ PANEL 1 — EMAIL ══════════ -->
    <div class="panel active" id="p1">
      <div class="auth-header" style="padding-top:22px">
        <div class="auth-logo-wrap">
          <img src="https://community.aseprite.org/uploads/default/original/2X/0/0eff0e4064297cbbe7383108c2f7322c758a5e1f.gif" class="auth-logo" alt="VexusClaw" draggable="false">
          <span class="auth-brand">VexusClaw</span>
        </div>
        <h1 class="auth-title">Esqueceu a Senha?</h1>
        <p class="auth-desc">Sem pânico. Digite seu e-mail e enviaremos um código de recuperação.</p>
        <div class="auth-hp" id="hp1">
          <span class="auth-hp-label">HP</span>
          <div class="hp-pip fill-yellow"></div>
          <div class="hp-pip empty"></div>
          <div class="hp-pip empty"></div>
          <div class="hp-pip empty"></div>
          <div class="hp-pip empty"></div>
        </div>
      </div>
      <div class="auth-body">
        <div class="field">
          <div class="field-row"><label class="field-label" for="emailInput">E-mail da conta</label></div>
          <input type="email" id="emailInput" placeholder="nome@exemplo.com" autocomplete="email" oninput="validateEmailLive()">
          <div class="field-error" id="emailErr">E-mail inválido. Tente novamente!</div>
          <p class="field-hint">Usaremos este e-mail para enviar o código de 6 dígitos.</p>
        </div>

        <button class="btn-submit" id="btnSend" onclick="handleSendCode()">
          <!-- envelope pixel icon -->
          <svg viewBox="0 0 16 16" fill="none">
            <rect x="1" y="3" width="14" height="10" fill="currentColor" opacity=".2"/>
            <rect x="1" y="3" width="14" height="2" fill="currentColor" opacity=".6"/>
            <rect x="1" y="11" width="14" height="2" fill="currentColor" opacity=".5"/>
            <rect x="1" y="5" width="2" height="6" fill="currentColor" opacity=".45"/>
            <rect x="13" y="5" width="2" height="6" fill="currentColor" opacity=".45"/>
            <rect x="3" y="5" width="4" height="3" fill="currentColor" opacity=".35"/>
            <rect x="9" y="5" width="4" height="3" fill="currentColor" opacity=".35"/>
            <rect x="7" y="7" width="2" height="2" fill="currentColor" opacity=".55"/>
          </svg>
          Enviar Código
        </button>

        <p class="auth-terms">Ao continuar, você concorda com nossos <a href="#">Termos de Serviço</a> e <a href="#">Política de Privacidade</a></p>
      </div>
      <div class="auth-switch">
      Lembrou a senha? <span class="switch-link" onclick="location.href='login.php'">Entrar ▶</span>
      </div>
    </div>

    <!-- ══════════ PANEL 2 — OTP ══════════ -->
    <div class="panel" id="p2">
      <div class="auth-header" style="padding-top:22px">
        <div class="auth-logo-wrap">
          <img src="https://community.aseprite.org/uploads/default/original/2X/0/0eff0e4064297cbbe7383108c2f7322c758a5e1f.gif" class="auth-logo" alt="VexusClaw" draggable="false">
          <span class="auth-brand">VexusClaw</span>
        </div>
        <h1 class="auth-title">Código Enviado!</h1>
        <p class="auth-desc" id="otpDesc">Verifique sua caixa de entrada em <strong id="sentEmail" style="color:var(--accent-bright)"></strong></p>
        <div class="auth-hp" id="hp2">
          <span class="auth-hp-label">HP</span>
          <div class="hp-pip fill-yellow"></div>
          <div class="hp-pip fill-yellow"></div>
          <div class="hp-pip fill-yellow"></div>
          <div class="hp-pip empty"></div>
          <div class="hp-pip empty"></div>
        </div>
      </div>
      <div class="auth-body">

        <!-- countdown -->
        <div class="countdown-ring">
          <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
            <rect x="7" y="1" width="2" height="3" fill="currentColor" opacity=".5"/>
            <rect x="7" y="12" width="2" height="3" fill="currentColor" opacity=".5"/>
            <rect x="1" y="7" width="3" height="2" fill="currentColor" opacity=".5"/>
            <rect x="12" y="7" width="3" height="2" fill="currentColor" opacity=".5"/>
            <rect x="7" y="6" width="2" height="4" fill="var(--accent-bright)"/>
            <rect x="7" y="9" width="3" height="2" fill="var(--accent-bright)"/>
          </svg>
          <span class="countdown-num" id="countdownNum">10:00</span>
          <span class="countdown-label">para expirar</span>
        </div>
        <div class="countdown-bar"><div class="countdown-fill" id="countdownFill" style="width:100%"></div></div>

        <!-- OTP inputs -->
        <div class="field" style="margin-bottom:6px">
          <div class="field-row" style="justify-content:center"><label class="field-label">Código de 6 dígitos</label></div>
          <div class="otp-row">
            <input class="otp-input" id="otp0" type="text" inputmode="numeric" maxlength="1" autocomplete="one-time-code">
            <input class="otp-input" id="otp1" type="text" inputmode="numeric" maxlength="1">
            <input class="otp-input" id="otp2" type="text" inputmode="numeric" maxlength="1">
            <input class="otp-input" id="otp3" type="text" inputmode="numeric" maxlength="1">
            <input class="otp-input" id="otp4" type="text" inputmode="numeric" maxlength="1">
            <input class="otp-input" id="otp5" type="text" inputmode="numeric" maxlength="1">
          </div>
          <div class="field-error" id="otpErr" style="text-align:center">Código inválido. Tente novamente!</div>
        </div>

        <div class="otp-resend">
          Não recebeu? <span class="otp-resend-link disabled" id="resendLink" onclick="handleResend()">Reenviar ▶</span>
          <span id="resendTimer"> (aguarde <span id="resendSec">30</span>s)</span>
        </div>

        <button class="btn-submit" id="btnVerify" onclick="handleVerify()" style="margin-top:20px" disabled>
          <!-- check pixel icon -->
          <svg viewBox="0 0 16 16" fill="none">
            <rect x="2" y="8" width="2" height="2" fill="currentColor"/>
            <rect x="4" y="10" width="2" height="2" fill="currentColor"/>
            <rect x="6" y="12" width="2" height="2" fill="currentColor"/>
            <rect x="8" y="10" width="2" height="2" fill="currentColor"/>
            <rect x="10" y="8" width="2" height="2" fill="currentColor"/>
            <rect x="12" y="6" width="2" height="2" fill="currentColor"/>
            <rect x="14" y="4" width="2" height="2" fill="currentColor"/>
          </svg>
          Verificar Código
        </button>

        <button class="btn-ghost" onclick="goBack(1)">
          <svg viewBox="0 0 14 14" fill="none">
            <rect x="0" y="6" width="10" height="2" fill="currentColor"/>
            <rect x="2" y="4" width="2" height="2" fill="currentColor"/>
            <rect x="2" y="8" width="2" height="2" fill="currentColor"/>
            <rect x="4" y="2" width="2" height="2" fill="currentColor"/>
            <rect x="4" y="10" width="2" height="2" fill="currentColor"/>
          </svg>
          Trocar e-mail
        </button>
      </div>
      <div class="auth-switch">
      Lembrou a senha? <span class="switch-link" onclick="location.href='login.php'">Entrar ▶</span>
      </div>
    </div>

    <!-- ══════════ PANEL 3 — NOVA SENHA ══════════ -->
    <div class="panel" id="p3">
      <div class="auth-header" style="padding-top:22px">
        <div class="auth-logo-wrap">
          <img src="https://community.aseprite.org/uploads/default/original/2X/0/0eff0e4064297cbbe7383108c2f7322c758a5e1f.gif" class="auth-logo" alt="VexusClaw" draggable="false">
          <span class="auth-brand">VexusClaw</span>
        </div>
        <h1 class="auth-title">Nova Senha</h1>
        <p class="auth-desc">Escolha uma senha forte para proteger sua conta.</p>
        <div class="auth-hp" id="hp3">
          <span class="auth-hp-label">HP</span>
          <div class="hp-pip fill-accent"></div>
          <div class="hp-pip fill-accent"></div>
          <div class="hp-pip fill-accent"></div>
          <div class="hp-pip fill-accent"></div>
          <div class="hp-pip empty"></div>
        </div>
      </div>
      <div class="auth-body">
        <div class="field">
          <div class="field-row"><label class="field-label" for="newPw">Nova senha</label></div>
          <div class="field-pw">
            <input type="password" id="newPw" placeholder="••••••••" autocomplete="new-password" oninput="onNewPw()">
            <button class="pw-toggle" onclick="togglePw('newPw',this)" type="button">
              <svg viewBox="0 0 18 18" fill="none">
                <rect x="1" y="8" width="16" height="2" fill="currentColor" opacity=".5"/>
                <rect x="3" y="6" width="12" height="2" fill="currentColor" opacity=".4"/>
                <rect x="5" y="4" width="8" height="2" fill="currentColor" opacity=".3"/>
                <rect x="3" y="10" width="12" height="2" fill="currentColor" opacity=".4"/>
                <rect x="5" y="12" width="8" height="2" fill="currentColor" opacity=".3"/>
                <rect x="7" y="7" width="4" height="4" fill="currentColor" opacity=".7"/>
                <rect x="8" y="8" width="2" height="2" fill="#07030f"/>
              </svg>
            </button>
          </div>
          <div class="pw-strength" id="pwStrength">
            <div class="strength-pips">
              <div class="s-pip" id="sp1"></div>
              <div class="s-pip" id="sp2"></div>
              <div class="s-pip" id="sp3"></div>
              <div class="s-pip" id="sp4"></div>
            </div>
            <span class="strength-label" id="strengthLabel">—</span>
          </div>
          <div class="field-error" id="newPwErr">Mínimo de 8 caracteres!</div>
        </div>

        <div class="field">
          <div class="field-row"><label class="field-label" for="confirmPw">Confirmar senha</label></div>
          <div class="field-pw">
            <input type="password" id="confirmPw" placeholder="••••••••" autocomplete="new-password" oninput="onConfirmPw()">
            <button class="pw-toggle" onclick="togglePw('confirmPw',this)" type="button">
              <svg viewBox="0 0 18 18" fill="none">
                <rect x="1" y="8" width="16" height="2" fill="currentColor" opacity=".5"/>
                <rect x="3" y="6" width="12" height="2" fill="currentColor" opacity=".4"/>
                <rect x="5" y="4" width="8" height="2" fill="currentColor" opacity=".3"/>
                <rect x="3" y="10" width="12" height="2" fill="currentColor" opacity=".4"/>
                <rect x="5" y="12" width="8" height="2" fill="currentColor" opacity=".3"/>
                <rect x="7" y="7" width="4" height="4" fill="currentColor" opacity=".7"/>
                <rect x="8" y="8" width="2" height="2" fill="#07030f"/>
              </svg>
            </button>
          </div>
          <div class="pw-match" id="pwMatch"></div>
          <div class="field-error" id="confirmPwErr">As senhas não coincidem!</div>
        </div>

        <button class="btn-submit" id="btnReset" onclick="handleReset()">
          <!-- lock pixel icon -->
          <svg viewBox="0 0 16 16" fill="none">
            <rect x="4" y="7" width="8" height="8" fill="currentColor" opacity=".25"/>
            <rect x="4" y="7" width="8" height="2" fill="currentColor" opacity=".6"/>
            <rect x="4" y="13" width="8" height="2" fill="currentColor" opacity=".5"/>
            <rect x="4" y="9" width="2" height="4" fill="currentColor" opacity=".5"/>
            <rect x="10" y="9" width="2" height="4" fill="currentColor" opacity=".5"/>
            <rect x="7" y="10" width="2" height="2" fill="currentColor" opacity=".8"/>
            <rect x="5" y="3" width="6" height="4" fill="none" stroke="currentColor" stroke-width="2" opacity=".5"/>
          </svg>
          Redefinir Senha
        </button>
      </div>
      <div class="auth-switch">
      Lembrou a senha? <span class="switch-link" onclick="location.href='login.php'">Entrar ▶</span>
      </div>
    </div>

    <!-- ══════════ PANEL 4 — SUCESSO ══════════ -->
    <div class="panel" id="p4">
      <div class="auth-header" style="padding:48px 38px 36px">
        <div class="success-icon">
          <div class="success-ring"></div>
          <!-- pixel shield/check icon -->
          <svg viewBox="0 0 64 64" fill="none">
            <rect x="16" y="8" width="32" height="4" fill="#44ffaa" opacity=".6"/>
            <rect x="12" y="12" width="40" height="4" fill="#44ffaa" opacity=".5"/>
            <rect x="8" y="16" width="48" height="28" fill="#44ffaa" opacity=".1"/>
            <rect x="8" y="16" width="4" height="28" fill="#44ffaa" opacity=".4"/>
            <rect x="52" y="16" width="4" height="28" fill="#44ffaa" opacity=".4"/>
            <rect x="12" y="44" width="8" height="4" fill="#44ffaa" opacity=".4"/>
            <rect x="44" y="44" width="8" height="4" fill="#44ffaa" opacity=".4"/>
            <rect x="20" y="48" width="6" height="4" fill="#44ffaa" opacity=".35"/>
            <rect x="38" y="48" width="6" height="4" fill="#44ffaa" opacity=".35"/>
            <rect x="26" y="52" width="12" height="4" fill="#44ffaa" opacity=".3"/>
            <!-- checkmark -->
            <rect x="20" y="30" width="4" height="4" fill="#44ffaa"/>
            <rect x="24" y="34" width="4" height="4" fill="#44ffaa"/>
            <rect x="28" y="38" width="4" height="4" fill="#44ffaa"/>
            <rect x="32" y="34" width="4" height="4" fill="#44ffaa"/>
            <rect x="36" y="30" width="4" height="4" fill="#44ffaa"/>
            <rect x="40" y="26" width="4" height="4" fill="#44ffaa"/>
          </svg>
        </div>

        <h1 class="auth-title" style="color:var(--green);text-shadow:0 0 20px rgba(68,255,170,.35);font-size:.72rem">Senha Redefinida!</h1>
        <p class="auth-desc" style="color:rgba(68,255,170,.55)">Sua senha foi atualizada com sucesso. Agora você pode entrar com a nova senha.</p>

        <div class="auth-hp" style="margin-top:20px">
          <span class="auth-hp-label">HP</span>
          <div class="hp-pip fill-green"></div>
          <div class="hp-pip fill-green"></div>
          <div class="hp-pip fill-green"></div>
          <div class="hp-pip fill-green"></div>
          <div class="hp-pip fill-green"></div>
        </div>
      </div>

      <div class="auth-body" style="padding-top:0">
  <a href="login.php" class="btn-submit" style="text-decoration:none">
          <svg viewBox="0 0 14 14" fill="none">
            <rect x="2" y="6" width="8" height="2" fill="currentColor"/>
            <rect x="8" y="4" width="2" height="2" fill="currentColor"/>
            <rect x="8" y="8" width="2" height="2" fill="currentColor"/>
            <rect x="10" y="2" width="2" height="2" fill="currentColor"/>
            <rect x="10" y="10" width="2" height="2" fill="currentColor"/>
          </svg>
          Ir para o Login
        </a>
      </div>
    </div>

  </div><!-- /auth-card -->
</div><!-- /auth-wrap -->

<script>
/* ── STARS ── */
const sf=document.getElementById('stars');
for(let i=0;i<80;i++){const s=document.createElement('div');s.className='star';const z=Math.random()>.7?3:2;s.style.cssText=`left:${Math.random()*100}%;top:${Math.random()*100}%;width:${z}px;height:${z}px;--d:${2+Math.random()*5}s;--b:${.18+Math.random()*.7};animation-delay:${Math.random()*5}s`;sf.appendChild(s)}

/* ── ORBS ── */
const oc=document.getElementById('orbs');
[{w:500,x:'10%',y:'5%',c:'rgba(120,40,220,.5)',d:22},{w:420,x:'65%',y:'20%',c:'rgba(180,77,255,.4)',d:26},{w:580,x:'40%',y:'60%',c:'rgba(80,20,180,.35)',d:30}].forEach(o=>{const e=document.createElement('div');e.className='orb';e.style.cssText=`width:${o.w}px;height:${o.w}px;left:${o.x};top:${o.y};background:${o.c};--od:${o.d}s;animation-delay:${-Math.random()*10}s`;oc.appendChild(e)});

/* ── STEP PROGRESS ── */
function setStep(n){
  for(let i=1;i<=3;i++){
    const d=document.getElementById('sd'+i);
    const l=document.getElementById('slb'+i);
    d.className='step-dot';
    l.className='step-label';
    if(i<n){d.classList.add('done');d.textContent='✓';l.classList.add('done')}
    else if(i===n){d.classList.add('active');d.textContent=i;l.classList.add('active')}
    else{d.textContent=i}
  }
  for(let i=1;i<=2;i++){
    const line=document.getElementById('sl'+i);
    if(line)line.className='step-line'+(i<n?' done':'');
  }
}

/* ── SHOW PANEL ── */
function showPanel(id){
  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
  const el=document.getElementById(id);
  el.classList.add('active');
  el.style.animation='none';void el.offsetWidth;el.style.animation='';
}

/* ── VALIDATION HELPERS ── */
const isEmail=v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
function setErr(inpId,errId,msg){
  const i=document.getElementById(inpId);const e=document.getElementById(errId);
  if(i)i.classList.add('error');
  if(e&&msg){e.textContent=msg;e.classList.add('show')}
}
function clrErr(inpId,errId){
  const i=document.getElementById(inpId);const e=document.getElementById(errId);
  if(i){i.classList.remove('error')}
  if(e)e.classList.remove('show');
}

/* ── STEP 1: EMAIL ── */
function validateEmailLive(){
  const v=document.getElementById('emailInput').value;
  const i=document.getElementById('emailInput');
  clrErr('emailInput','emailErr');
  if(v&&isEmail(v)){i.classList.add('success')}else{i.classList.remove('success')}
}

function handleSendCode(){
  const v=document.getElementById('emailInput').value;
  clrErr('emailInput','emailErr');
  if(!isEmail(v)){setErr('emailInput','emailErr','E-mail inválido. Tente novamente!');return}

  const btn=document.getElementById('btnSend');
  btn.classList.add('loading');
  btn.innerHTML='<svg viewBox="0 0 16 16" fill="none" width="14" height="14"><rect x="7" y="1" width="2" height="4" fill="currentColor" opacity=".8"/><rect x="7" y="11" width="2" height="4" fill="currentColor" opacity=".3"/><rect x="1" y="7" width="4" height="2" fill="currentColor" opacity=".5"/><rect x="11" y="7" width="4" height="2" fill="currentColor" opacity=".5"/><rect x="2" y="2" width="2" height="2" fill="currentColor" opacity=".4"/><rect x="12" y="12" width="2" height="2" fill="currentColor" opacity=".2"/></svg> Enviando...';

  setTimeout(()=>{
    document.getElementById('sentEmail').textContent=v;
    setStep(2);
    showPanel('p2');
    startCountdown();
    startResendTimer();
    setupOTP();
  },900);
}

/* ── STEP 2: OTP ── */
let countdownInt=null, resendInt=null;

function startCountdown(){
  let total=600; // 10 min in seconds
  const fill=document.getElementById('countdownFill');
  const num=document.getElementById('countdownNum');
  clearInterval(countdownInt);
  countdownInt=setInterval(()=>{
    total--;
    if(total<=0){clearInterval(countdownInt);num.textContent='00:00';fill.style.width='0%';fill.style.background='var(--red)';return}
    const m=Math.floor(total/60), s=total%60;
    num.textContent=String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
    fill.style.width=(total/600*100)+'%';
    if(total<120){fill.style.background='var(--red)';num.style.color='#ff6666'}
    else if(total<300){fill.style.background='var(--yellow)';num.style.color='var(--yellow)'}
  },1000);
}

function startResendTimer(){
  let sec=30;
  const link=document.getElementById('resendLink');
  const secEl=document.getElementById('resendSec');
  const timerEl=document.getElementById('resendTimer');
  link.classList.add('disabled');
  clearInterval(resendInt);
  resendInt=setInterval(()=>{
    sec--;
    secEl.textContent=sec;
    if(sec<=0){
      clearInterval(resendInt);
      link.classList.remove('disabled');
      timerEl.style.display='none';
    }
  },1000);
}

function handleResend(){
  const link=document.getElementById('resendLink');
  if(link.classList.contains('disabled'))return;
  document.getElementById('resendTimer').style.display='';
  document.getElementById('resendSec').textContent='30';
  startResendTimer();
  startCountdown();
  // reset OTP
  for(let i=0;i<6;i++){
    const el=document.getElementById('otp'+i);
    el.value='';el.className='otp-input';
  }
  document.getElementById('btnVerify').disabled=true;
  clrErr(null,'otpErr');
}

function setupOTP(){
  const inputs=[...Array(6)].map((_,i)=>document.getElementById('otp'+i));
  inputs.forEach((inp,idx)=>{
    inp.addEventListener('input',e=>{
      let v=inp.value.replace(/\D/g,'');
      // handle paste of full code
      if(v.length>1){
        const digits=v.slice(0,6);
        digits.split('').forEach((d,i)=>{if(inputs[i]){inputs[i].value=d;inputs[i].classList.add('filled')}});
        inputs[Math.min(5,digits.length-1)].focus();
        checkOTPComplete();return;
      }
      inp.value=v;
      if(v){inp.classList.add('filled');if(idx<5)inputs[idx+1].focus()}
      else{inp.classList.remove('filled')}
      checkOTPComplete();
    });
    inp.addEventListener('keydown',e=>{
      if(e.key==='Backspace'&&!inp.value&&idx>0){inputs[idx-1].focus();inputs[idx-1].value='';inputs[idx-1].classList.remove('filled')}
    });
  });
  setTimeout(()=>inputs[0].focus(),200);
}

function checkOTPComplete(){
  const full=[...Array(6)].every((_,i)=>document.getElementById('otp'+i).value!=='');
  document.getElementById('btnVerify').disabled=!full;
}

function handleVerify(){
  const code=[...Array(6)].map((_,i)=>document.getElementById('otp'+i).value).join('');
  if(code.length<6){setErr(null,'otpErr','Preencha todos os 6 dígitos!');return}
  clrErr(null,'otpErr');

  const btn=document.getElementById('btnVerify');
  btn.classList.add('loading');
  btn.innerHTML='<svg viewBox="0 0 16 16" fill="none" width="14" height="14"><rect x="7" y="1" width="2" height="4" fill="currentColor" opacity=".8"/><rect x="7" y="11" width="2" height="4" fill="currentColor" opacity=".3"/><rect x="1" y="7" width="4" height="2" fill="currentColor" opacity=".5"/><rect x="11" y="7" width="4" height="2" fill="currentColor" opacity=".5"/></svg> Verificando...';

  setTimeout(()=>{
    // animate inputs green
    for(let i=0;i<6;i++){
      const el=document.getElementById('otp'+i);
      el.className='otp-input success';
    }
    clearInterval(countdownInt);
    setTimeout(()=>{
      setStep(3);
      showPanel('p3');
    },500);
  },800);
}

function goBack(step){
  if(step===1){setStep(1);showPanel('p1');clearInterval(countdownInt);clearInterval(resendInt)}
}

/* ── STEP 3: NEW PASSWORD ── */
let pwScore=0;

function onNewPw(){
  const v=document.getElementById('newPw').value;
  clrErr('newPw','newPwErr');
  // strength
  let score=0;
  if(v.length>=8)score++;
  if(v.length>=12)score++;
  if(/[A-Z]/.test(v)&&/[0-9]/.test(v))score++;
  if(/[^A-Za-z0-9]/.test(v))score++;
  pwScore=score;
  const pips=[...Array(4)].map((_,i)=>document.getElementById('sp'+(i+1)));
  const cls=score<=1?'weak':score<=2?'medium':'strong';
  const labels={weak:'Fraca',medium:'Média',strong:'Forte'};
  pips.forEach((p,i)=>{p.className='s-pip';if(i<score)p.classList.add(cls)});
  const lbl=document.getElementById('strengthLabel');
  lbl.className='strength-label '+(v?cls:'');
  lbl.textContent=v?(labels[cls]||'—'):'—';
  // update confirm match
  if(document.getElementById('confirmPw').value)onConfirmPw();
  // update hp
  const hpPips=document.querySelectorAll('#hp3 .hp-pip');
  const hpFill=Math.min(5,Math.floor(score*1.25)+(document.getElementById('confirmPw').value===v&&v?1:0));
  hpPips.forEach((p,i)=>{
    p.className='hp-pip';
    if(i<hpFill)p.classList.add(score<=1?'fill-yellow':score<=2?'fill-accent':'fill-green');
    else p.classList.add('empty');
  });
}

function onConfirmPw(){
  const a=document.getElementById('newPw').value;
  const b=document.getElementById('confirmPw').value;
  clrErr('confirmPw','confirmPwErr');
  const m=document.getElementById('pwMatch');
  if(!b){m.className='pw-match';return}
  m.className='pw-match show '+(a===b?'ok':'no');
  m.textContent=a===b?'✓ Senhas coincidem':'✗ Senhas diferentes';
}

function togglePw(id,btn){
  const inp=document.getElementById(id);
  const isText=inp.type==='text';
  inp.type=isText?'password':'text';
  btn.style.opacity=isText?'.4':'.85';
}

function handleReset(){
  const a=document.getElementById('newPw').value;
  const b=document.getElementById('confirmPw').value;
  clrErr('newPw','newPwErr');clrErr('confirmPw','confirmPwErr');
  let ok=true;
  if(a.length<8){setErr('newPw','newPwErr','Mínimo de 8 caracteres!');ok=false}
  if(a!==b){setErr('confirmPw','confirmPwErr','As senhas não coincidem!');ok=false}
  if(!ok)return;

  const btn=document.getElementById('btnReset');
  btn.classList.add('loading');
  btn.innerHTML='<svg viewBox="0 0 16 16" fill="none" width="14" height="14"><rect x="7" y="1" width="2" height="4" fill="currentColor" opacity=".8"/><rect x="7" y="11" width="2" height="4" fill="currentColor" opacity=".3"/><rect x="1" y="7" width="4" height="2" fill="currentColor" opacity=".5"/><rect x="11" y="7" width="4" height="2" fill="currentColor" opacity=".5"/></svg> Atualizando...';

  setTimeout(()=>{
    spawnBurst();
    setTimeout(()=>{showPanel('p4')},400);
  },900);
}

/* ── BURST ── */
const COLORS=['#b44dff','#d088ff','#44ffaa','#fff','#ffbd2e'];
function spawnBurst(){
  const container=document.getElementById('particles');
  const card=document.getElementById('authCard').getBoundingClientRect();
  const cx=card.left+card.width/2, cy=card.top+card.height/2;
  for(let i=0;i<24;i++){
    const p=document.createElement('div');p.className='px-particle';
    const a=(i/24)*Math.PI*2, d=30+Math.random()*50, size=4+Math.floor(Math.random()*6);
    p.style.cssText=`background:${COLORS[i%COLORS.length]};width:${size}px;height:${size}px;left:${cx}px;top:${cy}px;--tx:${Math.cos(a)*d}px;--ty:${Math.sin(a)*d}px;animation:pxBurst ${.4+Math.random()*.3}s cubic-bezier(.15,0,.85,1) ${Math.random()*80}ms forwards`;
    container.appendChild(p);
    setTimeout(()=>p.remove(),900);
  }
}

/* ── ENTER KEY ── */
document.addEventListener('keydown',e=>{
  if(e.key!=='Enter'){return}
  if(document.getElementById('p1').classList.contains('active'))handleSendCode();
  else if(document.getElementById('p2').classList.contains('active'))handleVerify();
  else if(document.getElementById('p3').classList.contains('active'))handleReset();
});
</script>
<script src="vexus-ui.js"></script>
</body>
</html>
