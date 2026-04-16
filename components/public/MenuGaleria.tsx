"use client";

import Link from "next/link";

interface Producto {
  id: string;
  nombre: string;
  precio: number;
  imagen_url?: string;
  slug: string;
}

interface Categoria {
  id: string;
  nombre: string;
  productos: Producto[];
}

interface MenuGaleriaProps {
  categorias: Categoria[];
  slug: string;
}

export default function MenuGaleria({
  categorias,
  slug,
}: MenuGaleriaProps) {

  if (!categorias || categorias.length === 0) {
    return (
      <div className="text-center py-20 border border-dashed rounded-2xl border-[var(--color-categoria)] text-[var(--color-text)]">
        <p className="text-sm uppercase tracking-widest opacity-70">
          Sin productos
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-10">
      {categorias.map((cat) => {
        const productosValidos =
          (cat.productos ?? []).filter(
            (p) => p && p.slug && p.nombre
          );

        if (productosValidos.length === 0) return null;

        return (
          <div key={cat.id} id={`cat-${cat.id}`} className="scroll-mt-28">

            {/* 🏷️ HEADER CATEGORÍA (Estilo unificado con Lista) */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-[var(--color-card)]">
                {/* 🔥 PUNTO */}
                <span className="w-2 h-2 rounded-full bg-[var(--color-categoria)]" />

                {/* NOMBRE */}
                <h2 className="text-sm font-bold uppercase text-[var(--color-categoria)]">
                  {cat.nombre}
                </h2>

                {/* CANTIDAD */}
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-categoria)]/20 text-[var(--color-categoria)] font-bold">
                  {productosValidos.length}
                </span>
              </div>

              {/* LINEA DECORATIVA */}
              <div className="flex-1 h-[1px] bg-[var(--color-categoria)]/30" />
            </div>

            {/* 📦 GRID DE PRODUCTOS (Cuadrados y simétricos) */}
            <div className="grid grid-cols-2 gap-4">
              {productosValidos.map((p) => {
                const href = `/${slug}/${p.slug}`;

                return (
                  <Link
                    key={p.id}
                    href={href}
                    className="group block rounded-2xl overflow-hidden bg-[var(--color-card)] transition-all hover:shadow-lg active:scale-95"
                  >
                    {/* IMAGEN CUADRADA PERFECTA */}
                    <div className="relative aspect-square overflow-hidden bg-white/5">
                      {p.imagen_url ? (
                        <img
                          src={p.imagen_url}
                          alt={p.nombre}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] uppercase opacity-40 text-[var(--color-text)]">
                          Sin foto
                        </div>
                      )}
                    </div>

                    {/* INFO DEL PRODUCTO */}
                    <div className="p-3 flex flex-col gap-0.5">
                      <h3 className="text-xs font-semibold line-clamp-1 text-[var(--color-text)] uppercase tracking-tight">
                        {p.nombre}
                      </h3>
                      <span className="text-sm font-black text-[var(--color-price)]">
                        ${Number(p.precio ?? 0).toLocaleString()}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}