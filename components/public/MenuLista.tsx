"use client";

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
  colorFondoCategoria,  // 👈 Añadir
  colorTextoCategoria,  // 👈 Añadir
  colorBorderCategoria, // 👈 Añadir
}: MenuListaProps) {
  const safeCategorias = categorias ?? [];

  if (safeCategorias.length === 0) {
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
      {safeCategorias.map((categoria) => {
        const productosValidos = (categoria.productos ?? []).filter(
          (p) => p && p.slug && p.nombre
        );

        return (
          <section
            key={categoria.id}
            id={`cat-${categoria.id}`}
            className="scroll-mt-24"
          >
            {/* 🚀 NUEVO COMPONENTE DE ENCABEZADO REUTILIZADO */}
            <HeaderCategoria 
              nombre={categoria.nombre} 
              totalProductos={productosValidos.length}
              colorFondoCategoria={colorFondoCategoria}
              colorTextoCategoria={colorTextoCategoria}
              colorBorderCategoria={colorBorderCategoria} 
            />

            <CategoriaSection categoria={categoria} countryCode={countryCode} />
          </section>
        );
      })}
    </div>
  );
}