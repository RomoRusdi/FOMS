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
  companyAddress: "Jl. Pelabuhan Raya No. 88, Surabaya · Telp (031) 555-0188",
  city: "Surabaya",
  bankLine: "Bank Mandiri · 142-00-1234567-8 · a.n PT Kecap Nusantara",
  footerNote: "Dokumen sah tanpa tanda tangan basah",
  signerName: "Andi Darma",
  signerRole: "Admin Finance",
  receiptPattern:
    process.env.NEXT_PUBLIC_RECEIPT_PATTERN || DEFAULT_RECEIPT_PATTERN,
};

export function getSettings(): Settings {
  return DEFAULT_SETTINGS;
}
