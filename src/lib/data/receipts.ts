import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { MOCK_RECEIPTS } from "@/lib/mock";
import { formatReceiptNumber } from "@/lib/receipt-number";
import { DEFAULT_SETTINGS } from "@/lib/settings";
import { terbilang } from "@/lib/terbilang";
import type { Receipt, ReceiptStatus } from "@/lib/types";

export interface ReceiptFilters {
  q?: string;
  companyId?: string;
  status?: ReceiptStatus;
  month?: number; // 1-12
  year?: number;
  page?: number;
  pageSize?: number;
}

export interface ReceiptListResult {
  rows: Receipt[];
  total: number;
  sumAmount: number;
  page: number;
  pageSize: number;
}

export const DEFAULT_PAGE_SIZE = 10;

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapRow(row: any): Receipt {
  const amount = Number(row.payment_amount) || 0;
  return {
    id: String(row.id),
    receipt_number: row.receipt_number,
    company_id: row.company_id ?? null,
    company_name: row.company_name ?? "—",
    vessel_id: row.vessel_id ?? null,
    vessel_name: row.vessel_name ?? null,
    payment_description: row.payment_description ?? "",
    payment_amount: amount,
    payment_amount_words: row.payment_amount_words ?? terbilang(amount),
    payment_date: row.payment_date,
    status: (row.status as ReceiptStatus) ?? "Draft",
    bank_name: row.bank_name ?? "",
    bank_account_name: row.bank_account_name ?? "",
    bank_account_number: row.bank_account_number ?? "",
    pdf_url: row.pdf_url ?? null,
    created_at: row.created_at ?? row.payment_date,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export async function getReceipts(
  filters: ReceiptFilters = {},
): Promise<ReceiptListResult> {
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = filters.pageSize ?? DEFAULT_PAGE_SIZE;

  if (!isSupabaseConfigured) {
    let rows = [...MOCK_RECEIPTS];
    if (filters.q) {
      const q = filters.q.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.receipt_number.toLowerCase().includes(q) ||
          r.company_name.toLowerCase().includes(q) ||
          r.payment_description.toLowerCase().includes(q),
      );
    }
    if (filters.companyId)
      rows = rows.filter((r) => r.company_id === filters.companyId);
    if (filters.status) rows = rows.filter((r) => r.status === filters.status);
    if (filters.year)
      rows = rows.filter(
        (r) => new Date(r.payment_date).getFullYear() === filters.year,
      );
    if (filters.month)
      rows = rows.filter(
        (r) => new Date(r.payment_date).getMonth() + 1 === filters.month,
      );
    const total = rows.length;
    const sumAmount = rows.reduce((s, r) => s + r.payment_amount, 0);
    const start = (page - 1) * pageSize;
    return {
      rows: rows.slice(start, start + pageSize),
      total,
      sumAmount,
      page,
      pageSize,
    };
  }

  const supabase = await createClient();

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const applyFilters = (query: any) => {
    if (filters.q) {
      const q = filters.q.replace(/[%,]/g, "");
      query = query.or(
        `receipt_number.ilike.%${q}%,company_name.ilike.%${q}%,payment_description.ilike.%${q}%`,
      );
    }
    if (filters.companyId) query = query.eq("company_id", filters.companyId);
    if (filters.status) query = query.eq("status", filters.status);
    if (filters.year && filters.month) {
      const from = `${filters.year}-${String(filters.month).padStart(2, "0")}-01`;
      const to =
        filters.month === 12
          ? `${filters.year + 1}-01-01`
          : `${filters.year}-${String(filters.month + 1).padStart(2, "0")}-01`;
      query = query.gte("payment_date", from).lt("payment_date", to);
    } else if (filters.year) {
      query = query
        .gte("payment_date", `${filters.year}-01-01`)
        .lt("payment_date", `${filters.year + 1}-01-01`);
    }
    return query;
  };
  /* eslint-enable @typescript-eslint/no-explicit-any */

  const start = (page - 1) * pageSize;
  const listQuery = applyFilters(
    supabase.from("receipts_view").select("*", { count: "exact" }),
  )
    .order("payment_date", { ascending: false })
    .order("receipt_number", { ascending: false })
    .range(start, start + pageSize - 1);

  const sumQuery = applyFilters(
    supabase.from("receipts_view").select("payment_amount"),
  );

  const [{ data, count }, { data: sumData }] = await Promise.all([
    listQuery,
    sumQuery,
  ]);

  const sumAmount = (sumData ?? []).reduce(
    (s: number, r: { payment_amount: number | string }) =>
      s + (Number(r.payment_amount) || 0),
    0,
  );

  return {
    rows: (data ?? []).map(mapRow),
    total: count ?? 0,
    sumAmount,
    page,
    pageSize,
  };
}

/** Auto-generate the next receipt number for the given date's year. */
export async function getNextReceiptNumber(
  date: string | Date = new Date(),
  pattern: string = DEFAULT_SETTINGS.receiptPattern,
): Promise<string> {
  const year = new Date(date).getFullYear();

  if (!isSupabaseConfigured) {
    const maxSeq = MOCK_RECEIPTS.reduce((max, r) => {
      if (new Date(r.payment_date).getFullYear() !== year) return max;
      const seq = parseInt(r.receipt_number, 10) || 0;
      return Math.max(max, seq);
    }, 0);
    return formatReceiptNumber(maxSeq + 1, date, pattern);
  }

  const supabase = await createClient();
  const { data } = await supabase.rpc("next_receipt_seq", { p_year: year });
  return formatReceiptNumber(Number(data) || 1, date, pattern);
}

export async function getReceiptById(id: string): Promise<Receipt | null> {
  if (!isSupabaseConfigured) {
    return MOCK_RECEIPTS.find((r) => r.id === id) ?? null;
  }
  const supabase = await createClient();
  const { data } = await supabase
    .from("receipts_view")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return data ? mapRow(data) : null;
}
