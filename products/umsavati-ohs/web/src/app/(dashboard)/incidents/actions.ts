'use server';

import { revalidatePath } from 'next/cache';
import { supabaseServer } from '@/lib/supabase/server';
import { INCIDENT_KINDS } from '@/lib/types';

export interface FormState {
  error?: string;
  ok?: boolean;
  message?: string;
}

export async function createIncident(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const organisation_id = String(formData.get('organisation_id') ?? '');
  const kind = String(formData.get('kind') ?? '');
  const occurred_at = String(formData.get('occurred_at') ?? '');
  const description = String(formData.get('description') ?? '').trim();
  const reported_s24 = formData.get('reported_s24') === 'on';
  const within = formData.get('reported_within_deadline');
  const coid_claim_ref = String(formData.get('coid_claim_ref') ?? '').trim();

  if (!organisation_id) return { error: 'Choose an organisation.' };
  if (!(INCIDENT_KINDS as readonly string[]).includes(kind)) {
    return { error: 'Choose a valid incident kind.' };
  }
  if (!occurred_at) return { error: 'Date of occurrence is required.' };
  if (!description) return { error: 'A description is required.' };

  // Tri-state: only meaningful once reported. Unreported ⇒ null.
  const reported_within_deadline = reported_s24
    ? within === 'yes'
      ? true
      : within === 'no'
        ? false
        : null
    : null;

  const supabase = await supabaseServer();
  const { error } = await supabase.from('incidents').insert({
    organisation_id,
    kind,
    occurred_at: new Date(occurred_at).toISOString(),
    description,
    reported_s24,
    reported_within_deadline,
    coid_claim_ref: coid_claim_ref || null,
  });
  if (error) return { error: error.message };

  revalidatePath('/incidents');
  return { ok: true, message: 'Incident logged.' };
}

export async function deleteIncident(id: string): Promise<void> {
  const supabase = await supabaseServer();
  await supabase.from('incidents').delete().eq('id', id);
  revalidatePath('/incidents');
}
