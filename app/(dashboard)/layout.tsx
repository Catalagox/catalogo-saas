"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Sidebar from "@/components/dashboard/principal/Sidebar";
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
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <div className="animate-pulse font-medium">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[var(--bg-main)] text-white">
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden lg:flex w-64 border-r border-gray-800 h-screen sticky top-0 flex-col shrink-0">
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
        <nav
          className={`
            relative w-72 bg-gray-900 h-full border-r border-gray-800 shadow-2xl
            transform transition-transform duration-300 ease-in-out flex flex-col
            ${open ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          {/* HEADER CON X */}
          <div className="flex items-center justify-between px-6 py-6 border-b border-gray-800">
            <div>
              <h2 className="text-xl font-bold text-white">
                Catalago<span className="text-blue-500">X</span>
              </h2>
              <p className="text-xs text-gray-500">Panel profesional</p>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-800 transition"
            >
              <X size={22} />
            </button>
          </div>

          {/* SIDEBAR CONTENT */}
          <div className="flex-1 overflow-y-auto">
            <Sidebar closeMenu={() => setOpen(false)} />
          </div>
        </nav>
      </div>

      {/* CONTENIDO */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* HEADER MOBILE */}
        <header className="sticky top-0 z-40 lg:hidden bg-gray-950/90 backdrop-blur-md border-b border-gray-800 px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            CatalagoX
          </h1>

          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-xl bg-gray-900 border border-gray-800 hover:bg-gray-800 transition"
          >
            <Menu size={22} />
          </button>
        </header>

        {/* MAIN */}
        <main className="flex-1 p-4 md:p-6 lg:p-10 max-w-[1600px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
