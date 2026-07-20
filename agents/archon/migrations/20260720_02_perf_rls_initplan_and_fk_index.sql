-- HITL-approved 2026-07-20 (CEO): performance advisor fixes.
-- FK index for sites.owner_id; RLS policies rewritten so auth.uid() is
-- evaluated once per query (initplan) instead of per row. Logic unchanged.

create index if not exists sites_owner_id_idx on public.sites (owner_id);

drop policy "owners manage their own sites" on public.sites;
create policy "owners manage their own sites" on public.sites
  as permissive for all to public
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

drop policy "owners manage floorplans for their own sites" on public.floorplans;
create policy "owners manage floorplans for their own sites" on public.floorplans
  as permissive for all to public
  using ((select auth.uid()) in (select sites.owner_id from public.sites where sites.id = floorplans.site_id))
  with check ((select auth.uid()) in (select sites.owner_id from public.sites where sites.id = floorplans.site_id));
