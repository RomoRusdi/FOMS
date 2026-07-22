import { getSettings } from "@/lib/data/settings";
import { SettingsForm } from "./settings-form";

export const metadata = { title: "Pengaturan · FOMS" };

export default async function PengaturanPage() {
  const settings = await getSettings();
  return <SettingsForm initial={settings} />;
}
