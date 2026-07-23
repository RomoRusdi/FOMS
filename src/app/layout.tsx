import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

// App-wide UI font.
const appFont = Manrope({
  variable: "--font-sans-family",
  subsets: ["latin"],
  display: "swap",
  // Guarantees a sans fallback (never an ugly serif) while the webfont loads.
  fallback: ["system-ui", "Segoe UI", "Arial", "sans-serif"],
});

// Kwitansi keeps its previous typeface (Inter), independent of the app font.
const kwitansiFont = Inter({
  variable: "--font-kwitansi",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FOMS · PT Kecap",
  description:
    "Financial Operation Management System — kwitansi, laporan operasional, dan dashboard keuangan.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${appFont.variable} ${kwitansiFont.variable} antialiased`}
      >
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
