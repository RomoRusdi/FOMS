-- FOMS — initial schema (PRD §Database Design + design_handoff)
-- Run in Supabase SQL editor, or via `supabase db push` with the CLI.
-- Note: pgcrypto sudah aktif di Supabase & gen_random_uuid() bawaan Postgres 13+,
-- jadi tidak perlu CREATE EXTENSION (yang justru gagal di editor read-only).

-- updated_at trigger helper -------------------------------------------------
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- users (profile linked to Supabase Auth; auth.users owns email/password) ---
create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null default '',
  email text,
  role text not null default 'admin_finance',
  created_at timestamptz not null default now()
);

-- master: companies ---------------------------------------------------------
create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  address text,
  phone text,
  pic text,
  status text not null default 'Aktif' check (status in ('Aktif', 'Nonaktif')),
  created_at timestamptz not null default now()
);

-- master: vessels -----------------------------------------------------------
create table if not exists public.vessels (
  id uuid primary key default gen_random_uuid(),
  vessel_name text not null,
  code text,
  owner text,
  status text not null default 'Aktif' check (status in ('Aktif', 'Nonaktif')),
  created_at timestamptz not null default now()
);

-- master: expense categories ------------------------------------------------
create table if not exists public.expense_categories (
  id uuid primary key default gen_random_uuid(),
  category_name text not null unique,
  created_at timestamptz not null default now()
);

-- receipts ------------------------------------------------------------------
create table if not exists public.receipts (
  id uuid primary key default gen_random_uuid(),
  receipt_number text not null unique,
  company_id uuid references public.companies (id) on delete set null,
  vessel_id uuid references public.vessels (id) on delete set null, -- design: "Kapal (opsional)"
  payment_description text not null default '',
  payment_amount bigint not null default 0, -- rupiah, integer (no cents)
  payment_amount_words text not null default '',
  payment_date date not null default current_date,
  status text not null default 'Draft' check (status in ('Lunas', 'Pending', 'Draft')),
  pdf_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists receipts_payment_date_idx on public.receipts (payment_date desc);
create index if not exists receipts_company_idx on public.receipts (company_id);
create index if not exists receipts_status_idx on public.receipts (status);
drop trigger if exists receipts_set_updated_at on public.receipts;
create trigger receipts_set_updated_at before update on public.receipts
  for each row execute function set_updated_at();

-- expense reports (laporan operasional) -------------------------------------
create table if not exists public.expense_reports (
  id uuid primary key default gen_random_uuid(),
  vessel_id uuid references public.vessels (id) on delete set null,
  report_date date not null default current_date,
  notes text,
  total bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists expense_reports_set_updated_at on public.expense_reports;
create trigger expense_reports_set_updated_at before update on public.expense_reports
  for each row execute function set_updated_at();

create table if not exists public.expense_items (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.expense_reports (id) on delete cascade,
  category_id uuid references public.expense_categories (id) on delete set null,
  description text not null default '',
  qty numeric not null default 1,
  unit text,
  price bigint not null default 0,
  subtotal bigint not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists expense_items_report_idx on public.expense_items (report_id);

-- audit log -----------------------------------------------------------------
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users (id) on delete set null,
  activity text not null,
  table_name text,
  record_id text,
  created_at timestamptz not null default now()
);

-- receipts_view: receipts joined with company & vessel names ----------------
create or replace view public.receipts_view
with (security_invoker = on) as
select
  r.*,
  c.company_name,
  v.vessel_name
from public.receipts r
left join public.companies c on c.id = r.company_id
left join public.vessels v on v.id = r.vessel_id;

-- Next receipt sequence for a given year (convenience for auto-numbering).
-- Uses max leading numeric segment so gaps don't cause duplicate numbers
-- (assumes the default "{seq3}/..." pattern where seq is the first segment).
create or replace function public.next_receipt_seq(p_year int)
returns int language sql stable as $$
  select coalesce(
    max(nullif(regexp_replace(split_part(receipt_number, '/', 1), '\D', '', 'g'), '')::int),
    0
  )::int + 1
  from public.receipts
  where extract(year from payment_date) = p_year;
$$;

-- Row Level Security --------------------------------------------------------
-- v1: single-role internal tool — any authenticated user has full access.
alter table public.users enable row level security;
alter table public.companies enable row level security;
alter table public.vessels enable row level security;
alter table public.expense_categories enable row level security;
alter table public.receipts enable row level security;
alter table public.expense_reports enable row level security;
alter table public.expense_items enable row level security;
alter table public.audit_logs enable row level security;

do $$
declare t text;
begin
  foreach t in array array[
    'users','companies','vessels','expense_categories',
    'receipts','expense_reports','expense_items','audit_logs'
  ] loop
    execute format(
      'drop policy if exists "authenticated full access" on public.%I;', t);
    execute format(
      'create policy "authenticated full access" on public.%I
         for all to authenticated using (true) with check (true);', t);
  end loop;
end $$;

grant select on public.receipts_view to authenticated;
