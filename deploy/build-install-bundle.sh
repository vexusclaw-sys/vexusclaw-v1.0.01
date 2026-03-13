#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUTPUT_PATH="${1:-$ROOT_DIR/deploy/install-bundle.tar.gz}"

mkdir -p "$(dirname "$OUTPUT_PATH")"

tar \
  --exclude='.git' \
  --exclude='.github' \
  --exclude='.turbo' \
  --exclude='node_modules' \
  --exclude='apps/dashboard/.next' \
  --exclude='apps/dashboard/node_modules' \
  --exclude='apps/gateway/node_modules' \
  --exclude='apps/installer/node_modules' \
  --exclude='packages/*/node_modules' \
  --exclude='dashboard-php/install.sh' \
  --exclude='.env' \
  --exclude='.env.*' \
  --exclude='deploy/install-bundle.tar.gz' \
  -czf "$OUTPUT_PATH" \
  -C "$ROOT_DIR" \
  .

echo "install_bundle=$OUTPUT_PATH"
