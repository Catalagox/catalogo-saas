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

  // Forzamos que el header sea completamente sólido si el menú móvil está abierto
  const headerSolid = !isHome || scrolled || menuOpen;

  const textColor = headerSolid ? "text-slate-900" : "text-white";

  const navHoverColor = headerSolid
    ? "hover:text-emerald-600"
    : "hover:text-[var(--color-primary)]";

  return (
    <header
      className={`${
        isHome ? "fixed" : "sticky"
      } top-0 w-full z-[100] transition-all duration-300 border-b ${
        headerSolid
          ? "bg-white border-gray-300 py-0.5 shadow-md" // RECORTE HACIA ABAJO (Antes py-3)
          : "bg-transparent border-white/20 py-1"    // RECORTE HACIA ABAJO (Antes py-6)
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 relative z-[120]">
        
        {/* LOGO (Se oculta suavemente al abrir el menú de hamburguesa) */}
        <div className={`transition-opacity duration-300 ${menuOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
          <Logo scrolled={headerSolid} size="md" />
        </div>

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
              className="flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold bg-rose-500 text-white shadow-lg shadow-rose-500/20 hover:bg-rose-600 transition-all active:scale-95 cursor-pointer"
            >
              <FaSignOutAlt />
              Cerrar sesión
            </button>
          ) : (
            <>
              <Link
                href="/auth"
                className={`
                  px-6 py-2 rounded-full text-sm font-bold transition-all border
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
                className="flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold bg-[var(--color-primary)] text-black shadow-lg shadow-emerald-500/20 hover:bg-white transition-all active:scale-95"
              >
                <FaUserPlus />
                Crear cuenta
              </Link>
            </>
          )}
        </div>

        {/* HAMBURGER BUTTON */}
        <button
          className={`md:hidden p-2 rounded-xl transition-all active:scale-90 z-[130] cursor-pointer shadow-sm ${
            menuOpen
              ? "bg-slate-900 text-white hover:bg-slate-800"
              : headerSolid
              ? "bg-slate-100 text-slate-900 hover:bg-slate-200"
              : "bg-white/20 text-white backdrop-blur-md hover:bg-white/30"
          }`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
        </button>
      </div>

      {/* OVERLAY MOBILE */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden z-[105] ${
          menuOpen ? "opacity-100 block" : "opacity-0 hidden"
        }`}
      />

      {/* SIDE MENU MOBILE */}
      <div
        className={`fixed top-0 right-0 h-screen w-[80%] max-w-sm bg-white p-8 shadow-2xl flex flex-col justify-between transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] md:hidden z-[110] ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="relative z-[120]">
          {/* Espaciador superior alineado al nuevo tamaño */}
          <div className="flex justify-end mb-8 h-10" />

          {/* Navegación móvil */}
          <nav className="flex flex-col gap-6">
            {["Inicio", "Contacto", "Suscripcion"].map((item) => (
              <Link
                key={item}
                href={item === "Inicio" ? "/" : `/${item.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                className="text-xl font-extrabold text-slate-900 hover:text-emerald-600 transition-colors block py-2"
              >
                {item}
              </Link>
            ))}
          </nav>
        </div>

        {/* Botones de acción móvil (abajo) */}
        <div className="flex flex-col gap-4 mt-auto relative z-[120]">
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
                className="w-full text-center px-6 py-3 rounded-full text-sm font-bold border border-slate-300 text-slate-900 bg-slate-50 hover:bg-slate-100 transition-all"
              >
                Login
              </Link>

              <Link
                href="/auth"
                onClick={() => setMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-bold bg-[var(--color-primary)] text-black shadow-lg hover:bg-slate-900 hover:text-white transition-all"
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