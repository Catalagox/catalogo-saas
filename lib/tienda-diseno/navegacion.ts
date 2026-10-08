import type { ConfigNavegacion, ResumenPaginaTienda } from "./types";

type CategoriaMenu = { id: string; nombre: string };
export type EnlaceNavegacion = {
  id: string;
  etiqueta: string;
  href: string;
  externo: boolean;
  nuevaPestana: boolean;
};

export function normalizarRutaTienda(rutaBase: string): string {
  const base = rutaBase.trim().replace(/\/+$/, "");
  if (!base) return "/";
  if (!base.startsWith("/") || base.startsWith("//") || /[\\\u0000-\u0020\u007f?#]/.test(base)) return "/";
  return base;
}

function urlExternaValida(value: string): boolean {
  const valueLimpio = value.trim();
  if (valueLimpio.length > 2048 || !/^https?:\/\//i.test(valueLimpio) || /[\\\u0000-\u0020\u007f]/.test(valueLimpio)) return false;
  try {
    const url = new URL(valueLimpio);
    return (url.protocol === "http:" || url.protocol === "https:") && !!url.hostname && !url.username && !url.password;
  } catch { return false; }
}

export function crearEnlacesNavegacion({ navegacion, categorias, paginas, rutaBase }: {
  navegacion?: ConfigNavegacion;
  categorias: CategoriaMenu[];
  paginas: ResumenPaginaTienda[];
  rutaBase: string;
}): EnlaceNavegacion[] {
  const inicio = normalizarRutaTienda(rutaBase);
  if (!navegacion || navegacion.modo === "automatica") {
    return [
      { id: "auto-inicio", etiqueta: "Inicio", href: inicio, externo: false, nuevaPestana: false },
      ...categorias.map((c) => ({ id: `auto-cat-${c.id}`, etiqueta: c.nombre, href: `${inicio}#cat-${encodeURIComponent(c.id)}`, externo: false, nuevaPestana: false })),
    ];
  }
  const resultado: EnlaceNavegacion[] = [];
  for (const enlace of navegacion.enlaces) {
    if (!enlace.visible || !enlace.etiqueta.trim()) continue;
    let href: string;
    let externo = false;
    let nuevaPestana = false;
    switch (enlace.tipo) {
      case "inicio": href = inicio; break;
      case "catalogo": href = `${inicio}#catalogo`; break;
      case "categoria": {
        const categoria = categorias.find((c) => c.id.toLowerCase() === enlace.categoria_id.toLowerCase());
        if (!categoria) continue;
        href = `${inicio}#cat-${encodeURIComponent(categoria.id)}`;
        break;
      }
      case "pagina": {
        const pagina = paginas.find((p) => p.id.toLowerCase() === enlace.pagina_id.toLowerCase() && p.estado === "publicada");
        if (!pagina || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(pagina.slug)) continue;
        href = `${inicio === "/" ? "" : inicio}/paginas/${encodeURIComponent(pagina.slug)}`;
        break;
      }
      case "externo": {
        if (!urlExternaValida(enlace.url)) continue;
        href = enlace.url.trim();
        externo = true;
        nuevaPestana = enlace.nueva_pestana;
        break;
      }
      default: continue;
    }
    resultado.push({ id: enlace.id, etiqueta: enlace.etiqueta.trim(), href, externo, nuevaPestana });
  }
  return resultado;
}
