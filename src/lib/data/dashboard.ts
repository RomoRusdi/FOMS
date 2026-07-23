import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { MOCK_DASHBOARD } from "@/lib/mock";
import { terbilang } from "@/lib/terbilang";
import type { DashboardData, Receipt, ReceiptStatus } from "@/lib/types";

const SHORT_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
];

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

export async function getDashboardData(): Promise<DashboardData> {
  if (!isSupabaseConfigured) return MOCK_DASHBOARD;

  const supabase = await createClient();
  const now = new Date();
  const year = now.getFullYear();
  const monthKey = `${year}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const [
    { count: totalReceipts },
    { count: totalCompanies },
    { count: totalVessels },
    { data: yearRows },
    { data: recent },
  ] = await Promise.all([
    supabase.from("receipts").select("*", { count: "exact", head: true }),
    supabase.from("companies").select("*", { count: "exact", head: true }),
    supabase.from("vessels").select("*", { count: "exact", head: true }),
    supabase
      .from("receipts_view")
      .select("payment_amount,payment_date,company_name,vessel_name")
      .gte("payment_date", `${year}-01-01`)
      .lt("payment_date", `${year + 1}-01-01`),
    supabase
      .from("receipts_view")
      .select("*")
      .order("payment_date", { ascending: false })
      .limit(6),
  ]);

  const rows = (yearRows ?? []) as {
    payment_amount: number | string;
    payment_date: string;
    company_name: string | null;
    vessel_name: string | null;
  }[];

  const monthlyTotals = new Array(12).fill(0);
  const perCompanyMap = new Map<string, number>();
  const perVesselMap = new Map<string, number>();
  let totalExpense = 0;
  let expenseThisMonth = 0;

  for (const r of rows) {
    const amt = Number(r.payment_amount) || 0;
    const m = new Date(r.payment_date).getMonth();
    monthlyTotals[m] += amt;
    totalExpense += amt;
    if (r.payment_date.startsWith(monthKey)) expenseThisMonth += amt;
    if (r.company_name)
      perCompanyMap.set(r.company_name, (perCompanyMap.get(r.company_name) ?? 0) + amt);
    if (r.vessel_name)
      perVesselMap.set(r.vessel_name, (perVesselMap.get(r.vessel_name) ?? 0) + amt);
  }

  const topN = (map: Map<string, number>, n: number) =>
    [...map.entries()]
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, n);

  return {
    stats: {
      totalReceipts: totalReceipts ?? 0,
      totalExpense,
      expenseThisMonth,
      totalCompanies: totalCompanies ?? 0,
      totalVessels: totalVessels ?? 0,
      deltas: {
        receipts: { label: "tahun berjalan", tone: "neutral" },
        expense: { label: "tahun berjalan", tone: "neutral" },
        thisMonth: { label: "bulan ini", tone: "neutral" },
        companies: { label: "terdaftar", tone: "neutral" },
        vessels: { label: "terdaftar", tone: "neutral" },
      },
    },
    monthly: SHORT_MONTHS.map((month, i) => ({ month, total: monthlyTotals[i] })),
    perCompany: topN(perCompanyMap, 4),
    perVessel: topN(perVesselMap, 5),
    recentReceipts: (recent ?? []).map(mapRow),
    updatedAt: now.toISOString(),
  };
}
