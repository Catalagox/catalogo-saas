"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Price from "@/components/ui/Price";

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
  countryCode?: string; 
  isPriority?: boolean;
}

export default function ProductoCard({ 
  producto, 
  countryCode = "PE", 
  isPriority = false 
}: Props) {
  const params = useParams();
  const slug = (params?.slug as string) || "";

  if (!producto) return null;

  return (
    <Link
      href={`/${slug}/${producto.slug}`}
      className="group rounded-none p-3 flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-all duration-300 bg-[var(--color-card)] border border-white/10 md:hover:border-[var(--color-categoria)] active:bg-white/[0.02] outline-none touch-manipulation"
    >
      {producto.imagen_url ? (
        <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-none bg-white/[0.01]">
          <Image
            src={producto.imagen_url}
            alt={producto.nombre}
            fill
            sizes="96px"
            priority={isPriority}
            loading={isPriority ? "eager" : "lazy"}
            className="object-cover transition-transform duration-500 md:group-hover:scale-110"
          />
        </div>
      ) : (
        <div className="w-24 h-24 flex items-center justify-center rounded-none text-xs bg-white/10 text-[var(--color-text)]">
          Sin foto
        </div>
      )}

      {/* CONTENIDO INFO */}
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
            <Price amount={producto.precio} countryCode={countryCode} />
          </span>

          <span className="text-[10px] px-2 py-1 rounded-md opacity-0 md:group-hover:opacity-100 transition bg-[var(--color-price)]/20 text-[var(--color-price)]">
            Ver
          </span>
        </div>
      </div>
    </Link>
  );
}