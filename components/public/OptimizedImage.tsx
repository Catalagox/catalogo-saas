
"use client";

import { useState, type CSSProperties } from "react";
import Image, { type ImageProps } from "next/image";

interface OptimizedImageProps
  extends Omit<ImageProps, "onLoad" | "onError"> {
  containerClassName?: string;
  containerStyle?: CSSProperties;
  mostrarMensajeError?: boolean;

  /**
   * "tema": utiliza el ajuste elegido en el editor.
   * "contain": muestra la fotografía completa.
   * "cover": llena el cuadro y puede recortar la fotografía.
   */
  ajuste?: "tema" | "contain" | "cover";
}

function obtenerClaveImagen(src: ImageProps["src"]): string {
  if (typeof src === "string") return src;
  if ("src" in src) return src.src;

  return src.default.src;
}

/**
 * Evita las transformaciones automáticas de Next.js para las
 * imágenes públicas de Supabase, conservando el archivo original.
 */
function esImagenPublicaSupabase(src: ImageProps["src"]): boolean {
  if (typeof src !== "string") return false;

  try {
    const url = new URL(src);

    const esSupabase = url.hostname.endsWith(".supabase.co");

    const esRutaPublica =
      url.pathname.startsWith("/storage/v1/object/public/") ||
      url.pathname.startsWith("/storage/v1/render/image/public/");

    return (
      (url.protocol === "https:" || url.protocol === "http:") &&
      esSupabase &&
      esRutaPublica
    );
  } catch {
    return false;
  }
}

type EstadoImagen = "loading" | "loaded" | "error";

function ImagenConEstado({
  src,
  alt,
  className = "",
  containerClassName = "",
  containerStyle,
  mostrarMensajeError = true,
  ajuste = "tema",
  style,
  fill,
  unoptimized,
  ...imageProps
}: OptimizedImageProps) {
  const [estado, setEstado] = useState<EstadoImagen>("loading");

  const estiloImagen: CSSProperties = {
    objectPosition: "center",
    ...style,
    ...(ajuste !== "tema" ? { objectFit: ajuste } : {}),
  };

  const estiloContenedor: CSSProperties = {
  position: "relative",
  overflow: "hidden",
  width: "100%",
  ...(fill
    ? { height: "100%", minHeight: 1 }
    : { aspectRatio: "var(--tienda-image-ratio, 1 / 1)" }),
  ...containerStyle,
};

  const usarOriginalSupabase = esImagenPublicaSupabase(src);

  return (
    <div
      className={`relative overflow-hidden bg-black/5 ${containerClassName}`}
      style={estiloContenedor}
      data-image-status={estado}
      aria-busy={estado === "loading"}
    >
      {estado === "loading" && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 bg-black/10 motion-safe:animate-pulse"
        />
      )}

      {estado === "error" && mostrarMensajeError && (
        <div
          role="img"
          aria-label={`No se pudo cargar la imagen: ${alt}`}
          className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-black/5 p-4 text-center"
        >
          <span className="text-xs font-medium text-[var(--color-text)] opacity-60">
            Imagen no disponible
          </span>
        </div>
      )}

      <Image
        {...imageProps}
        src={src}
        alt={alt}
        fill={fill}
        unoptimized={unoptimized ?? usarOriginalSupabase}
        onLoad={() => setEstado("loaded")}
        onError={() => setEstado("error")}
        style={estiloImagen}
        className={`[object-fit:var(--tienda-image-fit,cover)] transition-opacity duration-300 ${
          estado === "loaded" ? "opacity-100" : "opacity-0"
        } ${className}`}
      />
    </div>
  );
}

export default function OptimizedImage(props: OptimizedImageProps) {
  return (
    <ImagenConEstado
      key={obtenerClaveImagen(props.src)}
      {...props}
    />
  );
}
