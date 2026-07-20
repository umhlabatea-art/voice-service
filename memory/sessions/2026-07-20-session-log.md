# Session Log — 2026-07-20
> **Operator**: Claude (Embedded Engineering & Strategy Intelligence)
> **Repo**: `umhlabatea-art/voice-service` · branch `claude/new-session-wbr52a` · [PR #1](https://github.com/umhlabatea-art/voice-service/pull/1) (draft, open)
> **Backend**: Supabase `lpafkclumhhwsvgxrkwv` (Archon n8n Backend)

---

## 1 · Workspace kit installed

Uploaded `umhlabateaos.zip` (Umhlabatea OS v2) installed into the repo root per its README:
`CLAUDE.md`, `.claude/settings.json`, 7 slash commands (`/SPRINT /XRAY /L99 /SCORE /RISK /INSIGHT /BLUEPRINT`),
6 `memory/` KB files, `.env.example` (placeholders only — verified no secrets), directory scaffold
(`products/ agents/ infra/ templates/`), plus a `.gitignore` blocking `.env`.
Notes: the zip's malformed `{...}` brace-expansion directories were skipped and rebuilt properly;
the previous two-line README was replaced (old content remains in git history).
→ Draft **PR #1** opened; session subscribed to PR activity.

## 2 · "The Way Forward" briefing deck

CEO requested a slide presentation: Claude's understanding of the company, its role, and its ROI strategy.
Delivered a 10-slide artifact in the locked brand system (navy/gold, Fraunces · DM Sans · IBM Plex Mono,
`--umh-` tokens, fonts embedded as data URIs):
**https://claude.ai/code/artifact/7fa47822-4af4-4808-9d65-d14eac410173**
Core thesis: *built platform seeking throughput* — 90-day plan in three phases (Protect & Unlock → Monetise → Scale).
Fix applied mid-session: replaced fixed-height mandatory scroll-snap (froze on mobile) with normal
page scroll + proximity snapping; verified in headless Chromium (desktop + mobile viewports, zero console errors).

## 3 · Phase 1 approved → PRS audit (/XRAY)

**CEO approved Phase 1, starting with the PRS audit.** Findings (full report: `memory/prs-audit-2026-07-20.md`):

- **PRS = 26/100 → CRITICAL band. Sprint 9 remains GATED** (threshold ≥ 85).
- Both Supabase projects in the account were **INACTIVE (paused)**; Archon backend restored → ACTIVE_HEALTHY.
- **The documented 25-table Umsavati production DB exists nowhere in the account.**
  Actual backend contents: 2 tables (`sites`, `floorplans`, both empty), 2 policies, 2 triggers, **0 of 11** documented edge functions.
- Security: `rls_auto_enable()` (SECURITY DEFINER) was executable by `anon`/`authenticated` via REST.
- Perf: unindexed FK `sites.owner_id`; both RLS policies re-evaluated `auth.uid()` per row.
- No product source code under version control anywhere visible.
- Positives: existing tables followed the RLS + `auth.uid()` standard; no committed secrets; brand tokens clean.

**CEO confirmed: this account is everything** → rebuild path is real; Sprints 1–8 "delivered" status was aspirational.

## 4 · Phase 1 deliverables produced

| Deliverable | Path | Status |
|---|---|---|
| POPIA lawful-basis memo (D1) + consent-ledger design | `templates/legal/POPIA_LAWFUL_BASIS_MEMO.md` | Drafted; **legitimate-interest structure adopted by CEO** |
| Uptime Kuma compose (alerting) | `infra/docker/uptime-kuma.compose.yml` | Coolify-ready; deploy pending (no VPS access from session) |
| GlitchTip compose (Sentry-compatible, KVM2-sized) | `infra/docker/glitchtip.compose.yml` | Coolify-ready; deploy pending |
| PRS audit report | `memory/prs-audit-2026-07-20.md` | Complete |

## 5 · HITL migrations — CEO-approved and executed

All three applied to `lpafkclumhhwsvgxrkwv` via migration (SQL archived in `agents/archon/migrations/`), then verified:

1. **`revoke_rls_auto_enable_exposure`** — anon/authenticated/public execute revoked.
   ✅ Verified: only `service_role` + `postgres` retain EXECUTE; both security WARN lints cleared.
2. **`perf_rls_initplan_and_fk_index`** — `sites_owner_id_idx` created; both policies rewritten to `(select auth.uid())`.
   ✅ Verified: all performance WARN lints cleared.
3. **`create_popia_consent_ledger`** — append-only ledger (enums, deny-by-default RLS, suppression index,
   block-update/delete trigger). ✅ Verified: insert OK; update and delete both rejected
   (`popia_consent_ledger is append-only`). One self-test row remains by design (`recorded_by='audit-selftest'`).

Remaining advisor notices are INFO-level and intentional (deny-by-default RLS on ledger; new unused indexes).

## 6 · Umsavati rebuild foundation — DRAFTED, NOT APPLIED

`products/umsavati-ohs/supabase/schema/DRAFT_20260720_umsavati_foundation.sql` — 8 tables for the
six-dimension score engine: `organisations`, `contractors` (CIDB), `appointments` (S.16 chain),
`documents` (6 SafeFile modules), `incidents` (S.24/COID), `training_records`,
`physical_agent_readings`, `compliance_scores` (weighted total + band as generated columns —
scoring arithmetic lives in the DB). Every table: RLS-before-insert, initplan policies, FK indexes,
`touch_updated_at` reuse. **Awaiting next HITL gate before `apply_migration`.**

## 7 · Knowledge base truth-aligned

- `CLAUDE.md` §2.1 → figures relabelled **TARGET ARCHITECTURE (rebuild in progress)**
- `memory/roadmap.md` → PRS 26/100 recorded; blockers updated; HITL queue: 3 executed ✅, 1 pending (foundation schema)
- `memory/stack.md` → Supabase 🟡 restored; free-tier re-pause risk flagged
- `memory/agents.md` → Layer 1 contents corrected

## 8 · Open items (carried forward)

| # | Item | Owner |
|---|------|-------|
| 1 | Apply Umsavati foundation schema (HITL) → then re-run /XRAY for new PRS | CEO approve → Claude |
| 2 | Deploy Uptime Kuma + GlitchTip via Coolify; point a monitor at Supabase (doubles as keep-alive) | CEO (VPS) |
| 3 | Backend re-pauses when idle on free tier — keep-alive or paid tier | CEO |
| 4 | Attorney review of POPIA memo before UTHENGISO scales | CEO |
| 5 | D2 global vertical priority · D3 UTHENGISO graduation criteria | CEO (Phase III) |
| 6 | Bring mobile/web/SafeFile source into version control as it is (re)built | Claude |
| 7 | PR #1 review + merge (still draft; no CI configured on repo) | CEO |

## Commit trail (this session)

```
1099868  chore: seed voice-service                            (pre-session)
644e5af  Install Umhlabatea OS v2 workspace kit
15ee123  Phase 1: POPIA lawful-basis memo and monitoring deploy configs
db6ea74  PRS audit 2026-07-20: score 26/100, Sprint 9 remains gated
31feb93  Execute approved HITL migrations; draft Umsavati rebuild foundation
```
