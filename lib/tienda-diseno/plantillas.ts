import {
  CONFIG_INICIAL,
  VERSION_CONFIG,
  normalizarConfig,
} from "./config";

import type {
  DefinicionPlantilla,
  PlantillaId,
} from "./types";

const CONFIG_MODERNA = normalizarConfig({
  ...CONFIG_INICIAL,

  estilo_menu: "galeria",

  color_primario: "#15803d",
  color_fondo: "#fafaf9",

  color_header: "#ffffff",
  color_text_header: "#18181b",
  color_border_header: "#e4e4e7",
  color_hamburguesa: "#18181b",
  color_lupa: "#18181b",

  color_footer: "#18181b",
  color_texto: "#27272a",
  color_precio: "#15803d",
  color_tarjeta: "#ffffff",
  color_categoria: "#e4e4e7",

  color_fondo_categoria: "#fafaf9",
  color_texto_categoria: "#18181b",
  color_border_categoria: "#e4e4e7",

  tipografia: {
    fuente: "sistema",
    tamano_base: 16,
    tamano_titulos: 40,
  },

  tarjetas: {
    radio_borde: 20,
    grosor_borde: 1,
    color_borde: "#e4e4e7",
    sombra: "suave",
    proporcion_imagen: "cuadrada",
    ajuste_imagen: "cover",
  },

  espaciado: {
    ancho_contenido: 1440,
    separacion_secciones: 48,
    separacion_productos: 24,
  },

  portada: {
    titulo: "Descubre nuestra colección",
    descripcion:
      "Explora nuestros productos y encuentra tus favoritos.",
    imagen_url: null,
    alineacion: "centro",
    color_fondo: "#f0fdf4",
    color_texto: "#14532d",
    mostrar_boton: true,
    texto_boton: "Explorar productos",
    destino_boton: "catalogo",
  },

  destacados: {
    titulo: "Nuestros favoritos",
    producto_ids: [],
  },

  secciones: [
    { id: "portada", visible: true },
    { id: "destacados", visible: false },
    { id: "categorias", visible: true },
    { id: "catalogo", visible: true },
  ],
});

export const PLANTILLAS: ReadonlyArray<DefinicionPlantilla> = [
  {
    id: "clasica",
    nombre: "Clásica",
    descripcion:
      "Catálogo por categorías, con presentación en lista o galería, portada opcional y productos destacados.",
    version_config: VERSION_CONFIG,
    configInicial: normalizarConfig(CONFIG_INICIAL),
  },
  {
    id: "moderna",
    nombre: "Moderna",
    descripcion:
      "Portada de bienvenida, productos en cuadrícula y tarjetas con bordes suaves. Ideal para presentar una colección.",
    version_config: VERSION_CONFIG,
    configInicial: normalizarConfig(CONFIG_MODERNA),
  },
];

export function obtenerPlantilla(
  id: PlantillaId,
): DefinicionPlantilla {
  const plantilla = PLANTILLAS.find(
    (item) => item.id === id,
  );

  if (!plantilla) {
    throw new Error(
      `La plantilla "${id}" no está registrada.`,
    );
  }

  return {
    ...plantilla,
    configInicial: normalizarConfig(plantilla.configInicial),
  };
}