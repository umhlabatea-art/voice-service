import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabaseServer } from '@/lib/supabase/server';
import {
  SAFEFILE_MODULES,
  SAFEFILE_MODULE_LABELS,
  requiredDesignations,
  type Appointment,
  type OhsDocument,
  type Organisation,
  type SafefileModule,
} from '@/lib/types';

export const metadata = { title: 'SafeFile Generator' };
export const dynamic = 'force-dynamic';

type Loaded =
  | 'unconfigured'
  | {
      organisations: Organisation[];
      documents: OhsDocument[];
      appointments: Appointment[];
    };

async function load(): Promise<Loaded> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return 'unconfigured';
  }
  const supabase = await supabaseServer();
  const [orgs, docs, apps] = await Promise.all([
    supabase.from('organisations').select('*').order('created_at'),
    supabase.from('documents').select('*'),
    supabase.from('appointments').select('*'),
  ]);
  return {
    organisations: (orgs.data as Organisation[] | null) ?? [],
    documents: (docs.data as OhsDocument[] | null) ?? [],
    appointments: (apps.data as Appointment[] | null) ?? [],
  };
}

function moduleReady(docs: OhsDocument[], mod: SafefileModule, today: string): boolean {
  return docs.some(
    (d) => d.module === mod && d.signed_by_16_1 && (!d.valid_until || d.valid_until >= today),
  );
}

const PHASES = [
  { n: 1, name: 'Scope', detail: 'Pick the organisation and confirm sector-driven requirements.' },
  { n: 2, name: 'Gather', detail: 'Pull live appointments, SafeFile register, incidents, training.' },
  { n: 3, name: 'Render', detail: 'Assemble the Health & Safety File on the SA legislative template.' },
  { n: 4, name: 'Export', detail: 'Print-ready document (PDF) or a native Word .docx for the site file.' },
] as const;

export default async function SafeFileGeneratorPage() {
  const data = await load();
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-navy">SafeFile Generator</h1>
        <p className="mt-1 text-steel">
          Four-phase export pipeline. Assembles a Health &amp; Safety File from live
          compliance data on SA legislative templates (OHS Act 85/1993, Construction
          Regulations 2014).
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {PHASES.map((p) => (
          <Card key={p.n}>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/20 font-mono text-xs font-semibold text-gold">
                  {p.n}
                </span>
                {p.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-steel">{p.detail}</p>
            </CardContent>
          </Card>
        ))}
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
            <CardDescription>Create an organisation before generating a SafeFile.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        data.organisations.map((org) => {
          const orgDocs = data.documents.filter((d) => d.organisation_id === org.id);
          const orgApps = data.appointments.filter((a) => a.organisation_id === org.id);
          const readyModules = SAFEFILE_MODULES.filter((m) => moduleReady(orgDocs, m, today)).length;
          const required = requiredDesignations(org.sector);
          const currentDesignations = new Set(
            orgApps
              .filter(
                (a) => a.appointed_at <= today && (!a.expires_at || a.expires_at >= today),
              )
              .map((a) => a.designation),
          );
          const chainCovered = required.filter((d) => currentDesignations.has(d)).length;
          return (
            <Card key={org.id}>
              <CardHeader>
                <CardTitle className="flex flex-wrap items-center justify-between gap-2">
                  {org.name}
                  <span className="flex gap-2">
                    <Badge variant="steel" className="capitalize">{org.sector}</Badge>
                    <Badge variant={readyModules === SAFEFILE_MODULES.length ? 'gold' : 'steel'}>
                      {readyModules}/{SAFEFILE_MODULES.length} modules
                    </Badge>
                    <Badge variant={chainCovered === required.length ? 'gold' : 'steel'}>
                      chain {chainCovered}/{required.length}
                    </Badge>
                  </span>
                </CardTitle>
                <CardDescription className="flex flex-wrap gap-1.5 pt-1">
                  {SAFEFILE_MODULES.map((m) => (
                    <Badge key={m} variant={moduleReady(orgDocs, m, today) ? 'gold' : 'steel'}>
                      {SAFEFILE_MODULE_LABELS[m]}
                    </Badge>
                  ))}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Link href={`/print/safefile/${org.id}`} target="_blank">
                    <Button variant="gold">Generate Health &amp; Safety File</Button>
                  </Link>
                  <a href={`/print/safefile/${org.id}/docx`}>
                    <Button variant="outline">Download Word (.docx)</Button>
                  </a>
                </div>
                <p className="mt-2 text-xs text-steel">
                  PDF opens in a new tab; Word downloads directly. Incomplete modules are
                  flagged in the file itself — the generator never fabricates evidence.
                </p>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
