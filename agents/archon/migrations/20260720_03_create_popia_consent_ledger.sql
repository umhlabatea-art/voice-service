-- HITL-approved 2026-07-20 (CEO): POPIA consent ledger per
-- templates/legal/POPIA_LAWFUL_BASIS_MEMO.md §5. Append-only evidence store
-- for lawful-basis events. Written only by n8n via service role; no anon or
-- authenticated policies (deny-by-default under RLS).

create type popia_subject_type as enum ('natural_person', 'juristic_rep');
create type popia_basis as enum ('legitimate_interest', 'consent', 'contract');
create type popia_event as enum ('first_touch', 'opt_in', 'opt_out', 'erasure_request');

create table public.popia_consent_ledger (
  id uuid primary key default gen_random_uuid(),
  subject_identifier text not null,
  subject_type popia_subject_type not null,
  basis popia_basis not null,
  event popia_event not null,
  evidence jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  recorded_by text not null
);

comment on table public.popia_consent_ledger is
  'Append-only POPIA lawful-basis ledger. opt_out rows act as a permanent suppression list. Retention: 5 years.';

-- Suppression-list lookups by identifier
create index popia_consent_ledger_subject_idx
  on public.popia_consent_ledger (subject_identifier, event);

-- Deny-by-default: RLS on, no policies for anon/authenticated.
alter table public.popia_consent_ledger enable row level security;

-- Append-only: block update/delete for every role, including service role.
create function public.popia_ledger_append_only()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  raise exception 'popia_consent_ledger is append-only';
end;
$$;

create trigger popia_consent_ledger_append_only
  before update or delete on public.popia_consent_ledger
  for each row execute function public.popia_ledger_append_only();
