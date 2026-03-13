<?php
if (!isset($menuActive)) {
  $menuActive = '';
}
?>
<style id="vexus-shared-menu-style">
:root{--sidebar-w:210px;--topbar-h:48px}
.topbar{position:fixed;top:0;left:0;right:0;z-index:300;height:var(--topbar-h);background:rgba(9,5,26,.97);border-bottom:2px solid var(--border);display:flex;align-items:center;padding:0 14px;box-shadow:0 2px 0 rgba(180,77,255,.05)}
.topbar::after{content:'';position:absolute;bottom:-4px;left:0;right:0;height:2px;background:repeating-linear-gradient(90deg,var(--accent) 0,var(--accent) 4px,transparent 4px,transparent 8px);opacity:.1}
.tb-hamburger{width:32px;height:32px;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:5px;cursor:pointer;border:none;background:none;border-radius:3px;transition:.2s;flex-shrink:0}
.tb-hamburger:hover{background:rgba(180,77,255,.1)}
.tb-hamburger span{display:block;width:18px;height:2px;background:rgba(255,255,255,.5);border-radius:1px;transition:.3s}
.tb-hamburger.open span:nth-child(1){transform:translateY(7px) rotate(45deg)}
.tb-hamburger.open span:nth-child(2){opacity:0;transform:scaleX(0)}
.tb-hamburger.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
.tb-logo{display:flex;align-items:center;gap:8px;margin-left:10px;margin-right:auto}
.tb-logo{text-decoration:none;color:inherit}
.tb-logo img{width:24px;height:24px;image-rendering:pixelated;filter:drop-shadow(0 0 5px rgba(180,77,255,.5))}
.tb-logo-name{font-family:'Press Start 2P',monospace;font-size:.62rem;text-shadow:var(--px-sa)}
.tb-logo-sub{font-family:'Press Start 2P',monospace;font-size:.35rem;color:rgba(255,255,255,.28);letter-spacing:2px}
.logo-blink{color:var(--accent-bright);animation:blink .9s step-end infinite}
.tb-right{display:flex;align-items:center;gap:8px}
.tb-badge{display:flex;align-items:center;gap:5px;padding:5px 10px;background:var(--bg-surface);border:1px solid var(--border);border-radius:3px;font-family:'Press Start 2P',monospace;font-size:.4rem;text-shadow:var(--px-s);box-shadow:2px 2px 0 rgba(0,0,0,.4)}
.tb-dot{width:7px;height:7px;border-radius:2px;flex-shrink:0;box-shadow:0 0 5px currentColor}
.tb-dot.green{background:var(--green);color:var(--green)}
.tb-dot.yellow{background:var(--yellow);color:var(--yellow)}
.tb-lbl{color:rgba(255,255,255,.38)}
.tb-val{color:rgba(255,255,255,.8)}
.tb-icon-btn{width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:var(--bg-surface);border:1px solid var(--border);border-radius:3px;cursor:pointer;transition:.2s;box-shadow:2px 2px 0 rgba(0,0,0,.3)}
.tb-icon-btn:hover{border-color:var(--accent);background:rgba(180,77,255,.1)}
.tb-icon-btn svg{width:16px;height:16px;image-rendering:pixelated;opacity:.55}
.tb-icon-btn:hover svg{opacity:1}
.tb-avatar{width:32px;height:32px;background:linear-gradient(135deg,var(--accent),var(--accent2));border:2px solid var(--border);border-radius:3px;display:flex;align-items:center;justify-content:center;font-family:'Press Start 2P',monospace;font-size:.46rem;cursor:pointer;box-shadow:2px 2px 0 rgba(0,0,0,.4);flex-shrink:0;text-shadow:var(--px-s)}
.sb-overlay{display:none;position:fixed;inset:0;z-index:250;background:rgba(0,0,0,.6);backdrop-filter:blur(2px)}
.sb-overlay.show{display:block}
.update-banner{position:fixed;top:var(--topbar-h);left:var(--sidebar-w);right:0;z-index:200;padding:8px 20px;background:rgba(180,77,255,.07);border-bottom:2px solid rgba(180,77,255,.18);display:flex;align-items:center;justify-content:center;gap:12px;font-family:'Press Start 2P',monospace;font-size:.4rem;text-shadow:var(--px-s)}
.banner-text{color:var(--accent-bright);text-shadow:var(--px-sa)}
.banner-text span{color:rgba(255,255,255,.4)}
.banner-btn{padding:6px 12px;background:linear-gradient(135deg,var(--accent),var(--accent2));border:none;border-radius:3px;font-family:'Press Start 2P',monospace;font-size:.38rem;color:#fff;text-shadow:var(--px-s);cursor:pointer;box-shadow:2px 2px 0 #3d0070;transition:.15s}
.banner-btn:hover{transform:translate(-1px,-1px);box-shadow:3px 3px 0 #3d0070}
.banner-x{cursor:pointer;opacity:.35;transition:.2s;font-size:1.2rem;margin-left:4px}
.banner-x:hover{opacity:.9}
.sidebar{position:fixed;top:var(--topbar-h);left:0;bottom:0;z-index:260;width:var(--sidebar-w);background:var(--bg-sidebar);border-right:2px solid var(--border);display:flex;flex-direction:column;overflow-y:auto;overflow-x:hidden;transition:transform .25s cubic-bezier(.4,0,.2,1)}
.sidebar::-webkit-scrollbar{width:3px}
.sidebar::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}
.sg-label{display:flex;align-items:center;justify-content:space-between;padding:8px 14px 5px;font-family:'Press Start 2P',monospace;font-size:.56rem;color:rgba(255,255,255,.2);text-shadow:var(--px-s);letter-spacing:1px}
.sg-minus{color:rgba(255,255,255,.18);cursor:pointer;font-size:1rem}
.nav-item{display:flex;align-items:center;gap:8px;padding:10px 14px;cursor:pointer;transition:.15s;border-left:2px solid transparent !important;text-decoration:none;color:inherit}
.nav-item:hover{background:rgba(180,77,255,.07);border-left-color:rgba(180,77,255,.18) !important}
.nav-item.active{background:rgba(180,77,255,.12);border-left-color:var(--accent) !important}
.nav-item svg{width:16px;height:16px;image-rendering:pixelated;flex-shrink:0;opacity:.45}
.nav-item:hover svg,.nav-item.active svg{opacity:.9}
.nav-lbl{font-family:'Press Start 2P',monospace;font-size:.66rem;color:rgba(255,255,255,.45);text-shadow:var(--px-s)}
.nav-item.active .nav-lbl{color:var(--accent-bright);text-shadow:var(--px-sa)}
.nav-badge{margin-left:auto;padding:3px 7px;background:var(--accent);border-radius:2px;font-family:'Press Start 2P',monospace;font-size:.5rem;text-shadow:var(--px-s);box-shadow:1px 1px 0 #3d0070}
.px-div{height:2px;background:repeating-linear-gradient(90deg,var(--accent) 0,var(--accent) 4px,transparent 4px,transparent 8px);opacity:.1}
.sb-bottom{margin-top:auto;border-top:2px solid var(--border);padding:10px 14px;display:flex;align-items:center;gap:8px}
.sb-avatar{width:28px;height:28px;background:linear-gradient(135deg,var(--accent),var(--accent2));border-radius:3px;display:flex;align-items:center;justify-content:center;font-family:'Press Start 2P',monospace;font-size:.4rem;flex-shrink:0;text-shadow:var(--px-s)}
.sb-name{font-family:'Press Start 2P',monospace;font-size:.4rem;text-shadow:var(--px-s);display:block}
.sb-status{font-family:'VT323',monospace;font-size:1rem;color:var(--green);display:flex;align-items:center;gap:3px}
.sb-status::before{content:'';width:6px;height:6px;background:var(--green);border-radius:1px;box-shadow:0 0 4px var(--green)}
.main{position:fixed;top:calc(var(--topbar-h) + 38px);left:var(--sidebar-w);right:0;bottom:0;transition:left .25s cubic-bezier(.4,0,.2,1)}
.main.no-banner{top:var(--topbar-h)}

/* Global readability boost for all dashboard pages */
body{font-size:20px !important;line-height:1.35}
.main .page-title,.main .chat-page-title{font-size:1.04rem !important;line-height:1.35 !important}
.main .page-desc,.main .chat-page-desc{font-size:1.35rem !important;line-height:1.42 !important}
.main .card-title,.main .section-title,.main .group-title,.main .section-lbl,.main .agent-id,.main .card-hdr .title{font-size:.66rem !important;line-height:1.55 !important}
.main .card-sub,.main .section-desc,.main .notice,.main .note,.main .empty,.main .skill-desc,.main .binding-sub,.main .roles,.main .token,.main .auth,.main .log-msg,.main .ep-desc{font-size:1.14rem !important;line-height:1.45 !important}
.main .lbl,.main .filter-label,.main .skill-name,.main .binding-name,.main .agent-name,.main .agent-sub,.main .meta-tag,.main .skill-tag,.main .tag,.main .hash,.main .cfg-name,.main .item-key,.main .ep-path,.main .log-src,.main .method,.main .stat-k,.main .section-count,.main .shown-count,.main .filter-count,.main .tab,.main .btn,.main .cfg-val-lbl{font-size:.47rem !important;line-height:1.65 !important}
.main .inp,.main .filter-input,.main .api-input,.main .chat-input,.main .item-val,.main .cfg-val,.main .code,.main .stat-v{font-size:1.16rem !important;line-height:1.45 !important}
.main .hash{font-size:.44rem !important;line-height:1.72 !important}

@media(max-width:768px){
  .tb-badge,.tb-icon-btn{display:none}
  .sidebar{transform:translateX(-100%)}
  .sidebar.open{transform:translateX(0)}
  .nav-lbl{font-size:.61rem}
  .sg-label{font-size:.52rem}
  .update-banner{left:0}
  .main{left:0}
}
</style>

<div class="sb-overlay" id="sbOverlay"></div>

<header class="topbar">
  <button class="tb-hamburger" id="tbHamburger" type="button" aria-label="Abrir menu">
    <span></span><span></span><span></span>
  </button>
  <a class="tb-logo" href="/overview" style="margin-left:10px">
    <img src="https://community.aseprite.org/uploads/default/original/2X/0/0eff0e4064297cbbe7383108c2f7322c758a5e1f.gif" alt="" draggable="false">
    <div>
      <div class="tb-logo-name">VexusClaw<span class="logo-blink">_</span></div>
    </div>
  </a>
  <div class="tb-right" style="margin-left:auto">
    <div class="tb-badge"><div class="tb-dot yellow" id="tbVersionDot"></div><span class="tb-lbl">Versão</span><span class="tb-val" id="tbVersionValue">2026.3.7</span></div>
    <div class="tb-badge"><div class="tb-dot green" id="tbHealthDot"></div><span class="tb-lbl">Saúde</span><span class="tb-val" id="tbHealthValue" style="color:var(--green)">OK</span></div>
    <div class="tb-icon-btn" title="Notificações">
      <svg viewBox="0 0 16 16" fill="none"><rect x="6" y="1" width="4" height="2" fill="currentColor" opacity=".5"/><rect x="4" y="3" width="8" height="2" fill="currentColor" opacity=".4"/><rect x="2" y="5" width="12" height="7" fill="currentColor" opacity=".2"/><rect x="2" y="5" width="2" height="7" fill="currentColor" opacity=".4"/><rect x="12" y="5" width="2" height="7" fill="currentColor" opacity=".4"/><rect x="2" y="12" width="12" height="2" fill="currentColor" opacity=".4"/><rect x="6" y="14" width="4" height="2" fill="currentColor" opacity=".35"/><rect x="12" y="2" width="3" height="3" fill="var(--accent)" opacity=".9"/></svg>
    </div>
    <div class="tb-icon-btn" title="Configurações">
      <svg viewBox="0 0 16 16" fill="none"><rect x="6" y="1" width="4" height="2" fill="currentColor" opacity=".5"/><rect x="4" y="3" width="2" height="2" fill="currentColor" opacity=".5"/><rect x="10" y="3" width="2" height="2" fill="currentColor" opacity=".5"/><rect x="2" y="5" width="2" height="4" fill="currentColor" opacity=".5"/><rect x="12" y="5" width="2" height="4" fill="currentColor" opacity=".5"/><rect x="4" y="9" width="2" height="2" fill="currentColor" opacity=".5"/><rect x="10" y="9" width="2" height="2" fill="currentColor" opacity=".5"/><rect x="6" y="11" width="4" height="2" fill="currentColor" opacity=".5"/><rect x="6" y="5" width="4" height="4" fill="currentColor" opacity=".65"/><rect x="7" y="6" width="2" height="2" fill="#07030f"/></svg>
    </div>
    <div class="tb-avatar" id="tbAvatar">U</div>
  </div>
</header>

<div class="update-banner" id="updateBanner">
  <span class="banner-text"><span>Update disponível: </span>v2026.3.11 <span>(rodando v2026.3.7)</span></span>
  <button class="banner-btn">Atualizar agora ▶</button>
  <span class="banner-x" id="bannerCloseBtn">✕</span>
</div>

<script>
(function(){
  function getSidebar(){ return document.getElementById('sidebar'); }
  function getOverlay(){ return document.getElementById('sbOverlay'); }
  function getBurger(){ return document.getElementById('tbHamburger'); }
  function closeSidebar(){
    var sidebar=getSidebar(),overlay=getOverlay(),burger=getBurger();
    if(sidebar){sidebar.classList.remove('open');}
    if(overlay){overlay.classList.remove('show');}
    if(burger){burger.classList.remove('open');}
  }
  function toggleSidebar(){
    var sidebar=getSidebar(),overlay=getOverlay(),burger=getBurger();
    if(!sidebar){return;}
    var willOpen=!sidebar.classList.contains('open');
    if(willOpen){
      sidebar.classList.add('open');
      if(overlay){overlay.classList.add('show');}
      if(burger){burger.classList.add('open');}
    }else{
      closeSidebar();
    }
  }
  window.vexusCloseBanner=function(){
    var banner=document.getElementById('updateBanner');
    if(banner){banner.style.display='none';}
    document.querySelectorAll('.main').forEach(function(el){el.classList.add('no-banner');});
  };
  document.addEventListener('DOMContentLoaded',function(){
    var burger=getBurger(),overlay=getOverlay(),closeBtn=document.getElementById('bannerCloseBtn');
    if(burger){burger.addEventListener('click',toggleSidebar);}
    if(overlay){overlay.addEventListener('click',closeSidebar);}
    if(closeBtn){closeBtn.addEventListener('click',window.vexusCloseBanner);}
    document.querySelectorAll('#sidebar .nav-item').forEach(function(item){
      item.addEventListener('click',function(){ if(window.innerWidth<=768){closeSidebar();} });
    });
    window.addEventListener('resize',function(){ if(window.innerWidth>768){closeSidebar();} });
  });
})();
</script>
