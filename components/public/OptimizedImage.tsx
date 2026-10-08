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
  ...imageProps
}: OptimizedImageProps) {
  const [estado, setEstado] = useState<EstadoImagen>("loading");

  const estiloImagen: CSSProperties = {
    objectPosition: "center",
    ...style,

    // Un ajuste explícito tiene prioridad sobre el estilo recibido.
    ...(ajuste !== "tema" ? { objectFit: ajuste } : {}),
  };

  return (
    <div
      className={`relative overflow-hidden bg-black/5 ${containerClassName}`}
      style={{
        aspectRatio: "var(--tienda-image-ratio, 1 / 1)",
        ...containerStyle,
      }}
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

export default function OptimizedImage(
  props: OptimizedImageProps,
) {
  return (
    <ImagenConEstado
      key={obtenerClaveImagen(props.src)}
      {...props}
    />
  );
}