import { DEFAULT_RECEIPT_PATTERN } from "./receipt-number";

export interface Settings {
  /** City shown next to the date, e.g. "JAKARTA, 19 Juli 2026". */
  city: string;
  /** Payment instructions (footer block). */
  bankName: string;
  bankAccountName: string; // "Atas Nama"
  bankAccountNumber: string; // "No. Rekening"
  /** Name printed at the signature (bottom right). */
  signerName: string;
  receiptPattern: string;
}

/**
 * Kwitansi identity defaults (PRD Module 10 — Settings). The client-safe
 * baseline; empty DB fields fall back to these. Edit live on /pengaturan.
 * The async, DB-backed getSettings() lives in "@/lib/data/settings" (server).
 */
export const DEFAULT_SETTINGS: Settings = {
  city: "Jakarta",
  bankName: "Bank Central Asia (BCA)",
  bankAccountName: "Rusdi Junior",
  bankAccountNumber: "0213102100",
  signerName: "Rusdi Junior",
  receiptPattern:
    process.env.NEXT_PUBLIC_RECEIPT_PATTERN || DEFAULT_RECEIPT_PATTERN,
};
