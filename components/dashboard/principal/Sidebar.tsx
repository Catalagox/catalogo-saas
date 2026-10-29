"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Logo from "@/components/marketing/ui/Logo";
import SelectorTema from "@/components/dashboard/principal/SelectorTema";
import { usePedidosNotificaciones } from "@/components/dashboard/pedidos/PedidosNotificaciones";
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
  FileText,
  ChevronUp,
  CreditCard,
  Crown,
} from "lucide-react";
type EstadoPlan = {
  nombrePlan?: string | null;
  planVenceEl: string | null;
  subscriptionStatus: string | null;
  accesoGratisVenceEl: string | null;
};
type Props = { closeMenu?: () => void; estadoPlan?: EstadoPlan | null };
const links = [
  { name: "Principal", href: "/dashboard", icon: LayoutDashboard },
  {
    name: "Agregar producto",
    href: "/dashboard/agregar-producto",
    icon: PlusCircle,
  },
  { name: "Productos", href: "/dashboard/productos", icon: Package },
  { name: "Pedidos", href: "/dashboard/pedidos", icon: ShoppingBag },
  { name: "Categorías", href: "/dashboard/categorias", icon: Tags },
  { name: "QR del catálogo", href: "/dashboard/qr", icon: QrCode },
  { name: "Tienda online", href: "/dashboard/tienda-online", icon: Palette },
  { name: "Páginas", href: "/dashboard/paginas", icon: FileText },
  { name: "Estadísticas", href: "/dashboard/estadistica", icon: BarChart3 },
  { name: "Ajustes", href: "/dashboard/ajustes", icon: Settings },
  {
    name: "Dominio personalizado",
    href: "/dashboard/ajustes/dominios",
    icon: Globe2,
  },
  { name: "Ayuda", href: "/contacto", icon: HelpCircle },
  { name: "Ver planes y precios", href: "/suscripcion", icon: Crown },
];
export default function Sidebar({ closeMenu, estadoPlan }: Props) {
  const pathname = usePathname();
  const notificaciones = usePedidosNotificaciones();
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [ahora, setAhora] = useState<number | null>(null);
  const [temaAbierto, setTemaAbierto] = useState(false);
  const [cuentaAbierta, setCuentaAbierta] = useState(false);
  const [cerrando, setCerrando] = useState(false);
  const [errorSesion, setErrorSesion] = useState("");
  const cuentaRef = useRef<HTMLDivElement>(null);
  const botonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const pedidosNuevos = notificaciones?.pedidosNuevos ?? 0;
  useEffect(() => {
    let activo = true;
    void (async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        if (error) throw error;
        if (!activo || !user) return;
        setUserEmail(user.email || "");
        setUserName(
          user.user_metadata?.name || user.user_metadata?.full_name || "",
        );
      } catch (error) {
        console.error("Error cargando el usuario:", error);
      }
    })();
    return () => {
      activo = false;
    };
  }, []);
  useEffect(() => {
    setAhora(Date.now());
    const intervalo = window.setInterval(() => setAhora(Date.now()), 60_000);
    return () => window.clearInterval(intervalo);
  }, []);
  useEffect(() => {
    setCuentaAbierta(false);
    setTemaAbierto(false);
  }, [pathname]);
  useEffect(() => {
    if (!cuentaAbierta) setTemaAbierto(false);
  }, [cuentaAbierta]);
  useEffect(() => {
    if (!cuentaAbierta) return;
    const cerrarFuera = (event: PointerEvent) => {
      if (!cuentaRef.current?.contains(event.target as Node))
        setCuentaAbierta(false);
    };
    const cerrarConEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        setCuentaAbierta(false);
        botonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", cerrarFuera);
    cuentaRef.current?.addEventListener("keydown", cerrarConEscape);
    const elemento = cuentaRef.current;
    return () => {
      document.removeEventListener("pointerdown", cerrarFuera);
      elemento?.removeEventListener("keydown", cerrarConEscape);
    };
  }, [cuentaAbierta]);
  const navegar = () => {
    setCuentaAbierta(false);
    closeMenu?.();
  };
  const cerrarSesion = async () => {
    if (cerrando) return;
    setCerrando(true);
    setErrorSesion("");
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      closeMenu?.();
      window.location.href = "/";
    } catch (error) {
      console.error("No se pudo cerrar la sesión:", error);
      setErrorSesion("No pudimos cerrar la sesión. Inténtalo nuevamente.");
      setCerrando(false);
    }
  };
  const fechaGratis = estadoPlan?.accesoGratisVenceEl
    ? new Date(estadoPlan.accesoGratisVenceEl).getTime()
    : NaN;
  const fechaPlan = estadoPlan?.planVenceEl
    ? new Date(estadoPlan.planVenceEl).getTime()
    : NaN;
  const accesoGratis =
    ahora !== null && Number.isFinite(fechaGratis) && fechaGratis > ahora;
  // Usa el nombre real si se proporciona; no deduce precio ni periodicidad.
  const nombrePlan =
    estadoPlan?.nombrePlan?.trim() ||
    (accesoGratis
      ? "Acceso gratuito"
      : estadoPlan?.subscriptionStatus === "active"
        ? "Plan de pago"
        : estadoPlan?.subscriptionStatus === "trialing"
          ? "Prueba gratuita"
          : estadoPlan?.subscriptionStatus === "past_due" ||
              estadoPlan?.subscriptionStatus === "canceled"
            ? "Suscripción"
            : ahora !== null && Number.isFinite(fechaPlan) && fechaPlan > ahora
              ? "Prueba gratuita"
              : "Mi plan");
  const itemClass =
    "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-[var(--color-primary)]";
  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden border-r border-[var(--border-card)] bg-[var(--bg-secondary)] text-[var(--text-primary)]">
      <div className="hidden shrink-0 border-b border-[var(--border-card)] px-6 py-5 lg:block">
        <Logo size="md" variant="dashboard" />
      </div>
      <nav
        aria-label="Menú del dashboard"
        className="sidebar-scroll min-h-0 flex-1 space-y-1 overflow-x-hidden overflow-y-auto overscroll-contain px-3 py-4 sm:px-4"
      >
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;
          return (
            

<Link
  key={link.href}
  href={link.href}
  onClick={navegar}
  aria-current={active ? "page" : undefined}
  title={link.name}
  style={
    link.href === "/suscripcion" && !active
      ? {
          backgroundColor: "#F0FDF4",
          color: "#14532D",
          opacity: 1,
        }
      : undefined
  }
  className={`flex min-h-11 items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--color-primary)] ${
    active
      ? "bg-[var(--color-primary)] font-semibold text-[var(--color-text-inverse)]"
      : link.href === "/suscripcion"
        ? "font-extrabold hover:!bg-[#DCFCE7]"
        : "text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]"
  }`}
>
  <Icon
    size={19}
    style={
      link.href === "/suscripcion"
        ? { color: "#15803D", opacity: 1 }
        : undefined
    }
    className="shrink-0"
    aria-hidden="true"
  />

  <span
    className={`min-w-0 truncate ${
      link.href === "/suscripcion" ? "font-extrabold" : ""
    }`}
  >
    {link.name}
  </span>

  {link.href === "/dashboard/pedidos" && pedidosNuevos > 0 && (
    <span
      className="ml-auto inline-flex min-w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 px-1.5 py-0.5 text-xs font-bold text-black"
      aria-label={`${pedidosNuevos} pedidos nuevos`}
    >
      {pedidosNuevos > 99 ? "99+" : pedidosNuevos}
    </span>
  )}
</Link>


          );
        })}
      </nav>
      <div className="shrink-0 border-t border-[var(--border-card)] bg-[var(--bg-secondary)] p-3">
        <div
          ref={cuentaRef}
          className="relative"
          onBlur={(event) => {
            if (
              !event.currentTarget.contains(event.relatedTarget as Node | null)
            )
              setCuentaAbierta(false);
          }}
        >
          <div
            id={panelId}
            aria-label="Opciones de cuenta"
            aria-hidden={!cuentaAbierta}
            inert={!cuentaAbierta}
            className={`cuenta-dropdown absolute bottom-full left-0 right-0 z-20 mb-2 max-h-[min(65dvh,360px)] overflow-y-auto overscroll-contain rounded-2xl border border-[var(--border-card)] p-2 ${cuentaAbierta ? "cuenta-dropdown-abierto" : ""}`}
          >
            <Link
              href="/dashboard/ajustes#suscripcion"
              onClick={navegar}
              className={itemClass}
            >
              <CreditCard size={17} aria-hidden="true" />
              Gestionar plan
            </Link>
            <button
              type="button"
              aria-expanded={temaAbierto}
              aria-controls={`${panelId}-tema`}
              onClick={() => setTemaAbierto((v) => !v)}
              className={itemClass}
            >
              <Palette size={17} aria-hidden="true" />
              Tema del panel
              <ChevronUp
                size={14}
                aria-hidden="true"
                className={`cuenta-flecha ml-auto ${temaAbierto ? "" : "rotate-180"}`}
              />
            </button>
            {temaAbierto && (
              <div id={`${panelId}-tema`} className="px-3 pt-2">
                <SelectorTema />
              </div>
            )}
            <div className="my-1 border-t border-[var(--border-card)]" />
            <button
              type="button"
              onClick={() => void cerrarSesion()}
              disabled={cerrando}
              className={`${itemClass} hover:text-[var(--color-danger)] disabled:opacity-60`}
            >
              <LogOut size={17} aria-hidden="true" />
              {cerrando ? "Cerrando sesión…" : "Cerrar sesión"}
            </button>
            {errorSesion && (
              <p
                role="alert"
                className="px-3 py-2 text-xs text-[var(--color-danger)]"
              >
                {errorSesion}
              </p>
            )}
          </div>
          <button
            ref={botonRef}
            type="button"
            aria-expanded={cuentaAbierta}
            aria-controls={panelId}
            onClick={() => setCuentaAbierta((v) => !v)}
            title={userEmail || userName || "Mi cuenta"}
            className="flex min-h-11 w-full items-center gap-2 rounded-xl px-3 py-2 text-left transition-colors hover:bg-[var(--bg-card-hover)] focus-visible:outline-2 focus-visible:outline-[var(--color-primary)]"
          >
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-semibold">
                {userEmail || userName || "Mi cuenta"}
              </span>
              <span className="truncate text-xs text-[var(--text-secondary)]">
                {nombrePlan}
              </span>
            </span>
            <ChevronUp
              size={17}
              aria-hidden="true"
              className={`cuenta-flecha shrink-0 ${cuentaAbierta ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </div>
      <style>{`
        .cuenta-dropdown {
          background: var(--bg-secondary);
          background: color-mix(in srgb, var(--bg-secondary) 93%, black);
          box-shadow: 0 12px 32px rgba(0, 0, 0, .16), 0 2px 8px rgba(0, 0, 0, .08);
          transform-origin: bottom center;
          opacity: 0;
          transform: translateY(8px) scale(.98);
          visibility: hidden;
          pointer-events: none;
          transition: opacity 200ms ease, transform 220ms cubic-bezier(.2, .8, .2, 1), visibility 0s linear 220ms;
        }
        .dashboard-theme[data-theme="dark"] .cuenta-dropdown {
          background: var(--bg-secondary);
          background: color-mix(in srgb, var(--bg-secondary) 86%, white);
          border-color: rgba(255, 255, 255, .22);
          box-shadow: 0 16px 40px rgba(0, 0, 0, .45), 0 2px 8px rgba(0, 0, 0, .25);
        }
        .dashboard-theme[data-theme="dark"] .cuenta-dropdown a:hover,
        .dashboard-theme[data-theme="dark"] .cuenta-dropdown button:hover {
          background: rgba(255, 255, 255, .08);
        }
        .cuenta-dropdown-abierto {
          opacity: 1;
          transform: translateY(0) scale(1);
          visibility: visible;
          pointer-events: auto;
          transition-delay: 0s;
        }
        .cuenta-flecha {
          transition: transform 220ms cubic-bezier(.2, .8, .2, 1);
        }
        @media (prefers-reduced-motion: reduce) {
          .cuenta-dropdown, .cuenta-flecha { transition: none; }
        }
        .sidebar-scroll { scrollbar-width: thin; scrollbar-color: rgba(148,163,184,.35) transparent; } .sidebar-scroll::-webkit-scrollbar { width: 6px; } .sidebar-scroll::-webkit-scrollbar-track { background: transparent; } .sidebar-scroll::-webkit-scrollbar-thumb { background: rgba(148,163,184,.35); border-radius: 999px; }`}</style>
    </div>
  );
}
