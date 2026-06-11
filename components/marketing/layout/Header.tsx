"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient"; 
import Logo from "@/components/marketing/ui/Logo";
import { FaBars, FaTimes, FaUserPlus, FaSignOutAlt } from "react-icons/fa";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    setMenuOpen(false); 
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Si NO es home, o si el menú móvil está abierto, el contenedor del header se ve sólido
  const headerSolid = !isHome || scrolled || menuOpen;

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
          ? "bg-white/95 backdrop-blur-md border-b border-gray-100 py-3 shadow-md"
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
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold bg-rose-500 text-white shadow-lg shadow-rose-500/20 hover:bg-rose-600 transition-all active:scale-95 cursor-pointer"
            >
              <FaSignOutAlt />
              Cerrar sesión
            </button>
          ) : (
            <>
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
            </>
          )}
        </div>

        {/* HAMBURGER (ESTILOS ARREGLADOS AQUÍ) */}
        <button
          className={`md:hidden p-2.5 rounded-xl transition-all active:scale-90 z-[120] cursor-pointer shadow-sm ${
            menuOpen
              ? "bg-slate-900 text-white hover:bg-slate-800" // Estilo fijo, elegante y oscuro cuando el menú está abierto
              : headerSolid
              ? "bg-slate-100 text-slate-900 hover:bg-slate-200" // Estilo con scroll o páginas secundarias
              : "bg-white/20 text-white backdrop-blur-md hover:bg-white/30" // Estilo transparente inicial en Home
          }`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <FaTimes className="text-xl" />
          ) : (
            <FaBars className="text-xl" />
          )}
        </button>
      </div>

      {/* OVERLAY MOBILE */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-500 md:hidden z-[105] ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* SIDE MENU */}
      <div
        className={`fixed top-0 right-0 h-full w-[80%] max-w-sm bg-white p-8 shadow-2xl flex flex-col justify-between transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] md:hidden z-[110] ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div>
          {/* Espaciador superior para alinear correctamente el menú con el botón superior */}
          <div className="flex justify-end mb-8 h-11" />

          {/* Navegación móvil */}
          <nav className="flex flex-col gap-6">
            {["Inicio", "Contacto", "Suscripcion"].map((item) => (
              <Link
                key={item}
                href={item === "Inicio" ? "/" : `/${item.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                className="text-lg font-bold text-slate-800 hover:text-emerald-600 transition-colors"
              >
                {item}
              </Link>
            ))}
          </nav>
        </div>

        {/* Botones de acción móvil (abajo) */}
        <div className="flex flex-col gap-4 mt-auto">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-bold bg-rose-500 text-white shadow-lg hover:bg-rose-600 transition-all cursor-pointer"
            >
              <FaSignOutAlt />
              Cerrar sesión
            </button>
          ) : (
            <>
              <Link
                href="/auth"
                onClick={() => setMenuOpen(false)}
                className="w-full text-center px-6 py-3 rounded-full text-sm font-bold border border-slate-200 text-slate-900 hover:bg-slate-50 transition-all"
              >
                Login
              </Link>

              <Link
                href="/auth"
                onClick={() => setMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-bold bg-[var(--color-primary)] text-black shadow-lg hover:bg-black hover:text-white transition-all"
              >
                <FaUserPlus />
                Crear cuenta
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}