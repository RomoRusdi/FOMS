import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const box =
  "flex size-8 items-center justify-center rounded-lg border border-line text-[13px]";

function hrefFor(base: Record<string, string>, page: number) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(base)) if (v) params.set(k, v);
  if (page > 1) params.set("page", String(page));
  else params.delete("page");
  const qs = params.toString();
  return qs ? `/kwitansi?${qs}` : "/kwitansi";
}

export function Pagination({
  page,
  pageSize,
  total,
  params,
}: {
  page: number;
  pageSize: number;
  total: number;
  params: Record<string, string>;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);

  // Windowed page numbers around the current page.
  const window = 2;
  const start = Math.max(1, page - window);
  const end = Math.min(totalPages, page + window);
  const pages: number[] = [];
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center justify-between px-[18px] py-[14px] text-[13px] text-muted-foreground">
      <div>
        Menampilkan {from}–{to} dari {total}
      </div>
      <div className="flex items-center gap-1.5">
        <Link
          href={hrefFor(params, Math.max(1, page - 1))}
          aria-disabled={page <= 1}
          className={cn(box, "text-meta", page <= 1 && "pointer-events-none opacity-40")}
        >
          <ChevronLeft className="size-4" />
        </Link>
        {start > 1 && <span className="px-1 text-meta">…</span>}
        {pages.map((p) => (
          <Link
            key={p}
            href={hrefFor(params, p)}
            className={cn(
              box,
              p === page
                ? "border-navy bg-navy font-semibold text-white"
                : "hover:bg-surface-2",
            )}
          >
            {p}
          </Link>
        ))}
        {end < totalPages && <span className="px-1 text-meta">…</span>}
        <Link
          href={hrefFor(params, Math.min(totalPages, page + 1))}
          aria-disabled={page >= totalPages}
          className={cn(
            box,
            "text-meta",
            page >= totalPages && "pointer-events-none opacity-40",
          )}
        >
          <ChevronRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
