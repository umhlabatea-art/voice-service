import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from 'docx';
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
import { supabaseServer } from '@/lib/supabase/server';

// Word export runs on the Node runtime — docx relies on Buffer/streams.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const NAVY = '0D1B2A';
const GOLD = 'C9A84C';
const STEEL = '5C6B7A';
const NON = 'E76F51'; // ohs-non-compliant — VACANT / MISSING markers

const BAND_LABELS: Record<ComplianceScore['band'], string> = {
  compliant: 'COMPLIANT',
  conditionally_compliant: 'CONDITIONALLY COMPLIANT',
  non_compliant: 'NON-COMPLIANT',
  critical_risk: 'CRITICAL RISK',
};

function cell(text: string, opts: { bold?: boolean; color?: string; header?: boolean } = {}) {
  return new TableCell({
    width: { size: 25, type: WidthType.PERCENTAGE },
    shading: opts.header ? { fill: 'F2F1ED' } : undefined,
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text,
            bold: opts.bold ?? opts.header,
            color: opts.color ?? NAVY,
            font: opts.header ? 'Consolas' : 'Calibri',
            size: opts.header ? 16 : 20,
          }),
        ],
      }),
    ],
  });
}

function table(headers: string[], rows: TableCell[][]) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 2, color: 'D9D9D9' },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: 'D9D9D9' },
      left: { style: BorderStyle.SINGLE, size: 2, color: 'D9D9D9' },
      right: { style: BorderStyle.SINGLE, size: 2, color: 'D9D9D9' },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: 'E8E8E8' },
      insideVertical: { style: BorderStyle.SINGLE, size: 2, color: 'E8E8E8' },
    },
    rows: [
      new TableRow({ children: headers.map((h) => cell(h, { header: true })) }),
      ...rows.map((r) => new TableRow({ children: r })),
    ],
  });
}

function sectionHeading(title: string, cite: string) {
  return [
    new Paragraph({
      spacing: { before: 320, after: 40 },
      heading: HeadingLevel.HEADING_2,
      children: [new TextRun({ text: title, bold: true, color: NAVY, size: 26 })],
    }),
    new Paragraph({
      spacing: { after: 120 },
      children: [new TextRun({ text: cite, italics: true, color: STEEL, size: 16, font: 'Consolas' })],
    }),
  ];
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return new Response('Supabase not configured', { status: 404 });
  }
  const supabase = await supabaseServer();

  const { data: org } = await supabase
    .from('organisations')
    .select('*')
    .eq('id', id)
    .maybeSingle<Organisation>();
  if (!org) return new Response('Not found', { status: 404 });

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

  // 1. Appointment Register — VACANT where the S.16 chain has an open link.
  const appRows = required.map((d) => {
    const a = appointments.find(
      (x) => x.designation === d && x.appointed_at <= today && (!x.expires_at || x.expires_at >= today),
    );
    return [
      cell(DESIGNATION_LABELS[d]),
      a ? cell(a.appointee_name) : cell('VACANT', { bold: true, color: NON }),
      cell(a?.appointed_at ?? '—'),
      cell(a?.expires_at ?? (a ? 'no expiry' : '—')),
    ];
  });

  // 2. SafeFile Document Register — MISSING where a module has no document.
  const docRows = SAFEFILE_MODULES.map((m) => {
    const d = documents.find((x) => x.module === m);
    return [
      cell(SAFEFILE_MODULE_LABELS[m]),
      d ? cell(d.title) : cell('MISSING', { bold: true, color: NON }),
      cell(d?.valid_until ?? (d ? 'non-expiring' : '—')),
      cell(d ? (d.signed_by_16_1 ? 'Yes' : 'No') : '—'),
    ];
  });

  const children: (Paragraph | Table)[] = [
    new Paragraph({
      children: [
        new TextRun({ text: 'UMHLABATEA (Pty) Ltd · Umsavati OHS', color: GOLD, bold: true, size: 16, font: 'Consolas' }),
      ],
    }),
    new Paragraph({
      spacing: { after: 40 },
      children: [new TextRun({ text: 'Health & Safety File', bold: true, color: NAVY, size: 48 })],
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [new TextRun({ text: org.name, color: STEEL, size: 24 })],
    }),
    table(
      ['Sector', 'CIDB grade', 'COID reg.', 'Generated'],
      [[
        cell(org.sector),
        cell(org.cidb_grade != null ? String(org.cidb_grade) : '—'),
        cell(org.coid_registration ?? '—'),
        cell(today),
      ]],
    ),
    new Paragraph({
      spacing: { before: 160, after: 160 },
      children: latest
        ? [
            new TextRun({ text: 'Latest compliance score: ', color: STEEL, size: 20 }),
            new TextRun({ text: `${Number(latest.total).toFixed(1)} `, bold: true, color: NAVY, size: 22, font: 'Consolas' }),
            new TextRun({ text: BAND_LABELS[latest.band], bold: true, color: GOLD, size: 20, font: 'Consolas' }),
          ]
        : [new TextRun({ text: 'No compliance scan on record — run a scan before submission.', color: NON, size: 20 })],
    }),

    ...sectionHeading('1. Appointment Register', 'OHS Act 85/1993 S.16(1), S.16(2), S.8(2); Construction Regulations 2014 CR 5'),
    table(['Designation', 'Appointee', 'Appointed', 'Expires'], appRows),

    ...sectionHeading('2. SafeFile Document Register', 'OHS Act S.13/S.14; the six-module SafeFile set'),
    table(['Module', 'Title', 'Valid until', 'S.16(1) signed'], docRows),

    ...sectionHeading('3. Incident & Accident Register', 'OHS Act S.24 (reporting); COID Act (compensation)'),
    incidents.length === 0
      ? new Paragraph({ children: [new TextRun({ text: 'No incidents recorded.', color: STEEL, size: 20 })] })
      : table(
          ['Date', 'Kind', 'S.24', 'COID ref'],
          incidents.map((i) => [
            cell(i.occurred_at.slice(0, 10)),
            cell(INCIDENT_KIND_LABELS[i.kind]),
            cell(i.reported_s24 ? (i.reported_within_deadline === false ? 'Reported (late)' : 'Reported') : 'Not reported'),
            cell(i.coid_claim_ref ?? '—'),
          ]),
        ),

    ...sectionHeading('4. Training & Induction Records', 'OHS Act S.8(2)(e) — information, instruction, training, supervision'),
    training.length === 0
      ? new Paragraph({ children: [new TextRun({ text: 'No training records — S.8(2)(e) evidence outstanding.', color: NON, size: 20 })] })
      : table(
          ['Person', 'Course', 'Completed', 'Valid until'],
          training.map((t) => [
            cell(t.person_name),
            cell(t.course),
            cell(t.completed_at),
            cell(t.valid_until ?? 'non-expiring'),
          ]),
        ),

    new Paragraph({
      spacing: { before: 360 },
      border: { top: { style: BorderStyle.SINGLE, size: 4, color: 'D9D9D9', space: 8 } },
      children: [
        new TextRun({
          text: 'Generated by Umsavati OS · UMHLABATEA (Pty) Ltd. This file reflects data captured at generation and does not itself constitute legal certification. VACANT / MISSING markers indicate outstanding compliance items — remediate before submission.',
          color: STEEL,
          size: 15,
          font: 'Consolas',
        }),
      ],
    }),
  ];

  const doc = new Document({
    creator: 'Umsavati OS',
    title: `Health & Safety File — ${org.name}`,
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const filename = `HS-File_${org.name.replace(/[^a-z0-9]+/gi, '-')}_${today}.docx`;

  return new Response(buffer as unknown as BodyInit, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
      'Content-Length': String((buffer as Buffer).length),
    },
  });
}
