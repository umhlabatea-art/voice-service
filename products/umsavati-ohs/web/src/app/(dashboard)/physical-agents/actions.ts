'use server';

import { revalidatePath } from 'next/cache';
import { supabaseServer } from '@/lib/supabase/server';
import { PHYSICAL_AGENTS } from '@/lib/types';

export interface FormState {
  error?: string;
  ok?: boolean;
  message?: string;
}

export async function createReading(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const organisation_id = String(formData.get('organisation_id') ?? '');
  const agent = String(formData.get('agent') ?? '');
  const readingRaw = String(formData.get('reading') ?? '').trim();
  const unit = String(formData.get('unit') ?? '').trim();
  const measured_at = String(formData.get('measured_at') ?? '');
  const exceeds = formData.get('exceeds_action_level') === 'on';

  if (!organisation_id) return { error: 'Choose an organisation.' };
  if (!(PHYSICAL_AGENTS as readonly string[]).includes(agent)) {
    return { error: 'Choose a valid physical agent.' };
  }
  const reading = Number(readingRaw);
  if (readingRaw === '' || Number.isNaN(reading)) {
    return { error: 'A numeric reading is required.' };
  }
  if (!unit) return { error: 'A unit is required (dB(A), m/s², WBGT °C…).' };
  if (!measured_at) return { error: 'Measurement date is required.' };

  const supabase = await supabaseServer();
  const { error } = await supabase.from('physical_agent_readings').insert({
    organisation_id,
    agent,
    reading,
    unit,
    exceeds_action_level: exceeds,
    measured_at: new Date(measured_at).toISOString(),
  });
  if (error) return { error: error.message };

  revalidatePath('/physical-agents');
  return { ok: true, message: 'Reading recorded.' };
}

export async function deleteReading(id: string): Promise<void> {
  const supabase = await supabaseServer();
  await supabase.from('physical_agent_readings').delete().eq('id', id);
  revalidatePath('/physical-agents');
}
