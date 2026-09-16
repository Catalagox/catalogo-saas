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
  // 3. El menú móvil está abierto.
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

    // Comprueba la posición inicial.
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
      <div
        className="
          relative
          z-[120]
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
        {/* LOGO */}
        <div className="flex shrink-0 items-center">
          <Logo scrolled={true} size="md" />
        </div>

        {/* NAVEGACIÓN DESKTOP */}
        <nav
          aria-label="Navegación principal"
          className="
            hidden
            items-center
            gap-6
            text-sm
            font-bold
            text-[var(--marketing-text-dark)]
            md:flex
            lg:gap-8
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
                className={`
                  group
                  relative
                  flex
                  items-center
                  gap-2
                  py-2
                  text-[var(--marketing-text-dark)]
                  transition-colors
                  hover:text-[var(--marketing-primary)]
                  ${
                    isActive
                      ? "text-[var(--marketing-primary)]"
                      : ""
                  }
                `}
              >
                <Icon
                  aria-hidden="true"
                  className="shrink-0 text-base"
                />

                <span>{item.label}</span>

                <span
                  className={`
                    absolute
                    bottom-0
                    left-0
                    h-[2px]
                    bg-[var(--marketing-primary)]
                    transition-all
                    duration-300
                    ${
                      isActive
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }
                  `}
                />
              </Link>
            );
          })}
        </nav>

        {/* BOTONES DESKTOP */}
        <div className="hidden items-center gap-3 md:flex">
          {isLoggedIn ? (
            <>
              <Link
                href="/admin"
                className="
                  flex
                  items-center
                  gap-2
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
                  rounded-full
                  bg-rose-500/10
                  px-5
                  py-2.5
                  text-sm
                  font-bold
                  text-rose-600
                  transition-all
                  hover:bg-rose-500
                  hover:text-[var(--marketing-bg-white)]
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
                  hover:border-[var(--marketing-primary)]
                  hover:text-[var(--marketing-primary)]
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

        {/* BOTÓN HAMBURGUESA */}
        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          className="
            z-[130]
            flex
            h-11
            w-11
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
            hover:bg-gray-100
            active:scale-90
            md:hidden
          "
        >
          {menuOpen ? (
            <FaTimes aria-hidden="true" className="text-xl" />
          ) : (
            <FaBars aria-hidden="true" className="text-xl" />
          )}
        </button>
      </div>

      {/* OVERLAY MÓVIL */}
      <div
        aria-hidden="true"
        onClick={() => setMenuOpen(false)}
        className={`
          fixed
          inset-0
          z-[105]
          bg-black/60
          backdrop-blur-sm
          transition-opacity
          duration-300
          md:hidden
          ${
            menuOpen
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }
        `}
      />

      {/* MENÚ MÓVIL */}
      <aside
        id="mobile-navigation"
        aria-hidden={!menuOpen}
        className={`
          fixed
          right-0
          top-0
          z-[110]
          flex
          h-dvh
          w-[88%]
          max-w-sm
          flex-col
          justify-between
          overflow-y-auto
          overscroll-contain
          bg-[var(--marketing-bg-white)]
          px-6
          pb-[max(1.5rem,env(safe-area-inset-bottom))]
          pt-[max(5rem,env(safe-area-inset-top))]
          shadow-2xl
          transition-transform
          duration-500
          ease-[cubic-bezier(0.32,0.72,0,1)]
          md:hidden
          sm:w-[82%]
          sm:px-8
          ${
            menuOpen
              ? "translate-x-0"
              : "translate-x-full"
          }
        `}
      >
        {/* NAVEGACIÓN MÓVIL */}
        <div className="relative z-[120]">
          <p
            className="
              mb-5
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
            aria-label="Navegación móvil"
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
                    px-4
                    py-3
                    text-base
                    font-extrabold
                    text-[var(--marketing-text-dark)]
                    transition-all
                    active:scale-[0.98]
                    ${
                      isActive
                        ? `
                          bg-[var(--marketing-primary)]
                          text-[var(--marketing-text-dark)]
                        `
                        : `
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
                      ${
                        isActive
                          ? "bg-[var(--marketing-bg-white)]/50"
                          : "bg-black/5"
                      }
                    `}
                  >
                    <Icon
                      aria-hidden="true"
                      className="text-lg"
                    />
                  </span>

                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* BOTONES MÓVILES */}
        <div
          className="
            relative
            z-[120]
            mt-10
            flex
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
                href="/admin"
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
      </aside>
    </header>
  );
}
