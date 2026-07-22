import { formatRupiahCompact } from "@/lib/format";
import type { NamedTotal } from "@/lib/types";
import { cn } from "@/lib/utils";

export function RankedBars({
  data,
  fillClassName = "bg-navy",
}: {
  data: NamedTotal[];
  fillClassName?: string;
}) {
  const max = Math.max(1, ...data.map((d) => d.total));

  return (
    <div className="flex flex-col gap-[11px]">
      {data.map((d) => {
        const pct = Math.round((d.total / max) * 100);
        return (
          <div key={d.name} className="flex flex-col gap-[5px]">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-body">{d.name}</span>
              <span className="font-bold tabnum text-ink">
                {formatRupiahCompact(d.total)}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-[5px] bg-divider">
              <div
                className={cn("h-full rounded-[5px]", fillClassName)}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
