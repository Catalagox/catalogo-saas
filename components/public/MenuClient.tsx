"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import MenuHeader from "@/components/public/MenuHeader";
import MenuFooter from "@/components/public/MenuFooter";
import MenuLista from "@/components/public/MenuLista";
import MenuGaleria from "@/components/public/MenuGaleria";
import CategoriasSlider from "@/components/public/CategoriasSlider";
import  CartDrawer  from "@/components/public/CartDrawer";
import { useCart } from "@/context/CartContext";

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
  pais_code?: string;

  // COLORES
  color_primario?: string;
  color_fondo?: string;
  color_header?: string;
  color_text_header?: string;
  color_border_header?: string;
  color_footer?: string;
  color_texto?: string;
  color_precio?: string;
  color_hamburguesa?: string;
  color_tarjeta?: string;
  color_categoria?: string;
  color_lupa?: string;
  color_fondo_categoria?: string;
  color_texto_categoria?: string;
  color_border_categoria?: string;

  // CONTACTO
  whatsapp?: string;

  // REDES
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  youtube?: string;
}

interface MenuClientProps {
  catalogo: Catalogo | null;
  categorias: Categoria[];
  countryCode?: string;
}

export default function MenuClient({
  catalogo,
  categorias,
  countryCode,
}: MenuClientProps) {
  // Evitar tracking duplicado
  const categoriasVisitadas = useRef<Set<string>>(new Set());

  // Estado del Carrito
  const { cantidadTotal } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Tracking de categorías vistas
  const trackCategoria = useCallback(
    (categoriaId: string) => {
      if (!catalogo?.user_id) return;
      if (categoriasVisitadas.current.has(categoriaId)) return;
      categoriasVisitadas.current.add(categoriaId);

      (async () => {
        try {
          await supabase.from("estadisticas").insert({
            user_id: catalogo.user_id,
            tipo: "categoria_view",
          });
        } catch (err) {
          console.error("TRACKING CATEGORIA ERROR:", err);
        }
      })();
    },
    [catalogo?.user_id]
  );

  // Fallback Skeleton si no hay catálogo
  if (!catalogo) {
    return (
      <div className="min-h-screen w-full max-w-2xl mx-auto p-4 space-y-6 animate-pulse">
        <div className="h-32 bg-gray-800/50 rounded-2xl w-full" />
        <div className="flex gap-2 overflow-hidden">
          <div className="h-8 w-24 bg-gray-800/50 rounded-full shrink-0" />
          <div className="h-8 w-24 bg-gray-800/50 rounded-full shrink-0" />
          <div className="h-8 w-24 bg-gray-800/50 rounded-full shrink-0" />
        </div>
        <div className="space-y-4 pt-4">
          <div className="h-24 bg-gray-800/40 rounded-xl w-full" />
          <div className="h-24 bg-gray-800/40 rounded-xl w-full" />
          <div className="h-24 bg-gray-800/40 rounded-xl w-full" />
        </div>
      </div>
    );
  }

  const safeCategorias = categorias ?? [];
  const viewMode = catalogo.estilo_menu ?? "lista";
  const userCountry = countryCode ?? catalogo.pais_code ?? "PE";

  const colorFondo = catalogo.color_fondo ?? "#fefefe";
  const colorHeader = catalogo.color_header ?? "#2c2c2c";
  const colorTextHeader = catalogo.color_text_header ?? "#ffffff";
  const colorBorderHeader = catalogo.color_border_header ?? "rgba(255,255,255,0.1)";
  const colorFooter = catalogo.color_footer ?? "#111827";
  const colorTexto = catalogo.color_texto ?? "#4f4d4d";
  const colorPrecio = catalogo.color_precio ?? "#22c55e";
  const colorHamburguesa = catalogo.color_hamburguesa ?? "#ffffff";
  const colorTarjeta = catalogo.color_tarjeta ?? "#ffffff10";
  const colorCategoria = catalogo.color_categoria ?? "#eae9e9";
  const colorPrimario = catalogo.color_primario ?? "#f97316";
  const colorLupa = catalogo.color_lupa ?? "#ffffff";
  const colorFondoCategoria = catalogo.color_fondo_categoria ?? "#ffffff";
  const colorTextoCategoria = catalogo.color_texto_categoria ?? "#df0c0c";
  const colorBorderCategoria = catalogo.color_border_categoria ?? "#e5e7eb";

  // Mapeo CSS Theme
  const theme = useMemo(
    () =>
      ({
        "--color-bg": colorFondo,
        "--color-header": colorHeader,
        "--color-text-header": colorTextHeader,
        "--color-border-header": colorBorderHeader,
        "--color-footer": colorFooter,
        "--color-text": colorTexto,
        "--color-price": colorPrecio,
        "--color-hamburguesa": colorHamburguesa,
        "--color-card": colorTarjeta,
        "--color-categoria": colorCategoria,
        "--color-primary": colorPrimario,
        "--color-lupa": colorLupa,
        "--color-fondo-categoria": colorFondoCategoria,
        "--color-texto-categoria": colorTextoCategoria,
        "--color-border-categoria": colorBorderCategoria,
      } as React.CSSProperties),
    [
      colorFondo,
      colorHeader,
      colorTextHeader,
      colorBorderHeader,
      colorFooter,
      colorTexto,
      colorPrecio,
      colorHamburguesa,
      colorTarjeta,
      colorCategoria,
      colorPrimario,
      colorLupa,
      colorFondoCategoria,
      colorTextoCategoria,
      colorBorderCategoria,
    ]
  );

  return (
    <div
      className="min-h-screen w-full flex flex-col bg-[var(--color-bg)] transition-colors duration-300 relative"
      style={theme}
    >
      {/* HEADER PRINCIPAL */}
      <MenuHeader catalogo={catalogo} categorias={safeCategorias} />

      {/* SUB-BARRA DE CATEGORIAS */}
      <CategoriasSlider
        categorias={safeCategorias}
        onTrackCategoria={trackCategoria}
        colorFondoCategoria={colorFondoCategoria}
        colorTextoCategoria={colorTextoCategoria}
        colorBorderCategoria={colorBorderCategoria}
        colorHeader={colorHeader}
        colorTextHeader={colorTextHeader}
        colorBorderHeader={colorBorderHeader}
      />

      {/* MAIN */}
      <main className="max-w-7xl mx-auto w-full px-0 sm:px-6 lg:px-8 pt-8 pb-0 mb-0 flex-grow">
        {viewMode === "lista" ? (
          <MenuLista
            categorias={safeCategorias}
            countryCode={userCountry}
            colorFondoCategoria={colorFondoCategoria}
            colorTextoCategoria={colorTextoCategoria}
            colorBorderCategoria={colorBorderCategoria}
          />
        ) : catalogo.slug ? (
          <MenuGaleria
            categorias={safeCategorias}
            slug={catalogo.slug}
            countryCode={userCountry}
            colorFondoCategoria={colorFondoCategoria}
            colorTextoCategoria={colorTextoCategoria}
            colorBorderCategoria={colorBorderCategoria}
          />
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

      {/* BOTÓN FLOTANTE CARRITO */}
      {isMounted && cantidadTotal > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 p-4 rounded-full text-white shadow-2xl flex items-center justify-center gap-2 z-50 transition-transform active:scale-95 touch-manipulation"
          style={{ backgroundColor: "var(--color-primary)" }}
          aria-label="Ver carrito"
        >
          <span className="text-2xl">🛒</span>
          <span className="font-bold bg-white text-black text-xs px-2 py-0.5 rounded-full absolute -top-1 -right-1 shadow">
            {cantidadTotal}
          </span>
        </button>
      )}

      {/* COMPONENTE MODAL / DRAWER DEL CARRITO */}
      {isMounted && (
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          catalogoNombre={catalogo.nombre}
          whatsapp={catalogo.whatsapp}
          userCountry={userCountry}
        />
      )}
    </div>
  );
}