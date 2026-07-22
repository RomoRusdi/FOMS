import type { KwitansiPaperData } from "@/components/kwitansi/kwitansi-paper";
import type { Settings } from "@/lib/settings";

/** Build a blob object URL + filename for a kwitansi PDF (lazy-loads renderer). */
export async function buildKwitansiObjectUrl(
  data: KwitansiPaperData,
  settings: Settings,
): Promise<{ url: string; name: string }> {
  const { renderKwitansiBlob, kwitansiFilename } = await import(
    "./kwitansi-pdf"
  );
  const blob = await renderKwitansiBlob(data, settings);
  return { url: URL.createObjectURL(blob), name: kwitansiFilename(data.number) };
}

/** Trigger a browser download of the kwitansi PDF. */
export async function downloadKwitansiPdf(
  data: KwitansiPaperData,
  settings: Settings,
): Promise<void> {
  const { url, name } = await buildKwitansiObjectUrl(data, settings);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 15000);
}
