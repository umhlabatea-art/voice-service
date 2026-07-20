-- ============================================================================
-- DRAFT — NOT APPLIED. HITL approval required before execution (Session Rule 3).
-- Umsavati OHS rebuild foundation: minimum schema for the six-dimensional
-- compliance score engine. Sources: CLAUDE.md §2.2, memory/legislation.md.
-- Conventions: RLS on every table before any insert; policies use
-- (select auth.uid()) initplan form; touch_updated_at() reused from the
-- existing backend; every FK carries a covering index.
-- ============================================================================

-- ── Enums ───────────────────────────────────────────────────────────────────
create type industry_sector as enum
  ('construction','agriculture','healthcare','education','manufacturing','events');
create type appointment_designation as enum
  ('s16_1_employer','s16_2_assistant','s8_2_competent_person','s14_employee',
   'cr5_construction_manager','sasrea_event_safety_officer');
create type safefile_module as enum
  ('ohs_policy_statement','risk_assessment_register','health_safety_file',
   'emergency_preparedness_plan','incident_accident_register','training_induction_records');
create type incident_kind as enum ('injury','disease','near_miss','property_damage');
create type compliance_band as enum
  ('compliant','conditionally_compliant','non_compliant','critical_risk');

-- ── 1 · organisations (tenant root; owner-scoped RLS) ───────────────────────
create table public.organisations (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  sector industry_sector not null,
  cidb_grade smallint check (cidb_grade between 1 and 9),
  coid_registration text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index organisations_owner_id_idx on public.organisations (owner_id);
alter table public.organisations enable row level security;
create policy "owners manage their organisations" on public.organisations
  as permissive for all to public
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);
create trigger organisations_touch_updated_at
  before update on public.organisations
  for each row execute function public.touch_updated_at();

-- Shared child-table policy predicate: row's organisation belongs to caller.
-- (Repeated inline per table below; kept explicit for auditability.)

-- ── 2 · contractors (Contractor Qualification · 14%) ────────────────────────
create table public.contractors (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations (id) on delete cascade,
  name text not null,
  cidb_grade smallint check (cidb_grade between 1 and 9),
  cr5_competency_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index contractors_organisation_id_idx on public.contractors (organisation_id);
alter table public.contractors enable row level security;
create policy "org owners manage contractors" on public.contractors
  as permissive for all to public
  using ((select auth.uid()) in (select o.owner_id from public.organisations o where o.id = organisation_id))
  with check ((select auth.uid()) in (select o.owner_id from public.organisations o where o.id = organisation_id));
create trigger contractors_touch_updated_at
  before update on public.contractors
  for each row execute function public.touch_updated_at();

-- ── 3 · appointments (S.16 chain · Legal Compliance · 28%) ──────────────────
create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations (id) on delete cascade,
  designation appointment_designation not null,
  appointee_name text not null,
  appointed_at date not null,
  expires_at date,
  letter_document_id uuid,  -- FK added after documents table exists
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index appointments_organisation_id_idx on public.appointments (organisation_id);
alter table public.appointments enable row level security;
create policy "org owners manage appointments" on public.appointments
  as permissive for all to public
  using ((select auth.uid()) in (select o.owner_id from public.organisations o where o.id = organisation_id))
  with check ((select auth.uid()) in (select o.owner_id from public.organisations o where o.id = organisation_id));
create trigger appointments_touch_updated_at
  before update on public.appointments
  for each row execute function public.touch_updated_at();

-- ── 4 · documents (SafeFile register · Document Completeness · 22%) ─────────
create table public.documents (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations (id) on delete cascade,
  module safefile_module not null,
  title text not null,
  storage_path text,          -- Supabase Storage object path
  valid_until date,
  signed_by_16_1 boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index documents_organisation_id_idx on public.documents (organisation_id);
alter table public.documents enable row level security;
create policy "org owners manage documents" on public.documents
  as permissive for all to public
  using ((select auth.uid()) in (select o.owner_id from public.organisations o where o.id = organisation_id))
  with check ((select auth.uid()) in (select o.owner_id from public.organisations o where o.id = organisation_id));
create trigger documents_touch_updated_at
  before update on public.documents
  for each row execute function public.touch_updated_at();

alter table public.appointments
  add constraint appointments_letter_document_id_fkey
  foreign key (letter_document_id) references public.documents (id) on delete set null;
create index appointments_letter_document_id_idx on public.appointments (letter_document_id);

-- ── 5 · incidents (S.24 + COID · Incident Management · 18%) ─────────────────
create table public.incidents (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations (id) on delete cascade,
  kind incident_kind not null,
  occurred_at timestamptz not null,
  description text not null,
  reported_s24 boolean not null default false,
  coid_claim_ref text,
  reported_within_deadline boolean,  -- 7d injury / 14d disease
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index incidents_organisation_id_idx on public.incidents (organisation_id);
alter table public.incidents enable row level security;
create policy "org owners manage incidents" on public.incidents
  as permissive for all to public
  using ((select auth.uid()) in (select o.owner_id from public.organisations o where o.id = organisation_id))
  with check ((select auth.uid()) in (select o.owner_id from public.organisations o where o.id = organisation_id));
create trigger incidents_touch_updated_at
  before update on public.incidents
  for each row execute function public.touch_updated_at();

-- ── 6 · training_records (Training Currency · 10%) ──────────────────────────
create table public.training_records (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations (id) on delete cascade,
  person_name text not null,
  course text not null,      -- induction, first aid, toolbox talk, ...
  completed_at date not null,
  valid_until date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index training_records_organisation_id_idx on public.training_records (organisation_id);
alter table public.training_records enable row level security;
create policy "org owners manage training records" on public.training_records
  as permissive for all to public
  using ((select auth.uid()) in (select o.owner_id from public.organisations o where o.id = organisation_id))
  with check ((select auth.uid()) in (select o.owner_id from public.organisations o where o.id = organisation_id));
create trigger training_records_touch_updated_at
  before update on public.training_records
  for each row execute function public.touch_updated_at();

-- ── 7 · physical_agent_readings (Physical Agents Regs 2025 · 8%) ────────────
create table public.physical_agent_readings (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations (id) on delete cascade,
  agent text not null check (agent in ('noise','vibration_hand_arm','vibration_whole_body','thermal','em_radiation','optical_radiation')),
  reading numeric not null,
  unit text not null,        -- dB(A), m/s², WBGT °C, ...
  exceeds_action_level boolean not null default false,
  measured_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index physical_agent_readings_organisation_id_idx on public.physical_agent_readings (organisation_id);
alter table public.physical_agent_readings enable row level security;
create policy "org owners manage physical agent readings" on public.physical_agent_readings
  as permissive for all to public
  using ((select auth.uid()) in (select o.owner_id from public.organisations o where o.id = organisation_id))
  with check ((select auth.uid()) in (select o.owner_id from public.organisations o where o.id = organisation_id));
create trigger physical_agent_readings_touch_updated_at
  before update on public.physical_agent_readings
  for each row execute function public.touch_updated_at();

-- ── 8 · compliance_scores (engine output · immutable history) ───────────────
create table public.compliance_scores (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations (id) on delete cascade,
  legal_compliance numeric not null check (legal_compliance between 0 and 100),        -- 28%
  document_completeness numeric not null check (document_completeness between 0 and 100), -- 22%
  incident_management numeric not null check (incident_management between 0 and 100),  -- 18%
  contractor_qualification numeric not null check (contractor_qualification between 0 and 100), -- 14%
  training_currency numeric not null check (training_currency between 0 and 100),      -- 10%
  physical_agent_exposure numeric not null check (physical_agent_exposure between 0 and 100), -- 8%
  total numeric generated always as (
    legal_compliance * 0.28 + document_completeness * 0.22 + incident_management * 0.18
    + contractor_qualification * 0.14 + training_currency * 0.10 + physical_agent_exposure * 0.08
  ) stored,
  band compliance_band generated always as (
    case
      when (legal_compliance * 0.28 + document_completeness * 0.22 + incident_management * 0.18
            + contractor_qualification * 0.14 + training_currency * 0.10 + physical_agent_exposure * 0.08) >= 85 then 'compliant'::compliance_band
      when (legal_compliance * 0.28 + document_completeness * 0.22 + incident_management * 0.18
            + contractor_qualification * 0.14 + training_currency * 0.10 + physical_agent_exposure * 0.08) >= 65 then 'conditionally_compliant'::compliance_band
      when (legal_compliance * 0.28 + document_completeness * 0.22 + incident_management * 0.18
            + contractor_qualification * 0.14 + training_currency * 0.10 + physical_agent_exposure * 0.08) >= 45 then 'non_compliant'::compliance_band
      else 'critical_risk'::compliance_band
    end
  ) stored,
  scored_at timestamptz not null default now()
);
create index compliance_scores_organisation_id_idx on public.compliance_scores (organisation_id);
alter table public.compliance_scores enable row level security;
create policy "org owners read their scores" on public.compliance_scores
  as permissive for select to public
  using ((select auth.uid()) in (select o.owner_id from public.organisations o where o.id = organisation_id));
-- Writes come from the scoring edge function via service role only.
