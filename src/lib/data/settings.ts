import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_SETTINGS, type Settings } from "@/lib/settings";

/** Use the DB value when it's non-empty, otherwise the code default. */
function pick(value: unknown, fallback: string): string {
  const v = typeof value === "string" ? value.trim() : "";
  return v ? v : fallback;
}

/**
 * Effective app settings: DB row (if configured) with per-field fallback to
 * DEFAULT_SETTINGS. In DEMO mode returns DEFAULT_SETTINGS.
 */
export async function getSettings(): Promise<Settings> {
  if (!isSupabaseConfigured) return DEFAULT_SETTINGS;

  const supabase = await createClient();
  const { data } = await supabase
    .from("app_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (!data) return DEFAULT_SETTINGS;

  return {
    city: pick(data.city, DEFAULT_SETTINGS.city),
    bankName: pick(data.bank_name, DEFAULT_SETTINGS.bankName),
    bankAccountName: pick(data.bank_account_name, DEFAULT_SETTINGS.bankAccountName),
    bankAccountNumber: pick(
      data.bank_account_number,
      DEFAULT_SETTINGS.bankAccountNumber,
    ),
    signerName: pick(data.signer_name, DEFAULT_SETTINGS.signerName),
    receiptPattern: pick(data.receipt_pattern, DEFAULT_SETTINGS.receiptPattern),
  };
}
