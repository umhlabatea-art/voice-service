'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import type { Organisation } from '@/lib/types';
import type { FormState } from './actions';

const inputClass =
  'w-full rounded-md border border-steel/40 bg-white px-3 py-2 text-sm text-navy focus:outline-2 focus:outline-gold';

export function TrainingForm({
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
          <span className="mb-1 block text-steel">Person</span>
          <input name="person_name" required className={inputClass} />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-steel">Course</span>
          <input
            name="course"
            required
            placeholder="Induction, first aid, toolbox talk…"
            className={inputClass}
          />
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="block text-sm">
            <span className="mb-1 block text-steel">Completed</span>
            <input name="completed_at" type="date" required className={inputClass} />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-steel">Valid until</span>
            <input name="valid_until" type="date" className={inputClass} />
          </label>
        </div>
      </div>
      {state.error ? <p className="text-sm text-ohs-critical">{state.error}</p> : null}
      {state.ok && state.message ? (
        <p className="text-sm text-ohs-compliant">{state.message}</p>
      ) : null}
      <Button type="submit" variant="gold" disabled={pending}>
        {pending ? 'Working…' : 'Add record'}
      </Button>
    </form>
  );
}

export function DeleteTrainingButton({
  action,
  person,
}: {
  action: () => Promise<void>;
  person: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(`Remove the training record for ${person}?`)) e.preventDefault();
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
