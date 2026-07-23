import { getCompanies, getVessels } from "@/lib/data/master";
import {
  createCompany,
  createVessel,
  deleteCompany,
  deleteVessel,
} from "./actions";
import { MasterManager } from "./master-manager";

export const metadata = { title: "Master Data · FOMS" };

export default async function MasterPage() {
  const [companies, vessels] = await Promise.all([
    getCompanies(),
    getVessels(),
  ]);

  return (
    <div className="flex flex-col gap-[14px] p-[18px]">
      <div>
        <h1 className="text-[17px] font-extrabold tracking-[-0.01em] text-ink">
          Master Data
        </h1>
        <p className="text-xs text-meta">
          Kelola daftar Perusahaan (PT) dan Kapal yang dipakai di kwitansi.
        </p>
      </div>

      <div className="grid gap-[14px] lg:grid-cols-2 lg:items-start">
        <MasterManager
          title={`Perusahaan (PT) · ${companies.length}`}
          addLabel="Tambah PT"
          emptyText="Belum ada perusahaan."
          items={companies.map((c) => ({
            id: c.id,
            primary: c.company_name,
            secondary: [c.pic, c.phone].filter(Boolean).join(" · "),
          }))}
          fields={[
            { key: "company_name", label: "Nama PT", placeholder: "PT Samudra Biru" },
            { key: "address", label: "Alamat", placeholder: "Jl. …" },
            { key: "pic", label: "PIC", placeholder: "Nama kontak" },
            { key: "phone", label: "No HP", placeholder: "0812-…" },
          ]}
          onCreate={createCompany}
          onDelete={deleteCompany}
        />

        <MasterManager
          title={`Kapal · ${vessels.length}`}
          addLabel="Tambah Kapal"
          emptyText="Belum ada kapal."
          items={vessels.map((v) => ({
            id: v.id,
            primary: v.vessel_name,
            secondary: [v.code, v.owner].filter(Boolean).join(" · "),
          }))}
          fields={[
            { key: "vessel_name", label: "Nama Kapal", placeholder: "MV Sinar Jaya" },
            { key: "code", label: "Kode", placeholder: "SJ-01" },
            { key: "owner", label: "Pemilik", placeholder: "PT …" },
          ]}
          onCreate={createVessel}
          onDelete={deleteVessel}
        />
      </div>
    </div>
  );
}
