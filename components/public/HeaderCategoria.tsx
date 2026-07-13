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
  
  const textColor = colorTextoCategoria || "var(--color-texto-categoria)";

  return (
    <div className="flex items-start mb-5 pl-4 pr-1 md:pl-1 md:pr-0">
      
      {/* Título Responsivo y Estilizado */}
      <h2 
        className="text-lg md:text-xl font-bold tracking-tight capitalize leading-none"
        style={{ color: textColor }}
      >
        {nombre}
      </h2>

      {/* Contador de Productos Adaptado */}
      <span 
        className="text-[10px] md:text-[11px] font-semibold ml-1.5 px-1.5 py-0.5 rounded-md bg-current/5 align-super"
        style={{ color: textColor }}
      >
        {totalProductos}
      </span>

    </div>
  );
}