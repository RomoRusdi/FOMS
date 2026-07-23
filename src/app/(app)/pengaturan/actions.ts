"use server";

import { revalidatePath } from "next/cache";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { settingsSchema, type SettingsInput } from "@/lib/validators";

export type SettingsResult =
  | { ok: true; demo: boolean }
  | { ok: false; error: string };

export async function updateSettings(
  input: SettingsInput,
): Promise<SettingsResult> {
  const parsed = settingsSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Data tidak valid",
    };
  }
  const d = parsed.data;

  if (!isSupabaseConfigured) {
    // DEMO mode: nothing to persist to.
    return { ok: true, demo: true };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("app_settings").upsert({
    id: 1,
    city: d.city,
    bank_name: d.bankName,
    bank_account_name: d.bankAccountName,
    bank_account_number: d.bankAccountNumber,
    signer_name: d.signerName,
    receipt_pattern: d.receiptPattern,
  });

  if (error) return { ok: false, error: error.message };

  revalidatePath("/pengaturan");
  revalidatePath("/kwitansi");
  revalidatePath("/kwitansi/baru");
  revalidatePath("/dashboard");
  return { ok: true, demo: false };
}
