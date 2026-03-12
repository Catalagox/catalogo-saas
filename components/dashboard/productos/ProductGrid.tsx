"use client";

import ProductCard from "@/components/dashboard/productos/ProductCard";

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

  return (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

      {productos.map((producto) => {

        const categoria = categorias.find(
          (c) => c.id === producto.categoria_id
        );

        return (
          <ProductCard
            key={producto.id}
            producto={producto}
            categoria={categoria?.nombre}
            onToggle={() => onToggle(producto)}
            onEdit={() => onEdit(producto)}
            onDelete={() => onDelete(producto.id)}
          />
        );
      })}

    </div>
  );
}