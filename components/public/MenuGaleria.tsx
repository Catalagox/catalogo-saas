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

  // 🎨 COLORES
  colorTexto: string;
  colorPrecio: string;
  colorTarjeta: string;
  colorCategoria: string;
}

export default function MenuGaleria({
  categorias,
  slug,
  colorTexto,
  colorPrecio,
  colorTarjeta,
  colorCategoria,
}: MenuGaleriaProps) {

  if (!categorias || categorias.length === 0) {
    return (
      <div
        className="text-center py-20 border border-dashed rounded-2xl"
        style={{
          borderColor: colorCategoria + "40",
          color: colorTexto,
        }}
      >
        <p className="text-sm uppercase tracking-widest opacity-70">
          Sin productos
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-16 pb-10">
      {categorias.map((cat) => {
        const productosValidos =
          cat.productos?.filter((p) => p && p.slug && p.nombre) || [];

        if (productosValidos.length === 0) return null;

        return (
          <div key={cat.id}>

            {/* 🏷️ CATEGORÍA */}
            <div className="mb-8">
              <div className="flex items-center gap-4">
                <h2
                  className="text-lg font-bold uppercase"
                  style={{ color: colorCategoria }}
                >
                  {cat.nombre}
                </h2>

                <div
                  className="h-[2px] flex-1"
                  style={{
                    background: `linear-gradient(to right, ${colorCategoria}, transparent)`,
                  }}
                />
              </div>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-2 gap-4">
              {productosValidos.map((p, i) => {
                const href = `/${slug}/${p.slug}`;

                return (
                  <Link
                    key={p.id}
                    href={href}
                    className={`group block rounded-2xl overflow-hidden transition ${
                      i % 2 !== 0 ? "mt-10" : ""
                    }`}
                    style={{ backgroundColor: colorTarjeta }}
                  >
                    {/* IMAGEN */}
                    <div className="relative aspect-square overflow-hidden">
                      {p.imagen_url ? (
                        <img
                          src={p.imagen_url}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          alt={p.nombre}
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center text-xs"
                          style={{ color: colorTexto }}
                        >
                          Sin imagen
                        </div>
                      )}
                    </div>

                    {/* INFO */}
                    <div className="p-3 flex flex-col gap-1">

                      <h3
                        className="text-sm font-semibold line-clamp-2"
                        style={{ color: colorTexto }}
                      >
                        {p.nombre}
                      </h3>

                      <span
                        className="text-xs font-bold"
                        style={{ color: colorPrecio }}
                      >
                        ${Number(p.precio || 0).toLocaleString()}
                      </span>

                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}