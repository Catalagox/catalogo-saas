"use client";

import Image from "next/image";
import { Dispatch, SetStateAction } from "react";

// Definimos el tipo aquí para asegurar consistencia
type Producto = {
  id: string;
  nombre: string;
  precio: number;
  descripcion?: string;
  categoria_id: string;
  imagen_url?: string;
  disponible: boolean;
};

type Categoria = {
  id: string;
  nombre: string;
};

type Props = {
  producto: Producto;
  categorias: Categoria[];
  previewImage: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // Se actualiza el tipo para aceptar Dispatch del useState del padre
  setProducto: Dispatch<SetStateAction<Producto | null>>;
  onCancel: () => void;
  onSave: () => void;
};

export default function ProductEditModal({
  producto,
  categorias,
  previewImage,
  onFileChange,
  setProducto,
  onCancel,
  onSave,
}: Props) {
  
  // Función auxiliar para actualizar campos específicos sin romper el tipo
  const handleChange = (cambios: Partial<Producto>) => {
    setProducto((prev) => (prev ? { ...prev, ...cambios } : null));
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Editar producto
        </h2>

        {(previewImage || producto.imagen_url) && (
          <Image
            src={previewImage || producto.imagen_url || "/placeholder.png"}
            alt={producto.nombre}
            width={500}
            height={300}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
        )}

        <input
          type="file"
          accept="image/*"
          className="w-full mb-4 text-white"
          onChange={onFileChange}
        />

        <input
          className="w-full p-2 mb-3 bg-gray-800 rounded text-white"
          value={producto.nombre}
          onChange={(e) => handleChange({ nombre: e.target.value })}
          placeholder="Nombre del producto"
        />

        <input
          type="number"
          className="w-full p-2 mb-3 bg-gray-800 rounded text-white"
          value={producto.precio}
          onChange={(e) => handleChange({ precio: Number(e.target.value) })}
          placeholder="Precio"
        />

        <textarea
          className="w-full p-2 mb-3 bg-gray-800 rounded text-white"
          value={producto.descripcion || ""}
          onChange={(e) => handleChange({ descripcion: e.target.value })}
          placeholder="Descripción"
        />

        <select
          className="w-full p-2 mb-4 bg-gray-800 rounded text-white"
          value={producto.categoria_id}
          onChange={(e) => handleChange({ categoria_id: e.target.value })}
        >
          <option value="" disabled>Selecciona una categoría</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition"
          >
            Cancelar
          </button>

          <button
            onClick={onSave}
            className="px-4 py-2 bg-orange-500 rounded hover:bg-orange-400 transition"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}