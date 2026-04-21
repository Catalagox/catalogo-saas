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
  onDelete,
}: Props) {
  return (
    <div
      className={`group relative bg-[var(--bg-card)] rounded-[2rem] border transition-all duration-300 overflow-hidden flex flex-col ${
        producto.disponible
          ? "border-[var(--border-card)] hover:border-[var(--color-primary)] shadow-xl"
          : "border-[var(--border-card)] opacity-75 grayscale-[0.5]"
      }`}
    >
      {/* Imagen */}
      <div className="relative">
        <ProductImage src={producto.imagen_url} alt={producto.nombre} />

        {/* Estado */}
        <div
          className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md border ${
            producto.disponible
              ? "bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/20"
              : "bg-[var(--color-danger)]/10 text-[var(--color-danger)] border-[var(--color-danger)]/20"
          }`}
        >
          {producto.disponible ? "Activo" : "Oculto"}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-4">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-lg font-bold text-[var(--text-primary)] leading-tight group-hover:text-[var(--color-primary)] transition-colors">
              {producto.nombre}
            </h3>
            <span className="text-[var(--color-primary)] font-black text-lg">
              ${producto.precio}
            </span>
          </div>

          <p className="text-[var(--text-secondary)] text-xs font-medium uppercase tracking-wider mb-2">
            {categoria || "General"}
          </p>

          {producto.descripcion && (
            <p className="text-[var(--text-secondary)] text-sm line-clamp-2 leading-relaxed">
              {producto.descripcion}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-[var(--border-card)] flex items-center justify-between gap-2">
          {/* Switch */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${
                producto.disponible
                  ? "bg-[var(--color-primary)]"
                  : "bg-[var(--bg-tertiary)]"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-[var(--color-text-inverse)] transition-transform duration-300 ${
                  producto.disponible ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>

            <span className="text-[var(--text-secondary)]">
              {producto.disponible ? (
                <Eye className="w-3 h-3" />
              ) : (
                <EyeOff className="w-3 h-3" />
              )}
            </span>
          </div>

          {/* Acciones */}
          <div className="flex gap-1">
            <button
              onClick={onEdit}
              className="p-2.5 bg-[var(--bg-tertiary)] hover:bg-[var(--bg-card-hover)] text-[var(--color-primary)] rounded-xl transition-colors"
              title="Editar"
            >
              <Edit3 className="w-4 h-4" />
            </button>

            <button
              onClick={onDelete}
              className="p-2.5 bg-[var(--bg-tertiary)] hover:bg-[var(--color-danger)]/20 text-[var(--color-danger)] rounded-xl transition-colors"
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
