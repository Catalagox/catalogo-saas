"use client";

import CategoriaSection from "@/components/public/CategoriaSection";

// TIPOS
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
  // 🛡️ SEGURIDAD
  const safeCategorias = categorias ?? [];

  // 🚫 VACÍO
  if (safeCategorias.length === 0) {
    return (
      <div
        className="
          text-center
          py-24
          px-6
          rounded-3xl
          border
          border-dashed
          border-white/10
          bg-white/[0.02]
          backdrop-blur-sm
        "
      >
        <div className="space-y-3">
          {/* 🔥 ICONO DECORATIVO */}
          <div
            className="
              w-14
              h-14
              mx-auto
              rounded-2xl
              bg-[var(--color-primary)]/10
              border
              border-[var(--color-primary)]/20
              flex
              items-center
              justify-center
            "
          >
            <span className="text-2xl">🍽️</span>
          </div>

          {/* TEXTO */}
          <p
            className="
              text-sm
              tracking-wide
              text-[var(--color-text)]
              opacity-70
            "
          >
            No hay categorías configuradas aún.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        space-y-14
        pb-16
        animate-fade-in
      "
    >
      {safeCategorias.map((categoria) => (
        /* 🔥 IMPORTANTE PARA EL MENU HORIZONTAL */
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