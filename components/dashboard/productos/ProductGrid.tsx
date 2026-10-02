"use client";

import ProductCard from "@/components/dashboard/productos/ProductCard";
import { LayoutGrid, Layers } from "lucide-react";

type Categoria = {
  id: string;
  nombre: string;
};

type Producto = {
  id: string;
  nombre: string;
  precio: number;
  descripcion?: string;
  disponible: boolean;
  categoria_id: string;
  imagen_url?: string;
  stock?: number | null;
};

type Props = {
  productos: Producto[];
  categorias: Categoria[];
  paisCode: string;
  onToggle: (p: Producto) => void;
  onEdit: (p: Producto) => void;
  onDelete: (id: string) => void;
};

export default function ProductGrid({
  productos,
  categorias,
  paisCode,
  onToggle,
  onEdit,
  onDelete,
}: Props) {
  const productosPorCategoria = categorias
    .map((cat) => ({
      ...cat,
      prods: productos.filter((p) => p.categoria_id === cat.id),
    }))
    .filter((cat) => cat.prods.length > 0);

  const productosHuerfanos = productos.filter(
    (p) => !categorias.some((c) => c.id === p.categoria_id),
  );

  return (
    <div className="min-w-0 space-y-12 text-[var(--text-primary)]">
      {/* Categorías */}
      {productosPorCategoria.map((cat) => (
        <section key={cat.id} className="min-w-0 space-y-6">
          <div className="flex items-center gap-3 border-b border-[var(--border-card)] pb-4">
            <div className="shrink-0 rounded-lg bg-[var(--bg-tertiary)] p-2">
              <Layers
                className="h-5 w-5 text-[var(--text-primary)]"
                aria-hidden="true"
              />
            </div>

            <h2 className="min-w-0 break-words text-xl font-bold tracking-tight text-[var(--text-primary)]">
              {cat.nombre}

              <span className="ml-3 text-sm font-normal text-[var(--text-secondary)]">
                ({cat.prods.length})
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cat.prods.map((producto) => (
              <ProductCard
                key={producto.id}
                producto={producto}
                categoria={cat.nombre}
                paisCode={paisCode}
                onToggle={() => onToggle(producto)}
                onEdit={() => onEdit(producto)}
                onDelete={() => onDelete(producto.id)}
              />
            ))}
          </div>
        </section>
      ))}

      {/* Productos sin categoría */}
      {productosHuerfanos.length > 0 && (
        <section className="min-w-0 space-y-6">
          <div className="flex items-center gap-3 border-b border-[var(--border-card)] pb-4">
            <div className="shrink-0 rounded-lg bg-[var(--bg-tertiary)] p-2">
              <LayoutGrid
                className="h-5 w-5 text-[var(--text-secondary)]"
                aria-hidden="true"
              />
            </div>

            <h2 className="min-w-0 break-words text-xl font-bold tracking-tight text-[var(--text-primary)]">
              Sin categoría asignada

              <span className="ml-3 text-sm font-normal text-[var(--text-secondary)]">
                ({productosHuerfanos.length})
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {productosHuerfanos.map((producto) => (
              <ProductCard
                key={producto.id}
                producto={producto}
                categoria="General"
                paisCode={paisCode}
                onToggle={() => onToggle(producto)}
                onEdit={() => onEdit(producto)}
                onDelete={() => onDelete(producto.id)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}