"use client";

import PortadaModerna from "@/components/public/plantillas/PortadaModerna";
import ProductosModerna from "@/components/public/plantillas/ProductosModerna";
import ProductosDestacados from "@/components/public/plantillas/ProductosDestacados";

import { normalizarConfig } from "@/lib/tienda-diseno/config";

import type { CategoriaTienda, ConfigDiseno } from "@/lib/tienda-diseno/types";

interface PlantillaModernaProps {
  categorias: CategoriaTienda[];
  config: ConfigDiseno;
  countryCode: string;
  rutaBase: string;
  onTrackCategoria?: (categoriaId: string) => void | Promise<void>;
}

export default function PlantillaModerna({
  categorias,
  config,
  countryCode,
  rutaBase,
}: PlantillaModernaProps) {
  const diseno = normalizarConfig(config);

  const categoriasSeguras: CategoriaTienda[] = (
    Array.isArray(categorias) ? categorias : []
  )
    .filter(
      (categoria) =>
        categoria && Boolean(categoria.id) && Boolean(categoria.nombre?.trim()),
    )
    .map((categoria) => ({
      ...categoria,
      productos: (Array.isArray(categoria.productos)
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

  return (
    <>
      {diseno.secciones.map((seccion) => {
        if (!seccion.visible) return null;

        switch (seccion.id) {
          case "portada":
            return <PortadaModerna key={seccion.id} config={diseno.portada} />;

          case "categorias":
            // Moderna presenta una colección continua.
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
