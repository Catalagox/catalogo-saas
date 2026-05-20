"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, X } from "lucide-react";

type Producto = {
  id: string;
  nombre: string;
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
  };

  categorias: Categoria[];
};

export default function MenuHeader({ catalogo, categorias }: Props) {
  const [open, setOpen] = useState(false);

  // 🔥 SEARCH
  const [searchOpen, setSearchOpen] = useState(false);

  const [search, setSearch] = useState("");

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔥 RESULTADOS EN TIEMPO REAL
  const resultados = useMemo(() => {
    if (!search.trim()) return [];

    const texto = search.toLowerCase();

    const encontrados: {
      tipo: "categoria" | "producto";
      nombre: string;
      categoriaId: string;
    }[] = [];

    categorias.forEach((cat) => {
      // 🔥 BUSCAR CATEGORÍA
      if (cat.nombre.toLowerCase().includes(texto)) {
        encontrados.push({
          tipo: "categoria",
          nombre: cat.nombre,
          categoriaId: cat.id,
        });
      }

      // 🔥 BUSCAR PRODUCTOS
      cat.productos?.forEach((producto) => {
        if (producto.nombre.toLowerCase().includes(texto)) {
          encontrados.push({
            tipo: "producto",
            nombre: producto.nombre,
            categoriaId: cat.id,
          });
        }
      });
    });

    return encontrados.slice(0, 8);
  }, [search, categorias]);

  // 🔥 IR A RESULTADO
  const irAResultado = (categoriaId: string) => {
    const element = document.getElementById(`cat-${categoriaId}`);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    setSearchOpen(false);
    setSearch("");
  };

  return (
    <>
      {/* HEADER */}
      <header
        className="
          sticky
          top-0
          z-50
          transition-all
          duration-300
          bg-[var(--color-header)]
        "
        style={{
          boxShadow: scrolled ? "0 8px 20px rgba(0,0,0,0.3)" : "none",
        }}
      >
        <div className="max-w-3xl mx-auto px-5 py-4">
          {/* TOP */}
          <div className="relative flex items-center justify-between">
            {/* IZQUIERDA */}
            <div className="flex items-center gap-4">
              {/* 🍔 HAMBURGUESA */}
              <button
                onClick={() => setOpen(true)}
                className="
                  flex
                  flex-col
                  justify-center
                  items-center
                  w-8
                  h-8
                  md:hidden
                "
              >
                <span className="block w-6 h-[2px] mb-1.5 bg-[var(--color-hamburguesa)]" />

                <span className="block w-6 h-[2px] mb-1.5 bg-[var(--color-hamburguesa)]" />

                <span className="block w-6 h-[2px] bg-[var(--color-hamburguesa)]" />
              </button>
            </div>

            {/* 🔥 LOGO CENTRADO */}
            <div
              className="
                absolute
                left-1/2
                -translate-x-1/2
                flex
                items-center
                justify-center
              "
            >
              {catalogo.logo ? (
                <img
                  src={catalogo.logo}
                  alt={catalogo.nombre}
                  className="
                    h-12
                    w-auto
                    object-contain
                  "
                />
              ) : (
                <h1 className="text-lg font-bold text-[var(--color-text)]">
                  {catalogo.nombre}
                </h1>
              )}
            </div>

            {/* DERECHA */}
            <div className="flex items-center gap-4 ml-auto">
              {/* DESKTOP NAV */}
              <nav className="hidden md:flex items-center gap-3">
                {categorias.slice(0, 5).map((cat) => (
                  <a
                    key={cat.id}
                    href={`#cat-${cat.id}`}
                    className="
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wider
                      transition
                      text-[var(--color-categoria)]
                    "
                  >
                    {cat.nombre}
                  </a>
                ))}
              </nav>

              {/* 🔍 LUPA */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="
                  w-9
                  h-9
                  rounded-full
                  flex
                  items-center
                  justify-center
                  transition
                "
              >
                {searchOpen ? (
                  <X
                    size={20}
                    style={{
                      color: catalogo.color_lupa || "#ffffff",
                    }}
                  />
                ) : (
                  <Search
                    size={20}
                    style={{
                      color: catalogo.color_lupa || "#ffffff",
                    }}
                  />
                )}
              </button>
            </div>
          </div>

          {/* 🔥 BARRA BÚSQUEDA */}
          {searchOpen && (
            <div className="mt-4 relative">
              {/* INPUT */}
              <div
                className="
                  flex
                  items-center
                  gap-2
                  rounded-2xl
                  px-4
                  py-3
                  border
                  bg-white/10
                  backdrop-blur-md
                "
                style={{
                  borderColor: `${catalogo.color_lupa || "#ffffff"}40`,
                }}
              >
                <Search
                  size={18}
                  style={{
                    color: catalogo.color_lupa || "#ffffff",
                  }}
                />

                <input
                  type="text"
                  placeholder="Buscar productos o categorías..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="
                    bg-transparent
                    outline-none
                    w-full
                    text-sm
                    text-[var(--color-text)]
                    placeholder:text-white/60
                  "
                />
              </div>

              {/* 🔥 RESULTADOS */}
              {search.trim() && (
                <div
                  className="
                    absolute
                    top-full
                    left-0
                    right-0
                    mt-2
                    rounded-2xl
                    overflow-hidden
                    border
                    backdrop-blur-xl
                    bg-black/70
                    z-50
                  "
                  style={{
                    borderColor: `${catalogo.color_lupa || "#ffffff"}20`,
                  }}
                >
                  {resultados.length > 0 ? (
                    resultados.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => irAResultado(item.categoriaId)}
                        className="
                          w-full
                          text-left
                          px-4
                          py-3
                          border-b
                          border-white/10
                          hover:bg-white/10
                          transition
                        "
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[var(--color-text)] text-sm">
                            {item.nombre}
                          </span>

                          <span
                            className="
                              text-[10px]
                              uppercase
                              opacity-60
                            "
                            style={{
                              color: catalogo.color_lupa || "#ffffff",
                            }}
                          >
                            {item.tipo}
                          </span>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div
                      className="
                        px-4
                        py-4
                        text-sm
                        text-center
                        text-[var(--color-text)]
                      "
                    >
                      No encontramos resultados para{" "}
                      <span
                        style={{
                          color: catalogo.color_lupa || "#ffffff",
                        }}
                      >
                        "{search}"
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="
            fixed
            inset-0
            bg-black/60
            backdrop-blur-sm
            z-[60]
          "
        />
      )}

      {/* DRAWER */}
      <aside
        className={`
          fixed
          top-0
          left-0
          h-full
          w-[280px]
          z-[70]
          transform
          transition-transform
          duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          bg-[var(--color-header)]
        `}
      >
        {/* HEADER DRAWER */}
        <div className="p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[var(--color-text)]">Menú</h2>

          <button
            onClick={() => setOpen(false)}
            className="text-2xl text-[var(--color-hamburguesa)]"
          >
            ✕
          </button>
        </div>

        {/* LINKS */}
        <nav>
          {categorias.map((cat) => (
            <a
              key={cat.id}
              href={`#cat-${cat.id}`}
              onClick={() => setOpen(false)}
              className="
                block
                px-6
                py-4
                text-lg
                border-b
                border-white/10
                transition
                text-[var(--color-categoria)]
              "
            >
              {cat.nombre}
            </a>
          ))}
        </nav>
      </aside>
    </>
  );
}
