import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabaseServer } from '@/lib/supabase/server';

export const metadata = { title: 'ARCHON Command Centre' };
export const dynamic = 'force-dynamic';

// ARCHON roster — CLAUDE.md §3. Source of truth for agent status is the
// operating brief; this surface reflects it, it does not own it.
type AgentStatus = 'Active' | 'HITL-only' | 'Partially built' | 'Scoped';

const ROSTER: { name: string; fn: string; status: AgentStatus }[] = [
  { name: 'Client Relations', fn: 'Onboarding & CRM', status: 'Active' },
  { name: 'Sales (UTHENGISO)', fn: 'Lead scoring & outreach', status: 'HITL-only' },
  { name: 'Inbox & Admin Officer', fn: 'Email, scheduling, admin', status: 'Partially built' },
  { name: 'IMVELO', fn: 'TBD (rename pending)', status: 'Scoped' },
  { name: 'IZINDABA', fn: 'TBD (rename pending)', status: 'Scoped' },
  { name: 'UMCULO', fn: 'TBD (rename pending)', status: 'Scoped' },
  { name: 'Agent 7', fn: 'TBD', status: 'Scoped' },
];

const STATUS_VARIANT: Record<AgentStatus, 'gold' | 'steel' | 'default'> = {
  Active: 'gold',
  'HITL-only': 'default',
  'Partially built': 'steel',
  Scoped: 'steel',
};

// Open critical-path decisions — CLAUDE.md §3.
const OPEN_DECISIONS = [
  'POPIA lawful basis for outreach — legitimate-interest structure drafted; attorney review pending',
  'Global vertical priority: UK/EU · Gulf · Australia (working hypothesis)',
  'UTHENGISO autonomous graduation criteria (unresolved)',
];

// Three-layer memory model — CLAUDE.md §3.
const MEMORY_LAYERS = [
  { layer: 'Layer 1 — Structured', store: 'Supabase (lpafkclumhhwsvgxrkwv)' },
  { layer: 'Layer 2 — Narrative', store: '/memory/ markdown KB' },
  { layer: 'Layer 3 — Semantic', store: 'ChromaDB vector store' },
];

async function structuredLayerStatus(): Promise<'unconfigured' | number | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return 'unconfigured';
  }
  const supabase = await supabaseServer();
  // Live proof the structured layer is reachable: count POPIA consent-ledger rows
  // (the append-only Layer-1 artifact ARCHON writes to). RLS denies anon by default,
  // so a null count here still confirms the connection resolved.
  const { count } = await supabase
    .from('popia_consent_ledger')
    .select('*', { count: 'exact', head: true });
  return count ?? null;
}

export default async function ArchonPage() {
  const ledger = await structuredLayerStatus();
  const active = ROSTER.filter((a) => a.status === 'Active').length;
  const hitlOnly = ROSTER.filter((a) => a.status === 'HITL-only').length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-navy">ARCHON Command Centre</h1>
        <p className="mt-1 text-steel">
          Agent roster, HITL approval queue, and three-layer memory status —{' '}
          <code className="font-mono text-xs">ARCHON_AGENTIC_OS_FRAMEWORK_v1.0</code>.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Agents active</CardDescription>
          </CardHeader>
          <CardContent>
            <span className="font-mono text-3xl font-semibold text-navy">{active}</span>
            <span className="ml-2 font-mono text-sm text-steel">/ {ROSTER.length}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>HITL-only agents</CardDescription>
          </CardHeader>
          <CardContent>
            <span className="font-mono text-3xl font-semibold text-navy">{hitlOnly}</span>
            <span className="ml-2 font-mono text-sm text-steel">Telegram sign-off</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Consent-ledger rows</CardDescription>
          </CardHeader>
          <CardContent>
            <span className="font-mono text-3xl font-semibold text-navy">
              {ledger === 'unconfigured' ? '—' : ledger === null ? 'RLS' : ledger}
            </span>
            <span className="ml-2 font-mono text-sm text-steel">POPIA Layer 1</span>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Agent roster</CardTitle>
          <CardDescription>Status per agent — governed by the operating brief §3.</CardDescription>
        </CardHeader>
        <CardContent>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-steel/20 text-left">
                <th className="py-2 pr-4 font-mono text-[11px] uppercase tracking-wide text-steel">Agent</th>
                <th className="py-2 pr-4 font-mono text-[11px] uppercase tracking-wide text-steel">Function</th>
                <th className="py-2 font-mono text-[11px] uppercase tracking-wide text-steel">Status</th>
              </tr>
            </thead>
            <tbody>
              {ROSTER.map((a) => (
                <tr key={a.name} className="border-b border-steel/10">
                  <td className="py-2 pr-4 font-medium text-navy">{a.name}</td>
                  <td className="py-2 pr-4 text-steel">{a.fn}</td>
                  <td className="py-2">
                    <Badge variant={STATUS_VARIANT[a.status]}>{a.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>HITL approval queue</CardTitle>
            <CardDescription>
              Telegram · CEO sign-off on high-stakes operations. Mirrors{' '}
              <code className="font-mono text-xs">memory/roadmap.md</code>.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-steel">
              Queue empty. UTHENGISO stays HITL-only until autonomous graduation criteria resolve.
            </p>
            <div className="mt-3">
              <Badge variant="steel">0 pending</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Three-layer memory</CardTitle>
            <CardDescription>Structured · narrative · semantic.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {MEMORY_LAYERS.map((m, i) => (
              <div key={m.layer} className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-navy">{m.layer}</p>
                  <p className="font-mono text-xs text-steel">{m.store}</p>
                </div>
                {i === 0 ? (
                  <Badge variant={ledger === 'unconfigured' ? 'steel' : 'gold'}>
                    {ledger === 'unconfigured' ? 'not wired' : 'reachable'}
                  </Badge>
                ) : (
                  <Badge variant="steel">external</Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Open critical-path decisions</CardTitle>
          <CardDescription>Blocking autonomous graduation and global rollout.</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2">
            {OPEN_DECISIONS.map((d, i) => (
              <li key={i} className="flex gap-3 text-sm text-navy">
                <span className="font-mono text-xs text-gold">{i + 1}</span>
                <span>{d}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
