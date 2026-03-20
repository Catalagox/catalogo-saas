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
}

export default function MenuGaleria({ categorias, slug }: MenuGaleriaProps) {

  if (!categorias || categorias.length === 0) {
    return (
      <div className="text-center text-gray-400 py-20 border border-dashed border-gray-200">
        <p className="text-sm uppercase tracking-widest">Sin productos</p>
      </div>
    );
  }

  return (
    <div className="space-y-20 pb-10">
      {categorias.map((cat) => {
        const productosValidos = cat.productos?.filter(p => p && p.slug && p.nombre) || [];
        
        if (productosValidos.length === 0) return null;

        return (
          <div key={cat.id} className="flex flex-col">
            
            {/* 🏷️ NOMBRE DE LA CATEGORÍA (Alineado a la izquierda) */}
            <div className="mb-10">
              <div className="flex items-end gap-4">
                <h2 className="text-1xl font-black text-zinc-900 uppercase tracking-tighter leading-none">
                  {cat.nombre}
                </h2>
                {/* Línea decorativa que llena el espacio restante */}
                <div className="h-[2px] flex-1 bg-zinc-100 mb-1"></div>
              </div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-orange-500 font-bold mt-2">
                Selección exclusiva
              </p>
            </div>

            {/* GRID DE PRODUCTOS EN CASCADA */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-12">
              {productosValidos.map((p, i) => {
                const href = `/${slug}/${p.slug}`;

                return (
                  <Link
                    key={p.id}
                    href={href}
                    className={`group block bg-white border border-zinc-100 shadow-sm transition-all duration-300 hover:shadow-md ${
                      i % 2 === 0 ? "mt-0" : "mt-14" // Mantenemos el efecto cascada
                    }`}
                  >
                    {/* Imagen Cuadrada 100% */}
                    <div className="relative aspect-square overflow-hidden bg-zinc-50 border-b border-zinc-50">
                      {p.imagen_url ? (
                        <img
                          src={p.imagen_url}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          alt={p.nombre}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-100 text-[9px] text-zinc-400 uppercase">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* Texto con jerarquía clara */}
                    <div className="p-4 flex flex-col justify-between min-h-[110px]">
                      <h3 className="text-[12px] font-extrabold text-zinc-900 uppercase tracking-tight leading-tight line-clamp-2">
                        {p.nombre}
                      </h3>

                      <div className="mt-auto pt-3 border-t border-zinc-50">
                        <span className="text-[10px] text-zinc-400 uppercase font-bold block mb-1">Precio</span>
                        <p className="text-sm font-black text-orange-600">
                          ${Number(p.precio || 0).toLocaleString("es-AR")}
                        </p>
                      </div>
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