import { notFound } from 'next/navigation';
import { ScoreBandChip } from '@/components/score-band';
import { Button } from '@/components/ui/button';
import { supabaseServer } from '@/lib/supabase/server';
import {
  DESIGNATION_LABELS,
  INCIDENT_KIND_LABELS,
  SAFEFILE_MODULES,
  SAFEFILE_MODULE_LABELS,
  requiredDesignations,
  type Appointment,
  type ComplianceScore,
  type Incident,
  type OhsDocument,
  type Organisation,
  type TrainingRecord,
} from '@/lib/types';
import { PrintButton } from '../../print-button';

export const metadata = { title: 'Health & Safety File' };
export const dynamic = 'force-dynamic';

const th = 'border border-steel/30 bg-navy/5 px-3 py-1.5 text-left font-mono text-[11px] uppercase tracking-wide text-steel';
const td = 'border border-steel/20 px-3 py-1.5 text-sm text-navy';

function Section({ title, cite, children }: { title: string; cite: string; children: React.ReactNode }) {
  return (
    <section className="mt-8 break-inside-avoid">
      <h2 className="font-display text-xl font-semibold text-navy">{title}</h2>
      <p className="mb-2 font-mono text-[11px] text-steel">{cite}</p>
      {children}
    </section>
  );
}

export default async function SafeFilePrintPage({
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

  const [apps, docs, incs, train, score] = await Promise.all([
    supabase.from('appointments').select('*').eq('organisation_id', id).order('appointed_at'),
    supabase.from('documents').select('*').eq('organisation_id', id).order('module'),
    supabase.from('incidents').select('*').eq('organisation_id', id).order('occurred_at', { ascending: false }),
    supabase.from('training_records').select('*').eq('organisation_id', id).order('completed_at', { ascending: false }),
    supabase.from('compliance_scores').select('*').eq('organisation_id', id).order('scored_at', { ascending: false }).limit(1).maybeSingle<ComplianceScore>(),
  ]);
  const appointments = (apps.data as Appointment[] | null) ?? [];
  const documents = (docs.data as OhsDocument[] | null) ?? [];
  const incidents = (incs.data as Incident[] | null) ?? [];
  const training = (train.data as TrainingRecord[] | null) ?? [];
  const latest = score.data ?? null;

  const today = new Date().toISOString().slice(0, 10);
  const required = requiredDesignations(org.sector);

  return (
    <main className="mx-auto max-w-3xl px-8 py-10 print:px-0 print:py-0">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-gold">
            UMHLABATEA (Pty) Ltd · Umsavati OHS
          </p>
          <h1 className="font-display text-3xl font-semibold text-navy">Health &amp; Safety File</h1>
          <p className="mt-1 text-steel">{org.name}</p>
        </div>
        <div className="flex gap-2 print:hidden">
          <a href={`/print/safefile/${id}/docx`}>
            <Button variant="outline">Download Word (.docx)</Button>
          </a>
          <PrintButton />
        </div>
      </div>

      <table className="w-full border-collapse">
        <tbody>
          <tr>
            <td className={td}><span className="text-steel">Sector</span></td>
            <td className={`${td} capitalize`}>{org.sector}</td>
            <td className={td}><span className="text-steel">CIDB grade</span></td>
            <td className={td}>{org.cidb_grade ?? '—'}</td>
          </tr>
          <tr>
            <td className={td}><span className="text-steel">COID reg.</span></td>
            <td className={td}>{org.coid_registration ?? '—'}</td>
            <td className={td}><span className="text-steel">Generated</span></td>
            <td className={td}>{today}</td>
          </tr>
        </tbody>
      </table>

      {latest ? (
        <div className="mt-4 flex items-center gap-3">
          <span className="font-mono text-sm text-steel">Latest compliance score</span>
          <span className="font-mono text-lg font-semibold text-navy">{Number(latest.total).toFixed(1)}</span>
          <ScoreBandChip band={latest.band} />
        </div>
      ) : (
        <p className="mt-4 font-mono text-xs text-ohs-non-compliant">
          No compliance scan on record — run a scan before submission.
        </p>
      )}

      <Section title="1. Appointment Register" cite="OHS Act 85/1993 S.16(1), S.16(2), S.8(2); Construction Regulations 2014 CR 5">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className={th}>Designation</th>
              <th className={th}>Appointee</th>
              <th className={th}>Appointed</th>
              <th className={th}>Expires</th>
            </tr>
          </thead>
          <tbody>
            {required.map((d) => {
              const a = appointments.find(
                (x) => x.designation === d && x.appointed_at <= today && (!x.expires_at || x.expires_at >= today),
              );
              return (
                <tr key={d}>
                  <td className={td}>{DESIGNATION_LABELS[d]}</td>
                  <td className={td}>{a ? a.appointee_name : <span className="text-ohs-non-compliant">VACANT</span>}</td>
                  <td className={td}>{a?.appointed_at ?? '—'}</td>
                  <td className={td}>{a?.expires_at ?? (a ? 'no expiry' : '—')}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Section>

      <Section title="2. SafeFile Document Register" cite="OHS Act S.13/S.14; the six-module SafeFile set">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className={th}>Module</th>
              <th className={th}>Title</th>
              <th className={th}>Valid until</th>
              <th className={th}>S.16(1) signed</th>
            </tr>
          </thead>
          <tbody>
            {SAFEFILE_MODULES.map((m) => {
              const d = documents.find((x) => x.module === m);
              return (
                <tr key={m}>
                  <td className={td}>{SAFEFILE_MODULE_LABELS[m]}</td>
                  <td className={td}>{d ? d.title : <span className="text-ohs-non-compliant">MISSING</span>}</td>
                  <td className={td}>{d?.valid_until ?? (d ? 'non-expiring' : '—')}</td>
                  <td className={td}>{d ? (d.signed_by_16_1 ? 'Yes' : 'No') : '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Section>

      <Section title="3. Incident & Accident Register" cite="OHS Act S.24 (reporting); COID Act (compensation)">
        {incidents.length === 0 ? (
          <p className="text-sm text-steel">No incidents recorded.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className={th}>Date</th>
                <th className={th}>Kind</th>
                <th className={th}>S.24</th>
                <th className={th}>COID ref</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((i) => (
                <tr key={i.id}>
                  <td className={td}>{i.occurred_at.slice(0, 10)}</td>
                  <td className={td}>{INCIDENT_KIND_LABELS[i.kind]}</td>
                  <td className={td}>{i.reported_s24 ? (i.reported_within_deadline === false ? 'Reported (late)' : 'Reported') : 'Not reported'}</td>
                  <td className={td}>{i.coid_claim_ref ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Section>

      <Section title="4. Training & Induction Records" cite="OHS Act S.8(2)(e) — information, instruction, training, supervision">
        {training.length === 0 ? (
          <p className="text-sm text-ohs-non-compliant">No training records — S.8(2)(e) evidence outstanding.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className={th}>Person</th>
                <th className={th}>Course</th>
                <th className={th}>Completed</th>
                <th className={th}>Valid until</th>
              </tr>
            </thead>
            <tbody>
              {training.map((t) => (
                <tr key={t.id}>
                  <td className={td}>{t.person_name}</td>
                  <td className={td}>{t.course}</td>
                  <td className={td}>{t.completed_at}</td>
                  <td className={td}>{t.valid_until ?? 'non-expiring'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Section>

      <footer className="mt-10 border-t border-steel/25 pt-4 font-mono text-[10px] text-steel">
        Generated by Umsavati OS · UMHLABATEA (Pty) Ltd. This file reflects data captured
        at generation and does not itself constitute legal certification. VACANT / MISSING
        markers indicate outstanding compliance items — remediate before submission.
      </footer>
    </main>
  );
}
