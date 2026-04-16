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
}

export default function MenuLista({ categorias }: MenuListaProps) {

  // 🛡️ Seguridad extra
  const safeCategorias = categorias ?? [];

  if (safeCategorias.length === 0) {
    return (
      <div className="text-center py-20 rounded-3xl border border-dashed border-[var(--color-categoria)] text-[var(--color-text)]">
        <p className="italic text-sm opacity-70">
          No hay categorías configuradas aún.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-10">
      {safeCategorias.map((categoria) => (
        <CategoriaSection
          key={categoria.id}
          categoria={categoria}
        />
      ))}
    </div>
  );
}