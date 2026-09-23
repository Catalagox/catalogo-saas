"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import Image from "next/image";
import { Search } from "lucide-react";

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

interface HeaderSearchProps {
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  categorias: Categoria[];
}

interface ResultadoBusqueda {
  tipo: "categoria" | "producto";
  nombre: string;
  idDestino: string;
  imagen_url?: string | null;
}

function normalizarTexto(valor: string): string {
  return valor
    .trim()
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export default function BuscadorTienda({
  searchOpen: buscadorAbierto,
  setSearchOpen: cambiarBuscadorAbierto,
  categorias,
}: HeaderSearchProps) {
  const [busqueda, setBusqueda] =
    useState("");

  const inputRef =
    useRef<HTMLInputElement>(null);

  const cerrarBuscador = useCallback(() => {
    cambiarBuscadorAbierto(false);
    setBusqueda("");
  }, [cambiarBuscadorAbierto]);

  /*
   * Bloqueamos el scroll y permitimos cerrar
   * el buscador con la tecla Escape.
   */
  useEffect(() => {
    if (!buscadorAbierto) {
      return;
    }

    const overflowAnterior =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const enfocarInput =
      window.requestAnimationFrame(() => {
        inputRef.current?.focus();
      });

    const manejarTeclado = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        cerrarBuscador();
      }
    };

    window.addEventListener(
      "keydown",
      manejarTeclado,
    );

    return () => {
      window.cancelAnimationFrame(
        enfocarInput,
      );

      document.body.style.overflow =
        overflowAnterior;

      window.removeEventListener(
        "keydown",
        manejarTeclado,
      );
    };
  }, [buscadorAbierto, cerrarBuscador]);

  const resultados = useMemo<
    ResultadoBusqueda[]
  >(() => {
    const textoBuscado =
      normalizarTexto(busqueda);

    if (!textoBuscado) {
      return [];
    }

    const encontrados: ResultadoBusqueda[] =
      [];

    const categoriasSeguras = Array.isArray(
      categorias,
    )
      ? categorias
      : [];

    for (const categoria of categoriasSeguras) {
      if (
        !categoria ||
        !categoria.id ||
        !categoria.nombre?.trim()
      ) {
        continue;
      }

      const nombreCategoria =
        normalizarTexto(categoria.nombre);

      if (
        nombreCategoria.includes(textoBuscado)
      ) {
        encontrados.push({
          tipo: "categoria",
          nombre: categoria.nombre,
          idDestino: `cat-${categoria.id}`,
        });
      }

      const productos = Array.isArray(
        categoria.productos,
      )
        ? categoria.productos
        : [];

      for (const producto of productos) {
        if (
          !producto ||
          !producto.id ||
          !producto.nombre?.trim()
        ) {
          continue;
        }

        const nombreProducto =
          normalizarTexto(producto.nombre);

        if (
          nombreProducto.includes(
            textoBuscado,
          )
        ) {
          encontrados.push({
            tipo: "producto",
            nombre: producto.nombre,
            idDestino: `prod-${producto.id}`,
            imagen_url:
              producto.imagen_url,
          });
        }
      }
    }

    return encontrados.slice(0, 12);
  }, [busqueda, categorias]);

  const irAResultado = useCallback(
    (idDestino: string) => {
      const elemento =
        document.getElementById(idDestino);

      cerrarBuscador();

      /*
       * Esperamos a que se cierre el panel antes
       * de realizar el desplazamiento.
       */
      window.requestAnimationFrame(() => {
        if (!elemento) {
          return;
        }

        elemento.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    },
    [cerrarBuscador],
  );

  const enviarBusqueda = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const primerResultado =
      resultados[0];

    if (primerResultado) {
      irAResultado(
        primerResultado.idDestino,
      );
    }
  };

  if (!buscadorAbierto) {
    return null;
  }

  const mostrarResultados =
    Boolean(busqueda.trim());

  return (
    <>
      {/* OVERLAY DEL BUSCADOR */}
      <button
        type="button"
        aria-label="Cerrar búsqueda"
        onClick={cerrarBuscador}
        className="fixed inset-0 z-40 cursor-default bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      />

      {/* PANEL DE BÚSQUEDA */}
      <div className="relative z-50 mx-auto max-w-3xl animate-in px-4 pb-4 fade-in slide-in-from-top-2 duration-200">
        <div className="relative">
          <form
            role="search"
            onSubmit={enviarBusqueda}
            className="flex items-center gap-3 rounded-2xl border border-[var(--color-border-header,rgba(255,255,255,0.1))] bg-[var(--color-header)] px-4 py-3.5 shadow-xl"
          >
            <Search
              size={18}
              aria-hidden="true"
              className="shrink-0 opacity-70"
            />

            <label
              htmlFor="buscador-tienda"
              className="sr-only"
            >
              Buscar productos o categorías
            </label>

            <input
              ref={inputRef}
              id="buscador-tienda"
              type="search"
              value={busqueda}
              onChange={(event) =>
                setBusqueda(event.target.value)
              }
              placeholder="Buscar productos o categorías..."
              autoComplete="off"
              spellCheck={false}
              aria-controls="resultados-buscador-tienda"
              aria-expanded={
                mostrarResultados
              }
              className="w-full bg-transparent text-base text-current outline-none placeholder:text-current placeholder:opacity-60"
            />
          </form>

          {/* RESULTADOS */}
          {mostrarResultados && (
            <div
              id="resultados-buscador-tienda"
              role="listbox"
              aria-label="Resultados de búsqueda"
              className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[calc(100vh-160px)] overflow-y-auto rounded-2xl border border-[var(--color-border-header,rgba(255,255,255,0.1))] bg-[var(--color-header)] shadow-2xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {resultados.length > 0 ? (
                resultados.map(
                  (resultado) => (
                    <button
                      key={`${resultado.tipo}-${resultado.idDestino}`}
                      type="button"
                      role="option"
                      aria-selected="false"
                      onClick={() =>
                        irAResultado(
                          resultado.idDestino,
                        )
                      }
                      className="flex w-full items-center gap-3 border-b border-white/5 px-5 py-3.5 text-left outline-none transition-colors last:border-b-0 hover:bg-white/10 focus-visible:bg-white/10"
                    >
                      {resultado.tipo ===
                        "producto" &&
                        (resultado.imagen_url ? (
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-white/10">
                            <Image
                              src={
                                resultado.imagen_url
                              }
                              alt=""
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[10px] opacity-60">
                            Sin imagen
                          </div>
                        ))}

                      <span className="min-w-0 flex-1 truncate text-sm font-medium">
                        {resultado.nombre}
                      </span>

                      <span className="shrink-0 rounded border border-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest opacity-60">
                        {resultado.tipo}
                      </span>
                    </button>
                  ),
                )
              ) : (
                <div
                  role="status"
                  className="px-5 py-6 text-center text-sm opacity-80"
                >
                  No encontramos resultados para{" "}
                  <span className="font-semibold">
                    “{busqueda.trim()}”
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}