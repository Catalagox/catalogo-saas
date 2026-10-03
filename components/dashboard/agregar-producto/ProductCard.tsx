"use client";

import { useRef, useState } from "react";
import { Eye, EyeOff, ImageIcon } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

type Producto = {
  id: string;
  nombre: string;
  precio: number;
  descripcion?: string | null;
  disponible: boolean;
  imagen_url?: string | null;
};

type Props = {
  producto: Producto;
  onUpdated: () => void;
};

export default function ProductCard({ producto, onUpdated }: Props) {
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [imagenFallida, setImagenFallida] = useState<string | null>(null);
  const guardandoRef = useRef(false);

  const mostrarImagen =
    Boolean(producto.imagen_url) &&
    imagenFallida !== producto.imagen_url;

  const toggleDisponible = async () => {
    if (guardandoRef.current) return;

    guardandoRef.current = true;
    setGuardando(true);
    setError("");

    try {
      const { data, error: updateError } = await supabase
        .from("productos")
        .update({ disponible: !producto.disponible })
        .eq("id", producto.id)
        .select("id")
        .single();

      if (updateError || !data) {
        throw updateError ?? new Error("No se actualizó el producto.");
      }
    } catch (err) {
      console.error("Error cambiando disponibilidad:", err);
      setError(
        "No pudimos actualizar el producto. Inténtalo nuevamente.",
      );
      return;
    } finally {
      guardandoRef.current = false;
      setGuardando(false);
    }

    onUpdated();
  };

  return (
    <article
      aria-busy={guardando}
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm"
    >
      <div className="flex aspect-[4/3] items-center justify-center overflow-hidden bg-[var(--bg-secondary)]">
        {mostrarImagen ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={producto.imagen_url ?? undefined}
            alt={producto.nombre}
            loading="lazy"
            onError={() =>
              setImagenFallida(producto.imagen_url ?? null)
            }
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-[var(--text-secondary)]">
            <ImageIcon size={36} aria-hidden="true" />
            <span className="text-xs">Sin imagen disponible</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="break-words text-lg font-bold leading-tight">
          {producto.nombre}
        </h3>

        <p className="mt-2 text-lg font-semibold">
          ${producto.precio}
        </p>

        {producto.descripcion && (
          <p className="mt-3 break-words text-sm leading-relaxed text-[var(--text-secondary)]">
            {producto.descripcion}
          </p>
        )}

        <div className="mt-auto pt-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-card)] pt-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-card)] bg-[var(--bg-secondary)] px-3 py-1.5 text-xs font-semibold">
              {producto.disponible ? (
                <Eye size={14} aria-hidden="true" />
              ) : (
                <EyeOff size={14} aria-hidden="true" />
              )}

              {producto.disponible
                ? "Disponible"
                : "No disponible"}
            </span>

            <button
              type="button"
              onClick={() => void toggleDisponible()}
              disabled={guardando}
              aria-label={
                producto.disponible
                  ? `Ocultar producto ${producto.nombre}`
                  : `Mostrar producto ${producto.nombre}`
              }
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--border-card)] bg-[var(--bg-secondary)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:border-[var(--color-primary)] hover:bg-[var(--bg-card-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {guardando
                ? "Guardando..."
                : producto.disponible
                  ? "Ocultar"
                  : "Mostrar"}
            </button>
          </div>

          {error && (
            <p
              role="alert"
              className="mt-3 text-sm leading-relaxed text-[var(--color-danger)]"
            >
              {error}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}