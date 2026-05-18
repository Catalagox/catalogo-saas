"use client";

import { useEffect, useState } from "react";

import MenuHeader from "@/components/public/MenuHeader";
import MenuFooter from "@/components/public/MenuFooter";
import MenuLista from "@/components/public/MenuLista";
import MenuGaleria from "@/components/public/MenuGaleria";

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

interface Catalogo {
  id: string;
  nombre: string;
  logo?: string;
  user_id: string;

  estilo_menu?: "lista" | "galeria";

  slug?: string;

  // 🎨 COLORES
  color_primario?: string;
  color_fondo?: string;
  color_header?: string;
  color_footer?: string;
  color_texto?: string;
  color_precio?: string;
  color_hamburguesa?: string;
  color_tarjeta?: string;
  color_categoria?: string;
  color_lupa?: string;

  // 📱 CONTACTO
  whatsapp?: string;

  // 🌎 REDES
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  youtube?: string;
}

interface MenuClientProps {
  catalogo: Catalogo | null;
  categorias: Categoria[];
}

export default function MenuClient({ catalogo, categorias }: MenuClientProps) {
  // 🔥 NO ACTIVAR NADA AL INICIO
  const [categoriaActiva, setCategoriaActiva] = useState<string | null>(null);

  if (!catalogo) {
    return (
      <div
        className="
          flex
          items-center
          justify-center
          min-h-screen
          text-gray-400
        "
      >
        Cargando menú...
      </div>
    );
  }

  const safeCategorias = categorias ?? [];

  // 🔥 VIEW MODE
  const viewMode = catalogo.estilo_menu ?? "lista";

  // 🎨 VARIABLES
  const colorFondo = catalogo.color_fondo ?? "#111827";

  const colorHeader = catalogo.color_header ?? "#1680f9";

  const colorFooter = catalogo.color_footer ?? "#111827";

  const colorTexto = catalogo.color_texto ?? "#ffffff";

  const colorPrecio = catalogo.color_precio ?? "#22c55e";

  const colorHamburguesa = catalogo.color_hamburguesa ?? "#ffffff";

  const colorTarjeta = catalogo.color_tarjeta ?? "#ffffff10";

  const colorCategoria = catalogo.color_categoria ?? "#ffffff";

  const colorPrimario = catalogo.color_primario ?? "#f97316";

  const colorLupa = catalogo.color_lupa ?? "#ffffff";

  // 🎨 CSS VARIABLES
  const theme = {
    "--color-bg": colorFondo,
    "--color-header": colorHeader,
    "--color-footer": colorFooter,
    "--color-text": colorTexto,
    "--color-price": colorPrecio,
    "--color-hamburguesa": colorHamburguesa,
    "--color-card": colorTarjeta,
    "--color-categoria": colorCategoria,
    "--color-primary": colorPrimario,
    "--color-lupa": colorLupa,
  } as React.CSSProperties;

  // 🔥 DETECTAR CATEGORÍA ACTIVA REAL
  useEffect(() => {
    const handleScroll = () => {
      let current: string | null = null;

      safeCategorias.forEach((categoria) => {
        const element = document.getElementById(`categoria-${categoria.id}`);

        if (element) {
          const rect = element.getBoundingClientRect();

          // 🔥 SOLO SI ESTÁ REALMENTE VISIBLE
          if (rect.top <= 140 && rect.bottom >= 140) {
            current = categoria.id;
          }
        }
      });

      setCategoriaActiva(current);
    };

    window.addEventListener("scroll", handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [safeCategorias]);

  return (
    <div
      className="
        min-h-screen
        flex
        flex-col
        bg-[var(--color-bg)]
      "
      style={theme}
    >
      {/* HEADER */}
      <MenuHeader catalogo={catalogo} categorias={safeCategorias} />

      {/* 🔥 CATEGORÍAS */}
      {safeCategorias.length > 0 && (
        <div
          className="
            sticky
            top-0
            z-40
            border-b
            border-white/10
            backdrop-blur-xl
            bg-[var(--color-bg)]/90
          "
        >
          <div
            className="
              overflow-x-auto
              whitespace-nowrap
              scrollbar-hide
            "
          >
            <div
              className="
                flex
                gap-3
                px-4
                py-3
                min-w-max
              "
            >
              {safeCategorias.map((categoria) => {
                const isActive = categoriaActiva === categoria.id;

                return (
                  <button
                    key={categoria.id}
                    onClick={() => {
                      setCategoriaActiva(categoria.id);

                      const element = document.getElementById(
                        `categoria-${categoria.id}`,
                      );

                      element?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }}
                    className={`
                        px-5
                        py-2.5
                        rounded-2xl
                        text-sm
                        font-bold
                        tracking-wide
                        transition-all
                        duration-300
                        border
                        flex-shrink-0
                        shadow-sm
                        backdrop-blur-md

                        ${
                          isActive
                            ? `
                              bg-[var(--color-primary)]
                              text-white
                              border-[var(--color-primary)]
                              scale-105
                              shadow-lg
                            `
                            : `
                              bg-[var(--color-card)]
                              hover:bg-white/10
                              text-[var(--color-categoria)]
                              border-[var(--color-categoria)]/20
                            `
                        }
                      `}
                  >
                    {categoria.nombre}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MAIN */}
      <main
        className="
          max-w-3xl
          mx-auto
          w-full
          p-4
          flex-grow
        "
      >
        {viewMode === "lista" ? (
          <MenuLista categorias={safeCategorias} />
        ) : catalogo.slug ? (
          <MenuGaleria categorias={safeCategorias} slug={catalogo.slug} />
        ) : (
          <div
            className="
              text-center
              text-red-400
              py-10
            "
          >
            Error: slug no disponible
          </div>
        )}
      </main>

      {/* FOOTER */}
      <MenuFooter
        instagram={catalogo.instagram}
        facebook={catalogo.facebook}
        tiktok={catalogo.tiktok}
        youtube={catalogo.youtube}
      />
    </div>
  );
}
