// Mirror of the applied foundation schema + the web app's types.ts. The scoring
// rubric (supabase/functions/score-organisation/scoring.ts) remains the single
// source of truth for arithmetic — this file is display types only.

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

export type ComplianceBand =
  | 'compliant'
  | 'conditionally_compliant'
  | 'non_compliant'
  | 'critical_risk';

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
  band: ComplianceBand;
  scored_at: string;
}

// Weighting per CLAUDE.md §2.2 — labels + weights for the dimension breakdown.
export const DIMENSIONS = [
  { key: 'legal_compliance', label: 'Legal Compliance', weight: 28 },
  { key: 'document_completeness', label: 'Document Completeness', weight: 22 },
  { key: 'incident_management', label: 'Incident Management', weight: 18 },
  { key: 'contractor_qualification', label: 'Contractor Qualification', weight: 14 },
  { key: 'training_currency', label: 'Training Currency', weight: 10 },
  { key: 'physical_agent_exposure', label: 'Physical Agent Exposure', weight: 8 },
] as const satisfies readonly {
  key: keyof ComplianceScore;
  label: string;
  weight: number;
}[];
