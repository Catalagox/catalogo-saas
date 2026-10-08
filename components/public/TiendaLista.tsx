"use client";

import { useMemo, type CSSProperties } from "react";

import CategoriaSection from "@/components/public/CategoriaSection";
import HeaderCategoria from "@/components/public/HeaderCategoria";

import type { CategoriaTienda } from "@/lib/tienda-diseno/types";

interface TiendaListaProps {
  categorias: CategoriaTienda[];
  countryCode?: string;
  rutaBase: string;
  colorFondoCategoria?: string;
  colorTextoCategoria?: string;
  colorBorderCategoria?: string;
}

type EstiloCategoria = CSSProperties & {
  "--color-border-categoria": string;
};

export default function TiendaLista({
  categorias,
  countryCode = "PE",
  rutaBase,
  colorFondoCategoria,
  colorTextoCategoria,
  colorBorderCategoria,
}: TiendaListaProps) {
  const categoriasProcesadas = useMemo(() => {
    if (!Array.isArray(categorias)) return [];

    return categorias
      .filter(
        (categoria) =>
          Boolean(categoria) &&
          Boolean(categoria.id) &&
          Boolean(categoria.nombre?.trim()),
      )
      .map((categoria) => {
        const productosValidos = Array.isArray(categoria.productos)
          ? categoria.productos.filter(
              (producto) =>
                Boolean(producto) &&
                Boolean(producto.id) &&
                Boolean(producto.nombre?.trim()) &&
                Boolean(producto.slug?.trim()),
            )
          : [];

        return {
          ...categoria,
          productosValidos,
        };
      })
      .filter((categoria) => categoria.productosValidos.length > 0);
  }, [categorias]);

  const fondoCategoria =
    colorFondoCategoria?.trim() ||
    "var(--color-fondo-categoria, #ffffff)";

  const bordeCategoria =
    colorBorderCategoria?.trim() ||
    "var(--color-border-categoria, #e5e7eb)";

  const estiloCategoria: EstiloCategoria = {
    backgroundColor: fondoCategoria,
    borderColor: bordeCategoria,
    "--color-border-categoria": bordeCategoria,
  };

  if (categoriasProcesadas.length === 0) {
    return (
      <div
        className="rounded-2xl border border-dashed px-6 py-20 text-center text-[var(--color-text)]"
        style={{
          backgroundColor: fondoCategoria,
          borderColor: bordeCategoria,
        }}
      >
        <div className="space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-black/5">
            <span aria-hidden="true" className="text-2xl">
              🛍️
            </span>
          </div>

          <p className="leading-relaxed opacity-70">
            Esta tienda todavía no tiene productos disponibles.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex min-w-0 flex-col pb-16"
      style={{
        gap: "var(--tienda-section-gap, 32px)",
      }}
    >
      {categoriasProcesadas.map((categoria, indiceCategoria) => {
        const idEncabezado = `cat-header-${categoria.id}`;

        return (
          <section
            key={categoria.id}
            id={`cat-${categoria.id}`}
            aria-labelledby={idEncabezado}
            className="min-w-0 scroll-mt-24 px-2 sm:px-6"
          >
            <HeaderCategoria
              id={idEncabezado}
              nombre={categoria.nombre}
              totalProductos={categoria.productosValidos.length}
              colorTextoCategoria={colorTextoCategoria}
            />

            <div
              className="min-w-0 rounded-2xl border p-3 sm:p-4"
              style={estiloCategoria}
            >
              <CategoriaSection
                categoria={{
                  id: categoria.id,
                  nombre: categoria.nombre,
                  productos: categoria.productosValidos,
                }}
                countryCode={countryCode}
                rutaBase={rutaBase}
                isFirstCategory={indiceCategoria === 0}
              />
            </div>
          </section>
        );
      })}
    </div>
  );
}