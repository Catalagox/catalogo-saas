"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabaseClient";
import Logo from "@/components/marketing/ui/Logo";

import {
  LayoutDashboard,
  Package,
  ShoppingBag,
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
    name: "Pedidos",
    href: "/dashboard/pedidos",
    icon: ShoppingBag,
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

export default function Sidebar({ closeMenu }: Props) {
  const pathname = usePathname();

  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    let activo = true;

    const cargarUsuario = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!activo || !user) return;

      setUserEmail(user.email || "");
      setUserName(user.user_metadata?.name || "");
    };

    void cargarUsuario();

    return () => {
      activo = false;
    };
  }, []);

  const cerrarSesion = async () => {
    closeMenu?.();

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("No se pudo cerrar la sesión:", error);
      return;
    }

    window.location.href = "/";
  };

  const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    userName || userEmail || "Usuario",
  )}&background=111827&color=fff`;

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden border-r border-[var(--border-card)] bg-[var(--bg-secondary)]">
      {/* Logo fijo en escritorio */}
      <div className="hidden shrink-0 border-b border-[var(--border-card)] px-6 py-5 lg:block">
        <Logo size="md" />
      </div>

      {/* Solo esta zona se desplaza */}
      <nav
        aria-label="Menú del dashboard"
        className="sidebar-scroll min-h-0 flex-1 space-y-1 overflow-x-hidden overflow-y-auto overscroll-contain px-3 py-4 sm:px-4"
      >
        {links.map((link) => {
          const Icon = link.icon;

          // Coincidencia exacta: Ajustes y Dominios no
          // quedan activos simultáneamente.
          const active = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              aria-current={active ? "page" : undefined}
              title={link.name}
              className={`
                flex min-h-11 items-center gap-3 rounded-xl px-4 py-2.5
                text-sm transition-colors duration-200
                focus-visible:outline-2
                focus-visible:outline-offset-[-2px]
                focus-visible:outline-[var(--color-primary)]
                ${
                  active
                    ? "bg-[var(--color-primary)] font-semibold text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]"
                }
              `}
            >
              <Icon size={19} className="shrink-0" />

              <span className="min-w-0 truncate">
                {link.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Cuenta fija debajo de la navegación */}
      <div className="shrink-0 border-t border-[var(--border-card)] bg-[var(--bg-secondary)] p-4">
        <div className="mb-4 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={avatar}
            alt=""
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
          className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-[var(--text-secondary)] transition-colors duration-200 hover:bg-[var(--color-danger)] hover:text-white"
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>

      <style>{`
        .sidebar-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(148, 163, 184, 0.35) transparent;
        }

        .sidebar-scroll::-webkit-scrollbar {
          width: 6px;
        }

        .sidebar-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .sidebar-scroll::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.35);
          border-radius: 999px;
        }

        .sidebar-scroll:hover::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.6);
        }
      `}</style>
    </div>
  );
}