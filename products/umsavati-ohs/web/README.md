# Umsavati OS — Web Dashboard

Next.js **App Router** shell for the Umsavati OHS platform. First committed
2026-07-20 as part of the platform rebuild (PRS gate work).

## Stack

- Next.js 15 (App Router only) · React 19 · TypeScript strict
- Tailwind CSS v4 (CSS-first config) with shadcn/ui conventions
  (`cn()` util, `components/ui/*` primitives — vendored, extend with `npx shadcn add`)
- Supabase via `@supabase/ssr`: browser + server clients, session-refresh
  middleware, login page (email/password sign-in + sign-up)
- Self-hosted fonts via Fontsource: Fraunces (display), DM Sans (body),
  IBM Plex Mono (data) — no external font requests at runtime

## Brand system (locked — CLAUDE.md §4)

`src/app/globals.css` defines every colour once as `--umh-*` custom properties
(plus the `--ohs-*` status palette, which is never mixed with brand gold) and
maps them into Tailwind utilities with `@theme inline` — utilities like
`bg-navy`, `text-gold`, `bg-ohs-critical` all resolve to the locked tokens.
No hex values appear anywhere outside `globals.css`.

## Pages (11 — CLAUDE.md §2.1)

Dashboard (live score card + six dimension tiles, reads
`compliance_scores` server-side) · **Organisations (working module)** ·
Appointments · SafeFile Documents · Incidents · Contractors · Training ·
Physical Agents · SafeFile Generator · ARCHON Command Centre · Settings.
Remaining module screens land sprint by sprint.

### Working modules

All six score-dimension inputs are user-editable, each mirroring its rubric
function in `scoring.ts` (display only — the scoring module is the source of
truth): **Organisations** (CRUD + scan), **Appointments** (Legal 28%),
**SafeFile Documents** (Documents 22%), **Incidents** (Incident Mgmt 18%),
**Contractors** (14%), **Training** (10%), **Physical Agents** (8%). The full
vertical slice runs end-to-end: signup → create organisation → populate the
six dimensions → run scan → banded score.

### Organisations module

Full CRUD via React 19 server actions (`useActionState` forms): create with
sector/CIDB/COID validation, edit, confirm-guarded delete (cascades by
schema). The detail page runs the end-to-end scoring loop: **Run compliance
scan** invokes the `score-organisation` Edge Function server-side with the
caller's session (no CORS surface), then renders the returned score, the six
dimension tiles, and the immutable score history. All reads/writes go through
the user's own client — RLS is the authorisation layer, `owner_id` is set to
the signed-in user on insert.

The dashboard **displays** `total` and `band` from the database — scoring
arithmetic lives in the DB generated columns and the `score-organisation`
Edge Function, never client-side.

## Run

```bash
cp .env.example .env.local   # fill NEXT_PUBLIC_SUPABASE_* (never commit .env*)
npm install                  # registry.npmjs.org
npm run dev
```

Without env vars the shell still builds and runs: middleware passes through
and pages show "not connected" states (keeps CI green on a bare checkout).

Verified 2026-07-20: `next build` clean (14 routes), production server smoke
test — all routes 200, brand tokens and all three typefaces present in the
built CSS.
