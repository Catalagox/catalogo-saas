"use client";

import { useId, useMemo } from "react";

import {
  esColorValido,
  normalizarConfig,
} from "@/lib/tienda-diseno/config";

import type {
  ConfigCatalogo,
  ConfigDiseno,
  ConfigTitulosCategoria,
} from "@/lib/tienda-diseno/types";

interface Props {
  config: ConfigDiseno;
  onCambiarConfig: (config: ConfigDiseno) => void;
  disabled?: boolean;
}

const CLASE_INPUT =
  "min-h-11 w-full rounded-xl border border-[var(--border-card)] bg-[var(--bg-tertiary)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-60";

const CLASE_GRUPO =
  "rounded-xl border border-[var(--border-card)] p-4";

function Rango({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  const id = useId();

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>

        <output
          htmlFor={id}
          className="shrink-0 text-xs text-[var(--text-secondary)]"
        >
          {value} px
        </output>
      </div>

      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-[var(--color-primary)]"
      />
    </div>
  );
}

function Casilla({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center justify-between gap-4 text-sm font-medium">
      {label}

      <input
        type="checkbox"
        checked={value}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 accent-[var(--color-primary)]"
      />
    </label>
  );
}

function Selector({
  label,
  value,
  opciones,
  onChange,
}: {
  label: string;
  value: string;
  opciones: ReadonlyArray<readonly [string, string]>;
  onChange: (value: string) => void;
}) {
  const id = useId();

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>

      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={CLASE_INPUT}
      >
        {opciones.map(([valor, nombre]) => (
          <option key={valor} value={valor}>
            {nombre}
          </option>
        ))}
      </select>
    </div>
  );
}

function Color({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const id = useId();
  const valido = esColorValido(value);
  const hex = value.trim();

  const colorNativo = /^#[\da-f]{6}([\da-f]{2})?$/i.test(hex)
    ? hex.slice(0, 7)
    : /^#[\da-f]{3,4}$/i.test(hex)
      ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
      : "#ffffff";

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>

      <div className="flex items-center gap-2">
        <input
          type="color"
          value={colorNativo}
          aria-label={`Elegir ${label.toLowerCase()}`}
          onChange={(event) => {
            const alpha = /^#[\da-f]{8}$/i.test(hex)
              ? hex.slice(7)
              : /^#[\da-f]{4}$/i.test(hex)
                ? `${hex[4]}${hex[4]}`
                : "";

            onChange(`${event.target.value}${alpha}`);
          }}
          className="h-11 w-12 shrink-0 cursor-pointer rounded-lg border border-[var(--border-card)] bg-transparent p-1"
        />

        <input
          id={id}
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          spellCheck={false}
          autoComplete="off"
          aria-invalid={!valido}
          aria-describedby={!valido ? `${id}-error` : undefined}
          className={`${CLASE_INPUT} min-w-0 font-mono`}
        />
      </div>

      {!valido && (
        <p
          id={`${id}-error`}
          className="text-xs text-[var(--color-danger)]"
        >
          Introduce un color válido, como #ffffff.
        </p>
      )}
    </div>
  );
}

export default function EditorCatalogo({
  config,
  onCambiarConfig,
  disabled = false,
}: Props) {
  const catalogo = useMemo(
    () => normalizarConfig(config).catalogo,
    [config],
  );

  const cambiarCatalogo = (
    cambios: Partial<Omit<ConfigCatalogo, "titulos">>,
  ) => {
    if (disabled) return;

    onCambiarConfig({
      ...config,
      catalogo: {
        ...catalogo,
        ...config.catalogo,
        ...cambios,
        titulos: {
          ...catalogo.titulos,
          ...config.catalogo?.titulos,
        },
      },
    });
  };

  const cambiarTitulos = (
    cambios: Partial<ConfigTitulosCategoria>,
  ) => {
    if (disabled) return;

    onCambiarConfig({
      ...config,
      catalogo: {
        ...catalogo,
        ...config.catalogo,
        titulos: {
          ...catalogo.titulos,
          ...config.catalogo?.titulos,
          ...cambios,
        },
      },
    });
  };

  const titulos = catalogo.titulos;

  return (
    <fieldset
      disabled={disabled}
      className="min-w-0 space-y-5 text-[var(--text-primary)] disabled:opacity-60"
    >
      <legend className="mb-4 text-sm font-bold">
        Diseño del catálogo
      </legend>

      <details open className={CLASE_GRUPO}>
        <summary className="cursor-pointer text-sm font-semibold">
          Fondo del catálogo
        </summary>

        <div className="mt-4 space-y-4">
          <Casilla
            label="Usar el fondo general de la tienda"
            value={catalogo.heredar_fondo}
            onChange={(valor) =>
              cambiarCatalogo({ heredar_fondo: valor })
            }
          />

          {!catalogo.heredar_fondo && (
            <Color
              label="Color de fondo"
              value={
                config.catalogo?.color_fondo ??
                catalogo.color_fondo
              }
              onChange={(valor) =>
                cambiarCatalogo({ color_fondo: valor })
              }
            />
          )}

          <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
            Este fondo se aplica a la sección de productos.
          </p>
        </div>
      </details>

      <details className={CLASE_GRUPO}>
        <summary className="cursor-pointer text-sm font-semibold">
          Ancho y márgenes
        </summary>

        <div className="mt-4 space-y-4">
          <Casilla
            label="Ocupar todo el ancho"
            value={catalogo.ancho_completo}
            onChange={(valor) =>
              cambiarCatalogo({ ancho_completo: valor })
            }
          />

          {!catalogo.ancho_completo && (
            <Rango
              label="Ancho máximo"
              value={catalogo.ancho_maximo}
              min={640}
              max={1920}
              onChange={(valor) =>
                cambiarCatalogo({ ancho_maximo: valor })
              }
            />
          )}

          <Rango
            label="Espacio lateral en escritorio y tablet"
            value={catalogo.margen_horizontal}
            min={0}
            max={120}
            onChange={(valor) =>
              cambiarCatalogo({ margen_horizontal: valor })
            }
          />

          <Rango
            label="Espacio lateral en móvil"
            value={catalogo.margen_horizontal_movil}
            min={0}
            max={40}
            onChange={(valor) =>
              cambiarCatalogo({ margen_horizontal_movil: valor })
            }
          />

          <Rango
            label="Espacio superior"
            value={catalogo.padding_superior}
            min={0}
            max={160}
            onChange={(valor) =>
              cambiarCatalogo({ padding_superior: valor })
            }
          />

          <Rango
            label="Espacio inferior"
            value={catalogo.padding_inferior}
            min={0}
            max={160}
            onChange={(valor) =>
              cambiarCatalogo({ padding_inferior: valor })
            }
          />
        </div>
      </details>

      <details className={CLASE_GRUPO}>
        <summary className="cursor-pointer text-sm font-semibold">
          Columnas de productos
        </summary>

        <div className="mt-4 space-y-4">
          <Selector
            label="Escritorio"
            value={String(catalogo.columnas_escritorio)}
            opciones={[
              ["2", "2 columnas"],
              ["3", "3 columnas"],
              ["4", "4 columnas"],
              ["5", "5 columnas"],
            ]}
            onChange={(valor) => {
              const columnas = Number(valor);

              if (
                columnas === 2 ||
                columnas === 3 ||
                columnas === 4 ||
                columnas === 5
              ) {
                cambiarCatalogo({
                  columnas_escritorio: columnas,
                });
              }
            }}
          />

          <Selector
            label="Tablet"
            value={String(catalogo.columnas_tablet)}
            opciones={[
              ["1", "1 columna"],
              ["2", "2 columnas"],
              ["3", "3 columnas"],
            ]}
            onChange={(valor) => {
              const columnas = Number(valor);

              if (
                columnas === 1 ||
                columnas === 2 ||
                columnas === 3
              ) {
                cambiarCatalogo({ columnas_tablet: columnas });
              }
            }}
          />

          <Selector
            label="Móvil"
            value={String(catalogo.columnas_movil)}
            opciones={[
              ["1", "1 columna"],
              ["2", "2 columnas"],
            ]}
            onChange={(valor) => {
              const columnas = Number(valor);

              if (columnas === 1 || columnas === 2) {
                cambiarCatalogo({ columnas_movil: columnas });
              }
            }}
          />
        </div>
      </details>

      <details className={CLASE_GRUPO}>
        <summary className="cursor-pointer text-sm font-semibold">
          Títulos de las categorías
        </summary>

        <div className="mt-4 space-y-4">
          <Casilla
            label="Mostrar títulos"
            value={titulos.mostrar}
            onChange={(valor) =>
              cambiarTitulos({ mostrar: valor })
            }
          />

          {titulos.mostrar && (
            <>
              <Casilla
                label="Mostrar cantidad de productos"
                value={titulos.mostrar_cantidad}
                onChange={(valor) =>
                  cambiarTitulos({ mostrar_cantidad: valor })
                }
              />

              <Color
                label="Color del título"
                value={
                  config.catalogo?.titulos?.color ??
                  titulos.color
                }
                onChange={(valor) =>
                  cambiarTitulos({ color: valor })
                }
              />

              <Selector
                label="Alineación"
                value={titulos.alineacion}
                opciones={[
                  ["izquierda", "Izquierda"],
                  ["centro", "Centro"],
                  ["derecha", "Derecha"],
                ]}
                onChange={(valor) => {
                  if (
                    valor === "izquierda" ||
                    valor === "centro" ||
                    valor === "derecha"
                  ) {
                    cambiarTitulos({ alineacion: valor });
                  }
                }}
              />

              <Selector
                label="Tipo de letra"
                value={titulos.fuente}
                opciones={[
                  ["heredar", "Fuente de la tienda"],
                  ["sistema", "Sistema"],
                  ["serif", "Serif"],
                  ["monoespaciada", "Monoespaciada"],
                ]}
                onChange={(valor) => {
                  if (
                    valor === "heredar" ||
                    valor === "sistema" ||
                    valor === "serif" ||
                    valor === "monoespaciada"
                  ) {
                    cambiarTitulos({ fuente: valor });
                  }
                }}
              />

              <Rango
                label="Tamaño en escritorio y tablet"
                value={titulos.tamano}
                min={12}
                max={80}
                onChange={(valor) =>
                  cambiarTitulos({ tamano: valor })
                }
              />

              <Rango
                label="Tamaño en móvil"
                value={titulos.tamano_movil}
                min={12}
                max={56}
                onChange={(valor) =>
                  cambiarTitulos({ tamano_movil: valor })
                }
              />

              <Selector
                label="Grosor de la letra"
                value={String(titulos.peso)}
                opciones={[
                  ["400", "Normal"],
                  ["500", "Medio"],
                  ["600", "Seminegrita"],
                  ["700", "Negrita"],
                  ["800", "Extra negrita"],
                  ["900", "Muy gruesa"],
                ]}
                onChange={(valor) => {
                  const peso = Number(valor);

                  if (
                    peso === 400 ||
                    peso === 500 ||
                    peso === 600 ||
                    peso === 700 ||
                    peso === 800 ||
                    peso === 900
                  ) {
                    cambiarTitulos({ peso });
                  }
                }}
              />

              <Rango
                label="Separación entre título y productos"
                value={titulos.separacion_inferior}
                min={0}
                max={96}
                onChange={(valor) =>
                  cambiarTitulos({
                    separacion_inferior: valor,
                  })
                }
              />
            </>
          )}
        </div>
      </details>
    </fieldset>
  );
}