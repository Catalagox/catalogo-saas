"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageIcon } from "lucide-react";

type Props = {
  src?: string | null;
  alt: string;
};

function ImagenConCarga({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const [isLoading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <>
      {(isLoading || hasError) && (
        <div
          role={hasError ? "img" : undefined}
          aria-label={
            hasError ? `Imagen no disponible: ${alt}` : undefined
          }
          className="absolute inset-0 flex items-center justify-center bg-[var(--bg-tertiary)] text-[var(--text-muted)]"
        >
          <ImageIcon
            aria-hidden="true"
            className={`h-12 w-12 ${
              isLoading && !hasError ? "animate-pulse" : ""
            }`}
          />
        </div>
      )}

      {!hasError && (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 25vw"
          className={`object-cover transition-all duration-500 ease-in-out group-hover:scale-110 ${
            isLoading
              ? "scale-110 opacity-0 blur-xl grayscale"
              : "scale-100 opacity-100 blur-0 grayscale-0"
          }`}
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setHasError(true);
          }}
        />
      )}
    </>
  );
}

export default function ProductImage({ src, alt }: Props) {
  const imagenSrc = src?.trim();

  return (
    <div className="group relative aspect-[4/3] w-full overflow-hidden bg-[var(--bg-tertiary)] sm:aspect-video">
      {imagenSrc ? (
        <ImagenConCarga
          key={imagenSrc}
          src={imagenSrc}
          alt={alt}
        />
      ) : (
        <div
          role="img"
          aria-label={`Sin imagen: ${alt}`}
          className="absolute inset-0 flex items-center justify-center text-[var(--text-muted)]"
        >
          <ImageIcon
            className="h-12 w-12"
            aria-hidden="true"
          />
        </div>
      )}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
    </div>
  );
}