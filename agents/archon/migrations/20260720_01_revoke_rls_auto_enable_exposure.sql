-- HITL-approved 2026-07-20 (CEO): close anon/authenticated REST exposure of
-- the SECURITY DEFINER helper flagged by the security advisor.
revoke execute on function public.rls_auto_enable() from anon, authenticated, public;
