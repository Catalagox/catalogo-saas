"use client";

import MenuHeader from "@/components/public/MenuHeader";
import MenuFooter from "@/components/public/MenuFooter";
import MenuLista from "@/components/public/MenuLista";
import MenuGaleria from "@/components/public/MenuGaleria";

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
}

interface MenuClientProps {
  catalogo: Catalogo | null;
  categorias: Categoria[];
}

export default function MenuClient({ catalogo, categorias }: MenuClientProps) {

  if (!catalogo) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400">
        Cargando menú...
      </div>
    );
  }

  const safeCategorias = categorias ?? [];

  // 🔥 FIX: usar directamente el valor de la BD
  const viewMode = catalogo.estilo_menu ?? "lista";

  // 🎨 VARIABLES BASE
  const colorFondo = catalogo.color_fondo ?? "#111827";
  const colorHeader = catalogo.color_header ?? "#1680f9";
  const colorFooter = catalogo.color_footer ?? "#111827";
  const colorTexto = catalogo.color_texto ?? "#ffffff";
  const colorPrecio = catalogo.color_precio ?? "#22c55e";
  const colorHamburguesa = catalogo.color_hamburguesa ?? "#ffffff";
  const colorTarjeta = catalogo.color_tarjeta ?? "#ffffff10";
  const colorCategoria = catalogo.color_categoria ?? "#ffffff";
  const colorPrimario = catalogo.color_primario ?? "#f97316";

  // 🎨 CSS VARIABLES GLOBAL
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
  } as React.CSSProperties;

  return (
    <div
      className="min-h-screen flex flex-col bg-[var(--color-bg)]"
      style={theme}
    >

      {/* HEADER */}
      <MenuHeader
        catalogo={catalogo}
        categorias={safeCategorias}
      />

      {/* MAIN */}
      <main className="max-w-3xl mx-auto w-full p-4 flex-grow">

        {viewMode === "lista" ? (
          <MenuLista categorias={safeCategorias} />
        ) : catalogo.slug ? (
          <MenuGaleria
            categorias={safeCategorias}
            slug={catalogo.slug}
          />
        ) : (
          <div className="text-center text-red-400 py-10">
            Error: slug no disponible
          </div>
        )}

      </main>

      {/* FOOTER */}
      <MenuFooter />

    </div>
  );
}