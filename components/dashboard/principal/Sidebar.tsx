"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

import {
  LayoutDashboard,
  Package,
  Settings,
  LogOut,
  QrCode,
  Tags,
  Palette,
  BarChart3,
  PlusCircle,
  X,
} from "lucide-react";

type Props = {
  closeMenu?: () => void;
};

export default function Sidebar({ closeMenu }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    cargarUsuario();
  }, []);

  const cargarUsuario = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      setUserEmail(user.email || "");
      setUserName(user.user_metadata?.name || "");
    }
  };

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const links = [
    { name: "Principal", href: "/dashboard", icon: LayoutDashboard },
    { name: "Agregar producto", href: "/dashboard/agregar-producto", icon: PlusCircle },
    { name: "Productos", href: "/dashboard/productos", icon: Package },
    { name: "Categorías", href: "/dashboard/categorias", icon: Tags },
    { name: "QR del menú", href: "/dashboard/qr", icon: QrCode },
    { name: "Apariencia", href: "/dashboard/apariencia", icon: Palette },
    { name: "Estadísticas", href: "/dashboard/estadistica", icon: BarChart3 },
    { name: "Ajustes", href: "/dashboard/ajustes", icon: Settings },
  ];

  const avatar = `https://ui-avatars.com/api/?name=${userEmail}&background=111827&color=fff`;

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col h-screen sticky top-0">

      {/* BOTON CERRAR MOBILE */}
      {closeMenu && (
        <button
          onClick={closeMenu}
          className="absolute top-4 right-4 lg:hidden p-2 rounded-lg hover:bg-gray-800"
        >
          <X size={20} />
        </button>
      )}

      {/* CONTENIDO */}
      <div className="flex flex-col flex-1 overflow-y-auto p-6">

        {/* HEADER */}
        <div className="mb-10">

          <h2 className="text-2xl font-bold text-white">
            CatalagoX
          </h2>

          <p className="text-xs text-gray-500 mt-1">
            Panel profesional
          </p>

        </div>

        {/* NAV */}
        <nav className="space-y-1 flex-1">

          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  active
                    ? "bg-white text-black font-semibold"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >

                <Icon size={18} />

                {link.name}

              </Link>
            );
          })}

        </nav>

      </div>

      {/* FOOTER USUARIO */}
      <div className="border-t border-gray-800 p-4">

        <div className="flex items-center gap-3 mb-4">

          <img
            src={avatar}
            alt="avatar"
            className="w-9 h-9 rounded-full"
          />

          <div className="flex flex-col text-sm">

            <span className="text-white font-medium">
              {userName || "Usuario"}
            </span>

            <span className="text-gray-400 text-xs truncate">
              {userEmail}
            </span>

          </div>

        </div>

        <button
          onClick={cerrarSesion}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-gray-400 hover:bg-red-500 hover:text-white transition"
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>

      </div>

    </aside>
  );
}