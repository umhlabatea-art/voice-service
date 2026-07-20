# `score-organisation` — Umsavati OHS Scoring Edge Function

**Runtime**: Deno (Supabase Edge) · TypeScript strict · JWT verification ON
**Deployed**: 2026-07-20 to `lpafkclumhhwsvgxrkwv` (first of the platform's Edge Functions)

## Contract

```
POST /functions/v1/score-organisation
Authorization: Bearer <user JWT>
{ "organisation_id": "<uuid>" }
→ 200 { "score": { ...six dimensions, total, band, scored_at } }
```

- **Ownership via RLS**: the caller's own client must be able to `select` the
  organisation row. Not the owner → 404. No token → 401 at the gateway.
- **Immutable history**: the score row is inserted with the service role;
  `compliance_scores` is select-only for users, so clients can read but never
  write or rewrite score history.
- **DB owns the arithmetic**: `total` (0.28 / 0.22 / 0.18 / 0.14 / 0.10 / 0.08)
  and `band` are generated columns. This function only produces the six 0–100
  dimension inputs.

## Rubric v1 (`scoring.ts` — pure module, unit-tested)

| Dimension | Weight | Rule |
|---|---|---|
| Legal Compliance | 28% | Share of required designations with a current appointment. Base chain: S.16(1), S.16(2), S.8(2); construction adds CR 5, events adds SASREA safety officer. Expired/future-dated appointments don't count. |
| Document Completeness | 22% | Per SafeFile module (6): current + S.16(1)-signed = 100 · present but expired/unsigned = 50 · absent = 0; averaged. |
| Incident Management | 18% | Over injury/disease incidents (S.24/COID-notifiable) in the trailing 12 months: share reported under S.24 within the 7d/14d deadline. None in window → 100. |
| Contractor Qualification | 14% | Per contractor: 50 for stated CIDB grade + 50 for verified CR 5 competency; averaged. No contractors → 100 (no exposure). |
| Training Currency | 10% | Share of training records still valid (null `valid_until` = non-expiring). **No records → 0** — absence of evidence is the failure. |
| Physical Agent Exposure | 8% | Over readings in the trailing 24 months: share not exceeding the action level. **No current readings → 50** — unmonitored is unknown, not safe (Physical Agents Regs 2025). |

Deliberate asymmetries: no *contractors* is a clean 100 (nothing to qualify),
no *training records* is 0 (S.8 duty unevidenced), no *readings* is 50
(monitoring gap, not proven exposure). A greenfield org therefore lands at
total 36 → `critical_risk`, which is the honest starting point.

## Testing

- 22 unit tests over the pure rubric module (all bands, window edges, the
  no-data asymmetries) — run with
  `node --experimental-strip-types scoring.test.mjs` against `scoring.ts`.
- Band arithmetic of the generated columns verified in-database at migration
  time (see `memory/prs-audit-2026-07-20.md`).
- Live E2E (signup → org → score) pends the first auth user in the project.

## Rubric changes

Weights and bands are locked in CLAUDE.md §2.2 and the DB schema — changing
them is a migration (HITL). Rubric rules above may evolve (v2: document
version-control depth, incident CAPA closure, HCS/noise zone coverage), but
any change alters customers' scores and needs CEO sign-off first.
