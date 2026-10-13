"use client";

import CategoriasSlider from "@/components/public/CategoriasSlider";
import PortadaModerna from "@/components/public/plantillas/PortadaModerna";
import ProductosModerna from "@/components/public/plantillas/ProductosModerna";
import ProductosDestacados from "@/components/public/plantillas/ProductosDestacados";

import { normalizarConfig } from "@/lib/tienda-diseno/config";

import type {
  CategoriaTienda,
  ConfigDiseno,
} from "@/lib/tienda-diseno/types";

interface PlantillaModernaProps {
  categorias: CategoriaTienda[];
  config: ConfigDiseno;
  countryCode: string;
  rutaBase: string;
  onTrackCategoria?: (
    categoriaId: string,
  ) => void | Promise<void>;
}

function ignorarTracking(): void {}

export default function PlantillaModerna({
  categorias,
  config,
  countryCode,
  rutaBase,
  onTrackCategoria = ignorarTracking,
}: PlantillaModernaProps) {
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

  const mostrarPortada = diseno.secciones.some(
    (seccion) =>
      seccion.id === "portada" && seccion.visible,
  );

  const mostrarCategorias =
    categoriasSeguras.length > 0 &&
    diseno.secciones.some(
      (seccion) =>
        seccion.id === "categorias" && seccion.visible,
    );

  const barraCategorias = mostrarCategorias ? (
    <div
      data-editor-section="categorias"
      className="w-full min-w-0"
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
  ) : null;

  return (
    <>
      {!mostrarPortada && barraCategorias}

      {diseno.secciones.map((seccion) => {
        if (!seccion.visible) return null;

        switch (seccion.id) {
          case "portada":
            return (
              <div key={seccion.id} className="w-full min-w-0">
                <PortadaModerna config={diseno.portada} />
                {barraCategorias}
              </div>
            );

          case "categorias":
            // Se muestra junto a la portada para mantener
            // la barra inmediatamente debajo del banner.
            return null;

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

          case "catalogo":
            return (
              <main
                key={seccion.id}
                id="tienda-catalogo"
                data-editor-section="catalogo"
                className="w-full min-w-0 flex-grow scroll-mt-24"
              >
                <ProductosModerna
                  categorias={categoriasSeguras}
                  config={diseno}
                  countryCode={countryCode}
                  rutaBase={rutaBase}
                />
              </main>
            );

          default:
            return null;
        }
      })}
    </>
  );
}