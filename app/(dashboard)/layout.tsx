"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Sidebar from "@/components/dashboard/principal/Sidebar";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";

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
        Cargando...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">

      {/* SIDEBAR DESKTOP */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* SIDEBAR MOBILE */}
      <div
        className={`
          fixed inset-0 z-50 flex lg:hidden
          transition-opacity duration-300
          ${open ? "opacity-100 visible" : "opacity-0 invisible"}
        `}
      >
        {/* Sidebar */}
        <div
          className={`
            w-64 bg-gray-900 transform transition-transform duration-300
            ${open ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <Sidebar closeMenu={() => setOpen(false)} />
        </div>

        {/* Fondo oscuro */}
        <div
          className="flex-1 bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      </div>

      {/* CONTENIDO */}
      <div className="flex-1 flex flex-col">

        {/* TOPBAR MOBILE */}
        <header className="lg:hidden bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">

          <h1 className="text-lg font-bold">CatalagoX</h1>

          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-800 transition"
          >
            <Menu size={24} />
          </button>

        </header>

        <main className="flex-1 p-6 lg:p-10">
          {children}
        </main>

      </div>
    </div>
  );
}