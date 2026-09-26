"use client";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ExternalLink,
  ClipboardList,
  Menu as MenuIcon,
  Search,
  ShoppingCart,
  X,
} from "lucide-react";
import BuscadorTienda from "@/components/public/BuscadorTienda";
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
  nombre: string;
  logo?: string | null;
  slug?: string | null;
  color_lupa?: string | null;
  color_text_header?: string | null;
  color_border_header?: string | null;
  color_hamburguesa?: string | null;
}
interface TiendaHeaderProps {
  catalogo: Tienda;
  categorias: Categoria[];
  rutaBase: string;
  cartCount?: number;
  onOpenCart?: () => void;
  onOpenOrders?: () => void;
}
export default function TiendaHeader({
  catalogo: tienda,
  categorias,
  rutaBase,
  cartCount = 0,
  onOpenCart,
  onOpenOrders,
}: TiendaHeaderProps) {
  const [menuAbierto, setMenuAbierto] =
    useState(false);
  const [buscadorAbierto, setBuscadorAbierto] =
    useState(false);
  const [paginaDesplazada, setPaginaDesplazada] =
    useState(false);
  const botonMenuRef =
    useRef<HTMLButtonElement>(null);
  const botonCerrarRef =
    useRef<HTMLButtonElement>(null);
  const categoriasSeguras = Array.isArray(
    categorias,
  )
    ? categorias.filter(
        (categoria) =>
          Boolean(categoria) &&
          Boolean(categoria.id) &&
          Boolean(categoria.nombre?.trim()),
      )
    : [];
  const inicioTienda =
    rutaBase.trim() || "/";
  const abrirMenu = useCallback(() => {
    setBuscadorAbierto(false);
    setMenuAbierto(true);
  }, []);
  const cerrarMenu = useCallback(() => {
    setMenuAbierto(false);
  }, []);
  const abrirCarrito = () => {
    setMenuAbierto(false);
    setBuscadorAbierto(false);
    onOpenCart?.();
  };
  const alternarBuscador = () => {
    setMenuAbierto(false);
    setBuscadorAbierto(
      (estadoActual) => !estadoActual,
    );
  };
  useEffect(() => {
    const detectarDesplazamiento = () => {
      const nuevoEstado = window.scrollY > 0;
      setPaginaDesplazada(
        (estadoAnterior) =>
          estadoAnterior !== nuevoEstado
            ? nuevoEstado
            : estadoAnterior,
      );
    };
    detectarDesplazamiento();
    window.addEventListener(
      "scroll",
      detectarDesplazamiento,
      {
        passive: true,
      },
    );
    return () => {
      window.removeEventListener(
        "scroll",
        detectarDesplazamiento,
      );
    };
  }, []);
  useEffect(() => {
    if (!menuAbierto) {
      return;
    }
    const overflowAnterior =
      document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const enfocarBoton =
      window.requestAnimationFrame(() => {
        botonCerrarRef.current?.focus();
      });
    const manejarTeclado = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        cerrarMenu();
      }
    };
    window.addEventListener(
      "keydown",
      manejarTeclado,
    );
    return () => {
      window.cancelAnimationFrame(
        enfocarBoton,
      );
      document.body.style.overflow =
        overflowAnterior;
      window.removeEventListener(
        "keydown",
        manejarTeclado,
      );
      botonMenuRef.current?.focus();
    };
  }, [menuAbierto, cerrarMenu]);
  return (
    <>
      {/* ENCABEZADO PRINCIPAL DE LA TIENDA */}
      <header
        className={`
          sticky
          top-0
          z-50
          w-full
          bg-[var(--color-header)]
          text-[var(--color-text-header,#ffffff)]
          transition-all
          duration-300
          ${
            paginaDesplazada
              ? "shadow-md"
              : ""
          }
        `}
        style={{
          borderBottomWidth: "1px",
          borderBottomStyle: "solid",
          borderBottomColor: paginaDesplazada
            ? "transparent"
            : "var(--color-border-header, rgba(255,255,255,0.1))",
        }}
      >
        <div className="relative mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* MENÚ MÓVIL Y LOGO */}
          <div className="flex items-center gap-4 md:w-auto">
            <button
              ref={botonMenuRef}
              type="button"
              onClick={abrirMenu}
              aria-label="Abrir categorías de la tienda"
              aria-haspopup="dialog"
              aria-expanded={menuAbierto}
              className="flex items-center justify-center rounded-lg p-2 transition hover:bg-white/10 lg:hidden"
            >
              <MenuIcon
                size={26}
                className="text-[var(--color-hamburguesa)]"
              />
            </button>
            <Link
              href={inicioTienda}
              aria-label={`Ir al inicio de ${tienda.nombre}`}
              className="absolute left-1/2 z-10 flex h-full -translate-x-1/2 items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-current lg:relative lg:left-0 lg:translate-x-0"
            >
              {tienda.logo ? (
                <div className="relative flex h-16 w-28 items-center min-[380px]:w-40 sm:w-60">
                  <Image
                    src={tienda.logo}
                    alt={`Logo de ${tienda.nombre}`}
                    fill
                    priority
                    sizes="(max-width: 768px) 192px, 240px"
                    className="object-contain"
                  />
                </div>
              ) : (
                <span className="max-w-[110px] min-[380px]:max-w-[155px] truncate whitespace-nowrap text-xl font-bold tracking-tight sm:max-w-[240px]">
                  {tienda.nombre}
                </span>
              )}
            </Link>
          </div>
          {/* ACCESOS DEL ENCABEZADO */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-2 lg:gap-4">
            {onOpenCart && (
              <button
                type="button"
                onClick={abrirCarrito}
                aria-label={cartCount > 0 ? `Abrir carrito con ${cartCount} ${cartCount === 1 ? "producto" : "productos"}` : "Abrir carrito vacío"}
                className="relative rounded-full p-2 outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-current"
              >
                <ShoppingCart size={24} aria-hidden="true" />
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-primary)] px-1 text-[10px] font-bold text-white shadow">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </button>
            )}
            {onOpenOrders && (
              <button
                type="button"
                onClick={() => { setMenuAbierto(false); setBuscadorAbierto(false); onOpenOrders(); }}
                aria-label="Mis pedidos"
                title="Mis pedidos"
                className="hidden rounded-full p-2 outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-current lg:flex"
              >
                <ClipboardList size={24} aria-hidden="true" />
              </button>
            )}
            <button
              type="button"
              onClick={alternarBuscador}
              aria-label={buscadorAbierto ? "Cerrar búsqueda" : "Buscar productos"}
              aria-expanded={buscadorAbierto}
              className="flex items-center justify-center rounded-full p-2 outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-current lg:absolute lg:left-1/2 lg:top-1/2 lg:w-[min(38vw,30rem)] lg:-translate-x-1/2 lg:-translate-y-1/2 lg:justify-between lg:gap-4 lg:rounded-xl lg:border lg:border-current/20 lg:px-4 lg:py-2 lg:text-left"
            >
              <span className="hidden truncate text-sm opacity-75 lg:block">
                Buscar productos...
              </span>
              {buscadorAbierto ? (
                <X size={22} aria-hidden="true" style={{ color: tienda.color_lupa || "inherit" }} />
              ) : (
                <Search size={22} aria-hidden="true" style={{ color: tienda.color_lupa || "inherit" }} />
              )}
            </button>
          </div>
        </div>
        {/* BUSCADOR DE LA TIENDA */}
        <BuscadorTienda
          searchOpen={buscadorAbierto}
          setSearchOpen={setBuscadorAbierto}
          categorias={categoriasSeguras}
        />
      </header>
      {/* PANEL MÓVIL DE CATEGORÍAS */}
      {menuAbierto && (
        <>
          <button
            type="button"
            aria-label="Cerrar categorías"
            onClick={cerrarMenu}
            className="fixed inset-0 z-[60] cursor-default bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="categorias-tienda-titulo"
            className="fixed left-0 top-0 z-[70] flex h-full w-[280px] max-w-[85vw] flex-col bg-[var(--color-header)] text-[var(--color-text-header,#ffffff)] shadow-2xl animate-in slide-in-from-left duration-300"
          >
            {/* ENCABEZADO DEL PANEL */}
            <div className="flex items-center justify-between border-b border-[var(--color-border-header,rgba(255,255,255,0.1))] p-6">
              <h2
                id="categorias-tienda-titulo"
                className="text-xl font-bold"
              >
                Categorías
              </h2>
              <button
                ref={botonCerrarRef}
                type="button"
                onClick={cerrarMenu}
                aria-label="Cerrar categorías"
                className="flex h-9 w-9 items-center justify-center rounded-full outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-current"
              >
                <X size={21} />
              </button>
            </div>
            {/* LISTA DE CATEGORÍAS */}
            <nav
              aria-label="Todas las categorías"
              className="flex-1 overflow-y-auto py-2"
            >
              {onOpenOrders && (
                <button
                  type="button"
                  onClick={() => { cerrarMenu(); onOpenOrders(); }}
                  className="flex w-full items-center gap-3 border-b border-white/10 px-6 py-4 text-left font-semibold"
                >
                  <ClipboardList size={20} aria-hidden="true" /> Mis pedidos
                </button>
              )}
              {categoriasSeguras.length > 0 ? (
                categoriasSeguras.map(
                  (categoria) => (
                    <a
                      key={categoria.id}
                      href={`#cat-${categoria.id}`}
                      onClick={cerrarMenu}
                      className="block border-b border-white/5 px-6 py-4 text-base font-medium transition-colors hover:bg-white/5"
                    >
                      {categoria.nombre}
                    </a>
                  ),
                )
              ) : (
                <p className="px-6 py-8 text-sm opacity-70">
                  Esta tienda todavía no tiene
                  categorías disponibles.
                </p>
              )}
            </nav>
            {/* FIRMA DE CATALAGOX */}
            <div className="border-t border-black/10 bg-[#25D366] transition-colors hover:bg-[#20ba5a]">
              <Link
                href="https://catalagox.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={cerrarMenu}
                className="flex w-full items-center justify-between p-5 font-semibold text-black active:opacity-90"
              >
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-black opacity-80">
                    Tienda creada con
                  </span>
                  <span className="text-base font-extrabold leading-tight text-black">
                    catalagox.com
                  </span>
                </div>
                <ExternalLink
                  size={20}
                  className="text-black"
                />
              </Link>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
