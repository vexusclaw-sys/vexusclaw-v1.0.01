<!DOCTYPE html>
<html lang="pt-BR" data-theme="dark" style="color-scheme:dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>VexusClaw — Login</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap" rel="stylesheet">
<style>
:root{
  --bg:#07030f;--bg-card:#0d0820;--bg-surface:#110c28;
  --border:#251a55;
  --accent:#b44dff;--accent2:#8a2be2;--accent-bright:#d088ff;
  --green:#44ffaa;
  --px-s:-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000;
  --px-sa:-1px -1px 0 #3d0070,1px -1px 0 #3d0070,-1px 1px 0 #3d0070,1px 1px 0 #3d0070;
  --topbar-h:56px;
}
*{margin:0;padding:0;box-sizing:border-box;color:#fff}
html{scroll-behavior:smooth}
body{background:var(--bg);font-family:'VT323',monospace;font-size:18px;line-height:1.65;overflow-x:hidden;min-height:100vh;display:flex;flex-direction:column;padding-top:var(--topbar-h)}
::selection{background:var(--accent2);color:#fff}
a{color:#fff;text-decoration:none}

/* dither */
body::before{content:'';position:fixed;inset:0;z-index:0;pointer-events:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect x='0' y='0' width='1' height='1' fill='%23ffffff' opacity='0.012'/%3E%3Crect x='2' y='2' width='1' height='1' fill='%23ffffff' opacity='0.012'/%3E%3C/svg%3E");background-size:4px 4px}
/* scanlines */
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

/* ===== MAIN LAYOUT ===== */
.auth-wrap{position:relative;z-index:1;flex:1;display:flex;align-items:center;justify-content:center;padding:40px 20px}

/* ===== CARD ===== */
.auth-card{width:100%;max-width:440px;background:var(--bg-card);border:2px solid var(--border);box-shadow:6px 6px 0 rgba(0,0,0,.6),0 0 60px rgba(180,77,255,.07);border-radius:8px;overflow:hidden;position:relative;animation:cardIn .6s cubic-bezier(.16,1,.3,1) both}
@keyframes cardIn{from{opacity:0;transform:translateY(30px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}

/* top pixel bar */
.auth-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:repeating-linear-gradient(90deg,var(--accent) 0,var(--accent) 4px,transparent 4px,transparent 8px)}
/* bottom pixel bar */
.auth-card::after{content:'';position:absolute;bottom:0;left:0;right:0;height:2px;background:repeating-linear-gradient(90deg,var(--accent2) 0,var(--accent2) 4px,transparent 4px,transparent 8px);opacity:.5}

/* pixel corners */
.px-corner{position:absolute;width:6px;height:6px;background:var(--accent);opacity:.4;border-radius:1px;z-index:2}
.px-corner.tl{top:-1px;left:-1px}
.px-corner.tr{top:-1px;right:-1px}
.px-corner.bl{bottom:-1px;left:-1px}
.px-corner.br{bottom:-1px;right:-1px}

/* ===== PANEL HEADER ===== */
.auth-header{text-align:center;padding:36px 36px 28px}
.auth-logo-wrap{display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:22px}
.auth-logo{width:44px;height:44px;image-rendering:pixelated;filter:drop-shadow(0 0 14px rgba(180,77,255,.6));animation:float 4s ease-in-out infinite}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
.auth-brand{font-family:'Press Start 2P',monospace;font-size:.7rem;text-shadow:var(--px-sa)}

.auth-title{font-family:'Press Start 2P',monospace;font-size:.82rem;font-weight:400;line-height:1.8;text-shadow:var(--px-s);margin-bottom:10px}
.auth-desc{font-family:'VT323',monospace;font-size:1.15rem;color:rgba(255,255,255,.45);line-height:1.4}

/* ===== HP BAR (decorative) ===== */
.auth-hp{display:flex;align-items:center;justify-content:center;gap:4px;margin-top:14px}
.auth-hp-label{font-family:'Press Start 2P',monospace;font-size:.35rem;color:var(--accent-bright);text-shadow:var(--px-sa);margin-right:3px}
.hp-pip{width:11px;height:11px;background:var(--accent);border:2px solid rgba(0,0,0,.5);border-radius:2px;box-shadow:1px 1px 0 rgba(0,0,0,.4)}
.hp-pip.empty{background:transparent;border-color:rgba(255,255,255,.1)}

/* ===== BODY ===== */
.auth-body{padding:0 36px 36px}

/* ===== GOOGLE BTN ===== */
.btn-google{width:100%;display:flex;align-items:center;justify-content:center;gap:10px;padding:14px 20px;background:var(--bg-surface);border:2px solid var(--border);box-shadow:3px 3px 0 rgba(0,0,0,.5);border-radius:5px;cursor:pointer;transition:.2s;font-family:'Press Start 2P',monospace;font-size:.46rem;text-shadow:var(--px-s);color:rgba(255,255,255,.85);position:relative;overflow:hidden}
.btn-google:hover{border-color:rgba(255,255,255,.25);box-shadow:4px 4px 0 rgba(0,0,0,.6);transform:translate(-1px,-1px);color:#fff}
.btn-google:active{transform:translate(1px,1px);box-shadow:1px 1px 0 rgba(0,0,0,.4)}
.btn-google svg{width:20px;height:20px;flex-shrink:0;image-rendering:pixelated}

/* ===== DIVIDER ===== */
.auth-divider{display:flex;align-items:center;gap:12px;margin:20px 0}
.auth-divider::before,.auth-divider::after{content:'';flex:1;height:1px;background:repeating-linear-gradient(90deg,var(--border) 0,var(--border) 4px,transparent 4px,transparent 8px)}
.auth-divider span{font-family:'Press Start 2P',monospace;font-size:.38rem;color:rgba(255,255,255,.25);text-shadow:var(--px-s);flex-shrink:0}

/* ===== FORM FIELDS ===== */
.field{margin-bottom:16px}
.field-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px}
.field-label{font-family:'Press Start 2P',monospace;font-size:.44rem;color:rgba(255,255,255,.7);text-shadow:var(--px-s)}
.field-link{font-family:'Press Start 2P',monospace;font-size:.38rem;color:var(--accent-bright);text-shadow:var(--px-sa);transition:.2s;cursor:pointer}
.field-link:hover{color:#fff}

.field input{width:100%;padding:13px 14px;background:rgba(7,3,15,.8);border:2px solid var(--border);box-shadow:inset 2px 2px 0 rgba(0,0,0,.4),3px 3px 0 rgba(0,0,0,.3);border-radius:4px;font-family:'VT323',monospace;font-size:1.15rem;color:#fff;outline:none;transition:.2s;-webkit-appearance:none}
.field input:focus{border-color:var(--accent);box-shadow:inset 2px 2px 0 rgba(0,0,0,.4),3px 3px 0 rgba(100,30,200,.3),0 0 0 3px rgba(180,77,255,.08)}
.field input::placeholder{color:rgba(255,255,255,.2)}
.field input:focus::placeholder{color:rgba(255,255,255,.1)}

/* password toggle */
.field-pw{position:relative}
.field-pw input{padding-right:44px}
.pw-toggle{position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;padding:4px;opacity:.4;transition:.2s}
.pw-toggle:hover{opacity:.9}
.pw-toggle svg{width:18px;height:18px;image-rendering:pixelated}

/* ===== SUBMIT BTN ===== */
.btn-submit{width:100%;padding:15px 20px;background:linear-gradient(135deg,var(--accent),var(--accent2));border:none;border-radius:5px;font-family:'Press Start 2P',monospace;font-size:.52rem;text-shadow:var(--px-s);color:#fff;cursor:pointer;transition:.2s;box-shadow:4px 4px 0 #3d0070;margin-top:6px;display:flex;align-items:center;justify-content:center;gap:8px;letter-spacing:1px}
.btn-submit:hover{transform:translate(-1px,-1px);box-shadow:5px 5px 0 #3d0070}
.btn-submit:active{transform:translate(2px,2px);box-shadow:1px 1px 0 #3d0070}
.btn-submit svg{width:14px;height:14px;image-rendering:pixelated}

/* pulse on focus */
.btn-submit.pulse{animation:btnPulse .3s ease-out}
@keyframes btnPulse{0%{transform:scale(1)}50%{transform:scale(1.02) translate(-1px,-1px)}100%{transform:scale(1)}}

/* ===== TERMS ===== */
.auth-terms{font-family:'VT323',monospace;font-size:.95rem;color:rgba(255,255,255,.3);text-align:center;margin-top:16px;line-height:1.5}
.auth-terms a{color:rgba(180,77,255,.7);text-decoration:underline;text-underline-offset:2px}
.auth-terms a:hover{color:var(--accent-bright)}

/* ===== SWITCH PANEL ===== */
.auth-switch{background:rgba(7,3,15,.5);border-top:2px solid var(--border);padding:18px 36px;text-align:center;font-family:'VT323',monospace;font-size:1.1rem;color:rgba(255,255,255,.45)}
.auth-switch a,.auth-switch span.switch-link{color:var(--accent-bright);cursor:pointer;transition:.2s;font-family:'Press Start 2P',monospace;font-size:.44rem;text-shadow:var(--px-sa)}
.auth-switch a:hover,.auth-switch span.switch-link:hover{color:#fff}

/* ===== ERROR / SUCCESS states ===== */
.field input.error{border-color:#ff4444;box-shadow:inset 2px 2px 0 rgba(0,0,0,.4),3px 3px 0 rgba(255,68,68,.2)}
.field-error{font-family:'Press Start 2P',monospace;font-size:.36rem;color:#ff6666;text-shadow:0 0 6px rgba(255,68,68,.3);margin-top:5px;display:none}
.field-error.show{display:block}

/* pixel scan line on card */
.card-scanline{position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,rgba(180,77,255,.35),transparent);animation:scanCard 3s ease-in-out infinite;pointer-events:none;z-index:3}
@keyframes scanCard{0%{top:-2px;opacity:0}10%{opacity:1}90%{opacity:.5}100%{top:100%;opacity:0}}

/* ===== PANELS ===== */
.panel{display:none}
.panel.active{display:block;animation:panelIn .4s cubic-bezier(.16,1,.3,1) both}
@keyframes panelIn{from{opacity:0;transform:translateX(12px)}to{opacity:1;transform:translateX(0)}}

/* ===== STRENGTH BAR ===== */
.pw-strength{margin-top:8px;display:none}
.pw-strength.show{display:block}
.strength-pips{display:flex;gap:4px;margin-bottom:4px}
.s-pip{flex:1;height:6px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.06);border-radius:1px;transition:.3s}
.s-pip.weak{background:#ff4444;border-color:#ff2222}
.s-pip.medium{background:#ffbd2e;border-color:#e6a800}
.s-pip.strong{background:var(--green);border-color:#22cc88}
.strength-label{font-family:'Press Start 2P',monospace;font-size:.33rem;color:rgba(255,255,255,.3)}
.strength-label.weak{color:#ff6666}
.strength-label.medium{color:#ffbd2e}
.strength-label.strong{color:var(--green)}

/* ===== RESPONSIVE ===== */
@media(max-width:480px){
  .auth-card{max-width:100%}
  .auth-header{padding:28px 22px 20px}
  .auth-body{padding:0 22px 28px}
  .auth-switch{padding:16px 22px}
  .auth-title{font-size:.65rem}
  .auth-brand{font-size:.55rem}
}
</style>
</head>
<body>

<div class="stars" id="stars"></div>
<div class="nebula"></div>
<div class="orbs" id="orbs"></div>

<!-- TOPBAR -->
<nav class="topbar">
  <a href="index.php#top" class="topbar-logo">
    <img src="https://community.aseprite.org/uploads/default/original/2X/0/0eff0e4064297cbbe7383108c2f7322c758a5e1f.gif" alt="VexusClaw" draggable="false">
    VexusClaw<span class="logo-blink">_</span>
  </a>
  <a href="index.php#top" class="topbar-back">
    <svg viewBox="0 0 14 14" fill="none">
      <rect x="0" y="6" width="10" height="2" fill="currentColor"/>
      <rect x="2" y="4" width="2" height="2" fill="currentColor"/>
      <rect x="2" y="8" width="2" height="2" fill="currentColor"/>
      <rect x="4" y="2" width="2" height="2" fill="currentColor"/>
      <rect x="4" y="10" width="2" height="2" fill="currentColor"/>
    </svg>
    Voltar
  </a>
</nav>

<!-- AUTH WRAP -->
<div class="auth-wrap">
  <div class="auth-card" id="authCard">
    <div class="px-corner tl"></div>
    <div class="px-corner tr"></div>
    <div class="px-corner bl"></div>
    <div class="px-corner br"></div>
    <div class="card-scanline"></div>

    <!-- ══════ LOGIN PANEL ══════ -->
    <div class="panel active" id="panelLogin">
      <div class="auth-header">
        <div class="auth-logo-wrap">
          <img src="https://community.aseprite.org/uploads/default/original/2X/0/0eff0e4064297cbbe7383108c2f7322c758a5e1f.gif"
            class="auth-logo" alt="VexusClaw" draggable="false">
          <span class="auth-brand">VexusClaw</span>
        </div>
        <h1 class="auth-title">Bem-vindo de volta</h1>
        <p class="auth-desc">Faça login na sua conta VexusClaw</p>
        <div class="auth-hp">
          <span class="auth-hp-label">HP</span>
          <div class="hp-pip" id="lhp1"></div>
          <div class="hp-pip" id="lhp2"></div>
          <div class="hp-pip" id="lhp3"></div>
          <div class="hp-pip empty" id="lhp4"></div>
          <div class="hp-pip empty" id="lhp5"></div>
        </div>
      </div>

      <div class="auth-body">
        <!-- Google -->
        <button class="btn-google" onclick="handleGoogle()">
          <!-- pixel G icon -->
          <svg viewBox="0 0 20 20" fill="none">
            <rect x="10" y="9" width="7" height="2" fill="#4285F4"/>
            <rect x="15" y="7" width="2" height="2" fill="#4285F4"/>
            <rect x="15" y="11" width="2" height="2" fill="#4285F4" opacity=".6"/>
            <rect x="3" y="7" width="7" height="2" fill="#EA4335" opacity=".8"/>
            <rect x="3" y="5" width="5" height="2" fill="#EA4335" opacity=".6"/>
            <rect x="5" y="3" width="5" height="2" fill="#FBBC05" opacity=".8"/>
            <rect x="3" y="11" width="4" height="2" fill="#34A853" opacity=".8"/>
            <rect x="5" y="13" width="4" height="2" fill="#34A853" opacity=".6"/>
            <rect x="7" y="15" width="4" height="2" fill="#34A853" opacity=".4"/>
          </svg>
          Continuar com Google
        </button>

        <!-- Divider -->
        <div class="auth-divider"><span>ou</span></div>

        <!-- Email -->
        <div class="field">
          <div class="field-row"><label class="field-label">E-mail</label></div>
          <input type="email" id="loginEmail" placeholder="nome@exemplo.com" autocomplete="email">
          <div class="field-error" id="loginEmailErr">Email inválido!</div>
        </div>

        <!-- Password -->
        <div class="field">
          <div class="field-row">
            <label class="field-label">Senha</label>
            <span class="field-link" onclick="showForgot()">Esqueceu a senha?</span>
          </div>
          <div class="field-pw">
            <input type="password" id="loginPw" placeholder="••••••••" autocomplete="current-password">
            <button class="pw-toggle" onclick="togglePw('loginPw',this)" type="button" aria-label="Mostrar senha">
              <svg viewBox="0 0 18 18" fill="none" id="eyeLogin">
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
          <div class="field-error" id="loginPwErr">Senha incorreta!</div>
        </div>

        <!-- Submit -->
        <button class="btn-submit" onclick="handleLogin()" id="btnLogin">
          <svg viewBox="0 0 14 14" fill="none">
            <rect x="2" y="6" width="8" height="2" fill="currentColor"/>
            <rect x="8" y="4" width="2" height="2" fill="currentColor"/>
            <rect x="8" y="8" width="2" height="2" fill="currentColor"/>
            <rect x="10" y="2" width="2" height="2" fill="currentColor"/>
            <rect x="10" y="10" width="2" height="2" fill="currentColor"/>
          </svg>
          Entrar
        </button>

        <p class="auth-terms">Ao continuar, você concorda com nossos
          <a href="#">Termos de Serviço</a> e <a href="#">Política de Privacidade</a>
        </p>
      </div>

      <div class="auth-switch">
        Não tem uma conta? <span class="switch-link" onclick="switchTo('register')">Cadastre-se ▶</span>
      </div>
    </div>

    <!-- ══════ REGISTER PANEL ══════ -->
    <div class="panel" id="panelRegister">
      <div class="auth-header">
        <div class="auth-logo-wrap">
          <img src="https://community.aseprite.org/uploads/default/original/2X/0/0eff0e4064297cbbe7383108c2f7322c758a5e1f.gif"
            class="auth-logo" alt="VexusClaw" draggable="false">
          <span class="auth-brand">VexusClaw</span>
        </div>
        <h1 class="auth-title">Criar uma conta</h1>
        <p class="auth-desc">Seu assistente pessoal de IA aguarda</p>
        <div class="auth-hp">
          <span class="auth-hp-label">HP</span>
          <div class="hp-pip empty" id="rhp1"></div>
          <div class="hp-pip empty" id="rhp2"></div>
          <div class="hp-pip empty" id="rhp3"></div>
          <div class="hp-pip empty" id="rhp4"></div>
          <div class="hp-pip empty" id="rhp5"></div>
        </div>
      </div>

      <div class="auth-body">
        <!-- Google -->
        <button class="btn-google" onclick="handleGoogle()">
          <svg viewBox="0 0 20 20" fill="none">
            <rect x="10" y="9" width="7" height="2" fill="#4285F4"/>
            <rect x="15" y="7" width="2" height="2" fill="#4285F4"/>
            <rect x="15" y="11" width="2" height="2" fill="#4285F4" opacity=".6"/>
            <rect x="3" y="7" width="7" height="2" fill="#EA4335" opacity=".8"/>
            <rect x="3" y="5" width="5" height="2" fill="#EA4335" opacity=".6"/>
            <rect x="5" y="3" width="5" height="2" fill="#FBBC05" opacity=".8"/>
            <rect x="3" y="11" width="4" height="2" fill="#34A853" opacity=".8"/>
            <rect x="5" y="13" width="4" height="2" fill="#34A853" opacity=".6"/>
            <rect x="7" y="15" width="4" height="2" fill="#34A853" opacity=".4"/>
          </svg>
          Continuar com Google
        </button>

        <div class="auth-divider"><span>ou</span></div>

        <div class="field">
          <div class="field-row"><label class="field-label">Nome do workspace</label></div>
          <input type="text" id="regWorkspaceName" placeholder="Minha operacao VEXUSCLAW" autocomplete="organization">
        </div>

        <div class="field">
          <div class="field-row"><label class="field-label">Seu nome</label></div>
          <input type="text" id="regAdminName" placeholder="Joao Luiz" autocomplete="name">
        </div>

        <!-- Email -->
        <div class="field">
          <div class="field-row"><label class="field-label">E-mail</label></div>
          <input type="email" id="regEmail" placeholder="nome@exemplo.com" autocomplete="email" oninput="updateRegHP()">
          <div class="field-error" id="regEmailErr">Email inválido!</div>
        </div>

        <!-- Password -->
        <div class="field">
          <div class="field-row"><label class="field-label">Senha</label></div>
          <div class="field-pw">
            <input type="password" id="regPw" placeholder="••••••••" autocomplete="new-password" oninput="checkStrength(this.value);updateRegHP()">
            <button class="pw-toggle" onclick="togglePw('regPw',this)" type="button" aria-label="Mostrar senha">
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
          <div class="field-error" id="regPwErr">Mínimo 6 caracteres!</div>
        </div>

        <!-- Submit -->
        <button class="btn-submit" onclick="handleRegister()" id="btnRegister">
          <svg viewBox="0 0 14 14" fill="none">
            <rect x="6" y="1" width="2" height="12" fill="currentColor"/>
            <rect x="1" y="6" width="12" height="2" fill="currentColor"/>
          </svg>
          Criar conta
        </button>

        <p class="auth-terms">Ao continuar, você concorda com nossos
          <a href="#">Termos de Serviço</a> e <a href="#">Política de Privacidade</a>
        </p>
      </div>

      <div class="auth-switch">
        Já tem uma conta? <span class="switch-link" onclick="switchTo('login')">Entrar ▶</span>
      </div>
    </div>

    <!-- ══════ FORGOT PANEL ══════ -->
    <div class="panel" id="panelForgot">
      <div class="auth-header">
        <div class="auth-logo-wrap">
          <img src="https://community.aseprite.org/uploads/default/original/2X/0/0eff0e4064297cbbe7383108c2f7322c758a5e1f.gif"
            class="auth-logo" alt="VexusClaw" draggable="false">
          <span class="auth-brand">VexusClaw</span>
        </div>
        <h1 class="auth-title">Recuperar Senha</h1>
        <p class="auth-desc">Enviaremos um link de redefinição</p>
        <div class="auth-hp">
          <span class="auth-hp-label">HP</span>
          <div class="hp-pip" style="background:#ffbd2e;border-color:rgba(0,0,0,.5)"></div>
          <div class="hp-pip empty"></div>
          <div class="hp-pip empty"></div>
          <div class="hp-pip empty"></div>
          <div class="hp-pip empty"></div>
        </div>
      </div>
      <div class="auth-body">
        <div class="field">
          <div class="field-row"><label class="field-label">E-mail da conta</label></div>
          <input type="email" id="forgotEmail" placeholder="nome@exemplo.com">
          <div class="field-error" id="forgotEmailErr">Email inválido!</div>
        </div>
        <button class="btn-submit" onclick="handleForgot()">
          <svg viewBox="0 0 14 14" fill="none">
            <rect x="2" y="6" width="8" height="2" fill="currentColor"/>
            <rect x="8" y="4" width="2" height="2" fill="currentColor"/>
            <rect x="8" y="8" width="2" height="2" fill="currentColor"/>
            <rect x="10" y="2" width="2" height="2" fill="currentColor"/>
            <rect x="10" y="10" width="2" height="2" fill="currentColor"/>
          </svg>
          Enviar Link
        </button>
        <p class="auth-terms" style="margin-top:12px"></p>
      </div>
      <div class="auth-switch">
        <span class="switch-link" onclick="switchTo('login')">◀ Voltar ao login</span>
      </div>
    </div>

    <!-- ══════ SUCCESS PANEL ══════ -->
    <div class="panel" id="panelSuccess">
      <div class="auth-header" style="padding-bottom:36px">
        <div class="auth-logo-wrap">
          <img src="https://community.aseprite.org/uploads/default/original/2X/0/0eff0e4064297cbbe7383108c2f7322c758a5e1f.gif"
            class="auth-logo" alt="VexusClaw" draggable="false" style="animation:spin .6s steps(8) infinite">
          <span class="auth-brand">VexusClaw</span>
        </div>
        <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
        <h1 class="auth-title" style="color:var(--green);text-shadow:0 0 20px rgba(68,255,170,.4)">Link enviado!</h1>
        <p class="auth-desc" style="color:rgba(68,255,170,.6)">Verifique sua caixa de entrada</p>
        <div class="auth-hp" style="margin-top:18px">
          <span class="auth-hp-label">HP</span>
          <div class="hp-pip" style="background:var(--green)"></div>
          <div class="hp-pip" style="background:var(--green)"></div>
          <div class="hp-pip" style="background:var(--green)"></div>
          <div class="hp-pip" style="background:var(--green)"></div>
          <div class="hp-pip" style="background:var(--green)"></div>
        </div>
      </div>
      <div class="auth-switch">
        <span class="switch-link" onclick="switchTo('login')">◀ Voltar ao login</span>
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

/* ── PANEL SWITCH ── */
function switchTo(name){
  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
  const map={login:'panelLogin',register:'panelRegister',forgot:'panelForgot',success:'panelSuccess'};
  const el=document.getElementById(map[name]);
  if(el){el.classList.add('active');el.style.animation='none';void el.offsetWidth;el.style.animation=''}
}

/* ── TOGGLE PW ── */
function togglePw(id,btn){
  const inp=document.getElementById(id);
  const isText=inp.type==='text';
  inp.type=isText?'password':'text';
  btn.style.opacity=isText?'.4':'.85';
}

/* ── VALIDATION ── */
function isEmail(v){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)}

function showError(inputId,errId,msg){
  const i=document.getElementById(inputId);
  const e=document.getElementById(errId);
  i.classList.add('error');
  if(msg&&e){e.textContent=msg;e.classList.add('show')}
  return false;
}
function clearError(inputId,errId){
  const i=document.getElementById(inputId);
  const e=document.getElementById(errId);
  if(i)i.classList.remove('error');
  if(e)e.classList.remove('show');
}

/* ── LOGIN ── */
function handleLogin(){
  const email=document.getElementById('loginEmail').value;
  const pw=document.getElementById('loginPw').value;
  clearError('loginEmail','loginEmailErr');
  clearError('loginPw','loginPwErr');
  let ok=true;
  if(!isEmail(email)){showError('loginEmail','loginEmailErr','Email inválido!');ok=false}
  if(pw.length<1){showError('loginPw','loginPwErr','Digite sua senha!');ok=false}
  if(ok){
    const btn=document.getElementById('btnLogin');
    btn.textContent='Entrando...';
    btn.classList.add('pulse');
    setTimeout(()=>{btn.textContent='Entrar';btn.classList.remove('pulse')},1800);
  }
}

/* ── REGISTER ── */
let regScore=0;
function updateRegHP(){
  const email=document.getElementById('regEmail').value;
  const pw=document.getElementById('regPw').value;
  const score=Math.min(5,(isEmail(email)?2:0)+(pw.length>=6?1:0)+(pw.length>=10?1:0)+(regScore>=3?1:0));
  const pips=['rhp1','rhp2','rhp3','rhp4','rhp5'];
  pips.forEach((id,i)=>{
    const el=document.getElementById(id);
    if(!el)return;
    if(i<score){el.classList.remove('empty');el.style.background='var(--accent)'}
    else{el.classList.add('empty');el.style.background=''}
  });
}

function checkStrength(v){
  const bar=document.getElementById('pwStrength');
  const label=document.getElementById('strengthLabel');
  const pips=[document.getElementById('sp1'),document.getElementById('sp2'),document.getElementById('sp3'),document.getElementById('sp4')];
  if(!v){bar.classList.remove('show');return}
  bar.classList.add('show');
  let score=0;
  if(v.length>=6)score++;
  if(v.length>=10)score++;
  if(/[A-Z]/.test(v)&&/[0-9]/.test(v))score++;
  if(/[^A-Za-z0-9]/.test(v))score++;
  regScore=score;
  const cls=score<=1?'weak':score<=2?'medium':'strong';
  const labels={weak:'Fraca',medium:'Média',strong:'Forte'};
  pips.forEach((p,i)=>{
    p.className='s-pip';
    if(i<score)p.classList.add(cls);
  });
  label.className='strength-label '+cls;
  label.textContent=labels[cls]||'—';
  updateRegHP();
}

function handleRegister(){
  const email=document.getElementById('regEmail').value;
  const pw=document.getElementById('regPw').value;
  clearError('regEmail','regEmailErr');
  clearError('regPw','regPwErr');
  let ok=true;
  if(!isEmail(email)){showError('regEmail','regEmailErr','Email inválido!');ok=false}
  if(pw.length<6){showError('regPw','regPwErr','Mínimo 6 caracteres!');ok=false}
  if(ok){
    const btn=document.getElementById('btnRegister');
    btn.textContent='Criando...';
    btn.classList.add('pulse');
    setTimeout(()=>{btn.textContent='Criar conta';btn.classList.remove('pulse')},1800);
  }
}

/* ── FORGOT ── */
function showForgot(){switchTo('forgot')}
function handleForgot(){
  const email=document.getElementById('forgotEmail').value;
  clearError('forgotEmail','forgotEmailErr');
  if(!isEmail(email)){showError('forgotEmail','forgotEmailErr','Email inválido!');return}
  switchTo('success');
}

/* ── GOOGLE ── */
function handleGoogle(){
  const btn=event.currentTarget;
  const orig=btn.innerHTML;
  btn.innerHTML='<svg viewBox="0 0 20 20" fill="none" width="20" height="20"><rect x="9" y="2" width="2" height="16" fill="rgba(255,255,255,.2)"/><rect x="2" y="9" width="16" height="2" fill="rgba(255,255,255,.2)"/></svg> Conectando...';
  setTimeout(()=>{btn.innerHTML=orig},1600);
}

/* ── ENTER KEY ── */
document.addEventListener('keydown',e=>{
  if(e.key!=='Enter')return;
  if(document.getElementById('panelLogin').classList.contains('active'))handleLogin();
  else if(document.getElementById('panelRegister').classList.contains('active'))handleRegister();
  else if(document.getElementById('panelForgot').classList.contains('active'))handleForgot();
});

/* ── URL PARAM: ?mode=register ── */
if(new URLSearchParams(location.search).get('mode')==='register')switchTo('register');
</script>
<script src="/assets/vexus-api.js"></script>
<script src="/assets/vexus-auth.js"></script>
<script src="/assets/pages/login.js"></script>
<script src="vexus-ui.js"></script>
</body>
</html>
