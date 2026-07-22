import Link from "next/link";
import { Plus } from "lucide-react";
import { Pagination } from "@/components/kwitansi/pagination";
import { ReceiptFilters } from "@/components/kwitansi/receipt-filters";
import { RowActions } from "@/components/kwitansi/row-actions";
import { StatusBadge } from "@/components/status-badge";
import { getReceipts } from "@/lib/data/receipts";
import { getCompanies } from "@/lib/data/master";
import { getSettings } from "@/lib/data/settings";
import { formatDateShort, formatNumber, formatRupiah, formatRupiahCompact } from "@/lib/format";
import type { ReceiptStatus } from "@/lib/types";

export const metadata = { title: "Kwitansi · FOMS" };

const COLS =
  "grid grid-cols-[40px_110px_1.5fr_1.1fr_120px_100px_140px] items-center gap-x-4";

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function KwitansiPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;

  const q = first(sp.q);
  const companyId = first(sp.companyId);
  const status = first(sp.status) as ReceiptStatus | undefined;
  const monthStr = first(sp.month);
  const yearStr = first(sp.year);
  const pageStr = first(sp.page);

  const filterYear = yearStr ? Number(yearStr) : new Date().getFullYear();
  const page = pageStr ? Math.max(1, Number(pageStr)) : 1;

  const [{ rows, total, sumAmount, pageSize }, companies, settings] =
    await Promise.all([
      getReceipts({
        q,
        companyId,
        status,
        month: monthStr ? Number(monthStr) : undefined,
        year: monthStr ? filterYear : undefined,
        page,
        pageSize: 10,
      }),
      getCompanies(),
      getSettings(),
    ]);

  const params: Record<string, string> = {};
  if (q) params.q = q;
  if (companyId) params.companyId = companyId;
  if (status) params.status = status;
  if (monthStr) {
    params.month = monthStr;
    params.year = String(filterYear);
  }

  return (
    <div className="flex flex-col gap-[14px] p-[18px]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-extrabold tracking-[-0.01em] text-ink">
            Kwitansi
          </h1>
          <p className="text-xs text-meta">
            {formatNumber(total)} kwitansi · {formatRupiahCompact(sumAmount)} total
          </p>
        </div>
        <Link
          href="/kwitansi/baru"
          className="flex items-center gap-2 rounded-[10px] bg-brand px-4 py-[9px] text-[13px] font-semibold text-white hover:bg-brand-strong"
        >
          <Plus className="size-4" strokeWidth={2.75} />
          Buat Kwitansi
        </Link>
      </div>

      <ReceiptFilters companies={companies} year={filterYear} />

      <div className="overflow-hidden rounded-[14px] border border-line bg-surface">
        {rows.length === 0 ? (
          <div className="px-4 py-16 text-center text-[13px] text-muted-foreground">
            Tidak ada kwitansi yang cocok dengan filter.
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block">
              <div
                className={`${COLS} border-b border-divider bg-surface-2 px-4 py-[11px] text-[11.5px] font-bold uppercase tracking-[0.03em] text-meta`}
              >
                <div>No</div>
                <div>Nomor</div>
                <div>Perusahaan</div>
                <div className="text-right">Nominal</div>
                <div>Tanggal</div>
                <div>Status</div>
                <div className="text-right">Aksi</div>
              </div>
              {rows.map((r, i) => (
                <div
                  key={r.id}
                  className={`${COLS} border-b border-page px-4 py-3 text-[13px] transition-colors hover:bg-surface-2`}
                >
                  <div className="font-semibold text-meta">
                    {(page - 1) * pageSize + i + 1}
                  </div>
                  <div className="font-bold tabnum text-navy">
                    {r.receipt_number}
                  </div>
                  <div className="truncate pr-2 text-body">{r.company_name}</div>
                  <div className="text-right font-bold tabnum text-ink">
                    {formatRupiah(r.payment_amount)}
                  </div>
                  <div className="tabnum text-muted-foreground">
                    {formatDateShort(r.payment_date)}
                  </div>
                  <div>
                    <StatusBadge status={r.status} />
                  </div>
                  <RowActions receipt={r} settings={settings} />
                </div>
              ))}
            </div>

            {/* Mobile cards */}
            <div className="md:hidden">
              {rows.map((r) => (
                <div
                  key={r.id}
                  className="flex flex-col gap-2 border-b border-page p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13px] font-bold tabnum text-navy">
                      {r.receipt_number}
                    </span>
                    <StatusBadge status={r.status} />
                  </div>
                  <div className="truncate text-[13px] text-body">
                    {r.company_name}
                  </div>
                  <div className="flex items-end justify-between gap-2">
                    <div>
                      <div className="text-[15px] font-bold tabnum text-ink">
                        {formatRupiah(r.payment_amount)}
                      </div>
                      <div className="text-[12px] tabnum text-meta">
                        {formatDateShort(r.payment_date)}
                      </div>
                    </div>
                    <RowActions receipt={r} settings={settings} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          params={params}
        />
      </div>
    </div>
  );
}
