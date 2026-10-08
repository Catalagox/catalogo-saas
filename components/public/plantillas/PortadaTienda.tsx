"use client";

import { useState } from "react";

import IlustracionTienda from "@/components/public/IlustracionTienda";

import type { ConfigPortada } from "@/lib/tienda-diseno/types";

interface PortadaTiendaProps {
  config: ConfigPortada;
}

function ImagenPortada({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        role="img"
        aria-label="Ilustración de presentación de la tienda"
        className="h-full min-h-[240px] w-full"
      >
        <IlustracionTienda variante="portada" />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      decoding="async"
      onError={() => setError(true)}
      className="block h-full max-h-[560px] min-h-[240px] w-full object-cover"
    />
  );
}

export default function PortadaTienda({
  config,
}: PortadaTiendaProps) {
  const centrada = config.alineacion === "centro";
  const imagen = config.imagen_url?.trim();
  const titulo = config.titulo.trim();
  const descripcion = config.descripcion.trim();

  return (
    <section
      aria-label="Presentación de la tienda"
      data-editor-section="portada"
      className="mx-auto w-full min-w-0 px-4 py-6 sm:px-6 lg:px-8"
      style={{
        maxWidth: "var(--tienda-content-width, 1280px)",
      }}
    >
      <div
        className={`grid overflow-hidden ${
          centrada
            ? "grid-cols-1"
            : "items-center md:grid-cols-2"
        }`}
        style={{
          backgroundColor: config.color_fondo,
          color: config.color_texto,
          borderRadius: "var(--tienda-card-radius, 16px)",
        }}
      >
        <div
          className={`flex min-w-0 flex-col gap-5 p-6 sm:p-10 lg:p-12 ${
            centrada
              ? "items-center text-center"
              : "items-start text-left"
          }`}
        >
          {titulo && (
            <h2
              className="max-w-3xl break-words font-extrabold leading-tight tracking-tight"
              style={{
                fontSize:
                  "clamp(24px, 6vw, var(--tienda-title-size, 32px))",
              }}
            >
              {titulo}
            </h2>
          )}

          {descripcion && (
            <p
              className="max-w-2xl whitespace-pre-line break-words leading-relaxed"
              style={{
                fontSize: "var(--tienda-font-size, 16px)",
              }}
            >
              {descripcion}
            </p>
          )}

          {config.mostrar_boton && (
            <a
              href="#tienda-catalogo"
              className="inline-flex min-h-11 max-w-full items-center justify-center rounded-xl bg-[var(--color-primary)] px-6 py-3 text-center text-sm font-bold text-[var(--color-text-inverse,#ffffff)] transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
            >
              {config.texto_boton}
            </a>
          )}
        </div>

        <div
          className={`min-w-0 overflow-hidden ${
            centrada
              ? "mx-6 mb-6 rounded-xl sm:mx-10 sm:mb-10"
              : "h-full"
          }`}
        >
          {imagen ? (
            <ImagenPortada
              key={imagen}
              src={imagen}
              alt={titulo || "Presentación de la tienda"}
            />
          ) : (
            <div
              role="img"
              aria-label="Ilustración de presentación de la tienda"
              className="aspect-[2/1] min-h-[240px] w-full"
            >
              <IlustracionTienda variante="portada" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}