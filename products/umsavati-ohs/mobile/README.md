# Umsavati OHS — Mobile (Expo SDK 52)

Field-facing companion to the Umsavati OS web dashboard. Same Supabase backend
(`lpafkclumhhwsvgxrkwv`), same `score-organisation` Edge Function, same locked
brand tokens. The web app owns full CRUD across the six compliance modules; the
phone is the on-site surface — sign in, pick an organisation, view its
compliance band, and **run a compliance scan** from the site.

## Stack

- Expo SDK 52 (React Native 0.76, New Architecture on)
- expo-router (typed routes, file-based)
- `@supabase/supabase-js` with a SecureStore-backed session (AsyncStorage
  fallback for oversized tokens / web)
- TypeScript strict

## Run

```bash
cd products/umsavati-ohs/mobile
npm install
cp .env.example .env
# edit .env:
#   EXPO_PUBLIC_SUPABASE_URL=https://lpafkclumhhwsvgxrkwv.supabase.co   (already set)
#   EXPO_PUBLIC_SUPABASE_ANON_KEY=<sb_publishable_... key>
npm run start          # then press i (iOS sim) / a (Android) / scan QR (Expo Go)
```

Only the **publishable / anon** key goes in `.env` — Expo inlines
`EXPO_PUBLIC_*` into the bundle, so the service secret must never appear here.
Without `.env` the app still boots and shows a "not connected" state.

## Screens

| Route | Purpose |
|-------|---------|
| `app/index.tsx` | Auth gate — routes to app or sign-in |
| `app/login.tsx` | Email/password sign-in + sign-up (first auth user) |
| `app/(app)/index.tsx` | Organisations list (pull to refresh) |
| `app/(app)/org/[id].tsx` | Latest score + band, run/re-run scan, dimension breakdown |

## Scoring

The app never computes scores. `runScan` calls the `score-organisation` Edge
Function; `total` and `band` are DB-generated. RLS scopes every read to the
signed-in user. `src/lib/scoring` does not exist here by design — the rubric
lives once, server-side.

## Not yet built (next mobile increments)

- The six module editors (web has them; phone is read + scan for now)
- AI Site Scan Agent (vision OCR — room/safety detection)
- Offline capture queue for low-signal sites
- Push notifications for band changes / expiring appointments

## Sign-off

Test on both iOS and Android simulators before sprint sign-off (CLAUDE.md §6).
No Expo Go dependencies in production builds.
