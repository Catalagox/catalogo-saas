"use client";

import { useState, type CSSProperties } from "react";
import IlustracionTienda from "@/components/public/IlustracionTienda";
import { normalizarConfig } from "@/lib/tienda-diseno/config";
import type { ConfigPortada, FuentePortada } from "@/lib/tienda-diseno/types";

interface PortadaModernaProps { config: ConfigPortada; }
type EstiloPortada = CSSProperties & Record<`--portada-${string}`, string>;
const FUENTES: Record<FuentePortada, string> = {
  heredar: "inherit",
  sistema: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  serif: 'Georgia, "Times New Roman", serif',
  monoespaciada: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
};
function ImagenFondo({ src }: { src: string }) {
  const [error, setError] = useState(false);
  if (error) return <IlustracionTienda variante="portada" className="h-full w-full" />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" decoding="async" onError={() => setError(true)} className="block h-full w-full object-cover object-center" />
  );
}
export default function PortadaModerna({ config }: PortadaModernaProps) {
  const portada = normalizarConfig({ portada: config }).portada;
  const imagen = portada.imagen_url?.trim();
  const titulo = portada.titulo.trim();
  const descripcion = portada.descripcion.trim();
  const alineacion = portada.alineacion === "centro" ? "items-center text-center"
    : portada.alineacion === "derecha" ? "items-end text-right" : "items-start text-left";
  const alturaAutomatica = portada.ajustar_altura_contenido;
  const tieneContenido = (portada.mostrar_titulo && Boolean(titulo)) || (portada.mostrar_descripcion && Boolean(descripcion)) || portada.mostrar_boton;
  const estiloPortada: EstiloPortada = {
    backgroundColor: portada.color_fondo, color: portada.color_texto,
    "--portada-alto-movil": `${alturaAutomatica ? portada.alto_minimo : portada.alto_movil}px`,
    "--portada-alto-escritorio": `${alturaAutomatica ? portada.alto_minimo : portada.alto_escritorio}px`,
    "--portada-titulo-movil": `${portada.tamano_titulo_movil}px`,
    "--portada-titulo-escritorio": `${portada.tamano_titulo}px`,
    "--portada-descripcion-movil": `${portada.tamano_descripcion_movil}px`,
    "--portada-descripcion-escritorio": `${portada.tamano_descripcion}px`,
  };
  return (
    <section aria-label="Presentación de la tienda" data-editor-section="portada" className="relative isolate w-full min-w-0 overflow-hidden" style={estiloPortada}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        {imagen ? <ImagenFondo key={imagen} src={imagen} /> : <IlustracionTienda variante="portada" className="h-full w-full" />}
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10" style={{ backgroundColor: portada.color_superposicion, opacity: portada.opacidad_superposicion / 100 }} />
      <div className={`relative z-20 mx-auto flex min-h-[var(--portada-alto-movil)] w-full min-w-0 flex-col justify-center px-6 sm:px-10 md:min-h-[var(--portada-alto-escritorio)] lg:px-12 ${alturaAutomatica ? tieneContenido ? "gap-3 py-4 sm:py-5" : "gap-0 py-0" : "gap-5 py-10 sm:py-12"} ${alineacion}`} style={{ maxWidth: "var(--tienda-content-width, 1280px)" }}>
        {portada.mostrar_titulo && titulo && (
          <h1 data-editor-element="titulo" className="max-w-3xl break-words text-[length:var(--portada-titulo-movil)] leading-[1.1] tracking-tight md:text-[length:var(--portada-titulo-escritorio)]" style={{ color: portada.color_titulo, fontFamily: FUENTES[portada.fuente_titulo], fontWeight: portada.peso_titulo, textWrap: "balance", textShadow: portada.sombra_texto ? "0 2px 8px rgba(0, 0, 0, 0.55)" : "none" }}>
            {titulo}
          </h1>
        )}
        {portada.mostrar_descripcion && descripcion && (
          <p data-editor-element="descripcion" className="max-w-xl whitespace-pre-line break-words text-[length:var(--portada-descripcion-movil)] leading-relaxed md:text-[length:var(--portada-descripcion-escritorio)]" style={{ color: portada.color_descripcion, fontFamily: FUENTES[portada.fuente_descripcion], fontWeight: portada.peso_descripcion, textWrap: "pretty", textShadow: portada.sombra_texto ? "0 1px 5px rgba(0, 0, 0, 0.6)" : "none" }}>
            {descripcion}
          </p>
        )}
        {portada.mostrar_boton && (
          <a data-editor-element="boton" href="#tienda-catalogo" className="mt-1 inline-flex min-h-12 max-w-full items-center justify-center bg-[var(--color-primary)] px-6 py-3 text-center text-sm font-bold text-[var(--color-text-inverse,#ffffff)] transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current" style={{ borderRadius: "var(--tienda-card-radius, 12px)" }}>
            {portada.texto_boton.trim() || "Ver productos"}
          </a>
        )}
      </div>
    </section>
  );
}
