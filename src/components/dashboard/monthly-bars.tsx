import type { MonthlyPoint } from "@/lib/types";
import { formatRupiah } from "@/lib/format";

export function MonthlyBars({ data }: { data: MonthlyPoint[] }) {
  const max = Math.max(1, ...data.map((d) => d.total));

  return (
    <div className="flex h-[150px] items-end gap-[7px] pt-[10px]">
      {data.map((d) => {
        const pct = Math.round((d.total / max) * 100);
        return (
          <div
            key={d.month}
            className="flex h-full flex-1 flex-col items-center justify-end gap-[6px]"
            title={`${d.month}: ${formatRupiah(d.total)}`}
          >
            <div
              className="w-full max-w-[22px] rounded-t-[5px] bg-brand transition-[height]"
              style={{ height: `${pct}%` }}
            />
            <div className="text-[10px] text-meta">{d.month}</div>
          </div>
        );
      })}
    </div>
  );
}
