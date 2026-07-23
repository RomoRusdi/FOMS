-- FOMS — split bank info into separate fields for the official kwitansi format
-- (Bank / Atas Nama / No. Rekening). Idempotent: safe to run once.
-- Run after 0002_settings.sql.

alter table public.app_settings
  add column if not exists bank_name text not null default '',
  add column if not exists bank_account_name text not null default '',
  add column if not exists bank_account_number text not null default '';

-- (Legacy columns company_name, company_address, bank_line, footer_note,
--  signer_role remain but are no longer used by the app — safe to ignore.)
