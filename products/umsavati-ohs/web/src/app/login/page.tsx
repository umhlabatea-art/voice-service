'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabaseBrowser, supabaseConfigured } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const configured = supabaseConfigured();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!configured) return;
    setBusy(true);
    setError(null);
    const supabase = supabaseBrowser();
    const { error } =
      mode === 'sign-in'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push('/');
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">
            Umsavati <span className="text-gold">OS</span>
          </CardTitle>
          <CardDescription>
            {mode === 'sign-in' ? 'Sign in to your workspace' : 'Create your account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!configured ? (
            <p className="text-sm text-steel">
              Supabase connection not configured. Copy{' '}
              <code className="font-mono text-xs">.env.example</code> to{' '}
              <code className="font-mono text-xs">.env.local</code> and restart.
            </p>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <label className="block text-sm">
                <span className="mb-1 block text-steel">Email</span>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-steel/40 px-3 py-2 text-navy focus:outline-2 focus:outline-gold"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-steel">Password</span>
                <input
                  type="password"
                  required
                  minLength={8}
                  autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border border-steel/40 px-3 py-2 text-navy focus:outline-2 focus:outline-gold"
                />
              </label>
              {error ? <p className="text-sm text-ohs-critical">{error}</p> : null}
              <Button type="submit" variant="gold" className="w-full" disabled={busy}>
                {busy ? 'Working…' : mode === 'sign-in' ? 'Sign in' : 'Sign up'}
              </Button>
              <button
                type="button"
                onClick={() => setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in')}
                className="w-full text-center text-xs text-steel underline-offset-2 hover:underline"
              >
                {mode === 'sign-in'
                  ? 'No account yet? Sign up'
                  : 'Already registered? Sign in'}
              </button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
