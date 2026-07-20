import type { Metadata } from 'next';
import '@fontsource-variable/fraunces';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/600.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/600.css';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Umsavati OS',
    template: '%s · Umsavati OS',
  },
  description:
    'Umsavati OHS compliance platform — an UMHLABATEA (Pty) Ltd product.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
