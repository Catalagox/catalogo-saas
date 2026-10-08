"use client";

import { useState, type CSSProperties } from "react";

import IlustracionTienda from "@/components/public/IlustracionTienda";
import { normalizarConfig } from "@/lib/tienda-diseno/config";

import type {
  ConfigPortada,
  FuentePortada,
} from "@/lib/tienda-diseno/types";

interface PortadaModernaProps {
  config: ConfigPortada;
}

type EstiloPortada = CSSProperties &
  Record<`--portada-${string}`, string>;

const FUENTES: Record<FuentePortada, string> = {
  heredar: "inherit",
  sistema:
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  serif: 'Georgia, "Times New Roman", serif',
  monoespaciada:
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
};

function ImagenFondo({ src }: { src: string }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <IlustracionTienda
        variante="portada"
        className="h-full w-full"
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      decoding="async"
      onError={() => setError(true)}
      className="block h-full w-full object-cover object-center"
    />
  );
}

export default function PortadaModerna({
  config,
}: PortadaModernaProps) {
  // Completa los ajustes ausentes en diseños anteriores.
  const portada = normalizarConfig({
    portada: config,
  }).portada;

  const imagen = portada.imagen_url?.trim();
  const titulo = portada.titulo.trim();
  const descripcion = portada.descripcion.trim();
  const centrada = portada.alineacion === "centro";

  const estiloPortada: EstiloPortada = {
    backgroundColor: portada.color_fondo,
    color: portada.color_texto,

    "--portada-alto-movil": `${portada.alto_movil}px`,
    "--portada-alto-escritorio": `${portada.alto_escritorio}px`,

    "--portada-titulo-movil": `${portada.tamano_titulo_movil}px`,
    "--portada-titulo-escritorio": `${portada.tamano_titulo}px`,

    "--portada-descripcion-movil":
      `${portada.tamano_descripcion_movil}px`,
    "--portada-descripcion-escritorio":
      `${portada.tamano_descripcion}px`,
  };

  return (
    <section
      aria-label="Presentación de la tienda"
      data-editor-section="portada"
      className="relative isolate w-full min-w-0 overflow-hidden"
      style={estiloPortada}
    >
      {/* Fotografía o ilustración de fondo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
      >
        {imagen ? (
          <ImagenFondo key={imagen} src={imagen} />
        ) : (
          <IlustracionTienda
            variante="portada"
            className="h-full w-full"
          />
        )}
      </div>

      {/* Capa de color con opacidad configurable */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          backgroundColor: portada.color_superposicion,
          opacity: portada.opacidad_superposicion / 100,
        }}
      />

      {/* Contenido encima de la imagen y de la capa */}
      <div
        className={`relative z-20 mx-auto flex min-h-[var(--portada-alto-movil)] w-full min-w-0 flex-col justify-center gap-5 px-6 py-10 sm:px-10 sm:py-12 md:min-h-[var(--portada-alto-escritorio)] lg:px-12 ${
          centrada
            ? "items-center text-center"
            : "items-start text-left"
        }`}
        style={{
          maxWidth: "var(--tienda-content-width, 1280px)",
        }}
      >
        {titulo && (
          <h2
            data-editor-element="titulo"
            className="max-w-3xl break-words text-[length:var(--portada-titulo-movil)] leading-[1.1] tracking-tight md:text-[length:var(--portada-titulo-escritorio)]"
            style={{
              color: portada.color_titulo,
              fontFamily: FUENTES[portada.fuente_titulo],
              fontWeight: portada.peso_titulo,
              textWrap: "balance",
              textShadow: portada.sombra_texto
                ? "0 2px 8px rgba(0, 0, 0, 0.55)"
                : "none",
            }}
          >
            {titulo}
          </h2>
        )}

        {descripcion && (
          <p
            data-editor-element="descripcion"
            className="max-w-xl whitespace-pre-line break-words text-[length:var(--portada-descripcion-movil)] leading-relaxed md:text-[length:var(--portada-descripcion-escritorio)]"
            style={{
              color: portada.color_descripcion,
              fontFamily: FUENTES[portada.fuente_descripcion],
              fontWeight: portada.peso_descripcion,
              textWrap: "pretty",
              textShadow: portada.sombra_texto
                ? "0 1px 5px rgba(0, 0, 0, 0.6)"
                : "none",
            }}
          >
            {descripcion}
          </p>
        )}

        {portada.mostrar_boton && (
          <a
            href="#tienda-catalogo"
            className="mt-1 inline-flex min-h-12 max-w-full items-center justify-center bg-[var(--color-primary)] px-6 py-3 text-center text-sm font-bold text-[var(--color-text-inverse,#ffffff)] transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
            style={{
              borderRadius: "var(--tienda-card-radius, 12px)",
            }}
          >
            {portada.texto_boton.trim() || "Ver productos"}
          </a>
        )}
      </div>
    </section>
  );
}