import { BrandMark } from "@/components/brand-mark";
import { formatDateLong, formatRupiah } from "@/lib/format";
import type { Settings } from "@/lib/settings";

export interface KwitansiPaperData {
  number: string;
  date: string | Date;
  companyName: string;
  amount: number;
  amountWords: string;
  description: string;
  vesselName?: string | null;
}

const EMPTY = "—";

export function KwitansiPaper({
  data,
  settings,
}: {
  data: KwitansiPaperData;
  settings: Settings;
}) {
  const description = data.description.trim();
  const fullDescription =
    description && data.vesselName
      ? `${description} (${data.vesselName}).`
      : description;

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-white shadow-[0_14px_40px_-16px_rgba(16,31,54,.35)]">
      {/* Header */}
      <div className="flex items-center gap-3.5 bg-navy px-5 py-4 text-white sm:px-6 sm:py-[18px]">
        <BrandMark size={44} radius={10} variant="paper" />
        <div className="flex-1">
          <div className="text-base font-extrabold tracking-[0.01em]">
            {settings.companyName}
          </div>
          <div className="text-[11px] leading-[1.4] text-[#a9b8d4]">
            {settings.companyAddress}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 pb-5 pt-5 sm:px-[26px] sm:pb-[26px] sm:pt-6">
        <div className="mb-4 flex items-end justify-between border-b-2 border-navy pb-3">
          <div className="text-[26px] font-extrabold tracking-[0.12em] text-navy">
            KWITANSI
          </div>
          <div className="text-right">
            <div className="text-[11px] text-meta">No.</div>
            <div className="text-sm font-bold tabnum text-navy">
              {data.number}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-[13px] text-[13.5px]">
          <div className="flex">
            <div className="w-[110px] flex-none text-muted-foreground sm:w-[150px]">
              Telah terima dari
            </div>
            <div className="flex-1 border-b border-dotted border-slate-300 pb-0.5 font-semibold text-ink">
              {data.companyName || EMPTY}
            </div>
          </div>

          <div className="flex">
            <div className="w-[110px] flex-none text-muted-foreground sm:w-[150px]">
              Uang sejumlah
            </div>
            <div className="flex-1">
              <div className="rounded-lg bg-page px-[13px] py-[9px] font-semibold italic leading-[1.45] text-navy">
                {data.amountWords}
              </div>
            </div>
          </div>

          <div className="flex">
            <div className="w-[110px] flex-none text-muted-foreground sm:w-[150px]">
              Untuk pembayaran
            </div>
            <div className="flex-1 leading-[1.5] text-ink">
              {fullDescription || EMPTY}
            </div>
          </div>
        </div>

        <div className="mt-[22px] flex items-end justify-between">
          <div className="rounded-lg border-2 border-navy px-5 py-2.5">
            <div className="text-[10px] font-semibold tracking-[0.05em] text-meta">
              JUMLAH
            </div>
            <div className="text-[22px] font-extrabold tabnum text-navy">
              {formatRupiah(data.amount)}
            </div>
          </div>
          <div className="text-center text-[13px]">
            <div className="mb-0.5 text-muted-foreground">
              {settings.city}, {formatDateLong(data.date)}
            </div>
            <div className="h-14" />
            <div className="border-t border-slate-300 pt-[5px] font-bold text-ink">
              {settings.signerName}
            </div>
            <div className="text-[11px] text-meta">{settings.signerRole}</div>
          </div>
        </div>

        <div className="mt-5 flex justify-between border-t border-divider pt-3 text-[11px] text-meta">
          <div>{settings.bankLine}</div>
          <div>{settings.footerNote}</div>
        </div>
      </div>
    </div>
  );
}
