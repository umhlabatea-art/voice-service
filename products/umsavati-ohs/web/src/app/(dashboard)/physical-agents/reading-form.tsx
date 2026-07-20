'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import {
  PHYSICAL_AGENTS,
  PHYSICAL_AGENT_LABELS,
  type Organisation,
} from '@/lib/types';
import type { FormState } from './actions';

const inputClass =
  'w-full rounded-md border border-steel/40 bg-white px-3 py-2 text-sm text-navy focus:outline-2 focus:outline-gold';

export function ReadingForm({
  action,
  organisations,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  organisations: Organisation[];
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(action, {});

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
          <span className="mb-1 block text-steel">Agent</span>
          <select name="agent" required defaultValue="" className={inputClass}>
            <option value="" disabled>
              Select…
            </option>
            {PHYSICAL_AGENTS.map((a) => (
              <option key={a} value={a}>
                {PHYSICAL_AGENT_LABELS[a]}
              </option>
            ))}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="block text-sm">
            <span className="mb-1 block text-steel">Reading</span>
            <input name="reading" type="number" step="any" required className={inputClass} />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-steel">Unit</span>
            <input name="unit" required placeholder="dB(A)" className={inputClass} />
          </label>
        </div>
        <label className="block text-sm">
          <span className="mb-1 block text-steel">Measured</span>
          <input name="measured_at" type="date" required className={inputClass} />
        </label>
      </div>
      <label className="flex items-center gap-2 text-sm text-navy">
        <input
          name="exceeds_action_level"
          type="checkbox"
          className="h-4 w-4 accent-[--umh-gold]"
        />
        Exceeds the action level
      </label>
      {state.error ? <p className="text-sm text-ohs-critical">{state.error}</p> : null}
      {state.ok && state.message ? (
        <p className="text-sm text-ohs-compliant">{state.message}</p>
      ) : null}
      <Button type="submit" variant="gold" disabled={pending}>
        {pending ? 'Working…' : 'Record reading'}
      </Button>
    </form>
  );
}

export function DeleteReadingButton({
  action,
}: {
  action: () => Promise<void>;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm('Remove this reading?')) e.preventDefault();
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
