"use client";

import { useId, useMemo } from "react";

import { normalizarConfig } from "@/lib/tienda-diseno/config";

import type {
  ConfigDiseno,
  ConfigTarjetas,
  ConfigTipografia,
} from "@/lib/tienda-diseno/types";

interface EditorEstilosProps {
  config: ConfigDiseno;
  grupo: "tipografia" | "tarjetas";
  onCambiarConfig: (config: ConfigDiseno) => void;
  disabled?: boolean;
}

function ControlRango({
  nombre,
  valor,
  minimo,
  maximo,
  onChange,
  disabled,
}: {
  nombre: string;
  valor: number;
  minimo: number;
  maximo: number;
  onChange: (valor: number) => void;
  disabled: boolean;
}) {
  const id = useId();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <label
          htmlFor={id}
          className="text-sm font-medium text-[var(--text-primary)]"
        >
          {nombre}
        </label>

        <output
          htmlFor={id}
          className="shrink-0 text-xs text-[var(--text-secondary)]"
        >
          {valor} px
        </output>
      </div>

      <input
        id={id}
        type="range"
        min={minimo}
        max={maximo}
        step={1}
        value={valor}
        onChange={(event) => onChange(Number(event.target.value))}
        disabled={disabled}
        className="h-6 w-full cursor-pointer accent-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );
}

export default function EditorEstilos({
  config,
  grupo,
  onCambiarConfig,
  disabled = false,
}: EditorEstilosProps) {
  const id = useId();

  const configCompleta = useMemo(
    () => normalizarConfig(config),
    [config],
  );

  const { tipografia, tarjetas } = configCompleta;

  const cambiarTipografia = (
    cambios: Partial<ConfigTipografia>,
  ) => {
    if (disabled) return;

    onCambiarConfig({
      ...config,
      tipografia: {
        ...tipografia,
        ...cambios,
      },
    });
  };

  const cambiarTarjetas = (
    cambios: Partial<ConfigTarjetas>,
  ) => {
    if (disabled) return;

    onCambiarConfig({
      ...config,
      tarjetas: {
        ...tarjetas,
        ...cambios,
      },
    });
  };

  const claseInput =
    "min-h-11 w-full rounded-xl border border-[var(--border-card)] bg-[var(--bg-tertiary)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50";

  const claseEtiqueta =
    "block text-sm font-medium text-[var(--text-primary)]";

  if (grupo === "tipografia") {
    return (
      <fieldset disabled={disabled} className="space-y-5">
        <legend className="mb-4 text-sm font-bold text-[var(--text-primary)]">
          Tipografía
        </legend>

        <div className="space-y-2">
          <label htmlFor={`${id}-fuente`} className={claseEtiqueta}>
            Fuente
          </label>

          <select
            id={`${id}-fuente`}
            value={tipografia.fuente}
            onChange={(event) => {
              const valor = event.target.value;

              if (
                valor === "sistema" ||
                valor === "serif" ||
                valor === "monoespaciada"
              ) {
                cambiarTipografia({ fuente: valor });
              }
            }}
            className={claseInput}
          >
            <option value="sistema">Sistema</option>
            <option value="serif">Serif</option>
            <option value="monoespaciada">Monoespaciada</option>
          </select>

          <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
            Estas fuentes utilizan las disponibles en el dispositivo.
          </p>
        </div>

        <ControlRango
          nombre="Tamaño del texto base"
          valor={tipografia.tamano_base}
          minimo={12}
          maximo={24}
          onChange={(valor) =>
            cambiarTipografia({ tamano_base: valor })
          }
          disabled={disabled}
        />

        <ControlRango
          nombre="Tamaño de los títulos de sección"
          valor={tipografia.tamano_titulos}
          minimo={20}
          maximo={64}
          onChange={(valor) =>
            cambiarTipografia({ tamano_titulos: valor })
          }
          disabled={disabled}
        />
      </fieldset>
    );
  }

  return (
    <fieldset disabled={disabled} className="space-y-5">
      <legend className="mb-4 text-sm font-bold text-[var(--text-primary)]">
        Estilo de las tarjetas
      </legend>

      <ControlRango
        nombre="Redondeado de las esquinas"
        valor={tarjetas.radio_borde}
        minimo={0}
        maximo={40}
        onChange={(valor) =>
          cambiarTarjetas({ radio_borde: valor })
        }
        disabled={disabled}
      />

      <ControlRango
        nombre="Grosor del borde"
        valor={tarjetas.grosor_borde}
        minimo={0}
        maximo={4}
        onChange={(valor) =>
          cambiarTarjetas({ grosor_borde: valor })
        }
        disabled={disabled}
      />

      <div className="space-y-2">
        <label htmlFor={`${id}-borde`} className={claseEtiqueta}>
          Color del borde
        </label>

        <input
          id={`${id}-borde`}
          type="text"
          value={config.tarjetas?.color_borde ?? tarjetas.color_borde}
          onChange={(event) =>
            cambiarTarjetas({ color_borde: event.target.value })
          }
          placeholder="#e5e7eb"
          spellCheck={false}
          autoComplete="off"
          className={`${claseInput} font-mono`}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor={`${id}-sombra`} className={claseEtiqueta}>
          Sombra
        </label>

        <select
          id={`${id}-sombra`}
          value={tarjetas.sombra}
          onChange={(event) => {
            const valor = event.target.value;

            if (
              valor === "ninguna" ||
              valor === "suave" ||
              valor === "media"
            ) {
              cambiarTarjetas({ sombra: valor });
            }
          }}
          className={claseInput}
        >
          <option value="ninguna">Sin sombra</option>
          <option value="suave">Suave</option>
          <option value="media">Media</option>
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor={`${id}-proporcion`} className={claseEtiqueta}>
          Proporción de la imagen
        </label>

        <select
          id={`${id}-proporcion`}
          value={tarjetas.proporcion_imagen}
          onChange={(event) => {
            const valor = event.target.value;

            if (
              valor === "cuadrada" ||
              valor === "horizontal" ||
              valor === "vertical"
            ) {
              cambiarTarjetas({ proporcion_imagen: valor });
            }
          }}
          className={claseInput}
        >
          <option value="cuadrada">Cuadrada</option>
          <option value="horizontal">Horizontal</option>
          <option value="vertical">Vertical</option>
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor={`${id}-ajuste`} className={claseEtiqueta}>
          Ajuste de la imagen
        </label>

        <select
          id={`${id}-ajuste`}
          value={tarjetas.ajuste_imagen}
          onChange={(event) => {
            const valor = event.target.value;

            if (valor === "cover" || valor === "contain") {
              cambiarTarjetas({ ajuste_imagen: valor });
            }
          }}
          className={claseInput}
        >
          <option value="cover">Llenar el espacio</option>
          <option value="contain">Mostrar la imagen completa</option>
        </select>
      </div>
    </fieldset>
  );
}