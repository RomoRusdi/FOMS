import { terbilang } from "./terbilang";
import type {
  Company,
  DashboardData,
  MonthlyPoint,
  NamedTotal,
  Receipt,
  Vessel,
} from "./types";

/**
 * Sample data mirroring FOMS.dc.html (arah 1c). Used in DEMO mode and as the
 * source for supabase/seed.sql so a connected DB reproduces the hi-fi mock.
 */

export const MOCK_COMPANIES: Company[] = [
  { id: "c1", company_name: "PT Samudra Biru", address: "Jl. Pelabuhan No. 12, Surabaya", phone: "0812-1000-0001", pic: "Bpk. Hendra", status: "Aktif" },
  { id: "c2", company_name: "PT Dermaga Makmur", address: "Jl. Tanjung Perak No. 45, Surabaya", phone: "0812-1000-0002", pic: "Ibu Ratih", status: "Aktif" },
  { id: "c3", company_name: "PT Anugrah Logistik", address: "Jl. Kalimas Baru No. 8, Surabaya", phone: "0812-1000-0003", pic: "Bpk. Yusuf", status: "Aktif" },
  { id: "c4", company_name: "PT Bahtera Jaya", address: "Jl. Nilam Timur No. 21, Surabaya", phone: "0812-1000-0004", pic: "Ibu Sinta", status: "Aktif" },
];

export const MOCK_VESSELS: Vessel[] = [
  { id: "v1", vessel_name: "MV Sinar Jaya", code: "SJ-01", owner: "PT Samudra Biru", status: "Aktif" },
  { id: "v2", vessel_name: "KM Bahari Nusantara", code: "BN-02", owner: "PT Dermaga Makmur", status: "Aktif" },
  { id: "v3", vessel_name: "MV Cakra Buana", code: "CB-03", owner: "PT Anugrah Logistik", status: "Aktif" },
  { id: "v4", vessel_name: "KM Teluk Intan", code: "TI-04", owner: "PT Bahtera Jaya", status: "Aktif" },
  { id: "v5", vessel_name: "MV Samudra Rezeki", code: "SR-05", owner: "PT Samudra Biru", status: "Aktif" },
];

const JT = 1_000_000;

const MONTHS: [string, number][] = [
  ["Jan", 38], ["Feb", 52], ["Mar", 44], ["Apr", 61],
  ["Mei", 49], ["Jun", 73], ["Jul", 58], ["Agu", 66],
  ["Sep", 41], ["Okt", 70], ["Nov", 63], ["Des", 80],
];

export const MOCK_MONTHLY: MonthlyPoint[] = MONTHS.map(([month, jt]) => ({
  month,
  total: jt * JT,
}));

export const MOCK_PER_VESSEL: NamedTotal[] = [
  { name: "MV Sinar Jaya", total: 128 * JT },
  { name: "KM Bahari Nusantara", total: 96 * JT },
  { name: "MV Cakra Buana", total: 74 * JT },
  { name: "KM Teluk Intan", total: 58 * JT },
  { name: "MV Samudra Rezeki", total: 41 * JT },
];

export const MOCK_PER_COMPANY: NamedTotal[] = [
  { name: "PT Samudra Biru", total: 162 * JT },
  { name: "PT Dermaga Makmur", total: 118 * JT },
  { name: "PT Anugrah Logistik", total: 88 * JT },
  { name: "PT Bahtera Jaya", total: 54 * JT },
];

type RawReceipt = [string, string, string | null, number, string, Receipt["status"], string];

const RAW_RECEIPTS: RawReceipt[] = [
  ["009/VII/26", "PT Samudra Biru", "MV Sinar Jaya", 2_500_000, "2026-07-22", "Lunas", "Jasa bongkar muat kargo — sewa forklift 1 shift, trailer 2 rit, dan BBM operasional."],
  ["008/VII/26", "PT Dermaga Makmur", "KM Bahari Nusantara", 12_750_000, "2026-07-21", "Lunas", "Sewa crane dan operator untuk bongkar peti kemas 2 hari."],
  ["007/VII/26", "PT Anugrah Logistik", "MV Cakra Buana", 5_100_000, "2026-07-20", "Pending", "Jasa lashing dan buruh angkut muatan curah."],
  ["006/VII/26", "PT Bahtera Jaya", "KM Teluk Intan", 8_900_000, "2026-07-19", "Lunas", "Transportasi trailer dan dolly heavy antar dermaga."],
  ["005/VII/26", "PT Samudra Biru", "MV Samudra Rezeki", 3_400_000, "2026-07-18", "Draft", "Sewa alat berat forklift setengah hari."],
  ["004/VII/26", "PT Dermaga Makmur", null, 21_000_000, "2026-07-17", "Lunas", "Paket jasa bongkar muat penuh termasuk BBM dan operator."],
];

export const MOCK_RECEIPTS: Receipt[] = RAW_RECEIPTS.map(
  ([receipt_number, company_name, vessel_name, amount, date, status, desc], i) => ({
    id: `r${i + 1}`,
    receipt_number,
    company_id: MOCK_COMPANIES.find((c) => c.company_name === company_name)?.id ?? null,
    company_name,
    vessel_id: MOCK_VESSELS.find((v) => v.vessel_name === vessel_name)?.id ?? null,
    vessel_name,
    payment_description: desc,
    payment_amount: amount,
    payment_amount_words: terbilang(amount),
    payment_date: date,
    status,
    bank_name: "",
    bank_account_name: "",
    bank_account_number: "",
    pdf_url: null,
    created_at: `${date}T09:00:00Z`,
  }),
);

export const MOCK_DASHBOARD: DashboardData = {
  stats: {
    totalReceipts: 150,
    totalExpense: 550 * JT,
    expenseThisMonth: 80 * JT,
    totalCompanies: 25,
    totalVessels: 18,
    deltas: {
      receipts: { label: "▲ 12% vs bln lalu", tone: "success" },
      expense: { label: "▲ 4,2% vs bln lalu", tone: "warning" },
      thisMonth: { label: "Target Rp 90jt", tone: "neutral" },
      companies: { label: "3 aktif baru", tone: "neutral" },
      vessels: { label: "12 beroperasi", tone: "success" },
    },
  },
  monthly: MOCK_MONTHLY,
  perCompany: MOCK_PER_COMPANY,
  perVessel: MOCK_PER_VESSEL,
  recentReceipts: MOCK_RECEIPTS,
  updatedAt: "2026-07-22T09:14:00Z",
};
