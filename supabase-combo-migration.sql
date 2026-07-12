-- Combo listings (two side-by-side lots, buy-both / buy-A / buy-B toggle).
-- Additive and safe to run on the live inventory table: existing rows keep
-- listing_type = 'single' and variants = NULL, so single listings are
-- unaffected. Run once in Supabase → SQL Editor.

alter table public.inventory
  add column if not exists listing_type text default 'single',
  add column if not exists variants jsonb;

-- Backfill any pre-existing rows that are null (defensive; the default above
-- only applies to future inserts).
update public.inventory
  set listing_type = 'single'
  where listing_type is null;
