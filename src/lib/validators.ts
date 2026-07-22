import { z } from "zod";

export const receiptSchema = z.object({
  companyId: z.string().min(1, "Perusahaan wajib dipilih"),
  date: z.string().min(1, "Tanggal wajib diisi"),
  amount: z
    .number({ message: "Nominal wajib diisi" })
    .int()
    .positive("Nominal harus lebih dari 0"),
  description: z.string().trim().min(1, "Keperluan wajib diisi"),
  vesselId: z.string().nullish(),
  status: z.enum(["Lunas", "Pending", "Draft"]).default("Lunas"),
});

export type ReceiptInput = z.infer<typeof receiptSchema>;

export const settingsSchema = z.object({
  companyName: z.string().trim().min(1, "Nama perusahaan wajib diisi"),
  companyAddress: z.string().trim().default(""),
  city: z.string().trim().default(""),
  bankLine: z.string().trim().default(""),
  footerNote: z.string().trim().default(""),
  signerName: z.string().trim().default(""),
  signerRole: z.string().trim().default(""),
  receiptPattern: z.string().trim().min(1, "Pola nomor wajib diisi"),
});

export type SettingsInput = z.infer<typeof settingsSchema>;
