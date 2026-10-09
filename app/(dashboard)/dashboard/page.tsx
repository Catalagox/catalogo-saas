"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { PageHeader } from "@/components/dashboard/PageHeader";
import IndicadorSuscripcion from "@/components/dashboard/principal/IndicadorSuscripcion";
import {
  MenuSquare,
  Package,
  Tags,
  QrCode,
  Palette,
  Image,
  Globe,
  PlusCircle,
  Video,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

type Catalogo = {
  id: string;
  nombre: string;
  slug: string;
  created_at: string;
  plan_vence_el: string | null;
};

export default function DashboardPage() {
  const router = useRouter();

  const [catalogo, setCatalogo] = useState<Catalogo | null>(null);
  const [productosCount, setProductosCount] = useState(0);
  const [categoriasCount, setCategoriasCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const irA = (ruta: string) => {
    router.push(ruta);
  };

  const inicializar = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.replace("/auth?redirect=%2Fdashboard");
        return;
      }

      const { data: catalogoData, error: catalogoError } =
        await supabase
          .from("catalogos")
          .select("id, nombre, slug, created_at, plan_vence_el")
          .eq("user_id", user.id)
          .maybeSingle();

      if (catalogoError) throw catalogoError;

      if (!catalogoData) {
        router.replace("/onboarding?next=%2Fdashboard");
        return;
      }

      setCatalogo(catalogoData);

      const [productosResult, categoriasResult] = await Promise.all([
        supabase
          .from("productos")
          .select("id", { count: "exact", head: true })
          .eq("catalogo_id", catalogoData.id),

        supabase
          .from("categorias")
          .select("id", { count: "exact", head: true })
          .eq("catalogo_id", catalogoData.id),
      ]);

      if (productosResult.error) throw productosResult.error;
      if (categoriasResult.error) throw categoriasResult.error;

      setProductosCount(productosResult.count ?? 0);
      setCategoriasCount(categoriasResult.count ?? 0);
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar el dashboard:", error);

      setErrorMsg(
        "No pudimos cargar la información de tu tienda. Inténtalo nuevamente.",
      );
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const currentUrl = new URL(window.location.href);

    if (currentUrl.searchParams.get("success") === "true") {
      currentUrl.searchParams.delete("success");

      window.history.replaceState(
        window.history.state,
        document.title,
        `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`,
      );
    }

    void inicializar();
  }, [inicializar]);

  if (loading) {
    return (
      <div
        role="status"
        aria-label="Cargando información de tu tienda"
        className="w-full animate-pulse px-4 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-6xl space-y-6 md:space-y-10">
          <div className="h-12 w-full max-w-64 rounded-xl bg-[var(--bg-tertiary)]" />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div
                key={item}
                className="flex h-36 flex-col justify-between rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-5"
              >
                <div className="h-8 w-8 rounded-lg bg-[var(--bg-tertiary)]" />

                <div className="space-y-2">
                  <div className="h-6 w-1/2 rounded bg-[var(--bg-tertiary)]" />
                  <div className="h-3 w-3/4 rounded bg-[var(--bg-tertiary)]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center px-4">
        <div
          role="alert"
          className="w-full max-w-md rounded-2xl border border-red-500/20 bg-[var(--bg-card)] p-8 text-center"
        >
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-[var(--color-danger)]">
            <AlertCircle className="h-6 w-6" />
          </div>

          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            No pudimos cargar tu tienda
          </h2>

          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            {errorMsg}
          </p>

          <button
            type="button"
            onClick={() => void inicializar()}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-3 font-semibold text-[var(--color-text-inverse)] transition hover:bg-[var(--color-primary-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
          >
            <RefreshCw className="h-4 w-4" />
            Volver a intentar
          </button>
        </div>
      </div>
    );
  }

  if (!catalogo) return null;

  const dashboardCards = [
    {
      icon: <PlusCircle className="h-5 w-5" />,
      label: "Acción",
      value: "Crear producto",
      subtext: "Añade un nuevo producto a tu tienda online",
      highlight: true,
      action: () => irA("/dashboard/agregar-producto"),
    },
    {
      icon: <Image className="h-5 w-5" />,
      label: "Marca",
      value: "Subir logo",
      subtext: "Personaliza la imagen y la marca de tu tienda",
      highlight: false,
      action: () => irA("/dashboard/ajustes#logo"),
    },
    {
      icon: <Tags className="h-5 w-5" />,
      label: "Categorías",
      value: categoriasCount,
      subtext: "Crea y organiza las categorías de tus productos",
      highlight: false,
      action: () => irA("/dashboard/categorias"),
    },
    {
      icon: <Package className="h-5 w-5" />,
      label: "Productos",
      value: productosCount,
      subtext: "Edita precios, fotografías, inventario y nombres",
      highlight: false,
      action: () => irA("/dashboard/productos"),
    },
    {
      icon: <QrCode className="h-5 w-5" />,
      label: "Código QR",
      value: "Activo",
      subtext: "Descarga tu código QR y comparte tu tienda",
      highlight: false,
      action: () => irA("/dashboard/qr"),
    },
    {
      icon: <Palette className="h-5 w-5" />,
      label: "Tienda online",
      value: "Personalizar",
      subtext: "Cambia los colores y el diseño de tu tienda",
      highlight: false,
      action: () => irA("/dashboard/tienda-online"),
    },
  ];

  const cardClass =
    "group relative flex w-full cursor-pointer flex-col justify-between space-y-4 rounded-2xl p-5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]";

  const labelClass =
    "text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)] transition-colors group-hover:text-[var(--text-secondary)]";

  return (
    <div className="w-full px-4 text-[var(--text-primary)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6 md:space-y-10">
        <PageHeader
          title="Panel de control"
          category="principal"
          icon={MenuSquare}
          showBackButton={false}
        >
          <IndicadorSuscripcion planVenceEl={catalogo.plan_vence_el} />
        </PageHeader>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {dashboardCards.map((card) => (
            <button
              key={card.label}
              type="button"
              onClick={card.action}
              className={`${cardClass} ${
                card.highlight
                  ? "card-dashboard-highlight"
                  : "card-dashboard"
              }`}
            >
              <div className="flex w-full items-center justify-between gap-3">
                <div
                  className={`shrink-0 rounded-xl p-2.5 transition-all duration-300 group-hover:scale-110 ${
                    card.highlight
                      ? "bg-[var(--color-primary-glow)] text-[var(--text-primary)]"
                      : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] group-hover:bg-[var(--border-soft)] group-hover:text-[var(--text-primary)]"
                  }`}
                >
                  {card.icon}
                </div>

                <span className={labelClass}>{card.label}</span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-[var(--text-primary)]">
                  {card.value}
                </h3>

                <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                  {card.subtext}
                </p>
              </div>
            </button>
          ))}

          {/* Tutorial de YouTube */}
          <a
            href="https://www.youtube.com/watch?v=RV7S4Pz7XZA&t=26s"
            target="_blank"
            rel="noopener noreferrer"
            className={`${cardClass} card-dashboard`}
          >
            <div className="flex w-full items-center justify-between gap-3">
              <div className="shrink-0 rounded-xl bg-[var(--bg-tertiary)] p-2.5 text-[var(--text-secondary)] transition-all duration-300 group-hover:scale-110 group-hover:bg-red-500/10 group-hover:text-[var(--color-danger)]">
                <Video className="h-5 w-5" />
              </div>

              <span className={labelClass}>Tutorial</span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[var(--text-primary)]">
                Ver video
              </h3>

              <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                Aprende a configurar tu tienda online en pocos minutos
              </p>
            </div>
          </a>

          {/* Tienda pública */}
          <a
            href={`/${catalogo.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`${cardClass} card-dashboard-highlight`}
          >
            <div className="flex w-full items-center justify-between gap-3">
              <div className="shrink-0 rounded-xl bg-[var(--color-primary-glow)] p-2.5 text-[var(--text-primary)] transition-all duration-300 group-hover:scale-110">
                <Globe className="h-5 w-5" />
              </div>

              <span className={labelClass}>Tienda pública</span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[var(--text-primary)]">
                Ver online
              </h3>

              <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                Mira cómo ven tu tienda online los clientes
              </p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}