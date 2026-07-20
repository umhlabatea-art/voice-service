'use server';

import { revalidatePath } from 'next/cache';
import { supabaseServer } from '@/lib/supabase/server';

export interface FormState {
  error?: string;
  ok?: boolean;
  message?: string;
}

export async function createTrainingRecord(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const organisation_id = String(formData.get('organisation_id') ?? '');
  const person_name = String(formData.get('person_name') ?? '').trim();
  const course = String(formData.get('course') ?? '').trim();
  const completed_at = String(formData.get('completed_at') ?? '');
  const valid_until = String(formData.get('valid_until') ?? '');

  if (!organisation_id) return { error: 'Choose an organisation.' };
  if (!person_name) return { error: 'Person name is required.' };
  if (!course) return { error: 'Course is required.' };
  if (!completed_at) return { error: 'Completion date is required.' };
  if (valid_until && valid_until < completed_at) {
    return { error: 'Expiry cannot precede completion.' };
  }

  const supabase = await supabaseServer();
  const { error } = await supabase.from('training_records').insert({
    organisation_id,
    person_name,
    course,
    completed_at,
    valid_until: valid_until || null,
  });
  if (error) return { error: error.message };

  revalidatePath('/training');
  return { ok: true, message: 'Training record added.' };
}

export async function deleteTrainingRecord(id: string): Promise<void> {
  const supabase = await supabaseServer();
  await supabase.from('training_records').delete().eq('id', id);
  revalidatePath('/training');
}
