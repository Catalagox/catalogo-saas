"use client";

import { useId } from "react";

import { normalizarConfig } from "@/lib/tienda-diseno/config";

import type {
  ConfigDiseno,
  ConfigEspaciado,
} from "@/lib/tienda-diseno/types";

interface EditorEspaciadoProps {
  config: ConfigDiseno;
  onCambiarConfig: (config: ConfigDiseno) => void;
  disabled?: boolean;
}

const CONTROLES: ReadonlyArray<{
  campo: keyof ConfigEspaciado;
  nombre: string;
  descripcion: string;
  minimo: number;
  maximo: number;
}> = [
  {
    campo: "ancho_contenido",
    nombre: "Ancho máximo del contenido",
    descripcion:
      "En pantallas pequeñas, el contenido se adapta al espacio disponible.",
    minimo: 960,
    maximo: 1600,
  },
  {
    campo: "separacion_secciones",
    nombre: "Separación de secciones",
    descripcion:
      "Ajusta el espacio utilizado por las secciones y entre categorías.",
    minimo: 16,
    maximo: 96,
  },
  {
    campo: "separacion_productos",
    nombre: "Separación entre productos",
    descripcion:
      "Ajusta la distancia entre las tarjetas de productos.",
    minimo: 8,
    maximo: 48,
  },
];

export default function EditorEspaciado({
  config,
  onCambiarConfig,
  disabled = false,
}: EditorEspaciadoProps) {
  const id = useId();
  const { espaciado } = normalizarConfig(config);

  const cambiarValor = (
    campo: keyof ConfigEspaciado,
    valor: number,
  ) => {
    if (disabled) return;

    onCambiarConfig({
      ...config,
      espaciado: {
        ...espaciado,
        [campo]: valor,
      },
    });
  };

  return (
    <fieldset disabled={disabled} className="space-y-5">
      <legend className="mb-4 text-sm font-bold text-[var(--text-primary)]">
        Ancho y espaciado
      </legend>

      {CONTROLES.map((control) => {
        const inputId = `${id}-${control.campo}`;

        return (
          <div key={control.campo} className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <label
                htmlFor={inputId}
                className="text-sm font-medium text-[var(--text-primary)]"
              >
                {control.nombre}
              </label>

              <output
                htmlFor={inputId}
                className="shrink-0 text-xs font-semibold tabular-nums text-[var(--text-secondary)]"
              >
                {espaciado[control.campo]} px
              </output>
            </div>

            <input
              id={inputId}
              type="range"
              min={control.minimo}
              max={control.maximo}
              step={1}
              value={espaciado[control.campo]}
              onChange={(event) =>
                cambiarValor(
                  control.campo,
                  Number(event.target.value),
                )
              }
              aria-describedby={`${inputId}-ayuda`}
              className="h-8 w-full cursor-pointer accent-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-60"
            />

            <p
              id={`${inputId}-ayuda`}
              className="text-xs leading-relaxed text-[var(--text-secondary)]"
            >
              {control.descripcion}
            </p>
          </div>
        );
      })}
    </fieldset>
  );
}