import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScoreBandChip, ScoreBandLegend, type ComplianceBand } from '@/components/score-band';
import { supabaseServer } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const DIMENSIONS = [
  { key: 'legal_compliance', label: 'Legal Compliance', weight: '28%' },
  { key: 'document_completeness', label: 'Document Completeness', weight: '22%' },
  { key: 'incident_management', label: 'Incident Management', weight: '18%' },
  { key: 'contractor_qualification', label: 'Contractor Qualification', weight: '14%' },
  { key: 'training_currency', label: 'Training Currency', weight: '10%' },
  { key: 'physical_agent_exposure', label: 'Physical Agent Exposure', weight: '8%' },
] as const;

interface LatestScore {
  total: number;
  band: ComplianceBand;
  scored_at: string;
  [key: string]: unknown;
}

async function loadLatestScore(): Promise<LatestScore | null | 'unconfigured'> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return 'unconfigured';
  }
  const supabase = await supabaseServer();
  const { data } = await supabase
    .from('compliance_scores')
    .select('*')
    .order('scored_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data as LatestScore | null) ?? null;
}

export default async function DashboardPage() {
  const score = await loadLatestScore();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-navy">Compliance Dashboard</h1>
        <p className="mt-1 text-steel">
          Six-dimensional OHS compliance score — computed server-side by the{' '}
          <code className="font-mono text-xs">score-organisation</code> engine.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current score</CardTitle>
          <CardDescription>
            {score === 'unconfigured'
              ? 'Supabase connection not configured — copy .env.example to .env.local to go live.'
              : score === null
                ? 'No score on record yet. Create an organisation and run your first scan.'
                : `Scored ${new Date(score.scored_at).toLocaleString('en-ZA')}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {score !== 'unconfigured' && score !== null ? (
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-6xl font-semibold text-navy">
                {Number(score.total).toFixed(1)}
              </span>
              <ScoreBandChip band={score.band} />
            </div>
          ) : (
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-6xl font-semibold text-steel/40">—</span>
            </div>
          )}
          <ScoreBandLegend />
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {DIMENSIONS.map((d) => (
          <Card key={d.key}>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center justify-between">
                {d.label}
                <span className="font-mono text-xs text-gold">{d.weight}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <span className="font-mono text-2xl font-semibold text-navy">
                {score !== 'unconfigured' && score !== null
                  ? Number(score[d.key]).toFixed(1)
                  : '—'}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
