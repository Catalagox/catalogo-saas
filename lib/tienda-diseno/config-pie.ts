import type { ConfigPie, RedSocialPie } from "./types";

type Objeto = Record<string, unknown>;
const objeto = (v: unknown): v is Objeto => typeof v === "object" && v !== null && !Array.isArray(v);
export const REDES_PIE: readonly RedSocialPie[] = ["instagram", "facebook", "tiktok", "youtube"];
const INICIAL: ConfigPie = {
  mostrar: true, mostrar_nombre: false, nombre: "", descripcion: "",
  mostrar_redes: true, titulo_redes: "Síguenos",
  redes: { instagram: { visible: true, url: null }, facebook: { visible: true, url: null }, tiktok: { visible: true, url: null }, youtube: { visible: true, url: null } },
  enlaces: [], mostrar_derechos: true, texto_derechos: "Todos los derechos reservados.",
  alineacion: "centro", heredar_fondo: true, color_fondo: "#111827", color_texto: "#ffffff",
  color_iconos: "#ffffff", color_fondo_iconos: "#ffffff0d", color_borde: "#ffffff1a",
  tamano_texto: 14, tamano_iconos: 19, padding_superior: 40, padding_inferior: 48,
};

export function esEnlacePie(valor: unknown): valor is string {
  if (typeof valor !== "string" || valor.length > 2048) return false;
  const texto = valor.trim();
  if (!texto) return true;
  if (/[\u0000-\u0020\\]/.test(texto)) return false;
  if (texto.startsWith("/")) return !texto.startsWith("//");
  try {
    const url = new URL(texto);
    return (url.protocol === "https:" || url.protocol === "http:") && !url.username && !url.password;
  } catch { return false; }
}

export function crearConfigPie(esColorValido: (v: unknown) => boolean) {
  const reglas: Record<Exclude<keyof ConfigPie, "redes" | "enlaces">, (v: unknown) => boolean> = {
    mostrar: v => typeof v === "boolean", mostrar_nombre: v => typeof v === "boolean",
    nombre: v => typeof v === "string" && v.length <= 120,
    descripcion: v => typeof v === "string" && v.length <= 1500,
    mostrar_redes: v => typeof v === "boolean",
    titulo_redes: v => typeof v === "string" && v.length <= 120,
    mostrar_derechos: v => typeof v === "boolean",
    texto_derechos: v => typeof v === "string" && v.length <= 300,
    alineacion: v => ["izquierda", "centro", "derecha"].includes(v as string),
    heredar_fondo: v => typeof v === "boolean",
    color_fondo: esColorValido, color_texto: esColorValido, color_iconos: esColorValido,
    color_fondo_iconos: esColorValido, color_borde: esColorValido,
    tamano_texto: v => entero(v, 10, 24), tamano_iconos: v => entero(v, 14, 36),
    padding_superior: v => entero(v, 0, 120), padding_inferior: v => entero(v, 0, 120),
  };
  const campos = Object.keys(reglas) as Array<keyof typeof reglas>;
  function entero(v: unknown, min: number, max: number) { return typeof v === "number" && Number.isInteger(v) && v >= min && v <= max; }
  function redValida(v: unknown) {
    return objeto(v) && (v.visible === undefined || typeof v.visible === "boolean") &&
      (v.url === undefined || v.url === null || (typeof v.url === "string" && v.url.length <= 2048));
  }
  function enlaceValido(v: unknown, comprobarUrl = true): v is ConfigPie["enlaces"][number] {
    return objeto(v) && typeof v.id === "string" && v.id.length > 0 && v.id.length <= 100 &&
      typeof v.texto === "string" && v.texto.length <= 100 && typeof v.url === "string" && v.url.length <= 2048 && (!comprobarUrl || esEnlacePie(v.url)) &&
      typeof v.visible === "boolean" && typeof v.nueva_pestana === "boolean";
  }
  function enlacesValidos(v: unknown, comprobarUrl = true): v is ConfigPie["enlaces"] {
    return Array.isArray(v) && v.length <= 12 && v.every(e => enlaceValido(e, comprobarUrl)) && new Set(v.map(e => e.id)).size === v.length;
  }
  function normalizar(valor: unknown, respaldo?: unknown): ConfigPie {
    const origen = objeto(valor) ? valor : {};
    const base = objeto(respaldo) ? respaldo : {};
    const resultado: ConfigPie = { ...INICIAL, redes: { ...INICIAL.redes }, enlaces: [] };
    function asignar<K extends keyof typeof reglas>(campo: K) {
      resultado[campo] = (reglas[campo](origen[campo]) ? origen[campo] : reglas[campo](base[campo]) ? base[campo] : INICIAL[campo]) as ConfigPie[K];
    }
    campos.forEach(asignar);
    const redes = objeto(origen.redes) ? origen.redes : {};
    const redesBase = objeto(base.redes) ? base.redes : {};
    for (const id of REDES_PIE) {
      const r = objeto(redes[id]) ? redes[id] : {};
      const rb = objeto(redesBase[id]) ? redesBase[id] : {};
      resultado.redes[id] = {
        visible: typeof r.visible === "boolean" ? r.visible : typeof rb.visible === "boolean" ? rb.visible : true,
        url: r.url === null || typeof r.url === "string" ? r.url : rb.url === null || typeof rb.url === "string" ? rb.url : null,
      };
    }
    const enlaces = enlacesValidos(origen.enlaces, false) ? origen.enlaces : enlacesValidos(base.enlaces, false) ? base.enlaces : [];
    resultado.enlaces = enlaces.map(e => ({ ...e }));
    return resultado;
  }
  function validar(valor: unknown): string[] {
    if (valor === undefined) return [];
    if (!objeto(valor)) return ["El grupo pie debe ser un objeto."];
    const errores: string[] = [];
    for (const campo of campos) if (valor[campo] !== undefined && !reglas[campo](valor[campo])) errores.push(`El campo pie.${campo} no es válido.`);
    if (valor.redes !== undefined) {
      if (!objeto(valor.redes)) errores.push("Las redes del pie no son válidas.");
      else for (const id of REDES_PIE) if (valor.redes[id] !== undefined && !redValida(valor.redes[id])) errores.push(`La red ${id} no es válida.`);
    }
    if (valor.enlaces !== undefined && !enlacesValidos(valor.enlaces)) errores.push("Revisa los enlaces del footer: máximo 12, con identificadores únicos y URL https o ruta interna.");
    return errores;
  }
  return { normalizar, validar };
}
