import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScoreBandChip } from '@/components/score-band';
import { supabaseServer } from '@/lib/supabase/server';
import type { ComplianceScore, Organisation } from '@/lib/types';
import { deleteOrganisation, runScan, updateOrganisation } from '../actions';
import { OrgForm } from '../org-form';
import { DeleteOrgButton, RunScanButton } from '../scan-and-delete';

export const metadata = { title: 'Organisation' };
export const dynamic = 'force-dynamic';

const DIMENSIONS = [
  { key: 'legal_compliance', label: 'Legal Compliance', weight: '28%' },
  { key: 'document_completeness', label: 'Document Completeness', weight: '22%' },
  { key: 'incident_management', label: 'Incident Management', weight: '18%' },
  { key: 'contractor_qualification', label: 'Contractor Qualification', weight: '14%' },
  { key: 'training_currency', label: 'Training Currency', weight: '10%' },
  { key: 'physical_agent_exposure', label: 'Physical Agent Exposure', weight: '8%' },
] as const;

export default async function OrganisationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    notFound();
  }
  const supabase = await supabaseServer();

  const { data: org } = await supabase
    .from('organisations')
    .select('*')
    .eq('id', id)
    .maybeSingle<Organisation>();
  if (!org) notFound();

  const { data: scores } = await supabase
    .from('compliance_scores')
    .select('*')
    .eq('organisation_id', id)
    .order('scored_at', { ascending: false })
    .limit(10)
    .returns<ComplianceScore[]>();
  const latest = scores?.[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-navy">{org.name}</h1>
          <p className="mt-1 font-mono text-sm text-steel">
            <span className="capitalize">{org.sector}</span>
            {org.cidb_grade ? ` · CIDB grade ${org.cidb_grade}` : ''}
            {org.coid_registration ? ` · COID ${org.coid_registration}` : ''}
          </p>
        </div>
        <RunScanButton action={runScan.bind(null, org.id)} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Latest score</CardTitle>
          <CardDescription>
            {latest
              ? `Scored ${new Date(latest.scored_at).toLocaleString('en-ZA')}`
              : 'No scan on record for this organisation yet.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-baseline gap-4">
            <span className="font-mono text-6xl font-semibold text-navy">
              {latest ? Number(latest.total).toFixed(1) : '—'}
            </span>
            {latest ? <ScoreBandChip band={latest.band} /> : null}
          </div>
          {latest ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {DIMENSIONS.map((d) => (
                <div
                  key={d.key}
                  className="rounded-lg border border-steel/25 p-3"
                >
                  <p className="flex items-center justify-between text-xs text-steel">
                    {d.label}
                    <span className="font-mono text-gold">{d.weight}</span>
                  </p>
                  <p className="mt-1 font-mono text-xl font-semibold text-navy">
                    {Number(latest[d.key]).toFixed(1)}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>

      {scores && scores.length > 1 ? (
        <Card>
          <CardHeader>
            <CardTitle>Score history</CardTitle>
            <CardDescription>Immutable — written only by the scoring engine.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-steel/15">
              {scores.map((s) => (
                <li key={s.id} className="flex items-center justify-between py-2">
                  <span className="font-mono text-sm text-steel">
                    {new Date(s.scored_at).toLocaleString('en-ZA')}
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="font-mono text-sm font-semibold text-navy">
                      {Number(s.total).toFixed(1)}
                    </span>
                    <ScoreBandChip band={s.band} />
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent>
          <OrgForm
            action={updateOrganisation.bind(null, org.id)}
            initial={org}
            submitLabel="Save changes"
          />
        </CardContent>
      </Card>

      <Card className="border-ohs-critical/40">
        <CardHeader>
          <CardTitle>Danger zone</CardTitle>
          <CardDescription>
            Deleting removes the organisation and cascades to all of its
            compliance records.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DeleteOrgButton
            action={deleteOrganisation.bind(null, org.id)}
            name={org.name}
          />
        </CardContent>
      </Card>
    </div>
  );
}
