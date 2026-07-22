import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import { formatRupiah } from "@/lib/format";
import type { Receipt } from "@/lib/types";

const COLS = "grid grid-cols-[84px_1.4fr_1fr_90px] items-center gap-x-4";

export function RecentReceipts({ receipts }: { receipts: Receipt[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface">
      <div className="flex items-center justify-between border-b border-divider px-[18px] py-[13px]">
        <div className="text-sm font-bold text-ink">Kwitansi Terbaru</div>
        <Link
          href="/kwitansi"
          className="text-xs font-semibold text-brand hover:text-brand-strong"
        >
          Lihat semua →
        </Link>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block">
        <div
          className={`${COLS} bg-surface-2 px-[18px] py-[10px] text-[11.5px] font-bold uppercase tracking-[0.03em] text-meta`}
        >
          <div>Nomor</div>
          <div>Perusahaan</div>
          <div className="text-right">Nominal</div>
          <div className="text-right">Status</div>
        </div>
        {receipts.map((r) => (
          <div
            key={r.id}
            className={`${COLS} border-t border-page px-[18px] py-[11px] text-[13px] transition-colors hover:bg-surface-2`}
          >
            <div className="font-semibold tabnum text-navy">
              {r.receipt_number}
            </div>
            <div className="truncate text-body">{r.company_name}</div>
            <div className="text-right font-bold tabnum text-ink">
              {formatRupiah(r.payment_amount)}
            </div>
            <div className="flex justify-end">
              <StatusBadge status={r.status} />
            </div>
          </div>
        ))}
      </div>

      {/* Mobile cards */}
      <div className="md:hidden">
        {receipts.map((r) => (
          <div
            key={r.id}
            className="flex flex-col gap-1.5 border-t border-page px-4 py-3 first:border-t-0"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[13px] font-bold tabnum text-navy">
                {r.receipt_number}
              </span>
              <StatusBadge status={r.status} />
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-[13px] text-body">
                {r.company_name}
              </span>
              <span className="flex-none text-[13px] font-bold tabnum text-ink">
                {formatRupiah(r.payment_amount)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
