'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import type { Organisation } from '@/lib/types';
import type { FormState } from './actions';

const inputClass =
  'w-full rounded-md border border-steel/40 bg-white px-3 py-2 text-sm text-navy focus:outline-2 focus:outline-gold';

export function ContractorForm({
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
          <span className="mb-1 block text-steel">Contractor name</span>
          <input name="name" required className={inputClass} />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-steel">CIDB grade (1–9)</span>
          <input name="cidb_grade" type="number" min={1} max={9} className={inputClass} />
        </label>
      </div>
      <label className="flex items-center gap-2 text-sm text-navy">
        <input
          name="cr5_competency_verified"
          type="checkbox"
          className="h-4 w-4 accent-[--umh-gold]"
        />
        CR 5 competency verified
      </label>
      {state.error ? <p className="text-sm text-ohs-critical">{state.error}</p> : null}
      {state.ok && state.message ? (
        <p className="text-sm text-ohs-compliant">{state.message}</p>
      ) : null}
      <Button type="submit" variant="gold" disabled={pending}>
        {pending ? 'Working…' : 'Add contractor'}
      </Button>
    </form>
  );
}

export function ToggleCr5Button({
  action,
  verified,
}: {
  action: () => Promise<void>;
  verified: boolean;
}) {
  return (
    <form action={action}>
      <button
        type="submit"
        className="text-xs text-steel underline-offset-2 hover:text-navy hover:underline"
      >
        {verified ? 'Unverify CR 5' : 'Verify CR 5'}
      </button>
    </form>
  );
}

export function DeleteContractorButton({
  action,
  name,
}: {
  action: () => Promise<void>;
  name: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(`Remove contractor "${name}"?`)) e.preventDefault();
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
