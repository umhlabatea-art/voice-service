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

## 9 · Addendum — foundation schema APPLIED · PRS re-scored 26 → 38

CEO gave HITL approval ("apply the foundation schema and re-run the PRS"). Executed:

- Migration `umsavati_foundation` applied to `lpafkclumhhwsvgxrkwv` — all 8 tables live.
  File renamed `DRAFT_20260720_…` → `20260720_umsavati_foundation.sql` (header marked APPLIED).
- **Verified**: 11 public tables all RLS-enabled; advisors show zero WARN (INFO only:
  deny-by-default ledger, fresh unused indexes); 10 policies, 10 triggers, 2 generated
  columns; band arithmetic proven across all four bands (87.9/72.0/50.0/19.0).
  Insert-probe deferred — account has 0 auth users, so the `owner_id → auth.users` FK
  chain gets exercised at first real signup.
- **PRS re-score: 38/100 — still CRITICAL, Sprint 9 remains GATED.**
  Data 8→14 · App 3 (unchanged, now dominant gap) · Infra 4→6 · Compliance 5→9 · Revenue 6.
- Critical path to ≥ 85: product code into version control (+≈22 potential), monitoring
  deploys, first scoring Edge Function. Full re-score in `prs-audit-2026-07-20.md`.
- HITL queue is now **empty**; KB updated (roadmap, agents, stack, CLAUDE.md §2.1).

## 10 · Addendum — first Edge Function: `score-organisation` · PRS 38 → 40

- Deployed `score-organisation` v1 to `lpafkclumhhwsvgxrkwv` (ACTIVE, JWT verify on) —
  first of the 11 documented Edge Functions; the score engine's write path.
- Design: ownership proven via RLS with the caller's JWT; dimension inputs read and the
  score row inserted via service role (`compliance_scores` stays select-only → immutable
  history); `total` + `band` remain DB-generated (weights live in one place).
- Rubric v1 in a pure module (`scoring.ts`) with **22 passing unit tests** — sector-specific
  S.16 chains (CR5/SASREA), SafeFile module scoring, S.24 12-month window, CIDB/CR5
  contractor split, and the deliberate no-data asymmetries (no contractors=100,
  no training=0, no readings=50). Documented in the function's README.
- HTTP smoke test blocked by session network policy (`*.supabase.co` unreachable from
  sandbox); deploy verified via management API + successful bundle build. Live E2E pends
  first auth user.
- **PRS 40/100** (App 3→5) — still CRITICAL; Sprint 9 gate holds.

## 11 · Addendum — Umsavati OS dashboard shell · PRS 40 → 42

- `products/umsavati-ohs/web/`: Next.js 15 App Router (TS strict, Tailwind v4,
  shadcn/ui conventions), all 11 documented pages as routes, sidebar shell in
  brand navy/gold, auth skeleton (`@supabase/ssr` login + session middleware).
- Dashboard home reads `compliance_scores` server-side; `total`/`band` are display-only
  (arithmetic stays in DB + `score-organisation`). OHS status palette used for band
  chips, kept separate from brand gold per §4.
- Tokens: every colour defined once as `--umh-*`/`--ohs-*` in `globals.css`, mapped to
  Tailwind utilities via `@theme inline`; Fraunces/DM Sans/IBM Plex Mono self-hosted
  via Fontsource (no runtime font CDN).
- Verified: `next build` clean (14 routes) after fixing two strict-mode implicit-any
  cookie types; production smoke test — all routes 200, band chips render, tokens and
  all three typefaces present in built CSS. Shell builds and runs without env vars
  (graceful "not connected" states).
- **PRS 42/100** (App 5→7) — CRITICAL; gate holds.

## 12 · Addendum — Organisations module (first working CRUD) · PRS 42 → 43

- `/organisations` list + create; `/organisations/[id]` detail with edit,
  confirm-guarded delete (schema cascades), and **Run compliance scan** — invokes
  `score-organisation` via server action with the user's session (server-to-server,
  no CORS surface), renders returned total/band, six dimension tiles, immutable history.
- React 19 `useActionState` forms; validation in the server action (sector enum,
  CIDB 1–9); `owner_id` set from the signed-in user; RLS is the authorisation layer.
- Fixed: detail page 500 on bare checkout → clean 404 via env guard. Build + smoke
  re-verified. **PRS 43/100** (App 7→8); gate holds. E2E pends first auth user.

## 13 · Addendum — Appointments module · PRS 43 → 44

- `/appointments`: per-organisation S.16 chain coverage (sector-aware required set
  mirroring `requiredDesignations` in the rubric — noted as display-only mirror with
  the scoring module as source of truth), appointment list with current/expired/future
  status, record form (org + designation + appointee + dates, expiry-before-appointment
  guard), confirm-guarded remove. Server actions + RLS throughout.
- Feeds Legal Compliance (28%). Build + smoke verified. **PRS 44/100** (App 8→9); gate holds.

## 14 · Addendum — SafeFile Documents module · PRS 44 → 45

- `/documents`: per-organisation six-module register with full/partial/missing badges
  (mirrors rubric's 100/50/0 rule; scoring.ts source of truth), document list with
  validity/lapsed and S.16(1) signed/unsigned state, register form, toggle-signed,
  confirm-guarded remove. Server actions + RLS. Storage uploads deferred to the
  SafeFile pipeline build. Feeds Document Completeness (22%).
- Build + smoke verified. **PRS 45/100** (App 9→10); gate holds.

## 15 · Addendum — Incidents module · PRS 45 → 46

- `/incidents`: per-organisation reportable-on-time ratio (12-month window,
  injury/disease reportable set — mirrors rubric's incidentManagement, scoring.ts
  source of truth), outstanding alert, per-row S.24 on-time/late/unreported/not-reportable
  badges, tri-state deadline capture (7d injury / 14d disease), COID claim ref,
  confirm-guarded remove. Server actions + RLS. Feeds Incident Management (18%).
- Build + smoke verified. **PRS 46/100** (App 10→11); gate holds.

## 16 · Addendum — Contractors + Training + Physical Agents · PRS 46 → 48

- `/contractors` (14%): qualification average, CIDB + CR 5 badges, toggle-verify,
  no-contractors=100. `/training` (10%): per-person currency, current/lapsed,
  non-expiring support, no-records=0. `/physical-agents` (8%): 24-month within-action
  ratio, stale flag, exceeds/within badges, no-current=50.
- All mirror their rubric functions (scoring.ts source of truth); server actions + RLS.
- Completes the scoring-input set — **all six dimensions now user-drivable**. Build +
  smoke verified across all three. **PRS 48/100** (App 11→13); gate holds.

## Commit trail (this session)

```
1099868  chore: seed voice-service                            (pre-session)
644e5af  Install Umhlabatea OS v2 workspace kit
15ee123  Phase 1: POPIA lawful-basis memo and monitoring deploy configs
db6ea74  PRS audit 2026-07-20: score 26/100, Sprint 9 remains gated
31feb93  Execute approved HITL migrations; draft Umsavati rebuild foundation
```
