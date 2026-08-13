"use client";

import { useMemo } from "react";
import ProductoCard from "@/components/public/ProductoCard";

interface Producto {
  id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  imagen_url?: string;
  disponible?: boolean;
  slug: string;
}

interface Categoria {
  id: string;
  nombre: string;
  productos: Producto[];
}

interface Props {
  categoria: Categoria;
  countryCode?: string;
  colorFondoCategoria?: string;
  colorTextoCategoria?: string;
  colorBorderCategoria?: string;
  isFirstCategory?: boolean;
}

export default function CategoriaSection({
  categoria,
  countryCode = "PE",
  isFirstCategory = false,
}: Props) {
  // ⚡ Memoizamos la lista filtrada para evitar filtrar en cada re-render
  const productosValidos = useMemo(() => {
    if (!categoria?.productos) return [];
    return categoria.productos.filter(
      (p) => Boolean(p) && Boolean(p.id) && Boolean(p.nombre)
    );
  }, [categoria?.productos]);

  if (productosValidos.length === 0) return null;

  return (
  <section className="py-6">
    {/* ⚡ 'md:grid-cols-2' hace que a partir de tablets/PC se divida en 2 columnas */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {productosValidos.map((producto, index) => {
        const isPriority = isFirstCategory && index < 4;

        return (
          <div
            key={producto.id}
            id={`prod-${producto.id}`}
            className="scroll-mt-24"
          >
            <ProductoCard
              producto={producto}
              countryCode={countryCode}
              isPriority={isPriority}
            />
          </div>
        );
      })}
    </div>
  </section>
);
}