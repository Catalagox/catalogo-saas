"use client";

import {
  useEffect,
  useState,
  type ReactNode,
} from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import Sidebar from "@/components/dashboard/principal/Sidebar";
import Logo from "@/components/marketing/ui/Logo";
import { InstalarAppBanner } from "@/components/dashboard/InstalarAppBanner";
import { NuevaFuncionDominioBanner } from "@/components/dashboard/NuevaFuncionDominioBanner";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [accessError, setAccessError] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let active = true;

    const checkUser = async () => {
      try {
        setAccessError("");

        /*
         * Si vuelve desde Stripe, actualizamos la información
         * y limpiamos el parámetro de la URL.
         */
        if (typeof window !== "undefined") {
          const params = new URLSearchParams(
            window.location.search,
          );

          if (params.get("success") === "true") {
            router.refresh();

            window.history.replaceState(
              {},
              document.title,
              window.location.pathname,
            );
          }
        }

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        /*
         * El proxy ya protege /dashboard.
         * Esta comprobación funciona como segunda capa.
         */
        if (userError || !user) {
          router.replace(
            "/auth?redirect=%2Fdashboard",
          );
          return;
        }

        const {
          data: catalogo,
          error: catalogoError,
        } = await supabase
          .from("catalogos")
          .select(`
            id,
            suscripcion_activa,
            plan_vence_el,
            subscription_status
          `)
          .eq("user_id", user.id)
          .maybeSingle();

        if (catalogoError) {
          throw catalogoError;
        }

        /*
         * Los usuarios que aún no tienen tienda deben
         * completar nombre y país en el onboarding.
         */
        if (!catalogo) {
          router.replace(
            "/onboarding?next=%2Fdashboard",
          );
          return;
        }

        const now = Date.now();

        const trialValido =
          Boolean(catalogo.plan_vence_el) &&
          new Date(
            catalogo.plan_vence_el as string,
          ).getTime() > now;

        const stripeActivo =
          catalogo.subscription_status === "active" ||
          catalogo.subscription_status === "trialing";

        const stripeEnProblema =
          catalogo.subscription_status === "past_due" ||
          catalogo.subscription_status === "canceled";

        if (stripeEnProblema) {
          router.replace("/suscripcion");
          return;
        }

        if (!stripeActivo && !trialValido) {
          router.replace("/suscripcion");
          return;
        }

        if (active) {
          setLoading(false);
        }
      } catch (error) {
        console.error(
          "Error verificando el acceso al dashboard:",
          error,
        );

        if (active) {
          setAccessError(
            "No pudimos verificar el acceso a tu tienda. Revisa tu conexión e inténtalo nuevamente.",
          );
          setLoading(false);
        }
      }
    };

    checkUser();

    return () => {
      active = false;
    };
  }, [router]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[var(--bg-main)]">
        <div className="flex flex-col items-center gap-6">
          <div className="relative h-20 w-20 animate-pulse sm:h-24 sm:w-24">
            <Image
              src="/Logotipo-fondo-trasparente4.png"
              alt="Catalogox"
              fill
              className="object-contain"
              priority
            />
          </div>

          <div className="h-1 w-32 overflow-hidden rounded-full bg-white/10 sm:w-40">
            <div className="h-full w-full animate-pulse bg-emerald-500" />
          </div>
        </div>
      </div>
    );
  }

  if (accessError) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[var(--bg-main)] px-4">
        <div className="w-full max-w-md rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 text-center shadow-2xl">
          <h1 className="text-xl font-bold text-[var(--text-primary)]">
            No pudimos cargar tu tienda
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
            {accessError}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-xl bg-[var(--color-primary)] px-6 py-3 font-semibold text-[var(--color-text-inverse)] transition hover:bg-[var(--color-primary-hover)]"
          >
            Intentar nuevamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[var(--bg-main)] text-white">
      {/* SIDEBAR DESKTOP */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-[var(--border-card)] lg:flex">
        <Sidebar />
      </aside>

      {/* SIDEBAR MOBILE */}
      <div
        className={`
          fixed inset-0 z-50 transition-all duration-300 lg:hidden
          ${open ? "visible" : "invisible"}
        `}
      >
        <button
          type="button"
          aria-label="Cerrar menú"
          className={`
            absolute inset-0 bg-black/70 backdrop-blur-sm
            transition-opacity duration-300
            ${open ? "opacity-100" : "opacity-0"}
          `}
          onClick={() => setOpen(false)}
        />

        <aside
          className={`
            relative flex h-full w-72 max-w-[85vw] flex-col
            border-r border-[var(--border-card)]
            bg-[var(--bg-secondary)] shadow-2xl
            transition-transform duration-300 ease-in-out
            ${open ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <div className="flex items-center justify-between border-b border-[var(--border-card)] px-4 py-4">
            <Logo size="sm" />

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar menú"
              className="rounded-xl p-2 text-[var(--text-secondary)] transition hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <Sidebar closeMenu={() => setOpen(false)} />
          </div>
        </aside>
      </div>

      {/* CONTENIDO */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-[var(--border-card)] bg-[var(--bg-main)]/90 px-4 py-4 backdrop-blur-md lg:hidden">
          <Logo size="sm" />

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Abrir menú"
            className="rounded-xl border border-[var(--border-card)] bg-[var(--bg-secondary)] p-2 transition hover:bg-[var(--bg-card-hover)]"
          >
            <Menu size={20} />
          </button>
        </header>

        <main className="mx-auto w-full max-w-[1600px] flex-1 p-4 md:p-6 lg:p-10">
          <InstalarAppBanner />
          <NuevaFuncionDominioBanner />
          {children}
        </main>
      </div>
    </div>
  );
}