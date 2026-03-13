#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: restore.sh <backup_dir>"
  exit 1
fi

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BACKUP_DIR="$1"

test -f "$BACKUP_DIR/postgres.sql" || {
  echo "postgres.sql not found in $BACKUP_DIR"
  exit 1
}

cat "$BACKUP_DIR/postgres.sql" | docker compose -f "$ROOT_DIR/infra/docker/docker-compose.yml" exec -T postgres \
  psql -U vexus -d vexusclaw

echo "Restore finished from $BACKUP_DIR"
