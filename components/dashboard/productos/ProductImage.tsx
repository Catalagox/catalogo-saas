"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageIcon } from "lucide-react";

type Props = {
  src?: string | null;
  alt: string;
};

export default function ProductImage({ src, alt }: Props) {
  const [isLoading, setLoading] = useState(true);

  return (
    <div className="relative w-full overflow-hidden bg-gray-800 aspect-[4/3] sm:aspect-video group">
      {/* 1. Estado de carga / Placeholder con Icono */}
      {(!src || isLoading) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-gray-700">
          <ImageIcon className="w-12 h-12 animate-pulse" />
        </div>
      )}

      {/* 2. La Imagen con Next.js optimizada */}
      <Image
        src={src || "/placeholder-food.png"} // Asegúrate de tener un placeholder bonito
        alt={alt}
        fill // Usamos fill para que se adapte al contenedor padre
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className={`
          object-cover 
          transition-all duration-500 ease-in-out
          group-hover:scale-110
          ${isLoading ? "scale-110 blur-xl grayscale" : "scale-100 blur-0 grayscale-0"}
        `}
        onLoadingComplete={() => setLoading(false)}
      />

      {/* 3. Overlay sutil para mejorar el contraste (opcional) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
}