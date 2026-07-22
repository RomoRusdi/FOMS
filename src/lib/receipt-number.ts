/**
 * Nomor kwitansi — configurable format (PRD: "009/VII/26" atau "FAZ/009/2026").
 *
 * Tokens:
 *   {seq}    -> nomor urut (tanpa padding)          -> 9
 *   {seq3}   -> nomor urut padding 3 digit          -> 009
 *   {roman}  -> bulan angka Romawi                  -> VII
 *   {month}  -> bulan 2 digit                       -> 07
 *   {yy}     -> tahun 2 digit                        -> 26
 *   {yyyy}   -> tahun 4 digit                        -> 2026
 */

const ROMAN = [
  "",
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
  "XI",
  "XII",
];

export const DEFAULT_RECEIPT_PATTERN = "{seq3}/{roman}/{yy}";

export function formatReceiptNumber(
  seq: number,
  date: string | Date = new Date(),
  pattern: string = DEFAULT_RECEIPT_PATTERN,
): string {
  const d = new Date(date);
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  return pattern
    .replace(/\{seq3\}/g, String(seq).padStart(3, "0"))
    .replace(/\{seq\}/g, String(seq))
    .replace(/\{roman\}/g, ROMAN[month])
    .replace(/\{month\}/g, String(month).padStart(2, "0"))
    .replace(/\{yyyy\}/g, String(year))
    .replace(/\{yy\}/g, String(year).slice(-2));
}
