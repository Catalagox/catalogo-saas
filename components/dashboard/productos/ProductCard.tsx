"use client";

import ProductImage from "@/components/dashboard/productos/ProductImage";
import { Edit3, Trash2, Eye, EyeOff } from "lucide-react";

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
    <div className={`group relative bg-gray-900 rounded-[2rem] border transition-all duration-300 overflow-hidden flex flex-col ${
      producto.disponible 
        ? "border-gray-800 hover:border-indigo-500/50 shadow-xl" 
        : "border-gray-800 opacity-75 grayscale-[0.5]"
    }`}>
      
      {/* Contenedor de Imagen con Badge de Estado */}
      <div className="relative">
        <ProductImage
          src={producto.imagen_url}
          alt={producto.nombre}
        />
        
        {/* Badge de disponibilidad */}
        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md border ${
          producto.disponible 
            ? "bg-green-500/10 text-green-400 border-green-500/20" 
            : "bg-red-500/10 text-red-400 border-red-500/20"
        }`}>
          {producto.disponible ? "Activo" : "Oculto"}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-4">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-lg font-bold text-white leading-tight group-hover:text-indigo-400 transition-colors">
              {producto.nombre}
            </h3>
            <span className="text-indigo-400 font-black text-lg">
              ${producto.precio}
            </span>
          </div>

          <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-2">
            {categoria || "General"}
          </p>

          {producto.descripcion && (
            <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
              {producto.descripcion}
            </p>
          )}
        </div>

        {/* Footer de la tarjeta: Botón deslizante y acciones */}
        <div className="mt-auto pt-4 border-t border-gray-800 flex items-center justify-between gap-2">
          
          {/* Switch Deslizante On/Off */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${
                producto.disponible ? "bg-indigo-600" : "bg-gray-700"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                  producto.disponible ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
              {producto.disponible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            </span>
          </div>

          {/* Acciones Rápidas */}
          <div className="flex gap-1">
            <button
              onClick={onEdit}
              className="p-2.5 bg-gray-800 hover:bg-gray-700 text-blue-400 rounded-xl transition-colors"
              title="Editar"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-2.5 bg-gray-800 hover:bg-red-900/30 text-red-400 rounded-xl transition-colors"
              title="Eliminar"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}