/**
 * Terbilang — konversi angka ke kata Bahasa Indonesia.
 * Contoh: 2_500_000 -> "Dua Juta Lima Ratus Ribu Rupiah"
 */

const ONES = [
  "",
  "satu",
  "dua",
  "tiga",
  "empat",
  "lima",
  "enam",
  "tujuh",
  "delapan",
  "sembilan",
  "sepuluh",
  "sebelas",
];

function words(n: number): string {
  n = Math.floor(n);
  if (n < 0) return "minus " + words(-n);
  if (n < 12) return ONES[n];
  if (n < 20) return words(n - 10) + " belas";
  if (n < 100)
    return (
      words(Math.floor(n / 10)) + " puluh" + (n % 10 ? " " + words(n % 10) : "")
    );
  if (n < 200) return "seratus" + (n - 100 ? " " + words(n - 100) : "");
  if (n < 1000)
    return (
      words(Math.floor(n / 100)) +
      " ratus" +
      (n % 100 ? " " + words(n % 100) : "")
    );
  if (n < 2000) return "seribu" + (n - 1000 ? " " + words(n - 1000) : "");
  if (n < 1_000_000)
    return (
      words(Math.floor(n / 1000)) +
      " ribu" +
      (n % 1000 ? " " + words(n % 1000) : "")
    );
  if (n < 1_000_000_000)
    return (
      words(Math.floor(n / 1_000_000)) +
      " juta" +
      (n % 1_000_000 ? " " + words(n % 1_000_000) : "")
    );
  if (n < 1_000_000_000_000)
    return (
      words(Math.floor(n / 1_000_000_000)) +
      " miliar" +
      (n % 1_000_000_000 ? " " + words(n % 1_000_000_000) : "")
    );
  return (
    words(Math.floor(n / 1_000_000_000_000)) +
    " triliun" +
    (n % 1_000_000_000_000 ? " " + words(n % 1_000_000_000_000) : "")
  );
}

function titleCase(s: string): string {
  return s
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Lowercase kalimat terbilang tanpa "Rupiah". 0 -> "nol". */
export function terbilangRaw(amount: number): string {
  const n = Math.floor(Math.abs(amount || 0));
  if (n === 0) return "nol";
  return words(n).replace(/\s+/g, " ").trim();
}

/** Title Case + " Rupiah" untuk kwitansi. Contoh: "Dua Juta Lima Ratus Ribu Rupiah". */
export function terbilang(amount: number): string {
  return titleCase(terbilangRaw(amount)) + " Rupiah";
}
