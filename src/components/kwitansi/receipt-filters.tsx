"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, Loader2, Search, Upload } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const STATUSES = ["Lunas", "Pending", "Draft"];

function Pill({
  active,
  children,
}: {
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <DropdownMenuTrigger
      className={cn(
        "flex items-center gap-2 rounded-[10px] border border-line bg-surface px-[13px] py-[9px] text-[13px] font-medium outline-none",
        active ? "text-ink" : "text-body",
      )}
    >
      {children}
      <ChevronDown className="size-3.5 text-meta" />
    </DropdownMenuTrigger>
  );
}

export function ReceiptFilters({
  companies,
  year,
}: {
  companies: { id: string; company_name: string }[];
  year: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [pending, startTransition] = useTransition();

  const [q, setQ] = useState(sp.get("q") ?? "");
  const firstRender = useRef(true);

  const companyId = sp.get("companyId") ?? "";
  const status = sp.get("status") ?? "";
  const month = sp.get("month") ?? "";

  function setParams(mutate: (p: URLSearchParams) => void) {
    const params = new URLSearchParams(sp.toString());
    mutate(params);
    params.delete("page");
    const qs = params.toString();
    startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname));
  }

  // Debounced search
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const t = setTimeout(() => {
      setParams((p) => {
        if (q.trim()) p.set("q", q.trim());
        else p.delete("q");
      });
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const activeCompany = companies.find((c) => c.id === companyId);
  const companyLabel = activeCompany?.company_name ?? "Semua PT";
  const statusLabel = status || "Status";
  const periodLabel = month ? `${MONTHS[Number(month) - 1]} ${year}` : "Semua Periode";

  return (
    <div className="flex flex-wrap items-center gap-[10px]">
      <div className="flex w-full items-center gap-2 rounded-[10px] border border-line bg-surface px-[13px] py-[9px] text-[13px] focus-within:border-brand focus-within:ring-[3px] focus-within:ring-brand-soft sm:w-[260px]">
        {pending ? (
          <Loader2 className="size-3.5 animate-spin text-meta" />
        ) : (
          <Search className="size-3.5 text-meta" strokeWidth={2.5} />
        )}
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari nomor / PT / keperluan…"
          className="w-full bg-transparent text-ink outline-none placeholder:text-meta"
        />
      </div>

      {/* PT filter */}
      <DropdownMenu>
        <Pill active={!!companyId}>{companyLabel}</Pill>
        <DropdownMenuContent align="start" className="max-h-72 w-56 overflow-y-auto">
          <DropdownMenuItem onClick={() => setParams((p) => p.delete("companyId"))}>
            Semua PT
          </DropdownMenuItem>
          {companies.map((c) => (
            <DropdownMenuItem
              key={c.id}
              onClick={() => setParams((p) => p.set("companyId", c.id))}
            >
              {c.company_name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Status filter */}
      <DropdownMenu>
        <Pill active={!!status}>{statusLabel}</Pill>
        <DropdownMenuContent align="start" className="w-44">
          <DropdownMenuItem onClick={() => setParams((p) => p.delete("status"))}>
            Semua Status
          </DropdownMenuItem>
          {STATUSES.map((s) => (
            <DropdownMenuItem
              key={s}
              onClick={() => setParams((p) => p.set("status", s))}
            >
              {s}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Period filter */}
      <DropdownMenu>
        <Pill active={!!month}>{periodLabel}</Pill>
        <DropdownMenuContent align="start" className="max-h-72 w-48 overflow-y-auto">
          <DropdownMenuItem
            onClick={() =>
              setParams((p) => {
                p.delete("month");
                p.delete("year");
              })
            }
          >
            Semua Periode
          </DropdownMenuItem>
          {MONTHS.map((m, i) => (
            <DropdownMenuItem
              key={m}
              onClick={() =>
                setParams((p) => {
                  p.set("month", String(i + 1));
                  p.set("year", String(year));
                })
              }
            >
              {m} {year}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <button
        onClick={() =>
          toast.info("Export", {
            description: "Export Excel/PDF/CSV aktif setelah backend disambungkan.",
          })
        }
        className="ml-auto flex items-center gap-2 rounded-[10px] border border-line bg-surface px-[14px] py-[9px] text-[13px] font-semibold text-body hover:bg-surface-2"
      >
        <Upload className="size-3.5 text-success" />
        Export
      </button>
    </div>
  );
}
