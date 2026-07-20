import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabaseServer } from '@/lib/supabase/server';
import type { Organisation, TrainingRecord } from '@/lib/types';
import { createTrainingRecord, deleteTrainingRecord } from './actions';
import { DeleteTrainingButton, TrainingForm } from './training-form';

export const metadata = { title: 'Training' };
export const dynamic = 'force-dynamic';

type Loaded =
  | 'unconfigured'
  | { organisations: Organisation[]; records: TrainingRecord[] };

async function load(): Promise<Loaded> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return 'unconfigured';
  }
  const supabase = await supabaseServer();
  const [orgs, recs] = await Promise.all([
    supabase.from('organisations').select('*').order('created_at'),
    supabase.from('training_records').select('*').order('completed_at', { ascending: false }),
  ]);
  return {
    organisations: (orgs.data as Organisation[] | null) ?? [],
    records: (recs.data as TrainingRecord[] | null) ?? [],
  };
}

// Mirrors trainingCurrency() (display only): valid when no expiry or expiry
// on/after today. No records at all scores 0 — evidenced by the engine, not here.
function isValid(r: TrainingRecord, today: string): boolean {
  return r.valid_until === null || r.valid_until >= today;
}

export default async function TrainingPage() {
  const data = await load();
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-navy">Training</h1>
        <p className="mt-1 text-steel">
          Induction, first aid, and toolbox-talk currency per person. Feeds the
          Training Currency dimension (10%).
        </p>
      </div>

      {data === 'unconfigured' ? (
        <Card>
          <CardHeader>
            <CardTitle>Not connected</CardTitle>
            <CardDescription>
              Copy <code className="font-mono text-xs">.env.example</code> to{' '}
              <code className="font-mono text-xs">.env.local</code> to go live.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : data.organisations.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No organisations yet</CardTitle>
            <CardDescription>
              Create an organisation first — training records hang off the tenant.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <>
          {data.organisations.map((org) => {
            const orgRecords = data.records.filter((r) => r.organisation_id === org.id);
            const valid = orgRecords.filter((r) => isValid(r, today)).length;
            return (
              <Card key={org.id}>
                <CardHeader>
                  <CardTitle className="flex flex-wrap items-center justify-between gap-2">
                    {org.name}
                    <span className="font-mono text-sm font-normal text-steel">
                      {orgRecords.length === 0
                        ? 'no records (scores 0)'
                        : `${valid}/${orgRecords.length} current`}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {orgRecords.length === 0 ? (
                    <p className="text-sm text-steel">No training records.</p>
                  ) : (
                    <ul className="divide-y divide-steel/15">
                      {orgRecords.map((r) => {
                        const valid = isValid(r, today);
                        return (
                          <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                            <span className="text-sm text-navy">
                              <span className="font-medium">{r.person_name}</span>{' '}
                              <span className="text-steel">— {r.course}</span>
                            </span>
                            <span className="flex items-center gap-3">
                              <span className="font-mono text-xs text-steel">
                                {r.completed_at}
                                {r.valid_until ? ` → ${r.valid_until}` : ' · non-expiring'}
                              </span>
                              <Badge variant={valid ? 'gold' : 'steel'}>
                                {valid ? 'current' : 'lapsed'}
                              </Badge>
                              <DeleteTrainingButton
                                action={deleteTrainingRecord.bind(null, r.id)}
                                person={r.person_name}
                              />
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </CardContent>
              </Card>
            );
          })}

          <Card>
            <CardHeader>
              <CardTitle>Add training record</CardTitle>
              <CardDescription>
                Leave &ldquo;valid until&rdquo; blank for non-expiring training (e.g.
                a once-off induction). An organisation with no records scores 0 —
                absence of evidence is the failure.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TrainingForm action={createTrainingRecord} organisations={data.organisations} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
