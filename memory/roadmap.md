# Umsavati OHS — Sprint Roadmap & PRS Log

> Update this file at the close of every sprint.

---

## Platform Readiness Score (PRS) Gate
**Current PRS**: `53/100` — 🔴 CRITICAL band · updated 2026-07-20 after Expo mobile MVP (26 → … → 51 → 53; see `prs-audit-2026-07-20.md`)  
**Gate threshold**: ≥ 85 to unlock new sprint — **Sprint 9 remains GATED**  
**Critical path to 85**: application surface (product code into version control) → monitoring deploys → first scoring Edge Function

---

## Sprint Log

| Sprint | Name | Status | PRS Delta | Key Deliverables |
|--------|------|--------|-----------|-----------------|
| 1 | Foundation | ✅ LOCKED | — | Supabase schema, auth, RLS framework |
| 2 | Scoring Engine | ✅ LOCKED | — | 6-dimensional score, 4-band output |
| 3 | Mobile MVP | ✅ LOCKED | — | Expo SDK 52, core screens |
| 4 | Document Module | ✅ LOCKED | — | SafeFile schema, upload pipeline |
| 5 | AI Features | ✅ LOCKED | — | Site Scan Agent, Maps integration |
| 6 | Dashboard | ✅ LOCKED | — | Umsavati OS (umsavati-os.html), 11 pages |
| 7 | Contractor Marketplace | ✅ DELIVERED | — | ARCHON Command Centre, marketplace UI |
| 8 | Onboarding Pipeline | ✅ DELIVERED | — | SafeFile Generator (4-phase), HITL queue |
| 9 | TBD | ⏸ GATED | — | Pending PRS ≥ 85 |

---

## Active Sprint: [N/A — Update when Sprint 9 begins]

```
Sprint:      9
Status:      GATED (PRS ≥ 85 required)
Objectives:
  1. [TBD]
  2. [TBD]
  3. [TBD]

Open Blockers:
  - Product source code not under version control (DOMINANT — worth up to +22 PRS)
  - No live monitoring — Uptime Kuma/GlitchTip composes validated + runbook ready
    (infra/docker/README.md); Coolify deploy pending (CEO/VPS). +10 PRS on deploy.
  - Archon backend on free tier — re-pauses when idle (Kuma monitor doubles as keep-alive)
  - POPIA memo awaiting attorney review; consent flow not yet wired into ledger
  - UTHENGISO graduation criteria unresolved

HITL Queue:
  - (empty)

HITL Executed (CEO-approved 2026-07-20):
  - ✅ revoke_rls_auto_enable_exposure — security lints cleared
  - ✅ perf_rls_initplan_and_fk_index — performance lints cleared
  - ✅ create_popia_consent_ledger — append-only verified; D1 adopted
    (legitimate-interest structure per templates/legal/POPIA_LAWFUL_BASIS_MEMO.md)
  - ✅ umsavati_foundation — 8-table rebuild foundation applied & verified
    (schema/20260720_umsavati_foundation.sql; PRS re-scored 26 → 38)
```

---

## Claude Code Handover Reference
`UMSAVATI_CLAUDE_CODE_HANDOVER_v1.0.md` — produced at Sprint 8 close.  
Sequential platform rollout gated on PRS score.
