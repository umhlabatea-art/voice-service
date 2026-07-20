# UMHLABATEA — Contraband Stack Reference

**Operating cost**: ~R130/month  
**Replaced**: ~R5,360/month in cloud API costs  
**VPS**: Hostinger KVM2 · Ubuntu 24.04

---

## Service Registry

| Service | Role | Host | Status |
|---------|------|------|--------|
| Supabase | DB, Auth, Edge Functions, Storage | Cloud | 🟡 Active (restored 2026-07-20 — free tier re-pauses when idle; keep-alive or paid tier needed) |
| n8n | Workflow automation, ARCHON orchestration | Coolify (KVM2) | 🟢 Active |
| ChromaDB | Semantic vector memory (ARCHON Layer 3) | Coolify (KVM2) | 🟢 Active |
| Coolify | Self-hosted PaaS | KVM2 | 🟢 Active |
| Open WebUI | Internal LLM interface | Coolify (KVM2) | 🟢 Active |
| OpenRouter | Primary LLM inference gateway | Cloud | 🟢 Active |
| DeepSeek R1 | Primary model via OpenRouter | Cloud (OpenRouter) | 🟢 Active |
| Claude Code | Engineering environment | Google Project IDX | 🟢 Active |
| open-notebook v1.9.0 | Research pipeline | KVM2 | 🟢 Active |
| Local Ollama | LLM inference (local) | KVM2 | ⚠️ Decommission |

---

## Pending Infrastructure (Priority Order)

```
[ ] 1. Uptime Kuma     — No production alerting. CRITICAL gap.
[ ] 2. Sentry          — No error tracking. CRITICAL gap.
[ ] 3. POPIA consent ledger — Legal requirement. HIGH priority.
[ ] 4. Decommission Ollama  — Superseded by OpenRouter. Resource freed.
```

---

## open-notebook v1.9.0
- **Stack**: Python 3.12 (via `uv`) + Next.js / Tailwind CSS / shadcn-ui
- **Install fix**: Registry rewritten `registry.npmmirror.com` → `registry.npmjs.org` (841 references)
- **Integration**: Proposed as research/KB layer for Hermes agent

---

## Environment Variables Template

```bash
# Supabase
SUPABASE_URL=https://lpafkclumhhwsvgxrkwv.supabase.co
SUPABASE_ANON_KEY=__FILL__
SUPABASE_SERVICE_ROLE_KEY=__FILL__

# OpenRouter
OPENROUTER_API_KEY=__FILL__

# n8n
N8N_WEBHOOK_URL=__FILL__
N8N_API_KEY=__FILL__

# Telegram (HITL Gate)
TELEGRAM_BOT_TOKEN=__FILL__
TELEGRAM_CHAT_ID=__FILL__

# NPM (always use this registry)
NPM_CONFIG_REGISTRY=https://registry.npmjs.org
```

---

## Python Convention
```bash
# Always use uv
uv init
uv add <package>

# pip fallback (unavoidable cases only)
pip install <package> --break-system-packages
```
