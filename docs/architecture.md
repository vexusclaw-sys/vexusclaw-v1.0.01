# VEXUSCLAW Architecture

VEXUSCLAW is structured as a TypeScript monorepo with clear boundaries between executable apps, reusable product modules and deployment assets.

## Core layers

- `apps/dashboard`: operator-facing Next.js mission control.
- `apps/gateway`: Fastify API, event entrypoint and orchestration surface.
- `apps/installer`: assisted bootstrap process.
- `packages/*`: product primitives and reusable runtime modules.
- `infra/*`: deployment, proxy and operational scripts.

## First-release posture

- Self-hosted single deployment unit via Docker Compose
- Multi-tenant domain model centered on `Workspace`
- JWT and refresh token auth planned for ETAPA 2
- WhatsApp as first production end-to-end channel target
- WebChat scaffolded early for fast iteration
