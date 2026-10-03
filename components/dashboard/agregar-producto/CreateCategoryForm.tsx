"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

type Props = {
  userId: string | null;
  catalogoId: string | null;
  onCreated: () => void;
};

export default function CreateCategoryForm({
  userId,
  catalogoId,
  onCreated,
}: Props) {
  const inputId = useId();
  const mensajeId = useId();
  const enviandoRef = useRef(false);

  const [nombre, setNombre] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const crearCategoria = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (enviandoRef.current) return;

    setError("");
    setMensaje("");

    const nombreLimpio = nombre.trim();

    if (!nombreLimpio) {
      setError("Escribe un nombre para la categoría.");
      return;
    }

    if (!userId || !catalogoId) {
      setError(
        "No pudimos identificar tu tienda. Recarga la página e inténtalo nuevamente.",
      );
      return;
    }

    enviandoRef.current = true;
    setLoading(true);

    try {
      const { error: insertError } = await supabase
        .from("categorias")
        .insert({
          nombre: nombreLimpio,
          user_id: userId,
          catalogo_id: catalogoId,
        });

      if (insertError) throw insertError;
    } catch (err) {
      console.error("Error creando categoría:", err);
      setError("No pudimos crear la categoría. Inténtalo nuevamente.");
      return;
    } finally {
      enviandoRef.current = false;
      setLoading(false);
    }

    setNombre("");
    setMensaje(`Categoría “${nombreLimpio}” creada correctamente.`);
    onCreated();
  };

  return (
    <section
      aria-labelledby={`${inputId}-titulo`}
      className="mb-8 rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-5 text-[var(--text-primary)] sm:p-6"
    >
      <h2
        id={`${inputId}-titulo`}
        className="text-lg font-bold sm:text-xl"
      >
        Nueva categoría
      </h2>

      <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
        Crea una categoría para agrupar los productos de tu tienda.
      </p>

      <form
        onSubmit={crearCategoria}
        aria-busy={loading}
        className="mt-5"
      >
        <label
          htmlFor={inputId}
          className="mb-2 block text-sm font-semibold"
        >
          Nombre de la categoría
        </label>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <input
            id={inputId}
            name="nombreCategoria"
            type="text"
            placeholder="Ej.: Bebidas, Hamburguesas, Postres"
            value={nombre}
            disabled={loading}
            aria-invalid={Boolean(error)}
            aria-describedby={error || mensaje ? mensajeId : undefined}
            onChange={(event) => {
              setNombre(event.target.value);
              setError("");
              setMensaje("");
            }}
            className="min-h-11 min-w-0 flex-1 rounded-xl border border-[var(--border-card)] bg-[var(--bg-secondary)] px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-60"
          />

          <button
            type="submit"
            disabled={loading}
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-bold text-[var(--color-text-inverse)] transition-colors hover:bg-[var(--color-primary-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={18} aria-hidden="true" />
            {loading ? "Creando..." : "Crear categoría"}
          </button>
        </div>

        {error && (
          <p
            id={mensajeId}
            role="alert"
            className="mt-3 text-sm leading-relaxed text-[var(--color-danger)]"
          >
            {error}
          </p>
        )}

        {mensaje && (
          <p
            id={mensajeId}
            role="status"
            className="mt-3 text-sm leading-relaxed text-[var(--text-primary)]"
          >
            {mensaje}
          </p>
        )}
      </form>
    </section>
  );
}
