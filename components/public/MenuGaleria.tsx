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
      <div
        className="
          text-center
          py-20
          border
          border-dashed
          rounded-md
          border-white/10
          bg-white/[0.02]
          backdrop-blur-sm
        "
      >
        <p
          className="
            text-sm
            uppercase
            tracking-[0.3em]
            opacity-60
            text-[var(--color-text)]
          "
        >
          Sin productos
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-14 pb-16">
      {categorias.map((cat) => {
        const productosValidos = (cat.productos ?? []).filter(
          (p) => p && p.slug && p.nombre,
        );

        if (productosValidos.length === 0) return null;

        return (
          /* 🔥 IMPORTANTE PARA EL SCROLL */
          <section
            key={cat.id}
            id={`categoria-${cat.id}`}
            className="scroll-mt-36"
          >
            {/* 🏷️ HEADER CATEGORÍA */}
            <div className="flex items-center gap-4 mb-7">
              {/* BLOQUE IZQUIERDO */}
              <div
                className="
                  flex
                  items-center
                  gap-3
                  px-4
                  py-2.5
                  rounded-full
                  border
                  border-white/10
                  bg-[var(--color-card)]
                  backdrop-blur-md
                  shadow-sm
                "
              >
                {/* 🔥 PUNTO */}
                <span
                  className="
                    w-2.5
                    h-2.5
                    rounded-full
                    bg-[var(--color-primary)]
                    shadow-[0_0_12px_rgba(34,197,94,0.8)]
                  "
                />

                {/* NOMBRE */}
                <h2
                  className="
                    text-sm
                    font-black
                    uppercase
                    tracking-wide
                    text-[var(--color-categoria)]
                  "
                >
                  {cat.nombre}
                </h2>

                {/* CANTIDAD */}
                <span
                  className="
                    text-[10px]
                    px-2.5
                    py-1
                    rounded-full
                    font-black
                    bg-[var(--color-primary)]/15
                    text-[var(--color-primary)]
                    border
                    border-[var(--color-primary)]/20
                  "
                >
                  {productosValidos.length}
                </span>
              </div>

              {/* LINEA */}
              <div
                className="
                  flex-1
                  h-px
                  bg-gradient-to-r
                  from-[var(--color-primary)]/40
                  to-transparent
                "
              />
            </div>

            {/* 📦 GRID - Corregido para mantener simetría exacta */}
            <div
              className="
                grid
                grid-cols-2
                gap-4
                items-start
              "
            >
              {productosValidos.map((p) => {
                const href = `/${slug}/${p.slug}`;

                return (
                  <Link
                    key={p.id}
                    href={href}
                    className="
                      group
                      relative
                      w-full
                      flex
                      flex-col
                      overflow-hidden
                      rounded-md
                      border
                      border-white/5
                      bg-[var(--color-card)]
                      backdrop-blur-sm
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:border-[var(--color-primary)]/30
                      hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)]
                      active:scale-[0.98]
                    "
                  >
                    {/* ✨ GLOW */}
                    <div
                      className="
                        absolute
                        inset-0
                        opacity-0
                        group-hover:opacity-100
                        transition-opacity
                        duration-500
                        bg-gradient-to-br
                        from-[var(--color-primary)]/10
                        via-transparent
                        to-transparent
                        pointer-events-none
                      "
                    />

                    {/* 🖼️ IMAGEN */}
                    <div
                      className="
                        relative
                        w-full
                        aspect-square
                        overflow-hidden
                        bg-white/[0.03]
                      "
                    >
                      {p.imagen_url ? (
                        <img
                          src={p.imagen_url}
                          alt={p.nombre}
                          className="
                            w-full
                            h-full
                            object-cover
                            transition-transform
                            duration-700
                            group-hover:scale-110
                          "
                        />
                      ) : (
                        <div
                          className="
                            w-full
                            h-full
                            flex
                            items-center
                            justify-center
                            text-[10px]
                            uppercase
                            tracking-[0.25em]
                            opacity-40
                            text-[var(--color-text)]
                          "
                        >
                          Sin foto
                        </div>
                      )}

                      {/* ✨ OVERLAY */}
                      <div
                        className="
                          absolute
                          inset-0
                          bg-gradient-to-t
                          from-black/30
                          via-transparent
                          to-transparent
                        "
                      />
                    </div>

                    {/* 📄 INFO */}
                    <div className="p-4 flex flex-col gap-1.5 justify-between flex-1">
                      {/* NOMBRE */}
                      <h3
                        className="
                          text-sm
                          font-bold
                          leading-tight
                          line-clamp-1
                          text-[var(--color-text)]
                        "
                      >
                        {p.nombre}
                      </h3>

                      {/* PRECIO */}
                      <span
                        className="
                          text-lg
                          font-black
                          tracking-tight
                          text-[var(--color-price)]
                        "
                      >
                        ${Number(p.precio ?? 0).toLocaleString()}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}