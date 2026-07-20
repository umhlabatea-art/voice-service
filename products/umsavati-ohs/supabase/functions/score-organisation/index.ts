// Umsavati OHS — scoring Edge Function.
// POST { "organisation_id": "<uuid>" } with a user JWT.
// Ownership is proven through RLS: the caller's client must be able to see
// the organisation row. Dimension inputs are then read and the score row
// written with the service role, because compliance_scores is select-only
// for users — score history is immutable from the client's side.

import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';
import { computeDimensions, type Sector } from './scoring.ts';

const json = (status: number, body: Record<string, unknown>): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') {
    return json(405, { error: 'POST only' });
  }

  let organisationId: string;
  try {
    const body: unknown = await req.json();
    const id = (body as { organisation_id?: unknown }).organisation_id;
    if (typeof id !== 'string' || id.length === 0) {
      return json(400, { error: 'organisation_id (uuid) is required' });
    }
    organisationId = id;
  } catch {
    return json(400, { error: 'JSON body required' });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const authHeader = req.headers.get('Authorization');
  if (!supabaseUrl || !anonKey || !serviceKey) {
    return json(500, { error: 'runtime environment incomplete' });
  }
  if (!authHeader) {
    return json(401, { error: 'Authorization header required' });
  }

  // Caller-scoped client: RLS decides whether this org is theirs.
  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: org, error: orgError } = await userClient
    .from('organisations')
    .select('id, sector')
    .eq('id', organisationId)
    .maybeSingle();
  if (orgError) {
    return json(400, { error: orgError.message });
  }
  if (!org) {
    return json(404, { error: 'organisation not found (or not yours)' });
  }

  const service = createClient(supabaseUrl, serviceKey);
  const eq = { organisation_id: organisationId };
  const [appointments, documents, incidents, contractors, training, readings] =
    await Promise.all([
      service.from('appointments').select('designation, appointed_at, expires_at').match(eq),
      service.from('documents').select('module, valid_until, signed_by_16_1').match(eq),
      service.from('incidents').select('kind, occurred_at, reported_s24, reported_within_deadline').match(eq),
      service.from('contractors').select('cidb_grade, cr5_competency_verified').match(eq),
      service.from('training_records').select('valid_until').match(eq),
      service.from('physical_agent_readings').select('measured_at, exceeds_action_level').match(eq),
    ]);
  const fetchError =
    appointments.error ?? documents.error ?? incidents.error ??
    contractors.error ?? training.error ?? readings.error;
  if (fetchError) {
    return json(500, { error: fetchError.message });
  }

  const dimensions = computeDimensions(org.sector as Sector, {
    appointments: appointments.data ?? [],
    documents: documents.data ?? [],
    incidents: incidents.data ?? [],
    contractors: contractors.data ?? [],
    training_records: training.data ?? [],
    physical_agent_readings: readings.data ?? [],
  });

  // total + band are generated columns — the DB owns the weighting.
  const { data: score, error: insertError } = await service
    .from('compliance_scores')
    .insert({ organisation_id: organisationId, ...dimensions })
    .select('id, *')
    .single();
  if (insertError) {
    return json(500, { error: insertError.message });
  }

  return json(200, { score });
});
