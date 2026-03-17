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
  
  // 1. Lógica pro: Agrupar productos por categoría para una mejor gestión
  const productosPorCategoria = categorias.map((cat) => ({
    ...cat,
    prods: productos.filter((p) => p.categoria_id === cat.id),
  })).filter(cat => cat.prods.length > 0); // Solo mostrar categorías con productos

  // Productos sin categoría asignada
  const productosHuérfanos = productos.filter(
    (p) => !categorias.find((c) => c.id === p.categoria_id)
  );

  return (
    <div className="space-y-12">
      {/* Sección de Categorías Dinámicas */}
      {productosPorCategoria.map((cat) => (
        <section key={cat.id} className="space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <Layers className="w-5 h-5 text-indigo-400" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {cat.nombre} 
              <span className="ml-3 text-sm font-normal text-gray-500">
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

      {/* Sección para productos sin categoría (si existen) */}
      {productosHuérfanos.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
            <div className="p-2 bg-gray-800 rounded-lg">
              <LayoutGrid className="w-5 h-5 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-400 italic">
              Sin categoría asignada
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productosHuérfanos.map((producto) => (
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