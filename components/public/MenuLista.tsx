"use client";

import CategoriaSection from "@/components/public/CategoriaSection";

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
  const safeCategorias = categorias ?? [];

  if (safeCategorias.length === 0) {
    return (
      <div className="text-center py-24 px-6 rounded-3xl border border-dashed border-white/10 bg-white/[0.02] backdrop-blur-sm">
        <div className="space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 flex items-center justify-center">
            <span className="text-2xl">🍽️</span>
          </div>

          <p className="text-sm tracking-wide text-[var(--color-text)] opacity-70">
            No hay categorías configuradas aún.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        animate-fade-in
        space-y-20
        pb-0
        pl-3
        pr-3
        sm:px-4
        lg:px-0
        max-w-7xl
        mx-auto
      "
    >
      {safeCategorias.map((categoria) => (
        <section
          key={categoria.id}
          id={`categoria-${categoria.id}`}
          className="scroll-mt-36"
        >
          <CategoriaSection categoria={categoria} />
        </section>
      ))}
    </div>
  );
}