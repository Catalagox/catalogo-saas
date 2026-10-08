// lib/tienda-diseno/config.ts
import type {
  ConfigDiseno,
  ConfigEncabezado,
  ConfigNavegacion,
  EnlaceMenuTienda,
  ConfigTipografia,
  ConfigEspaciado,
  ConfigPortada,
  ConfigDestacados,
  ConfigSeccionContenido,
  ElementoPortada,
  PlantillaId,
  SeccionEditor,
} from "./types";
import {
  crearGrupoTarjetas,
  type ConfigTarjetasCompleta,
} from "./config-tarjetas";
import { crearConfigCatalogo } from "./config-catalogo";
export const VERSION_CONFIG = 1;
export type ConfigPortadaCompleta = Required<ConfigPortada>;
export type ConfigDisenoCompleta =
  Omit<Required<ConfigDiseno>, "portada" | "tarjetas"> & {
    portada: ConfigPortadaCompleta;
    tarjetas: ConfigTarjetasCompleta;
  };
export const CAMPOS_COLOR = [
  "color_primario",
  "color_fondo",
  "color_header",
  "color_text_header",
  "color_border_header",
  "color_footer",
  "color_texto",
  "color_precio",
  "color_hamburguesa",
  "color_tarjeta",
  "color_categoria",
  "color_lupa",
  "color_fondo_categoria",
  "color_texto_categoria",
  "color_border_categoria",
] as const satisfies ReadonlyArray<keyof ConfigDiseno>;
export type CampoColor = (typeof CAMPOS_COLOR)[number];
export const SECCIONES_EDITOR: ReadonlyArray<{
  id: SeccionEditor;
  nombre: string;
}> = [
  { id: "general", nombre: "Configuración general" },
  { id: "encabezado", nombre: "Encabezado" },
  { id: "portada", nombre: "Portada" },
  { id: "destacados", nombre: "Productos destacados" },
  { id: "catalogo", nombre: "Productos y botones" },
  { id: "categorias", nombre: "Categorías" },
  { id: "pie", nombre: "Pie de página" },
];
function esObjeto(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}
export function esPlantillaId(
  value: unknown,
): value is PlantillaId {
  return value === "clasica" || value === "moderna";
}
export function esSeccionEditor(
  value: unknown,
): value is SeccionEditor {
  return SECCIONES_EDITOR.some(
    (seccion) => seccion.id === value,
  );
}
export function esElementoPortada(
  value: unknown,
): value is ElementoPortada {
  return value === "titulo" || value === "descripcion";
}
export function esColorValido(
  value: unknown,
): value is string {
  if (typeof value !== "string") return false;
  const color = value.trim();
  if (color.toLowerCase() === "transparent") return true;
  if (
    /^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(
      color,
    )
  ) {
    return true;
  }
  const rgb = color.match(
    /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i,
  );
  if (rgb) {
    return rgb.slice(1).every(
      (canal) => Number(canal) <= 255,
    );
  }
  const rgba = color.match(
    /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d+(?:\.\d+)?|\.\d+)\s*\)$/i,
  );
  if (!rgba) return false;
  const canalesValidos = rgba
    .slice(1, 4)
    .every((canal) => Number(canal) <= 255);
  const alpha = Number(rgba[4]);
  return canalesValidos && alpha >= 0 && alpha <= 1;
}
function esEnteroEntre(
  value: unknown,
  minimo: number,
  maximo: number,
): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= minimo &&
    value <= maximo
  );
}
function esTextoHasta(
  value: unknown,
  limite: number,
): boolean {
  return typeof value === "string" && value.length <= limite;
}
function esFuentePortada(value: unknown): boolean {
  return (
    value === "heredar" ||
    value === "sistema" ||
    value === "serif" ||
    value === "monoespaciada"
  );
}
function esPesoTexto(value: unknown): boolean {
  return (
    value === 400 ||
    value === 500 ||
    value === 600 ||
    value === 700 ||
    value === 800 ||
    value === 900
  );
}
function esImagenUrl(value: unknown): boolean {
  if (value === null) return true;
  if (
    typeof value !== "string" ||
    !value.trim() ||
    value.length > 2048
  ) {
    return false;
  }
  const url = value.trim();
  if (url.startsWith("/")) {
    return (
      !url.startsWith("//") &&
      !url.includes("\\") &&
      !/[\u0000-\u0020]/.test(url)
    );
  }
  try {
    const resultado = new URL(url);
    return (
      (
        resultado.protocol === "https:" ||
        resultado.protocol === "http:"
      ) &&
      !resultado.username &&
      !resultado.password
    );
  } catch {
    return false;
  }
}
function sonIdsProductos(value: unknown): value is string[] {
  if (!Array.isArray(value) || value.length > 12) return false;
  const uuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (
    !value.every(
      (id) => typeof id === "string" && uuid.test(id),
    )
  ) {
    return false;
  }
  return (
    new Set(
      value.map((id: string) => id.toLowerCase()),
    ).size === value.length
  );
}
type Regla = {
  valida: (value: unknown) => boolean;
  normaliza?: (value: unknown) => unknown;
  opcional?: boolean;
};
type Grupo<T extends object> = {
  inicial: T;
  reglas: {
    [K in keyof T]-?: Regla;
  };
};
const reglaColor: Regla = {
  valida: esColorValido,
  normaliza: (value) => (value as string).trim(),
};
const reglaColorOpcional: Regla = {
  ...reglaColor,
  opcional: true,
};
const reglaBooleano: Regla = {
  valida: (value) => typeof value === "boolean",
};
function reglaNumero(
  minimo: number,
  maximo: number,
  opcional = false,
): Regla {
  return {
    opcional,
    valida: (value) => esEnteroEntre(value, minimo, maximo),
  };
}
function reglaOpciones(
  opciones: readonly string[],
  opcional = false,
): Regla {
  return {
    opcional,
    valida: (value) =>
      typeof value === "string" && opciones.includes(value),
  };
}
const TIPOGRAFIA: Grupo<ConfigTipografia> = {
  inicial: {
    fuente: "sistema",
    tamano_base: 16,
    tamano_titulos: 32,
  },
  reglas: {
    fuente: reglaOpciones([
      "sistema",
      "serif",
      "monoespaciada",
    ]),
    tamano_base: reglaNumero(12, 24),
    tamano_titulos: reglaNumero(20, 64),
  },
};
// Grupos separados para mantener organizado este archivo.
const TARJETAS: Grupo<ConfigTarjetasCompleta> =
  crearGrupoTarjetas(esColorValido);
const CATALOGO = crearConfigCatalogo(esColorValido);
const ESPACIADO: Grupo<ConfigEspaciado> = {
  inicial: {
    ancho_contenido: 1280,
    separacion_secciones: 32,
    separacion_productos: 24,
  },
  reglas: {
    ancho_contenido: reglaNumero(960, 1600),
    separacion_secciones: reglaNumero(16, 96),
    separacion_productos: reglaNumero(8, 48),
  },
};
const ENCABEZADO: Grupo<ConfigEncabezado> = {
  inicial: {
    posicion: "fijo",
    alineacion_marca: "izquierda",
    alto_escritorio: 80,
    alto_movil: 80,
    ancho_contenido: 1280,
    padding_horizontal: 32,
    padding_horizontal_movil: 16,
    color_fondo: "#2c2c2c",
    color_texto: "#ffffff",
    grosor_borde: 1,
    color_borde: "rgba(255,255,255,0.1)",
    sombra: "suave",
    mostrar_logo: true,
    ancho_logo: 240,
    alto_logo: 64,
    ancho_logo_movil: 120,
    alto_logo_movil: 56,
    mostrar_nombre: false,
    fuente_nombre: "heredar",
    tamano_nombre: 20,
    tamano_nombre_movil: 20,
    peso_nombre: 700,
    color_nombre: "#ffffff",
    mostrar_menu: true,
    mostrar_buscador: true,
    mostrar_carrito: true,
    mostrar_pedidos: true,
    tamano_iconos: 24,
    tamano_iconos_movil: 22,
    separacion_iconos: 8,
    color_menu: "#ffffff",
    color_busqueda: "#ffffff",
    color_carrito: "#ffffff",
    color_pedidos: "#ffffff",
    texto_buscador: "Buscar productos...",
    color_fondo_buscador: "transparent",
    color_texto_buscador: "#ffffff",
    color_borde_buscador: "rgba(255,255,255,0.2)",
    grosor_borde_buscador: 1,
    radio_buscador: 12,
    mostrar_navegacion: false,
    color_fondo_navegacion: "#2c2c2c",
    color_texto_navegacion: "#ffffff",
    fuente_navegacion: "heredar",
    tamano_navegacion: 14,
    peso_navegacion: 500,
    separacion_navegacion: 24,
    color_borde_navegacion: "rgba(255,255,255,0.1)",
    grosor_borde_navegacion: 1,
  },
  reglas: {
    posicion: reglaOpciones(["normal", "fijo"]),
    alineacion_marca: reglaOpciones(["izquierda", "centro"]),
    alto_escritorio: reglaNumero(56, 180),
    alto_movil: reglaNumero(56, 140),
    ancho_contenido: reglaNumero(960, 1920),
    padding_horizontal: reglaNumero(0, 96),
    padding_horizontal_movil: reglaNumero(0, 32),
    color_fondo: reglaColor,
    color_texto: reglaColor,
    grosor_borde: reglaNumero(0, 8),
    color_borde: reglaColor,
    sombra: reglaOpciones(["ninguna", "suave", "media"]),
    mostrar_logo: reglaBooleano,
    ancho_logo: reglaNumero(40, 360),
    alto_logo: reglaNumero(24, 140),
    ancho_logo_movil: reglaNumero(40, 200),
    alto_logo_movil: reglaNumero(24, 100),
    mostrar_nombre: reglaBooleano,
    fuente_nombre: { valida: esFuentePortada },
    tamano_nombre: reglaNumero(12, 48),
    tamano_nombre_movil: reglaNumero(12, 32),
    peso_nombre: { valida: esPesoTexto },
    color_nombre: reglaColor,
    mostrar_menu: reglaBooleano,
    mostrar_buscador: reglaBooleano,
    mostrar_carrito: reglaBooleano,
    mostrar_pedidos: reglaBooleano,
    tamano_iconos: reglaNumero(16, 36),
    tamano_iconos_movil: reglaNumero(16, 32),
    separacion_iconos: reglaNumero(0, 32),
    color_menu: reglaColor,
    color_busqueda: reglaColor,
    color_carrito: reglaColor,
    color_pedidos: reglaColor,
    texto_buscador: {
      valida: (value) =>
        typeof value === "string" &&
        value.trim().length > 0 &&
        value.length <= 80,
    },
    color_fondo_buscador: reglaColor,
    color_texto_buscador: reglaColor,
    color_borde_buscador: reglaColor,
    grosor_borde_buscador: reglaNumero(0, 6),
    radio_buscador: reglaNumero(0, 40),
    mostrar_navegacion: reglaBooleano,
    color_fondo_navegacion: reglaColor,
    color_texto_navegacion: reglaColor,
    fuente_navegacion: { valida: esFuentePortada },
    tamano_navegacion: reglaNumero(12, 24),
    peso_navegacion: { valida: esPesoTexto },
    separacion_navegacion: reglaNumero(8, 64),
    color_borde_navegacion: reglaColor,
    grosor_borde_navegacion: reglaNumero(0, 8),
  },
};
const PORTADA: Grupo<ConfigPortadaCompleta> = {
  inicial: {
    titulo: "",
    descripcion: "",
    imagen_url: null,
    alineacion: "izquierda",
    color_fondo: "#f3f4f6",
    color_texto: "#111827",
    mostrar_boton: true,
    texto_boton: "Ver productos",
    destino_boton: "catalogo",
    color_superposicion: "#000000",
    opacidad_superposicion: 20,
    alto_escritorio: 460,
    alto_movil: 340,
    fuente_titulo: "heredar",
    tamano_titulo: 48,
    tamano_titulo_movil: 28,
    peso_titulo: 800,
    color_titulo: "#111827",
    fuente_descripcion: "heredar",
    tamano_descripcion: 16,
    tamano_descripcion_movil: 16,
    peso_descripcion: 400,
    color_descripcion: "#111827",
    sombra_texto: false,
  },
  reglas: {
    titulo: {
      valida: (value) => esTextoHasta(value, 120),
    },
    descripcion: {
      valida: (value) => esTextoHasta(value, 500),
    },
    imagen_url: {
      valida: esImagenUrl,
      normaliza: (value) =>
        typeof value === "string" ? value.trim() : null,
    },
    alineacion: reglaOpciones(["izquierda", "centro"]),
    color_fondo: reglaColor,
    color_texto: reglaColor,
    mostrar_boton: reglaBooleano,
    texto_boton: {
      valida: (value) =>
        typeof value === "string" &&
        value.trim().length > 0 &&
        value.length <= 40,
    },
    destino_boton: reglaOpciones(["catalogo"]),
    color_superposicion: reglaColorOpcional,
    opacidad_superposicion: reglaNumero(0, 100, true),
    alto_escritorio: reglaNumero(240, 1000, true),
    alto_movil: reglaNumero(200, 800, true),
    fuente_titulo: {
      opcional: true,
      valida: esFuentePortada,
    },
    tamano_titulo: reglaNumero(20, 120, true),
    tamano_titulo_movil: reglaNumero(18, 72, true),
    peso_titulo: {
      opcional: true,
      valida: esPesoTexto,
    },
    color_titulo: reglaColorOpcional,
    fuente_descripcion: {
      opcional: true,
      valida: esFuentePortada,
    },
    tamano_descripcion: reglaNumero(12, 40, true),
    tamano_descripcion_movil: reglaNumero(12, 32, true),
    peso_descripcion: {
      opcional: true,
      valida: esPesoTexto,
    },
    color_descripcion: reglaColorOpcional,
    sombra_texto: {
      ...reglaBooleano,
      opcional: true,
    },
  },
};
const DESTACADOS: Grupo<ConfigDestacados> = {
  inicial: {
    titulo: "Productos destacados",
    producto_ids: [],
  },
  reglas: {
    titulo: {
      valida: (value) =>
        typeof value === "string" &&
        value.trim().length > 0 &&
        value.length <= 100,
    },
    producto_ids: {
      valida: sonIdsProductos,
      normaliza: (value) =>
        (value as string[]).map((id) => id.toLowerCase()),
    },
  },
};
// Los diseños existentes mantienen Inicio y las categorías actuales.
const NAVEGACION_INICIAL: ConfigNavegacion = {
  modo: "automatica",
  enlaces: [],
};

function esIdReferencia(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
  );
}

function esUrlExterna(value: unknown): value is string {
  if (
    typeof value !== "string" ||
    !value.trim() ||
    value.length > 2048 ||
    /[\u0000-\u0020\u007f]/.test(value.trim()) ||
    value.includes("\\")
  ) return false;

  const url = value.trim();
  if (!/^https?:\/\//i.test(url)) return false;

  try {
    const resultado = new URL(url);
    return (
      (resultado.protocol === "https:" || resultado.protocol === "http:") &&
      !!resultado.hostname &&
      !resultado.username &&
      !resultado.password
    );
  } catch {
    return false;
  }
}

function esEnlaceMenu(value: unknown): value is EnlaceMenuTienda {
  if (
    !esObjeto(value) ||
    typeof value.id !== "string" ||
    !value.id.trim() ||
    value.id.length > 100 ||
    typeof value.etiqueta !== "string" ||
    !value.etiqueta.trim() ||
    value.etiqueta.length > 80 ||
    typeof value.visible !== "boolean"
  ) return false;

  switch (value.tipo) {
    case "inicio":
    case "catalogo":
      return true;
    case "categoria":
      return esIdReferencia(value.categoria_id);
    case "pagina":
      return esIdReferencia(value.pagina_id);
    case "externo":
      return esUrlExterna(value.url) && typeof value.nueva_pestana === "boolean";
    default:
      return false;
  }
}

function sonEnlacesMenu(value: unknown): value is EnlaceMenuTienda[] {
  if (!Array.isArray(value) || value.length > 30) return false;
  const ids = new Set<string>();
  for (const enlace of value) {
    if (!esEnlaceMenu(enlace)) return false;
    const id = enlace.id.trim();
    if (ids.has(id)) return false;
    ids.add(id);
  }
  return true;
}

function copiarEnlaceMenu(enlace: EnlaceMenuTienda): EnlaceMenuTienda {
  const base = {
    id: enlace.id.trim(),
    etiqueta: enlace.etiqueta.trim(),
    visible: enlace.visible,
  };
  switch (enlace.tipo) {
    case "inicio":
    case "catalogo":
      return { ...base, tipo: enlace.tipo };
    case "categoria":
      return { ...base, tipo: "categoria", categoria_id: enlace.categoria_id.toLowerCase() };
    case "pagina":
      return { ...base, tipo: "pagina", pagina_id: enlace.pagina_id.toLowerCase() };
    case "externo":
      return { ...base, tipo: "externo", url: enlace.url.trim(), nueva_pestana: enlace.nueva_pestana };
  }
}

function normalizarNavegacion(
  value: unknown,
  respaldo?: unknown,
): ConfigNavegacion {
  const origen = esObjeto(value) ? value : {};
  const base = esObjeto(respaldo) ? respaldo : {};
  const modo = origen.modo === "automatica" || origen.modo === "personalizada"
    ? origen.modo
    : base.modo === "personalizada" ? "personalizada" : "automatica";
  const enlaces = sonEnlacesMenu(origen.enlaces)
    ? origen.enlaces
    : sonEnlacesMenu(base.enlaces) ? base.enlaces : NAVEGACION_INICIAL.enlaces;

  return { modo, enlaces: enlaces.map(copiarEnlaceMenu) };
}

function validarNavegacion(value: unknown, errores: string[]): void {
  // El grupo es opcional en las configuraciones anteriores.
  if (value === undefined) return;
  if (!esObjeto(value)) {
    errores.push("El grupo navegacion debe ser un objeto.");
    return;
  }
  if (value.modo !== "automatica" && value.modo !== "personalizada") {
    errores.push("Selecciona un modo de navegación válido.");
  }
  if (!sonEnlacesMenu(value.enlaces)) {
    errores.push(
      "El menú admite hasta 30 enlaces con identificadores únicos, etiqueta y visibilidad. Las categorías y páginas requieren un UUID; los enlaces externos requieren una URL http o https y nueva_pestana.",
    );
  }
}

const SECCIONES_INICIALES: ConfigSeccionContenido[] = [
  { id: "portada", visible: false },
  { id: "destacados", visible: false },
  { id: "categorias", visible: true },
  { id: "catalogo", visible: true },
];
function sonSeccionesValidas(
  value: unknown,
): value is ConfigSeccionContenido[] {
  if (!Array.isArray(value) || value.length !== 4) {
    return false;
  }
  const permitidos = new Set<string>(
    SECCIONES_INICIALES.map((seccion) => seccion.id),
  );
  const ids = new Set<string>();
  for (const seccion of value) {
    if (
      !esObjeto(seccion) ||
      typeof seccion.id !== "string" ||
      !permitidos.has(seccion.id) ||
      typeof seccion.visible !== "boolean" ||
      ids.has(seccion.id)
    ) {
      return false;
    }
    if (seccion.id === "catalogo" && !seccion.visible) {
      return false;
    }
    ids.add(seccion.id);
  }
  return true;
}
function normalizarGrupo<T extends object>(
  value: unknown,
  grupo: Grupo<T>,
  respaldo?: unknown,
): T {
  const resultado: T = { ...grupo.inicial };
  const origen: Record<string, unknown> =
    esObjeto(value) ? value : {};
  const base: Record<string, unknown> =
    esObjeto(respaldo) ? respaldo : {};
  for (
    const campo of Object.keys(grupo.reglas) as Array<keyof T>
  ) {
    const regla = grupo.reglas[campo];
    const clave = String(campo);
    const candidato = regla.valida(origen[clave])
      ? origen[clave]
      : regla.valida(base[clave])
        ? base[clave]
        : grupo.inicial[campo];
    resultado[campo] = (
      regla.normaliza
        ? regla.normaliza(candidato)
        : candidato
    ) as T[typeof campo];
  }
  return resultado;
}
function validarGrupo<T extends object>(
  value: unknown,
  nombre: string,
  grupo: Grupo<T>,
  errores: string[],
): void {
  if (value === undefined) return;
  if (!esObjeto(value)) {
    errores.push(`El grupo ${nombre} debe ser un objeto.`);
    return;
  }
  for (
    const campo of Object.keys(grupo.reglas) as Array<keyof T>
  ) {
    const regla = grupo.reglas[campo];
    const clave = String(campo);
    const valor = value[clave];
    if (valor === undefined && regla.opcional) continue;
    if (!regla.valida(valor)) {
      errores.push(
        `El campo ${nombre}.${clave} no es válido.`,
      );
    }
  }
}
export const CONFIG_INICIAL: Readonly<ConfigDisenoCompleta> =
  Object.freeze({
    estilo_menu: "lista",
    color_primario: "#f97316",
    color_fondo: "#fefefe",
    color_header: "#2c2c2c",
    color_text_header: "#ffffff",
    color_border_header: "rgba(255,255,255,0.1)",
    color_footer: "#111827",
    color_texto: "#4f4d4d",
    color_precio: "#22c55e",
    color_hamburguesa: "#ffffff",
    color_tarjeta: "#ffffff10",
    color_categoria: "#eae9e9",
    color_lupa: "#ffffff",
    color_fondo_categoria: "#ffffff",
    color_texto_categoria: "#111827",
    color_border_categoria: "#e5e7eb",
    tipografia: normalizarGrupo(undefined, TIPOGRAFIA),
    tarjetas: normalizarGrupo(undefined, TARJETAS),
    catalogo: CATALOGO.normalizar(undefined),
    espaciado: normalizarGrupo(undefined, ESPACIADO),
    encabezado: normalizarGrupo(undefined, ENCABEZADO),
    navegacion: normalizarNavegacion(undefined),
    portada: normalizarGrupo(undefined, PORTADA),
    destacados: normalizarGrupo(undefined, DESTACADOS),
    secciones: SECCIONES_INICIALES.map(
      (seccion) => ({ ...seccion }),
    ),
  });
const COLORES_ENCABEZADO = [
  { nuevo: "color_fondo", antiguo: "color_header" },
  { nuevo: "color_texto", antiguo: "color_text_header" },
  { nuevo: "color_borde", antiguo: "color_border_header" },
  { nuevo: "color_nombre", antiguo: "color_text_header" },
  { nuevo: "color_menu", antiguo: "color_hamburguesa" },
  { nuevo: "color_busqueda", antiguo: "color_lupa" },
  { nuevo: "color_carrito", antiguo: "color_text_header" },
  { nuevo: "color_pedidos", antiguo: "color_text_header" },
  {
    nuevo: "color_texto_buscador",
    antiguo: "color_text_header",
  },
  {
    nuevo: "color_fondo_navegacion",
    antiguo: "color_header",
  },
  {
    nuevo: "color_texto_navegacion",
    antiguo: "color_text_header",
  },
  {
    nuevo: "color_borde_navegacion",
    antiguo: "color_border_header",
  },
] as const satisfies ReadonlyArray<{
  nuevo: keyof ConfigEncabezado;
  antiguo: CampoColor;
}>;
export function normalizarConfig(
  value: unknown,
  respaldo: Readonly<ConfigDiseno> = CONFIG_INICIAL,
): ConfigDisenoCompleta {
  const origen: Record<string, unknown> =
    esObjeto(value) ? value : {};
  const portada = normalizarGrupo(
    origen.portada,
    PORTADA,
    respaldo.portada,
  );
  const portadaOrigen: Record<string, unknown> =
    esObjeto(origen.portada) ? origen.portada : {};
  const portadaRespaldo: Record<string, unknown> =
    esObjeto(respaldo.portada) ? respaldo.portada : {};
  // Conserva el color único de los banners antiguos.
  if (!esColorValido(portadaOrigen.color_titulo)) {
    portada.color_titulo =
      esColorValido(portadaOrigen.color_texto)
        ? portadaOrigen.color_texto.trim()
        : esColorValido(portadaRespaldo.color_titulo)
          ? portadaRespaldo.color_titulo.trim()
          : portada.color_texto;
  }
  if (!esColorValido(portadaOrigen.color_descripcion)) {
    portada.color_descripcion =
      esColorValido(portadaOrigen.color_texto)
        ? portadaOrigen.color_texto.trim()
        : esColorValido(portadaRespaldo.color_descripcion)
          ? portadaRespaldo.color_descripcion.trim()
          : portada.color_texto;
  }
  const encabezado = normalizarGrupo(
    origen.encabezado,
    ENCABEZADO,
    respaldo.encabezado,
  );
  const encabezadoOrigen: Record<string, unknown> =
    esObjeto(origen.encabezado) ? origen.encabezado : {};
  const encabezadoRespaldo: Record<string, unknown> =
    esObjeto(respaldo.encabezado) ? respaldo.encabezado : {};
  for (const { nuevo, antiguo } of COLORES_ENCABEZADO) {
    const colorNuevo = encabezadoOrigen[nuevo];
    const colorAntiguo = origen[antiguo];
    const colorNuevoRespaldo = encabezadoRespaldo[nuevo];
    const colorAntiguoRespaldo = respaldo[antiguo];
    encabezado[nuevo] = esColorValido(colorNuevo)
      ? colorNuevo.trim()
      : esColorValido(colorAntiguo)
        ? colorAntiguo.trim()
        : esColorValido(colorNuevoRespaldo)
          ? colorNuevoRespaldo.trim()
          : esColorValido(colorAntiguoRespaldo)
            ? colorAntiguoRespaldo.trim()
            : ENCABEZADO.inicial[nuevo];
  }
  const resultado: ConfigDisenoCompleta = {
    ...CONFIG_INICIAL,
    tipografia: normalizarGrupo(
      origen.tipografia,
      TIPOGRAFIA,
      respaldo.tipografia,
    ),
    tarjetas: normalizarGrupo(
      origen.tarjetas,
      TARJETAS,
      respaldo.tarjetas,
    ),
    catalogo: CATALOGO.normalizar(
      origen.catalogo,
      respaldo.catalogo,
    ),
    espaciado: normalizarGrupo(
      origen.espaciado,
      ESPACIADO,
      respaldo.espaciado,
    ),
    encabezado,
    navegacion: normalizarNavegacion(origen.navegacion, respaldo.navegacion),
    portada,
    destacados: normalizarGrupo(
      origen.destacados,
      DESTACADOS,
      respaldo.destacados,
    ),
    secciones: [],
  };
  resultado.estilo_menu =
    origen.estilo_menu === "lista" ||
    origen.estilo_menu === "galeria"
      ? origen.estilo_menu
      : respaldo.estilo_menu === "galeria"
        ? "galeria"
        : "lista";
  for (const campo of CAMPOS_COLOR) {
    const color = origen[campo];
    const colorRespaldo = respaldo[campo];
    resultado[campo] = esColorValido(color)
      ? color.trim()
      : esColorValido(colorRespaldo)
        ? colorRespaldo.trim()
        : CONFIG_INICIAL[campo];
  }
  /*
   * Compatibilidad del catálogo:
   * conserva el color y tamaño de los títulos antiguos
   * mientras no exista una configuración específica.
   */
  const catalogoOrigen: Record<string, unknown> =
    esObjeto(origen.catalogo) ? origen.catalogo : {};
  const titulosOrigen: Record<string, unknown> =
    esObjeto(catalogoOrigen.titulos)
      ? catalogoOrigen.titulos
      : {};
  const catalogoRespaldo: Record<string, unknown> =
    esObjeto(respaldo.catalogo) ? respaldo.catalogo : {};
  const titulosRespaldo: Record<string, unknown> =
    esObjeto(catalogoRespaldo.titulos)
      ? catalogoRespaldo.titulos
      : {};
  if (!esColorValido(titulosOrigen.color)) {
    resultado.catalogo.titulos.color =
      esColorValido(origen.color_texto_categoria)
        ? origen.color_texto_categoria.trim()
        : esColorValido(titulosRespaldo.color)
          ? titulosRespaldo.color.trim()
          : resultado.color_texto_categoria;
  }
  if (!esEnteroEntre(titulosOrigen.tamano, 12, 80)) {
    const tipografiaOrigen: Record<string, unknown> =
      esObjeto(origen.tipografia) ? origen.tipografia : {};
    if (
      esEnteroEntre(
        tipografiaOrigen.tamano_titulos,
        20,
        64,
      )
    ) {
      resultado.catalogo.titulos.tamano =
        tipografiaOrigen.tamano_titulos;
    } else if (
      !esEnteroEntre(titulosRespaldo.tamano, 12, 80)
    ) {
      resultado.catalogo.titulos.tamano =
        resultado.tipografia.tamano_titulos;
    }
  }
  const secciones = sonSeccionesValidas(origen.secciones)
    ? origen.secciones
    : sonSeccionesValidas(respaldo.secciones)
      ? respaldo.secciones
      : SECCIONES_INICIALES;
  resultado.secciones = secciones.map(
    ({ id, visible }) => ({ id, visible }),
  );
  /*
   * Compatibilidad de las tarjetas:
   * conserva la separación general cuando el diseño
   * todavía no tiene separación específica.
   */
  const tarjetasOrigen: Record<string, unknown> =
    esObjeto(origen.tarjetas) ? origen.tarjetas : {};
  const tarjetasRespaldo: Record<string, unknown> =
    esObjeto(respaldo.tarjetas) ? respaldo.tarjetas : {};
  const obtenerSeparacion = (
    campo: "separacion_horizontal" | "separacion_vertical",
  ): number => {
    const valorOrigen = tarjetasOrigen[campo];
    if (esEnteroEntre(valorOrigen, 0, 96)) {
      return valorOrigen;
    }
    if (
      esObjeto(origen.espaciado) &&
      esEnteroEntre(
        origen.espaciado.separacion_productos,
        8,
        48,
      )
    ) {
      return origen.espaciado.separacion_productos;
    }
    const valorRespaldo = tarjetasRespaldo[campo];
    if (esEnteroEntre(valorRespaldo, 0, 96)) {
      return valorRespaldo;
    }
    return resultado.espaciado.separacion_productos;
  };
  resultado.tarjetas.separacion_horizontal =
    obtenerSeparacion("separacion_horizontal");
  resultado.tarjetas.separacion_vertical =
    obtenerSeparacion("separacion_vertical");
  // Un borde antiguo con grosor positivo sigue siendo visible.
  if (typeof tarjetasOrigen.mostrar_borde !== "boolean") {
    const grosorAnterior = tarjetasOrigen.grosor_borde;
    resultado.tarjetas.mostrar_borde =
      esEnteroEntre(grosorAnterior, 0, 8)
        ? grosorAnterior > 0
        : typeof tarjetasRespaldo.mostrar_borde === "boolean"
          ? tarjetasRespaldo.mostrar_borde
          : resultado.tarjetas.grosor_borde > 0;
  }
  return resultado;
}
export function configDesdeCatalogo(
  value: unknown,
): ConfigDisenoCompleta {
  return normalizarConfig(value);
}
export type ResultadoValidacion =
  | {
      valido: true;
      config: ConfigDisenoCompleta;
    }
  | {
      valido: false;
      errores: string[];
    };
export function validarConfig(
  value: unknown,
): ResultadoValidacion {
  if (!esObjeto(value)) {
    return {
      valido: false,
      errores: [
        "La configuración del diseño debe ser un objeto.",
      ],
    };
  }
  const errores: string[] = [];
  if (
    value.estilo_menu !== "lista" &&
    value.estilo_menu !== "galeria"
  ) {
    errores.push(
      "Selecciona un formato de catálogo válido.",
    );
  }
  for (const campo of CAMPOS_COLOR) {
    if (!esColorValido(value[campo])) {
      errores.push(
        `El campo ${campo} contiene un color inválido.`,
      );
    }
  }
  validarGrupo(
    value.tipografia,
    "tipografia",
    TIPOGRAFIA,
    errores,
  );
  validarGrupo(
    value.tarjetas,
    "tarjetas",
    TARJETAS,
    errores,
  );
  validarGrupo(
    value.espaciado,
    "espaciado",
    ESPACIADO,
    errores,
  );
  validarGrupo(
    value.encabezado,
    "encabezado",
    ENCABEZADO,
    errores,
  );
  validarGrupo(
    value.portada,
    "portada",
    PORTADA,
    errores,
  );
  validarGrupo(
    value.destacados,
    "destacados",
    DESTACADOS,
    errores,
  );
  validarNavegacion(value.navegacion, errores);

  errores.push(...CATALOGO.validar(value.catalogo));
  if (
    value.secciones !== undefined &&
    !sonSeccionesValidas(value.secciones)
  ) {
    errores.push(
      "Las secciones deben incluir portada, destacados, categorías y catálogo una sola vez. El catálogo debe permanecer visible.",
    );
  }
  if (errores.length > 0) {
    return {
      valido: false,
      errores,
    };
  }
  return {
    valido: true,
    config: normalizarConfig(value),
  };
}