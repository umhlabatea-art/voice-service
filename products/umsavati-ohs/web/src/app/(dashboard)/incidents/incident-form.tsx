'use client';

import { useActionState, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  INCIDENT_KINDS,
  INCIDENT_KIND_LABELS,
  type Organisation,
} from '@/lib/types';
import type { FormState } from './actions';

const inputClass =
  'w-full rounded-md border border-steel/40 bg-white px-3 py-2 text-sm text-navy focus:outline-2 focus:outline-gold';

export function IncidentForm({
  action,
  organisations,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  organisations: Organisation[];
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    action,
    {},
  );
  const [reported, setReported] = useState(false);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block text-steel">Organisation</span>
          <select name="organisation_id" required defaultValue="" className={inputClass}>
            <option value="" disabled>
              Select…
            </option>
            {organisations.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-steel">Kind</span>
          <select name="kind" required defaultValue="" className={inputClass}>
            <option value="" disabled>
              Select…
            </option>
            {INCIDENT_KINDS.map((k) => (
              <option key={k} value={k}>
                {INCIDENT_KIND_LABELS[k]}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-steel">Occurred</span>
          <input name="occurred_at" type="date" required className={inputClass} />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-steel">COID claim ref (optional)</span>
          <input name="coid_claim_ref" className={inputClass} />
        </label>
      </div>
      <label className="block text-sm">
        <span className="mb-1 block text-steel">Description</span>
        <textarea name="description" required rows={2} className={inputClass} />
      </label>
      <label className="flex items-center gap-2 text-sm text-navy">
        <input
          name="reported_s24"
          type="checkbox"
          checked={reported}
          onChange={(e) => setReported(e.target.checked)}
          className="h-4 w-4 accent-[--umh-gold]"
        />
        Reported to the DoEL under S.24
      </label>
      {reported ? (
        <label className="block text-sm">
          <span className="mb-1 block text-steel">
            Reported within the deadline? (7 days injury · 14 days disease)
          </span>
          <select name="reported_within_deadline" defaultValue="yes" className={inputClass}>
            <option value="yes">Yes — within deadline</option>
            <option value="no">No — late</option>
          </select>
        </label>
      ) : null}
      {state.error ? <p className="text-sm text-ohs-critical">{state.error}</p> : null}
      {state.ok && state.message ? (
        <p className="text-sm text-ohs-compliant">{state.message}</p>
      ) : null}
      <Button type="submit" variant="gold" disabled={pending}>
        {pending ? 'Working…' : 'Log incident'}
      </Button>
    </form>
  );
}

export function DeleteIncidentButton({
  action,
}: {
  action: () => Promise<void>;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm('Remove this incident from the register?')) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="text-xs text-steel underline-offset-2 hover:text-ohs-critical hover:underline"
      >
        Remove
      </button>
    </form>
  );
}
