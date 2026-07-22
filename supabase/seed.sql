-- FOMS — seed data mirroring the hi-fi mock (FOMS.dc.html, arah 1c).
-- Safe to run after 0001_init.sql. Idempotent-ish via ON CONFLICT.

-- Expense categories (PRD Module 6 defaults) --------------------------------
insert into public.expense_categories (category_name)
values
  ('Forklift'), ('Crane'), ('Trailer'), ('Dolly Heavy'), ('Dolly Medium'),
  ('Operator'), ('BBM'), ('Lashing'), ('Buruh'), ('Alat Berat'),
  ('Transport'), ('Lain-lain')
on conflict (category_name) do nothing;

-- Companies -----------------------------------------------------------------
insert into public.companies (company_name, address, phone, pic, status) values
  ('PT Samudra Biru',      'Jl. Pelabuhan No. 12, Surabaya',    '0812-1000-0001', 'Bpk. Hendra', 'Aktif'),
  ('PT Dermaga Makmur',    'Jl. Tanjung Perak No. 45, Surabaya','0812-1000-0002', 'Ibu Ratih',   'Aktif'),
  ('PT Anugrah Logistik',  'Jl. Kalimas Baru No. 8, Surabaya',  '0812-1000-0003', 'Bpk. Yusuf',  'Aktif'),
  ('PT Bahtera Jaya',      'Jl. Nilam Timur No. 21, Surabaya',  '0812-1000-0004', 'Ibu Sinta',   'Aktif')
on conflict do nothing;

-- Vessels -------------------------------------------------------------------
insert into public.vessels (vessel_name, code, owner, status) values
  ('MV Sinar Jaya',        'SJ-01', 'PT Samudra Biru',     'Aktif'),
  ('KM Bahari Nusantara',  'BN-02', 'PT Dermaga Makmur',   'Aktif'),
  ('MV Cakra Buana',       'CB-03', 'PT Anugrah Logistik', 'Aktif'),
  ('KM Teluk Intan',       'TI-04', 'PT Bahtera Jaya',     'Aktif'),
  ('MV Samudra Rezeki',    'SR-05', 'PT Samudra Biru',     'Aktif')
on conflict do nothing;

-- Receipts ------------------------------------------------------------------
insert into public.receipts
  (receipt_number, company_id, vessel_id, payment_description, payment_amount, payment_amount_words, payment_date, status)
values
  ('009/VII/26',
   (select id from public.companies where company_name = 'PT Samudra Biru'),
   (select id from public.vessels where vessel_name = 'MV Sinar Jaya'),
   'Jasa bongkar muat kargo — sewa forklift 1 shift, trailer 2 rit, dan BBM operasional.',
   2500000, 'Dua Juta Lima Ratus Ribu Rupiah', '2026-07-22', 'Lunas'),
  ('008/VII/26',
   (select id from public.companies where company_name = 'PT Dermaga Makmur'),
   (select id from public.vessels where vessel_name = 'KM Bahari Nusantara'),
   'Sewa crane dan operator untuk bongkar peti kemas 2 hari.',
   12750000, 'Dua Belas Juta Tujuh Ratus Lima Puluh Ribu Rupiah', '2026-07-21', 'Lunas'),
  ('007/VII/26',
   (select id from public.companies where company_name = 'PT Anugrah Logistik'),
   (select id from public.vessels where vessel_name = 'MV Cakra Buana'),
   'Jasa lashing dan buruh angkut muatan curah.',
   5100000, 'Lima Juta Seratus Ribu Rupiah', '2026-07-20', 'Pending'),
  ('006/VII/26',
   (select id from public.companies where company_name = 'PT Bahtera Jaya'),
   (select id from public.vessels where vessel_name = 'KM Teluk Intan'),
   'Transportasi trailer dan dolly heavy antar dermaga.',
   8900000, 'Delapan Juta Sembilan Ratus Ribu Rupiah', '2026-07-19', 'Lunas'),
  ('005/VII/26',
   (select id from public.companies where company_name = 'PT Samudra Biru'),
   (select id from public.vessels where vessel_name = 'MV Samudra Rezeki'),
   'Sewa alat berat forklift setengah hari.',
   3400000, 'Tiga Juta Empat Ratus Ribu Rupiah', '2026-07-18', 'Draft'),
  ('004/VII/26',
   (select id from public.companies where company_name = 'PT Dermaga Makmur'),
   null,
   'Paket jasa bongkar muat penuh termasuk BBM dan operator.',
   21000000, 'Dua Puluh Satu Juta Rupiah', '2026-07-17', 'Lunas')
on conflict (receipt_number) do nothing;
