import type { KwitansiPaperData } from "@/components/kwitansi/kwitansi-paper";
import type { Settings } from "@/lib/settings";

/** Warm the (lazy) PDF renderer so a later click generates quickly — important
 *  on iOS where navigator.share must fire within the user-gesture window. */
export function preloadPdf() {
  return import("./kwitansi-pdf");
}

async function makePdf(data: KwitansiPaperData, settings: Settings) {
  const { renderKwitansiBlob, kwitansiFilename } = await import("./kwitansi-pdf");
  const blob = await renderKwitansiBlob(data, settings);
  return { blob, name: kwitansiFilename(data.number) };
}

/** Build a blob object URL + filename (used by the "view" action). */
export async function buildKwitansiObjectUrl(
  data: KwitansiPaperData,
  settings: Settings,
): Promise<{ url: string; name: string }> {
  const { blob, name } = await makePdf(data, settings);
  return { url: URL.createObjectURL(blob), name };
}

function isIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  return (
    /iP(hone|ad|od)/.test(navigator.userAgent) ||
    // iPadOS 13+ reports as desktop Safari but has touch points.
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

/**
 * Save/deliver the kwitansi PDF.
 * - iOS: native share sheet (Save to Files / Print / AirDrop), since Safari
 *   ignores the <a download> attribute for blob URLs.
 * - Desktop / Android: normal file download.
 */
export async function downloadKwitansiPdf(
  data: KwitansiPaperData,
  settings: Settings,
): Promise<void> {
  const { blob, name } = await makePdf(data, settings);

  if (isIOS()) {
    const file = new File([blob], name, { type: "application/pdf" });
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: name });
        return;
      } catch (err) {
        // User dismissed the share sheet — that's fine, don't fall back.
        if (err instanceof Error && err.name === "AbortError") return;
        // Any other share failure → fall through to opening the PDF.
      }
    }
    // Fallback for older iOS without file sharing: open for viewing/printing.
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 30000);
    return;
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 15000);
}
