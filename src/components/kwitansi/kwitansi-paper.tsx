import { formatDateLong, formatKwitansiAmount } from "@/lib/format";
import type { Settings } from "@/lib/settings";
import { cn } from "@/lib/utils";

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

function TableRow({
  label,
  children,
  first,
}: {
  label: string;
  children: React.ReactNode;
  first?: boolean;
}) {
  return (
    <div className={cn("flex", !first && "border-t border-[#111827]")}>
      <div className="w-[130px] flex-none border-r border-[#111827] px-3 py-2.5 sm:w-[160px]">
        {label}
      </div>
      <div className="min-w-0 flex-1 px-3 py-2.5">{children}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex">
      <div className="w-[86px] flex-none">{label}</div>
      <div className="w-3 flex-none">:</div>
      <div className="min-w-0 flex-1">{value || EMPTY}</div>
    </div>
  );
}

export function KwitansiPaper({
  data,
  settings,
}: {
  data: KwitansiPaperData;
  settings: Settings;
}) {
  const words = (data.amountWords || "").toUpperCase();

  return (
    <div
      style={{ fontFamily: "var(--font-kwitansi), Arial, sans-serif" }}
      className="rounded-lg border border-line bg-white p-5 text-[13px] text-[#111827] shadow-[0_14px_40px_-16px_rgba(16,31,54,.35)] sm:p-8"
    >
      {/* Title */}
      <div className="flex items-start justify-between">
        <div className="text-[32px] font-extrabold leading-none tracking-tight sm:text-[40px]">
          KWITANSI
        </div>
        <div className="pt-1.5 text-[12px]">
          No.:{" "}
          <span className="font-medium tabnum">{data.number || EMPTY}</span>
        </div>
      </div>

      {/* Bordered detail table */}
      <div className="mt-5 border border-[#111827]">
        <TableRow label="Sudah Terima Dari" first>
          <span className="text-[15px] font-medium">
            {data.companyName || EMPTY}
          </span>
        </TableRow>
        <TableRow label="Banyaknya Uang">
          <span className="font-bold">: {words || EMPTY}</span>
        </TableRow>
        <TableRow label="Untuk Pembayaran">
          <span className="block whitespace-pre-line leading-relaxed">
            : {data.description || EMPTY}
          </span>
        </TableRow>
      </div>

      {/* Amount + place/date */}
      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <div className="text-[13px] font-bold">Rp.</div>
          <div className="mt-1.5 inline-block border-2 border-[#111827] px-6 py-2">
            <span className="text-[22px] font-extrabold tabnum">
              {formatKwitansiAmount(data.amount)}
            </span>
          </div>
        </div>
        <div className="pt-1 text-right text-[13px] font-bold">
          {(settings.city || "").toUpperCase()}, {formatDateLong(data.date)}
        </div>
      </div>

      {/* Payment instructions + signature */}
      <div className="mt-6 flex items-start justify-between gap-6">
        <div className="min-w-0 space-y-1 leading-relaxed">
          <div>Untuk Pembayaran Mohon ditujukan ke :</div>
          <InfoRow label="Bank" value={settings.bankName} />
          <InfoRow label="Atas Nama" value={settings.bankAccountName} />
          <InfoRow label="No. Rekening" value={settings.bankAccountNumber} />
        </div>
        <div className="flex-none pt-8 text-center">
          <div className="text-[14px] font-bold">
            {settings.signerName || EMPTY}
          </div>
        </div>
      </div>
    </div>
  );
}
