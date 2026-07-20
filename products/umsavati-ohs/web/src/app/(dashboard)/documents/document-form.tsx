'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import {
  SAFEFILE_MODULES,
  SAFEFILE_MODULE_LABELS,
  type Organisation,
} from '@/lib/types';
import type { FormState } from './actions';

const inputClass =
  'w-full rounded-md border border-steel/40 bg-white px-3 py-2 text-sm text-navy focus:outline-2 focus:outline-gold';

export function DocumentForm({
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
          <span className="mb-1 block text-steel">SafeFile module</span>
          <select name="module" required defaultValue="" className={inputClass}>
            <option value="" disabled>
              Select…
            </option>
            {SAFEFILE_MODULES.map((m) => (
              <option key={m} value={m}>
                {SAFEFILE_MODULE_LABELS[m]}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-steel">Document title</span>
          <input name="title" required className={inputClass} />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-steel">Valid until (blank = non-expiring)</span>
          <input name="valid_until" type="date" className={inputClass} />
        </label>
      </div>
      <label className="flex items-center gap-2 text-sm text-navy">
        <input name="signed_by_16_1" type="checkbox" className="h-4 w-4 accent-[--umh-gold]" />
        Signed by the S.16(1) appointee
      </label>
      {state.error ? <p className="text-sm text-ohs-critical">{state.error}</p> : null}
      {state.ok && state.message ? (
        <p className="text-sm text-ohs-compliant">{state.message}</p>
      ) : null}
      <Button type="submit" variant="gold" disabled={pending}>
        {pending ? 'Working…' : 'Register document'}
      </Button>
    </form>
  );
}

export function ToggleSignedButton({
  action,
  signed,
}: {
  action: () => Promise<void>;
  signed: boolean;
}) {
  return (
    <form action={action}>
      <button
        type="submit"
        className="text-xs text-steel underline-offset-2 hover:text-navy hover:underline"
      >
        {signed ? 'Mark unsigned' : 'Mark signed'}
      </button>
    </form>
  );
}

export function DeleteDocumentButton({
  action,
  title,
}: {
  action: () => Promise<void>;
  title: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(`Remove "${title}" from the register?`)) {
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
