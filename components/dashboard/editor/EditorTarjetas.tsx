"use client";

import { useId, useMemo } from "react";

import {
  esColorValido,
  normalizarConfig,
} from "@/lib/tienda-diseno/config";

import type { ConfigTarjetasCompleta } from "@/lib/tienda-diseno/config-tarjetas";
import type { ConfigDiseno } from "@/lib/tienda-diseno/types";

interface Props {
  config: ConfigDiseno;
  onCambiarConfig: (config: ConfigDiseno) => void;
  disabled?: boolean;
}

const FUENTES = [
  ["heredar", "Fuente de la tienda"],
  ["sistema", "Sistema"],
  ["serif", "Serif"],
  ["monoespaciada", "Monoespaciada"],
] as const;

const ALINEACIONES = [
  ["izquierda", "Izquierda"],
  ["centro", "Centro"],
  ["derecha", "Derecha"],
] as const;

const PESOS = [
  ["400", "Normal"],
  ["500", "Medio"],
  ["600", "Seminegrita"],
  ["700", "Negrita"],
  ["800", "Extra negrita"],
  ["900", "Muy gruesa"],
] as const;

const CLASE_INPUT =
  "min-h-11 w-full rounded-xl border border-[var(--border-card)] bg-[var(--bg-tertiary)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-60";

function Numero({
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
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
        <span className="ml-2 text-xs text-[var(--text-secondary)]">
          {value}
        </span>
      </label>

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
  const nativo = /^#[\da-f]{6}([\da-f]{2})?$/i.test(hex)
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
          aria-label={`Elegir ${label.toLowerCase()}`}
          value={nativo}
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
          Introduce un color válido.
        </p>
      )}
    </div>
  );
}

export default function EditorTarjetas({
  config,
  onCambiarConfig,
  disabled = false,
}: Props) {
  const tarjetas = useMemo(
    () => normalizarConfig(config).tarjetas,
    [config],
  );

  const cambiar = <K extends keyof ConfigTarjetasCompleta,>(
    campo: K,
    valor: ConfigTarjetasCompleta[K],
  ) => {
    if (disabled) return;

    // Conserva los valores escritos, incluso durante la edición
    // de un color, y completa los ajustes antiguos.
    onCambiarConfig({
      ...config,
      tarjetas: {
        ...tarjetas,
        ...config.tarjetas,
        [campo]: valor,
      },
    });
  };

  const selector = <K extends keyof ConfigTarjetasCompleta,>(
    campo: K,
    label: string,
    opciones: ReadonlyArray<readonly [string, string]>,
  ) => (
    <Selector
      label={label}
      value={String(tarjetas[campo])}
      opciones={opciones}
      onChange={(valor) => {
        // Solo admite valores definidos en las opciones.
        if (!opciones.some(([opcion]) => opcion === valor)) return;

        const convertido =
          typeof tarjetas[campo] === "number"
            ? Number(valor)
            : valor;

        cambiar(
          campo,
          convertido as ConfigTarjetasCompleta[K],
        );
      }}
    />
  );

  const numero = (
    campo: keyof ConfigTarjetasCompleta,
    label: string,
    min: number,
    max: number,
  ) => (
    <Numero
      label={label}
      value={Number(tarjetas[campo])}
      min={min}
      max={max}
      onChange={(valor) => cambiar(campo, valor)}
    />
  );

  return (
    <fieldset
      disabled={disabled}
      className="min-w-0 space-y-5 disabled:opacity-60"
    >
      <legend className="mb-4 text-sm font-bold">
        Tarjetas de productos
      </legend>

      <details open className="rounded-xl border border-[var(--border-card)] p-4">
        <summary className="cursor-pointer text-sm font-semibold">
          Separación y contenido
        </summary>

        <div className="mt-4 space-y-4">
          {numero("separacion_horizontal", "Separación horizontal (px)", 0, 96)}
          {numero("separacion_vertical", "Separación vertical (px)", 0, 96)}
          {numero("padding_contenido", "Espacio interior del texto (px)", 0, 48)}
          {numero("separacion_textos", "Separación entre textos (px)", 0, 32)}
        </div>
      </details>

      <details className="rounded-xl border border-[var(--border-card)] p-4">
        <summary className="cursor-pointer text-sm font-semibold">
          Bordes y sombra
        </summary>

        <div className="mt-4 space-y-4">
          {numero("radio_borde", "Redondeado de las esquinas (px)", 0, 64)}

          <Casilla
            label="Mostrar borde"
            value={tarjetas.mostrar_borde}
            onChange={(valor) => {
              if (disabled) return;

              onCambiarConfig({
                ...config,
                tarjetas: {
                  ...tarjetas,
                  ...config.tarjetas,
                  mostrar_borde: valor,
                  grosor_borde:
                    valor && tarjetas.grosor_borde === 0
                      ? 1
                      : tarjetas.grosor_borde,
                },
              });
            }}
          />

          {tarjetas.mostrar_borde && (
            <>
              {numero("grosor_borde", "Grosor del borde (px)", 0, 8)}

              <Color
                label="Color del borde"
                value={config.tarjetas?.color_borde ?? tarjetas.color_borde}
                onChange={(valor) => cambiar("color_borde", valor)}
              />
            </>
          )}

          {selector("sombra", "Sombra", [
            ["ninguna", "Sin sombra"],
            ["suave", "Suave"],
            ["media", "Media"],
          ])}
        </div>
      </details>

      <details className="rounded-xl border border-[var(--border-card)] p-4">
        <summary className="cursor-pointer text-sm font-semibold">
          Imagen del producto
        </summary>

        <div className="mt-4 space-y-4">
          {selector("ajuste_imagen", "Ajuste de la fotografía", [
            ["contain", "Mostrar imagen completa"],
            ["cover", "Llenar el espacio"],
          ])}

          <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
            Llenar el espacio puede recortar parte de la fotografía.
          </p>

          {selector("modo_altura_imagen", "Altura de la imagen", [
            ["proporcion", "Según la proporción"],
            ["personalizada", "Altura personalizada"],
          ])}

          {tarjetas.modo_altura_imagen === "proporcion" ? (
            selector("proporcion_imagen", "Proporción", [
              ["cuadrada", "Cuadrada"],
              ["horizontal", "Horizontal"],
              ["vertical", "Vertical"],
            ])
          ) : (
            <>
              {numero("alto_imagen", "Altura en escritorio (px)", 160, 800)}
              {numero("alto_imagen_movil", "Altura en móvil (px)", 140, 640)}
            </>
          )}

          {numero("padding_imagen", "Espacio interior de la imagen (px)", 0, 48)}

          <Color
            label="Fondo de la imagen"
            value={
              config.tarjetas?.color_fondo_imagen ??
              tarjetas.color_fondo_imagen
            }
            onChange={(valor) => cambiar("color_fondo_imagen", valor)}
          />

          <Casilla
            label="Mostrar etiqueta de agotado"
            value={tarjetas.mostrar_agotado}
            onChange={(valor) => cambiar("mostrar_agotado", valor)}
          />
        </div>
      </details>

      <details className="rounded-xl border border-[var(--border-card)] p-4">
        <summary className="cursor-pointer text-sm font-semibold">
          Título del producto
        </summary>

        <div className="mt-4 space-y-4">
          <Casilla
            label="Mostrar título"
            value={tarjetas.mostrar_titulo}
            onChange={(valor) => cambiar("mostrar_titulo", valor)}
          />

          {tarjetas.mostrar_titulo && (
            <>
              {selector("alineacion_titulo", "Alineación", ALINEACIONES)}
              {selector("fuente_titulo", "Tipo de letra", FUENTES)}
              {numero("tamano_titulo", "Tamaño en escritorio (px)", 12, 40)}
              {numero("tamano_titulo_movil", "Tamaño en móvil (px)", 12, 32)}
              {selector("peso_titulo", "Grosor de la letra", PESOS)}
            </>
          )}
        </div>
      </details>

      <details className="rounded-xl border border-[var(--border-card)] p-4">
        <summary className="cursor-pointer text-sm font-semibold">
          Descripción del producto
        </summary>

        <div className="mt-4 space-y-4">
          <Casilla
            label="Mostrar descripción"
            value={tarjetas.mostrar_descripcion}
            onChange={(valor) => cambiar("mostrar_descripcion", valor)}
          />

          {tarjetas.mostrar_descripcion && (
            <>
              {selector("alineacion_descripcion", "Alineación", ALINEACIONES)}
              {selector("fuente_descripcion", "Tipo de letra", FUENTES)}
              {numero("tamano_descripcion", "Tamaño en escritorio (px)", 12, 28)}
              {numero("tamano_descripcion_movil", "Tamaño en móvil (px)", 12, 24)}
              {selector("peso_descripcion", "Grosor de la letra", PESOS)}
              {numero("lineas_descripcion", "Máximo de líneas", 1, 6)}
            </>
          )}
        </div>
      </details>

      <details className="rounded-xl border border-[var(--border-card)] p-4">
        <summary className="cursor-pointer text-sm font-semibold">
          Precio del producto
        </summary>

        <div className="mt-4 space-y-4">
          <Casilla
            label="Mostrar precio"
            value={tarjetas.mostrar_precio}
            onChange={(valor) => cambiar("mostrar_precio", valor)}
          />

          {tarjetas.mostrar_precio && (
            <>
              {selector("alineacion_precio", "Alineación", ALINEACIONES)}
              {numero("tamano_precio", "Tamaño en escritorio (px)", 12, 40)}
              {numero("tamano_precio_movil", "Tamaño en móvil (px)", 12, 32)}
              {selector("peso_precio", "Grosor de la letra", PESOS)}
            </>
          )}
        </div>
      </details>
    </fieldset>
  );
}