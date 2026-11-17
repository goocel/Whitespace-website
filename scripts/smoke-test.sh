#!/usr/bin/env bash
# Usage: scripts/smoke-test.sh <base-url>
# Requests every HTML page in the repo (plus the clean URL form) and fails on any non-200.
set -euo pipefail
base="${1:?usage: smoke-test.sh <base-url>}"
base="${base%/}"
cd "$(dirname "$0")/.."

fail=0
check() {
  local url="$1" code
  code=$(curl -sS -o /dev/null -w '%{http_code}' --retry 5 --retry-delay 3 --retry-all-errors --max-time 20 "$url" || echo 000)
  if [ "$code" = "200" ]; then echo "ok   $code $url"; else echo "FAIL $code $url"; fail=1; fi
}

check "$base/"
while IFS= read -r f; do
  check "$base/${f#./}"
  clean="${f#./}"; clean="${clean%.html}"
  [ "$clean" = "index" ] || check "$base/$clean"
done < <(find . -name '*.html' -not -path './design-reference/*' -not -path './.git/*' -not -path './node_modules/*' | sort)

exit "$fail"
