import { Suspense } from "react";
import { BrandMark } from "@/components/brand-mark";
import { LoginForm } from "@/components/auth/login-form";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata = { title: "Masuk · FOMS" };

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-page">
      {/* Brand panel */}
      <div className="relative hidden w-[46%] flex-col justify-between overflow-hidden bg-navy p-12 text-white lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(1200px 500px at -10% -10%, rgba(43,91,215,.55), transparent 60%)",
          }}
        />
        <div className="relative flex items-center gap-3">
          <BrandMark size={44} radius={12} />
          <div>
            <div className="text-lg font-extrabold leading-tight">
              PT Kecap FOMS
            </div>
            <div className="text-[12px] text-[#a9b8d4]">Finance Operations</div>
          </div>
        </div>

        <div className="relative">
          <div className="max-w-sm text-[26px] font-extrabold leading-tight tracking-[-0.02em]">
            Kwitansi, laporan, dan dashboard keuangan dalam satu tempat.
          </div>
          <p className="mt-3 max-w-sm text-[13.5px] leading-relaxed text-[#a9b8d4]">
            Otomatisasi administrasi bongkar muat — nomor kwitansi & terbilang
            otomatis, PDF sekali klik, rekap bulanan realtime.
          </p>
        </div>

        <div className="relative flex gap-8 text-white">
          <div>
            <div className="text-[22px] font-extrabold tabnum">150</div>
            <div className="text-[12px] text-[#a9b8d4]">Kwitansi</div>
          </div>
          <div>
            <div className="text-[22px] font-extrabold tabnum">Rp 550jt</div>
            <div className="text-[12px] text-[#a9b8d4]">Pengeluaran</div>
          </div>
          <div>
            <div className="text-[22px] font-extrabold tabnum">25</div>
            <div className="text-[12px] text-[#a9b8d4]">Perusahaan</div>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-[380px]">
          <div className="mb-6 flex items-center gap-3 lg:hidden">
            <BrandMark size={40} radius={11} />
            <span className="text-[17px] font-extrabold text-ink">
              PT Kecap FOMS
            </span>
          </div>
          <h1 className="text-[22px] font-extrabold tracking-[-0.01em] text-ink">
            Masuk ke akun Anda
          </h1>
          <p className="mb-6 mt-1 text-[13px] text-muted-foreground">
            Selamat datang kembali. Silakan masuk untuk melanjutkan.
          </p>
          <Suspense>
            <LoginForm configured={isSupabaseConfigured} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
