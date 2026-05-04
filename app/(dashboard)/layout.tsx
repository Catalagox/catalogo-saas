"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Sidebar from "@/components/dashboard/principal/Sidebar";
import Logo from "@/components/marketing/ui/Logo";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/auth");
      } else {
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-main)] text-white">
        <div className="animate-pulse text-sm font-medium text-[var(--text-secondary)]">
          Cargando...
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[var(--bg-main)] text-white">
      {/* SIDEBAR DESKTOP */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-[var(--border-card)] lg:flex">
        <Sidebar />
      </aside>

      {/* SIDEBAR MOBILE */}
      <div
        className={`
          fixed inset-0 z-50 lg:hidden transition-all duration-300
          ${open ? "visible" : "invisible"}
        `}
      >
        {/* OVERLAY */}
        <div
          className={`
            absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300
            ${open ? "opacity-100" : "opacity-0"}
          `}
          onClick={() => setOpen(false)}
        />

        {/* PANEL */}
        <aside
          className={`
            relative flex h-full w-72 max-w-[85vw] flex-col border-r border-[var(--border-card)]
            bg-[var(--bg-secondary)] shadow-2xl
            transform transition-transform duration-300 ease-in-out
            ${open ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          {/* MOBILE SIDEBAR HEADER */}
          <div className="flex items-center justify-between border-b border-[var(--border-card)] px-4 py-4">
            <Logo size="sm" />

            <button
              onClick={() => setOpen(false)}
              className="rounded-xl p-2 text-[var(--text-secondary)] transition hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]"
            >
              <X size={20} />
            </button>
          </div>

          {/* SIDEBAR CONTENT */}
          <div className="flex-1 overflow-y-auto">
            <Sidebar closeMenu={() => setOpen(false)} />
          </div>
        </aside>
      </div>

      {/* CONTENT */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* HEADER MOBILE */}
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-[var(--border-card)] bg-[var(--bg-main)]/90 px-4 py-4 backdrop-blur-md lg:hidden">
          <Logo size="sm" />

          <button
            onClick={() => setOpen(true)}
            className="rounded-xl border border-[var(--border-card)] bg-[var(--bg-secondary)] p-2 transition hover:bg-[var(--bg-card-hover)]"
          >
            <Menu size={20} />
          </button>
        </header>

        {/* MAIN */}
        <main className="mx-auto flex-1 w-full max-w-[1600px] p-4 md:p-6 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
