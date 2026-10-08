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
    "var(--color-texto-categoria, #111827)";

  const cantidadProductos =
    typeof totalProductos === "number" &&
    Number.isFinite(totalProductos)
      ? Math.max(0, Math.floor(totalProductos))
      : null;

  return (
    <header className="mb-5 flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1 px-4 md:px-1">
      <h2
        id={id}
        className="min-w-0 break-words font-bold leading-tight tracking-tight"
        style={{
          color: colorTexto,
          fontSize: "var(--tienda-title-size, 20px)",
        }}
      >
        {nombre}
      </h2>

      {cantidadProductos !== null && (
        <span
          aria-label={`${cantidadProductos} ${
            cantidadProductos === 1 ? "producto" : "productos"
          }`}
          className="shrink-0 font-medium text-[var(--color-text)] opacity-60"
          style={{
            fontSize: "calc(var(--tienda-font-size, 16px) * 0.75)",
          }}
        >
          {cantidadProductos}
        </span>
      )}
    </header>
  );
}