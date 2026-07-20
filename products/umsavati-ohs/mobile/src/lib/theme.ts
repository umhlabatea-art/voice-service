import type { ComplianceBand } from './types';

// Locked brand tokens (CLAUDE.md §4) — the mobile mirror of the web app's
// --umh-* / --ohs-* CSS custom properties. Same hex, single definition.
export const colors = {
  navy: '#0D1B2A',
  gold: '#C9A84C',
  bone: '#FCFBF8',
  steel: '#5C6B7A',
  // OHS compliance status palette — NEVER mixed with brand gold.
  ohsCompliant: '#2D6A4F',
  ohsConditional: '#E9C46A',
  ohsNonCompliant: '#E76F51',
  ohsCritical: '#C1121F',
  border: 'rgba(92,107,122,0.25)',
  surface: '#FFFFFF',
} as const;

// Band → status colour + label + threshold copy (CLAUDE.md §2.2).
export const BAND_META: Record<
  ComplianceBand,
  { label: string; color: string; range: string }
> = {
  compliant: { label: 'COMPLIANT', color: colors.ohsCompliant, range: '≥ 85' },
  conditionally_compliant: {
    label: 'CONDITIONALLY COMPLIANT',
    color: colors.ohsConditional,
    range: '65–84',
  },
  non_compliant: { label: 'NON-COMPLIANT', color: colors.ohsNonCompliant, range: '45–64' },
  critical_risk: { label: 'CRITICAL RISK', color: colors.ohsCritical, range: '< 45' },
};

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;
export const radius = { sm: 8, md: 12, lg: 16 } as const;
