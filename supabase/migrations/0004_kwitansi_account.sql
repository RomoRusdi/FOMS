-- FOMS — per-kwitansi payment account + ensure settings bank columns.
-- Fixes: "Could not find the 'bank_account_name' column of 'app_settings'"
-- (i.e. 0003 not applied) AND lets each kwitansi store its own account.
-- Idempotent — safe to run once even if 0003 already ran.

-- Ensure app_settings has the bank columns (default account).
alter table public.app_settings
  add column if not exists bank_name text not null default '',
  add column if not exists bank_account_name text not null default '',
  add column if not exists bank_account_number text not null default '';

-- Per-receipt account snapshot (editable on the Buat Kwitansi page).
alter table public.receipts
  add column if not exists bank_name text not null default '',
  add column if not exists bank_account_name text not null default '',
  add column if not exists bank_account_number text not null default '';

-- Recreate the joined view so it picks up the new receipt columns.
drop view if exists public.receipts_view;
create view public.receipts_view
with (security_invoker = on) as
select
  r.*,
  c.company_name,
  v.vessel_name
from public.receipts r
left join public.companies c on c.id = r.company_id
left join public.vessels v on v.id = r.vessel_id;

grant select on public.receipts_view to authenticated;

-- Reload PostgREST schema cache so the new columns are visible immediately.
notify pgrst, 'reload schema';
