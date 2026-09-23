"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import Image, {
  type ImageProps,
} from "next/image";

interface OptimizedImageProps
  extends Omit<
    ImageProps,
    "onLoad" | "onError"
  > {
  containerClassName?: string;
  mostrarMensajeError?: boolean;
}

/*
 * ImageProps["src"] contempla todos los formatos
 * permitidos por next/image:
 *
 * - URL en formato string.
 * - StaticImageData.
 * - StaticRequire.
 */
function obtenerClaveImagen(
  src: ImageProps["src"],
): string {
  if (typeof src === "string") {
    return src;
  }

  /*
   * Las imágenes importadas directamente tienen
   * la propiedad src.
   */
  if ("src" in src) {
    return src.src;
  }

  /*
   * Algunos imports CommonJS utilizan:
   * { default: StaticImageData }
   */
  return src.default.src;
}

export default function OptimizedImage({
  src,
  alt,
  className = "",
  containerClassName = "",
  mostrarMensajeError = true,
  ...imageProps
}: OptimizedImageProps) {
  const [cargando, setCargando] =
    useState(true);

  const [errorImagen, setErrorImagen] =
    useState(false);

  const claveImagen = useMemo(
    () => obtenerClaveImagen(src),
    [src],
  );

  /*
   * Reiniciamos los estados cuando cambia la imagen.
   * Es necesario cuando React reutiliza el componente
   * para mostrar otro producto.
   */
  useEffect(() => {
    setCargando(true);
    setErrorImagen(false);
  }, [claveImagen]);

  const imagenCargada = () => {
    setCargando(false);
    setErrorImagen(false);
  };

  const imagenConError = () => {
    setCargando(false);
    setErrorImagen(true);
  };

  const estadoImagen = errorImagen
    ? "error"
    : cargando
      ? "loading"
      : "loaded";

  return (
    <div
      className={`
        relative
        aspect-square
        overflow-hidden
        bg-black/5
        ${containerClassName}
      `}
      data-image-status={estadoImagen}
    >
      {/* INDICADOR DE CARGA */}
      {cargando && !errorImagen && (
        <div
          aria-hidden="true"
          className="absolute inset-0 z-10 animate-pulse bg-neutral-300/60"
        />
      )}

      {/* MENSAJE DE ERROR */}
      {errorImagen &&
        mostrarMensajeError && (
          <div
            role="img"
            aria-label={`No se pudo cargar la imagen: ${alt}`}
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/5 p-4 text-center"
          >
            <span className="text-xs font-medium text-[var(--color-text)] opacity-60">
              Imagen no disponible
            </span>
          </div>
        )}

      <Image
        key={claveImagen}
        src={src}
        alt={alt}
        {...imageProps}
        onLoad={imagenCargada}
        onError={imagenConError}
        className={`
          object-cover
          transition-opacity
          duration-300
          ${
            cargando || errorImagen
              ? "opacity-0"
              : "opacity-100"
          }
          ${className}
        `}
      />
    </div>
  );
}