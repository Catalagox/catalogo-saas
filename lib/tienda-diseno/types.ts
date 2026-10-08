// lib/tienda-diseno/types.ts

export type PlantillaId = "clasica" | "moderna";

export type EstiloCatalogo = "lista" | "galeria";

export type SeccionEditor =
  | "general"
  | "encabezado"
  | "portada"
  | "destacados"
  | "catalogo"
  | "categorias"
  | "pie";

export type ElementoPortada = "titulo" | "descripcion";

export type FuenteTienda =
  | "sistema"
  | "serif"
  | "monoespaciada";

export type FuentePortada = FuenteTienda | "heredar";

export type PesoTextoPortada =
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900;

export interface ConfigTipografia {
  fuente: FuenteTienda;
  tamano_base: number;
  tamano_titulos: number;
}

export type SombraTarjeta =
  | "ninguna"
  | "suave"
  | "media";

export type ProporcionImagen =
  | "cuadrada"
  | "horizontal"
  | "vertical";

export type AlineacionTextoTarjeta =
  | "izquierda"
  | "centro"
  | "derecha";

export type AlturaImagenTarjeta =
  | "proporcion"
  | "personalizada";

export interface ConfigTarjetas {
  radio_borde: number;
  grosor_borde: number;
  color_borde: string;
  sombra: SombraTarjeta;

  proporcion_imagen: ProporcionImagen;
  ajuste_imagen: "cover" | "contain";

  mostrar_borde?: boolean;

  separacion_horizontal?: number;
  separacion_vertical?: number;

  padding_contenido?: number;
  separacion_textos?: number;

  color_fondo_imagen?: string;
  padding_imagen?: number;

  modo_altura_imagen?: AlturaImagenTarjeta;
  alto_imagen?: number;
  alto_imagen_movil?: number;

  mostrar_titulo?: boolean;
  alineacion_titulo?: AlineacionTextoTarjeta;
  fuente_titulo?: FuentePortada;
  tamano_titulo?: number;
  tamano_titulo_movil?: number;
  peso_titulo?: PesoTextoPortada;

  mostrar_descripcion?: boolean;
  alineacion_descripcion?: AlineacionTextoTarjeta;
  fuente_descripcion?: FuentePortada;
  tamano_descripcion?: number;
  tamano_descripcion_movil?: number;
  peso_descripcion?: PesoTextoPortada;
  lineas_descripcion?: number;

  mostrar_precio?: boolean;
  alineacion_precio?: AlineacionTextoTarjeta;
  tamano_precio?: number;
  tamano_precio_movil?: number;
  peso_precio?: PesoTextoPortada;

  // Solo modifica la presentación; no cambia el stock.
  mostrar_agotado?: boolean;
}

export interface ConfigEspaciado {
  ancho_contenido: number;
  separacion_secciones: number;
  separacion_productos: number;
}

export type AlineacionPortada = "izquierda" | "centro";

export interface ConfigPortada {
  titulo: string;
  descripcion: string;
  imagen_url: string | null;
  alineacion: AlineacionPortada;

  color_fondo: string;
  color_texto: string;

  mostrar_boton: boolean;
  texto_boton: string;
  destino_boton: "catalogo";

  // Opacidad entre 0 y 100.
  color_superposicion?: string;
  opacidad_superposicion?: number;

  // Alturas mínimas en píxeles.
  alto_escritorio?: number;
  alto_movil?: number;

  fuente_titulo?: FuentePortada;
  tamano_titulo?: number;
  tamano_titulo_movil?: number;
  peso_titulo?: PesoTextoPortada;
  color_titulo?: string;

  fuente_descripcion?: FuentePortada;
  tamano_descripcion?: number;
  tamano_descripcion_movil?: number;
  peso_descripcion?: PesoTextoPortada;
  color_descripcion?: string;

  sombra_texto?: boolean;
}

export interface ConfigDestacados {
  titulo: string;

  // Referencias a productos existentes.
  producto_ids: string[];
}

export type SeccionContenidoId =
  | "portada"
  | "destacados"
  | "categorias"
  | "catalogo";

export interface ConfigSeccionContenido {
  id: SeccionContenidoId;
  visible: boolean;
}

export type PosicionEncabezado = "normal" | "fijo";

export type AlineacionMarca = "izquierda" | "centro";

export interface ConfigEncabezado {
  posicion: PosicionEncabezado;
  alineacion_marca: AlineacionMarca;

  alto_escritorio: number;
  alto_movil: number;
  ancho_contenido: number;

  padding_horizontal: number;
  padding_horizontal_movil: number;

  color_fondo: string;
  color_texto: string;

  grosor_borde: number;
  color_borde: string;
  sombra: SombraTarjeta;

  mostrar_logo: boolean;

  ancho_logo: number;
  alto_logo: number;
  ancho_logo_movil: number;
  alto_logo_movil: number;

  mostrar_nombre: boolean;

  fuente_nombre: FuentePortada;
  tamano_nombre: number;
  tamano_nombre_movil: number;
  peso_nombre: PesoTextoPortada;
  color_nombre: string;

  // mostrar_menu controla el menú móvil y tablet.
  mostrar_menu: boolean;
  mostrar_buscador: boolean;
  mostrar_carrito: boolean;
  mostrar_pedidos: boolean;

  tamano_iconos: number;
  tamano_iconos_movil: number;
  separacion_iconos: number;

  color_menu: string;
  color_busqueda: string;
  color_carrito: string;
  color_pedidos: string;

  texto_buscador: string;
  color_fondo_buscador: string;
  color_texto_buscador: string;

  color_borde_buscador: string;
  grosor_borde_buscador: number;
  radio_buscador: number;

  // Visibilidad y estilo de la barra de navegación.
  mostrar_navegacion: boolean;

  color_fondo_navegacion: string;
  color_texto_navegacion: string;

  fuente_navegacion: FuentePortada;
  tamano_navegacion: number;
  peso_navegacion: PesoTextoPortada;

  separacion_navegacion: number;

  color_borde_navegacion: string;
  grosor_borde_navegacion: number;
}

// -------------------------------------------------------
// Páginas propias de la tienda
// -------------------------------------------------------

export type EstadoPaginaTienda = "borrador" | "publicada";

/**
 * Contenido de una página propia.
 *
 * Se guardará en una tabla vinculada a catalogos.
 * El contenido inicial es texto plano, sin HTML ejecutable.
 *
 * El estado de la página es independiente de la publicación
 * del diseño.
 */
export interface PaginaTienda {
  id: string;
  catalogo_id: string;

  titulo: string;
  slug: string;
  contenido: string;

  estado: EstadoPaginaTienda;

  created_at: string;
  updated_at: string;
}

/**
 * Datos necesarios para elegir una página en el menú.
 * No incluye todo su contenido.
 */
export interface ResumenPaginaTienda {
  id: string;
  titulo: string;
  slug: string;
  estado: EstadoPaginaTienda;
}

// -------------------------------------------------------
// Enlaces del menú
// -------------------------------------------------------

export interface EnlaceMenuBase {
  // Identificador estable para editar y ordenar el enlace.
  id: string;

  // Texto mostrado en el encabezado.
  etiqueta: string;

  visible: boolean;
}

/**
 * Los destinos internos se guardan como referencias.
 *
 * La ruta final se construirá usando rutaBase, de modo
 * que funcione también con dominio personalizado.
 */
export type EnlaceMenuTienda =
  | (EnlaceMenuBase & {
      tipo: "inicio";
    })
  | (EnlaceMenuBase & {
      tipo: "catalogo";
    })
  | (EnlaceMenuBase & {
      tipo: "categoria";
      categoria_id: string;
    })
  | (EnlaceMenuBase & {
      tipo: "pagina";
      pagina_id: string;
    })
  | (EnlaceMenuBase & {
      tipo: "externo";

      // Se validará que utilice http o https.
      url: string;
      nueva_pestana: boolean;
    });

export interface ConfigNavegacion {
  /**
   * "automatica" conserva Inicio y las categorías actuales.
   * "personalizada" utiliza el arreglo de enlaces.
   */
  modo: "automatica" | "personalizada";

  // El orden del arreglo determina el orden del menú.
  enlaces: EnlaceMenuTienda[];
}

// -------------------------------------------------------
// Catálogo
// -------------------------------------------------------

export interface ConfigTitulosCategoria {
  mostrar: boolean;
  mostrar_cantidad: boolean;

  color: string;
  fuente: FuentePortada;

  tamano: number;
  tamano_movil: number;
  peso: PesoTextoPortada;

  alineacion: "izquierda" | "centro" | "derecha";

  separacion_inferior: number;
}

export interface ConfigCatalogo {
  heredar_fondo: boolean;
  color_fondo: string;

  ancho_completo: boolean;
  ancho_maximo: number;

  margen_horizontal: number;
  margen_horizontal_movil: number;

  padding_superior: number;
  padding_inferior: number;

  columnas_escritorio: 2 | 3 | 4 | 5;
  columnas_tablet: 1 | 2 | 3;
  columnas_movil: 1 | 2;

  titulos: ConfigTitulosCategoria;
}

/**
 * Configuración visual.
 *
 * Nombre, logo, país, contacto y suscripción
 * permanecen en catalogos.
 *
 * El contenido de las páginas permanece en su propia tabla.
 * Aquí se guardan los enlaces y su orden.
 */
export interface ConfigDiseno {
  estilo_menu: EstiloCatalogo;

  color_primario: string;
  color_fondo: string;

  color_header: string;
  color_text_header: string;
  color_border_header: string;

  color_footer: string;
  color_texto: string;
  color_precio: string;
  color_hamburguesa: string;
  color_tarjeta: string;
  color_categoria: string;
  color_lupa: string;

  color_fondo_categoria: string;
  color_texto_categoria: string;
  color_border_categoria: string;

  tipografia?: ConfigTipografia;
  tarjetas?: ConfigTarjetas;
  encabezado?: ConfigEncabezado;

  // Opcional para mantener compatibilidad con diseños anteriores.
  navegacion?: ConfigNavegacion;

  espaciado?: ConfigEspaciado;
  portada?: ConfigPortada;
  destacados?: ConfigDestacados;
  catalogo?: ConfigCatalogo;

  secciones?: ConfigSeccionContenido[];
}

export interface DisenoPublicado {
  catalogo_id: string;
  plantilla: PlantillaId;
  config: ConfigDiseno;
  version_config: number;
  publicado_at: string;
  updated_at: string;
}

export interface DisenoBorrador {
  catalogo_id: string;
  plantilla: PlantillaId;
  config: ConfigDiseno;
  version_config: number;
  updated_at: string;
}

export interface DefinicionPlantilla {
  id: PlantillaId;
  nombre: string;
  descripcion: string;
  version_config: number;
  configInicial: ConfigDiseno;
}

/**
 * Datos del negocio utilizados por el diseño.
 * No incluye información de Stripe ni de suscripción.
 */
export interface DatosTienda {
  id: string;
  user_id: string;
  nombre: string;
  slug: string | null;
  logo: string | null;
  pais_code: string;

  whatsapp?: string | null;
  mostrar_boton_whatsapp?: boolean | null;
  mensaje_whatsapp?: string | null;

  instagram?: string | null;
  facebook?: string | null;
  tiktok?: string | null;
  youtube?: string | null;
}

export interface ProductoTienda {
  id: string;
  nombre: string;
  descripcion?: string | null;
  precio: number;
  imagen_url?: string | null;
  disponible?: boolean | null;
  stock?: number | null;
  slug: string;
}

export interface CategoriaTienda {
  id: string;
  nombre: string;
  productos: ProductoTienda[];
}

export interface DatosRenderTienda {
  tienda: DatosTienda;
  categorias: CategoriaTienda[];

  // Se incorporará al cargar las páginas de la tienda.
  paginas?: ResumenPaginaTienda[];

  plantilla: PlantillaId;
  config: ConfigDiseno;
  rutaBase: string;
}

/**
 * Mensajes entre el editor y su iframe.
 * Deben validarse al recibirlos.
 */
export type MensajeEditor =
  | {
      type: "TIENDA_EDITOR_DATOS";
      requestId: string;
      payload: DatosRenderTienda;
      modoSeleccion: boolean;
    }
  | {
      type: "TIENDA_EDITOR_SELECCION";
      seccion: SeccionEditor | null;
      elemento?: ElementoPortada | null;
    };

export type MensajePreview =
  | {
      type: "TIENDA_PREVIEW_LISTA";
    }
  | {
      type: "TIENDA_PREVIEW_RECIBIDA";
      requestId: string;
    }
  | {
      type: "TIENDA_SECCION_SELECCIONADA";
      seccion: SeccionEditor;
      elemento?: ElementoPortada | null;
    };