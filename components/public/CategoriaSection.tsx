"use client";

import { useMemo } from "react";

import ProductoCard from "@/components/public/ProductoCard";

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

interface CategoriaSectionProps {
  categoria: Categoria;
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
  const productosValidos = useMemo(() => {
    if (
      !categoria ||
      !Array.isArray(categoria.productos)
    ) {
      return [];
    }

    return categoria.productos.filter(
      (producto) => {
        if (
          !producto ||
          !producto.id ||
          !producto.nombre?.trim() ||
          !producto.slug?.trim()
        ) {
          return false;
        }

        const precio =
          Number(producto.precio);

        return (
          Number.isFinite(precio) &&
          precio >= 0
        );
      },
    );
  }, [categoria.productos]);

  if (productosValidos.length === 0) {
    return null;
  }

  return (
    <div className="py-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {productosValidos.map(
          (producto, indice) => {
            const esPrioritario =
              isFirstCategory && indice < 4;

            return (
              <div
                key={producto.id}
                id={`prod-${producto.id}`}
                className="scroll-mt-24"
              >
                <ProductoCard
                  producto={producto}
                  countryCode={countryCode}
                  rutaBase={rutaBase}
                  isPriority={esPrioritario}
                />
              </div>
            );
          },
        )}
      </div>
    </div>
  );
}