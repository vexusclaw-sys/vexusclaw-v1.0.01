# Deploy

## Standard deployment

Canonical production installer:

```bash
curl -fsSL https://vexusclaw.com/install.sh | bash
```

The installer prefers the official GitHub repository at `https://github.com/vexusclaw-sys/vexusclaw-v1.0.01`.
If the repository is still empty, it falls back to `https://vexusclaw.com/install-bundle.tar.gz`.

Official self-host flow with managed VEXUSCLAW subdomain:

```bash
curl -fsSL https://vexusclaw.com/install.sh | bash -s -- --install-token vxc_xxx --email owner@example.com
```

Repo-local entrypoints:

```bash
./infra/scripts/install.sh
./infra/scripts/update.sh
./infra/scripts/doctor.sh
```

## Production runtime

Self-host customer nodes now run with this topology:

- Host `Apache` on `80/443`
- Host `PHP-FPM 8.3`
- Docker Compose `postgres`
- Docker Compose `redis`
- Docker Compose `gateway`
- Dashboard PHP served from [`dashboard-php`](/root/vexusclaw/dashboard-php)

The legacy `apps/dashboard` Next.js app and `infra/caddy/Caddyfile` remain in the repository, but they are no longer the default production path.

## Routing

- `/api/*` -> `127.0.0.1:4000`
- `/health` -> `127.0.0.1:4000`
- `/events/*` -> `127.0.0.1:4000`
- everything else -> PHP dashboard in [`dashboard-php`](/root/vexusclaw/dashboard-php)

The self-host Apache template used by the installer is:

- [infra/apache/vexusclaw.self-host.conf.template](/root/vexusclaw/infra/apache/vexusclaw.self-host.conf.template)

## Domain model

VEXUSCLAW uses the workspace slug as the public hostname:

- `userxxxxx.vexusclaw.com`
- `userxxxxx.example.com`

Two modes coexist:

- Central control plane on `vexusclaw.com`, where Apache serves the central PHP dashboard and the provisioning API issues install tokens.
- Self-host customer nodes, where the installer claims a dedicated `userxxxxx.vexusclaw.com` record or uses a customer-owned base domain.

Required DNS for central provisioning:

- `A vexusclaw.com -> <central_ip>`
- `A control.vexusclaw.com -> <central_ip>`
- Optional legacy redirect: `A vexusclaw.fun -> <central_ip>`

Required DNS for self-host customers:

- Official VEXUSCLAW subdomain path: install token + provisioning API + Cloudflare sync
- Custom domain path: customer points the chosen base domain/subdomain to the VPS before TLS issuance

## Environment shape

Example for a self-host node:

```bash
VEXUS_DOMAIN=user33260.vexusclaw.com
VEXUS_BASE_DOMAIN=vexusclaw.com
VEXUS_PUBLIC_URL=https://user33260.vexusclaw.com
VEXUS_DASHBOARD_URL=https://user33260.vexusclaw.com
VEXUS_API_URL=https://user33260.vexusclaw.com/api
VEXUS_PUBLIC_PROTOCOL=https
VEXUS_GATEWAY_BIND_ADDRESS=127.0.0.1
COOKIE_DOMAIN=
DEFAULT_WORKSPACE_SLUG=user33260
```

Provisioning envs on the central API:

```bash
CLOUDFLARE_API_TOKEN=<dns_edit_token>
CLOUDFLARE_ZONE_ID=<zone_id>
SELF_HOST_PROVISIONING_ENABLED=true
```

Issue an install token centrally:

```bash
pnpm --filter @vexus/installer exec tsx src/index.ts install-token issue --label "cliente-a" --email cliente@example.com
```

Claim or update a customer subdomain:

```bash
pnpm --filter @vexus/installer exec tsx src/index.ts claim --api-base-url https://vexusclaw.com/api/v1 --install-token vxc_xxx
pnpm --filter @vexus/installer exec tsx src/index.ts claim --api-base-url https://vexusclaw.com/api/v1 --install-token vxc_xxx --slug user33260 --ip 203.0.113.10
```

## Validation

Validation commands:

```bash
curl -I https://vexusclaw.com/login
curl -I https://userxxxxx.vexusclaw.com/login
curl -s https://userxxxxx.vexusclaw.com/api/v1/setup/status | jq
```

Low-impact VPS status snapshot:

```bash
./infra/scripts/ops-status.sh
```

It prints load average, free memory, disk usage, top memory consumers, Apache/PHP-FPM status, container health, and one-shot Docker CPU/RAM stats.

## Publishing install.sh

The public installer is the repository file:

- [deploy/install.sh](/root/vexusclaw/deploy/install.sh)
- [deploy/build-install-bundle.sh](/root/vexusclaw/deploy/build-install-bundle.sh)

On the central host, publish it through the existing Apache aliases:

- [infra/apache/vexusclaw.com.conf](/root/vexusclaw/infra/apache/vexusclaw.com.conf)
- [infra/apache/vexusclaw.fun.redirect.conf](/root/vexusclaw/infra/apache/vexusclaw.fun.redirect.conf) for legacy compatibility only

Those vhosts already map `/install.sh` to `/opt/vexusclaw/deploy/install.sh`.
They should also expose `/install-bundle.tar.gz` from `/opt/vexusclaw/deploy/install-bundle.tar.gz`.
Operationally, publishing the new installer is:

```bash
cd /opt/vexusclaw
git pull --ff-only
bash deploy/build-install-bundle.sh
chmod +x deploy/install.sh
chmod +x deploy/build-install-bundle.sh
systemctl reload apache2
curl -fsSL https://vexusclaw.com/install.sh | head
curl -fsSL https://vexusclaw.com/install-bundle.tar.gz -o /dev/null
```

## Provider modes

VEXUSCLAW supports two OpenAI-facing provider modes:

- `OpenAI API key`: stable mode for direct backend runtime access.
- `Entrar com ChatGPT (experimental)`: OAuth Authorization Code + PKCE flow inspired by the Codex/ChatGPT sign-in pattern.

### Environment for ChatGPT OAuth

```bash
OPENAI_CHATGPT_OAUTH_ENABLED=true
OPENAI_CHATGPT_OAUTH_CLIENT_ID=app_xxxxx
OPENAI_CHATGPT_OAUTH_CLIENT_SECRET=
OPENAI_CHATGPT_OAUTH_REDIRECT_URI=http://localhost:1455/auth/callback
OPENAI_CHATGPT_OAUTH_SCOPE=openid profile email offline_access
OPENAI_CHATGPT_OAUTH_AUTHORIZE_URL=https://auth.openai.com/oauth/authorize
OPENAI_CHATGPT_OAUTH_TOKEN_URL=https://auth.openai.com/oauth/token
OPENAI_CHATGPT_OAUTH_EXTRA_PARAMS=id_token_add_organizations=true&codex_cli_simplified_flow=true&originator=pi
OPENAI_CHATGPT_OAUTH_ATTEMPT_TTL_MINUTES=10
OPENAI_CHATGPT_OAUTH_TOKEN_REFRESH_LEEWAY_SECONDS=60
OPENAI_CHATGPT_RUNTIME_BASE_URL=https://chatgpt.com/backend-api
OPENAI_CHATGPT_RUNTIME_MODEL=gpt-5.3-codex
OPENAI_CHATGPT_RUNTIME_TRANSPORT=sse
OPENAI_CHATGPT_RUNTIME_ORIGINATOR=pi
OPENAI_CHATGPT_RUNTIME_TEXT_VERBOSITY=medium
OPENAI_CHATGPT_OAUTH_LOOPBACK_ENABLED=true
OPENAI_CHATGPT_OAUTH_LOOPBACK_HOST=0.0.0.0
OPENAI_CHATGPT_OAUTH_LOOPBACK_PORT=1455
```

Notes:

- For this experimental Codex-style flow, keep `OPENAI_CHATGPT_OAUTH_REDIRECT_URI` on the local callback `localhost:1455`.
- VEXUSCLAW now exposes a real loopback listener on the VPS at host `127.0.0.1:1455`, published from the gateway container, specifically for SSH port-forward usage.
- Do not use a public workspace callback as the primary path for this client flow. In remote VPS usage, the expected path is to open the login in your local browser, then copy the final localhost/127.0.0.1 callback URL back into VEXUSCLAW.
- The OAuth flow depends on valid OpenAI-side client registration. Without `client_id`, VEXUSCLAW keeps the feature visible but unavailable.
- Runtime inference uses the Codex-specific endpoint `POST https://chatgpt.com/backend-api/codex/responses`, not the standard OpenAI API path.
- The experimental provider requires `accountId` metadata alongside the bearer token; the gateway derives it from the OAuth session and sends it as `chatgpt-account-id`.
- Transport is SSE-only today and always sets `stream: true`.

### SSH port-forward path

If you want the OpenClaw-style local callback to auto-complete from a remote VPS:

```bash
ssh -L 1455:localhost:1455 root@187.77.235.192
```

Then:

1. Keep the SSH session open.
2. Start the ChatGPT OAuth flow in VEXUSCLAW.
3. Open the generated authorize URL in your local browser.
4. If OpenAI redirects to `http://localhost:1455/auth/callback?...`, the request will traverse the tunnel into the VPS listener.
5. If the browser still does not complete cleanly, use the manual fallback in VEXUSCLAW.

### Importing `~/.codex/auth.json`

When the local callback flow is inconvenient on a remote VPS, VEXUSCLAW can import a previously authenticated Codex session:

1. Open `Settings` or `Agents`.
2. Use `Importar sessao ChatGPT/Codex (experimental)`.
3. Upload `~/.codex/auth.json` or paste its JSON.
4. VEXUSCLAW extracts account metadata, encrypts the tokens, and stores the provider connection in the current workspace.

Notes:

- This mirrors the practical remote workaround documented around Codex usage, but persistence remains VEXUSCLAW-native.
- Tokens are never returned to the frontend after import.

### Manual fallback

If the browser completes sign-in but the callback is not captured automatically:

1. Copy the full callback URL from the final browser location.
2. Open `Agents` or `Settings`.
3. Use `Entrar com ChatGPT (experimental)`.
4. Paste the callback URL, `code#state`, `code=...&state=...`, or the raw `code` of the current attempt into `Concluir callback manual`.
