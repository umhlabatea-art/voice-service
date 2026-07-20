'use server';

import { revalidatePath } from 'next/cache';
import { supabaseServer } from '@/lib/supabase/server';

export interface FormState {
  error?: string;
  ok?: boolean;
  message?: string;
}

export async function createContractor(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const organisation_id = String(formData.get('organisation_id') ?? '');
  const name = String(formData.get('name') ?? '').trim();
  const gradeRaw = String(formData.get('cidb_grade') ?? '').trim();
  const cr5 = formData.get('cr5_competency_verified') === 'on';

  if (!organisation_id) return { error: 'Choose an organisation.' };
  if (!name) return { error: 'Contractor name is required.' };
  let cidb_grade: number | null = null;
  if (gradeRaw !== '') {
    const parsed = Number(gradeRaw);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > 9) {
      return { error: 'CIDB grade must be a whole number from 1 to 9.' };
    }
    cidb_grade = parsed;
  }

  const supabase = await supabaseServer();
  const { error } = await supabase.from('contractors').insert({
    organisation_id,
    name,
    cidb_grade,
    cr5_competency_verified: cr5,
  });
  if (error) return { error: error.message };

  revalidatePath('/contractors');
  return { ok: true, message: 'Contractor added.' };
}

export async function toggleCr5(id: string, verified: boolean): Promise<void> {
  const supabase = await supabaseServer();
  await supabase
    .from('contractors')
    .update({ cr5_competency_verified: verified })
    .eq('id', id);
  revalidatePath('/contractors');
}

export async function deleteContractor(id: string): Promise<void> {
  const supabase = await supabaseServer();
  await supabase.from('contractors').delete().eq('id', id);
  revalidatePath('/contractors');
}
