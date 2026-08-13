"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Search, X, Menu } from "lucide-react";
import HeaderSearch from "@/components/public/HeaderSearch";

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
  const [scrolled, setScrolled] = useState(false);

  // Detección optimizada de Scroll
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0;
      setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Bloqueo de Scroll (Menú hamburguesa) & Tecla Escape
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setSearchOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <>
      {/* HEADER PRINCIPAL */}
      <header
        className="sticky top-0 z-50 w-full transition-all duration-300 bg-[var(--color-header)] text-[var(--color-text-header,#ffffff)]"
        style={{
          borderBottomWidth: "1px",
          borderBottomStyle: "solid",
          borderBottomColor: scrolled
            ? "transparent"
            : "var(--color-border-header, rgba(255,255,255,0.1))",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* BLOQUE IZQUIERDO */}
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
                <div className="relative h-16 w-48 sm:w-60 flex items-center">
                  <Image
                    src={catalogo.logo}
                    alt={catalogo.nombre}
                    fill
                    priority
                    sizes="(max-width: 768px) 192px, 240px"
                    className="object-contain"
                  />
                </div>
              ) : (
                <h1 className="text-xl font-bold tracking-tight whitespace-nowrap">
                  {catalogo.nombre}
                </h1>
              )}
            </div>
          </div>

          {/* NAVEGACIÓN DESKTOP & BOTÓN BUSCADOR */}
          <div className="flex items-center gap-6 lg:gap-8">
            <nav className="hidden lg:flex items-center gap-5 lg:gap-8 py-1">
              {categorias.slice(0, 4).map((cat) => (
                <a
                  key={cat.id}
                  href={`#cat-${cat.id}`}
                  title={cat.nombre}
                  className="max-w-[180px] truncate text-sm font-medium uppercase tracking-wider whitespace-nowrap transition-all duration-200 hover:opacity-80 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[2px] after:bottom-0 after:left-0 after:bg-current after:origin-bottom-right after:transition-transform after:duration-200 hover:after:scale-x-100 hover:after:origin-bottom-left"
                >
                  {cat.nombre}
                </a>
              ))}
            </nav>

            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-full transition-transform duration-200 hover:scale-105"
              aria-label={searchOpen ? "Cerrar búsqueda" : "Abrir búsqueda"}
            >
              {searchOpen ? (
                <X
                  size={22}
                  style={{ color: catalogo.color_lupa || "inherit" }}
                />
              ) : (
                <Search
                  size={22}
                  style={{ color: catalogo.color_lupa || "inherit" }}
                />
              )}
            </button>
          </div>
        </div>

        {/* COMPONENTE DE BÚSQUEDA DESPRENDIDO */}
        <HeaderSearch
          searchOpen={searchOpen}
          setSearchOpen={setSearchOpen}
          categorias={categorias}
        />
      </header>

      {/* OVERLAY DEL MENÚ LATERAL MÓVIL */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] animate-in fade-in duration-300"
        />
      )}

      {/* DRAWER / MENÚ MÓVIL */}
      <aside
        className={`fixed top-0 left-0 h-full w-[280px] z-[70] transform transition-transform duration-300 shadow-2xl bg-[var(--color-header)] text-[var(--color-text-header,#ffffff)] ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 flex items-center justify-between border-b border-[var(--color-border-header,rgba(255,255,255,0.1))]">
          <h2 className="text-xl font-bold">Categorías</h2>
          <button
            onClick={() => setOpen(false)}
            aria-label="Cerrar menú"
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-lg"
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
              className="block px-6 py-4 text-base font-medium border-b border-white/5 transition-colors hover:bg-white/5"
            >
              {cat.nombre}
            </a>
          ))}
        </nav>
      </aside>
    </>
  );
}