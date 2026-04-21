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
    {
      name: "Agregar producto",
      href: "/dashboard/agregar-producto",
      icon: PlusCircle,
    },
    { name: "Productos", href: "/dashboard/productos", icon: Package },
    { name: "Categorías", href: "/dashboard/categorias", icon: Tags },
    { name: "QR del menú", href: "/dashboard/qr", icon: QrCode },
    { name: "Apariencia", href: "/dashboard/apariencia", icon: Palette },
    { name: "Estadísticas", href: "/dashboard/estadistica", icon: BarChart3 },
    { name: "Ajustes", href: "/dashboard/ajustes", icon: Settings },
  ];

  const avatar = `https://ui-avatars.com/api/?name=${userName || userEmail}&background=111827&color=fff`;

  return (
    <div className="flex flex-col h-full w-full bg-[var(--bg-secondary)] border-r border-[var(--border-card)] lg:bg-transparent">
      {/* HEADER SOLO DESKTOP */}
      <div className="hidden lg:block px-6 py-6 border-b border-[var(--border-card)]">
        <h2 className="text-xl font-bold text-[var(--text-primary)]">
          Catalago<span className="text-[var(--color-primary)]">X</span>
        </h2>

        <p className="text-xs text-[var(--text-secondary)] mt-1">
          Panel profesional
        </p>
      </div>

      {/* NAV */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition
                ${
                  active
                    ? "bg-[var(--color-primary)] text-[var(--text-primary)] font-semibold"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]"
                }
              `}
            >
              <Icon size={20} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="p-4 border-t border-[var(--border-card)]">
        <div className="flex items-center gap-3 mb-4">
          <img src={avatar} alt="avatar" className="w-10 h-10 rounded-full" />

          <div className="flex flex-col min-w-0">
            <span className="text-sm text-[var(--text-primary)] font-semibold truncate">
              {userName || "Usuario"}
            </span>

            <span className="text-xs text-[var(--text-secondary)] truncate">
              {userEmail}
            </span>
          </div>
        </div>

        <button
          onClick={cerrarSesion}
          className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--color-danger)] hover:text-white transition"
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
