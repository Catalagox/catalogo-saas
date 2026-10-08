"use client";

import { useId, useMemo } from "react";

import ProductoCard from "@/components/public/ProductoCard";

import type {
  CategoriaTienda,
  ConfigDestacados,
  ProductoTienda,
} from "@/lib/tienda-diseno/types";

interface ProductosDestacadosProps {
  categorias: CategoriaTienda[];
  config: ConfigDestacados;
  countryCode: string;
  rutaBase: string;
}

export default function ProductosDestacados({
  categorias,
  config,
  countryCode,
  rutaBase,
}: ProductosDestacadosProps) {
  const tituloId = useId();

  const productos = useMemo(() => {
    const productosPorId = new Map<string, ProductoTienda>();

    for (const categoria of categorias) {
      for (const producto of categoria.productos) {
        if (
          producto.disponible === false ||
          !producto.nombre?.trim() ||
          !producto.slug?.trim() ||
          !Number.isFinite(producto.precio) ||
          producto.precio < 0
        ) {
          continue;
        }

        productosPorId.set(producto.id.toLowerCase(), producto);
      }
    }

    const seleccionados: ProductoTienda[] = [];
    const agregados = new Set<string>();

    for (const id of config.producto_ids) {
      const clave = id.toLowerCase();
      const producto = productosPorId.get(clave);

      if (!producto || agregados.has(clave)) continue;

      seleccionados.push(producto);
      agregados.add(clave);

      if (seleccionados.length === 12) break;
    }

    return seleccionados;
  }, [categorias, config.producto_ids]);

  if (productos.length === 0) return null;

  return (
    <section
      data-editor-section="destacados"
      aria-labelledby={tituloId}
      className="mx-auto w-full min-w-0 px-4 sm:px-6 lg:px-8"
      style={{
        maxWidth: "var(--tienda-content-width, 1280px)",
        paddingTop: "var(--tienda-section-gap, 32px)",
        paddingBottom: "var(--tienda-section-gap, 32px)",
      }}
    >
      <h2
        id={tituloId}
        className="mb-6 break-words font-bold leading-tight tracking-tight text-[var(--color-text)]"
        style={{
          fontSize: "var(--tienda-title-size, 32px)",
        }}
      >
        {config.titulo}
      </h2>

      <div
        className="grid min-w-0 grid-cols-1 md:grid-cols-2"
        style={{
          gap: "var(--tienda-product-gap, 24px)",
        }}
      >
        {productos.map((producto) => (
          <ProductoCard
            key={producto.id}
            producto={producto}
            countryCode={countryCode}
            rutaBase={rutaBase}
          />
        ))}
      </div>
    </section>
  );
}