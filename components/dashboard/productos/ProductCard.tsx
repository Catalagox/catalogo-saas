"use client";

import ProductImage from "@/components/dashboard/productos/ProductImage";

type Producto = {
  id: string;
  nombre: string;
  precio: number;
  descripcion?: string;
  disponible: boolean;
  imagen_url?: string;
};

type Props = {
  producto: Producto;
  categoria?: string;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export default function ProductCard({
  producto,
  categoria,
  onToggle,
  onEdit,
  onDelete
}: Props) {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden flex flex-col shadow-md hover:shadow-xl transition-shadow duration-300">

      <ProductImage
        src={producto.imagen_url}
        alt={producto.nombre}
      />

      <div className="p-4 flex-1 flex flex-col justify-between">

        <div>
          <h3 className="text-xl font-semibold mb-1">
            {producto.nombre}
          </h3>

          <p className="text-gray-400 text-sm mb-2">
            {categoria}
          </p>

          <p className="text-orange-400 font-bold mb-2">
            ${producto.precio}
          </p>

          {producto.descripcion && (
            <p className="text-gray-400 text-sm">
              {producto.descripcion}
            </p>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">

          <button
            onClick={onToggle}
            className={`px-3 py-1 rounded text-sm ${
              producto.disponible
                ? "bg-green-600"
                : "bg-gray-700"
            }`}
          >
            {producto.disponible
              ? "Disponible"
              : "Oculto"}
          </button>

          <button
            onClick={onEdit}
            className="px-3 py-1 bg-blue-600 rounded text-sm"
          >
            Editar
          </button>

          <button
            onClick={onDelete}
            className="px-3 py-1 bg-red-600 rounded text-sm"
          >
            Eliminar
          </button>

        </div>
      </div>
    </div>
  );
}