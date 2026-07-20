'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

// Reports uncaught errors in the root layout/template to GlitchTip.
// Sentry.captureException is a no-op when no DSN was configured.
export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <div style={{ padding: '4rem 2rem', maxWidth: '32rem', margin: '0 auto' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#0d1b2a' }}>
            Something went wrong
          </h1>
          <p style={{ marginTop: '0.5rem', color: '#5c6b7a' }}>
            The error has been logged. Try again, or return to the dashboard.
          </p>
        </div>
      </body>
    </html>
  );
}
