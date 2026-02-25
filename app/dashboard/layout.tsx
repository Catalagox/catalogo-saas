"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Sidebar from "@/components/dashboard/Sidebar";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/login");
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

      {/* CONTENIDO */}
      <div className="flex-1 flex flex-col">

        {/* TOPBAR MOBILE */}
        <header className="lg:hidden bg-gray-900 border-b border-gray-800 px-6 py-4">
          <h1 className="text-lg font-bold">Catalagox</h1>
        </header>

        <main className="flex-1 p-6 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}