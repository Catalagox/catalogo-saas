"use client";

import { useMemo } from "react";

import ProductoCard from "@/components/public/ProductoCard";
import type { CategoriaTienda } from "@/lib/tienda-diseno/types";

interface CategoriaSectionProps {
  categoria: CategoriaTienda;
  countryCode?: string;
  rutaBase: string;
  isFirstCategory?: boolean;
}

export default function CategoriaSection({
  categoria,
  countryCode = "PE",
  rutaBase,
  isFirstCategory = false,
}: CategoriaSectionProps) {
  const productos = categoria.productos;

  const productosValidos = useMemo(() => {
    if (!Array.isArray(productos)) return [];

    return productos.filter((producto) => {
      if (
        !producto ||
        !producto.id ||
        !producto.nombre?.trim() ||
        !producto.slug?.trim()
      ) {
        return false;
      }

      const precio = Number(producto.precio);

      return Number.isFinite(precio) && precio >= 0;
    });
  }, [productos]);

  if (productosValidos.length === 0) return null;

  return (
    <div
      className="grid min-w-0 grid-cols-1 md:grid-cols-2"
      style={{
        gap: "var(--tienda-product-gap, 24px)",
      }}
    >
      {productosValidos.map((producto, indice) => (
        <div
          key={producto.id}
          id={`prod-${producto.id}`}
          className="min-w-0 scroll-mt-24"
        >
          <ProductoCard
            producto={producto}
            countryCode={countryCode}
            rutaBase={rutaBase}
            isPriority={isFirstCategory && indice < 4}
          />
        </div>
      ))}
    </div>
  );
}