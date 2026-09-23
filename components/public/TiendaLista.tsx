"use client";

import { useMemo } from "react";

import CategoriaSection from "@/components/public/CategoriaSection";
import HeaderCategoria from "@/components/public/HeaderCategoria";

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

interface TiendaListaProps {
  categorias: Categoria[];
  countryCode?: string;

  /*
   * En Catalagox:
   * "/slug-de-la-tienda"
   *
   * En un dominio personalizado:
   * ""
   */
  rutaBase: string;

  colorFondoCategoria?: string;
  colorTextoCategoria?: string;
  colorBorderCategoria?: string;
}

export default function TiendaLista({
  categorias,
  countryCode = "PE",
  rutaBase,
  colorTextoCategoria,
}: TiendaListaProps) {
  /*
   * Limpiamos categorías y productos antes de
   * renderizarlos para evitar tarjetas incompletas.
   */
  const categoriasProcesadas = useMemo(() => {
    if (!Array.isArray(categorias)) {
      return [];
    }

    return categorias
      .filter(
        (categoria) =>
          Boolean(categoria) &&
          Boolean(categoria.id) &&
          Boolean(categoria.nombre?.trim()),
      )
      .map((categoria) => {
        const productosValidos = Array.isArray(
          categoria.productos,
        )
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
      .filter(
        (categoria) =>
          categoria.productosValidos.length > 0,
      );
  }, [categorias]);

  if (categoriasProcesadas.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-24 text-center backdrop-blur-sm">
        <div className="space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/10">
            <span
              aria-hidden="true"
              className="text-2xl"
            >
              🛍️
            </span>
          </div>

          <p className="text-sm tracking-wide text-[var(--color-text)] opacity-70">
            Esta tienda todavía no tiene productos
            disponibles.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-14 pb-16">
      {categoriasProcesadas.map(
        (categoria, indiceCategoria) => {
          const idEncabezado =
            `cat-header-${categoria.id}`;

          return (
            <section
              key={categoria.id}
              id={`cat-${categoria.id}`}
              aria-labelledby={idEncabezado}
              className="scroll-mt-24 rounded-none px-2 sm:px-6"
            >
              <HeaderCategoria
                id={idEncabezado}
                nombre={categoria.nombre}
                totalProductos={
                  categoria.productosValidos.length
                }
                colorTextoCategoria={
                  colorTextoCategoria
                }
              />

              <CategoriaSection
                categoria={{
                  ...categoria,
                  productos:
                    categoria.productosValidos,
                }}
                countryCode={countryCode}
                rutaBase={rutaBase}
                isFirstCategory={
                  indiceCategoria === 0
                }
              />
            </section>
          );
        },
      )}
    </div>
  );
}