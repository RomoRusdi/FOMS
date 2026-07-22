import { cn } from "@/lib/utils";
import type { ReceiptStatus } from "@/lib/types";

const STYLES: Record<ReceiptStatus, string> = {
  Lunas: "bg-success-soft text-success",
  Pending: "bg-warning-soft text-warning",
  Draft: "bg-divider text-muted-foreground",
};

export function StatusBadge({
  status,
  className,
}: {
  status: ReceiptStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-[11px] py-1 text-xs font-semibold",
        STYLES[status],
        className,
      )}
    >
      {status}
    </span>
  );
}
