import { MonthlyBars } from "@/components/dashboard/monthly-bars";
import { RankedBars } from "@/components/dashboard/ranked-bars";
import { RecentReceipts } from "@/components/dashboard/recent-receipts";
import { StatStrip } from "@/components/dashboard/stat-strip";
import { getDashboardData } from "@/lib/data/dashboard";
import { formatDateTime, yearOf } from "@/lib/format";

export const metadata = { title: "Dashboard · FOMS" };

export default async function DashboardPage() {
  const data = await getDashboardData();
  const year = yearOf(data.updatedAt);

  return (
    <div className="flex flex-col gap-[14px] p-[18px]">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-[17px] font-extrabold tracking-[-0.01em] text-ink">
          Ringkasan Operasional
        </h1>
        <div className="text-xs text-meta">
          Diperbarui {formatDateTime(data.updatedAt)}
        </div>
      </div>

      <StatStrip stats={data.stats} />

      <div className="flex flex-col gap-[14px] lg:flex-row lg:items-stretch">
        <section className="min-w-0 rounded-xl border border-line bg-surface px-[18px] py-[15px] lg:flex-[1.6]">
          <div className="mb-1 text-sm font-bold text-ink">
            Pengeluaran per Bulan · {year}
          </div>
          <MonthlyBars data={data.monthly} />
        </section>

        <section className="min-w-0 rounded-xl border border-line bg-surface px-[18px] py-[15px] lg:flex-1">
          <div className="mb-3 text-sm font-bold text-ink">per PT</div>
          <RankedBars data={data.perCompany} fillClassName="bg-navy" />
        </section>
      </div>

      <RecentReceipts receipts={data.recentReceipts} />
    </div>
  );
}
