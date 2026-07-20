#!/usr/bin/env bash
# graphify SessionStart bootstrap — idempotent, best-effort, NON-BLOCKING.
# The remote container is ephemeral, so the pip package is (re)installed on the
# first session in a fresh container. The install pulls heavy native wheels, so
# it is detached to the background: session start never waits on it, and
# graphify becomes available shortly after. Always exit 0.
set +e
if command -v graphify >/dev/null 2>&1; then
  exit 0
fi
LOG="${TMPDIR:-/tmp}/graphify-bootstrap.log"
setsid nohup bash -c 'pip install graphifyy --break-system-packages --quiet --timeout 120 --retries 2' >"$LOG" 2>&1 &
exit 0
