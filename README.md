<h1 align="center">🧙‍♂️ VexusClaw</h1>

<p align="center">
  <img src="vexusclaw.png" width="420">
</p>



<p align="center">
  <strong>Personal AI Assistant Platform</strong>
</p>

<p align="center">
VEXUSCLAW is a self-hosted multi-channel agent platform built for operators who want a premium mission-control experience, deterministic infrastructure, and a modular orchestration core capable of growing into a complete AI agent ecosystem.
</p>

---

# 🧩 Product Shape

* **`dashboard-php`** — Production dashboard served by Apache + PHP-FPM on self-host nodes
* **`apps/dashboard`** — Legacy Next.js mission control kept in the repository
* **`apps/gateway`** — Fastify API, orchestration entrypoint, health checks, and event distribution
* **`apps/installer`** — Bootstrap process for assisted installation and environment generation
* **`packages/*`** — Shared business capabilities, contracts, adapters, and infrastructure layers
* **`infra/*`** — Docker, Apache, legacy Caddy, install scripts, and operational tooling

---

# 🚀 V1 Priorities

* Extremely simple installation on VPS or bare-metal servers
* Premium dashboard UX for operators
* Strong module boundaries from day one
* OpenAI connectivity in the first release
* WhatsApp as the first end-to-end production channel
* WebChat scaffolded early for the next implementation stage

---

# 🏗 Monorepo Standards

* **Node.js 22+**
* **pnpm workspaces**
* **TypeScript across the entire codebase**
* **TurboRepo for orchestration**
* **Prisma + PostgreSQL**
* **Redis + BullMQ**
* **Apache + PHP-FPM** for the production dashboard path
* **Docker Compose** for `gateway`, `postgres`, and `redis`

---

# ⚡ Quick Start

```bash
corepack enable
corepack prepare pnpm@10.6.0 --activate
pnpm install
pnpm db:generate
pnpm dev
```

---

# 🐳 Docker

```bash
docker compose -f infra/docker/docker-compose.yml up -d
```

By default this starts the backend services only:

* `postgres`
* `redis`
* `gateway`

The legacy **Next.js + Caddy stack** is available behind the optional `legacy-next` profile.

---

# 🧰 Production Install

Canonical installer:

```bash
curl -fsSL https://vexusclaw.com/install.sh | bash
```

The installer prefers the official GitHub repository:

```
https://github.com/vexusclaw-sys/vexusclaw-v1.0.01
```

If that repository is not yet populated, it falls back to the official tarball served by **vexusclaw.com**.

---

## Official Self-Host (Managed Subdomain)

```bash
curl -fsSL https://vexusclaw.com/install.sh | bash -s -- \
  --install-token vxc_xxx \
  --email owner@example.com
```

---

## Custom Base Domain

```bash
curl -fsSL https://vexusclaw.com/install.sh | bash -s -- \
  --domain example.com \
  --email owner@example.com \
  --workspace user48217
```

---

# 🖥 Local Equivalents

```bash
bash deploy/install.sh
bash deploy/install.sh --update
bash deploy/install.sh --doctor
bash deploy/build-install-bundle.sh
```

---

# 🧪 Installer CLI

```bash
pnpm --filter @vexus/installer exec tsx src/index.ts --help
```

Bootstrap example:

```bash
pnpm --filter @vexus/installer exec tsx src/index.ts bootstrap run \
  --non-interactive \
  --base-url http://127.0.0.1:4000/api/v1 \
  --domain vexusclaw.com \
  --public-domain user33260.vexusclaw.com \
  --workspace user33260 \
  --email owner@example.com \
  --password ChangeMeNow123! \
  --provider mock \
  --skip-default-agent \
  --skip-whatsapp
```

Issue an install token:

```bash
pnpm --filter @vexus/installer exec tsx src/index.ts install-token issue --label "cliente-a"
```

Claim installation:

```bash
pnpm --filter @vexus/installer exec tsx src/index.ts claim \
  --api-base-url https://vexusclaw.com/api/v1 \
  --install-token vxc_xxx
```

---

# 📦 Core Workspaces

```
apps/
packages/
infra/
docs/
.github/
```

---

# 🛡 Production Posture

* Public self-host nodes run **Apache on ports `80/443`**
* The production dashboard is rendered from **`dashboard-php/`**
* **`gateway`**, **`postgres`**, and **`redis`** run inside Docker Compose
* The official installer finalizes the workspace **without creating any default agent on the customer VPS**
