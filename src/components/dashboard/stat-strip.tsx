import { formatNumber, formatRupiahCompact } from "@/lib/format";
import type { DashboardData, StatDelta } from "@/lib/types";
import { cn } from "@/lib/utils";

const TONE: Record<StatDelta["tone"], string> = {
  success: "text-success",
  warning: "text-warning",
  neutral: "text-meta",
};

function Cell({
  label,
  value,
  delta,
  wide,
}: {
  label: string;
  value: string;
  delta: StatDelta;
  /** Span both columns on the mobile 2-col grid (for the odd 5th item). */
  wide?: boolean;
}) {
  return (
    <div
      className={cn(
        "bg-surface px-[18px] py-[15px]",
        wide && "col-span-2 md:col-span-1",
      )}
    >
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-[3px] text-2xl font-extrabold tabnum text-ink">
        {value}
      </div>
      <div className={cn("mt-[2px] text-[11.5px] font-semibold", TONE[delta.tone])}>
        {delta.label}
      </div>
    </div>
  );
}

export function StatStrip({ stats }: { stats: DashboardData["stats"] }) {
  // gap-px over a bg-line background draws 1px dividers between cells in both
  // the 2-col (mobile) and 5-col (desktop) grids without per-cell border logic.
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-5">
      <Cell
        label="Total Kwitansi"
        value={formatNumber(stats.totalReceipts)}
        delta={stats.deltas.receipts}
      />
      <Cell
        label="Total Pengeluaran"
        value={formatRupiahCompact(stats.totalExpense)}
        delta={stats.deltas.expense}
      />
      <Cell
        label="Pengeluaran Bln Ini"
        value={formatRupiahCompact(stats.expenseThisMonth)}
        delta={stats.deltas.thisMonth}
      />
      <Cell
        label="Total PT"
        value={formatNumber(stats.totalCompanies)}
        delta={stats.deltas.companies}
      />
      <Cell
        label="Total Kapal"
        value={formatNumber(stats.totalVessels)}
        delta={stats.deltas.vessels}
        wide
      />
    </div>
  );
}
