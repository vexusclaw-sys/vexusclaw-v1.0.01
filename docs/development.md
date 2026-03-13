# Development

## Toolchain

- Node.js 22+
- pnpm 10
- Docker and Docker Compose

## Local flow

1. Copy `.env.example` to `.env`.
2. Enable pnpm via `corepack`.
3. Run `pnpm install`.
4. Run `pnpm db:generate`.
5. Run `pnpm dev`.

## WhatsApp smoke test

Use the operational smoke script when validating the first real WhatsApp flow:

1. Run `pnpm smoke:whatsapp -- --up` to start the local stack and wait for the gateway and dashboard.
2. Sign in to the dashboard.
3. Open `Channels`, provision the WhatsApp connector and scan the QR code.
4. Send a WhatsApp message to the paired number.
5. Confirm the session transcript in `Sessions`.
6. Confirm runtime events in `Logs`.

If Docker is already running the stack, you can use `pnpm smoke:whatsapp` without `--up`.

## Workspace conventions

- Shared contracts live in `packages/shared`.
- Environment parsing lives only in `packages/config`.
- Reusable runtime modules live in `packages/*`.
- App-specific composition lives in `apps/*`.

## ChatGPT OAuth experimental flow

VEXUSCLAW keeps `OpenAI API key` as the stable provider mode and adds `Entrar com ChatGPT (experimental)` for the OAuth + PKCE flow.

Implementation notes:

- OAuth attempts are persisted in `OAuthSessionAttempt`.
- Provider sessions are persisted on `ProviderConnection`.
- Tokens and PKCE verifier are encrypted at rest.
- The experimental Codex-style redirect follows OpenClaw and is local: `http://localhost:1455/auth/callback`.
- The gateway also runs a dedicated loopback callback listener on port `1455`; in Docker it is published only on host `127.0.0.1:1455`.
- Manual fallback is the primary remote-server path: generate link, complete login, copy the final localhost URL, and paste it back into VEXUSCLAW.
- Remote automation only works if the browser and the callback listener share the same machine or if you use an SSH port-forward on `1455`.
- As a practical remote workaround, VEXUSCLAW can also import `~/.codex/auth.json` from an already authenticated Codex/ChatGPT session.
- Runtime refreshes access tokens when the provider session is close to expiry.
- The runtime path is Codex-specific and server-to-server: `POST https://chatgpt.com/backend-api/codex/responses`.
- The runtime uses SSE only, with `stream: true`, `OpenAI-Beta: responses=experimental`, `originator=pi`, `chatgpt-account-id`, and a `pi (...)` user agent.
- The default experimental model is `gpt-5.3-codex`.

Current limitation:

- The flow still depends on valid OpenAI OAuth client configuration in the environment.
- The flow is useful as an experiment, but it is not reliable enough to replace `OpenAI API key` as the stable provider path.
- The Codex runtime protocol is experimental and may change without notice.
- Imported or refreshed sessions must include `accountId`; otherwise the runtime rejects the connection and the user must reconnect or import again.
