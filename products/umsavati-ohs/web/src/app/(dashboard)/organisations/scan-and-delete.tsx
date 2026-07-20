'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import type { FormState } from './actions';

export function RunScanButton({
  action,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    action,
    {},
  );
  return (
    <form action={formAction} className="flex items-center gap-3">
      <Button type="submit" variant="gold" disabled={pending}>
        {pending ? 'Scanning…' : 'Run compliance scan'}
      </Button>
      {state.error ? (
        <span className="text-sm text-ohs-critical">{state.error}</span>
      ) : null}
      {state.ok && state.message ? (
        <span className="text-sm text-ohs-compliant">{state.message}</span>
      ) : null}
    </form>
  );
}

export function DeleteOrgButton({
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
        if (
          !window.confirm(
            `Delete "${name}" and all of its compliance records? This cannot be undone.`,
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <Button type="submit" variant="outline" className="text-ohs-critical">
        Delete organisation
      </Button>
    </form>
  );
}
