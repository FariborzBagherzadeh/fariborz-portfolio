"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (error) {
      setErrorMessage("Email or password is incorrect.");
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#f7faff] px-6 py-16 text-slate-900">
      <div className="aurora aurora-one" />
      <div className="aurora aurora-two" />

      <section className="glass-card relative z-10 mx-auto max-w-md p-8 md:p-10">
        <a href="/" className="text-lg font-bold tracking-tight">
          FB<span className="text-blue-600">.</span>
        </a>

        <p className="mt-10 text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
          Private area
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">
          Admin sign in
        </h1>
        <p className="mt-3 leading-7 text-slate-600">
          Sign in with the Supabase account you added as an admin.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Email</span>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">
              Password
            </span>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </label>

          {errorMessage && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}
