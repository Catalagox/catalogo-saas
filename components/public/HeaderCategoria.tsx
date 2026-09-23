"use client";

interface EncabezadoCategoriaProps {
  id?: string;
  nombre: string;
  totalProductos?: number;
  colorTextoCategoria?: string;
}

export default function EncabezadoCategoria({
  id,
  nombre,
  totalProductos,
  colorTextoCategoria,
}: EncabezadoCategoriaProps) {
  const colorTexto =
    colorTextoCategoria?.trim() ||
    "var(--color-texto-categoria)";

  const tieneCantidadValida =
    typeof totalProductos === "number" &&
    Number.isFinite(totalProductos);

  const cantidadProductos =
    tieneCantidadValida
      ? Math.max(
          0,
          Math.floor(totalProductos),
        )
      : null;

  return (
    <header className="mb-5 flex min-w-0 items-baseline gap-2 px-4 md:px-1">
      <h2
        id={id}
        className="min-w-0 break-words text-lg font-bold leading-tight tracking-tight md:text-xl"
        style={{
          color: colorTexto,
        }}
      >
        {nombre}
      </h2>

      {cantidadProductos !== null && (
        <span
          aria-label={`${cantidadProductos} ${
            cantidadProductos === 1
              ? "producto"
              : "productos"
          }`}
          className="shrink-0 text-xs font-medium text-[var(--color-text)] opacity-55"
        >
          {cantidadProductos}
        </span>
      )}
    </header>
  );
}