"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

import { BarChart3, TrendingUp, QrCode, Tags, MenuSquare } from "lucide-react";

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
      console.log("No hay tabla de estadísticas aún");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="bg-[var(--bg-card)] border-b border-[var(--border-card)] sticky top-0 z-20 backdrop-blur-md px-5 py-6 md:px-10 md:py-8 mb-6 md:mb-8">
        <div className="max-w-6xl mx-auto flex flex-col items-start gap-3">
          <div className="flex items-center gap-2 text-[var(--text-secondary)] text-xs font-bold uppercase tracking-widest">
            <MenuSquare className="w-4 h-4 text-[var(--text-secondary)]" />
            <span>Estadísticas</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
            Analítica del negocio
          </h1>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* LOADING */}
          {loading ? (
            <p className="text-[var(--text-secondary)]">
              Cargando estadísticas...
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {/* CARD BASE */}
              {[
                {
                  icon: <BarChart3 className="text-[var(--color-primary)]" />,
                  label: "Vistas del menú",
                  value: menuViews,
                  tag: "Total",
                },
                {
                  icon: <TrendingUp className="text-[var(--color-success)]" />,
                  label: "Productos vistos",
                  value: productosViews,
                  tag: "Popular",
                },
                {
                  icon: <QrCode className="text-[var(--color-accent)]" />,
                  label: "Escaneos del QR",
                  value: qrScans,
                  tag: "QR",
                },
                {
                  icon: <Tags className="text-[var(--color-warning)]" />,
                  label: "Categorías visitadas",
                  value: categoriasViews,
                  tag: "Menú",
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-6 hover:bg-[var(--bg-card-hover)] transition"
                >
                  <div className="flex items-center justify-between mb-4">
                    {card.icon}
                    <span className="text-xs text-[var(--text-secondary)]">
                      {card.tag}
                    </span>
                  </div>

                  <h2 className="text-3xl font-bold text-[var(--text-primary)]">
                    {card.value}
                  </h2>

                  <p className="text-sm text-[var(--text-secondary)] mt-1">
                    {card.label}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
