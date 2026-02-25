"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
  LayoutDashboard,
  FolderKanban,
  Package,
  Settings,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const linkClass = (path: string) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
      pathname === path
        ? "bg-white text-black font-semibold"
        : "text-gray-400 hover:bg-gray-800 hover:text-white"
    }`;

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col justify-between min-h-screen p-6">
      
      {/* LOGO */}
      <div>
        <div className="mb-10">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Catalagox
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Panel profesional
          </p>
        </div>

        {/* NAV */}
        <nav className="space-y-2">
          <Link href="/dashboard" className={linkClass("/dashboard")}>
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          <Link href="/dashboard/catalogos" className={linkClass("/dashboard/catalogos")}>
            <FolderKanban size={18} />
            Catálogos
          </Link>

          <Link href="/dashboard/productos" className={linkClass("/dashboard/productos")}>
            <Package size={18} />
            Productos
          </Link>

          <Link href="/dashboard/settings" className={linkClass("/dashboard/settings")}>
            <Settings size={18} />
            Ajustes
          </Link>
        </nav>
      </div>

      {/* FOOTER */}
      <div>
        <button
          onClick={cerrarSesion}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-400 hover:bg-red-500 hover:text-white transition"
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>

        <p className="text-xs text-gray-600 mt-6">
          © {new Date().getFullYear()} Catalagox
        </p>
      </div>
    </aside>
  );
}