"use client";

import { useCallback, useRef } from "react";

import { supabase } from "@/lib/supabaseClient";

import TiendaPlantilla from "@/components/public/plantillas/TiendaPlantilla";


import type {
  CategoriaTienda,
  ConfigDiseno,
  PlantillaId,
} from "@/lib/tienda-diseno/types";

interface Tienda {
  id: string;
  nombre: string;
  user_id: string;
  pais_code?: string | null;
}

interface TiendaClientProps {
  catalogo: Tienda | null;
  categorias: CategoriaTienda[];
  plantilla: PlantillaId;
  config: ConfigDiseno;
  countryCode?: string;
  rutaBase: string;
}

export default function TiendaClient({
  catalogo: tienda,
  categorias,
  plantilla,
  config,
  countryCode,
  rutaBase,
}: TiendaClientProps) {
  const visitasRef = useRef<{
    catalogoId: string | null;
    categorias: Set<string>;
  }>({
    catalogoId: null,
    categorias: new Set(),
  });

  const registrarVistaCategoria = useCallback(
    async (categoriaId: string) => {
      if (!tienda?.id || !tienda.user_id) return;

      if (visitasRef.current.catalogoId !== tienda.id) {
        visitasRef.current = {
          catalogoId: tienda.id,
          categorias: new Set(),
        };
      }

      const visitadas = visitasRef.current.categorias;

      if (visitadas.has(categoriaId)) return;

      visitadas.add(categoriaId);

      try {
        const { error } = await supabase
          .from("estadisticas")
          .insert({
            user_id: tienda.user_id,
            tipo: "categoria_view",
          });

        if (error) throw error;
      } catch (error) {
        visitadas.delete(categoriaId);

        console.error(
          "Error registrando vista de categoría:",
          error,
        );
      }
    },
    [tienda?.id, tienda?.user_id],
  );

  if (!tienda) {
    return (
      <div
        role="status"
        aria-label="Cargando tienda"
        className="mx-auto min-h-screen w-full max-w-2xl space-y-6 p-4 motion-safe:animate-pulse"
      >
        <div className="h-32 rounded-2xl bg-neutral-200/50" />

        <div className="flex gap-2 overflow-hidden">
          {[1, 2, 3].map((numero) => (
            <div
              key={numero}
              className="h-8 w-24 shrink-0 rounded-full bg-neutral-200/50"
            />
          ))}
        </div>

        <div className="space-y-4 pt-4">
          {[1, 2, 3].map((numero) => (
            <div
              key={numero}
              className="h-24 rounded-xl bg-neutral-200/40"
            />
          ))}
        </div>
      </div>
    );
  }

  const categoriasSeguras = Array.isArray(categorias)
    ? categorias
    : [];

  const tieneProductos = categoriasSeguras.some(
    (categoria) =>
      Array.isArray(categoria.productos) &&
      categoria.productos.some(
        (producto) =>
          producto.disponible !== false &&
          Boolean(producto.id) &&
          Boolean(producto.nombre?.trim()) &&
          Boolean(producto.slug?.trim()) &&
          Number.isFinite(producto.precio) &&
          producto.precio >= 0,
      ),
  );

  const paisTienda = countryCode ?? tienda.pais_code ?? "PE";

  return (
  <TiendaPlantilla
    plantilla={plantilla}
    config={config}
    categorias={categoriasSeguras}
    countryCode={paisTienda}
    rutaBase={rutaBase}
    onTrackCategoria={registrarVistaCategoria}
  />
);
}