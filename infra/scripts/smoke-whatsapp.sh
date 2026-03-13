#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/infra/docker/docker-compose.yml"
API_BASE="${VEXUS_SMOKE_API_BASE:-http://localhost:4000}"
DASHBOARD_BASE="${VEXUS_SMOKE_DASHBOARD_BASE:-http://127.0.0.1}"

wait_for_http() {
  local url="$1"
  local attempts="${2:-5}"
  local delay="${3:-2}"
  local curl_args=(--connect-timeout 2 --max-time 5 -fsS)

  for ((i=1; i<=attempts; i+=1)); do
    if curl "${curl_args[@]}" "$url" >/dev/null 2>&1; then
      echo "ready: $url"
      return 0
    fi

    sleep "$delay"
  done

  echo "not ready: $url" >&2
  return 1
}

if [[ "${1:-}" == "--up" ]]; then
  if ! command -v docker >/dev/null 2>&1; then
    echo "docker is required for --up" >&2
    exit 1
  fi

  echo "starting local services..."
  docker compose --env-file "$ROOT_DIR/.env" -f "$COMPOSE_FILE" up -d postgres redis gateway
fi

echo "checking gateway and dashboard..."
wait_for_http "$API_BASE/health"
wait_for_http "$API_BASE/health/ready"
wait_for_http "$DASHBOARD_BASE/login"

echo
echo "manual smoke checklist:"
echo "1. Open $DASHBOARD_BASE/login and sign in."
echo "2. Go to /channels and click 'Conectar WhatsApp'."
echo "3. Scan the QR code shown by VEXUSCLAW."
echo "4. Send a WhatsApp message from your phone to the paired number."
echo "5. Confirm that /sessions shows the new transcript."
echo "6. Confirm that /logs shows connected/inbound/outbound events."
echo
echo "useful probes:"
echo "  curl $API_BASE/health"
echo "  curl $API_BASE/health/ready"
echo "  pnpm docker:logs"
