# Agent tooling — auto-loaded for every session on this repo

Two developer tools are installed by default via `.claude/settings.json` hooks
and committed config. See `CLAUDE.md §11` for the operator-level summary.

## graphify — knowledge graph

This project has a graphify knowledge graph at `graphify-out/`.

Rules:
- Before answering architecture or codebase questions, read
  `graphify-out/GRAPH_REPORT.md` for god nodes and community structure.
- If `graphify-out/wiki/index.md` exists, navigate it instead of reading raw files.
- After modifying code files in this session, run `graphify update .` to keep
  the graph current (AST-only, no API cost).
- The graph is (re)built by the `graphify` CLI, installed on session start by
  `.claude/hooks/graphify-bootstrap.sh` (`pip install graphifyy`). The full
  skill is vendored at `.claude/skills/graphify/`.

## caveman — compressed output mode

Caveman mode is **ON by default** for this repo (`.caveman/config.json` →
`defaultMode: full`). The `SessionStart` hook injects the ruleset; replies come
back terse, dropping filler while keeping all code, commands, and errors exact.
Switch with `/caveman lite|full|ultra` or turn off with "stop caveman" /
"normal mode". Plugin vendored at `.claude/plugins/caveman/`.
