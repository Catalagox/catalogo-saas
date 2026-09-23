"use client";

interface StockBadgeProps {
  stock?: number | null;
  disponible?: boolean;
  limiteStockBajo?: number;
  mostrarTextoCompleto?: boolean;
}

type EstadoStock =
  | "agotado"
  | "sin_control"
  | "bajo"
  | "disponible";

export default function StockBadge({
  stock,
  disponible = true,
  limiteStockBajo = 5,
  mostrarTextoCompleto = true,
}: StockBadgeProps) {
  /*
   * Si el stock no es un número válido, consideramos
   * que la tienda no administra cantidades para este producto.
   */
  const administraStock =
    typeof stock === "number" &&
    Number.isFinite(stock);

  /*
   * Los productos se administran por unidades completas.
   * También evitamos mostrar valores negativos.
   */
  const cantidadDisponible = administraStock
    ? Math.max(0, Math.floor(stock))
    : null;

  const limiteNormalizado =
    Number.isFinite(limiteStockBajo) &&
    limiteStockBajo >= 0
      ? Math.floor(limiteStockBajo)
      : 5;

  let estado: EstadoStock;
  let texto: string;
  let claseEstado: string;

  if (
    !disponible ||
    cantidadDisponible === 0
  ) {
    estado = "agotado";

    texto = mostrarTextoCompleto
      ? "Producto agotado"
      : "Sin stock";

    claseEstado =
      "font-semibold opacity-70";
  } else if (cantidadDisponible === null) {
    estado = "sin_control";

    texto = mostrarTextoCompleto
      ? "Producto disponible"
      : "Disponible";

    claseEstado =
      "font-medium opacity-70";
  } else if (
    cantidadDisponible <= limiteNormalizado
  ) {
    estado = "bajo";

    texto = mostrarTextoCompleto
      ? `Últimas unidades (${cantidadDisponible})`
      : `${cantidadDisponible} disponibles`;

    claseEstado = "font-semibold";
  } else {
    estado = "disponible";

    texto = mostrarTextoCompleto
      ? `Stock disponible (${cantidadDisponible})`
      : `${cantidadDisponible} disponibles`;

    claseEstado =
      "font-medium opacity-70";
  }

  return (
    <div
      role="status"
      aria-label={texto}
      data-stock-status={estado}
      className={`text-sm text-[var(--color-text)] ${claseEstado}`}
    >
      <span>{texto}</span>
    </div>
  );
}
