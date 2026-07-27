"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { BarChart3, TrendingUp, QrCode, Tags } from "lucide-react";

export default function EstadisticasPage() {
  const [loading, setLoading] = useState(true);

  const [menuViews, setMenuViews] = useState(0);
  const [productosViews, setProductosViews] = useState(0);
  const [qrScans, setQrScans] = useState(0);
  const [categoriasViews, setCategoriasViews] = useState(0);

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    try {
      const { count: menu } = await supabase
        .from("estadisticas")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("tipo", "menu_view");

      const { count: productos } = await supabase
        .from("estadisticas")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("tipo", "producto_view");

      const { count: qr } = await supabase
        .from("estadisticas")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("tipo", "qr_scan");

      const { count: categorias } = await supabase
        .from("estadisticas")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("tipo", "categoria_view");

      setMenuViews(menu || 0);
      setProductosViews(productos || 0);
      setQrScans(qr || 0);
      setCategoriasViews(categorias || 0);
    } catch (error) {
      console.log("No hay tabla de estadísticas aún", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* HEADER REUTILIZABLE */}
      <PageHeader
        title="Analítica del negocio"
        category="Estadísticas"
        icon={BarChart3}
        showBackButton={true}
      />

      {/* CONTENIDO PRINCIPAL */}
      {loading ? (
        <div className="flex justify-center items-center py-20 text-[var(--text-secondary)] font-medium">
          Cargando estadísticas...
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: <BarChart3 className="w-6 h-6 text-[var(--color-primary)]" />,
              label: "Vistas del catálogo",
              value: menuViews,
              tag: "Total",
            },
            {
              icon: <TrendingUp className="w-6 h-6 text-[var(--color-success)]" />,
              label: "Productos vistos",
              value: productosViews,
              tag: "Popular",
            },
            {
              icon: <QrCode className="w-6 h-6 text-[var(--color-accent)]" />,
              label: "Escaneos del QR",
              value: qrScans,
              tag: "QR",
            },
            {
              icon: <Tags className="w-6 h-6 text-[var(--color-warning)]" />,
              label: "Categorías visitadas",
              value: categoriasViews,
              tag: "Menú",
            },
          ].map((card, i) => (
            <div
              key={i}
              className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-6 hover:bg-[var(--bg-card-hover)] transition-all shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                {card.icon}
                <span className="text-xs text-[var(--text-secondary)] font-semibold uppercase tracking-wider">
                  {card.tag}
                </span>
              </div>

              <h2 className="text-3xl font-extrabold text-[var(--text-primary)]">
                {card.value}
              </h2>

              <p className="text-sm text-[var(--text-secondary)] mt-1 font-medium">
                {card.label}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}