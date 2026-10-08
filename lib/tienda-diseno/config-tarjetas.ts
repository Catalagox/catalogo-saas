// lib/tienda-diseno/config-tarjetas.ts

import type { ConfigTarjetas } from "./types";

export type ConfigTarjetasCompleta = Required<ConfigTarjetas>;

type Regla = {
  valida: (value: unknown) => boolean;
  normaliza?: (value: unknown) => unknown;
  opcional?: boolean;
};

interface GrupoTarjetas {
  inicial: ConfigTarjetasCompleta;
  reglas: {
    [K in keyof ConfigTarjetasCompleta]: Regla;
  };
}

/**
 * Recibe el validador de colores para evitar
 * una dependencia circular con config.ts.
 */
export function crearGrupoTarjetas(
  esColorValido: (value: unknown) => value is string,
): GrupoTarjetas {
  const numero = (
    min: number,
    max: number,
    opcional = true,
  ): Regla => ({
    opcional,
    valida: (value) =>
      typeof value === "number" &&
      Number.isInteger(value) &&
      value >= min &&
      value <= max,
  });

  const opciones = (
    permitidas: readonly string[],
    opcional = true,
  ): Regla => ({
    opcional,
    valida: (value) =>
      typeof value === "string" &&
      permitidas.includes(value),
  });

  const booleano: Regla = {
    opcional: true,
    valida: (value) => typeof value === "boolean",
  };

  const color: Regla = {
    valida: esColorValido,
    normaliza: (value) => (value as string).trim(),
  };

  const fuente = opciones([
    "heredar",
    "sistema",
    "serif",
    "monoespaciada",
  ]);

  const alineacion = opciones([
    "izquierda",
    "centro",
    "derecha",
  ]);

  const peso: Regla = {
    opcional: true,
    valida: (value) =>
      value === 400 ||
      value === 500 ||
      value === 600 ||
      value === 700 ||
      value === 800 ||
      value === 900,
  };

  return {
    inicial: {
      // Ajustes existentes
      radio_borde: 16,
      grosor_borde: 0,
      color_borde: "#e5e7eb",
      sombra: "ninguna",
      proporcion_imagen: "cuadrada",
      ajuste_imagen: "cover",

      // Borde y separación
      mostrar_borde: false,
      separacion_horizontal: 24,
      separacion_vertical: 24,

      // Información de la tarjeta
      padding_contenido: 12,
      separacion_textos: 6,

      // Imagen
      color_fondo_imagen: "#ffffff",
      padding_imagen: 12,
      modo_altura_imagen: "proporcion",
      alto_imagen: 360,
      alto_imagen_movil: 320,

      // Título
      mostrar_titulo: true,
      alineacion_titulo: "izquierda",
      fuente_titulo: "heredar",
      tamano_titulo: 16,
      tamano_titulo_movil: 16,
      peso_titulo: 500,

      // Descripción
      mostrar_descripcion: false,
      alineacion_descripcion: "izquierda",
      fuente_descripcion: "heredar",
      tamano_descripcion: 14,
      tamano_descripcion_movil: 14,
      peso_descripcion: 400,
      lineas_descripcion: 2,

      // Precio
      mostrar_precio: true,
      alineacion_precio: "izquierda",
      tamano_precio: 14,
      tamano_precio_movil: 14,
      peso_precio: 600,

      mostrar_agotado: true,
    },

    reglas: {
      // Los campos originales siguen siendo obligatorios
      // cuando existe el grupo tarjetas.
      radio_borde: numero(0, 64, false),
      grosor_borde: numero(0, 8, false),
      color_borde: color,

      sombra: opciones(
        ["ninguna", "suave", "media"],
        false,
      ),

      proporcion_imagen: opciones(
        ["cuadrada", "horizontal", "vertical"],
        false,
      ),

      ajuste_imagen: opciones(
        ["cover", "contain"],
        false,
      ),

      // Los campos nuevos pueden faltar en diseños anteriores.
      mostrar_borde: booleano,
      separacion_horizontal: numero(0, 96),
      separacion_vertical: numero(0, 96),

      padding_contenido: numero(0, 48),
      separacion_textos: numero(0, 32),

      color_fondo_imagen: {
        ...color,
        opcional: true,
      },

      padding_imagen: numero(0, 48),

      modo_altura_imagen: opciones([
        "proporcion",
        "personalizada",
      ]),

      alto_imagen: numero(160, 800),
      alto_imagen_movil: numero(140, 640),

      mostrar_titulo: booleano,
      alineacion_titulo: alineacion,
      fuente_titulo: fuente,
      tamano_titulo: numero(12, 40),
      tamano_titulo_movil: numero(12, 32),
      peso_titulo: peso,

      mostrar_descripcion: booleano,
      alineacion_descripcion: alineacion,
      fuente_descripcion: fuente,
      tamano_descripcion: numero(12, 28),
      tamano_descripcion_movil: numero(12, 24),
      peso_descripcion: peso,
      lineas_descripcion: numero(1, 6),

      mostrar_precio: booleano,
      alineacion_precio: alineacion,
      tamano_precio: numero(12, 40),
      tamano_precio_movil: numero(12, 32),
      peso_precio: peso,

      mostrar_agotado: booleano,
    },
  };
}