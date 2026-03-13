#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/infra/docker/docker-compose.yml"

load_env_value() {
  local key="$1"
  if [[ -f "$ROOT_DIR/.env" ]]; then
    grep -E "^${key}=" "$ROOT_DIR/.env" | tail -n 1 | cut -d= -f2-
  fi
}

echo "== Host =="
uptime
echo
free -h
echo
df -h /
echo

echo "== Top processes =="
ps -eo pid,ppid,cmd,%mem,%cpu --sort=-%mem | head -n 15
echo

echo "== Host services =="
systemctl is-active apache2 2>/dev/null || true
PHP_FPM_SERVICE="$(systemctl list-unit-files --type=service 'php*-fpm.service' --no-legend 2>/dev/null | awk '{print $1}' | sort -V | tail -n 1)"
if [[ -n "$PHP_FPM_SERVICE" ]]; then
  systemctl is-active "$PHP_FPM_SERVICE" 2>/dev/null || true
fi
echo

if command -v docker >/dev/null 2>&1; then
  echo "== Containers =="
  docker compose -f "$COMPOSE_FILE" ps
  echo

  echo "== Docker stats =="
  docker stats --no-stream --format 'table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}\t{{.NetIO}}\t{{.BlockIO}}'
  echo
fi

echo "== HTTP health =="
curl --connect-timeout 2 --max-time 5 -fsS http://127.0.0.1:4000/health && echo
DOMAIN="$(load_env_value VEXUS_DOMAIN)"
if [[ -n "$DOMAIN" ]]; then
  curl --connect-timeout 2 --max-time 5 -fsS -H "Host: $DOMAIN" http://127.0.0.1/login >/dev/null && echo "dashboard_php: reachable ($DOMAIN)"
fi
