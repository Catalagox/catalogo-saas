
"use client";

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
      <div className="text-sm font-medium text-[var(--color-text)] opacity-70">
        <span>
          {mostrarTextoCompleto ? "Agotado" : "Sin stock"}
        </span>
      </div>
    );
  }

  // Stock no administrado
  if (stock === null || stock === undefined) {
    return (
      <div className="text-sm font-medium text-[var(--color-text)] opacity-70">
        <span>
          {mostrarTextoCompleto ? "Disponible" : "En stock"}
        </span>
      </div>
    );
  }

  // Pocas unidades
  if (stock <= limiteStockBajo) {
    return (
      <div className="text-sm font-semibold text-[var(--color-text)]">
        <span>
          {mostrarTextoCompleto
            ? `Últimas unidades (${stock})`
            : `${stock} disponibles`}
        </span>
      </div>
    );
  }

  // Stock normal
  return (
    <div className="text-sm font-medium text-[var(--color-text)] opacity-70">
      <span>
        {mostrarTextoCompleto
          ? `Stock disponible (${stock})`
          : `${stock} disponibles`}
      </span>
    </div>
  );
}



