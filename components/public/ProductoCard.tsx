"use client";

import Link from "next/link";

import Price from "@/components/ui/Price";
import OptimizedImage from "@/components/public/OptimizedImage";
import type { ProductoTienda } from "@/lib/tienda-diseno/types";

interface ProductoCardProps {
  producto: ProductoTienda;
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
      href={hrefProducto}
      aria-label={`Ver producto: ${producto.nombre}`}
      data-producto-disponible={productoAgotado ? "false" : "true"}
      className={`group flex h-full min-w-0 cursor-pointer items-center gap-3 border-solid p-3 outline-none transition-colors duration-200 touch-manipulation focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 sm:gap-4 ${
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
        className="relative w-20 shrink-0 overflow-hidden bg-black/5 sm:w-24"
        style={{
          aspectRatio: "var(--tienda-image-ratio, 1 / 1)",
          borderRadius: "var(--tienda-card-radius, 16px)",
        }}
      >
        {producto.imagen_url ? (
          <OptimizedImage
            src={producto.imagen_url}
            alt={producto.nombre}
            fill
            sizes="(max-width: 639px) 80px, 96px"
            priority={isPriority}
            containerClassName="h-full w-full"
            className={`transition-transform duration-500 ${
              productoAgotado
                ? "grayscale-[35%]"
                : "motion-safe:md:group-hover:scale-105"
            }`}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-2 text-center text-xs text-[var(--color-text)]">
            <span className="opacity-60">Sin imagen</span>
          </div>
        )}

        {productoAgotado && (
          <div className="absolute inset-x-0 bottom-0 z-20 bg-black/75 px-2 py-1 text-center text-[10px] font-bold uppercase tracking-wide text-white">
            Agotado
          </div>
        )}
      </div>

      {/* Información */}
      <div className="flex min-w-0 flex-1 flex-col">
        <h3
          className="break-words font-semibold leading-tight text-[var(--color-text)]"
          style={{
            fontSize: "var(--tienda-font-size, 16px)",
          }}
        >
          {producto.nombre}
        </h3>

        {producto.descripcion && (
          <p
            className="mt-1 line-clamp-2 break-words leading-relaxed text-[var(--color-text)] opacity-70"
            style={{
              fontSize: "calc(var(--tienda-font-size, 16px) * 0.875)",
            }}
          >
            {producto.descripcion}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <span
            className="break-words font-bold text-[var(--color-price)]"
            style={{
              fontSize: "var(--tienda-font-size, 16px)",
            }}
          >
            <Price
              amount={producto.precio}
              countryCode={countryCode}
            />
          </span>

          <span
            className={`rounded-md bg-black/5 px-2 py-1 font-semibold ${
              productoAgotado
                ? "text-[var(--color-text)] opacity-70"
                : "text-[var(--color-price)]"
            }`}
            style={{
              fontSize: "calc(var(--tienda-font-size, 16px) * 0.75)",
            }}
          >
            {productoAgotado ? "Sin stock" : "Ver producto"}
          </span>
        </div>
      </div>
    </Link>
  );
}