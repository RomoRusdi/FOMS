import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { MOCK_COMPANIES, MOCK_VESSELS } from "@/lib/mock";
import type { Company, Vessel } from "@/lib/types";

export async function getCompanies(): Promise<Company[]> {
  if (!isSupabaseConfigured) return MOCK_COMPANIES;
  const supabase = await createClient();
  const { data } = await supabase
    .from("companies")
    .select("*")
    .order("company_name", { ascending: true });
  return (data as Company[]) ?? [];
}

export async function getVessels(): Promise<Vessel[]> {
  if (!isSupabaseConfigured) return MOCK_VESSELS;
  const supabase = await createClient();
  const { data } = await supabase
    .from("vessels")
    .select("*")
    .order("vessel_name", { ascending: true });
  return (data as Vessel[]) ?? [];
}
