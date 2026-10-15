"use client";

import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";
import { normalizarConfig } from "@/lib/tienda-diseno/config";
import { esEnlacePie } from "@/lib/tienda-diseno/config-pie";
import type { ConfigDiseno, RedSocialPie } from "@/lib/tienda-diseno/types";

interface TiendaFooterProps {
  instagram?: string | null;
  facebook?: string | null;
  tiktok?: string | null;
  youtube?: string | null;
  nombreTienda?: string;
  config?: ConfigDiseno;
  rutaBase?: string;
}
const REDES = [
  { id: "instagram", nombre: "Instagram", base: "https://instagram.com/", Icono: FaInstagram },
  { id: "facebook", nombre: "Facebook", base: "https://facebook.com/", Icono: FaFacebookF },
  { id: "tiktok", nombre: "TikTok", base: "https://tiktok.com/@", Icono: FaTiktok },
  { id: "youtube", nombre: "YouTube", base: "https://youtube.com/@", Icono: FaYoutube },
] as const;

function normalizarUrlSocial(valor: string | null | undefined, base: string): string | null {
  if (typeof valor !== "string" || !valor.trim() || valor.length > 2048) return null;
  const limpio = valor.trim();
  if (/[\u0000-\u0020\\]/.test(limpio) || limpio.startsWith("//")) return null;
  if (/^[a-z][a-z0-9+.-]*:/i.test(limpio) && !/^https?:\/\//i.test(limpio)) return null;
  let candidata: string;
  if (/^https?:\/\//i.test(limpio)) candidata = limpio;
  else if (/^(?:www\.)?[a-z0-9-]+\.[a-z]{2,}(?:\/|$)/i.test(limpio)) candidata = `https://${limpio}`;
  else {
    const usuario = limpio.replace(/^@/, "").replace(/^\/+|\/+$/g, "");
    if (!usuario) return null;
    candidata = `${base}${encodeURIComponent(usuario)}`;
  }
  try {
    const url = new URL(candidata);
    return (url.protocol === "https:" || url.protocol === "http:") && !url.username && !url.password ? url.toString() : null;
  } catch { return null; }
}

export default function TiendaFooter(props: TiendaFooterProps) {
  const { config, nombreTienda, rutaBase = "" } = props;
  const diseno = normalizarConfig(config);
  const pie = diseno.pie;
  if (!pie.mostrar) return null;
  const nombre = pie.nombre.trim() || nombreTienda || "";
  const fondo = pie.heredar_fondo ? (config ? diseno.color_footer : "var(--color-footer, #111827)") : pie.color_fondo;
  const alineacion = pie.alineacion === "izquierda" ? "items-start text-left" : pie.alineacion === "derecha" ? "items-end text-right" : "items-center text-center";
  const redes = REDES.flatMap(red => {
    const ajuste = pie.redes[red.id as RedSocialPie];
    if (!pie.mostrar_redes || !ajuste.visible) return [];
    const href = normalizarUrlSocial(ajuste.url === null ? props[red.id] : ajuste.url, red.base);
    return href ? [{ ...red, href }] : [];
  });
  const enlaces = pie.enlaces.filter(e => e.visible && e.texto.trim() && e.url.trim() && esEnlacePie(e.url));
  function hrefEnlace(url: string) {
    const limpio = url.trim();
    // Las rutas internas se escriben relativas a la tienda: /paginas/contacto.
    return limpio.startsWith("/") ? `${rutaBase.replace(/\/$/, "")}${limpio}` : limpio;
  }
  return (
    <footer className="mt-0 w-full" style={{ backgroundColor: fondo, color: pie.color_texto, paddingTop: pie.padding_superior, paddingBottom: pie.padding_inferior, fontSize: pie.tamano_texto }}>
      <div className={`mx-auto flex max-w-3xl flex-col gap-6 px-6 ${alineacion}`}>
        {(pie.mostrar_nombre || pie.descripcion.trim()) && (
          <div className="max-w-xl">
            {pie.mostrar_nombre && nombre && <p className="text-lg font-bold">{nombre}</p>}
            {pie.descripcion.trim() && <p className="mt-2 whitespace-pre-line break-words leading-relaxed opacity-80">{pie.descripcion}</p>}
          </div>
        )}
        {enlaces.length > 0 && (
          <nav aria-label="Enlaces del pie de página" className="flex flex-wrap gap-x-5 gap-y-3">
            {enlaces.map(enlace => <a key={enlace.id} href={hrefEnlace(enlace.url)} target={enlace.nueva_pestana ? "_blank" : undefined} rel={enlace.nueva_pestana ? "noopener noreferrer" : undefined} className="break-words underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4">{enlace.texto}</a>)}
          </nav>
        )}
        {redes.length > 0 && (
          <div className={`flex flex-col ${alineacion}`}>
            {pie.titulo_redes.trim() && <p className="mb-5 font-semibold tracking-wide">{pie.titulo_redes}</p>}
            <div className="flex flex-wrap gap-4">
              {redes.map(({ id, nombre: redNombre, href, Icono }) => (
                <a key={id} href={href} target="_blank" rel="noopener noreferrer" aria-label={`Visitar ${redNombre} de ${nombre || "la tienda"}`} title={redNombre}
                  className="flex min-h-11 min-w-11 items-center justify-center rounded-full border p-3 transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4"
                  style={{ color: pie.color_iconos, backgroundColor: pie.color_fondo_iconos, borderColor: pie.color_borde }}>
                  <Icono size={pie.tamano_iconos} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        )}
        {pie.mostrar_derechos && <p className="select-none text-[0.8em] leading-relaxed opacity-60">© {new Date().getFullYear()}{nombre ? ` ${nombre}.` : ""} {pie.texto_derechos}</p>}
      </div>
    </footer>
  );
}
