"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { KwitansiPaper } from "@/components/kwitansi/kwitansi-paper";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatNumber } from "@/lib/format";
import { downloadKwitansiPdf, preloadPdf } from "@/lib/pdf/actions";
import type { Settings } from "@/lib/settings";
import { terbilang } from "@/lib/terbilang";
import type { Company, ReceiptStatus, Vessel } from "@/lib/types";
import { receiptSchema } from "@/lib/validators";
import { cn } from "@/lib/utils";
import { createReceipt } from "./actions";

interface Initial {
  companyId: string;
  vesselId: string;
  amount: number;
  description: string;
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0 flex-1">
      <div className="mb-[7px] text-[12.5px] font-semibold text-muted-foreground">
        {label}
      </div>
      {children}
    </div>
  );
}

const fieldSelect =
  "flex h-[42px] w-full items-center justify-between rounded-[10px] border border-line bg-surface px-[13px] text-[13px] outline-none data-[popup-open]:border-brand data-[popup-open]:ring-[3px] data-[popup-open]:ring-brand-soft";

const inputCls =
  "h-[42px] w-full rounded-[10px] border border-line bg-surface px-[13px] text-[13.5px] text-ink outline-none focus:border-brand focus:ring-[3px] focus:ring-brand-soft placeholder:text-meta";

export function CreateReceiptForm({
  companies,
  vessels,
  initialNumber,
  initialDate,
  initial,
  settings,
}: {
  companies: Company[];
  vessels: Vessel[];
  initialNumber: string;
  initialDate: string;
  initial: Initial;
  settings: Settings;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [pdfBusy, setPdfBusy] = useState(false);

  const [companyId, setCompanyId] = useState(initial.companyId);
  const [vesselId, setVesselId] = useState(initial.vesselId);
  const [date, setDate] = useState(initialDate);
  const [amount, setAmount] = useState(initial.amount);
  const [description, setDescription] = useState(initial.description);
  const [bankName, setBankName] = useState(settings.bankName);
  const [bankAccountName, setBankAccountName] = useState(
    settings.bankAccountName,
  );
  const [bankAccountNumber, setBankAccountNumber] = useState(
    settings.bankAccountNumber,
  );

  useEffect(() => {
    preloadPdf();
  }, []);

  const companyName =
    companies.find((c) => c.id === companyId)?.company_name ?? "";
  const vesselName = vessels.find((v) => v.id === vesselId)?.vessel_name ?? null;
  const amountWords = amount > 0 ? terbilang(amount) : "—";

  function submit(status: ReceiptStatus) {
    const input = {
      companyId,
      date,
      amount,
      description,
      vesselId: vesselId || null,
      status,
      bankName,
      bankAccountName,
      bankAccountNumber,
    };
    const parsed = receiptSchema.safeParse(input);
    if (!parsed.success) {
      toast.error("Lengkapi data kwitansi", {
        description: parsed.error.issues[0]?.message,
      });
      return;
    }

    startTransition(async () => {
      const res = await createReceipt(parsed.data);
      if (!res.ok) {
        toast.error("Gagal menyimpan", { description: res.error });
        return;
      }
      toast.success(status === "Draft" ? "Draft disimpan" : "Kwitansi dibuat", {
        description: `Nomor ${res.number}${
          res.demo ? " · mode demo (tidak tersimpan)" : ""
        }`,
      });
      router.push("/kwitansi");
      router.refresh();
    });
  }

  async function handleDownloadPdf() {
    if (!companyId || amount <= 0) {
      toast.error("Lengkapi data", {
        description: "Pilih PT dan isi nominal sebelum mengunduh PDF.",
      });
      return;
    }
    setPdfBusy(true);
    try {
      await downloadKwitansiPdf(
        {
          number: initialNumber,
          date,
          companyName,
          amount,
          amountWords,
          description,
          vesselName,
          bankName,
          bankAccountName,
          bankAccountNumber,
        },
        settings,
      );
    } catch {
      toast.error("Gagal membuat PDF");
    } finally {
      setPdfBusy(false);
    }
  }

  const stub = (what: string) => () =>
    toast.info(what, {
      description: "Export Word aktif setelah template .docx disambungkan.",
    });

  return (
    <div className="flex min-h-full flex-col">
      {/* Sub-header */}
      <div className="sticky top-0 z-10 flex flex-none flex-wrap items-center justify-between gap-2 border-b border-line bg-surface px-4 py-2.5 md:h-14 md:flex-nowrap md:px-[18px] md:py-0">
        <div className="flex items-center gap-2.5">
          <span className="hidden text-[13px] font-medium text-meta sm:inline">
            Kwitansi /
          </span>
          <span className="text-base font-extrabold text-ink">
            Buat Kwitansi
          </span>
        </div>
        <div className="flex flex-1 gap-2.5 md:flex-none">
          <button
            onClick={() => submit("Draft")}
            disabled={pending}
            className="flex-1 rounded-[10px] border border-line bg-surface px-4 py-[9px] text-[13px] font-semibold text-body hover:bg-surface-2 disabled:opacity-60 md:flex-none"
          >
            Simpan Draft
          </button>
          <button
            onClick={() => submit("Lunas")}
            disabled={pending}
            className="flex flex-1 items-center justify-center gap-2 rounded-[10px] bg-navy px-[18px] py-[9px] text-[13px] font-semibold text-white hover:bg-navy/90 disabled:opacity-60 md:flex-none"
          >
            {pending && <Loader2 className="size-4 animate-spin" />}
            Generate &amp; Simpan
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-[18px] p-4 lg:flex-row lg:p-[18px]">
        {/* Form */}
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="flex flex-col gap-4 rounded-[14px] border border-line bg-surface px-[22px] py-5">
            <div className="text-[15px] font-bold text-ink">Data Kwitansi</div>

            <div className="flex flex-col gap-3.5 sm:flex-row">
              <Field label="Nomor Kwitansi">
                <div className="flex h-[42px] items-center justify-between rounded-[10px] border border-line bg-surface-2 px-[13px] font-bold tabnum text-navy">
                  {initialNumber}
                  <span className="rounded-md bg-success-soft px-2 py-[3px] text-[11px] font-semibold text-success">
                    Otomatis
                  </span>
                </div>
              </Field>
              <Field label="Tanggal">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="h-[42px] w-full rounded-[10px] border border-line bg-surface px-[13px] text-[13px] font-medium text-ink outline-none focus:border-brand focus:ring-[3px] focus:ring-brand-soft"
                />
              </Field>
            </div>

            <Field label="Nama PT">
              <DropdownMenu>
                <DropdownMenuTrigger
                  className={cn(
                    fieldSelect,
                    companyName ? "font-medium text-ink" : "text-meta",
                  )}
                >
                  <span className="truncate">
                    {companyName || "Pilih perusahaan"}
                  </span>
                  <ChevronDown className="size-4 flex-none text-meta" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-h-72 overflow-y-auto">
                  {companies.map((c) => (
                    <DropdownMenuItem
                      key={c.id}
                      onClick={() => setCompanyId(c.id)}
                    >
                      {c.company_name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </Field>

            <div className="flex flex-col gap-3.5 sm:flex-row">
              <Field label="Nominal">
                <div className="flex h-[42px] items-center rounded-[10px] border border-line bg-surface px-[13px] focus-within:border-brand focus-within:ring-[3px] focus-within:ring-brand-soft">
                  <span className="mr-1.5 text-meta">Rp</span>
                  <input
                    inputMode="numeric"
                    value={amount ? formatNumber(amount) : ""}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "");
                      setAmount(digits ? parseInt(digits, 10) : 0);
                    }}
                    placeholder="0"
                    className="w-full bg-transparent text-[15px] font-bold tabnum text-ink outline-none placeholder:font-normal placeholder:text-meta"
                  />
                </div>
              </Field>
              <Field label="Kapal (opsional)">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className={cn(
                      fieldSelect,
                      vesselName ? "font-medium text-body" : "text-meta",
                    )}
                  >
                    <span className="truncate">
                      {vesselName || "Tanpa kapal"}
                    </span>
                    <ChevronDown className="size-4 flex-none text-meta" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="max-h-72 overflow-y-auto">
                    <DropdownMenuItem onClick={() => setVesselId("")}>
                      Tanpa kapal
                    </DropdownMenuItem>
                    {vessels.map((v) => (
                      <DropdownMenuItem
                        key={v.id}
                        onClick={() => setVesselId(v.id)}
                      >
                        {v.vessel_name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </Field>
            </div>

            <div>
              <div className="mb-[7px] text-[12.5px] font-semibold text-muted-foreground">
                Keperluan / Untuk Pembayaran
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Contoh: Jasa bongkar muat kargo…"
                className="min-h-[76px] w-full resize-y rounded-[10px] border border-line bg-surface px-[13px] py-[11px] text-[13.5px] leading-[1.55] text-body outline-none focus:border-brand focus:ring-[3px] focus:ring-brand-soft placeholder:text-meta"
              />
            </div>

            <div className="rounded-[10px] border border-dashed border-slate-300 bg-surface-2 px-3.5 py-3">
              <div className="mb-[5px] text-[11.5px] font-bold uppercase tracking-[0.04em] text-meta">
                Terbilang · otomatis
              </div>
              <div className="text-[13.5px] font-semibold italic text-navy">
                {amountWords}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-[14px] border border-line bg-surface px-[22px] py-5">
            <div>
              <div className="text-[15px] font-bold text-ink">
                Rekening Pembayaran
              </div>
              <div className="text-[12px] text-meta">
                Tampil di footer kwitansi. Prefill dari Pengaturan — bisa diubah
                khusus kwitansi ini.
              </div>
            </div>
            <Field label="Bank">
              <input
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="Bank Central Asia (BCA)"
                className={inputCls}
              />
            </Field>
            <div className="flex flex-col gap-3.5 sm:flex-row">
              <Field label="Atas Nama">
                <input
                  value={bankAccountName}
                  onChange={(e) => setBankAccountName(e.target.value)}
                  placeholder="Nama pemilik rekening"
                  className={inputCls}
                />
              </Field>
              <Field label="No. Rekening">
                <input
                  value={bankAccountNumber}
                  onChange={(e) => setBankAccountNumber(e.target.value)}
                  placeholder="0000000000"
                  className={inputCls}
                />
              </Field>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="flex w-full flex-col gap-3 lg:w-[500px] lg:flex-none">
          <div className="flex items-center justify-between">
            <div className="text-[13px] font-bold uppercase tracking-[0.04em] text-muted-foreground">
              Preview PDF
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDownloadPdf}
                disabled={pdfBusy}
                className="flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-brand hover:bg-surface-2 disabled:opacity-60"
              >
                {pdfBusy && <Loader2 className="size-3.5 animate-spin" />}
                Download PDF
              </button>
              <button
                onClick={stub("Export Word")}
                className="rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-body hover:bg-surface-2"
              >
                Word
              </button>
            </div>
          </div>
          <KwitansiPaper
            settings={settings}
            data={{
              number: initialNumber,
              date,
              companyName,
              amount,
              amountWords,
              description,
              vesselName,
              bankName,
              bankAccountName,
              bankAccountNumber,
            }}
          />
        </div>
      </div>
    </div>
  );
}
