-- FOMS — app settings (PRD Module 10). Single-row table (id = 1) holding the
-- kwitansi header/footer identity + receipt-number pattern.
--
-- Empty text fields fall back to DEFAULT_SETTINGS in code (src/lib/settings.ts),
-- so the app has sensible defaults until you fill them in on the Pengaturan page.

create table if not exists public.app_settings (
  id int primary key default 1,
  company_name text not null default '',
  company_address text not null default '',
  city text not null default '',
  bank_line text not null default '',
  footer_note text not null default '',
  signer_name text not null default '',
  signer_role text not null default '',
  receipt_pattern text not null default '',
  logo_url text,
  updated_at timestamptz not null default now(),
  constraint app_settings_singleton check (id = 1)
);

-- Seed the single row (all empty → code defaults apply until edited in the UI).
insert into public.app_settings (id) values (1) on conflict (id) do nothing;

drop trigger if exists app_settings_set_updated_at on public.app_settings;
create trigger app_settings_set_updated_at before update on public.app_settings
  for each row execute function set_updated_at();

alter table public.app_settings enable row level security;
drop policy if exists "authenticated full access" on public.app_settings;
create policy "authenticated full access" on public.app_settings
  for all to authenticated using (true) with check (true);
