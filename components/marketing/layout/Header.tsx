"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Logo from "@/components/marketing/ui/Logo";
import { FaBars, FaTimes, FaUserPlus, FaSignOutAlt, FaTachometerAlt } from "react-icons/fa";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    };
    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    setMenuOpen(false);
    await supabase.auth.signOut();
    router.push("/");
  };

  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Determinar si el fondo del header debe ser sólido
  const headerSolid = !isHome || scrolled || menuOpen;

  const textColor = mounted && headerSolid ? "text-slate-900" : "text-white";

  const navHoverColor =
    mounted && headerSolid
      ? "hover:text-emerald-600"
      : "hover:text-emerald-400";

  return (
    <header
      className={`${
        isHome ? "fixed" : "sticky"
      } top-0 w-full z-[100] transition-all duration-300 border-b ${
        mounted && headerSolid
          ? "bg-white/95 backdrop-blur-md border-gray-200 py-2 shadow-sm"
          : "bg-transparent border-white/10 py-3"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 relative z-[120]">
        {/* LOGO */}
        <div className="flex items-center">
          <Logo scrolled={mounted && headerSolid} size="md" />
        </div>

        {/* NAV DESKTOP */}
        <nav
          className={`hidden md:flex items-center gap-8 text-sm font-bold transition-colors ${textColor}`}
        >
          {["Inicio", "Contacto", "Suscripcion"].map((item) => (
            <Link
              key={item}
              href={item === "Inicio" ? "/" : `/${item.toLowerCase()}`}
              className={`relative transition-colors ${navHoverColor} group py-1`}
            >
              {item}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-emerald-500 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}

          <a
            href="https://catalagox.com/rifas"
            target="_blank"
            rel="noopener noreferrer"
            className={`relative transition-colors ${navHoverColor} group py-1`}
          >
            Rifas
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-emerald-500 transition-all duration-300 group-hover:w-full" />
          </a>
        </nav>

        {/* BOTONES DESKTOP */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <Link
                href="/admin"
                className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-all active:scale-95"
              >
                <FaTachometerAlt />
                Mi Panel
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold bg-rose-500/10 text-rose-600 hover:bg-rose-500 hover:text-white transition-all active:scale-95 cursor-pointer"
              >
                <FaSignOutAlt />
                Salir
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth"
                className={`
                  px-5 py-2 rounded-full text-sm font-bold transition-all border
                  ${
                    mounted && headerSolid
                      ? "bg-white border-slate-200 text-slate-900 hover:border-emerald-500 hover:text-emerald-600"
                      : "bg-white/10 border-white/20 text-white backdrop-blur-sm hover:bg-white/20"
                  }
                `}
              >
                Ingresar
              </Link>

              <Link
                href="/auth"
                className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-all active:scale-95"
              >
                <FaUserPlus />
                Crear tienda
              </Link>
            </>
          )}
        </div>

        {/* BOTÓN MÓVIL HAMBURGUESA */}
        <button
          className={`md:hidden p-2 rounded-xl transition-all active:scale-90 z-[130] cursor-pointer shadow-sm ${
            menuOpen
              ? "bg-slate-900 text-white hover:bg-slate-800"
              : mounted && headerSolid
              ? "bg-slate-100 text-slate-900 hover:bg-slate-200"
              : "bg-white/20 text-white backdrop-blur-md hover:bg-white/30"
          }`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          {menuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
        </button>
      </div>

      {/* OVERLAY MÓVIL */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden z-[105] ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* MENÚ DESPLEGABLE MÓVIL */}
      <div
        className={`fixed top-0 right-0 h-screen w-[85%] max-w-sm bg-white p-6 sm:p-8 shadow-2xl flex flex-col justify-between transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] md:hidden z-[110] ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="relative z-[120] pt-12">
          {/* Navegación Móvil */}
          <nav className="flex flex-col gap-5">
            {["Inicio", "Contacto", "Suscripcion"].map((item) => (
              <Link
                key={item}
                href={item === "Inicio" ? "/" : `/${item.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                className="text-lg font-extrabold text-slate-900 hover:text-emerald-600 transition-colors block py-1"
              >
                {item}
              </Link>
            ))}

            <a
              href="https://catalagox.com/rifas"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="text-lg font-extrabold text-slate-900 hover:text-emerald-600 transition-colors block py-1"
            >
              Rifas
            </a>
          </nav>
        </div>

        {/* Botones Móvil (Parte Inferior) */}
        <div className="flex flex-col gap-3 mt-auto relative z-[120] pt-6 border-t border-slate-100">
          {isLoggedIn ? (
            <>
              <Link
                href="/admin"
                onClick={() => setMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 active:scale-95"
              >
                <FaTachometerAlt />
                Ir a Mi Panel
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all cursor-pointer"
              >
                <FaSignOutAlt />
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth"
                onClick={() => setMenuOpen(false)}
                className="w-full text-center px-6 py-3.5 rounded-xl text-sm font-bold border border-slate-200 text-slate-900 bg-slate-50 hover:bg-slate-100 transition-all"
              >
                Iniciar sesión
              </Link>

              <Link
                href="/auth"
                onClick={() => setMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 active:scale-95"
              >
                <FaUserPlus />
                Crear tienda gratis
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}