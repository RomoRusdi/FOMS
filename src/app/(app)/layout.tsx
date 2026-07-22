import { TopNav } from "@/components/layout/top-nav";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userName = "Andi Darma";
  let userRole = "Admin Finance";

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("users")
        .select("name, role")
        .eq("id", user.id)
        .maybeSingle();
      userName = profile?.name || user.email || userName;
      if (profile?.role) userRole = profile.role;
    }
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-page">
      <TopNav
        authEnabled={isSupabaseConfigured}
        userName={userName}
        userRole={userRole}
      />
      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
