"use client";

interface HeaderCategoriaProps {
  id?: string;
  nombre: string;
  totalProductos?: number; // Opcional por si aún se pasa en alguna prop pero no se renderiza
  colorTextoCategoria?: string;
}

export default function HeaderCategoria({
  id,
  nombre,
  colorTextoCategoria,
}: HeaderCategoriaProps) {
  const textColor = colorTextoCategoria || "var(--color-texto-categoria)";

  return (
    <div
      id={id}
      className="flex items-baseline gap-2 mb-5 pl-4 pr-1 md:pl-1 md:pr-0 scroll-mt-36"
    >
      <h2
        className="text-lg md:text-xl font-bold tracking-tight capitalize leading-none break-words"
        style={{ color: textColor }}
      >
        {nombre}
      </h2>
    </div>
  );
}