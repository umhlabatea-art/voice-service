import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabaseServer } from '@/lib/supabase/server';
import {
  INCIDENT_KIND_LABELS,
  REPORTABLE_KINDS,
  type Incident,
  type Organisation,
} from '@/lib/types';
import { createIncident, deleteIncident } from './actions';
import { DeleteIncidentButton, IncidentForm } from './incident-form';

export const metadata = { title: 'Incidents' };
export const dynamic = 'force-dynamic';

type Loaded =
  | 'unconfigured'
  | { organisations: Organisation[]; incidents: Incident[] };

async function load(): Promise<Loaded> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return 'unconfigured';
  }
  const supabase = await supabaseServer();
  const [orgs, incs] = await Promise.all([
    supabase.from('organisations').select('*').order('created_at'),
    supabase.from('incidents').select('*').order('occurred_at', { ascending: false }),
  ]);
  return {
    organisations: (orgs.data as Organisation[] | null) ?? [],
    incidents: (incs.data as Incident[] | null) ?? [],
  };
}

// Mirrors incidentManagement() in the scoring rubric (display only):
// reportable = injury/disease within the trailing 12 months; a reportable
// incident is compliant when S.24-reported and not flagged late.
function reportableInWindow(inc: Incident[], windowStartISO: string): Incident[] {
  return inc.filter(
    (i) =>
      REPORTABLE_KINDS.includes(i.kind) && i.occurred_at >= windowStartISO,
  );
}

function isCompliant(i: Incident): boolean {
  return i.reported_s24 && i.reported_within_deadline !== false;
}

export default async function IncidentsPage() {
  const data = await load();
  const now = new Date();
  const windowStart = new Date(now);
  windowStart.setUTCFullYear(windowStart.getUTCFullYear() - 1);
  const windowStartISO = windowStart.toISOString();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-navy">Incidents</h1>
        <p className="mt-1 text-steel">
          S.24 reporting and COID claims with 7-day / 14-day deadline tracking.
          Feeds the Incident Management dimension (18%).
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
              Create an organisation first — the incident register hangs off the tenant.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <>
          {data.organisations.map((org) => {
            const orgIncidents = data.incidents.filter(
              (i) => i.organisation_id === org.id,
            );
            const reportable = reportableInWindow(orgIncidents, windowStartISO);
            const compliant = reportable.filter(isCompliant).length;
            const outstanding = reportable.length - compliant;
            return (
              <Card key={org.id}>
                <CardHeader>
                  <CardTitle className="flex flex-wrap items-center justify-between gap-2">
                    {org.name}
                    <span className="font-mono text-sm font-normal text-steel">
                      {reportable.length === 0
                        ? 'no reportable incidents (12mo)'
                        : `${compliant}/${reportable.length} reported on time`}
                    </span>
                  </CardTitle>
                  {outstanding > 0 ? (
                    <CardDescription>
                      <Badge variant="default" className="bg-ohs-critical text-bone">
                        {outstanding} reportable incident{outstanding > 1 ? 's' : ''} outstanding
                      </Badge>
                    </CardDescription>
                  ) : null}
                </CardHeader>
                <CardContent>
                  {orgIncidents.length === 0 ? (
                    <p className="text-sm text-steel">No incidents logged.</p>
                  ) : (
                    <ul className="divide-y divide-steel/15">
                      {orgIncidents.map((i) => {
                        const reportable = REPORTABLE_KINDS.includes(i.kind);
                        return (
                          <li key={i.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                            <span className="min-w-0 text-sm text-navy">
                              <span className="font-medium">{INCIDENT_KIND_LABELS[i.kind]}</span>
                              <span className="text-steel">
                                {' '}— {i.description.length > 60 ? `${i.description.slice(0, 60)}…` : i.description}
                              </span>
                            </span>
                            <span className="flex shrink-0 items-center gap-3">
                              <span className="font-mono text-xs text-steel">
                                {i.occurred_at.slice(0, 10)}
                                {i.coid_claim_ref ? ` · COID ${i.coid_claim_ref}` : ''}
                              </span>
                              {reportable ? (
                                i.reported_s24 ? (
                                  <Badge
                                    variant={i.reported_within_deadline === false ? 'steel' : 'gold'}
                                  >
                                    {i.reported_within_deadline === false ? 'S.24 late' : 'S.24 on time'}
                                  </Badge>
                                ) : (
                                  <Badge variant="default" className="bg-ohs-critical text-bone">
                                    unreported
                                  </Badge>
                                )
                              ) : (
                                <Badge variant="steel">not reportable</Badge>
                              )}
                              <DeleteIncidentButton action={deleteIncident.bind(null, i.id)} />
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
              <CardTitle>Log incident</CardTitle>
              <CardDescription>
                Only injury and occupational disease are S.24-reportable and drive
                the score — over the trailing 12 months, the same window the engine uses.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <IncidentForm action={createIncident} organisations={data.organisations} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
