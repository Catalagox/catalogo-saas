"use client";

import {
  PackageCheck,
  PackageX,
  AlertTriangle,
} from "lucide-react";

interface StockBadgeProps {
  stock?: number | null;
  disponible?: boolean;
  limiteStockBajo?: number;
  mostrarTextoCompleto?: boolean;
}

export default function StockBadge({
  stock,
  disponible = true,
  limiteStockBajo = 5,
  mostrarTextoCompleto = true,
}: StockBadgeProps) {
  // Producto oculto o agotado
  if (
    !disponible ||
    (stock !== null && stock !== undefined && stock <= 0)
  ) {
    return (
      <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-text)] opacity-70">
        <PackageX
          size={16}
          strokeWidth={2}
          className="shrink-0"
        />

        <span>
          {mostrarTextoCompleto ? "Agotado" : "Sin stock"}
        </span>
      </div>
    );
  }

  // Stock no administrado
  if (stock === null || stock === undefined) {
    return (
      <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-text)] opacity-70">
        <PackageCheck
          size={16}
          strokeWidth={2}
          className="shrink-0"
        />

        <span>
          {mostrarTextoCompleto ? "Disponible" : "En stock"}
        </span>
      </div>
    );
  }

  // Pocas unidades
  if (stock <= limiteStockBajo) {
    return (
      <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text)]">
        <AlertTriangle
          size={16}
          strokeWidth={2}
          className="shrink-0 opacity-70"
        />

        <span>
          {mostrarTextoCompleto
            ? `Últimas ${stock} unidades`
            : `${stock} disponibles`}
        </span>
      </div>
    );
  }

  // Stock normal
  return (
    <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-text)] opacity-70">
      <PackageCheck
        size={16}
        strokeWidth={2}
        className="shrink-0"
      />

      <span>
        {mostrarTextoCompleto
          ? `${stock} unidades disponibles`
          : `${stock} en stock`}
      </span>
    </div>
  );
}

