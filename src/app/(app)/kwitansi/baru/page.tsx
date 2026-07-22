import { getCompanies, getVessels } from "@/lib/data/master";
import { getNextReceiptNumber } from "@/lib/data/receipts";
import { toISODate } from "@/lib/format";
import { getSettings } from "@/lib/settings";
import { CreateReceiptForm } from "./create-receipt-form";

export const metadata = { title: "Buat Kwitansi · FOMS" };

export default async function BuatKwitansiPage() {
  const today = toISODate(new Date());
  const [companies, vessels, initialNumber] = await Promise.all([
    getCompanies(),
    getVessels(),
    getNextReceiptNumber(today),
  ]);
  const settings = getSettings();

  // Prefill mirrors the hi-fi mock so the live preview is populated on load.
  const prefCompany =
    companies.find((c) => c.company_name === "PT Samudra Biru") ?? companies[0];
  const prefVessel = vessels.find((v) => v.vessel_name === "MV Sinar Jaya");

  const initial = {
    companyId: prefCompany?.id ?? "",
    vesselId: prefVessel?.id ?? "",
    amount: 2_500_000,
    description:
      "Jasa bongkar muat kargo — sewa forklift 1 shift, trailer 2 rit, dan BBM operasional.",
  };

  return (
    <CreateReceiptForm
      companies={companies}
      vessels={vessels}
      initialNumber={initialNumber}
      initialDate={today}
      initial={initial}
      settings={settings}
    />
  );
}
