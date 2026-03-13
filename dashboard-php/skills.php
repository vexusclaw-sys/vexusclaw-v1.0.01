<?php $menuActive = 'skills'; ?>
<!DOCTYPE html>
<html lang="pt-BR" style="color-scheme:dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>VexusClaw - Habilidades</title>
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap" rel="stylesheet">
<style>
:root{
  --bg:#07030f;--bg-card:#0d0820;--bg-surface:#110c28;--bg-input:#0a0618;
  --border:#251a55;--border-light:#1a1035;
  --accent:#b44dff;--accent2:#8a2be2;--accent-bright:#d088ff;
  --green:#44ffaa;--yellow:#ffbd2e;--red:#ff4444;
  --px-s:-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000;
  --px-sa:-1px -1px 0 #3d0070,1px -1px 0 #3d0070,-1px 1px 0 #3d0070,1px 1px 0 #3d0070;
}
*{margin:0;padding:0;box-sizing:border-box;color:#fff}
html,body{height:100%;overflow:hidden}
body{background:var(--bg);font-family:'VT323',monospace;font-size:18px}
input,button{font-family:inherit}
body::before{content:'';position:fixed;inset:0;z-index:0;pointer-events:none;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect x='0' y='0' width='1' height='1' fill='%23ffffff' opacity='0.007'/%3E%3Crect x='2' y='2' width='1' height='1' fill='%23ffffff' opacity='0.007'/%3E%3C/svg%3E");
  background-size:4px 4px}

.main{display:flex;flex-direction:column;overflow:hidden}
.page-hdr{padding:18px 24px 14px;border-bottom:2px solid var(--border);background:rgba(9,5,26,.55);display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap}
.page-title{font-family:'Press Start 2P',monospace;font-size:.86rem;text-shadow:var(--px-s);margin-bottom:6px}
.page-desc{font-family:'VT323',monospace;font-size:1.2rem;color:rgba(255,255,255,.42)}
.page-body{padding:14px 18px 18px;flex:1;overflow:auto}
.page-body::-webkit-scrollbar{width:5px}
.page-body::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}

.card{background:var(--bg-card);border:2px solid var(--border);border-radius:6px;box-shadow:4px 4px 0 rgba(0,0,0,.5);overflow:hidden;position:relative}
.card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:repeating-linear-gradient(90deg,var(--accent) 0,var(--accent) 4px,transparent 4px,transparent 8px);opacity:.22}
.card-hdr{padding:14px 16px 12px;border-bottom:2px solid var(--border-light);display:flex;align-items:flex-start;justify-content:space-between;gap:10px;flex-wrap:wrap}
.card-title{font-family:'Press Start 2P',monospace;font-size:.72rem;text-shadow:var(--px-s);line-height:1.5}
.card-sub{font-family:'VT323',monospace;font-size:1.18rem;color:rgba(255,255,255,.4);line-height:1.4}

.toolbar{padding:12px 16px;border-bottom:2px solid var(--border-light);display:flex;align-items:flex-end;justify-content:space-between;gap:10px;flex-wrap:wrap}
.filter-box{display:flex;flex-direction:column;gap:6px}
.filter-label{font-family:'Press Start 2P',monospace;font-size:.44rem;color:rgba(255,255,255,.5);text-shadow:var(--px-s)}
.filter-input{width:360px;max-width:100%;padding:9px 11px;background:var(--bg-input);border:2px solid var(--border);border-radius:4px;box-shadow:inset 2px 2px 0 rgba(0,0,0,.35),2px 2px 0 rgba(0,0,0,.25);font-family:'VT323',monospace;font-size:1.15rem;outline:none}
.filter-input:focus{border-color:var(--accent)}
.shown-count{font-family:'Press Start 2P',monospace;font-size:.44rem;color:rgba(255,255,255,.45)}

.section{padding:14px 16px 16px;border-bottom:2px solid var(--border-light)}
.section:last-child{border-bottom:none}
.section-hdr{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-bottom:10px}
.section-title{font-family:'Press Start 2P',monospace;font-size:.6rem;text-shadow:var(--px-s)}
.section-count{font-family:'Press Start 2P',monospace;font-size:.52rem;color:rgba(255,255,255,.55)}

.skill-list{display:flex;flex-direction:column;gap:10px}
.skill-item{padding:12px 12px;background:var(--bg-surface);border:1px solid var(--border);border-radius:4px;box-shadow:2px 2px 0 rgba(0,0,0,.3)}
.skill-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;flex-wrap:wrap}
.skill-name{font-family:'Press Start 2P',monospace;font-size:.48rem;text-shadow:var(--px-s);margin-bottom:7px;line-height:1.8}
.skill-desc{font-family:'VT323',monospace;font-size:1.18rem;color:rgba(255,255,255,.72);line-height:1.45}
.skill-meta{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-top:8px}
.tag{padding:3px 7px;border-radius:3px;font-family:'Press Start 2P',monospace;font-size:.38rem;border:1px solid}
.tag.scope{border-color:rgba(255,255,255,.2);background:rgba(255,255,255,.06);color:rgba(255,255,255,.65)}
.tag.eligible{border-color:rgba(68,255,170,.35);background:rgba(68,255,170,.08);color:var(--green)}
.tag.blocked{border-color:rgba(255,68,68,.35);background:rgba(255,68,68,.08);color:var(--red)}
.tag.bundled{border-color:rgba(255,255,255,.2);background:rgba(180,77,255,.1);color:var(--accent-bright)}
.skill-missing{margin-top:7px;font-family:'VT323',monospace;font-size:1.12rem;color:var(--yellow)}
.skill-extra{margin-top:8px;display:flex;gap:7px;flex-wrap:wrap}
.api-row{margin-top:8px;display:flex;gap:7px;flex-wrap:wrap}
.api-input{padding:8px 10px;min-width:240px;background:var(--bg-input);border:2px solid var(--border);border-radius:4px;font-family:'VT323',monospace;font-size:1.05rem;outline:none}
.api-input:focus{border-color:var(--accent)}

.btn{padding:8px 11px;border:2px solid var(--border);border-radius:4px;font-family:'Press Start 2P',monospace;font-size:.42rem;text-shadow:var(--px-s);cursor:pointer;transition:.2s;box-shadow:2px 2px 0 rgba(0,0,0,.35);background:var(--bg-surface);color:#fff}
.btn:hover{border-color:var(--accent);background:rgba(180,77,255,.1)}
.btn-primary{background:linear-gradient(135deg,var(--accent),var(--accent2));border-color:var(--accent2);box-shadow:3px 3px 0 #3d0070}
.btn-danger{border-color:rgba(255,68,68,.35);background:rgba(255,68,68,.08);color:rgba(255,120,120,.95)}
.btn-danger:hover{border-color:var(--red);background:rgba(255,68,68,.14)}
.btn-disabled{border-color:rgba(68,255,170,.35);background:rgba(68,255,170,.08);color:var(--green)}
.empty{padding:14px;border:1px dashed rgba(255,255,255,.2);border-radius:4px;background:rgba(255,255,255,.03);font-family:'VT323',monospace;font-size:1.1rem;color:rgba(255,255,255,.45)}

@media(max-width:860px){
  .page-body{padding:10px}
  .page-hdr{padding:14px}
  .filter-input{width:100%}
}
</style>
</head>
<body>

<?php include __DIR__ . '/topbar.php'; ?>
<?php include __DIR__ . '/sidebar.php'; ?>

<main class="main" id="mainContent">
  <div class="page-hdr">
    <div>
      <div class="page-title">Habilidades</div>
      <div class="page-desc">Gerenciar disponibilidade de habilidades e injecao de chaves de API.</div>
    </div>
  </div>

  <div class="page-body">
    <section class="card">
      <div class="card-hdr">
        <div>
          <div class="card-title">Skills</div>
          <div class="card-sub">Bundled, managed, and workspace skills.</div>
        </div>
        <button class="btn" type="button" id="refreshBtn">Refresh</button>
      </div>

      <div class="toolbar">
        <div class="filter-box">
          <label class="filter-label" for="skillFilterInput">Filter</label>
          <input class="filter-input" id="skillFilterInput" type="text" placeholder="Search skills">
        </div>
        <div class="shown-count" id="shownCount">62 shown</div>
      </div>

      <div class="section">
        <div class="section-hdr">
          <div class="section-title">Workspace Skills</div>
          <div class="section-count" id="workspaceCount">11</div>
        </div>
        <div class="skill-list" id="workspaceList"></div>
      </div>

      <div class="section">
        <div class="section-hdr">
          <div class="section-title">Built-in Skills</div>
          <div class="section-count" id="builtinCount">51</div>
        </div>
        <div class="skill-list" id="builtinList"></div>
      </div>
    </section>
  </div>
</main>

<script>
const WORKSPACE_SKILLS = [
  { id:'api-gateway', name:'api-gateway', desc:'Connect to 100+ APIs (Google Workspace, Microsoft 365, GitHub, Notion, Slack, Airtable, HubSpot, etc.) with managed OAuth. Use this skill when users want to interact with external services.', scope:'openclaw-workspace', state:'eligible' },
  { id:'automation-workflows', name:'automation-workflows', desc:'Design and implement automation workflows to save time and scale operations as a solopreneur. Use when identifying repetitive tasks to automate and building workflows across tools.', scope:'openclaw-workspace', state:'eligible' },
  { id:'frontend-design', name:'frontend-design', desc:'Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, or applications.', scope:'openclaw-workspace', state:'eligible' },
  { id:'frontend-design-ultimate', name:'frontend-design-ultimate', desc:'Create distinctive, production-grade static sites with React, Tailwind CSS, and shadcn/ui. Builds bold, memorable designs from plain text requirements.', scope:'openclaw-workspace', state:'eligible' },
  { id:'google-drive', name:'google-drive', desc:'Google Drive API integration with managed OAuth. List, search, create, and manage files and folders.', scope:'openclaw-workspace', state:'eligible' },
  { id:'google-sheets', name:'google-sheets', desc:'Google Sheets API integration with managed OAuth. Read and write spreadsheet data, create sheets, and manage ranges.', scope:'openclaw-workspace', state:'eligible' },
  { id:'n8n', name:'n8n', desc:'Manage n8n workflows and automations via API. Use for workflow operations, execution status, triggers, and automation debugging.', scope:'openclaw-workspace', state:'blocked', missing:'Missing: env:N8N_API_KEY, env:N8N_BASE_URL' },
  { id:'opencode-controller', name:'opencode-controller', desc:'Control and operate Opencode via slash commands. Manage sessions, select models, switch agents, and coordinate coding tasks.', scope:'openclaw-workspace', state:'eligible' },
  { id:'security-auditor', name:'security-auditor', desc:'Use for security code review, OWASP checks, auth flow analysis, CORS/CSP configuration, and hardening guidance.', scope:'openclaw-workspace', state:'eligible' },
  { id:'ui-ux-pro-max', name:'ui-ux-pro-max', desc:'UI/UX design guidance for polished interfaces: layout, flows, tokens, accessibility, and implementation-ready recommendations.', scope:'openclaw-workspace', state:'eligible' },
  { id:'woocommerce', name:'woocommerce', desc:'WooCommerce REST API integration with managed OAuth. Access products, orders, customers, reports, and webhooks.', scope:'openclaw-workspace', state:'eligible' }
];

const BUILTIN_SKILLS = [
  { id:'1password', name:'1password', desc:'Set up and use 1Password CLI (op).', scope:'openclaw-bundled', state:'blocked', missing:'Missing: bin:op', install:'Install 1Password CLI (brew)' },
  { id:'apple-notes', name:'apple-notes', desc:'Manage Apple Notes via memo CLI on macOS.', scope:'openclaw-bundled', state:'blocked', missing:'Missing: bin:memo, os:darwin' },
  { id:'apple-reminders', name:'apple-reminders', desc:'Manage Apple Reminders via remindctl.', scope:'openclaw-bundled', state:'blocked', missing:'Missing: bin:remindctl, os:darwin' },
  { id:'bear-notes', name:'bear-notes', desc:'Create, search, and manage Bear notes.', scope:'openclaw-bundled', state:'blocked', missing:'Missing: bin:grizzly, os:darwin' },
  { id:'blogwatcher', name:'blogwatcher', desc:'Monitor blogs and RSS/Atom feeds.', scope:'openclaw-bundled', state:'blocked', missing:'Missing: bin:blogwatcher', install:'Install blogwatcher (go)' },
  { id:'blucli', name:'blucli', desc:'BluOS CLI for discovery, playback, grouping, and volume.', scope:'openclaw-bundled', state:'blocked', missing:'Missing: bin:blu', install:'Install blucli (go)' },
  { id:'bluebubbles', name:'bluebubbles', desc:'Send or manage iMessages via BlueBubbles.', scope:'openclaw-bundled', state:'blocked', missing:'Missing: config:channels.bluebubbles' },
  { id:'camsnap', name:'camsnap', desc:'Capture frames or clips from RTSP/ONVIF cameras.', scope:'openclaw-bundled', state:'blocked', missing:'Missing: bin:camsnap', install:'Install camsnap (brew)' },
  { id:'clawhub', name:'clawhub', desc:'Use the ClawHub CLI to search, install, update, and publish skills.', scope:'openclaw-bundled', state:'blocked', missing:'Missing: bin:clawhub', install:'Install clawhub (npm)' },
  { id:'coding-agent', name:'coding-agent', desc:'Delegate coding tasks to Codex, Claude Code, or Pi agents.', scope:'openclaw-bundled', state:'blocked' },
  { id:'discord', name:'discord', desc:'Discord ops via message tool.', scope:'openclaw-bundled', state:'blocked', missing:'Missing: config:channels.discord.token' },
  { id:'eightctl', name:'eightctl', desc:'Control Eight Sleep pods (status, temp, alarms, schedules).', scope:'openclaw-bundled', state:'blocked', missing:'Missing: bin:eightctl', install:'Install eightctl (go)' },
  { id:'gemini', name:'gemini', desc:'Gemini CLI for one-shot Q&A, summaries, and generation.', scope:'openclaw-bundled', state:'blocked', missing:'Missing: bin:gemini', install:'Install Gemini CLI (brew)' },
  { id:'gh-issues', name:'gh-issues', desc:'Fetch GitHub issues, open PRs, and monitor review comments.', scope:'openclaw-bundled', state:'blocked', missing:'Missing: bin:gh', api:true },
  { id:'gifgrep', name:'gifgrep', desc:'Search GIF providers, download results, and extract stills.', scope:'openclaw-bundled', state:'blocked', missing:'Missing: bin:gifgrep', install:'Install gifgrep (go)' },
  { id:'github', name:'github', desc:'GitHub API integration with managed OAuth.', scope:'openclaw-workspace', state:'eligible', extra:'bundled' },
  { id:'gog', name:'gog', desc:'Google Workspace CLI for Gmail, Calendar, Drive, and Docs.', scope:'openclaw-bundled', state:'blocked', missing:'Missing: bin:gog', install:'Install gog (brew)' },
  { id:'goplaces', name:'goplaces', desc:'Query Google Places API via goplaces CLI.', scope:'openclaw-bundled', state:'blocked', missing:'Missing: bin:goplaces, env:GOOGLE_PLACES_API_KEY', install:'Install goplaces (brew)', api:true },
  { id:'healthcheck', name:'healthcheck', desc:'Host security hardening and risk-tolerance configuration.', scope:'openclaw-bundled', state:'eligible' },
  { id:'himalaya', name:'himalaya', desc:'CLI for managing emails via IMAP/SMTP.', scope:'openclaw-bundled', state:'blocked', missing:'Missing: bin:himalaya', install:'Install Himalaya (brew)' },
  { id:'imsg', name:'imsg', desc:'iMessage/SMS CLI for chats and messages.', scope:'openclaw-bundled', state:'blocked', missing:'Missing: bin:imsg, os:darwin' },
  { id:'mcporter', name:'mcporter', desc:'List, configure, and call MCP servers/tools.', scope:'openclaw-bundled', state:'blocked', missing:'Missing: bin:mcporter', install:'Install mcporter (npm)' },
  { id:'model-usage', name:'model-usage', desc:'Summarize local model usage and costs.', scope:'openclaw-bundled', state:'blocked', missing:'Missing: bin:codexbar, os:darwin' },
  { id:'nano-banana-pro', name:'nano-banana-pro', desc:'Generate or edit images via Gemini 3 Pro Image.', scope:'openclaw-bundled', state:'blocked', missing:'Missing: bin:uv, env:GEMINI_API_KEY', install:'Install uv (brew)', api:true },
  { id:'nano-pdf', name:'nano-pdf', desc:'Edit PDFs with natural-language instructions.', scope:'openclaw-bundled', state:'blocked', missing:'Missing: bin:nano-pdf', install:'Install nano-pdf (uv)' },
  { id:'notion', name:'notion', desc:'Notion API for pages, databases, and blocks.', scope:'openclaw-bundled', state:'blocked', missing:'Missing: env:NOTION_API_KEY', api:true },
  { id:'obsidian', name:'obsidian', desc:'Work with Obsidian vaults and automation.', scope:'openclaw-bundled', state:'blocked', missing:'Missing: bin:obsidian-cli', install:'Install obsidian-cli (brew)' },
  { id:'openai-image-gen', name:'openai-image-gen', desc:'Batch-generate images via OpenAI Images API.', scope:'openclaw-bundled', state:'eligible', api:true },
  { id:'openai-whisper', name:'openai-whisper', desc:'Local speech-to-text with Whisper CLI.', scope:'openclaw-bundled', state:'eligible' },
  { id:'openai-whisper-api', name:'openai-whisper-api', desc:'Transcribe audio via OpenAI API.', scope:'openclaw-bundled', state:'eligible', api:true },
  { id:'openhue', name:'openhue', desc:'Control Philips Hue lights and scenes.', scope:'openclaw-bundled', state:'blocked', missing:'Missing: bin:openhue', install:'Install OpenHue CLI (brew)' },
  { id:'oracle', name:'oracle', desc:'Bundle prompt and files for second-model review.', scope:'openclaw-workspace', state:'eligible', extra:'bundled' },
  { id:'ordercli', name:'ordercli', desc:'Foodora-only CLI for order history and status.', scope:'openclaw-bundled', state:'blocked', missing:'Missing: bin:ordercli', install:'Install ordercli (go)' },
  { id:'peekaboo', name:'peekaboo', desc:'Capture and automate macOS UI.', scope:'openclaw-bundled', state:'blocked', missing:'Missing: bin:peekaboo, os:darwin' },
  { id:'sag', name:'sag', desc:'ElevenLabs text-to-speech with say-like UX.', scope:'openclaw-bundled', state:'blocked', missing:'Missing: bin:sag, env:ELEVENLABS_API_KEY', install:'Install sag (brew)', api:true },
  { id:'session-logs', name:'session-logs', desc:'Search and analyze session logs with jq.', scope:'openclaw-bundled', state:'blocked', missing:'Missing: bin:rg' },
  { id:'sherpa-onnx-tts', name:'sherpa-onnx-tts', desc:'Local text-to-speech via sherpa-onnx.', scope:'openclaw-bundled', state:'blocked', missing:'Missing: env:SHERPA_ONNX_RUNTIME_DIR, env:SHERPA_ONNX_MODEL_DIR' },
  { id:'skill-creator', name:'skill-creator', desc:'Create or update AgentSkills.', scope:'openclaw-bundled', state:'eligible' },
  { id:'slack', name:'slack', desc:'Control Slack actions via Slack tooling.', scope:'openclaw-bundled', state:'blocked', missing:'Missing: config:channels.slack' },
  { id:'songsee', name:'songsee', desc:'Generate spectrogram and feature visualizations.', scope:'openclaw-bundled', state:'blocked', missing:'Missing: bin:songsee', install:'Install songsee (brew)' },
  { id:'sonoscli', name:'sonoscli', desc:'Control Sonos speakers (discover/play/volume/group).', scope:'openclaw-bundled', state:'blocked', missing:'Missing: bin:sonos', install:'Install sonoscli (go)' },
  { id:'spotify-player', name:'spotify-player', desc:'Terminal Spotify playback/search.', scope:'openclaw-bundled', state:'blocked' },
  { id:'summarize', name:'summarize', desc:'Summarize URLs, podcasts, videos, and files.', scope:'openclaw-bundled', state:'blocked', missing:'Missing: bin:summarize', install:'Install summarize (brew)' },
  { id:'things-mac', name:'things-mac', desc:'Manage Things 3 via CLI on macOS.', scope:'openclaw-bundled', state:'blocked', missing:'Missing: bin:things, os:darwin' },
  { id:'tmux', name:'tmux', desc:'Remote-control tmux sessions and panes.', scope:'openclaw-workspace', state:'eligible', extra:'bundled' },
  { id:'trello', name:'trello', desc:'Manage Trello boards, lists, and cards.', scope:'openclaw-bundled', state:'blocked', missing:'Missing: env:TRELLO_API_KEY, env:TRELLO_TOKEN' },
  { id:'video-frames', name:'video-frames', desc:'Extract video frames or short clips via ffmpeg.', scope:'openclaw-bundled', state:'eligible' },
  { id:'voice-call', name:'voice-call', desc:'Start voice calls via plugin integration.', scope:'openclaw-bundled', state:'blocked', missing:'Missing: config:plugins.entries.voice-call.enabled' },
  { id:'wacli', name:'wacli', desc:'Send/search WhatsApp messages with CLI.', scope:'openclaw-bundled', state:'blocked', missing:'Missing: bin:wacli', install:'Install wacli (go)' },
  { id:'weather', name:'weather', desc:'Current weather and forecasts via wttr.in or Open-Meteo.', scope:'openclaw-bundled', state:'eligible' },
  { id:'xurl', name:'xurl', desc:'Authenticated requests to X (Twitter) API.', scope:'openclaw-bundled', state:'blocked', missing:'Missing: bin:xurl' }
];

function escapeHtml(value){
  return String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function setList(listId, data){
  const list = document.getElementById(listId);
  list.innerHTML = '';

  if (!data.length){
    list.innerHTML = '<div class="empty">No skills match the current filter.</div>';
    return;
  }

  data.forEach((skill) => {
    const item = document.createElement('div');
    item.className = 'skill-item';

    const buttonClass = skill.disabled ? 'btn btn-disabled' : 'btn btn-danger';
    const buttonLabel = skill.disabled ? 'Enable' : 'Disable';

    item.innerHTML =
      '<div class="skill-head">' +
        '<div>' +
          '<div class="skill-name">' + escapeHtml(skill.name) + '</div>' +
          '<div class="skill-desc">' + escapeHtml(skill.desc) + '</div>' +
        '</div>' +
        '<button class="' + buttonClass + '" data-id="' + escapeHtml(skill.id) + '">' + buttonLabel + '</button>' +
      '</div>' +
      '<div class="skill-meta">' +
        '<span class="tag scope">' + escapeHtml(skill.scope) + '</span>' +
        (skill.extra ? '<span class="tag bundled">' + escapeHtml(skill.extra) + '</span>' : '') +
        '<span class="tag ' + escapeHtml(skill.state) + '">' + escapeHtml(skill.state) + '</span>' +
      '</div>' +
      (skill.missing ? '<div class="skill-missing">' + escapeHtml(skill.missing) + '</div>' : '') +
      (skill.install ? '<div class="skill-extra"><button class="btn" type="button">' + escapeHtml(skill.install) + '</button></div>' : '') +
      (skill.api ? '<div class="api-row"><input class="api-input" type="password" placeholder="API key"><button class="btn btn-primary" type="button">Save key</button></div>' : '');

    list.appendChild(item);
  });
}

function runFilter(){
  const term = (document.getElementById('skillFilterInput').value || '').toLowerCase().trim();
  const matcher = (skill) => {
    if (!term){ return true; }
    return (
      skill.name.toLowerCase().includes(term) ||
      skill.desc.toLowerCase().includes(term) ||
      skill.scope.toLowerCase().includes(term) ||
      (skill.extra || '').toLowerCase().includes(term) ||
      (skill.missing || '').toLowerCase().includes(term) ||
      skill.state.toLowerCase().includes(term)
    );
  };

  const workspace = WORKSPACE_SKILLS.filter(matcher);
  const builtin = BUILTIN_SKILLS.filter(matcher);

  setList('workspaceList', workspace);
  setList('builtinList', builtin);

  document.getElementById('workspaceCount').textContent = String(workspace.length);
  document.getElementById('builtinCount').textContent = String(builtin.length);
  document.getElementById('shownCount').textContent = String(workspace.length + builtin.length) + ' shown';
}

function toggleSkillById(skillId){
  const all = WORKSPACE_SKILLS.concat(BUILTIN_SKILLS);
  const target = all.find((item) => item.id === skillId);
  if (!target){ return; }
  target.disabled = !target.disabled;
  runFilter();
}

document.getElementById('skillFilterInput').addEventListener('input', runFilter);
document.getElementById('refreshBtn').addEventListener('click', function(){
  const btn = this;
  btn.textContent = 'Refreshing...';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Refresh';
    btn.disabled = false;
    runFilter();
  }, 500);
});

document.addEventListener('click', (event) => {
  const target = event.target;
  if (!target || !target.matches('button[data-id]')){ return; }
  toggleSkillById(target.getAttribute('data-id'));
});

runFilter();
</script>
<script src="vexus-ui.js"></script>
</body>
</html>
