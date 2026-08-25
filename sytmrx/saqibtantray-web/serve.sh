#!/usr/bin/env bash
#
# Restore and serve the site in one command.
#
# The sandbox drops node_modules/ and .next/ whenever it restarts (both are
# excluded from workspace snapshots). Source files always survive, so this
# script reinstalls only what is missing and then serves the production build.
#
# Usage:
#   ./serve.sh          # production build on :3000
#   ./serve.sh 3100     # production build on a different port
#   ./serve.sh --dev    # dev server with hot reload instead

set -euo pipefail
cd "$(dirname "$0")"

PORT=3000
MODE=prod

for arg in "$@"; do
  case "$arg" in
    --dev) MODE=dev ;;
    *[0-9]) PORT="$arg" ;;
  esac
done

if [ ! -d node_modules ] || [ -z "$(ls -A node_modules 2>/dev/null)" ]; then
  echo "→ Installing dependencies (npm ci)…"
  npm ci --no-audit --fund=false
else
  echo "→ Dependencies present, skipping install."
fi

if [ "$MODE" = "dev" ]; then
  echo "→ Starting dev server on :$PORT"
  exec npx next dev -H 0.0.0.0 -p "$PORT"
fi

if [ ! -f .next/BUILD_ID ]; then
  echo "→ Building for production…"
  npm run build
else
  echo "→ Existing build found, skipping build."
fi

echo "→ Serving production build on :$PORT"
exec npx next start -H 0.0.0.0 -p "$PORT"
