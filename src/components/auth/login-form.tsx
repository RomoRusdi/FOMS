"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export function LoginForm({ configured }: { configured: boolean }) {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!configured) {
      router.push(next);
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      toast.error("Gagal masuk", { description: error.message });
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {!configured && (
        <div className="rounded-[10px] border border-dashed border-line bg-surface-2 px-4 py-3 text-[12.5px] leading-relaxed text-muted-foreground">
          <span className="font-semibold text-ink">Mode Demo.</span> Supabase
          belum dikonfigurasi — klik <b>Masuk</b> untuk menjelajah dengan data
          contoh.
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email" className="text-[12.5px] text-muted-foreground">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="admin@ptkecap.co.id"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required={configured}
          className="h-[42px]"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label
          htmlFor="password"
          className="text-[12.5px] text-muted-foreground"
        >
          Kata Sandi
        </Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required={configured}
          className="h-[42px]"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="mt-1 h-[44px] w-full bg-navy text-[14px] font-semibold hover:bg-navy/90"
      >
        {loading && <Loader2 className="size-4 animate-spin" />}
        Masuk
      </Button>

      <p className="text-center text-[12px] text-meta">
        Lupa kata sandi? Hubungi administrator sistem.
      </p>
    </form>
  );
}
