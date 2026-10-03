"use client";

import { useId, useRef, useState } from "react";
import { Save } from "lucide-react";

interface FormNombreMenuProps {
  nombreMenu: string;
  setNombreMenu: (val: string) => void;
  generarSlug: (texto: string) => string;
  guardarNombreMenu: () => Promise<void>;
}

export default function FormNombreMenu({
  nombreMenu,
  setNombreMenu,
  generarSlug,
  guardarNombreMenu,
}: FormNombreMenuProps) {
  const id = useId();
  const guardandoRef = useRef(false);

  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const slug = generarSlug(nombreMenu.trim());

  const guardar = async () => {
    if (guardandoRef.current) return;

    setError("");

    if (!nombreMenu.trim()) {
      setError("Escribe el nombre de tu tienda.");
      return;
    }

    if (!slug) {
      setError("Escribe un nombre que permita generar el enlace de tu tienda.");
      return;
    }

    guardandoRef.current = true;
    setGuardando(true);

    try {
      await guardarNombreMenu();
    } catch (err) {
      console.error("Error guardando nombre:", err);
      setError("No pudimos guardar los cambios. Inténtalo nuevamente.");
    } finally {
      guardandoRef.current = false;
      setGuardando(false);
    }
  };

  return (
    <section
      aria-labelledby={`${id}-titulo`}
      aria-busy={guardando}
      className="space-y-5 rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-5 text-[var(--text-primary)] sm:p-6"
    >
      <div>
        <h2 id={`${id}-titulo`} className="text-xl font-bold">
          Nombre de la tienda
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
          Este nombre identifica tu negocio en el catálogo público.
        </p>
      </div>

      <div>
        <label
          htmlFor={`${id}-nombre`}
          className="mb-2 block text-sm font-semibold"
        >
          Nombre del negocio
        </label>

        <input
          id={`${id}-nombre`}
          type="text"
          value={nombreMenu}
          disabled={guardando}
          onChange={(event) => {
            setNombreMenu(event.target.value);
            setError("");
          }}
          placeholder="Ej.: Burger House"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className="min-h-11 w-full rounded-xl border border-[var(--border-card)] bg-[var(--bg-secondary)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold">
          Vista previa del enlace
        </p>

        <div className="break-all rounded-xl border border-[var(--border-card)] bg-[var(--bg-secondary)] p-3 text-sm text-[var(--text-secondary)]">
          {slug
            ? `catalagox.com/${slug}`
            : "Escribe un nombre para ver el enlace"}
        </div>
      </div>

      <button
        type="button"
        onClick={() => void guardar()}
        disabled={guardando}
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-bold text-[var(--color-text-inverse)] transition-colors enabled:hover:bg-[var(--color-primary-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] disabled:cursor-wait disabled:opacity-60 sm:w-auto"
      >
        <Save size={18} aria-hidden="true" />
        {guardando ? "Guardando..." : "Guardar cambios"}
      </button>

      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-sm leading-relaxed text-[var(--color-danger)]"
        >
          {error}
        </p>
      )}
    </section>
  );
}