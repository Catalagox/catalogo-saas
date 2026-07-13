"use client";

import Link from "next/link";
import Price from "@/components/ui/Price";
import HeaderCategoria from "@/components/public/HeaderCategoria"; // 🚀 Importamos el nuevo encabezado

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

interface MenuGaleriaProps {
  categorias: Categoria[];
  slug: string;
  countryCode?: string;
  colorFondoCategoria?: string;
  colorTextoCategoria?: string;
  colorBorderCategoria?: string;
}

export default function MenuGaleria({
  categorias,
  slug,
  countryCode = "PE",
  colorFondoCategoria = "#ffffff",
  colorTextoCategoria = "#111827",
  colorBorderCategoria = "#e5e7eb",
}: MenuGaleriaProps) {
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
          (p) => p && p.slug && p.nombre,
        );

        if (productosValidos.length === 0) return null;

        return (
          <section
            key={cat.id}
            id={`cat-${cat.id}`}
            className="scroll-mt-24 overflow-x-hidden"
          >
            {/* 🚀 CORRECCIÓN: Nombres de propiedades ajustados a la interfaz de HeaderCategoria */}
            <HeaderCategoria
              nombre={cat.nombre}
              totalProductos={productosValidos.length}
              colorTextoCategoria={colorTextoCategoria}
            />

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
                  id={`prod-${p.id}`}
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
                    md:hover:bg-white/[0.03]
                    active:bg-white/[0.02]
                    transition-all
                    duration-200
                    scroll-mt-24
                    outline-none
                    touch-manipulation
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
                          decoding="async"
                          className="
                            absolute
                            inset-0
                            w-full
                            h-full
                            object-cover
                            transition-transform
                            duration-500
                            md:group-hover:scale-105
                            bg-[var(--color-card)]
                          "
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-widest opacity-30 text-[var(--color-text)]">
                          Sin foto
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-3.5 pt-2 flex flex-col flex-1 bg-[var(--color-bg)]/20">
                    <h3
                      className="
                     text-xs sm:text-sm
                     font-medium leading-snug
                      h-[2.7rem]
                      overflow-hidden
                      text-[var(--color-text)]
                      transition-colors duration-200
                      "
                      style={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2,
                        overflow: "hidden",
                      }}
                    >
                      {p.nombre}
                    </h3>

                    <div className="mt-auto pt-2">
                      <div className="text-sm sm:text-base font-bold tracking-tight text-[var(--color-price)]">
                        <Price amount={p.precio} countryCode={countryCode} />
                      </div>
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
