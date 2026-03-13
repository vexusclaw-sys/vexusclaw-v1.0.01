#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_DIR="$ROOT_DIR/backups/$STAMP"

mkdir -p "$BACKUP_DIR"

docker compose -f "$ROOT_DIR/infra/docker/docker-compose.yml" exec -T postgres \
  pg_dump -U vexus -d vexusclaw >"$BACKUP_DIR/postgres.sql"

if [[ -f "$ROOT_DIR/.env" ]]; then
  cp "$ROOT_DIR/.env" "$BACKUP_DIR/.env.snapshot"
fi

echo "Backup created at $BACKUP_DIR"
