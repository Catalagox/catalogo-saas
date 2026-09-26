"use client";

import { useCallback, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import TiendaLista from "@/components/public/TiendaLista";
import TiendaGaleria from "@/components/public/TiendaGaleria";
import CategoriasSlider from "@/components/public/CategoriasSlider";

interface Producto {
  id: string;
  nombre: string;
  descripcion?: string | null;
  precio: number;
  imagen_url?: string | null;
  disponible?: boolean | null;
  stock?: number | null;
  slug: string;
}

interface Categoria {
  id: string;
  nombre: string;
  productos: Producto[];
}

interface Tienda {
  id: string;
  nombre: string;
  user_id: string;
  estilo_menu?: "lista" | "galeria";
  pais_code?: string;
  color_fondo?: string;
  color_header?: string;
  color_text_header?: string;
  color_border_header?: string;
  color_fondo_categoria?: string;
  color_texto_categoria?: string;
  color_border_categoria?: string;
}

interface TiendaClientProps {
  catalogo: Tienda | null;
  categorias: Categoria[];
  countryCode?: string;
  rutaBase: string;
}

export default function TiendaClient({
  catalogo: tienda,
  categorias,
  countryCode,
  rutaBase,
}: TiendaClientProps) {
  const categoriasVisitadas = useRef<Set<string>>(new Set());

  const registrarVistaCategoria = useCallback(
    async (categoriaId: string) => {
      if (!tienda?.user_id || categoriasVisitadas.current.has(categoriaId)) return;
      categoriasVisitadas.current.add(categoriaId);

      const { error } = await supabase.from("estadisticas").insert({
        user_id: tienda.user_id,
        tipo: "categoria_view",
      });

      if (error) console.error("Error registrando vista de categoría:", error);
    },
    [tienda?.user_id],
  );

  if (!tienda) {
    return (
      <div className="mx-auto min-h-screen w-full max-w-2xl animate-pulse space-y-6 p-4">
        <div className="h-32 w-full rounded-2xl bg-gray-800/50" />
        <div className="flex gap-2 overflow-hidden">
          <div className="h-8 w-24 shrink-0 rounded-full bg-gray-800/50" />
          <div className="h-8 w-24 shrink-0 rounded-full bg-gray-800/50" />
          <div className="h-8 w-24 shrink-0 rounded-full bg-gray-800/50" />
        </div>
        <div className="space-y-4 pt-4">
          <div className="h-24 w-full rounded-xl bg-gray-800/40" />
          <div className="h-24 w-full rounded-xl bg-gray-800/40" />
          <div className="h-24 w-full rounded-xl bg-gray-800/40" />
        </div>
      </div>
    );
  }

  const categoriasSeguras = Array.isArray(categorias) ? categorias : [];
  const paisTienda = countryCode ?? tienda.pais_code ?? "PE";
  const colorFondoCategoria = tienda.color_fondo_categoria ?? "#ffffff";
  const colorTextoCategoria = tienda.color_texto_categoria ?? "#111827";
  const colorBordeCategoria = tienda.color_border_categoria ?? "#e5e7eb";
  const colorHeader = tienda.color_header ?? "#2c2c2c";
  const colorTextoHeader = tienda.color_text_header ?? "#ffffff";
  const colorBordeHeader =
    tienda.color_border_header ?? "rgba(255,255,255,0.1)";

  return (
    <>
      <CategoriasSlider
        categorias={categoriasSeguras}
        onTrackCategoria={registrarVistaCategoria}
        colorFondoCategoria={colorFondoCategoria}
        colorTextoCategoria={colorTextoCategoria}
        colorBorderCategoria={colorBordeCategoria}
        colorHeader={colorHeader}
        colorTextHeader={colorTextoHeader}
        colorBorderHeader={colorBordeHeader}
      />

      <main className="mx-auto mb-0 w-full max-w-7xl flex-grow px-0 pb-0 pt-8 sm:px-6 lg:px-8">
        {tienda.estilo_menu === "galeria" ? (
          <TiendaGaleria
            categorias={categoriasSeguras}
            rutaBase={rutaBase}
            countryCode={paisTienda}
            colorFondoCategoria={colorFondoCategoria}
            colorTextoCategoria={colorTextoCategoria}
            colorBorderCategoria={colorBordeCategoria}
          />
        ) : (
          <TiendaLista
            categorias={categoriasSeguras}
            countryCode={paisTienda}
            rutaBase={rutaBase}
            colorFondoCategoria={colorFondoCategoria}
            colorTextoCategoria={colorTextoCategoria}
            colorBorderCategoria={colorBordeCategoria}
          />
        )}
      </main>
    </>
  );
}
