"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  AlertCircle,
  Check,
  Share2,
} from "lucide-react";

interface BotonCompartirProps {
  titulo: string;
}

type EstadoCompartir =
  | "inactivo"
  | "compartiendo"
  | "copiado"
  | "error";

async function copiarEnlace(
  enlace: string,
): Promise<boolean> {
  /*
   * Método moderno.
   */
  if (
    navigator.clipboard &&
    window.isSecureContext
  ) {
    try {
      await navigator.clipboard.writeText(
        enlace,
      );

      return true;
    } catch {
      // Continuamos con el método alternativo.
    }
  }

  /*
   * Método alternativo para navegadores donde
   * Clipboard API no está disponible.
   */
  try {
    const textarea =
      document.createElement("textarea");

    textarea.value = enlace;
    textarea.setAttribute(
      "readonly",
      "",
    );

    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.opacity = "0";

    document.body.appendChild(textarea);

    textarea.select();
    textarea.setSelectionRange(
      0,
      textarea.value.length,
    );

    const copiado =
      document.execCommand("copy");

    document.body.removeChild(textarea);

    return copiado;
  } catch {
    return false;
  }
}

export default function BotonCompartir({
  titulo,
}: BotonCompartirProps) {
  const [estado, setEstado] =
    useState<EstadoCompartir>("inactivo");

  const temporizadorRef =
    useRef<ReturnType<
      typeof setTimeout
    > | null>(null);

  const programarRestablecimiento =
    useCallback(() => {
      if (temporizadorRef.current) {
        clearTimeout(
          temporizadorRef.current,
        );
      }

      temporizadorRef.current =
        setTimeout(() => {
          setEstado("inactivo");
          temporizadorRef.current = null;
        }, 2000);
    }, []);

  useEffect(() => {
    return () => {
      if (temporizadorRef.current) {
        clearTimeout(
          temporizadorRef.current,
        );
      }
    };
  }, []);

  const intentarCopiar =
    useCallback(async () => {
      const copiado = await copiarEnlace(
        window.location.href,
      );

      setEstado(
        copiado ? "copiado" : "error",
      );

      programarRestablecimiento();
    }, [programarRestablecimiento]);

  const compartirProducto =
    useCallback(async () => {
      if (estado === "compartiendo") {
        return;
      }

      setEstado("compartiendo");

      const enlace = window.location.href;

      if (typeof navigator.share === "function") {
        try {
          await navigator.share({
            title:
              titulo.trim() ||
              "Producto de la tienda",
            text: titulo.trim()
              ? `Mira este producto: ${titulo.trim()}`
              : "Mira este producto",
            url: enlace,
          });

          setEstado("inactivo");
          return;
        } catch (error) {
          /*
           * AbortError significa que el usuario cerró
           * voluntariamente el panel de compartir.
           */
          if (
            error instanceof DOMException &&
            error.name === "AbortError"
          ) {
            setEstado("inactivo");
            return;
          }

          /*
           * Si el navegador no pudo compartir,
           * intentamos copiar el enlace.
           */
          await intentarCopiar();
          return;
        }
      }

      await intentarCopiar();
    }, [
      estado,
      titulo,
      intentarCopiar,
    ]);

  const copiado = estado === "copiado";
  const error = estado === "error";
  const compartiendo =
    estado === "compartiendo";

  const mensajeAccesible = copiado
    ? "Enlace copiado"
    : error
      ? "No se pudo copiar el enlace"
      : "";

  return (
    <div className="relative inline-flex">
      <button
        type="button"
        onClick={compartirProducto}
        disabled={compartiendo}
        title={
          copiado
            ? "Enlace copiado"
            : error
              ? "No se pudo copiar"
              : "Compartir producto"
        }
        aria-label={
          copiado
            ? "Enlace del producto copiado"
            : error
              ? "No se pudo copiar el enlace"
              : "Compartir producto"
        }
        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 p-2.5 text-[var(--color-text)] outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] disabled:cursor-wait disabled:opacity-60"
      >
        {copiado ? (
          <Check
            aria-hidden="true"
            size={18}
            className="text-emerald-500"
          />
        ) : error ? (
          <AlertCircle
            aria-hidden="true"
            size={18}
            className="text-red-500"
          />
        ) : (
          <Share2
            aria-hidden="true"
            size={18}
          />
        )}
      </button>

      <span
        role="status"
        aria-live="polite"
        className="sr-only"
      >
        {mensajeAccesible}
      </span>
    </div>
  );
}