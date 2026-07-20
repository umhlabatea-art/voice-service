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

export const SAFEFILE_MODULES = [
  'ohs_policy_statement',
  'risk_assessment_register',
  'health_safety_file',
  'emergency_preparedness_plan',
  'incident_accident_register',
  'training_induction_records',
] as const;
export type SafefileModule = (typeof SAFEFILE_MODULES)[number];

export const SAFEFILE_MODULE_LABELS: Record<SafefileModule, string> = {
  ohs_policy_statement: 'OHS Policy Statement',
  risk_assessment_register: 'Risk Assessment Register',
  health_safety_file: 'Health & Safety File',
  emergency_preparedness_plan: 'Emergency Preparedness Plan',
  incident_accident_register: 'Incident & Accident Register',
  training_induction_records: 'Training & Induction Records',
};

export interface OhsDocument {
  id: string;
  organisation_id: string;
  module: SafefileModule;
  title: string;
  storage_path: string | null;
  valid_until: string | null;
  signed_by_16_1: boolean;
  created_at: string;
}

export const INCIDENT_KINDS = [
  'injury',
  'disease',
  'near_miss',
  'property_damage',
] as const;
export type IncidentKind = (typeof INCIDENT_KINDS)[number];

export const INCIDENT_KIND_LABELS: Record<IncidentKind, string> = {
  injury: 'Injury',
  disease: 'Occupational Disease',
  near_miss: 'Near Miss',
  property_damage: 'Property Damage',
};

// S.24-reportable kinds (injury/disease) drive the Incident Management score.
export const REPORTABLE_KINDS: readonly IncidentKind[] = ['injury', 'disease'];

export interface Incident {
  id: string;
  organisation_id: string;
  kind: IncidentKind;
  occurred_at: string;
  description: string;
  reported_s24: boolean;
  coid_claim_ref: string | null;
  reported_within_deadline: boolean | null;
  created_at: string;
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
