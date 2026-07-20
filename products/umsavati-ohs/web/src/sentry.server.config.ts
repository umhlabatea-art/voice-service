// GlitchTip (Sentry-compatible) — server runtime.
// Guarded on DSN so the app is a clean no-op until GlitchTip is live and
// NEXT_PUBLIC_SENTRY_DSN is set (matches the env-guard pattern used elsewhere).
import * as Sentry from '@sentry/nextjs';

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,
    tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? '0.1'),
    // GlitchTip does not ingest Session Replay or client logs — keep to
    // errors + tracing, the parts it speaks.
    enableLogs: false,
  });
}
