"use client";

import ProductoCard from "@/components/public/ProductoCard";

// 🔥 Tipado real (NO any)
interface Producto {
  id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  imagen_url?: string;
  slug: string;
}

interface Categoria {
  id: string;
  nombre: string;
  productos: Producto[];
}

interface Props {
  categoria: Categoria;
}

export default function CategoriaSection({ categoria }: Props) {

  // 🛡️ Seguridad
  const productosValidos =
    (categoria.productos ?? []).filter(
      (p) => p && p.id && p.nombre
    );

  if (productosValidos.length === 0) return null;

  return (
    <section
      id={`cat-${categoria.id}`}
      className="scroll-mt-28 py-6"
    >

      {/* 🏷️ HEADER CATEGORÍA */}
      <div className="flex items-center gap-4 mb-6">

        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-[var(--color-card)]">

          {/* 🔥 PUNTO */}
          <span className="w-2 h-2 rounded-full bg-[var(--color-categoria)]" />

          {/* NOMBRE */}
          <h2 className="text-lg font-bold uppercase text-[var(--color-categoria)]">
            {categoria.nombre}
          </h2>

          {/* CANTIDAD */}
          <span className="text-xs px-2 py-1 rounded-full bg-[var(--color-categoria)]/20 text-[var(--color-categoria)]">
            {productosValidos.length}
          </span>
        </div>

        {/* LINEA */}
        <div className="flex-1 h-[1px] bg-[var(--color-categoria)]/30" />

      </div>

      {/* 📦 PRODUCTOS */}
      <div className="grid grid-cols-1 gap-4">
        {productosValidos.map((producto) => (
          <ProductoCard
            key={producto.id}
            producto={producto}
          />
        ))}
      </div>

    </section>
  );
}