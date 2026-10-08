"use client";

import { ArrowUp, ArrowDown } from "lucide-react";

import { normalizarConfig } from "@/lib/tienda-diseno/config";

import type {
  ConfigDiseno,
  SeccionContenidoId,
} from "@/lib/tienda-diseno/types";

interface EditorSeccionesProps {
  config: ConfigDiseno;
  onCambiarConfig: (config: ConfigDiseno) => void;
  disabled?: boolean;
}

const NOMBRES: Record<SeccionContenidoId, string> = {
  portada: "Portada",
  destacados: "Productos destacados",
  categorias: "Barra de categorías",
  catalogo: "Catálogo de productos",
};

export default function EditorSecciones({
  config,
  onCambiarConfig,
  disabled = false,
}: EditorSeccionesProps) {
  const { secciones } = normalizarConfig(config);

  const moverSeccion = (indice: number, direccion: -1 | 1) => {
    if (disabled) return;

    const destino = indice + direccion;

    if (destino < 0 || destino >= secciones.length) return;

    const nuevasSecciones = secciones.map((seccion) => ({
      ...seccion,
    }));

    const actual = nuevasSecciones[indice];
    const siguiente = nuevasSecciones[destino];

    if (!actual || !siguiente) return;

    nuevasSecciones[indice] = siguiente;
    nuevasSecciones[destino] = actual;

    onCambiarConfig({
      ...config,
      secciones: nuevasSecciones,
    });
  };

  const cambiarVisibilidad = (
    id: SeccionContenidoId,
    visible: boolean,
  ) => {
    if (disabled || id === "catalogo") return;

    onCambiarConfig({
      ...config,
      secciones: secciones.map((seccion) =>
        seccion.id === id
          ? { ...seccion, visible }
          : seccion,
      ),
    });
  };

  const claseBoton =
    "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[var(--border-card)] text-[var(--text-secondary)] transition hover:bg-[var(--bg-card-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <section aria-label="Orden y visibilidad de las secciones">
      <h3 className="text-sm font-bold text-[var(--text-primary)]">
        Orden de las secciones
      </h3>

      <p className="mt-2 text-xs leading-relaxed text-[var(--text-secondary)]">
        Usa las flechas para cambiar el orden. El encabezado y el pie
        permanecen al principio y al final de la tienda.
      </p>

      <ol className="mt-4 space-y-3">
        {secciones.map((seccion, indice) => (
          <li
            key={seccion.id}
            className="rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] p-3"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="min-w-0 text-sm font-semibold text-[var(--text-primary)]">
                {indice + 1}. {NOMBRES[seccion.id]}
              </span>

              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  disabled={disabled || indice === 0}
                  onClick={() => moverSeccion(indice, -1)}
                  aria-label={`Mover ${NOMBRES[seccion.id]} hacia arriba`}
                  className={claseBoton}
                >
                  <ArrowUp size={16} aria-hidden="true" />
                </button>

                <button
                  type="button"
                  disabled={
                    disabled || indice === secciones.length - 1
                  }
                  onClick={() => moverSeccion(indice, 1)}
                  aria-label={`Mover ${NOMBRES[seccion.id]} hacia abajo`}
                  className={claseBoton}
                >
                  <ArrowDown size={16} aria-hidden="true" />
                </button>
              </div>
            </div>

            <label className="mt-3 flex min-h-9 items-center gap-2 text-xs text-[var(--text-secondary)]">
              <input
                type="checkbox"
                checked={seccion.visible}
                disabled={disabled || seccion.id === "catalogo"}
                onChange={(event) =>
                  cambiarVisibilidad(
                    seccion.id,
                    event.target.checked,
                  )
                }
                className="h-4 w-4 accent-[var(--color-primary)]"
              />

              {seccion.id === "catalogo"
                ? "El catálogo permanece visible"
                : "Mostrar sección"}
            </label>
          </li>
        ))}
      </ol>
    </section>
  );
}