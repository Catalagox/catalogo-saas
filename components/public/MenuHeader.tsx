"use client";

import { useState, useEffect, useMemo, FormEvent } from "react";
import { Search, X, Menu } from "lucide-react";

type Producto = {
  id: string;
  nombre: string;
  imagen_url?: string;
};

type Categoria = {
  id: string;
  nombre: string;
  productos?: Producto[];
};

type Props = {
  catalogo: {
    nombre: string;
    logo?: string;
    color_lupa?: string;
    color_text_header?: string;
    color_border_header?: string;
  };
  categorias: Categoria[];
};

export default function MenuHeader({ catalogo, categorias }: Props) {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔥 BUSCADOR EN TIEMPO REAL
  const resultados = useMemo(() => {
    if (!search.trim()) return [];

    const texto = search.toLowerCase();

    const encontrados: {
      tipo: "categoria" | "producto";
      nombre: string;
      idDestino: string;
      imagen_url?: string;
    }[] = [];

    categorias.forEach((cat) => {
      if (cat.nombre.toLowerCase().includes(texto)) {
        encontrados.push({
          tipo: "categoria",
          nombre: cat.nombre,
          idDestino: `cat-${cat.id}`,
        });
      }

      cat.productos?.forEach((producto) => {
        if (producto.nombre.toLowerCase().includes(texto)) {
          encontrados.push({
            tipo: "producto",
            nombre: producto.nombre,
            idDestino: `prod-${producto.id}`,
            imagen_url: producto.imagen_url,
          });
        }
      });
    });

    return encontrados.slice(0, 8);
  }, [search, categorias]);

  // 🚀 FUNCIÓN DE SCROLL MEJORADA
  const irAResultado = (idDestino: string) => {
    const element = document.getElementById(idDestino);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      // Si buscas un producto y no tiene ID propio asignado, intenta caer en su categoría padre
      console.warn(`No se encontró el elemento con ID: ${idDestino}`);
    }

    setSearchOpen(false);
    setSearch("");
  };

  // 🚀 MANEJADOR PARA EL ENTER (SUBMIT DEL FORMULARIO)
  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (resultados.length > 0) {
      // Si el usuario presiona Enter, viaja automáticamente al primer resultado encontrado
      irAResultado(resultados[0].idDestino);
    }
  };

  return (
    <>
      {/* HEADER PRINCIPAL */}
      <header
        className="sticky top-0 z-50 w-full transition-all duration-300 bg-[var(--color-header)]"
        style={{
          boxShadow: "none",
          borderBottomWidth: "1px",
          borderBottomStyle: "solid",
          borderBottomColor: scrolled
            ? "transparent"
            : "var(--color-border-header, rgba(255,255,255,0.1))",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* BLOQUE IZQUIERDO / CENTRO RESPONSIVO */}
          <div className="flex items-center gap-4 md:w-auto">
            <button
              onClick={() => setOpen(true)}
              className="p-2 lg:hidden flex items-center justify-center transition-opacity hover:opacity-80"
              aria-label="Abrir menú"
            >
              <Menu size={26} className="text-[var(--color-hamburguesa)]" />
            </button>

            <div className="absolute left-1/2 -translate-x-1/2 lg:relative lg:left-0 lg:translate-x-0 flex items-center justify-center h-full z-10">
              {catalogo.logo ? (
                <img
                  src={catalogo.logo}
                  alt={catalogo.nombre}
                  className="h-16 w-auto object-contain max-w-[240px] md:max-w-[300px]"
                />
              ) : (
                <h1 className="text-xl font-bold tracking-tight text-[var(--color-text-header,#ffffff)] whitespace-nowrap">
                  {catalogo.nombre}
                </h1>
              )}
            </div>
          </div>

          {/* BLOQUE DERECHO (NAVEGACIÓN + ACCIONES) */}
          <div className="flex items-center gap-6 lg:gap-8">
            <nav className="hidden lg:flex items-center gap-5 lg:gap-8 py-1">
              {categorias.slice(0, 4).map((cat) => (
                <a
                  key={cat.id}
                  href={`#cat-${cat.id}`}
                  title={cat.nombre}
                  className="max-w-[180px] truncate text-sm font-medium uppercase tracking-wider whitespace-nowrap transition-all duration-200 hover:opacity-80 text-[var(--color-text-header,#ffffff)] relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[2px] after:bottom-0 after:left-0 after:bg-[var(--color-text-header,#ffffff)] after:origin-bottom-right after:transition-transform after:duration-200 hover:after:scale-x-100 hover:after:origin-bottom-left"
                >
                  {cat.nombre}
                </a>
              ))}
            </nav>

            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-full transition-transform duration-200 hover:scale-105"
              aria-label="Buscar"
            >
              {searchOpen ? (
                <X
                  size={22}
                  style={{ color: catalogo.color_lupa || "#ffffff" }}
                />
              ) : (
                <Search
                  size={22}
                  style={{ color: catalogo.color_lupa || "#ffffff" }}
                />
              )}
            </button>
          </div>
        </div>

        {/* PANEL DESPLEGABLE DE BÚSQUEDA */}
        {searchOpen && (
          <div className="max-w-3xl mx-auto px-4 pb-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="relative">
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center gap-3 rounded-2xl px-4 py-3.5 border bg-[var(--color-header)]"
                style={{
                  borderColor:
                    "var(--color-border-header, rgba(255,255,255,0.1))",
                }}
              >
                <Search
                  size={18}
                  style={{ color: "var(--color-text-header, #ffffff)" }}
                />

                <input
                  type="text"
                  placeholder="Buscar productos o categorías..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    color: "var(--color-text-header, #ffffff)",
                  }}
                  className="w-full bg-transparent outline-none text-base placeholder:text-[var(--color-text-header)] placeholder:opacity-60"
                  autoFocus
                />
              </form>

              {search.trim() && (
                <div
                  className="absolute top-full left-0 right-0 mt-2 z-50 overflow-hidden rounded-2xl border bg-[var(--color-header)] shadow-2xl"
                  style={{
                    borderColor:
                      "var(--color-border-header, rgba(255,255,255,0.1))",
                  }}
                >
                  {resultados.length > 0 ? (
                    resultados.map((item) => (
                      <button
                        key={item.idDestino}
                        onClick={() => irAResultado(item.idDestino)}
                        className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-white/10"
                      >
                        {item.tipo === "producto" &&
                          (item.imagen_url ? (
                            <img
                              src={item.imagen_url}
                              alt={item.nombre}
                              className="h-12 w-12 shrink-0 rounded-lg object-cover bg-white/10"
                            />
                          ) : (
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[10px] opacity-60 text-[var(--color-text-header,#ffffff)]">
                              Sin foto
                            </div>
                          ))}

                        <span className="flex-1 text-sm font-medium text-[var(--color-text-header,#ffffff)]">
                          {item.nombre}
                        </span>

                        <span className="rounded border border-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-header,#ffffff)] opacity-60">
                          {item.tipo}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="px-5 py-6 text-center text-sm text-[var(--color-text-header,#ffffff)] opacity-80">
                      No encontramos resultados para{" "}
                      <span className="font-semibold">"{search}"</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* OVERLAY DEL MENU LATERAL */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] animate-in fade-in duration-300"
        />
      )}

      {/* MENÚ DRAWER (MÓVIL / SIDEBAR) */}
      <aside
        className={`fixed top-0 left-0 h-full w-[280px] z-[70] transform transition-transform duration-300 shadow-2xl ${
          open ? "translate-x-0" : "-translate-x-full"
        } bg-[var(--color-header)]`}
      >
        <div className="p-6 flex items-center justify-between border-b border-[var(--color-border-header,rgba(255,255,255,0.1))]">
          <h2 className="text-xl font-bold text-[var(--color-text-header,#ffffff)]">
            Categorías
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-[var(--color-text-header,#ffffff)] transition-colors text-lg"
          >
            ✕
          </button>
        </div>

        <nav className="py-2 overflow-y-auto max-h-[calc(100vh-80px)]">
          {categorias.map((cat) => (
            <a
              key={cat.id}
              href={`#cat-${cat.id}`}
              onClick={() => setOpen(false)}
              className="block px-6 py-4 text-base font-medium border-b border-white/5 transition-colors hover:bg-white/5 text-[var(--color-text-header,#ffffff)]"
            >
              {cat.nombre}
            </a>
          ))}
        </nav>
      </aside>
    </>
  );
}
