"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

import {
  BarChart3,
  TrendingUp,
  QrCode,
  Tags,
  MenuSquare,
} from "lucide-react";

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
      // 🔥 MENU VIEWS
      const { count: menu } = await supabase
        .from("estadisticas")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("tipo", "menu_view");

      // 🔥 PRODUCTOS VISTOS
      const { count: productos } = await supabase
        .from("estadisticas")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("tipo", "producto_view");

      // 🔥 QR
      const { count: qr } = await supabase
        .from("estadisticas")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("tipo", "qr_scan");

      // 🔥 CATEGORIAS
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

      {/* 🔥 HEADER MODERNO */}
      <div className="bg-gray-900/50 border-b border-gray-800 sticky top-0 z-20 backdrop-blur-md px-5 py-6 md:px-10 md:py-8 mb-6 md:mb-8">
        <div className="max-w-6xl mx-auto flex flex-col items-start text-left gap-3">

          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-widest">
            <MenuSquare className="w-4 h-4" />
            <span>Estadísticas</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Analítica del negocio
          </h1>

        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">

          {/* LOADING */}
          {loading ? (
            <p className="text-gray-400">Cargando estadísticas...</p>
          ) : (

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

              {/* MENU */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:bg-gray-800 transition">
                <div className="flex items-center justify-between mb-4">
                  <BarChart3 className="text-orange-500" />
                  <span className="text-xs text-gray-400">Total</span>
                </div>

                <h2 className="text-3xl font-bold">
                  {menuViews}
                </h2>

                <p className="text-sm text-gray-400 mt-1">
                  Vistas del menú
                </p>
              </div>

              {/* PRODUCTOS */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:bg-gray-800 transition">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="text-green-500" />
                  <span className="text-xs text-gray-400">Popular</span>
                </div>

                <h2 className="text-3xl font-bold">
                  {productosViews}
                </h2>

                <p className="text-sm text-gray-400 mt-1">
                  Productos vistos
                </p>
              </div>

              {/* QR */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:bg-gray-800 transition">
                <div className="flex items-center justify-between mb-4">
                  <QrCode className="text-blue-500" />
                  <span className="text-xs text-gray-400">QR</span>
                </div>

                <h2 className="text-3xl font-bold">
                  {qrScans}
                </h2>

                <p className="text-sm text-gray-400 mt-1">
                  Escaneos del QR
                </p>
              </div>

              {/* CATEGORIAS */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:bg-gray-800 transition">
                <div className="flex items-center justify-between mb-4">
                  <Tags className="text-purple-500" />
                  <span className="text-xs text-gray-400">Menú</span>
                </div>

                <h2 className="text-3xl font-bold">
                  {categoriasViews}
                </h2>

                <p className="text-sm text-gray-400 mt-1">
                  Categorías visitadas
                </p>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}