"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";

interface InteractiveProductImageProps {
  src: string;
  alt: string;
  priority?: boolean;
}

export default function InteractiveProductImage({
  src,
  alt,
  priority = true,
}: InteractiveProductImageProps) {
  const [imagenAmpliada, setImagenAmpliada] =
    useState(false);

  const botonAbrirRef =
    useRef<HTMLButtonElement>(null);

  const botonCerrarRef =
    useRef<HTMLButtonElement>(null);

  const abrirImagen = useCallback(() => {
    setImagenAmpliada(true);
  }, []);

  const cerrarImagen = useCallback(() => {
    setImagenAmpliada(false);
  }, []);

  /*
   * Cuando abrimos la imagen:
   * - bloqueamos el scroll del fondo;
   * - movemos el foco al botón de cerrar;
   * - permitimos cerrar con Escape;
   * - mantenemos el foco dentro del modal.
   */
  useEffect(() => {
    if (!imagenAmpliada) {
      return;
    }

    const overflowAnterior =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const enfocarBotonCerrar =
      window.requestAnimationFrame(() => {
        botonCerrarRef.current?.focus();
      });

    const manejarTeclado = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        cerrarImagen();
        return;
      }

      /*
       * El modal solamente tiene un control interactivo:
       * el botón de cerrar. Evitamos que Tab lleve el foco
       * hacia elementos de la página que están detrás.
       */
      if (event.key === "Tab") {
        event.preventDefault();
        botonCerrarRef.current?.focus();
      }
    };

    window.addEventListener(
      "keydown",
      manejarTeclado,
    );

    return () => {
      window.cancelAnimationFrame(
        enfocarBotonCerrar,
      );

      document.body.style.overflow =
        overflowAnterior;

      window.removeEventListener(
        "keydown",
        manejarTeclado,
      );

      botonAbrirRef.current?.focus();
    };
  }, [imagenAmpliada, cerrarImagen]);

  return (
    <>
      {/* IMAGEN PRINCIPAL DEL PRODUCTO */}
      <button
        ref={botonAbrirRef}
        type="button"
        onClick={abrirImagen}
        aria-label={`Ampliar imagen de ${alt}`}
        aria-haspopup="dialog"
        aria-expanded={imagenAmpliada}
        className="relative h-full w-full cursor-zoom-in touch-manipulation overflow-hidden rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover opacity-95 transition duration-300 md:group-hover:scale-[1.02] md:hover:opacity-100"
        />

        {/* INDICADOR PARA AMPLIAR */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white shadow-lg backdrop-blur-sm sm:bottom-4 sm:right-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
            />
          </svg>
        </span>
      </button>

      {/* VISOR DE IMAGEN AMPLIADA */}
      {imagenAmpliada && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="imagen-ampliada-titulo"
          aria-describedby="imagen-ampliada-descripcion"
          className="fixed inset-0 z-[100] flex cursor-zoom-out items-center justify-center bg-black/95 p-3 backdrop-blur-sm animate-fade-in touch-manipulation sm:p-6"
          onClick={cerrarImagen}
        >
          <h2
            id="imagen-ampliada-titulo"
            className="sr-only"
          >
            Imagen ampliada de {alt}
          </h2>

          <p
            id="imagen-ampliada-descripcion"
            className="sr-only"
          >
            Pulsa el botón de cerrar, el fondo oscuro
            o la tecla Escape para regresar al producto.
          </p>

          {/* BOTÓN CERRAR */}
          <button
            ref={botonCerrarRef}
            type="button"
            aria-label="Cerrar imagen ampliada"
            onClick={(event) => {
              event.stopPropagation();
              cerrarImagen();
            }}
            className="absolute right-3 top-3 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/70 text-white shadow-lg outline-none transition hover:bg-black focus-visible:ring-2 focus-visible:ring-white active:scale-95 sm:right-6 sm:top-6"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* IMAGEN COMPLETA */}
          <div
            className="relative h-full max-h-[92vh] w-full max-w-7xl cursor-default"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <Image
              src={src}
              alt={alt}
              fill
              priority
              sizes="100vw"
              className="select-none object-contain"
              draggable={false}
            />
          </div>
        </div>
      )}
    </>
  );
}