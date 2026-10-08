"use client";

import { useId, useMemo, useState } from "react";

import { normalizarConfig } from "@/lib/tienda-diseno/config";

import type {
  CategoriaTienda,
  ConfigDiseno,
  ProductoTienda,
} from "@/lib/tienda-diseno/types";

interface EditorDestacadosProps {
  config: ConfigDiseno;
  categorias: CategoriaTienda[];
  onCambiarConfig: (config: ConfigDiseno) => void;
  disabled?: boolean;
}

const LIMITE = 12;

export default function EditorDestacados({
  config,
  categorias,
  onCambiarConfig,
  disabled = false,
}: EditorDestacadosProps) {
  const id = useId();
  const [busqueda, setBusqueda] = useState("");

  const diseno = normalizarConfig(config);

  const destacados = {
    ...diseno.destacados,
    ...config.destacados,
  };

  const seleccionados = diseno.destacados.producto_ids;

  const visible = diseno.secciones.some(
    (seccion) => seccion.id === "destacados" && seccion.visible,
  );

  const productos = useMemo(() => {
    const registros = new Map<
      string,
      { producto: ProductoTienda; categoria: string }
    >();

    for (const categoria of categorias) {
      for (const producto of categoria.productos) {
        if (
          producto.disponible === false ||
          !producto.nombre?.trim() ||
          !producto.slug?.trim() ||
          !Number.isFinite(producto.precio) ||
          producto.precio < 0
        ) {
          continue;
        }

        registros.set(producto.id.toLowerCase(), {
          producto,
          categoria: categoria.nombre,
        });
      }
    }

    return registros;
  }, [categorias]);

  const filtrados = Array.from(productos.entries()).filter(
    ([, registro]) => {
      const texto =
        `${registro.producto.nombre} ${registro.categoria}`.toLowerCase();

      return texto.includes(busqueda.trim().toLowerCase());
    },
  );

  const cambiarSeleccion = (ids: string[]) => {
    if (disabled) return;

    onCambiarConfig({
      ...config,
      destacados: {
        ...destacados,
        producto_ids: ids,
      },
    });
  };

  const alternarProducto = (productoId: string) => {
    if (disabled) return;

    if (seleccionados.includes(productoId)) {
      cambiarSeleccion(
        seleccionados.filter((actual) => actual !== productoId),
      );
      return;
    }

    if (seleccionados.length >= LIMITE) return;

    cambiarSeleccion([...seleccionados, productoId]);
  };

  const claseInput =
    "min-h-11 w-full rounded-xl border border-[var(--border-card)] bg-[var(--bg-tertiary)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] disabled:opacity-60";

  return (
    <fieldset disabled={disabled} className="space-y-5">
      <legend className="sr-only">Productos destacados</legend>

      <label className="flex min-h-11 items-center justify-between gap-3 rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] p-3">
        <span className="text-sm font-semibold">Mostrar destacados</span>

        <input
          type="checkbox"
          checked={visible}
          onChange={(event) => {
            if (disabled) return;

            onCambiarConfig({
              ...config,
              secciones: diseno.secciones.map((seccion) =>
                seccion.id === "destacados"
                  ? { ...seccion, visible: event.target.checked }
                  : seccion,
              ),
            });
          }}
          className="h-5 w-5 accent-[var(--color-primary)]"
        />
      </label>

      <div className="space-y-2">
        <label htmlFor={`${id}-titulo`} className="block text-sm font-medium">
          Título de la sección
        </label>

        <input
          id={`${id}-titulo`}
          value={destacados.titulo}
          maxLength={100}
          onChange={(event) => {
            if (disabled) return;

            onCambiarConfig({
              ...config,
              destacados: {
                ...destacados,
                titulo: event.target.value,
              },
            });
          }}
          placeholder="Productos destacados"
          className={claseInput}
        />
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold">
          Seleccionados ({seleccionados.length}/{LIMITE})
        </h3>

        <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
          Aparecen en el orden en que los seleccionas. Para cambiarlo,
          quita un producto y vuelve a añadirlo.
        </p>

        {seleccionados.length === 0 ? (
          <p className="rounded-xl border border-dashed border-[var(--border-card)] p-3 text-sm text-[var(--text-secondary)]">
            Selecciona al menos un producto para visualizar la sección.
          </p>
        ) : (
          <ol className="space-y-2">
            {seleccionados.map((productoId, indice) => {
              const registro = productos.get(productoId);

              return (
                <li
                  key={productoId}
                  className="flex items-center justify-between gap-2 rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] p-3"
                >
                  <span className="min-w-0 break-words text-sm">
                    {indice + 1}.{" "}
                    {registro?.producto.nombre ?? "Producto no disponible"}
                  </span>

                  <button
                    type="button"
                    onClick={() => alternarProducto(productoId)}
                    aria-label={`Quitar ${
                      registro?.producto.nombre ?? "producto no disponible"
                    } de destacados`}
                    className="shrink-0 rounded-lg px-2 py-2 text-xs font-semibold text-[var(--color-danger)] focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] disabled:opacity-60"
                  >
                    Quitar
                  </button>
                </li>
              );
            })}
          </ol>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor={`${id}-buscar`} className="block text-sm font-medium">
          Buscar productos
        </label>

        <input
          id={`${id}-buscar`}
          type="search"
          value={busqueda}
          onChange={(event) => setBusqueda(event.target.value)}
          placeholder="Nombre o categoría"
          className={claseInput}
        />
      </div>

      <div className="space-y-2">
        {filtrados.length === 0 && (
          <p className="text-sm text-[var(--text-secondary)]">
            No hay productos que coincidan con la búsqueda.
          </p>
        )}

        {filtrados.map(([productoId, registro]) => {
          const seleccionado = seleccionados.includes(productoId);
          const limiteAlcanzado =
            !seleccionado && seleccionados.length >= LIMITE;

          return (
            <label
              key={productoId}
              className={`flex items-start gap-3 rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] p-3 ${
                limiteAlcanzado ? "opacity-50" : "cursor-pointer"
              }`}
            >
              <input
                type="checkbox"
                checked={seleccionado}
                disabled={disabled || limiteAlcanzado}
                onChange={() => alternarProducto(productoId)}
                className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--color-primary)]"
              />

              <span className="min-w-0">
                <span className="block break-words text-sm font-medium">
                  {registro.producto.nombre}
                </span>
                <span className="mt-1 block text-xs text-[var(--text-secondary)]">
                  {registro.categoria}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}