"use client";

import { useRouter, useParams } from "next/navigation";
import Image from "next/image";

interface Props {
  producto: any;

  // 🎨 COLORES
  colorTexto: string;
  colorPrecio: string;
  colorTarjeta: string;
}

export default function ProductoCard({
  producto,
  colorTexto,
  colorPrecio,
  colorTarjeta,
}: Props) {
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
      className="group rounded-2xl p-3 flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-all duration-300"
      style={{
        backgroundColor: colorTarjeta,
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* 🖼️ IMAGEN */}
      {producto.imagen_url ? (
        <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-xl">
          <Image
            src={producto.imagen_url}
            alt={producto.nombre}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      ) : (
        <div
          className="w-24 h-24 flex items-center justify-center rounded-xl text-xs"
          style={{ backgroundColor: "#ffffff10", color: colorTexto }}
        >
          Sin foto
        </div>
      )}

      {/* 📦 INFO */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* NOMBRE */}
        <h3
          className="font-semibold text-base leading-tight truncate"
          style={{ color: colorTexto }}
        >
          {producto.nombre}
        </h3>

        {/* DESCRIPCIÓN */}
        {producto.descripcion && (
          <p
            className="text-sm mt-1 line-clamp-2 opacity-70"
            style={{ color: colorTexto }}
          >
            {producto.descripcion}
          </p>
        )}

        {/* PRECIO */}
        <div className="mt-2 flex items-center justify-between">
          <span
            className="text-sm font-bold"
            style={{ color: colorPrecio }}
          >
            ${Number(producto.precio).toLocaleString()}
          </span>

          {/* BADGE */}
          <span
            className="text-[10px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition"
            style={{
              backgroundColor: colorPrecio + "20",
              color: colorPrecio,
            }}
          >
            Ver
          </span>
        </div>

      </div>
    </div>
  );
}