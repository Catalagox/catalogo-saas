"use client";

import { useRouter, useParams } from "next/navigation";

// 🔥 Tipado real
interface Producto {
  id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  imagen_url?: string;
  slug: string;
}

interface Props {
  producto: Producto;
}

export default function ProductoCard({ producto }: Props) {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  if (!producto) return null;

  const handleClick = () => {
    if (!producto.slug) return;
    router.push(`/${slug}/${producto.slug}`);
  };

  return (
    <div
      onClick={handleClick}
      
      className="group rounded-2xl p-3 flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-all duration-300 bg-[var(--color-card)] border border-white/10 md:hover:border-[var(--color-categoria)] active:bg-white/[0.02] outline-none touch-manipulation"
    >
      
      {producto.imagen_url ? (
        <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-xl bg-white">
          <img
            src={producto.imagen_url}
            alt={producto.nombre}
            loading="lazy"
         
            decoding="async"
            className="w-full h-full object-contain transition-transform duration-500 md:group-hover:scale-110"
          />
        </div>
      ) : (
        <div className="w-24 h-24 flex items-center justify-center rounded-xl text-xs bg-white/10 text-[var(--color-text)]">
          Sin foto
        </div>
      )}

      
      <div className="flex-1 flex flex-col min-w-0">
        
        <h3 className="font-semibold text-base leading-tight truncate text-[var(--color-text)]">
          {producto.nombre}
        </h3>

        
        {producto.descripcion && (
          <p className="text-sm mt-1 line-clamp-2 opacity-70 text-[var(--color-text)]">
            {producto.descripcion}
          </p>
        )}

        
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm font-bold text-[var(--color-price)]">
            ${Number(producto.precio || 0).toLocaleString()}
          </span>

        
          <span className="text-[10px] px-2 py-1 rounded-md opacity-0 md:group-hover:opacity-100 transition bg-[var(--color-price)]/20 text-[var(--color-price)]">
            Ver
          </span>
        </div>
      </div>
    </div>
  );
}