# /XRAY — Deep Audit Protocol

**Usage**: `/XRAY [target]`  
**Targets**: `system` · `db` · `agents` · `brand` · `[file-or-module-path]`

---

## Audit Matrix

### system
Full Contraband Stack health check:
- Services running (Supabase, n8n, ChromaDB, Coolify, Open WebUI, OpenRouter)
- Pending infra items: Uptime Kuma, Sentry, POPIA consent ledger, Ollama decommission
- Dependency audit (package.json / pyproject.toml)
- VPS resource check (Hostinger KVM2)

### db
Supabase schema integrity audit:
- RLS coverage: every table must have policies (auth.uid()-based)
- Trigger integrity (14 expected)
- Edge Function status (11 expected, Deno runtime)
- Archon n8n Backend project: `lpafkclumhhwsvgxrkwv`

### agents
ARCHON agent roster audit:
- Status per agent: Active / HITL-only / Partially built / Scoped
- HITL queue: Telegram pending approvals
- Open decisions: POPIA basis, global vertical, UTHENGISO graduation
- Memory layer check: Supabase structured + ChromaDB semantic + /memory/ markdown

### brand
Brand token compliance scan across all UI files:
- CSS tokens using `--umh-` prefix (not hardcoded hex)
- OHS compliance palette NOT mixed with brand gold
- Typography: Fraunces / DM Sans / IBM Plex Mono only
- Logo assets referencing locked files (OHS.png, brand marks)

### [path]
Code quality, security, and architecture audit of specified file/module:
- Security vulnerabilities
- RLS bypass risks
- POPIA data exposure
- Performance bottlenecks
- Architecture alignment with Contraband Stack

---

## Output Format

```
## ⚡ XRAY REPORT — [TARGET]
**Status**: [🟢 GREEN | 🟡 AMBER | 🔴 RED]
**Scanned**: [timestamp]

### Critical Issues (blocking — must fix before next sprint)
- ...

### Warnings (non-blocking — schedule for next sprint)
- ...

### Passed Checks
- ...

### Recommended Actions (prioritised)
1. ...
```

---

**Arguments received**: $ARGUMENTS
