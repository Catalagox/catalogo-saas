"use client";

import TiendaLista from "@/components/public/TiendaLista";
import TiendaGaleria from "@/components/public/TiendaGaleria";
import CategoriasSlider from "@/components/public/CategoriasSlider";
import CatalogoVacio from "@/components/public/CatalogoVacio";

import PortadaTienda from "@/components/public/plantillas/PortadaTienda";
import ProductosDestacados from "@/components/public/plantillas/ProductosDestacados";

import { normalizarConfig } from "@/lib/tienda-diseno/config";

import type {
  CategoriaTienda,
  ConfigDiseno,
} from "@/lib/tienda-diseno/types";

interface PlantillaClasicaProps {
  categorias: CategoriaTienda[];
  config: ConfigDiseno;
  countryCode: string;
  rutaBase: string;
  onTrackCategoria?: (
    categoriaId: string,
  ) => void | Promise<void>;
}

function ignorarTracking(): void {}

export default function PlantillaClasica({
  categorias,
  config,
  countryCode,
  rutaBase,
  onTrackCategoria = ignorarTracking,
}: PlantillaClasicaProps) {
  const diseno = normalizarConfig(config);

  const categoriasSeguras: CategoriaTienda[] = (
    Array.isArray(categorias) ? categorias : []
  )
    .filter(
      (categoria) =>
        categoria &&
        Boolean(categoria.id) &&
        Boolean(categoria.nombre?.trim()),
    )
    .map((categoria) => ({
      ...categoria,
      productos: (
        Array.isArray(categoria.productos)
          ? categoria.productos
          : []
      ).filter(
        (producto) =>
          producto &&
          producto.disponible !== false &&
          Boolean(producto.id) &&
          Boolean(producto.nombre?.trim()) &&
          Boolean(producto.slug?.trim()) &&
          Number.isFinite(producto.precio) &&
          producto.precio >= 0,
      ),
    }))
    .filter((categoria) => categoria.productos.length > 0);

  const tieneProductos = categoriasSeguras.length > 0;

  const propsProductos = {
    categorias: categoriasSeguras,
    countryCode,
    rutaBase,
    colorFondoCategoria: diseno.color_fondo_categoria,
    colorTextoCategoria: diseno.color_texto_categoria,
    colorBorderCategoria: diseno.color_border_categoria,
  };

  return (
    <>
      {diseno.secciones.map((seccion) => {
        if (!seccion.visible) return null;

        switch (seccion.id) {
          case "portada":
            return (
              <PortadaTienda
                key={seccion.id}
                config={diseno.portada}
              />
            );

          case "destacados":
            return (
              <ProductosDestacados
                key={seccion.id}
                categorias={categoriasSeguras}
                config={diseno.destacados}
                countryCode={countryCode}
                rutaBase={rutaBase}
              />
            );

          case "categorias":
            if (!tieneProductos) return null;

            return (
              <div
                key={seccion.id}
                data-editor-section="categorias"
              >
                <CategoriasSlider
                  categorias={categoriasSeguras}
                  onTrackCategoria={onTrackCategoria}
                  colorFondoCategoria={diseno.color_fondo_categoria}
                  colorTextoCategoria={diseno.color_texto_categoria}
                  colorBorderCategoria={diseno.color_border_categoria}
                  colorHeader={diseno.color_header}
                  colorTextHeader={diseno.color_text_header}
                  colorBorderHeader={diseno.color_border_header}
                />
              </div>
            );

          case "catalogo":
            return (
              <main
                key={seccion.id}
                id="tienda-catalogo"
                data-editor-section="catalogo"
                className="mx-auto mb-0 w-full min-w-0 flex-grow scroll-mt-24 px-0 pb-0 sm:px-6 lg:px-8"
                style={{
                  maxWidth: `${diseno.espaciado.ancho_contenido}px`,
                  paddingTop:
                    `${diseno.espaciado.separacion_secciones}px`,
                }}
              >
                {!tieneProductos ? (
                  <CatalogoVacio />
                ) : diseno.estilo_menu === "galeria" ? (
                  <TiendaGaleria {...propsProductos} />
                ) : (
                  <TiendaLista {...propsProductos} />
                )}
              </main>
            );

          default:
            return null;
        }
      })}
    </>
  );
}