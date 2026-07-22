"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu, Search } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Kwitansi", href: "/kwitansi" },
  { label: "Laporan", href: "/laporan" },
  { label: "Master Data", href: "/master" },
  { label: "Pengaturan", href: "/pengaturan" },
];

export function TopNav({
  authEnabled = false,
  userName = "Andi Darma",
  userRole = "Admin Finance",
}: {
  authEnabled?: boolean;
  userName?: string;
  userRole?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const initials = userName
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  async function handleLogout() {
    setMenuOpen(false);
    if (authEnabled) {
      await createClient().auth.signOut();
    }
    router.push("/login");
  }

  return (
    <header className="flex h-14 flex-none items-center justify-between bg-navy px-4 md:h-[58px] md:px-[22px]">
      <div className="flex items-center gap-[26px]">
        <Link href="/dashboard" className="flex items-center gap-[10px]">
          <BrandMark size={32} />
          <span className="text-[15px] font-bold text-white">
            PT Kecap FOMS
          </span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-[13px] py-[7px] text-[13px] transition-colors",
                isActive(item.href)
                  ? "bg-white/[0.14] font-semibold text-white"
                  : "font-medium text-[#a9b8d4] hover:text-white",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden w-[190px] items-center gap-2 rounded-[9px] bg-white/[0.12] px-3 py-[7px] text-[12.5px] text-[#a9b8d4] lg:flex">
          <Search className="size-[13px]" strokeWidth={2.5} />
          <span>Cari…</span>
        </div>

        {/* Desktop user menu */}
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Menu pengguna"
            className="hidden size-[34px] items-center justify-center rounded-full bg-brand text-xs font-bold text-white outline-none md:flex"
          >
            {initials}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>
              <div className="text-[13px] font-semibold text-ink">
                {userName}
              </div>
              <div className="text-[11px] font-normal text-meta">{userRole}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/pengaturan")}>
              Pengaturan
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={handleLogout}>
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Mobile hamburger + drawer */}
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger
            aria-label="Buka menu"
            className="flex size-9 items-center justify-center rounded-lg bg-white/[0.12] text-white outline-none md:hidden"
          >
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] gap-0 p-0">
            <SheetTitle className="sr-only">Menu navigasi</SheetTitle>
            <div className="flex items-center gap-[10px] border-b border-line px-5 py-4">
              <BrandMark size={34} variant="navy" />
              <div>
                <div className="text-sm font-bold text-ink">PT Kecap FOMS</div>
                <div className="text-[11px] text-meta">FOMS · Finance</div>
              </div>
            </div>

            <nav className="flex flex-col gap-1 p-3">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "rounded-[10px] px-3 py-2.5 text-[14px] transition-colors",
                    isActive(item.href)
                      ? "bg-brand-soft font-semibold text-navy"
                      : "font-medium text-body hover:bg-surface-2",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto border-t border-line p-3">
              <div className="flex items-center gap-3 px-2 py-2">
                <div className="flex size-9 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
                  {initials}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-[13px] font-semibold text-ink">
                    {userName}
                  </div>
                  <div className="text-[11px] text-meta">{userRole}</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="mt-1 flex w-full items-center gap-2 rounded-[10px] px-3 py-2.5 text-[14px] font-semibold text-danger hover:bg-danger-soft"
              >
                <LogOut className="size-4" />
                Keluar
              </button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
