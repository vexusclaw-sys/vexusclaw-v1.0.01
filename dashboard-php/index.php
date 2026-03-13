<?php require __DIR__ . '/includes/app-bootstrap.php'; ?>
<!DOCTYPE html>
<html lang="pt-BR" style="color-scheme:dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>VexusClaw - Mission Control</title>
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap" rel="stylesheet">
<style>
:root{--bg:#07030f;--bg-card:#0d0820;--border:#251a55;--accent:#b44dff;--accent2:#8a2be2;--px-s:-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000}
*{box-sizing:border-box;color:#fff}
body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--bg);font-family:'VT323',monospace}
.box{width:min(520px,92vw);padding:26px;background:var(--bg-card);border:2px solid var(--border);border-radius:8px;box-shadow:6px 6px 0 rgba(0,0,0,.45);text-align:center}
.title{font-family:'Press Start 2P',monospace;font-size:.8rem;line-height:1.8;text-shadow:var(--px-s);margin-bottom:14px}
.desc{font-size:1.35rem;color:rgba(255,255,255,.55);margin-bottom:18px}
.loader{display:inline-flex;gap:6px}
.loader span{width:12px;height:12px;border-radius:2px;background:linear-gradient(135deg,var(--accent),var(--accent2));animation:pulse 1s ease-in-out infinite}
.loader span:nth-child(2){animation-delay:.12s}
.loader span:nth-child(3){animation-delay:.24s}
@keyframes pulse{0%,100%{opacity:.35;transform:scale(.9)}50%{opacity:1;transform:scale(1.05)}}
</style>
</head>
<body>
  <div class="box">
    <div class="title">VexusClaw Mission Control</div>
    <div class="desc">Validando sua sessao e redirecionando o painel...</div>
    <div class="loader"><span></span><span></span><span></span></div>
  </div>
  <script src="/assets/vexus-api.js"></script>
  <script src="/assets/vexus-auth.js"></script>
  <script>
  (async function(){
    try {
      const session = await window.VexusAuth.getSession();
      if (!session) {
        window.location.replace('/login');
        return;
      }

      const setup = await window.VexusAuth.getSetupStatus(true);
      window.location.replace(setup && setup.isBootstrapped && !setup.isReady ? '/setup' : '/overview');
    } catch (error) {
      window.location.replace('/login');
    }
  })();
  </script>
</body>
</html>
