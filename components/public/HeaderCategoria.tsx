"use client";

interface HeaderCategoriaProps {
  nombre: string;
  totalProductos: number;
  colorFondoCategoria?: string;
  colorTextoCategoria?: string;
  colorBorderCategoria?: string;
}

export default function HeaderCategoria({ 
  nombre, 
  totalProductos,
  colorFondoCategoria,
  colorTextoCategoria,
  colorBorderCategoria,
}: HeaderCategoriaProps) {
  return (
    <div className="flex items-center gap-4 mb-6 px-1 md:px-0">
      
      {/* Contenedor del Badge con tus 3 colores dinámicos */}
      <div 
        className="flex items-center gap-3 px-4 py-2 rounded-full backdrop-blur-md shadow-sm border"
        style={{
          backgroundColor: colorFondoCategoria || "var(--color-fondo-categoria)",
          borderColor: colorBorderCategoria || "var(--color-border-categoria)"
        }}
      >
        {/* Puntito indicador que toma el mismo color del texto de la categoría */}
        <span 
          className="w-2 h-2 rounded-full" 
          style={{ 
            backgroundColor: colorTextoCategoria || "var(--color-texto-categoria)"
          }}
        />

        {/* Título de la Categoría */}
        <h2 
          className="text-xs font-black uppercase tracking-wider"
          style={{ color: colorTextoCategoria || "var(--color-texto-categoria)" }}
        >
          {nombre}
        </h2>

        {/* Contador de productos que toma el texto para el fondo y el fondo para el texto */}
        <span 
          className="text-[10px] px-2 py-0.5 rounded-full font-black"
          style={{ 
            backgroundColor: colorTextoCategoria || "var(--color-texto-categoria)",
            color: colorFondoCategoria || "var(--color-fondo-categoria)"
          }}
        >
          {totalProductos}
        </span>
      </div>

      {/* Línea decorativa horizontal */}
      <div 
        className="flex-1 h-px bg-gradient-to-r to-transparent" 
        style={{
          backgroundImage: `linear-gradient(to right, ${colorBorderCategoria || "var(--color-border-categoria)"}, transparent)`
        }}
      />
    </div>
  );
}