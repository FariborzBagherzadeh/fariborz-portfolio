"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AdminSignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
    >
      Sign out
    </button>
  );
}
