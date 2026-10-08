"use client";

import { memo, useMemo, type CSSProperties } from "react";
import Link from "next/link";

import Price from "@/components/ui/Price";
import HeaderCategoria from "@/components/public/HeaderCategoria";
import OptimizedImage from "@/components/public/OptimizedImage";

import type {
  CategoriaTienda,
  ProductoTienda,
} from "@/lib/tienda-diseno/types";

interface TiendaGaleriaProps {
  categorias: CategoriaTienda[];
  rutaBase: string;
  countryCode?: string;
  colorFondoCategoria?: string;
  colorTextoCategoria?: string;
  colorBorderCategoria?: string;
}

interface ProductoGaleriaCardProps {
  producto: ProductoTienda;
  rutaBase: string;
  countryCode: string;
  isPriority: boolean;
}

const ProductoGaleriaCard = memo(
  function ProductoGaleriaCard({
    producto,
    rutaBase,
    countryCode,
    isPriority,
  }: ProductoGaleriaCardProps) {
    const baseNormalizada =
      rutaBase === "/" ? "" : rutaBase.replace(/\/+$/, "");

    const productoSlug = producto.slug
      .trim()
      .replace(/^\/+|\/+$/g, "");

    const hrefProducto = `${baseNormalizada}/${productoSlug}`;

    const stockAdministrado =
      typeof producto.stock === "number" &&
      Number.isFinite(producto.stock);

    const productoAgotado =
      producto.disponible === false ||
      (stockAdministrado && Number(producto.stock) <= 0);

    return (
      <Link
        id={`prod-${producto.id}`}
        href={hrefProducto}
        aria-label={`Ver producto: ${producto.nombre}`}
        data-producto-disponible={productoAgotado ? "false" : "true"}
        className={`group flex h-full min-w-0 scroll-mt-24 flex-col overflow-hidden border-solid outline-none transition-opacity duration-200 touch-manipulation focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 ${
          productoAgotado ? "opacity-75" : ""
        }`}
        style={{
          backgroundColor: "var(--color-card)",
          borderRadius: "var(--tienda-card-radius, 16px)",
          borderWidth: "var(--tienda-card-border-width, 0px)",
          borderColor: "var(--tienda-card-border-color, #e5e7eb)",
          boxShadow: "var(--tienda-card-shadow, none)",
        }}
      >
        {/* Imagen */}
        <div
          data-tienda-image
          className="relative w-full shrink-0 overflow-hidden"
          style={{
            aspectRatio: "var(--tienda-image-ratio, 1 / 1)",
          }}
        >
          {producto.imagen_url ? (
            <OptimizedImage
              src={producto.imagen_url}
              alt={producto.nombre}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={isPriority}
              className={`transition-transform duration-500 ${
                productoAgotado
                  ? "grayscale-[35%]"
                  : "motion-safe:md:group-hover:scale-105"
              }`}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-black/[0.03] text-[var(--color-text)]">
              <span className="text-xs opacity-50">
                Sin imagen
              </span>
            </div>
          )}

          {productoAgotado && (
            <div className="absolute inset-x-0 bottom-0 z-20 bg-black/75 px-2 py-1.5 text-center text-[10px] font-bold uppercase tracking-wider text-white">
              Agotado
            </div>
          )}
        </div>

        {/* Información */}
        <div className="flex flex-1 flex-col p-3.5">
          <h3
            className="line-clamp-2 font-medium leading-snug text-[var(--color-text)]"
            style={{
              fontSize:
                "calc(var(--tienda-font-size, 16px) * 0.875)",
              minHeight: "2.75em",
            }}
          >
            {producto.nombre}
          </h3>

          <div className="mt-auto flex flex-wrap items-end justify-between gap-2 pt-3">
            <div
              className="min-w-0 font-bold tracking-tight text-[var(--color-price)]"
              style={{
                fontSize: "var(--tienda-font-size, 16px)",
              }}
            >
              <Price
                amount={producto.precio}
                countryCode={countryCode}
              />
            </div>

            <span
              className="shrink-0 rounded-md bg-black/[0.04] px-2 py-1 text-xs font-semibold"
              style={{
                color: productoAgotado
                  ? "var(--color-text)"
                  : "var(--color-price)",
              }}
            >
              {productoAgotado ? "Sin stock" : "Ver"}
            </span>
          </div>
        </div>
      </Link>
    );
  },
);

export default function TiendaGaleria({
  categorias,
  rutaBase,
  countryCode = "PE",
  colorFondoCategoria = "#ffffff",
  colorTextoCategoria = "#111827",
  colorBorderCategoria = "#e5e7eb",
}: TiendaGaleriaProps) {
  const categoriasProcesadas = useMemo(() => {
    if (!Array.isArray(categorias)) return [];

    return categorias
      .filter(
        (categoria) =>
          Boolean(categoria) &&
          Boolean(categoria.id) &&
          Boolean(categoria.nombre?.trim()),
      )
      .map((categoria) => ({
        ...categoria,
        productosValidos: Array.isArray(categoria.productos)
          ? categoria.productos.filter(
              (producto) =>
                Boolean(producto) &&
                Boolean(producto.id) &&
                Boolean(producto.nombre?.trim()) &&
                Boolean(producto.slug?.trim()),
            )
          : [],
      }))
      .filter((categoria) => categoria.productosValidos.length > 0);
  }, [categorias]);

  if (categoriasProcesadas.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--color-border-categoria)] px-6 py-20 text-center">
        <div className="space-y-3">
          <span aria-hidden="true" className="text-2xl">
            🛍️
          </span>

          <p className="text-[var(--color-text)] opacity-70">
            Esta tienda todavía no tiene productos disponibles.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="tienda-galeria flex flex-col"
      style={{
        gap: "var(--tienda-section-gap, 32px)",
      }}
    >
      {categoriasProcesadas.map((categoria, indiceCategoria) => {
        const idEncabezado = `cat-header-${categoria.id}`;

        const estiloCategoria = {
          backgroundColor: colorFondoCategoria,
          borderColor: colorBorderCategoria,
          "--color-border-categoria": colorBorderCategoria,
          gap: "var(--tienda-product-gap, 24px)",
        } as CSSProperties;

        return (
          <section
            key={categoria.id}
            id={`cat-${categoria.id}`}
            aria-labelledby={idEncabezado}
            className="min-w-0 scroll-mt-24"
          >
            <HeaderCategoria
              id={idEncabezado}
              nombre={categoria.nombre}
              totalProductos={categoria.productosValidos.length}
              colorTextoCategoria={colorTextoCategoria}
            />

            <div
              style={estiloCategoria}
              className="grid w-full grid-cols-2 border p-3 sm:p-4 md:grid-cols-3 lg:grid-cols-4"
            >
              {categoria.productosValidos.map(
                (producto, indiceProducto) => (
                  <ProductoGaleriaCard
                    key={producto.id}
                    producto={producto}
                    rutaBase={rutaBase}
                    countryCode={countryCode}
                    isPriority={
                      indiceCategoria === 0 &&
                      indiceProducto < 4
                    }
                  />
                ),
              )}
            </div>
          </section>
        );
      })}

      <style jsx global>{`
        .tienda-galeria [data-tienda-image] img {
          object-fit: var(--tienda-image-fit, cover) !important;
        }
      `}</style>
    </div>
  );
}