"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { KwitansiPaper } from "@/components/kwitansi/kwitansi-paper";
import { formatReceiptNumber } from "@/lib/receipt-number";
import type { Settings } from "@/lib/settings";
import { terbilang } from "@/lib/terbilang";
import { settingsSchema } from "@/lib/validators";
import { updateSettings } from "./actions";

function Field({
  label,
  value,
  onChange,
  placeholder,
  textarea,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  textarea?: boolean;
  hint?: string;
}) {
  return (
    <div>
      <div className="mb-[7px] text-[12.5px] font-semibold text-muted-foreground">
        {label}
      </div>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-[64px] w-full resize-y rounded-[10px] border border-line bg-surface px-[13px] py-[10px] text-[13.5px] leading-relaxed text-ink outline-none focus:border-brand focus:ring-[3px] focus:ring-brand-soft placeholder:text-meta"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-[42px] w-full rounded-[10px] border border-line bg-surface px-[13px] text-[13.5px] text-ink outline-none focus:border-brand focus:ring-[3px] focus:ring-brand-soft placeholder:text-meta"
        />
      )}
      {hint && <div className="mt-1.5 text-[11.5px] text-meta">{hint}</div>}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-[14px] border border-line bg-surface px-[22px] py-5">
      <div className="text-[15px] font-bold text-ink">{title}</div>
      {children}
    </div>
  );
}

export function SettingsForm({ initial }: { initial: Settings }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [s, setS] = useState<Settings>(initial);

  const set = (patch: Partial<Settings>) => setS((p) => ({ ...p, ...patch }));

  const numberExample = s.receiptPattern.trim()
    ? formatReceiptNumber(9, new Date(), s.receiptPattern)
    : "—";

  function save() {
    const parsed = settingsSchema.safeParse(s);
    if (!parsed.success) {
      toast.error("Periksa data", {
        description: parsed.error.issues[0]?.message,
      });
      return;
    }
    startTransition(async () => {
      const res = await updateSettings(parsed.data);
      if (!res.ok) {
        toast.error("Gagal menyimpan", { description: res.error });
        return;
      }
      toast.success("Pengaturan disimpan", {
        description: res.demo
          ? "Mode demo — tidak tersimpan permanen."
          : "Kwitansi baru akan memakai data ini.",
      });
      router.refresh();
    });
  }

  return (
    <div className="flex min-h-full flex-col">
      <div className="sticky top-0 z-10 flex flex-none items-center justify-between border-b border-line bg-surface px-4 py-2.5 md:h-14 md:px-[18px] md:py-0">
        <span className="text-base font-extrabold text-ink">Pengaturan</span>
        <button
          onClick={save}
          disabled={pending}
          className="flex items-center gap-2 rounded-[10px] bg-navy px-[18px] py-[9px] text-[13px] font-semibold text-white hover:bg-navy/90 disabled:opacity-60"
        >
          {pending && <Loader2 className="size-4 animate-spin" />}
          Simpan
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-[18px] p-4 lg:flex-row lg:p-[18px]">
        {/* Form */}
        <div className="flex min-w-0 flex-1 flex-col gap-[18px]">
          <Section title="Perusahaan">
            <Field
              label="Nama Perusahaan"
              value={s.companyName}
              onChange={(v) => set({ companyName: v })}
              placeholder="PT KECAP NUSANTARA"
            />
            <Field
              label="Alamat & Telp"
              value={s.companyAddress}
              onChange={(v) => set({ companyAddress: v })}
              placeholder="Jl. Pelabuhan Raya No. 88, Surabaya · Telp (031) 555-0188"
              textarea
            />
            <Field
              label="Kota (tempat tanda tangan)"
              value={s.city}
              onChange={(v) => set({ city: v })}
              placeholder="Surabaya"
            />
          </Section>

          <Section title="Footer Kwitansi">
            <Field
              label="Baris Rekening"
              value={s.bankLine}
              onChange={(v) => set({ bankLine: v })}
              placeholder="Bank Mandiri · 142-00-1234567-8 · a.n PT Kecap Nusantara"
            />
            <Field
              label="Catatan Footer"
              value={s.footerNote}
              onChange={(v) => set({ footerNote: v })}
              placeholder="Dokumen sah tanpa tanda tangan basah"
            />
          </Section>

          <Section title="Penandatangan">
            <Field
              label="Nama Penandatangan"
              value={s.signerName}
              onChange={(v) => set({ signerName: v })}
              placeholder="Andi Darma"
            />
            <Field
              label="Jabatan"
              value={s.signerRole}
              onChange={(v) => set({ signerRole: v })}
              placeholder="Admin Finance"
            />
          </Section>

          <Section title="Nomor Kwitansi">
            <Field
              label="Pola Nomor"
              value={s.receiptPattern}
              onChange={(v) => set({ receiptPattern: v })}
              placeholder="{seq3}/{roman}/{yy}"
              hint="Token: {seq3}=009 · {seq}=9 · {roman}=VII · {month}=07 · {yy}=26 · {yyyy}=2026"
            />
            <div className="rounded-[10px] bg-surface-2 px-[13px] py-2.5 text-[13px]">
              <span className="text-muted-foreground">Contoh: </span>
              <span className="font-bold tabnum text-navy">{numberExample}</span>
            </div>
          </Section>
        </div>

        {/* Live preview */}
        <div className="flex w-full flex-col gap-3 lg:w-[500px] lg:flex-none">
          <div className="text-[13px] font-bold uppercase tracking-[0.04em] text-muted-foreground">
            Preview Kwitansi
          </div>
          <div className="lg:sticky lg:top-[72px]">
            <KwitansiPaper
              settings={s}
              data={{
                number: numberExample,
                date: new Date().toISOString(),
                companyName: "PT Samudra Biru",
                amount: 2_500_000,
                amountWords: terbilang(2_500_000),
                description: "Jasa bongkar muat kargo — contoh keperluan.",
                vesselName: "MV Sinar Jaya",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
