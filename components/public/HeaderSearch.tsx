"use client";

import { useState, useEffect, useMemo, FormEvent, useCallback } from "react";
import Image from "next/image";
import { Search } from "lucide-react";

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

type HeaderSearchProps = {
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  categorias: Categoria[];
};

export default function HeaderSearch({
  searchOpen,
  setSearchOpen,
  categorias,
}: HeaderSearchProps) {
  const [search, setSearch] = useState("");

  // Control de Bloqueo de Scroll en Body mientras la búsqueda está abierta
  useEffect(() => {
    if (searchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [searchOpen]);

  // Buscador Memoizado
  const resultados = useMemo(() => {
    if (!search.trim()) return [];

    const texto = search.toLowerCase();
    const encontrados: {
      tipo: "categoria" | "producto";
      nombre: string;
      idDestino: string;
      imagen_url?: string;
    }[] = [];

    for (const cat of categorias) {
      if (cat.nombre.toLowerCase().includes(texto)) {
        encontrados.push({
          tipo: "categoria",
          nombre: cat.nombre,
          idDestino: `cat-${cat.id}`,
        });
      }

      if (cat.productos) {
        for (const producto of cat.productos) {
          if (producto.nombre.toLowerCase().includes(texto)) {
            encontrados.push({
              tipo: "producto",
              nombre: producto.nombre,
              idDestino: `prod-${producto.id}`,
              imagen_url: producto.imagen_url,
            });
          }
        }
      }
    }

    return encontrados.slice(0, 12);
  }, [search, categorias]);

  // Scroll suave al elemento seleccionado
  const irAResultado = useCallback(
    (idDestino: string) => {
      const element = document.getElementById(idDestino);

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      setSearchOpen(false);
      setSearch("");
    },
    [setSearchOpen],
  );

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (resultados.length > 0) {
      irAResultado(resultados[0].idDestino);
    }
  };

  if (!searchOpen) return null;

  return (
    <>
      {/* PANEL DESPLEGABLE DE BÚSQUEDA */}
      <div className="max-w-3xl mx-auto px-4 pb-4 animate-in fade-in slide-in-from-top-2 duration-200">
        <div className="relative">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center gap-3 rounded-2xl px-4 py-3.5 border bg-[var(--color-header)] border-[var(--color-border-header,rgba(255,255,255,0.1))]"
          >
            <Search size={18} className="opacity-70" />

            <input
              type="text"
              placeholder="Buscar productos o categorías..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent outline-none text-base text-current placeholder:text-current placeholder:opacity-60"
              autoFocus
            />
          </form>

          {/* LISTA DESPLEGABLE CON SCROLL INVISIBLE */}
          {search.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 z-50 overflow-y-auto max-h-[calc(100vh-160px)] rounded-2xl border bg-[var(--color-header)] border-[var(--color-border-header,rgba(255,255,255,0.1))] shadow-2xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {resultados.length > 0 ? (
                resultados.map((item) => (
                  <button
                    key={item.idDestino}
                    onClick={() => irAResultado(item.idDestino)}
                    className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-white/10"
                  >
                    {item.tipo === "producto" &&
                      (item.imagen_url ? (
                        <div className="relative h-12 w-12 shrink-0 rounded-lg overflow-hidden bg-white/10">
                          <Image
                            src={item.imagen_url}
                            alt={item.nombre}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[10px] opacity-60">
                          Sin foto
                        </div>
                      ))}

                    <span className="flex-1 text-sm font-medium truncate">
                      {item.nombre}
                    </span>

                    <span className="rounded border border-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest opacity-60">
                      {item.tipo}
                    </span>
                  </button>
                ))
              ) : (
                <div className="px-5 py-6 text-center text-sm opacity-80">
                  No encontramos resultados para{" "}
                  <span className="font-semibold">"{search}"</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* OVERLAY OSCURO DE FONDO PARA BÚSQUEDA */}
      <div
        onClick={() => setSearchOpen(false)}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 animate-in fade-in duration-200"
      />
    </>
  );
}
