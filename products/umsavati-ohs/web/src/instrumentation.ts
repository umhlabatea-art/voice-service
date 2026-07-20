import * as Sentry from '@sentry/nextjs';

// Loads the runtime-appropriate GlitchTip init. Both configs self-guard on DSN.
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }
  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}

// Reports App Router nested React Server Component / route-handler errors.
export const onRequestError = Sentry.captureRequestError;
