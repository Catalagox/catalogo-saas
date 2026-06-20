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

export default function MenuGaleria({ categorias, slug }: MenuGaleriaProps) {
  if (!categorias || categorias.length === 0) {
    return (
      <div className="text-center py-20 border border-dashed rounded-xl border-white/10 bg-white/[0.02] backdrop-blur-sm">
        <p className="text-sm uppercase tracking-[0.3em] opacity-60 text-[var(--color-text)]">
          Sin productos
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-14 pb-0 mb-0">
      {categorias.map((cat) => {
        const productosValidos = (cat.productos ?? []).filter(
          (p) => p && p.slug && p.nombre
        );

        if (productosValidos.length === 0) return null;

        return (
          <section
            key={cat.id}
            id={`categoria-${cat.id}`}
            className="scroll-mt-40 overflow-x-hidden"
          >
            {/* HEADER */}
            <div className="flex items-center gap-4 mb-6 px-1 md:px-0">
              <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-[var(--color-card)] backdrop-blur-md shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] shadow-[0_0_10px_var(--color-primary)]" />

                <h2 className="text-xs font-black uppercase tracking-wider text-[var(--color-categoria)]">
                  {cat.nombre}
                </h2>

                <span className="text-[10px] px-2 py-0.5 rounded-full font-black bg-[var(--color-primary)]/15 text-[var(--color-primary)]">
                  {productosValidos.length}
                </span>
              </div>

              <div className="flex-1 h-px bg-gradient-to-r from-[var(--color-primary)]/30 to-transparent" />
            </div>

            {/* GRID */}
            <div
              className="
                grid
                grid-cols-2
                md:grid-cols-3
                lg:grid-cols-4
                gap-0
                p-0.5
                w-full
                border
                border-white/10
                bg-[var(--color-card)]
                overflow-hidden
              "
            >
              {productosValidos.map((p) => (
                <Link
                  key={p.id}
                  href={`/${slug}/${p.slug}`}
                  className="
                    group
                    flex
                    flex-col
                    h-full
                    bg-[var(--color-bg)]/40
                    border-b
                    border-r
                    border-white/10
                    hover:bg-white/[0.03]
                    transition-all
                    duration-200
                  "
                >
                  {/* IMAGEN */}
                  <div className="p-0.5 pb-1 flex-shrink-0">
                    <div className="relative aspect-square overflow-hidden bg-white/[0.01]">
                      {p.imagen_url ? (
                        <img
                          src={p.imagen_url}
                          alt={p.nombre}
                          loading="lazy"
                          className="
                            absolute
                            inset-0
                            w-full
                            h-full
                            object-cover
                            transition-transform
                            duration-500
                            group-hover:scale-105
                          "
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-widest opacity-30 text-[var(--color-text)]">
                          Sin foto
                        </div>
                      )}
                    </div>
                  </div>

                  {/* INFO */}
                  <div className="p-3.5 pt-2 flex flex-col flex-1 bg-[var(--color-bg)]/20">
                    <h3
                      className="
                        text-xs
                        sm:text-sm
                        font-medium
                        leading-snug
                        line-clamp-2
                        min-h-[2.7rem]
                        text-[var(--color-text)]/90
                        group-hover:text-[var(--color-primary)]
                        transition-colors
                      "
                    >
                      {p.nombre}
                    </h3>

                    <div className="mt-auto pt-2">
                      <span className="text-sm sm:text-base font-bold tracking-tight text-[var(--color-price)]">
                        ${Number(p.precio ?? 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}