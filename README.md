# FOMS — Financial Operation Management System (PT Kecap)

Implementasi web app FOMS sesuai PRD: **Next.js 15 · React 19 · TypeScript · Tailwind v4 · shadcn/ui · Supabase**. Mengikuti arah visual hi-fi **1c (Padat Data / top-nav navy)** dari design handoff.

> Dokumen desain sumber ada di `design_handoff_foms/` (PRD.md + FOMS.dc.html). File ini mendokumentasikan aplikasi yang dibangun.

## Yang sudah dibangun (fase ini)

| Layar | Route | Status |
|---|---|---|
| Login | `/login` | ✅ split-screen, Supabase auth + mode demo |
| Dashboard | `/dashboard` | ✅ stat strip, grafik per bulan, per PT, kwitansi terbaru |
| Daftar Kwitansi | `/kwitansi` | ✅ filter (search/PT/status/periode), tabel, pagination — server-side |
| Buat Kwitansi | `/kwitansi/baru` | ✅ form + **preview PDF live** + terbilang otomatis + nomor otomatis |
| Laporan / Master Data / Pengaturan | `/laporan` `/master` `/pengaturan` | 🚧 placeholder (skema DB & token siap) |

## Mode Demo vs Supabase

Aplikasi jalan **tanpa konfigurasi apa pun**. Bila env Supabase kosong → **DEMO mode**: data contoh (identik dengan mock desain) disajikan dan login dilewati, sehingga `npm run dev` langsung menampilkan ketiga layar hi-fi. Lihat [src/lib/supabase/config.ts](src/lib/supabase/config.ts).

### Quick start (demo)

```bash
npm install
npm run dev        # http://localhost:3000  → langsung ke /dashboard
```

### Menyambungkan Supabase (data nyata + auth)

1. Buat project di [supabase.com](https://supabase.com).
2. SQL Editor → jalankan `supabase/migrations/0001_init.sql` lalu `supabase/seed.sql`.
3. Salin env & isi dari **Settings → API**:
   ```bash
   cp .env.local.example .env.local
   # NEXT_PUBLIC_SUPABASE_URL=...
   # NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
4. Buat user di **Authentication → Users**, lalu tambahkan barisnya ke tabel `public.users` (id = auth user id).
5. `npm run dev` — kini middleware memaksa login dan semua data dari Supabase.
6. (Opsional) generate tipe: `npx supabase gen types typescript --project-id <ref> > src/lib/database.types.ts`.

## Struktur

```
src/
  app/
    (app)/                     # grup terautentikasi (top-nav shell)
      layout.tsx               # top-nav 1c + kontainer scroll
      dashboard/page.tsx
      kwitansi/page.tsx        # daftar kwitansi (server, searchParams)
      kwitansi/baru/           # buat kwitansi (form client + server action)
      laporan|master|pengaturan/page.tsx
    login/page.tsx
    middleware.ts              # gate auth (aktif hanya bila Supabase dikonfigurasi)
  components/
    layout/top-nav.tsx
    dashboard/*                # stat-strip, monthly-bars, ranked-bars, recent-receipts
    kwitansi/*                 # receipt-filters, row-actions, pagination, kwitansi-paper
    ui/*                       # shadcn/ui (base-ui + Tailwind v4)
  lib/
    format.ts terbilang.ts receipt-number.ts   # util: currency/tanggal, terbilang, nomor
    validators.ts settings.ts types.ts mock.ts
    supabase/{client,server,middleware,config}.ts
    data/{dashboard,receipts,master}.ts         # data-access + fallback mock
supabase/
  migrations/0001_init.sql   seed.sql
```

## Design tokens

Warna dan radius dari handoff dipetakan di [src/app/globals.css](src/app/globals.css). Font memakai **Inter** (via `next/font`, `--font-sans-family`; handoff aslinya Plus Jakarta Sans):
token semantik shadcn (`--primary` = navy `#14294a`, `--border` = `#e5e9f0`, dst.) **plus** utilitas kustom `bg-navy`, `text-brand`, `bg-page`, `text-meta`, `bg-success-soft`, dll. Semua angka memakai `tabnum` (tabular-nums).

## Logika kunci

- **Terbilang** — [src/lib/terbilang.ts](src/lib/terbilang.ts): `2500000 → "Dua Juta Lima Ratus Ribu Rupiah"` (Title Case + "Rupiah").
- **Nomor kwitansi** — [src/lib/receipt-number.ts](src/lib/receipt-number.ts): pola configurable `{seq3}/{roman}/{yy}` → `009/VII/26` (bisa `FAZ/{seq3}/{yyyy}` via `NEXT_PUBLIC_RECEIPT_PATTERN`).
- **Preview live** — form controlled (React state); tiap perubahan langsung merefleksi ke `KwitansiPaper`.
- **Generate & Simpan** — validasi Zod → generate nomor + terbilang → insert `receipts` (server action). Di demo tidak dipersistensi.

## PDF Kwitansi

Generate PDF pakai **`@react-pdf/renderer`** (PDF vektor asli, teks bisa diseleksi) — jalan di browser, tanpa server/LibreOffice, aman di Vercel. Modul di-*lazy load* saat tombol diklik (tidak membebani bundle awal).
- [src/lib/pdf/kwitansi-pdf.tsx](src/lib/pdf/kwitansi-pdf.tsx) — dokumen react-pdf (A5 landscape, 1 halaman) meniru desain kwitansi.
- [src/lib/pdf/actions.ts](src/lib/pdf/actions.ts) — `downloadKwitansiPdf` & `buildKwitansiObjectUrl`.
- **Buat Kwitansi** → tombol *Download PDF*. **Daftar Kwitansi** → ikon mata (lihat/buka di tab baru) & tombol *PDF* (unduh).
- Font PDF = Helvetica bawaan (dokumen resmi); bisa diganti Inter dengan registrasi font TTF.

## Belum diimplementasi (langkah berikutnya)

- **Simpan PDF ke Storage**: upload hasil PDF ke Supabase Storage & isi `receipts.pdf_url` (saat ini digenerate on-demand di klien).
- **Export Word** (docxtemplater) dan **Export Excel/CSV** — masih stub bertoast.
- Aksi baris **Edit / Duplikat / Hapus** — masih stub bertoast.
- Modul **Laporan Operasional**, **Master Data**, **Pengaturan** (skema DB sudah ada).
- TanStack Query/Table (PRD) untuk CRUD interaktif.

## Skrip

```bash
npm run dev     # dev server
npm run build   # production build
npm run lint    # eslint
npx tsc --noEmit
```
