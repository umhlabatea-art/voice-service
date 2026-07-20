'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase/server';
import { SECTORS, type Sector } from '@/lib/types';

export interface FormState {
  error?: string;
  ok?: boolean;
  message?: string;
}

interface OrgFields {
  name: string;
  sector: Sector;
  cidb_grade: number | null;
  coid_registration: string | null;
}

function parseOrgFields(formData: FormData): OrgFields | { error: string } {
  const name = String(formData.get('name') ?? '').trim();
  const sector = String(formData.get('sector') ?? '');
  const gradeRaw = String(formData.get('cidb_grade') ?? '').trim();
  const coid = String(formData.get('coid_registration') ?? '').trim();

  if (!name) return { error: 'Organisation name is required.' };
  if (!(SECTORS as readonly string[]).includes(sector)) {
    return { error: 'Choose a valid industry sector.' };
  }
  let cidb_grade: number | null = null;
  if (gradeRaw !== '') {
    const parsed = Number(gradeRaw);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > 9) {
      return { error: 'CIDB grade must be a whole number from 1 to 9.' };
    }
    cidb_grade = parsed;
  }
  return {
    name,
    sector: sector as Sector,
    cidb_grade,
    coid_registration: coid || null,
  };
}

export async function createOrganisation(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const fields = parseOrgFields(formData);
  if ('error' in fields) return { error: fields.error };

  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Not signed in.' };

  const { data, error } = await supabase
    .from('organisations')
    .insert({ ...fields, owner_id: user.id })
    .select('id')
    .single();
  if (error) return { error: error.message };

  revalidatePath('/organisations');
  redirect(`/organisations/${data.id}`);
}

export async function updateOrganisation(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const fields = parseOrgFields(formData);
  if ('error' in fields) return { error: fields.error };

  const supabase = await supabaseServer();
  const { error } = await supabase
    .from('organisations')
    .update(fields)
    .eq('id', id);
  if (error) return { error: error.message };

  revalidatePath(`/organisations/${id}`);
  revalidatePath('/organisations');
  return { ok: true, message: 'Saved.' };
}

export async function deleteOrganisation(id: string): Promise<void> {
  const supabase = await supabaseServer();
  // RLS scopes the delete to the owner; children cascade by schema design.
  await supabase.from('organisations').delete().eq('id', id);
  revalidatePath('/organisations');
  redirect('/organisations');
}

export async function runScan(
  id: string,
  _prev: FormState,
  _formData: FormData,
): Promise<FormState> {
  const supabase = await supabaseServer();
  const { data, error } = await supabase.functions.invoke('score-organisation', {
    body: { organisation_id: id },
  });
  if (error) return { error: `Scan failed: ${error.message}` };

  const total = (data as { score?: { total?: number } })?.score?.total;
  revalidatePath(`/organisations/${id}`);
  revalidatePath('/');
  return {
    ok: true,
    message: total !== undefined ? `Scored ${Number(total).toFixed(1)}.` : 'Scored.',
  };
}
