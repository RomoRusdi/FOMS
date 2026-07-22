export type ReceiptStatus = "Lunas" | "Pending" | "Draft";

export interface Company {
  id: string;
  company_name: string;
  address: string | null;
  phone: string | null;
  pic: string | null;
  status: "Aktif" | "Nonaktif";
}

export interface Vessel {
  id: string;
  vessel_name: string;
  code: string | null;
  owner: string | null;
  status: "Aktif" | "Nonaktif";
}

export interface ExpenseCategory {
  id: string;
  category_name: string;
}

export interface Receipt {
  id: string;
  receipt_number: string;
  company_id: string | null;
  company_name: string;
  vessel_id: string | null;
  vessel_name: string | null;
  payment_description: string;
  payment_amount: number;
  payment_amount_words: string;
  payment_date: string; // ISO date
  status: ReceiptStatus;
  pdf_url: string | null;
  created_at: string;
}

export interface MonthlyPoint {
  /** Short month label, e.g. "Jul". */
  month: string;
  /** Total expense for the month, in rupiah. */
  total: number;
}

export interface NamedTotal {
  name: string;
  /** Total in rupiah. */
  total: number;
}

export interface StatDelta {
  label: string;
  tone: "success" | "warning" | "neutral";
}

export interface DashboardData {
  stats: {
    totalReceipts: number;
    totalExpense: number;
    expenseThisMonth: number;
    totalCompanies: number;
    totalVessels: number;
    deltas: {
      receipts: StatDelta;
      expense: StatDelta;
      thisMonth: StatDelta;
      companies: StatDelta;
      vessels: StatDelta;
    };
  };
  monthly: MonthlyPoint[];
  perCompany: NamedTotal[];
  perVessel: NamedTotal[];
  recentReceipts: Receipt[];
  updatedAt: string;
}
