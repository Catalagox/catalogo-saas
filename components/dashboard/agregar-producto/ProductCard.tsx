"use client";

import { supabase } from "@/lib/supabaseClient";
import ButtonOutline from "@/components/dashboard/agregar-producto/ButtonOutline";

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
  onUpdated: () => void;
};

export default function ProductCard({ producto, onUpdated }: Props) {

  const toggleDisponible = async () => {
    const { error } = await supabase
      .from("productos")
      .update({ disponible: !producto.disponible })
      .eq("id", producto.id);

    if (!error) {
      onUpdated();
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-800">

      {/* Imagen */}
      {producto.imagen_url && (
        <img
          src={producto.imagen_url}
          alt={producto.nombre}
          className="w-full h-40 object-cover"
        />
      )}

      {/* Contenido */}
      <div className="p-5">

        {/* Nombre */}
        <h3 className="text-lg font-bold mb-1">
          {producto.nombre}
        </h3>

        {/* Precio */}
        <p className="text-gray-400 mb-2">
          ${producto.precio}
        </p>

        {/* Descripción */}
        {producto.descripcion && (
          <p className="text-sm text-gray-500 mb-4">
            {producto.descripcion}
          </p>
        )}

        {/* Estado */}
        <div className="flex items-center justify-between">

          <span
            className={`text-xs px-3 py-1 rounded-full ${
              producto.disponible
                ? "bg-green-600"
                : "bg-red-600"
            }`}
          >
            {producto.disponible
              ? "Disponible"
              : "No disponible"}
          </span>

          <ButtonOutline onClick={toggleDisponible}>
            Cambiar
          </ButtonOutline>

        </div>

      </div>
    </div>
  );
}