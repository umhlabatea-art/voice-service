import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabaseServer } from '@/lib/supabase/server';
import {
  PHYSICAL_AGENT_LABELS,
  type Organisation,
  type PhysicalAgentReading,
} from '@/lib/types';
import { createReading, deleteReading } from './actions';
import { DeleteReadingButton, ReadingForm } from './reading-form';

export const metadata = { title: 'Physical Agents' };
export const dynamic = 'force-dynamic';

type Loaded =
  | 'unconfigured'
  | { organisations: Organisation[]; readings: PhysicalAgentReading[] };

async function load(): Promise<Loaded> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return 'unconfigured';
  }
  const supabase = await supabaseServer();
  const [orgs, reads] = await Promise.all([
    supabase.from('organisations').select('*').order('created_at'),
    supabase.from('physical_agent_readings').select('*').order('measured_at', { ascending: false }),
  ]);
  return {
    organisations: (orgs.data as Organisation[] | null) ?? [],
    readings: (reads.data as PhysicalAgentReading[] | null) ?? [],
  };
}

export default async function PhysicalAgentsPage() {
  const data = await load();
  const now = new Date();
  const windowStart = new Date(now);
  windowStart.setUTCFullYear(windowStart.getUTCFullYear() - 2);
  const windowStartISO = windowStart.toISOString();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-navy">Physical Agents</h1>
        <p className="mt-1 text-steel">
          Noise, vibration, thermal, and radiation readings under the Physical
          Agents Regulations 2025. Feeds the Physical Agent Exposure dimension (8%).
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
              Create an organisation first — readings hang off the tenant.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <>
          {data.organisations.map((org) => {
            const orgReadings = data.readings.filter((r) => r.organisation_id === org.id);
            // Mirrors physicalAgentExposure() (display only): over readings in
            // the trailing 24 months, share not exceeding the action level.
            const current = orgReadings.filter((r) => r.measured_at >= windowStartISO);
            const within = current.filter((r) => !r.exceeds_action_level).length;
            return (
              <Card key={org.id}>
                <CardHeader>
                  <CardTitle className="flex flex-wrap items-center justify-between gap-2">
                    {org.name}
                    <span className="font-mono text-sm font-normal text-steel">
                      {current.length === 0
                        ? 'no current readings (scores 50)'
                        : `${within}/${current.length} within action level`}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {orgReadings.length === 0 ? (
                    <p className="text-sm text-steel">No readings recorded.</p>
                  ) : (
                    <ul className="divide-y divide-steel/15">
                      {orgReadings.map((r) => {
                        const stale = r.measured_at < windowStartISO;
                        return (
                          <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                            <span className="text-sm text-navy">
                              <span className="font-medium">{PHYSICAL_AGENT_LABELS[r.agent]}</span>{' '}
                              <span className="font-mono text-steel">
                                {r.reading} {r.unit}
                              </span>
                            </span>
                            <span className="flex items-center gap-3">
                              <span className="font-mono text-xs text-steel">
                                {r.measured_at.slice(0, 10)}
                              </span>
                              {stale ? (
                                <Badge variant="steel" className="uppercase">
                                  stale
                                </Badge>
                              ) : null}
                              {r.exceeds_action_level ? (
                                <Badge variant="default" className="bg-ohs-critical text-bone">
                                  exceeds action level
                                </Badge>
                              ) : (
                                <Badge variant="gold">within</Badge>
                              )}
                              <DeleteReadingButton action={deleteReading.bind(null, r.id)} />
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
              <CardTitle>Record reading</CardTitle>
              <CardDescription>
                Only readings from the trailing 24 months count. An organisation with
                no current readings scores 50 — unmonitored is unknown, not safe.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReadingForm action={createReading} organisations={data.organisations} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
