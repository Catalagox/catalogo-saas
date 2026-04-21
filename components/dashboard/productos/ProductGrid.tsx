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
};

type Props = {
  productos: Producto[];
  categorias: Categoria[];
  onToggle: (p: Producto) => void;
  onEdit: (p: Producto) => void;
  onDelete: (id: string) => void;
};

export default function ProductGrid({
  productos,
  categorias,
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
    (p) => !categorias.find((c) => c.id === p.categoria_id),
  );

  return (
    <div className="space-y-12">
      {/* Categorías */}
      {productosPorCategoria.map((cat) => (
        <section key={cat.id} className="space-y-6">
          <div className="flex items-center gap-3 border-b border-[var(--border-card)] pb-4">
            <div className="p-2 bg-[var(--bg-tertiary)] rounded-lg">
              <Layers className="w-5 h-5 text-[var(--color-primary)]" />
            </div>

            <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
              {cat.nombre}
              <span className="ml-3 text-sm font-normal text-[var(--text-secondary)]">
                ({cat.prods.length})
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cat.prods.map((producto) => (
              <ProductCard
                key={producto.id}
                producto={producto}
                categoria={cat.nombre}
                onToggle={() => onToggle(producto)}
                onEdit={() => onEdit(producto)}
                onDelete={() => onDelete(producto.id)}
              />
            ))}
          </div>
        </section>
      ))}

      {/* Sin categoría */}
      {productosHuerfanos.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-[var(--border-card)] pb-4">
            <div className="p-2 bg-[var(--bg-tertiary)] rounded-lg">
              <LayoutGrid className="w-5 h-5 text-[var(--text-secondary)]" />
            </div>

            <h2 className="text-xl font-bold text-[var(--text-secondary)] italic">
              Sin categoría asignada
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productosHuerfanos.map((producto) => (
              <ProductCard
                key={producto.id}
                producto={producto}
                categoria="General"
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
