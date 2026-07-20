'use server';

import { revalidatePath } from 'next/cache';
import { supabaseServer } from '@/lib/supabase/server';
import { SAFEFILE_MODULES } from '@/lib/types';

export interface FormState {
  error?: string;
  ok?: boolean;
  message?: string;
}

export async function createDocument(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const organisation_id = String(formData.get('organisation_id') ?? '');
  const moduleName = String(formData.get('module') ?? '');
  const title = String(formData.get('title') ?? '').trim();
  const valid_until = String(formData.get('valid_until') ?? '');
  const signed = formData.get('signed_by_16_1') === 'on';

  if (!organisation_id) return { error: 'Choose an organisation.' };
  if (!(SAFEFILE_MODULES as readonly string[]).includes(moduleName)) {
    return { error: 'Choose a valid SafeFile module.' };
  }
  if (!title) return { error: 'Document title is required.' };

  const supabase = await supabaseServer();
  const { error } = await supabase.from('documents').insert({
    organisation_id,
    module: moduleName,
    title,
    valid_until: valid_until || null,
    signed_by_16_1: signed,
  });
  if (error) return { error: error.message };

  revalidatePath('/documents');
  return { ok: true, message: 'Document registered.' };
}

export async function toggleSigned(id: string, signed: boolean): Promise<void> {
  const supabase = await supabaseServer();
  await supabase.from('documents').update({ signed_by_16_1: signed }).eq('id', id);
  revalidatePath('/documents');
}

export async function deleteDocument(id: string): Promise<void> {
  const supabase = await supabaseServer();
  await supabase.from('documents').delete().eq('id', id);
  revalidatePath('/documents');
}
