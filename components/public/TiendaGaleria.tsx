"use client";

import {
  memo,
  useMemo,
} from "react";
import Link from "next/link";

import Price from "@/components/ui/Price";
import HeaderCategoria from "@/components/public/HeaderCategoria";
import OptimizedImage from "@/components/public/OptimizedImage";

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

interface TiendaGaleriaProps {
  categorias: Categoria[];

  /*
   * Catalagox:
   * "/slug-de-la-tienda"
   *
   * Dominio personalizado:
   * ""
   */
  rutaBase: string;

  countryCode?: string;
  colorFondoCategoria?: string;
  colorTextoCategoria?: string;
  colorBorderCategoria?: string;
}

interface ProductoGaleriaCardProps {
  producto: Producto;
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
      rutaBase === "/"
        ? ""
        : rutaBase.replace(/\/+$/, "");

    const productoSlug = producto.slug
      .trim()
      .replace(/^\/+|\/+$/g, "");

    const hrefProducto =
      `${baseNormalizada}/${productoSlug}`;

    const stockAdministrado =
      typeof producto.stock === "number" &&
      Number.isFinite(producto.stock);

    const productoAgotado =
      producto.disponible === false ||
      (stockAdministrado &&
        Number(producto.stock) <= 0);

    return (
      <Link
        id={`prod-${producto.id}`}
        href={hrefProducto}
        aria-label={`Ver producto: ${producto.nombre}`}
        data-producto-disponible={
          productoAgotado ? "false" : "true"
        }
        className={`
          group
          flex
          h-full
          scroll-mt-24
          flex-col
          border-b
          border-r
          border-[var(--color-border-categoria)]
          bg-[var(--color-bg)]/40
          outline-none
          transition-all
          duration-200
          touch-manipulation
          active:bg-white/[0.02]
          focus-visible:ring-2
          focus-visible:ring-inset
          focus-visible:ring-[var(--color-primary)]
          md:hover:bg-white/[0.03]
          ${
            productoAgotado
              ? "opacity-75"
              : ""
          }
        `}
      >
        {/* IMAGEN DEL PRODUCTO */}
        <div className="relative w-full shrink-0 overflow-hidden">
          {producto.imagen_url ? (
            <OptimizedImage
              src={producto.imagen_url}
              alt={producto.nombre}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={isPriority}
              className={`
                transition-transform
                duration-500
                ${
                  productoAgotado
                    ? "grayscale-[35%]"
                    : "md:group-hover:scale-105"
                }
              `}
            />
          ) : (
            <div className="flex aspect-square items-center justify-center overflow-hidden bg-white/[0.01] text-[10px] uppercase tracking-widest text-[var(--color-text)] opacity-40">
              Sin imagen
            </div>
          )}

          {productoAgotado && (
            <div className="absolute inset-x-0 bottom-0 z-20 bg-black/75 px-2 py-1.5 text-center text-[10px] font-bold uppercase tracking-wider text-white">
              Agotado
            </div>
          )}
        </div>

        {/* INFORMACIÓN DEL PRODUCTO */}
        <div className="flex flex-1 flex-col bg-[var(--color-bg)]/20 p-3.5 pt-3">
          <h3 className="line-clamp-2 min-h-[2.7rem] text-xs font-medium leading-snug text-[var(--color-text)] transition-colors sm:text-sm">
            {producto.nombre}
          </h3>

          <div className="mt-auto flex items-end justify-between gap-2 pt-2">
            <div className="text-sm font-bold tracking-tight text-[var(--color-price)] sm:text-base">
              <Price
                amount={producto.precio}
                countryCode={countryCode}
              />
            </div>

            <span
              className={`
                shrink-0
                rounded-md
                px-2
                py-1
                text-[9px]
                font-semibold
                ${
                  productoAgotado
                    ? "bg-white/10 text-[var(--color-text)]"
                    : "bg-[var(--color-price)]/15 text-[var(--color-price)]"
                }
              `}
            >
              {productoAgotado
                ? "Sin stock"
                : "Ver"}
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
      <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-20 text-center backdrop-blur-sm">
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
    <div className="mb-0 space-y-14 pb-0">
      {categoriasProcesadas.map(
        (categoria, indiceCategoria) => {
          const idEncabezado =
            `cat-header-${categoria.id}`;

          return (
            <section
              key={categoria.id}
              id={`cat-${categoria.id}`}
              aria-labelledby={idEncabezado}
              className="scroll-mt-24 overflow-x-hidden"
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

              <div
                style={{
                  backgroundColor:
                    colorFondoCategoria,
                  borderColor:
                    colorBorderCategoria,

                  /*
                   * Permite que las tarjetas internas
                   * utilicen el mismo color de borde.
                   */
                  "--color-border-categoria":
                    colorBorderCategoria,
                } as React.CSSProperties}
                className="grid w-full grid-cols-2 gap-0 overflow-hidden border bg-[var(--color-card)] p-0.5 md:grid-cols-3 lg:grid-cols-4"
              >
                {categoria.productosValidos.map(
                  (
                    producto,
                    indiceProducto,
                  ) => (
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
        },
      )}
    </div>
  );
}