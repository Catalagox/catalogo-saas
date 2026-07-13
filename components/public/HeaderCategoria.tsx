"use client";

interface HeaderCategoriaProps {
  nombre: string;
  totalProductos: number;
  colorTextoCategoria?: string;
}

export default function HeaderCategoria({ 
  nombre, 
  totalProductos,
  colorTextoCategoria,
}: HeaderCategoriaProps) {
  
  // Guardamos el color en una constante para no repetir la lógica
  const textColor = colorTextoCategoria || "var(--color-texto-categoria)";

  return (
    <div className="flex items-baseline gap-2 mb-6 px-1 md:px-0">
      
      {/* Título de la Categoría con su color dinámico */}
      <h2 
        className="text-2xl font-bold tracking-tight capitalize"
        style={{ color: textColor }}
      >
        {nombre}
      </h2>

      {/* Contador de Productos (comparte el mismo color pero con opacidad) */}
      <span 
        className="text-sm font-medium opacity-75"
        style={{ color: textColor }}
      >
        ({totalProductos})
      </span>

    </div>
  );
}