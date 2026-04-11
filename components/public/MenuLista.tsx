"use client";

import CategoriaSection from "@/components/public/CategoriaSection";

// Tipos
interface Producto {
  id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  imagen_url?: string;
  disponible?: boolean;
  slug: string;
}

interface Categoria {
  id: string;
  nombre: string;
  productos: Producto[];
}

interface MenuListaProps {
  categorias: Categoria[];

  // 🎨 COLORES
  colorTexto: string;
  colorPrecio: string;
  colorTarjeta: string;
  colorCategoria: string;
}

export default function MenuLista({
  categorias,
  colorTexto,
  colorPrecio,
  colorTarjeta,
  colorCategoria,
}: MenuListaProps) {

  if (!categorias || categorias.length === 0) {
    return (
      <div
        className="text-center py-20 rounded-3xl border border-dashed"
        style={{
          borderColor: colorCategoria + "40",
          color: colorTexto,
        }}
      >
        <p className="italic text-sm opacity-70">
          No hay categorías configuradas aún.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-10">
      {categorias.map((categoria) => (
        <div key={categoria.id}>
          <CategoriaSection
            categoria={categoria}

            // 🎨 PASAMOS TODO
            colorTexto={colorTexto}
            colorPrecio={colorPrecio}
            colorTarjeta={colorTarjeta}
            colorCategoria={colorCategoria}
          />
        </div>
      ))}
    </div>
  );
}