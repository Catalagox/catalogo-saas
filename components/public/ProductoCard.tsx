"use client";

import Link from "next/link";

import Price from "@/components/ui/Price";
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

interface ProductoCardProps {
  producto: Producto;
  countryCode?: string;
  isPriority?: boolean;
  rutaBase: string;
}

export default function ProductoCard({
  producto,
  countryCode = "PE",
  isPriority = false,
  rutaBase,
}: ProductoCardProps) {
  /*
   * Quitamos cualquier barra sobrante del final.
   *
   * Catalagox:
   * rutaBase = "/mi-tienda"
   *
   * Dominio personalizado:
   * rutaBase = ""
   */
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
      href={hrefProducto}
      aria-label={`Ver producto: ${producto.nombre}`}
      data-producto-disponible={
        productoAgotado ? "false" : "true"
      }
      className={`
        group
        flex
        cursor-pointer
        items-center
        gap-4
        rounded-none
        border
        border-white/10
        bg-[var(--color-card)]
        p-3
        outline-none
        transition-all
        duration-300
        touch-manipulation
        active:scale-[0.98]
        active:bg-white/[0.02]
        md:hover:border-[var(--color-categoria)]
        ${
          productoAgotado
            ? "opacity-75"
            : ""
        }
      `}
    >
      {/* IMAGEN DEL PRODUCTO */}
      {producto.imagen_url ? (
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-none bg-white/[0.01]">
          <OptimizedImage
            src={producto.imagen_url}
            alt={producto.nombre}
            fill
            sizes="96px"
            priority={isPriority}
            className={`
              object-cover
              transition-transform
              duration-500
              ${
                productoAgotado
                  ? "grayscale-[35%]"
                  : "md:group-hover:scale-110"
              }
            `}
          />

          {productoAgotado && (
            <div className="absolute inset-x-0 bottom-0 bg-black/70 px-2 py-1 text-center text-[10px] font-bold uppercase tracking-wide text-white">
              Agotado
            </div>
          )}
        </div>
      ) : (
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-none bg-white/10 text-xs text-[var(--color-text)]">
          Sin imagen
        </div>
      )}

      {/* INFORMACIÓN DEL PRODUCTO */}
      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="truncate text-base font-semibold leading-tight text-[var(--color-text)]">
          {producto.nombre}
        </h3>

        {producto.descripcion && (
          <p className="mt-1 line-clamp-2 text-sm text-[var(--color-text)] opacity-70">
            {producto.descripcion}
          </p>
        )}

        <div className="mt-2 flex items-end justify-between gap-3">
          <span className="text-sm font-bold text-[var(--color-price)]">
            <Price
              amount={producto.precio}
              countryCode={countryCode}
            />
          </span>

          <span
            className={`
              shrink-0
              rounded-md
              px-2
              py-1
              text-[10px]
              font-semibold
              transition
              ${
                productoAgotado
                  ? "bg-white/10 text-[var(--color-text)] opacity-70"
                  : "bg-[var(--color-price)]/20 text-[var(--color-price)] md:opacity-0 md:group-hover:opacity-100"
              }
            `}
          >
            {productoAgotado
              ? "Sin stock"
              : "Ver producto"}
          </span>
        </div>
      </div>
    </Link>
  );
}