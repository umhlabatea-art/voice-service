import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabaseServer } from '@/lib/supabase/server';
import {
  DESIGNATION_LABELS,
  requiredDesignations,
  type Appointment,
  type Organisation,
} from '@/lib/types';
import { createAppointment, deleteAppointment } from './actions';
import { AppointmentForm, DeleteAppointmentButton } from './appointment-form';

export const metadata = { title: 'Appointments' };
export const dynamic = 'force-dynamic';

type Loaded =
  | 'unconfigured'
  | { organisations: Organisation[]; appointments: Appointment[] };

async function load(): Promise<Loaded> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return 'unconfigured';
  }
  const supabase = await supabaseServer();
  const [orgs, apps] = await Promise.all([
    supabase.from('organisations').select('*').order('created_at'),
    supabase.from('appointments').select('*').order('appointed_at', { ascending: false }),
  ]);
  return {
    organisations: (orgs.data as Organisation[] | null) ?? [],
    appointments: (apps.data as Appointment[] | null) ?? [],
  };
}

function appointmentStatus(a: Appointment, today: string): 'current' | 'expired' | 'future' {
  if (a.appointed_at > today) return 'future';
  if (a.expires_at && a.expires_at < today) return 'expired';
  return 'current';
}

export default async function AppointmentsPage() {
  const data = await load();
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-navy">Appointments</h1>
        <p className="mt-1 text-steel">
          The OHS Act appointment chain — S.16(1), S.16(2), S.8(2) — plus CR 5 and
          SASREA designations. Feeds the Legal Compliance dimension (28%).
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
              Create an organisation first — appointments hang off the tenant.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <>
          {data.organisations.map((org) => {
            const orgApps = data.appointments.filter(
              (a) => a.organisation_id === org.id,
            );
            const currentDesignations = new Set(
              orgApps
                .filter((a) => appointmentStatus(a, today) === 'current')
                .map((a) => a.designation),
            );
            const required = requiredDesignations(org.sector);
            const covered = required.filter((d) => currentDesignations.has(d));
            return (
              <Card key={org.id}>
                <CardHeader>
                  <CardTitle className="flex flex-wrap items-center justify-between gap-2">
                    {org.name}
                    <span className="font-mono text-sm font-normal text-steel">
                      chain {covered.length}/{required.length}
                    </span>
                  </CardTitle>
                  <CardDescription className="flex flex-wrap gap-1.5">
                    {required.map((d) => (
                      <Badge
                        key={d}
                        variant={currentDesignations.has(d) ? 'gold' : 'steel'}
                      >
                        {DESIGNATION_LABELS[d]}
                      </Badge>
                    ))}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {orgApps.length === 0 ? (
                    <p className="text-sm text-steel">No appointments recorded.</p>
                  ) : (
                    <ul className="divide-y divide-steel/15">
                      {orgApps.map((a) => {
                        const status = appointmentStatus(a, today);
                        return (
                          <li
                            key={a.id}
                            className="flex flex-wrap items-center justify-between gap-2 py-2"
                          >
                            <span className="text-sm text-navy">
                              <span className="font-medium">{a.appointee_name}</span>{' '}
                              <span className="text-steel">
                                — {DESIGNATION_LABELS[a.designation]}
                              </span>
                            </span>
                            <span className="flex items-center gap-3">
                              <span className="font-mono text-xs text-steel">
                                {a.appointed_at}
                                {a.expires_at ? ` → ${a.expires_at}` : ''}
                              </span>
                              {status !== 'current' ? (
                                <Badge variant="steel" className="uppercase">
                                  {status}
                                </Badge>
                              ) : null}
                              <DeleteAppointmentButton
                                action={deleteAppointment.bind(null, a.id)}
                                appointee={a.appointee_name}
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
              <CardTitle>Record appointment</CardTitle>
              <CardDescription>
                Only current appointments (appointed on/before today, not expired)
                count toward the chain — same rule the scoring engine applies.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AppointmentForm
                action={createAppointment}
                organisations={data.organisations}
              />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
