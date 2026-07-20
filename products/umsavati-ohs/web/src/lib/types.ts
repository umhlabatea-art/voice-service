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
