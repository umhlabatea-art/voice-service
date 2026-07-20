// Mirrors the enums and rows of the applied foundation schema
// (products/umsavati-ohs/supabase/schema/20260720_umsavati_foundation.sql).
export const SECTORS = [
  'construction',
  'agriculture',
  'healthcare',
  'education',
  'manufacturing',
  'events',
] as const;
export type Sector = (typeof SECTORS)[number];

export interface Organisation {
  id: string;
  name: string;
  sector: Sector;
  cidb_grade: number | null;
  coid_registration: string | null;
  created_at: string;
  updated_at: string;
}

export const DESIGNATIONS = [
  's16_1_employer',
  's16_2_assistant',
  's8_2_competent_person',
  's14_employee',
  'cr5_construction_manager',
  'sasrea_event_safety_officer',
] as const;
export type Designation = (typeof DESIGNATIONS)[number];

export const DESIGNATION_LABELS: Record<Designation, string> = {
  s16_1_employer: 'S.16(1) Chief Executive',
  s16_2_assistant: 'S.16(2) Assistant',
  s8_2_competent_person: 'S.8(2) Competent Person',
  s14_employee: 'S.14 Employee',
  cr5_construction_manager: 'CR 5 Construction Manager',
  sasrea_event_safety_officer: 'SASREA Event Safety Officer',
};

// Display-only mirror of requiredDesignations() in the scoring rubric
// (supabase/functions/score-organisation/scoring.ts) — that module is the
// source of truth; keep the two in step.
export function requiredDesignations(sector: Sector): Designation[] {
  const base: Designation[] = [
    's16_1_employer',
    's16_2_assistant',
    's8_2_competent_person',
  ];
  if (sector === 'construction') base.push('cr5_construction_manager');
  if (sector === 'events') base.push('sasrea_event_safety_officer');
  return base;
}

export interface Appointment {
  id: string;
  organisation_id: string;
  designation: Designation;
  appointee_name: string;
  appointed_at: string;
  expires_at: string | null;
  created_at: string;
}

export interface ComplianceScore {
  id: string;
  organisation_id: string;
  legal_compliance: number;
  document_completeness: number;
  incident_management: number;
  contractor_qualification: number;
  training_currency: number;
  physical_agent_exposure: number;
  total: number;
  band:
    | 'compliant'
    | 'conditionally_compliant'
    | 'non_compliant'
    | 'critical_risk';
  scored_at: string;
}
