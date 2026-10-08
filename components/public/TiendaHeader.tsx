"use client";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ClipboardList,
  ExternalLink,
  Menu as MenuIcon,
  Search,
  ShoppingCart,
  X,
} from "lucide-react";
import BuscadorTienda from "@/components/public/BuscadorTienda";
import { normalizarConfig } from "@/lib/tienda-diseno/config";
import { supabase } from "@/lib/supabaseClient";
import { crearEnlacesNavegacion, normalizarRutaTienda, type EnlaceNavegacion } from "@/lib/tienda-diseno/navegacion";
import type {
  ConfigDiseno,
  ConfigEncabezado,
  FuentePortada,
  ResumenPaginaTienda,
} from "@/lib/tienda-diseno/types";
interface Producto {
  id: string;
  nombre: string;
  imagen_url?: string | null;
}
interface Categoria {
  id: string;
  nombre: string;
  productos?: Producto[];
}
interface Tienda {
  id?: string;
  nombre: string;
  logo?: string | null;
  slug?: string | null;
  // Compatibilidad con los colores anteriores.
  color_header?: string | null;
  color_lupa?: string | null;
  color_text_header?: string | null;
  color_border_header?: string | null;
  color_hamburguesa?: string | null;
  encabezado?: ConfigEncabezado;
}
interface TiendaHeaderProps {
  catalogo: Tienda;
  categorias: Categoria[];
  rutaBase: string;
  config?: ConfigDiseno;
  paginas?: ResumenPaginaTienda[];
  cartCount?: number;
  onOpenCart?: () => void;
  onOpenOrders?: () => void;
}
type VariablesHeader = CSSProperties &
  Record<`--header-${string}`, string>;
const FUENTES: Record<FuentePortada, string> = {
  heredar: "inherit",
  sistema:
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  serif: 'Georgia, "Times New Roman", serif',
  monoespaciada:
    "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
};
const SOMBRAS = {
  ninguna: "none",
  suave: "0 3px 12px rgba(0,0,0,0.08)",
  media: "0 6px 20px rgba(0,0,0,0.16)",
};
const CLASE_BOTON =
  "inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg p-2 outline-none transition-colors hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-current";
const CLASE_ICONO =
  "h-[var(--header-icono-movil)] w-[var(--header-icono-movil)] shrink-0 lg:h-[var(--header-icono)] lg:w-[var(--header-icono)]";
const CLASE_ENLACE_MENU =
  "flex min-h-11 items-center rounded-lg px-3 py-3 outline-none hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-current";
export default function TiendaHeader({
  catalogo: tienda,
  categorias,
  rutaBase,
  config,
  paginas,
  cartCount = 0,
  onOpenCart,
  onOpenOrders,
}: TiendaHeaderProps) {
  const id = useId();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [buscadorAbierto, setBuscadorAbierto] = useState(false);
  const [paginaDesplazada, setPaginaDesplazada] = useState(false);
  const [paginasCargadas, setPaginasCargadas] = useState<{ clave: string; paginas: ResumenPaginaTienda[] }>({ clave: "", paginas: [] });
  const botonMenuRef = useRef<HTMLButtonElement>(null);
  const botonCerrarRef = useRef<HTMLButtonElement>(null);
  const dialogoRef = useRef<HTMLElement>(null);
  const diseno = normalizarConfig({
    color_header: tienda.color_header,
    color_text_header: tienda.color_text_header,
    color_border_header: tienda.color_border_header,
    color_hamburguesa: tienda.color_hamburguesa,
    color_lupa: tienda.color_lupa,
    encabezado: tienda.encabezado,
    ...config,
  });
  const opciones = diseno.encabezado;
  const categoriasSeguras = Array.isArray(categorias)
    ? categorias.filter(
        (categoria) =>
          categoria &&
          Boolean(categoria.id) &&
          Boolean(categoria.nombre?.trim()),
      )
    : [];
  const inicioTienda = normalizarRutaTienda(rutaBase);
  const idsPaginas = diseno.navegacion.modo === "personalizada"
    ? diseno.navegacion.enlaces.filter((e) => e.tipo === "pagina" && e.visible)
        .map((e) => e.tipo === "pagina" ? e.pagina_id : "")
    : [];
  const firmaPaginas = [...new Set(idsPaginas)].sort().join(",");
  const identidadTienda = tienda.id || tienda.slug?.trim() || "";
  const clavePaginas = `${identidadTienda}:${firmaPaginas}`;

  // Si el padre proporciona páginas, no se realizan consultas adicionales.
  // Como respaldo, carga únicamente referencias publicadas de esta tienda.
  useEffect(() => {
    let activo = true;
    if (paginas !== undefined || !firmaPaginas || !identidadTienda) return;
    async function cargarPaginas() {
      try {
        let catalogoId = tienda.id;
        if (!catalogoId) {
          const { data, error } = await supabase.from("catalogos").select("id")
            .eq("slug", tienda.slug?.trim() ?? "").maybeSingle();
          if (error || !data) return;
          catalogoId = data.id;
        }
        const { data, error } = await supabase.from("paginas_tienda")
          .select("id, titulo, slug, estado")
          .eq("catalogo_id", catalogoId)
          .eq("estado", "publicada")
          .in("id", firmaPaginas.split(","));
        if (!error && activo) {
          setPaginasCargadas({ clave: clavePaginas, paginas: (data ?? []) as ResumenPaginaTienda[] });
        }
      } catch {
        // Una referencia no disponible queda fuera del menú público.
      }
    }
    void cargarPaginas();
    return () => { activo = false; };
  }, [paginas, firmaPaginas, identidadTienda, clavePaginas, tienda.id, tienda.slug]);

  const enlacesNavegacion = crearEnlacesNavegacion({
    navegacion: diseno.navegacion,
    categorias: categoriasSeguras,
    paginas: paginas ?? (paginasCargadas.clave === clavePaginas ? paginasCargadas.paginas : []),
    rutaBase: inicioTienda,
  });
  const enlacesMovil = diseno.navegacion.modo === "automatica" && !opciones.mostrar_navegacion
    ? enlacesNavegacion.filter((e) => e.id === "auto-inicio")
    : enlacesNavegacion;

  const logo = tienda.logo?.trim();
  const tieneLogo = opciones.mostrar_logo && Boolean(logo);
  // Conserva el nombre como respaldo cuando aún no hay logo.
  const mostrarNombre =
    opciones.mostrar_nombre ||
    (opciones.mostrar_logo && !logo);
  const tieneMarca = tieneLogo || mostrarNombre;
  const marcaCentrada = opciones.alineacion_marca === "centro";
  const mostrarCarrito =
    opciones.mostrar_carrito && Boolean(onOpenCart);
  const mostrarPedidos =
    opciones.mostrar_pedidos && Boolean(onOpenOrders);
  const mostrarAccesos =
    opciones.mostrar_buscador || mostrarCarrito || mostrarPedidos;
  const cantidad = Number.isFinite(cartCount)
    ? Math.max(0, Math.floor(cartCount))
    : 0;
  const variablesHeader: Record<`--header-${string}`, string> = {
    "--header-alto": `${opciones.alto_escritorio}px`,
    "--header-alto-movil": `${opciones.alto_movil}px`,
    "--header-padding": `${opciones.padding_horizontal}px`,
    "--header-padding-movil":
      `${opciones.padding_horizontal_movil}px`,
    "--header-logo-ancho": `${opciones.ancho_logo}px`,
    "--header-logo-alto": `${opciones.alto_logo}px`,
    "--header-logo-ancho-movil":
      `${opciones.ancho_logo_movil}px`,
    "--header-logo-alto-movil":
      `${opciones.alto_logo_movil}px`,
    "--header-nombre": `${opciones.tamano_nombre}px`,
    "--header-nombre-movil": `${opciones.tamano_nombre_movil}px`,
    "--header-icono": `${opciones.tamano_iconos}px`,
    "--header-icono-movil": `${opciones.tamano_iconos_movil}px`,
    "--header-gap": `${opciones.separacion_iconos}px`,
  };
  const estiloHeader: VariablesHeader = {
    ...variablesHeader,
    backgroundColor: opciones.color_fondo,
    color: opciones.color_texto,
    borderBottomStyle: "solid",
    borderBottomWidth: opciones.grosor_borde,
    borderBottomColor: opciones.color_borde,
    boxShadow: paginaDesplazada
      ? SOMBRAS[opciones.sombra]
      : "none",
  };
  const estiloNavegacion: CSSProperties = {
    backgroundColor: opciones.color_fondo_navegacion,
    color: opciones.color_texto_navegacion,
    fontFamily: FUENTES[opciones.fuente_navegacion],
    fontSize: opciones.tamano_navegacion,
    fontWeight: opciones.peso_navegacion,
    borderTopStyle: "solid",
    borderTopWidth: opciones.grosor_borde_navegacion,
    borderTopColor: opciones.color_borde_navegacion,
  };
  const cerrarPaneles = () => {
    setMenuAbierto(false);
    setBuscadorAbierto(false);
  };
  function renderizarEnlace(enlace: EnlaceNavegacion, className: string) {
    const target = enlace.nuevaPestana ? "_blank" : undefined;
    const rel = enlace.nuevaPestana ? "noopener noreferrer" : undefined;
    return enlace.externo ? (
      <a key={enlace.id} href={enlace.href} target={target} rel={rel}
        onClick={cerrarPaneles} className={className}>
        {enlace.etiqueta}
      </a>
    ) : (
      <Link key={enlace.id} href={enlace.href} onClick={cerrarPaneles} className={className}>
        {enlace.etiqueta}
      </Link>
    );
  }
  const alternarBusqueda = () => {
    setMenuAbierto(false);
    setBuscadorAbierto((actual) => !actual);
  };
  const abrirCarrito = () => {
    cerrarPaneles();
    if (opciones.mostrar_carrito) {
      onOpenCart?.();
    }
  };
  const abrirPedidos = () => {
    cerrarPaneles();
    if (opciones.mostrar_pedidos) {
      onOpenOrders?.();
    }
  };
  const botonBusqueda = (
    <button
      type="button"
      onClick={alternarBusqueda}
      aria-label={
        buscadorAbierto ? "Cerrar búsqueda" : "Buscar productos"
      }
      aria-expanded={buscadorAbierto}
      className={`${CLASE_BOTON} w-full justify-between gap-3`}
      style={{
        backgroundColor: opciones.color_fondo_buscador,
        color: opciones.color_texto_buscador,
        borderStyle: "solid",
        borderWidth: opciones.grosor_borde_buscador,
        borderColor: opciones.color_borde_buscador,
        borderRadius: opciones.radio_buscador,
      }}
    >
      <span className="min-w-0 truncate text-sm">
        {opciones.texto_buscador}
      </span>
      {buscadorAbierto ? (
        <X
          aria-hidden="true"
          className={CLASE_ICONO}
          style={{ color: opciones.color_busqueda }}
        />
      ) : (
        <Search
          aria-hidden="true"
          className={CLASE_ICONO}
          style={{ color: opciones.color_busqueda }}
        />
      )}
    </button>
  );
  useEffect(() => {
    const detectarDesplazamiento = () => {
      setPaginaDesplazada(window.scrollY > 0);
    };
    detectarDesplazamiento();
    window.addEventListener("scroll", detectarDesplazamiento, {
      passive: true,
    });
    return () => {
      window.removeEventListener("scroll", detectarDesplazamiento);
    };
  }, []);
  // Cierra los paneles cuando sus accesos se ocultan en el editor.
  useEffect(() => {
    if (!opciones.mostrar_menu) {
      setMenuAbierto(false);
    }
    if (!opciones.mostrar_buscador) {
      setBuscadorAbierto(false);
    }
  }, [opciones.mostrar_menu, opciones.mostrar_buscador]);
  // El menú lateral se utiliza solamente en móvil y tablet.
  useEffect(() => {
    const pantallaEscritorio = window.matchMedia(
      "(min-width: 1024px)",
    );
    const cerrarEnEscritorio = () => {
      if (pantallaEscritorio.matches) {
        setMenuAbierto(false);
      }
    };
    cerrarEnEscritorio();
    pantallaEscritorio.addEventListener(
      "change",
      cerrarEnEscritorio,
    );
    return () => {
      pantallaEscritorio.removeEventListener(
        "change",
        cerrarEnEscritorio,
      );
    };
  }, []);
  useEffect(() => {
    if (!menuAbierto) return;
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = window.requestAnimationFrame(() => {
      botonCerrarRef.current?.focus();
    });
    const manejarTeclado = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMenuAbierto(false);
        return;
      }
      if (event.key !== "Tab") return;
      const elementos = Array.from(
        dialogoRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]',
        ) ?? [],
      ).filter((elemento) => elemento.getClientRects().length > 0);
      const primero = elementos[0];
      const ultimo = elementos[elementos.length - 1];
      if (!primero || !ultimo) return;
      const activo = document.activeElement;
      const focoDentro =
        activo !== null && dialogoRef.current?.contains(activo);
      if (
        event.shiftKey &&
        (activo === primero || !focoDentro)
      ) {
        event.preventDefault();
        ultimo.focus();
      } else if (
        !event.shiftKey &&
        (activo === ultimo || !focoDentro)
      ) {
        event.preventDefault();
        primero.focus();
      }
    };
    window.addEventListener("keydown", manejarTeclado);
    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = overflowAnterior;
      window.removeEventListener("keydown", manejarTeclado);
      const botonMenu = botonMenuRef.current;
      if (botonMenu && botonMenu.getClientRects().length > 0) {
        botonMenu.focus();
      }
    };
  }, [menuAbierto]);
  return (
    <>
      <header
        data-editor-section="encabezado"
        className={`z-50 w-full ${
          opciones.posicion === "fijo"
            ? "sticky top-0"
            : "relative"
        }`}
        style={estiloHeader}
      >
        <div
          className="mx-auto flex min-h-[var(--header-alto-movil)] w-full min-w-0 flex-wrap items-center gap-x-3 gap-y-2 px-[var(--header-padding-movil)] py-2 lg:min-h-[var(--header-alto)] lg:px-[var(--header-padding)]"
          style={{ maxWidth: opciones.ancho_contenido }}
        >
          {opciones.mostrar_menu && (
            <button
              ref={botonMenuRef}
              type="button"
              onClick={() => {
                setBuscadorAbierto(false);
                setMenuAbierto(true);
              }}
              aria-label="Abrir menú de la tienda"
              aria-haspopup="dialog"
              aria-expanded={menuAbierto}
              aria-controls={`${id}-menu`}
              className={`${CLASE_BOTON} lg:hidden`}
              style={{ color: opciones.color_menu }}
            >
              <MenuIcon
                aria-hidden="true"
                className={CLASE_ICONO}
              />
            </button>
          )}
          {tieneMarca && (
            <Link
              href={inicioTienda}
              aria-label={`Ir al inicio de ${tienda.nombre}`}
              className={`flex min-w-0 items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-current ${
                marcaCentrada
                  ? "flex-1 justify-center"
                  : "flex-1 justify-start lg:flex-none"
              }`}
            >
              {tieneLogo && logo && (
                <div className="relative h-[var(--header-logo-alto-movil)] w-[var(--header-logo-ancho-movil)] max-w-full shrink lg:h-[var(--header-logo-alto)] lg:w-[var(--header-logo-ancho)]">
                  <Image
                    src={logo}
                    alt={`Logo de ${tienda.nombre}`}
                    fill
                    priority
                    sizes={`(max-width: 1023px) ${opciones.ancho_logo_movil}px, ${opciones.ancho_logo}px`}
                    className="object-contain"
                  />
                </div>
              )}
              {mostrarNombre && (
                <span
                  className="min-w-0 truncate text-[length:var(--header-nombre-movil)] leading-tight lg:max-w-72 lg:text-[length:var(--header-nombre)]"
                  style={{
                    color: opciones.color_nombre,
                    fontFamily: FUENTES[opciones.fuente_nombre],
                    fontWeight: opciones.peso_nombre,
                  }}
                >
                  {tienda.nombre}
                </span>
              )}
            </Link>
          )}
          {!marcaCentrada && opciones.mostrar_buscador && (
            <div className="hidden min-w-0 flex-1 px-4 lg:block">
              <div className="mx-auto w-full max-w-lg">
                {botonBusqueda}
              </div>
            </div>
          )}
          {mostrarAccesos && (
            <div
              className="ml-auto flex shrink-0 flex-wrap items-center justify-end gap-[var(--header-gap)]"
              style={{ maxWidth: "100%" }}
            >
              {opciones.mostrar_buscador && (
                <button
                  type="button"
                  onClick={alternarBusqueda}
                  aria-label={
                    buscadorAbierto
                      ? "Cerrar búsqueda"
                      : "Buscar productos"
                  }
                  aria-expanded={buscadorAbierto}
                  className={`${CLASE_BOTON} lg:hidden`}
                  style={{ color: opciones.color_busqueda }}
                >
                  {buscadorAbierto ? (
                    <X
                      aria-hidden="true"
                      className={CLASE_ICONO}
                    />
                  ) : (
                    <Search
                      aria-hidden="true"
                      className={CLASE_ICONO}
                    />
                  )}
                </button>
              )}
              {mostrarPedidos && (
                <button
                  type="button"
                  onClick={abrirPedidos}
                  aria-label="Mis pedidos"
                  title="Mis pedidos"
                  className={`${CLASE_BOTON} gap-2`}
                  style={{ color: opciones.color_pedidos }}
                >
                  <ClipboardList
                    aria-hidden="true"
                    className={CLASE_ICONO}
                  />
                  <span className="hidden text-sm font-semibold xl:inline">
                    Mis pedidos
                  </span>
                </button>
              )}
              {mostrarCarrito && (
                <button
                  type="button"
                  onClick={abrirCarrito}
                  aria-label={
                    cantidad > 0
                      ? `Abrir carrito con ${cantidad} ${
                          cantidad === 1 ? "producto" : "productos"
                        }`
                      : "Abrir carrito vacío"
                  }
                  className={`${CLASE_BOTON} relative`}
                  style={{ color: opciones.color_carrito }}
                >
                  <ShoppingCart
                    aria-hidden="true"
                    className={CLASE_ICONO}
                  />
                  {cantidad > 0 && (
                    <span className="absolute right-0 top-0 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-primary)] px-1 text-[10px] font-bold text-white">
                      {cantidad > 99 ? "99+" : cantidad}
                    </span>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
        {marcaCentrada && opciones.mostrar_buscador && (
          <div
            className="mx-auto hidden w-full px-[var(--header-padding)] pb-3 lg:block"
            style={{ maxWidth: opciones.ancho_contenido }}
          >
            <div className="mx-auto max-w-lg">
              {botonBusqueda}
            </div>
          </div>
        )}
        {opciones.mostrar_navegacion && enlacesNavegacion.length > 0 && (
          <nav aria-label="Navegación de la tienda" style={estiloNavegacion}>
            <div
              className="mx-auto flex items-center overflow-x-auto px-[var(--header-padding-movil)] py-3 lg:px-[var(--header-padding)]"
              style={{ maxWidth: opciones.ancho_contenido, gap: opciones.separacion_navegacion }}
            >
              {enlacesNavegacion.map((enlace) => renderizarEnlace(enlace,
                "shrink-0 whitespace-nowrap rounded px-1 py-1 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-current"))}
            </div>
          </nav>
        )}
        {opciones.mostrar_buscador && (
          <BuscadorTienda
            searchOpen={buscadorAbierto}
            setSearchOpen={setBuscadorAbierto}
            categorias={categoriasSeguras}
          />
        )}
      </header>
      {menuAbierto && opciones.mostrar_menu && (
        <>
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setMenuAbierto(false)}
            className="fixed inset-0 z-[60] cursor-default bg-black/60 lg:hidden"
          />
          <aside
            ref={dialogoRef}
            id={`${id}-menu`}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${id}-titulo`}
            className="fixed left-0 top-0 z-[70] flex h-dvh w-80 max-w-[90vw] flex-col overflow-hidden shadow-2xl lg:hidden"
            style={{
              ...variablesHeader,
              backgroundColor: opciones.color_fondo,
              color: opciones.color_texto,
            }}
          >
            <div
              className="flex shrink-0 items-center justify-between gap-3 p-5"
              style={{
                borderBottomStyle: "solid",
                borderBottomWidth: opciones.grosor_borde,
                borderBottomColor: opciones.color_borde,
              }}
            >
              <h2
                id={`${id}-titulo`}
                className="min-w-0 truncate"
                style={{
                  fontFamily: FUENTES[opciones.fuente_nombre],
                  fontSize: opciones.tamano_nombre_movil,
                  fontWeight: opciones.peso_nombre,
                  color: opciones.color_nombre,
                }}
              >
                {tienda.nombre}
              </h2>
              <button
                ref={botonCerrarRef}
                type="button"
                onClick={() => setMenuAbierto(false)}
                aria-label="Cerrar menú"
                className={CLASE_BOTON}
              >
                <X size={22} aria-hidden="true" />
              </button>
            </div>
            <nav
              aria-label="Menú de la tienda"
              className="min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain p-3"
              style={{
                fontFamily: FUENTES[opciones.fuente_navegacion],
                fontSize: opciones.tamano_navegacion,
                fontWeight: opciones.peso_navegacion,
              }}
            >
              {enlacesMovil.map((enlace) => renderizarEnlace(enlace, CLASE_ENLACE_MENU))}
              {mostrarPedidos && (
                <button
                  type="button"
                  onClick={abrirPedidos}
                  className={`${CLASE_ENLACE_MENU} w-full gap-3 text-left`}
                  style={{ color: opciones.color_pedidos }}
                >
                  <ClipboardList size={20} aria-hidden="true" />
                  Mis pedidos
                </button>
              )}
              {mostrarCarrito && (
                <button
                  type="button"
                  onClick={abrirCarrito}
                  className={`${CLASE_ENLACE_MENU} w-full gap-3 text-left`}
                  style={{ color: opciones.color_carrito }}
                >
                  <ShoppingCart size={20} aria-hidden="true" />
                  Carrito
                  {cantidad > 0 && (
                    <span className="ml-auto rounded-full bg-[var(--color-primary)] px-2 py-0.5 text-xs font-bold text-white">
                      {cantidad > 99 ? "99+" : cantidad}
                    </span>
                  )}
                </button>
              )}
            </nav>
            <Link
              href="https://catalagox.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={cerrarPaneles}
              className="flex shrink-0 items-center justify-between gap-3 bg-[#25D366] p-5 text-black outline-none hover:bg-[#20ba5a] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-black"
            >
              <span className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Tienda creada con
                </span>
                <span className="text-base font-extrabold">
                  catalagox.com
                </span>
              </span>
              <ExternalLink size={20} aria-hidden="true" />
            </Link>
          </aside>
        </>
      )}
    </>
  );
}
