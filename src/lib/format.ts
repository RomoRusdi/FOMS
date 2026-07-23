import dayjs from "dayjs";
import "dayjs/locale/id";

dayjs.locale("id");

/** Rp 2.500.000 — full grouped rupiah, no decimals. */
export function formatRupiah(amount: number): string {
  return "Rp " + new Intl.NumberFormat("id-ID").format(Math.round(amount || 0));
}

/** Bare grouped number without the Rp prefix (for input display / prefixed fields). */
export function formatNumber(amount: number): string {
  return new Intl.NumberFormat("id-ID").format(Math.round(amount || 0));
}

/** Kwitansi amount box format: "2,500,000,-" (comma groups + trailing ,-). */
export function formatKwitansiAmount(amount: number): string {
  return new Intl.NumberFormat("en-US").format(Math.round(amount || 0)) + ",-";
}

/**
 * Compact rupiah for stat tiles: Rp 550jt, Rp 1,2m, Rp 80jt.
 * jt = juta (1e6), m = miliar (1e9), rb = ribu (1e3).
 */
export function formatRupiahCompact(amount: number): string {
  const n = Math.round(amount || 0);
  const fmt = (v: number, suffix: string) => {
    const s = v.toFixed(v < 10 && v % 1 !== 0 ? 1 : 0).replace(".", ",");
    return `Rp ${s}${suffix}`;
  };
  if (n >= 1_000_000_000) return fmt(n / 1_000_000_000, "m");
  if (n >= 1_000_000) return fmt(n / 1_000_000, "jt");
  if (n >= 1_000) return fmt(n / 1_000, "rb");
  return formatRupiah(n);
}

/** 22 Juli 2026 */
export function formatDateLong(date: string | Date): string {
  return dayjs(date).format("D MMMM YYYY");
}

/** 22 Jul 2026 */
export function formatDateShort(date: string | Date): string {
  return dayjs(date).format("D MMM YYYY");
}

/** e.g. "Rabu, 22 Juli 2026" */
export function formatDateFull(date: string | Date): string {
  return dayjs(date).format("dddd, D MMMM YYYY");
}

/** 22 Jul 2026, 09:14 */
export function formatDateTime(date: string | Date): string {
  return dayjs(date).format("D MMM YYYY, HH:mm");
}

/** Full year number for a given date. */
export function yearOf(date: string | Date): number {
  return dayjs(date).year();
}

/** YYYY-MM-DD for <input type="date"> and DB columns. */
export function toISODate(date: string | Date): string {
  return dayjs(date).format("YYYY-MM-DD");
}
