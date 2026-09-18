"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Logo from "@/components/marketing/ui/Logo";

import {
  FaBars,
  FaTimes,
  FaUserPlus,
  FaSignOutAlt,
  FaTachometerAlt,
  FaHome,
  FaEnvelope,
  FaCreditCard,
  FaSignInAlt,
} from "react-icons/fa";

const NAVIGATION_ITEMS = [
  {
    label: "Inicio",
    href: "/",
    icon: FaHome,
  },
  {
    label: "Contacto",
    href: "/contacto",
    icon: FaEnvelope,
  },
  {
    label: "Suscripción",
    href: "/suscripcion",
    icon: FaCreditCard,
  },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const isHome = pathname === "/";

  // El header tendrá fondo sólido cuando:
  // 1. No estamos en Inicio.
  // 2. El usuario hizo scroll.
  // 3. El menú responsive está abierto.
  const headerSolid = !isHome || scrolled || menuOpen;

  // ---------------------------------------------------------
  // AUTENTICACIÓN
  // ---------------------------------------------------------
  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (isMounted) {
        setIsLoggedIn(Boolean(session?.user));
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setIsLoggedIn(Boolean(session?.user));
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // ---------------------------------------------------------
  // DETECTAR SCROLL
  // ---------------------------------------------------------
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // ---------------------------------------------------------
  // CERRAR MENÚ AL CAMBIAR DE PÁGINA
  // ---------------------------------------------------------
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // ---------------------------------------------------------
  // CERRAR MENÚ AL LLEGAR A 1024PX
  // ---------------------------------------------------------
  useEffect(() => {
    const desktopMediaQuery = window.matchMedia("(min-width: 1024px)");

    const handleDesktopChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setMenuOpen(false);
      }
    };

    desktopMediaQuery.addEventListener("change", handleDesktopChange);

    return () => {
      desktopMediaQuery.removeEventListener("change", handleDesktopChange);
    };
  }, []);

  // ---------------------------------------------------------
  // BLOQUEAR SCROLL CUANDO EL MENÚ ESTÁ ABIERTO
  // ---------------------------------------------------------
  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  // ---------------------------------------------------------
  // CERRAR MENÚ CON ESCAPE
  // ---------------------------------------------------------
  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  // ---------------------------------------------------------
  // CERRAR SESIÓN
  // ---------------------------------------------------------
  const handleLogout = async () => {
    setMenuOpen(false);

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Error al cerrar sesión:", error);
        return;
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Error inesperado al cerrar sesión:", error);
    }
  };

  return (
  <header
  className={`
    ${isHome ? "fixed" : "sticky"}
    left-0
    top-0
    z-[100]
    w-full
    border-b
    transition-all
    duration-300

    max-[480px]:border-gray-300

    ${
      headerSolid
        ? `
          border-gray-200
          bg-[var(--marketing-bg-white)]
          py-2
          shadow-sm
        `
        : `
          border-white/10
          bg-transparent
          py-3
        `
    }
  `}
>
      {/* =====================================================
          BARRA PRINCIPAL
      ====================================================== */}
      <div
        className="
          relative
          z-[100]
          mx-auto
          flex
          w-full
          max-w-7xl
          items-center
          justify-between
          px-4
          sm:px-6
          lg:px-8
        "
      >
        {/* LOGO PRINCIPAL */}
        <div className="flex min-w-0 shrink items-center max-w-full">
          <Logo scrolled={true} size="md" />
        </div>

        {/* ===================================================
    NAVEGACIÓN DESKTOP
    Visible desde 1024px
==================================================== */}
        <nav
          aria-label="Navegación principal"
          className="
    hidden
    items-center
    gap-5
    text-sm
    font-bold
    lg:flex
    xl:gap-8
  "
        >
          {NAVIGATION_ITEMS.map((item) => {
            const Icon = item.icon;

            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className="
          group
          relative
          flex
          items-center
          gap-2
          py-2
          text-[var(--marketing-text-dark)]
          transition-colors
          duration-200
          hover:text-[var(--marketing-nav-hover)]
        "
              >
                <Icon aria-hidden="true" className="shrink-0 text-base" />

                <span>{item.label}</span>

                <span
                  aria-hidden="true"
                  className={`
            absolute
            bottom-0
            left-0
            h-[2px]
            bg-[var(--marketing-nav-hover)]
            transition-all
            duration-300
            ${isActive ? "w-full" : "w-0 group-hover:w-full"}
          `}
                />
              </Link>
            );
          })}
        </nav>

        {/* ===================================================
            BOTONES DESKTOP
            Visibles desde 1024px
        ==================================================== */}
        <div className="hidden items-center gap-3 lg:flex">
          {isLoggedIn ? (
            <>
              <Link
                href="/dashboard"
                className="
                  flex
                  items-center
                  gap-2
                  whitespace-nowrap
                  rounded-full
                  bg-[var(--marketing-primary)]
                  px-5
                  py-2.5
                  text-sm
                  font-bold
                  text-[var(--marketing-text-dark)]
                  shadow-lg
                  shadow-black/10
                  transition-all
                  hover:-translate-y-0.5
                  hover:brightness-95
                  active:scale-95
                "
              >
                <FaTachometerAlt aria-hidden="true" />

                <span>Mi panel</span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="
                  flex
                  cursor-pointer
                  items-center
                  gap-2
                  whitespace-nowrap
                  rounded-full
                  bg-rose-500/10
                  px-5
                  py-2.5
                  text-sm
                  font-bold
                  text-rose-600
                  transition-all
                  hover:bg-rose-500
                  hover:text-white
                  active:scale-95
                "
              >
                <FaSignOutAlt aria-hidden="true" />

                <span>Salir</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth"
                className="
    flex
    items-center
    gap-2
    whitespace-nowrap
    rounded-full
    border
    border-black/15
    bg-[var(--marketing-bg-white)]/80
    px-5
    py-2.5
    text-sm
    font-bold
    text-[var(--marketing-text-dark)]
    backdrop-blur-md
    transition-all
    duration-200
    hover:border-[var(--marketing-nav-hover)]
    hover:bg-[var(--marketing-bg-white)]
    hover:text-[var(--marketing-nav-hover)]
    hover:shadow-md
    active:scale-95
  "
              >
                <FaSignInAlt aria-hidden="true" />

                <span>Ingresar</span>
              </Link>

              <Link
                href="/auth"
                className="
                  flex
                  items-center
                  gap-2
                  whitespace-nowrap
                  rounded-full
                  bg-[var(--marketing-text-dark)]
                  px-5
                  py-2.5
                  text-sm
                  font-bold
                  text-[var(--marketing-bg-white)]
                  shadow-lg
                  shadow-black/20
                  transition-all
                  hover:-translate-y-0.5
                  hover:bg-black
                  active:scale-95
                "
              >
                <FaUserPlus aria-hidden="true" />

                <span>Crear tienda</span>
              </Link>
            </>
          )}
        </div>

        {/* ===================================================
            BOTÓN HAMBURGUESA
            Visible hasta 1023px
        ==================================================== */}
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
          aria-controls="responsive-navigation"
          className="
            flex
            h-11
            w-11
            shrink-0
            cursor-pointer
            items-center
            justify-center
            rounded-xl
            border
            border-black/10
            bg-[var(--marketing-bg-white)]
            text-[var(--marketing-text-dark)]
            shadow-sm
            transition-all
            hover:border-[var(--marketing-primary)]/40
            hover:bg-gray-100
            active:scale-90
            lg:hidden
          "
        >
          <FaBars aria-hidden="true" className="text-xl" />
        </button>
      </div>

      {/* =====================================================
          OVERLAY RESPONSIVE
      ====================================================== */}
      <div
        aria-hidden="true"
        onClick={() => setMenuOpen(false)}
        className={`
          fixed
          inset-0
          z-[105]
          bg-black/55
          backdrop-blur-[2px]
          transition-all
          duration-300
          lg:hidden
          ${
            menuOpen
              ? "pointer-events-auto visible opacity-100"
              : "pointer-events-none invisible opacity-0"
          }
        `}
      />

      {/* =====================================================
          MENÚ LATERAL RESPONSIVE
      ====================================================== */}
      <aside
        id="responsive-navigation"
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        aria-hidden={!menuOpen}
        className={`
          fixed
          right-0
          top-0
          z-[110]
          flex
          h-dvh
          w-[88%]
          max-w-[390px]
          flex-col
          overflow-hidden
          bg-[var(--marketing-bg-white)]
          shadow-2xl
          transition-transform
          duration-500
          ease-[cubic-bezier(0.32,0.72,0,1)]
          sm:w-[78%]
          md:w-[55%]
          lg:hidden
          ${menuOpen ? "translate-x-0" : "pointer-events-none translate-x-full"}
        `}
      >
        {/* ENCABEZADO DEL MENÚ */}
        <div
          className="
            flex
            shrink-0
            items-center
            justify-between
            gap-4
            border-b
            border-black/10
            px-5
            pb-4
            pt-[max(1rem,env(safe-area-inset-top))]
            sm:px-6
          "
        >
          {/* LOGO DENTRO DEL MENÚ */}
          <div
            onClick={() => setMenuOpen(false)}
            className="
    flex
    min-w-0
    items-center
    transition-opacity
    hover:opacity-90
  "
          >
            <Logo scrolled={true} size="md" />
          </div>

          {/* BOTÓN CERRAR */}
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Cerrar menú"
            className="
              flex
              h-11
              w-11
              shrink-0
              cursor-pointer
              items-center
              justify-center
              rounded-xl
              border
              border-black/10
              bg-black/[0.04]
              text-[var(--marketing-text-dark)]
              transition-all
              hover:bg-black/[0.08]
              active:scale-90
            "
          >
            <FaTimes aria-hidden="true" className="text-xl" />
          </button>
        </div>

        {/* CONTENIDO CON SCROLL */}
        <div
          className="
            flex
            min-h-0
            flex-1
            flex-col
            overflow-y-auto
            overscroll-contain
            px-5
            pb-[max(1.5rem,env(safe-area-inset-bottom))]
            pt-6
            sm:px-6
          "
        >
          {/* NAVEGACIÓN RESPONSIVE */}
          <div>
            <p
              className="
                mb-4
                text-xs
                font-bold
                uppercase
                tracking-[0.18em]
                text-[var(--marketing-text-dark)]/50
              "
            >
              Navegación
            </p>

            <nav
              aria-label="Navegación responsive"
              className="flex flex-col gap-2"
            >
              {NAVIGATION_ITEMS.map((item) => {
                const Icon = item.icon;

                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={`
                      flex
                      min-h-14
                      items-center
                      gap-4
                      rounded-2xl
                      px-3
                      py-2.5
                      text-base
                      font-extrabold
                      transition-all
                      active:scale-[0.98]
                      sm:px-4
                      sm:py-3
                      ${
                        isActive
                          ? `
                            bg-[var(--marketing-primary)]
                            text-[var(--marketing-text-dark)]
                          `
                          : `
                            text-[var(--marketing-text-dark)]
                            hover:bg-black/5
                            hover:text-[var(--marketing-primary)]
                          `
                      }
                    `}
                  >
                    <span
                      className={`
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        transition-colors
                        ${
                          isActive
                            ? "bg-[var(--marketing-bg-white)]/55"
                            : "bg-black/5"
                        }
                      `}
                    >
                      <Icon aria-hidden="true" className="text-lg" />
                    </span>

                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* SEPARADOR FLEXIBLE */}
          <div className="min-h-8 flex-1" />

          {/* BOTONES RESPONSIVE */}
          <div
            className="
              mt-6
              flex
              shrink-0
              flex-col
              gap-3
              border-t
              border-black/10
              pt-6
            "
          >
            {isLoggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="
                    flex
                    min-h-12
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-[var(--marketing-primary)]
                    px-6
                    py-3.5
                    text-sm
                    font-bold
                    text-[var(--marketing-text-dark)]
                    shadow-lg
                    shadow-black/10
                    transition-all
                    hover:brightness-95
                    active:scale-95
                  "
                >
                  <FaTachometerAlt aria-hidden="true" />

                  <span>Ir a mi panel</span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    flex
                    min-h-12
                    w-full
                    cursor-pointer
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-rose-50
                    px-6
                    py-3.5
                    text-sm
                    font-bold
                    text-rose-600
                    transition-all
                    hover:bg-rose-100
                    active:scale-95
                  "
                >
                  <FaSignOutAlt aria-hidden="true" />

                  <span>Cerrar sesión</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth"
                  onClick={() => setMenuOpen(false)}
                  className="
                    flex
                    min-h-12
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-black/15
                    bg-black/[0.03]
                    px-6
                    py-3.5
                    text-sm
                    font-bold
                    text-[var(--marketing-text-dark)]
                    transition-all
                    hover:border-[var(--marketing-primary)]/40
                    hover:bg-black/[0.06]
                    active:scale-95
                  "
                >
                  <FaSignInAlt aria-hidden="true" />

                  <span>Iniciar sesión</span>
                </Link>

                <Link
                  href="/auth"
                  onClick={() => setMenuOpen(false)}
                  className="
                    flex
                    min-h-12
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-[var(--marketing-text-dark)]
                    px-6
                    py-3.5
                    text-sm
                    font-bold
                    text-[var(--marketing-bg-white)]
                    shadow-lg
                    shadow-black/20
                    transition-all
                    hover:bg-black
                    active:scale-95
                  "
                >
                  <FaUserPlus aria-hidden="true" />

                  <span>Crear tienda gratis</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </aside>
    </header>
  );
}
