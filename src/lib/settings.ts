import { DEFAULT_RECEIPT_PATTERN } from "./receipt-number";

export interface Settings {
  companyName: string;
  companyAddress: string;
  city: string;
  bankLine: string;
  footerNote: string;
  signerName: string;
  signerRole: string;
  receiptPattern: string;
}

/**
 * Kwitansi header/footer defaults (PRD Module 10 — Settings). Values mirror the
 * hi-fi mock; wire to a `settings` table + logo upload later.
 */
export const DEFAULT_SETTINGS: Settings = {
  companyName: "PT KECAP NUSANTARA",
  companyAddress: "",
  city: "Jakarta",
  bankLine: "Bank Central Asia (BCA) · 0073303661 · a.n Taufic Yuniyanto",
  footerNote: "",
  signerName: "Taufic Yuniyanto",
  signerRole: "",
  receiptPattern:
    process.env.NEXT_PUBLIC_RECEIPT_PATTERN || DEFAULT_RECEIPT_PATTERN,
};

// NOTE: the async, DB-backed getSettings() lives in "@/lib/data/settings"
// (server-only). DEFAULT_SETTINGS here is the client-safe fallback/baseline —
// empty DB fields fall back to these values.
