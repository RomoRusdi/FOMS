"use server";

import { revalidatePath } from "next/cache";
import { getNextReceiptNumber } from "@/lib/data/receipts";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { terbilang } from "@/lib/terbilang";
import { receiptSchema, type ReceiptInput } from "@/lib/validators";

export type CreateResult =
  | { ok: true; demo: boolean; number: string }
  | { ok: false; error: string };

export async function createReceipt(input: ReceiptInput): Promise<CreateResult> {
  const parsed = receiptSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Data tidak valid",
    };
  }
  const data = parsed.data;

  const number = await getNextReceiptNumber(data.date);
  const words = terbilang(data.amount);

  // DEMO mode: no backend to persist to — return the generated number so the
  // UI can show the full flow. Wire PDF generation (docxtemplater → PDF →
  // Storage) into the block below once Supabase is configured.
  if (!isSupabaseConfigured) {
    return { ok: true, demo: true, number };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("receipts").insert({
    receipt_number: number,
    company_id: data.companyId,
    vessel_id: data.vesselId || null,
    payment_description: data.description,
    payment_amount: data.amount,
    payment_amount_words: words,
    payment_date: data.date,
    status: data.status,
  });

  if (error) return { ok: false, error: error.message };

  revalidatePath("/kwitansi");
  revalidatePath("/dashboard");
  return { ok: true, demo: false, number };
}
