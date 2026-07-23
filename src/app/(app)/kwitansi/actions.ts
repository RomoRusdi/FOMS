"use server";

import { revalidatePath } from "next/cache";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export type DeleteReceiptResult =
  | { ok: true; demo: boolean }
  | { ok: false; error: string };

export async function deleteReceipt(
  id: string,
): Promise<DeleteReceiptResult> {
  if (!isSupabaseConfigured) {
    // DEMO mode: nothing to delete from.
    return { ok: true, demo: true };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("receipts").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/kwitansi");
  revalidatePath("/dashboard");
  return { ok: true, demo: false };
}
