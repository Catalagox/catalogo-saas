// lib/tienda-diseno/theme.ts

import type { CSSProperties } from "react";

import { normalizarConfig } from "./config";

import type {
  ConfigDiseno,
  FuenteTienda,
  ProporcionImagen,
  SombraTarjeta,
} from "./types";

type VariablesTema = CSSProperties &
  Record<`--${string}`, string>;

const FUENTES: Record<FuenteTienda, string> = {
  sistema:
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  serif:
    'Georgia, Cambria, "Times New Roman", serif',
  monoespaciada:
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
};

const SOMBRAS: Record<SombraTarjeta, string> = {
  ninguna: "none",
  suave: "0 2px 8px rgba(0, 0, 0, 0.08)",
  media: "0 8px 24px rgba(0, 0, 0, 0.14)",
};

const PROPORCIONES: Record<ProporcionImagen, string> = {
  cuadrada: "1 / 1",
  horizontal: "4 / 3",
  vertical: "3 / 4",
};

export function crearTemaTienda(
  config: ConfigDiseno,
): VariablesTema {
  const tema = normalizarConfig(config);

  return {
    // Colores existentes
    "--color-bg": tema.color_fondo,
    "--color-header": tema.color_header,
    "--color-text-header": tema.color_text_header,
    "--color-border-header": tema.color_border_header,
    "--color-footer": tema.color_footer,
    "--color-text": tema.color_texto,
    "--color-price": tema.color_precio,
    "--color-hamburguesa": tema.color_hamburguesa,
    "--color-card": tema.color_tarjeta,
    "--color-categoria": tema.color_categoria,
    "--color-primary": tema.color_primario,
    "--color-lupa": tema.color_lupa,
    "--color-fondo-categoria": tema.color_fondo_categoria,
    "--color-texto-categoria": tema.color_texto_categoria,
    "--color-border-categoria": tema.color_border_categoria,

    // Tipografía
    "--tienda-font-family": FUENTES[tema.tipografia.fuente],
    "--tienda-font-size": `${tema.tipografia.tamano_base}px`,
    "--tienda-title-size": `${tema.tipografia.tamano_titulos}px`,

    // Tarjetas de productos
    "--tienda-card-radius": `${tema.tarjetas.radio_borde}px`,
    "--tienda-card-border-width": `${tema.tarjetas.grosor_borde}px`,
    "--tienda-card-border-color": tema.tarjetas.color_borde,
    "--tienda-card-shadow": SOMBRAS[tema.tarjetas.sombra],
    "--tienda-image-ratio": PROPORCIONES[tema.tarjetas.proporcion_imagen],
    "--tienda-image-fit": tema.tarjetas.ajuste_imagen,

    // Espaciado
    "--tienda-content-width": `${tema.espaciado.ancho_contenido}px`,
    "--tienda-section-gap": `${tema.espaciado.separacion_secciones}px`,
    "--tienda-product-gap": `${tema.espaciado.separacion_productos}px`,

    // Portada
    "--tienda-hero-bg": tema.portada.color_fondo,
    "--tienda-hero-text": tema.portada.color_texto,
  };
}