"use client";

import { useRouter, useParams } from "next/navigation";
import Image from "next/image";

export default function ProductoCard({ producto }: any) {
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
      className="group bg-white border border-zinc-100 rounded-2xl p-3 flex items-center gap-4 
                 cursor-pointer hover:border-orange-200 hover:shadow-lg hover:shadow-orange-100/50 
                 active:scale-[0.98] transition-all duration-300"
    >
      {/* 1. Imagen a la Izquierda con Aspecto Pulido */}
      {producto.imagen_url ? (
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 overflow-hidden rounded-xl bg-zinc-50">
          <Image
            src={producto.imagen_url}
            alt={producto.nombre}
            fill
            sizes="(max-width: 768px) 100px, 120px"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      ) : (
        // Placeholder elegante si no hay imagen
        <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 bg-zinc-50 rounded-xl flex items-center justify-center border border-dashed border-zinc-200">
          <span className="text-zinc-300 text-xs">Sin foto</span>
        </div>
      )}

      {/* 2. Información del Producto */}
      <div className="flex-1 flex flex-col min-w-0 py-1">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-bold text-zinc-800 text-base sm:text-lg leading-tight truncate group-hover:text-orange-600 transition-colors">
            {producto.nombre}
          </h3>
        </div>

        {producto.descripcion && (
          <p className="text-sm text-zinc-500 line-clamp-2 mt-1 leading-relaxed">
            {producto.descripcion}
          </p>
        )}

        <div className="mt-auto pt-2 flex items-center justify-between">
          <span className="text-lg font-extrabold text-zinc-900">
            ${Number(producto.precio).toLocaleString('es-CL')} 
          </span>
          
          {/* Badge de "Ver más" sutil para mejorar el UX en móvil */}
          <span className="text-[10px] font-bold uppercase tracking-wider text-orange-500 bg-orange-50 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
            Detalles
          </span>
        </div>
      </div>
    </div>
  );
}