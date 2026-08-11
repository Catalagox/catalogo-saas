"use client";

import { useMemo } from "react";
import CategoriaSection from "@/components/public/CategoriaSection";
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

interface MenuListaProps {
  categorias: Categoria[];
  countryCode?: string; 
  colorFondoCategoria?: string;  // 👈 Añadir
  colorTextoCategoria?: string;  // 👈 Añadir
  colorBorderCategoria?: string; // 👈 Añadir
}

export default function MenuLista({ 
  categorias, 
  countryCode = "PE",
  colorFondoCategoria,
  colorTextoCategoria,
  colorBorderCategoria,
}: MenuListaProps) {
  const categoriasProcesadas = useMemo(() => {
    if (!categorias) return [];
    return categorias
      .map((cat) => ({
        ...cat,
        productosValidos: (cat.productos ?? []).filter(
          (p) => p && p.slug && p.nombre
        ),
      }))
      .filter((cat) => cat.productosValidos.length > 0);
  }, [categorias]);

  if (categoriasProcesadas.length === 0) {
    return (
      <div className="text-center py-24 px-6 rounded-3xl border border-dashed border-white/10 bg-white/[0.02] backdrop-blur-sm">
        <div className="space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 flex items-center justify-center">
            <span className="text-2xl">🍽️</span>
          </div>
          <p className="text-sm tracking-wide text-[var(--color-text)] opacity-70">
            No hay categorías configuradas aún.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-14 pb-16 animate-fade-in">
      {categoriasProcesadas.map((categoria, catIndex) => (
        <section
          key={categoria.id}
          id={`cat-${categoria.id}`}
          className="scroll-mt-24 px-2 sm:px-6 rounded-none"
        >
          <HeaderCategoria 
            nombre={categoria.nombre} 
            totalProductos={categoria.productosValidos.length}
            colorTextoCategoria={colorTextoCategoria}
          />

          <CategoriaSection 
            categoria={{
              ...categoria,
              productos: categoria.productosValidos,
            }} 
            countryCode={countryCode}
            isFirstCategory={catIndex === 0}
          />
        </section>
      ))}
    </div>
  );
  }