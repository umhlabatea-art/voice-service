'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { SECTORS, type Organisation } from '@/lib/types';
import type { FormState } from './actions';

const SECTOR_LABELS: Record<string, string> = {
  construction: 'Construction',
  agriculture: 'Agriculture',
  healthcare: 'Healthcare',
  education: 'Education',
  manufacturing: 'Manufacturing',
  events: 'Events',
};

const inputClass =
  'w-full rounded-md border border-steel/40 bg-white px-3 py-2 text-sm text-navy focus:outline-2 focus:outline-gold';

export function OrgForm({
  action,
  initial,
  submitLabel,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  initial?: Organisation;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    action,
    {},
  );

  return (
    <form action={formAction} className="space-y-4">
      <label className="block text-sm">
        <span className="mb-1 block text-steel">Organisation name</span>
        <input
          name="name"
          required
          defaultValue={initial?.name}
          className={inputClass}
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block text-sm">
          <span className="mb-1 block text-steel">Industry sector</span>
          <select
            name="sector"
            required
            defaultValue={initial?.sector ?? ''}
            className={inputClass}
          >
            <option value="" disabled>
              Select…
            </option>
            {SECTORS.map((s) => (
              <option key={s} value={s}>
                {SECTOR_LABELS[s]}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-steel">CIDB grade (1–9)</span>
          <input
            name="cidb_grade"
            type="number"
            min={1}
            max={9}
            defaultValue={initial?.cidb_grade ?? ''}
            className={inputClass}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-steel">COID registration</span>
          <input
            name="coid_registration"
            defaultValue={initial?.coid_registration ?? ''}
            className={inputClass}
          />
        </label>
      </div>
      {state.error ? (
        <p className="text-sm text-ohs-critical">{state.error}</p>
      ) : null}
      {state.ok && state.message ? (
        <p className="text-sm text-ohs-compliant">{state.message}</p>
      ) : null}
      <Button type="submit" variant="gold" disabled={pending}>
        {pending ? 'Working…' : submitLabel}
      </Button>
    </form>
  );
}
