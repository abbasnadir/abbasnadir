#!/usr/bin/env bash
# Build the site, serve it, snapshot it, and run both anti-slop linters.
# Results land in design/lint-history/<date>-*.txt; screenshots in design/screenshots/<date>/.
# Usage: design/tools/lint.sh [--no-shots]
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
DESIGN="$ROOT/design"
DATE="$(date +%F)"
WORK="$(mktemp -d)"
PORT="${PORT:-4317}"
export BASE="http://localhost:$PORT"

cd "$ROOT/site"
npm run build >"$WORK/build.log" 2>&1 || { cat "$WORK/build.log"; exit 1; }

# Start preview and remember its PID. Never `pkill -f "vite preview"`: the pattern
# matches the calling shell too and kills it.
npx vite preview --port "$PORT" --strictPort >"$WORK/preview.log" 2>&1 &
PREVIEW=$!
trap 'kill $PREVIEW 2>/dev/null || true; rm -rf "$WORK"' EXIT
for _ in $(seq 1 30); do curl -sf "$BASE" >/dev/null && break; sleep 0.5; done

node "$DESIGN/tools/snapshot.mjs" "$WORK/snap"
# sloplint reads the stamp from raw CSS; the bundle has comments stripped, so lint the source too.
cp "$ROOT/site/src/index.css" "$WORK/snap/source.css"

node "$DESIGN/vendor/hallmark/scripts/sloplint.mjs" "$WORK/snap" | tee "$DESIGN/lint-history/$DATE-hallmark.txt" || true
npx -y @gessobuild/anti-slop check "$WORK/snap" 2>/dev/null | tee "$DESIGN/lint-history/$DATE-gesso.txt" || true

if [[ "${1:-}" != "--no-shots" ]]; then
  node "$DESIGN/tools/screenshots.mjs" "$DESIGN/screenshots/$DATE"
fi
