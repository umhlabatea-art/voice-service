import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabaseServer } from '@/lib/supabase/server';
import type { Contractor, Organisation } from '@/lib/types';
import { createContractor, deleteContractor, toggleCr5 } from './actions';
import { ContractorForm, DeleteContractorButton, ToggleCr5Button } from './contractor-form';

export const metadata = { title: 'Contractors' };
export const dynamic = 'force-dynamic';

type Loaded =
  | 'unconfigured'
  | { organisations: Organisation[]; contractors: Contractor[] };

async function load(): Promise<Loaded> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return 'unconfigured';
  }
  const supabase = await supabaseServer();
  const [orgs, cons] = await Promise.all([
    supabase.from('organisations').select('*').order('created_at'),
    supabase.from('contractors').select('*').order('created_at', { ascending: false }),
  ]);
  return {
    organisations: (orgs.data as Organisation[] | null) ?? [],
    contractors: (cons.data as Contractor[] | null) ?? [],
  };
}

// Mirrors contractorQualification() (display only): 50 for a stated CIDB
// grade + 50 for verified CR 5 competency, per contractor.
function qualScore(c: Contractor): number {
  return (c.cidb_grade !== null ? 50 : 0) + (c.cr5_competency_verified ? 50 : 0);
}

export default async function ContractorsPage() {
  const data = await load();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-navy">Contractors</h1>
        <p className="mt-1 text-steel">
          CIDB grading and CR 5 competency verification. Feeds the Contractor
          Qualification dimension (14%).
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
              Create an organisation first — contractors hang off the tenant.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <>
          {data.organisations.map((org) => {
            const orgContractors = data.contractors.filter(
              (c) => c.organisation_id === org.id,
            );
            const avg =
              orgContractors.length === 0
                ? null
                : Math.round(
                    orgContractors.reduce((a, c) => a + qualScore(c), 0) /
                      orgContractors.length,
                  );
            return (
              <Card key={org.id}>
                <CardHeader>
                  <CardTitle className="flex flex-wrap items-center justify-between gap-2">
                    {org.name}
                    <span className="font-mono text-sm font-normal text-steel">
                      {avg === null ? 'no contractors (no exposure)' : `qualification ${avg}/100`}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {orgContractors.length === 0 ? (
                    <p className="text-sm text-steel">No contractors on record.</p>
                  ) : (
                    <ul className="divide-y divide-steel/15">
                      {orgContractors.map((c) => (
                        <li key={c.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                          <span className="text-sm font-medium text-navy">{c.name}</span>
                          <span className="flex items-center gap-3">
                            <Badge variant={c.cidb_grade !== null ? 'gold' : 'steel'}>
                              {c.cidb_grade !== null ? `CIDB ${c.cidb_grade}` : 'no CIDB grade'}
                            </Badge>
                            <Badge variant={c.cr5_competency_verified ? 'gold' : 'steel'}>
                              {c.cr5_competency_verified ? 'CR 5 verified' : 'CR 5 unverified'}
                            </Badge>
                            <ToggleCr5Button
                              action={toggleCr5.bind(null, c.id, !c.cr5_competency_verified)}
                              verified={c.cr5_competency_verified}
                            />
                            <DeleteContractorButton
                              action={deleteContractor.bind(null, c.id)}
                              name={c.name}
                            />
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            );
          })}

          <Card>
            <CardHeader>
              <CardTitle>Add contractor</CardTitle>
              <CardDescription>
                An organisation with no contractors scores a clean 100 on this
                dimension — no contractor exposure to manage.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContractorForm action={createContractor} organisations={data.organisations} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
