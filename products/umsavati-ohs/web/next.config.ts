import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs';

const nextConfig: NextConfig = {};

// GlitchTip is Sentry-SDK-compatible for error + tracing ingest. Source-map
// upload is disabled: it targets Sentry SaaS org/project and needs an auth
// token this stack does not use — capture works without it. DSN-based init
// lives in the sentry.*.config + instrumentation files (all DSN-guarded).
export default withSentryConfig(nextConfig, {
  silent: !process.env.CI,
  telemetry: false,
  sourcemaps: { disable: true },
  // GlitchTip ingests neither Session Replay nor debug logging — drop that
  // code from the client bundle so the wired-but-idle SDK stays lean.
  bundleSizeOptimizations: {
    excludeDebugStatements: true,
    excludeReplayShadowDom: true,
    excludeReplayIframe: true,
    excludeReplayWorker: true,
  },
});
