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
}

interface MenuClientProps {
  catalogo: Catalogo;
  categorias: Categoria[];
}

export default function MenuClient({ catalogo, categorias }: MenuClientProps) {
  
  // 🛡️ fallback seguro
  const safeCategorias = categorias ?? [];

  const [viewMode, setViewMode] = useState<"lista" | "galeria">("lista");

  useEffect(() => {
    if (catalogo?.estilo_menu) {
      setViewMode(catalogo.estilo_menu);
    }
  }, [catalogo]);

  // 🛡️ loading básico
  if (!catalogo) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400">
        Cargando menú...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      <MenuHeader catalogo={catalogo} categorias={safeCategorias} />

      <main className="max-w-3xl mx-auto w-full p-4 flex-grow">

        {viewMode === "lista" ? (
          <MenuLista categorias={safeCategorias} />
        ) : catalogo?.slug ? (
          <MenuGaleria
            categorias={safeCategorias}
            slug={catalogo.slug} // 🔥 FIX CLAVE
          />
        ) : (
          // 🧨 fallback si algo viene mal
          <div className="text-center text-red-400 py-10">
            Error: slug no disponible
          </div>
        )}

      </main>

      <MenuFooter />
    </div>
  );
}