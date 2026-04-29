"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Logo from "@/components/marketing/ui/Logo";
import { FaBars, FaTimes, FaSignInAlt, FaUserPlus } from "react-icons/fa";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Clases dinámicas para el color de texto (Blanco sobre imagen, Negro en scroll)
  const textColor = scrolled ? "text-slate-900" : "text-white";
  const navHoverColor = scrolled
    ? "hover:text-emerald-600"
    : "hover:text-[var(--color-primary)]";

  return (
    <header
      className={`fixed top-0 w-full z-[100] transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md border-b border-gray-100 py-3 shadow-md"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6">
        {/* LOGO */}
        <Logo scrolled={scrolled} size="lg" />

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
                scrolled
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

        {/* HAMBURGER (Botón móvil) */}
        <button
          className={`md:hidden p-2 rounded-xl transition-all active:scale-90 ${
            scrolled
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

      {/* SIDE MENU (Móvil) */}
      <div
        className={`fixed top-0 right-0 h-full w-[80%] max-w-sm bg-white p-8 shadow-2xl transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full text-slate-900">
          <div className="flex justify-between items-center mb-12">
            <span className="font-black text-2xl tracking-tighter text-black">
              Menu
            </span>
            <button
              onClick={() => setMenuOpen(false)}
              className="p-3 bg-slate-100 rounded-full text-slate-900 hover:bg-[var(--color-primary)] transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          <nav className="flex flex-col gap-6 text-2xl font-black italic uppercase tracking-tight">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="hover:text-[var(--color-primary)]"
            >
              Inicio
            </Link>
            <Link
              href="/contacto"
              onClick={() => setMenuOpen(false)}
              className="hover:text-[var(--color-primary)]"
            >
              Contacto
            </Link>
            <Link
              href="/suscripcion"
              onClick={() => setMenuOpen(false)}
              className="hover:text-[var(--color-primary)]"
            >
              Planes
            </Link>
          </nav>

          <div className="mt-auto flex flex-col gap-4">
            <Link
              href="/auth"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center py-4 rounded-2xl font-bold bg-slate-100 text-slate-900 border border-slate-200"
            >
              Login
            </Link>
            <Link
              href="/auth"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center py-4 rounded-2xl font-bold bg-[var(--color-primary)] text-black shadow-xl"
            >
              Comenzar ahora
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
