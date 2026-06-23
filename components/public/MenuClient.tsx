"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
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
  color_text_header?: string;   // 🔥 NUEVO: Agregado en el tipo Catalogo
  color_border_header?: string; // 🔥 NUEVO: Agregado en el tipo Catalogo
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
  const [categoriaActiva, setCategoriaActiva] = useState<string | null>(null);
  
  // 🔥 ESTADOS PARA EL EFECTO AUTOMÁTICO TIPO MERCADO LIBRE
  const [showCategories, setShowCategories] = useState(true);
  const lastScrollY = useRef(0);

  // Evitar tracking duplicado
  const categoriasVisitadas = useRef<Set<string>>(new Set());

  if (!catalogo) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400">
        Cargando menú...
      </div>
    );
  }

  const safeCategorias = categorias ?? [];
  const viewMode = catalogo.estilo_menu ?? "lista";

  const colorFondo = catalogo.color_fondo ?? "#111827";
  const colorHeader = catalogo.color_header ?? "#f97316";
  const colorTextHeader = catalogo.color_text_header ?? "#ffffff";       // 🔥 NUEVO
  const colorBorderHeader = catalogo.color_border_header ?? "rgba(255,255,255,0.1)"; // 🔥 NUEVO
  const colorFooter = catalogo.color_footer ?? "#111827";
  const colorTexto = catalogo.color_texto ?? "#ffffff";
  const colorPrecio = catalogo.color_precio ?? "#22c55e";
  const colorHamburguesa = catalogo.color_hamburguesa ?? "#ffffff";
  const colorTarjeta = catalogo.color_tarjeta ?? "#ffffff10";
  const colorCategoria = catalogo.color_categoria ?? "#ffffff";
  const colorPrimario = catalogo.color_primario ?? "#f97316";
  const colorLupa = catalogo.color_lupa ?? "#ffffff";

  const theme = {
    "--color-bg": colorFondo,
    "--color-header": colorHeader,
    "--color-text-header": colorTextHeader,       // 🔥 NUEVO: Pasado al CSS global
    "--color-border-header": colorBorderHeader,   // 🔥 NUEVO: Pasado al CSS global
    "--color-footer": colorFooter,
    "--color-text": colorTexto,
    "--color-price": colorPrecio,
    "--color-hamburguesa": colorHamburguesa,
    "--color-card": colorTarjeta,
    "--color-categoria": colorCategoria,
    "--color-primary": colorPrimario,
    "--color-lupa": colorLupa,
  } as React.CSSProperties;

  const trackCategoria = async (categoriaId: string) => {
    if (categoriasVisitadas.current.has(categoriaId)) return;
    categoriasVisitadas.current.add(categoriaId);

    try {
      await supabase.from("estadisticas").insert({
        user_id: catalogo.user_id,
        tipo: "categoria_view",
      });
    } catch (err) {
      console.error("TRACKING CATEGORIA ERROR:", err);
    }
  };

  // 🔥 DETECTAR SCROLL: CAMBIO DE CATEGORÍA ACTIVA + EFECTO OCULTAR/MOSTRAR
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 1. LÓGICA MOSTRAR/OCULTAR (Estilo Mercado Libre)
      if (currentScrollY > lastScrollY.current && currentScrollY > 150) {
        setShowCategories(false);
      } else {
        setShowCategories(true);
      }
      lastScrollY.current = currentScrollY;

      // 2. LÓGICA DETECTAR CATEGORÍA ACTIVA
      let current: string | null = null;
      safeCategorias.forEach((categoria) => {
        const element = document.getElementById(`categoria-${categoria.id}`);
        if (element) {
          const rect = element.getBoundingClientRect();
          const offsetCheck = showCategories ? 160 : 90;
          if (rect.top <= offsetCheck && rect.bottom >= offsetCheck) {
            current = categoria.id;
          }
        }
      });

      if (current && current !== categoriaActiva) {
        setCategoriaActiva(current);
        trackCategoria(current);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [safeCategorias, categoriaActiva, showCategories]);

  return (
    <div
      className="min-h-screen w-full flex flex-col bg-[var(--color-bg)] transition-colors duration-300"
      style={theme}
    >
      {/* HEADER PRINCIPAL */}
      <MenuHeader catalogo={catalogo} categorias={safeCategorias} />

      {/* 🔥 SUB-BARRA DE CATEGORÍAS (Mismo fondo sólido y sin blur transparente) */}
      {safeCategorias.length > 0 && (
        <div
          className={`sticky z-40 w-full border-b border-white/10 bg-[var(--color-bg)] transition-all duration-300 ease-in-out ${
            showCategories 
              ? "top-20 opacity-100 translate-y-0" 
              : "top-0 md:top-20 opacity-0 -translate-y-full pointer-events-none"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="overflow-x-auto whitespace-nowrap py-3 flex gap-3 scrollbar-hide">
              {safeCategorias.map((categoria) => {
                const isActive = categoriaActiva === categoria.id;

                return (
                  <button
                    key={categoria.id}
                    onClick={() => {
                      setCategoriaActiva(categoria.id);
                      trackCategoria(categoria.id);

                      const element = document.getElementById(
                        `categoria-${categoria.id}`,
                      );

                      if (element) {
                        const yOffset = showCategories ? -150 : -90;
                        const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
                        window.scrollTo({ top: y, behavior: "smooth" });
                      }
                    }}
                    className={`px-5 py-2.5 rounded-2xl text-sm font-bold tracking-wide transition-all duration-300 border flex-shrink-0 shadow-sm ${
                      isActive
                        ? `bg-[var(--color-primary)] text-white border-[var(--color-primary)] scale-105 shadow-lg`
                        : `bg-[var(--color-card)] hover:bg-white/10 text-[var(--color-categoria)] border-[var(--color-categoria)]/20`
                    }`}
                  >
                    {categoria.nombre}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 🛍️ MAIN (Sin paddings laterales en móvil y pegado al footer sin márgenes inferiores) */}
      <main className="max-w-7xl mx-auto w-full px-0 sm:px-6 lg:px-8 pt-8 pb-0 mb-0 flex-grow">
        {viewMode === "lista" ? (
          <MenuLista categorias={safeCategorias} />
        ) : catalogo.slug ? (
          <MenuGaleria categorias={safeCategorias} slug={catalogo.slug} />
        ) : (
          <div className="text-center text-red-400 py-10">
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