"use server";

import { revalidatePath } from "next/cache";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { companySchema, vesselSchema } from "@/lib/validators";

export type MasterActionResult =
  | { ok: true; demo: boolean }
  | { ok: false; error: string };

const nn = (v: string) => (v && v.trim() ? v.trim() : null);

function revalidateMaster() {
  revalidatePath("/master");
  revalidatePath("/kwitansi/baru");
}

export async function createCompany(
  input: Record<string, string>,
): Promise<MasterActionResult> {
  const parsed = companySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  }
  if (!isSupabaseConfigured) return { ok: true, demo: true };

  const d = parsed.data;
  const supabase = await createClient();
  const { error } = await supabase.from("companies").insert({
    company_name: d.company_name,
    address: nn(d.address),
    pic: nn(d.pic),
    phone: nn(d.phone),
    status: "Aktif",
  });
  if (error) return { ok: false, error: error.message };
  revalidateMaster();
  return { ok: true, demo: false };
}

export async function deleteCompany(id: string): Promise<MasterActionResult> {
  if (!isSupabaseConfigured) return { ok: true, demo: true };
  const supabase = await createClient();
  const { error } = await supabase.from("companies").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateMaster();
  return { ok: true, demo: false };
}

export async function createVessel(
  input: Record<string, string>,
): Promise<MasterActionResult> {
  const parsed = vesselSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  }
  if (!isSupabaseConfigured) return { ok: true, demo: true };

  const d = parsed.data;
  const supabase = await createClient();
  const { error } = await supabase.from("vessels").insert({
    vessel_name: d.vessel_name,
    code: nn(d.code),
    owner: nn(d.owner),
    status: "Aktif",
  });
  if (error) return { ok: false, error: error.message };
  revalidateMaster();
  return { ok: true, demo: false };
}

export async function deleteVessel(id: string): Promise<MasterActionResult> {
  if (!isSupabaseConfigured) return { ok: true, demo: true };
  const supabase = await createClient();
  const { error } = await supabase.from("vessels").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateMaster();
  return { ok: true, demo: false };
}
