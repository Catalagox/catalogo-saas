import { obtenerPlantilla } from "./plantillas";
import { normalizarConfig } from "./config";

import type {
  CategoriaTienda,
  DatosRenderTienda,
  PlantillaId,
  ProductoTienda,
} from "./types";

const RUTA_IMAGENES = "/demo-plantillas";

function crearProductosDemo(): ProductoTienda[] {
  return [
    {
      id: "00000000-0000-4000-8000-000000000001",
      nombre: "Camiseta esencial",
      descripcion:
        "Una prenda cómoda y versátil para todos los días.",
      precio: 59,
      imagen_url: `${RUTA_IMAGENES}/camiseta.png`,
      disponible: true,
      stock: 20,
      slug: "camiseta-esencial",
    },
    {
      id: "00000000-0000-4000-8000-000000000002",
      nombre: "Bolso urbano",
      descripcion:
        "Diseño práctico para llevar tus accesorios favoritos.",
      precio: 129,
      imagen_url: `${RUTA_IMAGENES}/bolso.png`,
      disponible: true,
      stock: 12,
      slug: "bolso-urbano",
    },
    {
      id: "00000000-0000-4000-8000-000000000003",
      nombre: "Zapatillas casuales",
      descripcion:
        "Comodidad y estilo para acompañarte a donde vayas.",
      precio: 189,
      imagen_url: `${RUTA_IMAGENES}/zapatillas.png`,
      disponible: true,
      stock: 8,
      slug: "zapatillas-casuales",
    },
    {
      id: "00000000-0000-4000-8000-000000000004",
      nombre: "Gorra clásica",
      descripcion:
        "El complemento perfecto para tu colección.",
      precio: 45,
      imagen_url: `${RUTA_IMAGENES}/gorra.png`,
      disponible: true,
      stock: 15,
      slug: "gorra-clasica",
    },
  ];
}

export function obtenerDemoPlantilla(
  plantillaId: PlantillaId,
): DatosRenderTienda {
  const plantilla = obtenerPlantilla(plantillaId);
  const productos = crearProductosDemo();

  // Completa los campos opcionales sin usar
  // afirmaciones de valor no nulo.
  const config = normalizarConfig(plantilla.configInicial);

  const categorias: CategoriaTienda[] = [
    {
      id: "00000000-0000-4000-8000-000000000101",
      nombre: "Nuestra colección",
      productos,
    },
  ];

  return {
    tienda: {
      id: `demo-${plantillaId}`,
      user_id: `demo-${plantillaId}`,
      nombre: "Colección Studio",
      slug: null,
      logo: null,
      pais_code: "PE",
      whatsapp: null,
      mostrar_boton_whatsapp: false,
      mensaje_whatsapp: null,
      instagram: null,
      facebook: null,
      tiktok: null,
      youtube: null,
    },

    categorias,
    plantilla: plantillaId,

    config: {
      ...config,

      portada: {
        ...config.portada,
        titulo: "Diseñado para tu día a día",
        descripcion:
          "Descubre una colección de prendas y accesorios que combinan comodidad y estilo.",
        imagen_url: `${RUTA_IMAGENES}/portada.png`,
      },

      destacados: {
        titulo: "Nuestros favoritos",
        producto_ids: productos
          .slice(0, 2)
          .map((producto) => producto.id),
      },

      secciones: config.secciones.map((seccion) => ({
        ...seccion,
        visible:
          seccion.id === "destacados"
            ? true
            : seccion.visible,
      })),
    },

    rutaBase: `/demo-plantillas/${plantillaId}`,
  };
}