# Monitoring Stack — Deploy Runbook

Two Coolify resources close the two open infra gaps in CLAUDE.md §5:
**no production alerting** (Uptime Kuma) and **no error tracking** (GlitchTip).
Both are Sentry/Kuma-standard, sized for the Hostinger KVM2 VPS, and keep the
~R130/month Contraband Stack principle intact.

> This session has no VPS/Coolify access — these files are the deployable
> artifact. The steps below run on the VPS side (CEO/HITL). Both compose files
> are validated (`docker compose config -q` passes).

---

## 1. Uptime Kuma — `uptime-kuma.compose.yml`

**Deploy**
1. Coolify → New Resource → Docker Compose → paste `uptime-kuma.compose.yml`.
2. Deploy. Open the assigned URL, create the admin user (first-run form).

**Monitors to add** (Settings → Add New Monitor, type HTTP(s), interval 60s):
| Target | URL | Notes |
|--------|-----|-------|
| Supabase REST | `https://lpafkclumhhwsvgxrkwv.supabase.co/rest/v1/` + header `apikey: <anon key>` | **Doubles as free-tier keep-alive** — regular hits stop the project re-pausing |
| Umsavati web app | deployed Next.js URL | expect 200 |
| n8n | n8n webhook/health URL | ARCHON orchestration |
| ChromaDB | `<chroma-host>/api/v1/heartbeat` | ARCHON Layer 3 |
| Open WebUI | internal URL | LLM interface |
| GlitchTip | `<glitchtip-domain>/_health/` | monitor the monitor |

**Telegram alerts** (Settings → Notifications → Telegram): reuse the existing
HITL bot — `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID`. Attach the channel to
every monitor so downtime surfaces in the same place as HITL approvals.

---

## 2. GlitchTip — `glitchtip.compose.yml`

Sentry-compatible (`@sentry/*` / `sentry-sdk` SDKs), a fraction of self-hosted
Sentry's ~16 GB footprint. Four services: `db`, `redis`, `web`, `worker`, plus
a one-shot `migrate`.

**Deploy**
1. Set env in Coolify from `.env.example`:
   - `POSTGRES_PASSWORD` — strong random
   - `SECRET_KEY` — `openssl rand -hex 32`
   - `GLITCHTIP_DOMAIN` — the public URL Coolify assigns `glitchtip-web`
   - `EMAIL_URL` — SMTP for invites, or leave `consolemail://`
2. Coolify → New Resource → Docker Compose → paste `glitchtip.compose.yml`.
3. `glitchtip-migrate` runs once and exits 0 (DB schema). First boot only.
4. Open `GLITCHTIP_DOMAIN`, register the first user (registration is then
   locked by `ENABLE_USER_REGISTRATION=false`). Create an Organisation + Project.

**Wire the DSNs** (Project → Settings → copy DSN):
| Surface | SDK | Where |
|---------|-----|-------|
| Mobile | `sentry-expo` | Expo SDK 52 app |
| Web | `@sentry/nextjs` | Umsavati OS dashboard |
| Edge Functions | Deno Sentry SDK | `score-organisation` + future functions |

Registration stays off after the first user; add teammates via invite.

---

## Verify

- Kuma: all monitors green; kill a service and confirm the Telegram alert fires.
- GlitchTip: throw a test error from one SDK; confirm it lands in the project.
- Supabase project stops re-pausing once the keep-alive monitor has run a cycle.

## PRS impact

Both live = monitoring gap closed, worth **+10 PRS** toward the ≥85 Sprint 9
gate (`memory/roadmap.md`). Update the roadmap once deployed.
