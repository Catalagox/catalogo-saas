"use client";

import { useState, useEffect } from "react";
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

  // 🛡️ seguridad
  if (!catalogo) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400">
        Cargando menú...
      </div>
    );
  }

  const safeCategorias = categorias ?? [];

  const [viewMode, setViewMode] = useState<"lista" | "galeria">("lista");

  useEffect(() => {
    if (catalogo.estilo_menu) {
      setViewMode(catalogo.estilo_menu);
    }
  }, [catalogo.estilo_menu]);

  // 🎨 COLORES (con fallback seguro)
  const colorFondo = catalogo.color_fondo ?? "#111827";
  const colorHeader = catalogo.color_header ?? "#f97316";
  const colorFooter = catalogo.color_footer ?? "#111827";
  const colorTexto = catalogo.color_texto ?? "#ffffff";
  const colorPrecio = catalogo.color_precio ?? "#22c55e";
  const colorHamburguesa = catalogo.color_hamburguesa ?? "#ffffff";
  const colorTarjeta = catalogo.color_tarjeta ?? "#ffffff10";
  const colorCategoria = catalogo.color_categoria ?? "#ffffff";

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: colorFondo }}
    >

      {/* HEADER */}
      <MenuHeader
        catalogo={catalogo}
        categorias={safeCategorias}
        colorHeader={colorHeader}
        colorTexto={colorTexto}
        colorHamburguesa={colorHamburguesa}
        colorCategoria={colorCategoria} // 🔥 FIX CLAVE
      />

      {/* MAIN */}
      <main className="max-w-3xl mx-auto w-full p-4 flex-grow">

        {viewMode === "lista" ? (
          <MenuLista
            categorias={safeCategorias}
            colorTexto={colorTexto}
            colorPrecio={colorPrecio}
            colorTarjeta={colorTarjeta}
            colorCategoria={colorCategoria}
          />
        ) : catalogo.slug ? (
          <MenuGaleria
            categorias={safeCategorias}
            slug={catalogo.slug}
            colorTexto={colorTexto}
            colorPrecio={colorPrecio}
            colorTarjeta={colorTarjeta}
            colorCategoria={colorCategoria}
          />
        ) : (
          <div className="text-center text-red-400 py-10">
            Error: slug no disponible
          </div>
        )}

      </main>

      {/* FOOTER */}
      <MenuFooter
        colorFooter={colorFooter}
        colorTexto={colorTexto}
      />

    </div>
  );
}