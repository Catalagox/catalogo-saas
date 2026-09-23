"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabaseClient";
import Logo from "@/components/marketing/ui/Logo";

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
  HelpCircle,
  Globe2,
} from "lucide-react";

type Props = {
  closeMenu?: () => void;
};

export default function Sidebar({ closeMenu }: Props) {
  const pathname = usePathname();

  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const cargarUsuario = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserEmail(user.email || "");
        setUserName(user.user_metadata?.name || "");
      }
    };

    void cargarUsuario();
  }, []);

  const cerrarSesion = async () => {
    if (closeMenu) {
      closeMenu();
    }

    await supabase.auth.signOut();

    window.location.href = "/";
  };

  const links = [
    {
      name: "Principal",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Agregar producto",
      href: "/dashboard/agregar-producto",
      icon: PlusCircle,
    },
    {
      name: "Productos",
      href: "/dashboard/productos",
      icon: Package,
    },
    {
      name: "Categorías",
      href: "/dashboard/categorias",
      icon: Tags,
    },
    {
      name: "QR del catálogo",
      href: "/dashboard/qr",
      icon: QrCode,
    },
    {
      name: "Apariencia",
      href: "/dashboard/apariencia",
      icon: Palette,
    },
    {
      name: "Estadísticas",
      href: "/dashboard/estadistica",
      icon: BarChart3,
    },
    {
      name: "Ajustes",
      href: "/dashboard/ajustes",
      icon: Settings,
    },
    {
      name: "Dominio personalizado",
      href: "/dashboard/ajustes/dominios",
      icon: Globe2,
    },
    {
      name: "Ayuda",
      href: "/contacto",
      icon: HelpCircle,
    },
  ];

  const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    userName || userEmail || "Usuario",
  )}&background=111827&color=fff`;

  return (
    <div className="flex h-full w-full flex-col border-r border-[var(--border-card)] bg-[var(--bg-secondary)]">
      {/* HEADER SOLO DESKTOP */}
      <div className="hidden border-b border-[var(--border-card)] px-6 py-6 lg:block">
        <Logo size="md" />
      </div>

      {/* NAVEGACIÓN */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
        {links.map((link) => {
          const Icon = link.icon;

          /*
           * Usamos coincidencia exacta para evitar que
           * "Ajustes" y "Dominio personalizado" aparezcan
           * activos al mismo tiempo.
           */
          const active = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className={`
                flex items-center gap-3 rounded-xl px-4 py-3
                text-sm transition
                ${
                  active
                    ? "bg-[var(--color-primary)] font-semibold text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]"
                }
              `}
            >
              <Icon
                size={20}
                className="shrink-0"
              />

              <span className="min-w-0 truncate">
                {link.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* INFORMACIÓN DEL USUARIO */}
      <div className="border-t border-[var(--border-card)] p-4">
        <div className="mb-4 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={avatar}
            alt="Avatar del usuario"
            className="h-10 w-10 shrink-0 rounded-full"
          />

          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-semibold text-[var(--text-primary)]">
              {userName || "Usuario"}
            </span>

            <span className="truncate text-xs text-[var(--text-secondary)]">
              {userEmail}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={cerrarSesion}
          className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-[var(--text-secondary)] transition-all duration-200 hover:bg-[var(--color-danger)] hover:text-white"
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}