import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabaseServer } from '@/lib/supabase/server';
import {
  SAFEFILE_MODULES,
  SAFEFILE_MODULE_LABELS,
  type OhsDocument,
  type Organisation,
  type SafefileModule,
} from '@/lib/types';
import { createDocument, deleteDocument, toggleSigned } from './actions';
import { DeleteDocumentButton, DocumentForm, ToggleSignedButton } from './document-form';

export const metadata = { title: 'SafeFile Documents' };
export const dynamic = 'force-dynamic';

type Loaded =
  | 'unconfigured'
  | { organisations: Organisation[]; documents: OhsDocument[] };

async function load(): Promise<Loaded> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return 'unconfigured';
  }
  const supabase = await supabaseServer();
  const [orgs, docs] = await Promise.all([
    supabase.from('organisations').select('*').order('created_at'),
    supabase.from('documents').select('*').order('created_at', { ascending: false }),
  ]);
  return {
    organisations: (orgs.data as Organisation[] | null) ?? [],
    documents: (docs.data as OhsDocument[] | null) ?? [],
  };
}

// Mirrors documentCompleteness() in the scoring rubric (display only —
// scoring.ts is the source of truth): current + signed = full, present
// but lapsed/unsigned = partial, absent = missing.
function moduleStatus(
  docs: OhsDocument[],
  mod: SafefileModule,
  today: string,
): 'full' | 'partial' | 'missing' {
  const inModule = docs.filter((d) => d.module === mod);
  if (inModule.length === 0) return 'missing';
  const fullyValid = inModule.some(
    (d) => d.signed_by_16_1 && (!d.valid_until || d.valid_until >= today),
  );
  return fullyValid ? 'full' : 'partial';
}

export default async function DocumentsPage() {
  const data = await load();
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-navy">SafeFile Documents</h1>
        <p className="mt-1 text-steel">
          The six-module SafeFile register with validity and S.16(1) sign-off
          tracking. Feeds the Document Completeness dimension (22%).
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
              Create an organisation first — the SafeFile register hangs off the tenant.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <>
          {data.organisations.map((org) => {
            const orgDocs = data.documents.filter(
              (d) => d.organisation_id === org.id,
            );
            const fullCount = SAFEFILE_MODULES.filter(
              (m) => moduleStatus(orgDocs, m, today) === 'full',
            ).length;
            return (
              <Card key={org.id}>
                <CardHeader>
                  <CardTitle className="flex flex-wrap items-center justify-between gap-2">
                    {org.name}
                    <span className="font-mono text-sm font-normal text-steel">
                      modules {fullCount}/{SAFEFILE_MODULES.length}
                    </span>
                  </CardTitle>
                  <CardDescription className="flex flex-wrap gap-1.5">
                    {SAFEFILE_MODULES.map((m) => {
                      const status = moduleStatus(orgDocs, m, today);
                      return (
                        <Badge
                          key={m}
                          variant={
                            status === 'full'
                              ? 'gold'
                              : status === 'partial'
                                ? 'default'
                                : 'steel'
                          }
                        >
                          {SAFEFILE_MODULE_LABELS[m]}
                        </Badge>
                      );
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {orgDocs.length === 0 ? (
                    <p className="text-sm text-steel">No documents registered.</p>
                  ) : (
                    <ul className="divide-y divide-steel/15">
                      {orgDocs.map((d) => {
                        const lapsed = d.valid_until !== null && d.valid_until < today;
                        return (
                          <li
                            key={d.id}
                            className="flex flex-wrap items-center justify-between gap-2 py-2"
                          >
                            <span className="text-sm text-navy">
                              <span className="font-medium">{d.title}</span>{' '}
                              <span className="text-steel">
                                — {SAFEFILE_MODULE_LABELS[d.module]}
                              </span>
                            </span>
                            <span className="flex items-center gap-3">
                              <span className="font-mono text-xs text-steel">
                                {d.valid_until ? `valid → ${d.valid_until}` : 'non-expiring'}
                              </span>
                              {lapsed ? (
                                <Badge variant="steel" className="uppercase">
                                  lapsed
                                </Badge>
                              ) : null}
                              <Badge variant={d.signed_by_16_1 ? 'gold' : 'steel'}>
                                {d.signed_by_16_1 ? 'S.16(1) signed' : 'unsigned'}
                              </Badge>
                              <ToggleSignedButton
                                action={toggleSigned.bind(null, d.id, !d.signed_by_16_1)}
                                signed={d.signed_by_16_1}
                              />
                              <DeleteDocumentButton
                                action={deleteDocument.bind(null, d.id)}
                                title={d.title}
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
              <CardTitle>Register document</CardTitle>
              <CardDescription>
                A module counts fully only when a current, S.16(1)-signed document
                exists — the same rule the scoring engine applies. File uploads to
                Supabase Storage arrive with the SafeFile pipeline.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DocumentForm action={createDocument} organisations={data.organisations} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
