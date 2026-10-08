"use client";

import { useId } from "react";

import EditorImagenPortada from "@/components/dashboard/editor/EditorImagenPortada";

import {
  esColorValido,
  normalizarConfig,
} from "@/lib/tienda-diseno/config";

import type {
  ConfigDiseno,
  ConfigPortada,
  FuentePortada,
  PesoTextoPortada,
} from "@/lib/tienda-diseno/types";

interface Props {
  catalogoId: string;
  config: ConfigDiseno;
  onCambiarConfig: (config: ConfigDiseno) => void;
  disabled: boolean;
  onSubiendoImagenChange?: (subiendo: boolean) => void;
}

const CLASE_INPUT =
  "min-h-11 w-full rounded-xl border border-[var(--border-card)] bg-[var(--bg-tertiary)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-60";

const FUENTES: { value: FuentePortada; nombre: string }[] = [
  { value: "heredar", nombre: "Fuente general de la tienda" },
  { value: "sistema", nombre: "Moderna — sistema" },
  { value: "serif", nombre: "Clásica — serif" },
  { value: "monoespaciada", nombre: "Monoespaciada" },
];

const PESOS: PesoTextoPortada[] = [
  400, 500, 600, 700, 800, 900,
];

function ControlNumero({
  nombre,
  value,
  min,
  max,
  unidad = "px",
  onChange,
}: {
  nombre: string;
  value: number;
  min: number;
  max: number;
  unidad?: string;
  onChange: (value: number) => void;
}) {
  const id = useId();

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="flex items-center justify-between gap-3 text-sm"
      >
        <span>{nombre}</span>

        <span className="shrink-0 text-[var(--text-secondary)]">
          {value} {unidad}
        </span>
      </label>

      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(event) =>
          onChange(Number(event.target.value))
        }
        className="h-8 w-full cursor-pointer accent-[var(--color-primary)]"
      />
    </div>
  );
}

function ControlColor({
  nombre,
  value,
  onChange,
}: {
  nombre: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const id = useId();
  const hex = value.trim();
  const valido = esColorValido(value);

  const colorNativo = /^#[\da-f]{6}([\da-f]{2})?$/i.test(hex)
    ? hex.slice(0, 7)
    : /^#[\da-f]{3,4}$/i.test(hex)
      ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
      : "#ffffff";

  const cambiarPaleta = (color: string) => {
    const alpha = /^#[\da-f]{8}$/i.test(hex)
      ? hex.slice(7)
      : /^#[\da-f]{4}$/i.test(hex)
        ? `${hex[4]}${hex[4]}`
        : "";

    onChange(`${color}${alpha}`);
  };

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm">
        {nombre}
      </label>

      <div className="flex items-center gap-3">
        <input
          type="color"
          aria-label={`Elegir ${nombre.toLowerCase()}`}
          value={colorNativo}
          onChange={(event) =>
            cambiarPaleta(event.target.value)
          }
          className="h-11 w-11 shrink-0 cursor-pointer rounded-lg"
        />

        <input
          id={id}
          type="text"
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
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

function ControlTipografia({
  nombre,
  fuente,
  peso,
  tamano,
  tamanoMovil,
  color,
  descripcion = false,
  onFuente,
  onPeso,
  onTamano,
  onTamanoMovil,
  onColor,
}: {
  nombre: string;
  fuente: FuentePortada;
  peso: PesoTextoPortada;
  tamano: number;
  tamanoMovil: number;
  color: string;
  descripcion?: boolean;
  onFuente: (value: FuentePortada) => void;
  onPeso: (value: PesoTextoPortada) => void;
  onTamano: (value: number) => void;
  onTamanoMovil: (value: number) => void;
  onColor: (value: string) => void;
}) {
  const id = useId();

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold">{nombre}</h3>

      <div className="space-y-2">
        <label htmlFor={`${id}-fuente`} className="block text-sm">
          Tipo de letra
        </label>

        <select
          id={`${id}-fuente`}
          value={fuente}
          onChange={(event) => {
            const opcion = FUENTES.find(
              (item) => item.value === event.target.value,
            );

            if (opcion) onFuente(opcion.value);
          }}
          className={CLASE_INPUT}
        >
          {FUENTES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor={`${id}-peso`} className="block text-sm">
          Grosor de la letra
        </label>

        <select
          id={`${id}-peso`}
          value={peso}
          onChange={(event) => {
            const opcion = PESOS.find(
              (item) => item === Number(event.target.value),
            );

            if (opcion !== undefined) onPeso(opcion);
          }}
          className={CLASE_INPUT}
        >
          {PESOS.map((item) => (
            <option key={item} value={item}>
              {item === 400 ? "Normal" : `Grosor ${item}`}
            </option>
          ))}
        </select>
      </div>

      <ControlNumero
        nombre="Tamaño en computadora"
        value={tamano}
        min={descripcion ? 12 : 20}
        max={descripcion ? 40 : 120}
        onChange={onTamano}
      />

      <ControlNumero
        nombre="Tamaño en teléfono"
        value={tamanoMovil}
        min={descripcion ? 12 : 18}
        max={descripcion ? 32 : 72}
        onChange={onTamanoMovil}
      />

      <ControlColor
        nombre="Color de la letra"
        value={color}
        onChange={onColor}
      />
    </div>
  );
}

export default function EditorPortada({
  catalogoId,
  config,
  onCambiarConfig,
  disabled,
  onSubiendoImagenChange,
}: Props) {
  const id = useId();
  const diseno = normalizarConfig(config);

  // Los valores normalizados alimentan los deslizadores.
  const valores = diseno.portada;

  // Conserva el texto que se está escribiendo, incluso si
  // temporalmente un color no es válido.
  const portada: ConfigPortada = {
    ...valores,
    ...config.portada,
  };

  const visible = diseno.secciones.some(
    (seccion) =>
      seccion.id === "portada" && seccion.visible,
  );

  const cambiar = (cambios: Partial<ConfigPortada>) => {
    if (disabled) return;

    onCambiarConfig({
      ...config,
      portada: {
        ...portada,
        ...cambios,
      },
    });
  };

  const separador =
    "space-y-4 border-t border-[var(--border-card)] pt-5";

  return (
    <fieldset disabled={disabled} className="space-y-5">
      <legend className="sr-only">
        Configuración del banner
      </legend>

      <label className="flex min-h-11 items-center justify-between gap-3 text-sm font-semibold">
        Mostrar portada

        <input
          type="checkbox"
          checked={visible}
          onChange={(event) => {
            if (disabled) return;

            onCambiarConfig({
              ...config,
              secciones: diseno.secciones.map((seccion) =>
                seccion.id === "portada"
                  ? {
                      ...seccion,
                      visible: event.target.checked,
                    }
                  : seccion,
              ),
            });
          }}
          className="h-5 w-5 accent-[var(--color-primary)]"
        />
      </label>

      {!visible && (
        <p className="text-xs text-[var(--text-secondary)]">
          Activa la portada para verla en la vista previa.
        </p>
      )}

      <EditorImagenPortada
        key={catalogoId}
        catalogoId={catalogoId}
        imagenUrl={portada.imagen_url}
        onChange={(url) => cambiar({ imagen_url: url })}
        disabled={disabled}
        onSubiendoChange={onSubiendoImagenChange}
      />

      <div className={separador}>
        <h3 className="text-sm font-bold">Imagen y altura</h3>

        <ControlColor
          nombre="Color de la capa sobre la imagen"
          value={portada.color_superposicion ?? valores.color_superposicion}
          onChange={(value) =>
            cambiar({ color_superposicion: value })
          }
        />

        <ControlNumero
          nombre="Opacidad de la capa"
          value={valores.opacidad_superposicion}
          min={0}
          max={100}
          unidad="%"
          onChange={(value) =>
            cambiar({ opacidad_superposicion: value })
          }
        />

        <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
          Con una capa negra, aumenta la opacidad para
          oscurecer la imagen y destacar las letras.
        </p>

        <ControlNumero
          nombre="Altura en computadora"
          value={valores.alto_escritorio}
          min={240}
          max={1000}
          onChange={(value) =>
            cambiar({ alto_escritorio: value })
          }
        />

        <ControlNumero
          nombre="Altura en teléfono"
          value={valores.alto_movil}
          min={200}
          max={800}
          onChange={(value) =>
            cambiar({ alto_movil: value })
          }
        />

        <ControlColor
          nombre="Fondo de la portada"
          value={portada.color_fondo}
          onChange={(value) => cambiar({ color_fondo: value })}
        />
      </div>

      <div className={separador} data-portada-control="titulo">
        <label htmlFor={`${id}-titulo`} className="block text-sm font-semibold">
          Texto del título
        </label>

        <input
          id={`${id}-titulo`}
          value={portada.titulo}
          maxLength={120}
          placeholder="Descubre nuestra colección"
          onChange={(event) =>
            cambiar({ titulo: event.target.value })
          }
          className={CLASE_INPUT}
        />

        <ControlTipografia
          nombre="Diseño del título"
          fuente={valores.fuente_titulo}
          peso={valores.peso_titulo}
          tamano={valores.tamano_titulo}
          tamanoMovil={valores.tamano_titulo_movil}
          color={portada.color_titulo ?? valores.color_titulo}
          onFuente={(value) => cambiar({ fuente_titulo: value })}
          onPeso={(value) => cambiar({ peso_titulo: value })}
          onTamano={(value) => cambiar({ tamano_titulo: value })}
          onTamanoMovil={(value) =>
            cambiar({ tamano_titulo_movil: value })
          }
          onColor={(value) => cambiar({ color_titulo: value })}
        />
      </div>

      <div className={separador} data-portada-control="descripcion">
        <label
          htmlFor={`${id}-descripcion`}
          className="block text-sm font-semibold"
        >
          Texto de la descripción
        </label>

        <textarea
          id={`${id}-descripcion`}
          value={portada.descripcion}
          maxLength={500}
          rows={4}
          placeholder="Presenta tu negocio."
          onChange={(event) =>
            cambiar({ descripcion: event.target.value })
          }
          className={`${CLASE_INPUT} resize-y`}
        />

        <ControlTipografia
          nombre="Diseño de la descripción"
          descripcion
          fuente={valores.fuente_descripcion}
          peso={valores.peso_descripcion}
          tamano={valores.tamano_descripcion}
          tamanoMovil={valores.tamano_descripcion_movil}
          color={portada.color_descripcion ?? valores.color_descripcion}
          onFuente={(value) =>
            cambiar({ fuente_descripcion: value })
          }
          onPeso={(value) =>
            cambiar({ peso_descripcion: value })
          }
          onTamano={(value) =>
            cambiar({ tamano_descripcion: value })
          }
          onTamanoMovil={(value) =>
            cambiar({ tamano_descripcion_movil: value })
          }
          onColor={(value) =>
            cambiar({ color_descripcion: value })
          }
        />
      </div>

      <div className={separador}>
        <div className="space-y-2">
          <label htmlFor={`${id}-alineacion`} className="block text-sm">
            Alineación del contenido
          </label>

          <select
            id={`${id}-alineacion`}
            value={portada.alineacion}
            onChange={(event) => {
              const value = event.target.value;

              if (value === "izquierda" || value === "centro") {
                cambiar({ alineacion: value });
              }
            }}
            className={CLASE_INPUT}
          >
            <option value="izquierda">Izquierda</option>
            <option value="centro">Centro</option>
          </select>
        </div>

        <label className="flex min-h-11 items-center justify-between gap-3 text-sm">
          Sombra en las letras

          <input
            type="checkbox"
            checked={valores.sombra_texto}
            onChange={(event) =>
              cambiar({ sombra_texto: event.target.checked })
            }
            className="h-5 w-5 accent-[var(--color-primary)]"
          />
        </label>

        <label className="flex min-h-11 items-center justify-between gap-3 text-sm">
          Mostrar botón

          <input
            type="checkbox"
            checked={portada.mostrar_boton}
            onChange={(event) =>
              cambiar({ mostrar_boton: event.target.checked })
            }
            className="h-5 w-5 accent-[var(--color-primary)]"
          />
        </label>

        <div className="space-y-2">
          <label htmlFor={`${id}-boton`} className="block text-sm">
            Texto del botón
          </label>

          <input
            id={`${id}-boton`}
            value={portada.texto_boton}
            maxLength={40}
            onChange={(event) =>
              cambiar({ texto_boton: event.target.value })
            }
            className={CLASE_INPUT}
          />

          <p className="text-xs text-[var(--text-secondary)]">
            Lleva al catálogo y utiliza el color principal
            de la tienda.
          </p>
        </div>
      </div>
    </fieldset>
  );
}