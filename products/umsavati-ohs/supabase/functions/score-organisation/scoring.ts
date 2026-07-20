// Umsavati OHS — six-dimension compliance scoring, rubric v1.
// This module produces the six 0–100 dimension inputs only. The weighted
// total (0.28/0.22/0.18/0.14/0.10/0.08) and band derivation live in the
// database as generated columns on public.compliance_scores — never
// duplicate that arithmetic here.
// Pure functions, no Deno/Supabase imports, so the rubric is unit-testable
// outside the edge runtime. Legislative anchors: memory/legislation.md.

export type Sector =
  | 'construction'
  | 'agriculture'
  | 'healthcare'
  | 'education'
  | 'manufacturing'
  | 'events';

export interface AppointmentRow {
  designation: string;
  appointed_at: string; // date
  expires_at: string | null;
}

export interface DocumentRow {
  module: string;
  valid_until: string | null;
  signed_by_16_1: boolean;
}

export interface IncidentRow {
  kind: string;
  occurred_at: string; // timestamptz
  reported_s24: boolean;
  reported_within_deadline: boolean | null;
}

export interface ContractorRow {
  cidb_grade: number | null;
  cr5_competency_verified: boolean;
}

export interface TrainingRow {
  valid_until: string | null;
}

export interface ReadingRow {
  measured_at: string; // timestamptz
  exceeds_action_level: boolean;
}

export interface Dimensions {
  legal_compliance: number;
  document_completeness: number;
  incident_management: number;
  contractor_qualification: number;
  training_currency: number;
  physical_agent_exposure: number;
}

const SAFEFILE_MODULES = [
  'ohs_policy_statement',
  'risk_assessment_register',
  'health_safety_file',
  'emergency_preparedness_plan',
  'incident_accident_register',
  'training_induction_records',
] as const;

const round1 = (n: number): number => Math.round(n * 10) / 10;

const notExpired = (until: string | null, now: Date): boolean =>
  until === null || new Date(until).getTime() >= now.getTime();

/** Required S.16 appointment chain per sector; CR 5 for construction,
 *  SASREA safety officer for events. S.14 records don't gate the score. */
export function requiredDesignations(sector: Sector): string[] {
  const base = ['s16_1_employer', 's16_2_assistant', 's8_2_competent_person'];
  if (sector === 'construction') base.push('cr5_construction_manager');
  if (sector === 'events') base.push('sasrea_event_safety_officer');
  return base;
}

/** Legal Compliance (28%): share of required designations with a current
 *  appointment (appointed on/before today, not expired). */
export function legalCompliance(
  sector: Sector,
  appointments: readonly AppointmentRow[],
  now: Date,
): number {
  const required = requiredDesignations(sector);
  const current = new Set(
    appointments
      .filter(
        (a) =>
          new Date(a.appointed_at).getTime() <= now.getTime() &&
          notExpired(a.expires_at, now),
      )
      .map((a) => a.designation),
  );
  const covered = required.filter((d) => current.has(d)).length;
  return round1((100 * covered) / required.length);
}

/** Document Completeness (22%): per SafeFile module — 100 if a current,
 *  S.16(1)-signed document exists; 50 if a document exists but is expired
 *  or unsigned; 0 if the module is absent. Averaged over all six modules. */
export function documentCompleteness(
  documents: readonly DocumentRow[],
  now: Date,
): number {
  const perModule = SAFEFILE_MODULES.map((mod) => {
    const docs = documents.filter((d) => d.module === mod);
    if (docs.length === 0) return 0;
    const fullyValid = docs.some(
      (d) => d.signed_by_16_1 && notExpired(d.valid_until, now),
    );
    return fullyValid ? 100 : 50;
  });
  return round1(perModule.reduce((a, b) => a + b, 0) / SAFEFILE_MODULES.length);
}

/** Incident Management (18%): over reportable incidents (injury/disease —
 *  the S.24/COID-notifiable kinds) in the trailing 12 months, the share
 *  that were S.24-reported and within the 7d/14d deadline. No reportable
 *  incidents in the window → 100 (nothing outstanding). */
export function incidentManagement(
  incidents: readonly IncidentRow[],
  now: Date,
): number {
  const windowStart = new Date(now.getTime());
  windowStart.setUTCFullYear(windowStart.getUTCFullYear() - 1);
  const reportable = incidents.filter(
    (i) =>
      (i.kind === 'injury' || i.kind === 'disease') &&
      new Date(i.occurred_at).getTime() >= windowStart.getTime(),
  );
  if (reportable.length === 0) return 100;
  const compliant = reportable.filter(
    (i) => i.reported_s24 && i.reported_within_deadline !== false,
  ).length;
  return round1((100 * compliant) / reportable.length);
}

/** Contractor Qualification (14%): per contractor, 50 for a stated CIDB
 *  grade + 50 for verified CR 5 competency, averaged. No contractors on
 *  record → 100 (no contractor exposure to manage). */
export function contractorQualification(
  contractors: readonly ContractorRow[],
): number {
  if (contractors.length === 0) return 100;
  const per = contractors.map(
    (c) => (c.cidb_grade !== null ? 50 : 0) + (c.cr5_competency_verified ? 50 : 0),
  );
  return round1(per.reduce((a, b) => a + b, 0) / contractors.length);
}

/** Training Currency (10%): share of training records still valid
 *  (null valid_until = non-expiring, e.g. once-off induction). No records
 *  at all → 0: absence of training evidence is itself the failure. */
export function trainingCurrency(
  records: readonly TrainingRow[],
  now: Date,
): number {
  if (records.length === 0) return 0;
  const valid = records.filter((r) => notExpired(r.valid_until, now)).length;
  return round1((100 * valid) / records.length);
}

/** Physical Agent Exposure (8%): over readings taken in the trailing
 *  24 months, share not exceeding the action level. No current readings →
 *  50: unmonitored is unknown, not safe (Physical Agents Regs 2025 require
 *  monitoring where agents are present). */
export function physicalAgentExposure(
  readings: readonly ReadingRow[],
  now: Date,
): number {
  const windowStart = new Date(now.getTime());
  windowStart.setUTCFullYear(windowStart.getUTCFullYear() - 2);
  const current = readings.filter(
    (r) => new Date(r.measured_at).getTime() >= windowStart.getTime(),
  );
  if (current.length === 0) return 50;
  const within = current.filter((r) => !r.exceeds_action_level).length;
  return round1((100 * within) / current.length);
}

export function computeDimensions(
  sector: Sector,
  data: {
    appointments: readonly AppointmentRow[];
    documents: readonly DocumentRow[];
    incidents: readonly IncidentRow[];
    contractors: readonly ContractorRow[];
    training_records: readonly TrainingRow[];
    physical_agent_readings: readonly ReadingRow[];
  },
  now: Date = new Date(),
): Dimensions {
  return {
    legal_compliance: legalCompliance(sector, data.appointments, now),
    document_completeness: documentCompleteness(data.documents, now),
    incident_management: incidentManagement(data.incidents, now),
    contractor_qualification: contractorQualification(data.contractors),
    training_currency: trainingCurrency(data.training_records, now),
    physical_agent_exposure: physicalAgentExposure(data.physical_agent_readings, now),
  };
}
