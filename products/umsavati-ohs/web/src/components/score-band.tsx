import { cn } from '@/lib/utils';

// Bands and thresholds mirror the generated `band` column on
// public.compliance_scores — display only, never recomputed client-side
// from dimension inputs. Colours come from the --ohs-* status palette,
// which is never mixed with brand gold.
export type ComplianceBand =
  | 'compliant'
  | 'conditionally_compliant'
  | 'non_compliant'
  | 'critical_risk';

const BAND_META: Record<
  ComplianceBand,
  { label: string; range: string; className: string }
> = {
  compliant: {
    label: 'COMPLIANT',
    range: '≥ 85',
    className: 'bg-ohs-compliant text-bone',
  },
  conditionally_compliant: {
    label: 'CONDITIONALLY COMPLIANT',
    range: '65–84',
    className: 'bg-ohs-conditional text-navy',
  },
  non_compliant: {
    label: 'NON-COMPLIANT',
    range: '45–64',
    className: 'bg-ohs-non-compliant text-bone',
  },
  critical_risk: {
    label: 'CRITICAL RISK',
    range: '< 45',
    className: 'bg-ohs-critical text-bone',
  },
};

export function ScoreBandChip({
  band,
  showRange = false,
  className,
}: {
  band: ComplianceBand;
  showRange?: boolean;
  className?: string;
}) {
  const meta = BAND_META[band];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs font-semibold tracking-wide',
        meta.className,
        className,
      )}
    >
      {meta.label}
      {showRange ? <span className="opacity-80">{meta.range}</span> : null}
    </span>
  );
}

export function ScoreBandLegend() {
  return (
    <div className="flex flex-wrap gap-2">
      {(Object.keys(BAND_META) as ComplianceBand[]).map((band) => (
        <ScoreBandChip key={band} band={band} showRange />
      ))}
    </div>
  );
}
