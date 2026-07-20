'use server';

import { revalidatePath } from 'next/cache';
import { supabaseServer } from '@/lib/supabase/server';
import { DESIGNATIONS } from '@/lib/types';

export interface FormState {
  error?: string;
  ok?: boolean;
  message?: string;
}

export async function createAppointment(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const organisation_id = String(formData.get('organisation_id') ?? '');
  const designation = String(formData.get('designation') ?? '');
  const appointee_name = String(formData.get('appointee_name') ?? '').trim();
  const appointed_at = String(formData.get('appointed_at') ?? '');
  const expires_at = String(formData.get('expires_at') ?? '');

  if (!organisation_id) return { error: 'Choose an organisation.' };
  if (!(DESIGNATIONS as readonly string[]).includes(designation)) {
    return { error: 'Choose a valid designation.' };
  }
  if (!appointee_name) return { error: 'Appointee name is required.' };
  if (!appointed_at) return { error: 'Appointment date is required.' };
  if (expires_at && expires_at < appointed_at) {
    return { error: 'Expiry cannot precede the appointment date.' };
  }

  const supabase = await supabaseServer();
  // RLS with-check rejects organisations the caller doesn't own.
  const { error } = await supabase.from('appointments').insert({
    organisation_id,
    designation,
    appointee_name,
    appointed_at,
    expires_at: expires_at || null,
  });
  if (error) return { error: error.message };

  revalidatePath('/appointments');
  return { ok: true, message: 'Appointment recorded.' };
}

export async function deleteAppointment(id: string): Promise<void> {
  const supabase = await supabaseServer();
  await supabase.from('appointments').delete().eq('id', id);
  revalidatePath('/appointments');
}
