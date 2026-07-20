import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabaseServer } from '@/lib/supabase/server';
import type { Organisation } from '@/lib/types';
import { createOrganisation } from './actions';
import { OrgForm } from './org-form';

export const metadata = { title: 'Organisations' };
export const dynamic = 'force-dynamic';

async function loadOrganisations(): Promise<Organisation[] | 'unconfigured'> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return 'unconfigured';
  }
  const supabase = await supabaseServer();
  const { data } = await supabase
    .from('organisations')
    .select('*')
    .order('created_at', { ascending: true });
  return (data as Organisation[] | null) ?? [];
}

export default async function OrganisationsPage() {
  const orgs = await loadOrganisations();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-navy">Organisations</h1>
        <p className="mt-1 text-steel">
          Tenant organisations, sectors, and CIDB grades. Row-level security scopes
          everything here to your own account.
        </p>
      </div>

      {orgs === 'unconfigured' ? (
        <Card>
          <CardHeader>
            <CardTitle>Not connected</CardTitle>
            <CardDescription>
              Copy <code className="font-mono text-xs">.env.example</code> to{' '}
              <code className="font-mono text-xs">.env.local</code> to go live.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            {orgs.map((org) => (
              <Link key={org.id} href={`/organisations/${org.id}`}>
                <Card className="transition-colors hover:border-gold/60">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {org.name}
                      <Badge variant="steel" className="capitalize">
                        {org.sector}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="font-mono text-xs">
                      {org.cidb_grade ? `CIDB grade ${org.cidb_grade}` : 'No CIDB grade'}
                      {org.coid_registration ? ` · COID ${org.coid_registration}` : ''}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
            {orgs.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>No organisations yet</CardTitle>
                  <CardDescription>
                    Create your first organisation below — then run its first
                    compliance scan from the detail page.
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : null}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>New organisation</CardTitle>
              <CardDescription>
                Sector determines the required appointment chain (CR 5 for
                construction, SASREA safety officer for events).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OrgForm action={createOrganisation} submitLabel="Create organisation" />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
