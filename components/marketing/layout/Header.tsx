"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Logo from "@/components/marketing/ui/Logo";
import { FaBars, FaTimes, FaUserPlus } from "react-icons/fa";

export default function Header() {
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detecta si es la página principal
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Si NO es home, el header siempre se verá sólido
  const headerSolid = !isHome || scrolled;

  // Colores dinámicos
  const textColor = headerSolid ? "text-slate-900" : "text-white";

  const navHoverColor = headerSolid
    ? "hover:text-emerald-600"
    : "hover:text-[var(--color-primary)]";

  return (
    <header
      className={`${
        isHome ? "fixed" : "sticky"
      } top-0 w-full z-[100] transition-all duration-300 ${
        headerSolid
          ? "bg-white/90 backdrop-blur-md border-b border-gray-100 py-3 shadow-md"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6">
        {/* LOGO */}
        <Logo scrolled={headerSolid} size="lg" />

        {/* NAV DESKTOP */}
        <nav
          className={`hidden md:flex items-center gap-10 text-sm font-bold transition-colors ${textColor}`}
        >
          {["Inicio", "Contacto", "Suscripcion"].map((item) => (
            <Link
              key={item}
              href={item === "Inicio" ? "/" : `/${item.toLowerCase()}`}
              className={`relative transition-colors ${navHoverColor} group`}
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[var(--color-primary)] transition-all group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* BUTTONS DESKTOP */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/auth"
            className={`
              px-6 py-2.5 rounded-full text-sm font-bold transition-all border
              ${
                headerSolid
                  ? "bg-white border-slate-200 text-slate-900 hover:bg-[var(--color-primary)] hover:border-[var(--color-primary)] hover:text-black"
                  : "bg-white/10 border-white/20 text-white backdrop-blur-sm hover:bg-[var(--color-primary)] hover:text-black hover:border-[var(--color-primary)]"
              }
            `}
          >
            Login
          </Link>

          <Link
            href="/auth"
            className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold bg-[var(--color-primary)] text-black shadow-lg shadow-emerald-500/20 hover:bg-white transition-all active:scale-95"
          >
            <FaUserPlus />
            Crear cuenta
          </Link>
        </div>

        {/* HAMBURGER */}
        <button
          className={`md:hidden p-2 rounded-xl transition-all active:scale-90 ${
            headerSolid
              ? "bg-slate-100 text-slate-900"
              : "bg-white/20 text-white backdrop-blur-md"
          }`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <FaTimes className="text-2xl" />
          ) : (
            <FaBars className="text-2xl" />
          )}
        </button>
      </div>

      {/* OVERLAY MOBILE */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-500 md:hidden ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* SIDE MENU */}
      <div
        className={`fixed top-0 right-0 h-full w-[80%] max-w-sm bg-white p-8 shadow-2xl transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* contenido */}
      </div>
    </header>
  );
}
