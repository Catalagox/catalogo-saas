"use client";

import ProductImage from "@/components/dashboard/productos/ProductImage";
import Price from "@/components/ui/Price";
import { Edit3, Trash2, Eye, EyeOff, Package } from "lucide-react";

type Producto = {
  id: string;
  nombre: string;
  precio: number;
  descripcion?: string;
  disponible: boolean;
  imagen_url?: string;
  stock?: number | null;
};

type Props = {
  producto: Producto;
  categoria?: string;
  paisCode: string;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export default function ProductCard({
  producto,
  categoria,
  paisCode,
  onToggle,
  onEdit,
  onDelete,
}: Props) {
  const stock = producto.stock;

  const tieneStockAdministrado =
    stock !== null && stock !== undefined;

  const agotado = tieneStockAdministrado && stock === 0;
  const activo = producto.disponible && !agotado;

  const estado = !producto.disponible
    ? "Oculto"
    : agotado
      ? "Agotado"
      : "Activo";

  const estilosStock = !tieneStockAdministrado
    ? "border-[var(--border-card)] bg-[var(--bg-tertiary)]"
    : agotado
      ? "border-red-500/30 bg-red-500/10"
      : stock <= 5
        ? "border-amber-500/30 bg-amber-500/10"
        : "border-emerald-500/30 bg-emerald-500/10";

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-[2rem] border border-[var(--border-card)] bg-[var(--bg-card)] text-[var(--text-primary)] transition-all duration-300 ${
        activo
          ? "shadow-[var(--shadow-card)] hover:border-[var(--color-primary)]"
          : "border-dashed"
      }`}
    >
      {/* Imagen */}
      <div className="relative">
        <ProductImage
          src={producto.imagen_url}
          alt={producto.nombre}
        />

        {/* Fondo sólido para mantener la legibilidad sobre cualquier foto */}
        <div
          className={`absolute left-4 top-4 rounded-full border bg-[var(--bg-card)] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[var(--text-primary)] shadow-sm ${
            activo
              ? "border-emerald-500/50"
              : "border-red-500/50"
          }`}
        >
          {estado}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-4">
          <div className="mb-1 flex flex-wrap items-start justify-between gap-3">
            <h3 className="min-w-0 break-words text-lg font-bold leading-tight text-[var(--text-primary)]">
              {producto.nombre}
            </h3>

            <span className="whitespace-nowrap text-lg font-black text-[var(--text-primary)]">
              <Price
                amount={producto.precio}
                countryCode={paisCode}
              />
            </span>
          </div>

          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]">
            {categoria || "General"}
          </p>

          {producto.descripcion && (
            <p className="line-clamp-2 text-sm leading-relaxed text-[var(--text-secondary)]">
              {producto.descripcion}
            </p>
          )}
        </div>

        {/* Información de stock */}
        <div className="mb-4">
          <div
            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold text-[var(--text-primary)] ${estilosStock}`}
          >
            <Package
              className="h-3.5 w-3.5 shrink-0"
              aria-hidden="true"
            />

            <span>
              {!tieneStockAdministrado
                ? "Stock no administrado"
                : agotado
                  ? "Sin stock"
                  : stock <= 5
                    ? `Quedan ${stock} unidades`
                    : `${stock} unidades disponibles`}
            </span>
          </div>
        </div>

        {/* Acciones */}
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-[var(--border-card)] pt-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              role="switch"
              aria-checked={producto.disponible}
              onClick={onToggle}
              aria-label={
                producto.disponible
                  ? "Ocultar producto"
                  : "Mostrar producto"
              }
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] ${
                producto.disponible
                  ? "bg-[var(--color-primary)]"
                  : "bg-[var(--border-card)]"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 rounded-full transition-transform duration-300 ${
                  producto.disponible
                    ? "translate-x-6 bg-[var(--color-text-inverse)]"
                    : "translate-x-1 bg-[var(--text-secondary)]"
                }`}
              />
            </button>

            <span className="text-[var(--text-secondary)]">
              {producto.disponible ? (
                <Eye
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                />
              ) : (
                <EyeOff
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                />
              )}
            </span>
          </div>

          <div className="flex gap-1">
            <button
              type="button"
              onClick={onEdit}
              aria-label={`Editar ${producto.nombre}`}
              title="Editar"
              className="rounded-xl bg-[var(--bg-tertiary)] p-2.5 text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-card-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
            >
              <Edit3
                className="h-4 w-4"
                aria-hidden="true"
              />
            </button>

            <button
              type="button"
              onClick={onDelete}
              aria-label={`Eliminar ${producto.nombre}`}
              title="Eliminar"
              className="rounded-xl bg-[var(--bg-tertiary)] p-2.5 text-[var(--color-danger)] transition-colors hover:bg-red-500/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-danger)]"
            >
              <Trash2
                className="h-4 w-4"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}