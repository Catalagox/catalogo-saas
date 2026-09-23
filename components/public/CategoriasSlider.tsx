"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Categoria {
  id: string;
  nombre: string;
}

interface CategoriasSliderProps {
  categorias: Categoria[];
  onTrackCategoria?: (
    categoriaId: string,
  ) => void;

  colorFondoCategoria?: string;
  colorTextoCategoria?: string;
  colorBorderCategoria?: string;

  colorFondoCategoriaActiva?: string;
  colorTextoCategoriaActiva?: string;
  colorBorderCategoriaActiva?: string;

  colorHeader?: string;
  colorTextHeader?: string;
  colorBorderHeader?: string;
}

export default function CategoriasSlider({
  categorias,
  onTrackCategoria,
  colorFondoCategoria = "#ffffff",
  colorTextoCategoria = "#111827",
  colorBorderCategoria = "#e5e7eb",
  colorFondoCategoriaActiva,
  colorTextoCategoriaActiva,
  colorBorderCategoriaActiva,
  colorHeader = "var(--color-header)",
  colorTextHeader =
    "var(--color-text-header)",
  colorBorderHeader =
    "var(--color-border-header)",
}: CategoriasSliderProps) {
  const [
    categoriaActiva,
    setCategoriaActiva,
  ] = useState<string | null>(null);

  const [
    mostrarCategorias,
    setMostrarCategorias,
  ] = useState(true);

  const [
    paginaDesplazada,
    setPaginaDesplazada,
  ] = useState(false);

  const [
    puedeMoverIzquierda,
    setPuedeMoverIzquierda,
  ] = useState(false);

  const [
    puedeMoverDerecha,
    setPuedeMoverDerecha,
  ] = useState(false);

  const ultimaPosicionScroll = useRef(0);
  const mostrarCategoriasRef = useRef(true);
  const categoriaActivaRef =
    useRef<string | null>(null);

  const tocandoPantallaRef = useRef(false);
  const seleccionandoCategoriaRef =
    useRef(false);

  const sliderRef =
    useRef<HTMLDivElement | null>(null);

  const botonesRef = useRef<
    Map<string, HTMLButtonElement>
  >(new Map());

  const frameScrollRef =
    useRef<number | null>(null);

  const temporizadorClickRef =
    useRef<ReturnType<
      typeof setTimeout
    > | null>(null);

  const categoriasValidas = useMemo(() => {
    if (!Array.isArray(categorias)) {
      return [];
    }

    return categorias.filter(
      (categoria) =>
        Boolean(categoria) &&
        Boolean(categoria.id) &&
        Boolean(categoria.nombre?.trim()),
    );
  }, [categorias]);

  const obtenerComportamientoScroll =
    useCallback((): ScrollBehavior => {
      const reducirMovimiento =
        window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;

      return reducirMovimiento
        ? "auto"
        : "smooth";
    }, []);

  const actualizarEstadoFlechas =
    useCallback(() => {
      const slider = sliderRef.current;

      if (!slider) {
        setPuedeMoverIzquierda(false);
        setPuedeMoverDerecha(false);
        return;
      }

      const maximoScroll =
        slider.scrollWidth -
        slider.clientWidth;

      setPuedeMoverIzquierda(
        slider.scrollLeft > 4,
      );

      setPuedeMoverDerecha(
        slider.scrollLeft <
          maximoScroll - 4,
      );
    }, []);

  const moverSlider = useCallback(
    (direccion: "left" | "right") => {
      const slider = sliderRef.current;

      if (!slider) {
        return;
      }

      slider.scrollBy({
        left:
          direccion === "left"
            ? -340
            : 340,
        behavior:
          obtenerComportamientoScroll(),
      });
    },
    [obtenerComportamientoScroll],
  );

  const centrarCategoriaActiva =
    useCallback(
      (categoriaId: string) => {
        if (
          tocandoPantallaRef.current &&
          !seleccionandoCategoriaRef.current
        ) {
          return;
        }

        const botonActivo =
          botonesRef.current.get(categoriaId);

        const slider = sliderRef.current;

        if (!botonActivo || !slider) {
          return;
        }

        const destino =
          botonActivo.offsetLeft -
          slider.offsetWidth / 2 +
          botonActivo.offsetWidth / 2;

        slider.scrollTo({
          left: destino,
          behavior:
            obtenerComportamientoScroll(),
        });
      },
      [obtenerComportamientoScroll],
    );

  const cambiarCategoriaActiva =
    useCallback(
      (
        categoriaId: string,
        registrarVista = true,
      ) => {
        if (
          categoriaActivaRef.current ===
          categoriaId
        ) {
          return;
        }

        categoriaActivaRef.current =
          categoriaId;

        setCategoriaActiva(categoriaId);

        if (registrarVista) {
          onTrackCategoria?.(categoriaId);
        }

        centrarCategoriaActiva(
          categoriaId,
        );
      },
      [
        onTrackCategoria,
        centrarCategoriaActiva,
      ],
    );

  /*
   * Sincronizamos el estado con referencias para
   * utilizarlo dentro del listener de scroll sin
   * reinstalar el listener constantemente.
   */
  useEffect(() => {
    mostrarCategoriasRef.current =
      mostrarCategorias;
  }, [mostrarCategorias]);

  /*
   * Calcula cuándo mostrar las flechas.
   */
  useEffect(() => {
    actualizarEstadoFlechas();

    const manejarResize = () => {
      actualizarEstadoFlechas();
    };

    window.addEventListener(
      "resize",
      manejarResize,
    );

    let observador: ResizeObserver | null =
      null;

    if (
      typeof ResizeObserver !==
        "undefined" &&
      sliderRef.current
    ) {
      observador = new ResizeObserver(() => {
        actualizarEstadoFlechas();
      });

      observador.observe(sliderRef.current);
    }

    return () => {
      window.removeEventListener(
        "resize",
        manejarResize,
      );

      observador?.disconnect();
    };
  }, [
    categoriasValidas,
    actualizarEstadoFlechas,
  ]);

  /*
   * Detecta desplazamiento vertical y determina
   * qué categoría se encuentra visible.
   */
  useEffect(() => {
    const manejarScroll = () => {
      if (frameScrollRef.current !== null) {
        return;
      }

      frameScrollRef.current =
        window.requestAnimationFrame(() => {
          const posicionActual =
            window.scrollY;

          const bajando =
            posicionActual >
            ultimaPosicionScroll.current + 8;

          const subiendo =
            posicionActual <
            ultimaPosicionScroll.current - 8;

          setPaginaDesplazada(
            posicionActual > 10,
          );

          if (
            bajando &&
            posicionActual > 280
          ) {
            setMostrarCategorias(false);
          }

          if (
            subiendo ||
            posicionActual <= 120
          ) {
            setMostrarCategorias(true);
          }

          ultimaPosicionScroll.current =
            posicionActual;

          if (
            !seleccionandoCategoriaRef.current
          ) {
            const puntoDeteccion =
              mostrarCategoriasRef.current
                ? 160
                : 90;

            let categoriaVisible:
              | string
              | null = null;

            for (const categoria of categoriasValidas) {
              const elemento =
                document.getElementById(
                  `cat-${categoria.id}`,
                );

              if (!elemento) {
                continue;
              }

              const posicion =
                elemento.getBoundingClientRect();

              if (
                posicion.top <=
                  puntoDeteccion &&
                posicion.bottom >=
                  puntoDeteccion
              ) {
                categoriaVisible =
                  categoria.id;
                break;
              }
            }

            if (categoriaVisible) {
              cambiarCategoriaActiva(
                categoriaVisible,
              );
            }
          }

          frameScrollRef.current = null;
        });
    };

    manejarScroll();

    window.addEventListener(
      "scroll",
      manejarScroll,
      {
        passive: true,
      },
    );

    return () => {
      window.removeEventListener(
        "scroll",
        manejarScroll,
      );

      if (
        frameScrollRef.current !== null
      ) {
        window.cancelAnimationFrame(
          frameScrollRef.current,
        );

        frameScrollRef.current = null;
      }
    };
  }, [
    categoriasValidas,
    cambiarCategoriaActiva,
  ]);

  /*
   * Limpiamos cualquier temporizador pendiente
   * cuando el componente se desmonta.
   */
  useEffect(() => {
    return () => {
      if (temporizadorClickRef.current) {
        clearTimeout(
          temporizadorClickRef.current,
        );
      }
    };
  }, []);

  const seleccionarCategoria =
    useCallback(
      (categoriaId: string) => {
        seleccionandoCategoriaRef.current =
          true;

        categoriaActivaRef.current =
          categoriaId;

        setCategoriaActiva(categoriaId);

        onTrackCategoria?.(categoriaId);

        centrarCategoriaActiva(
          categoriaId,
        );

        const elemento =
          document.getElementById(
            `cat-${categoriaId}`,
          );

        if (elemento) {
          const desplazamiento =
            mostrarCategoriasRef.current
              ? -150
              : -90;

          const posicionDestino =
            elemento.getBoundingClientRect()
              .top +
            window.scrollY +
            desplazamiento;

          window.scrollTo({
            top: Math.max(
              0,
              posicionDestino,
            ),
            behavior:
              obtenerComportamientoScroll(),
          });
        }

        /*
         * Este temporizador se programa incluso si
         * no encontramos la sección. Así evitamos
         * que el bloqueo quede activo para siempre.
         */
        if (temporizadorClickRef.current) {
          clearTimeout(
            temporizadorClickRef.current,
          );
        }

        temporizadorClickRef.current =
          setTimeout(() => {
            seleccionandoCategoriaRef.current =
              false;

            temporizadorClickRef.current =
              null;
          }, 800);
      },
      [
        onTrackCategoria,
        centrarCategoriaActiva,
        obtenerComportamientoScroll,
      ],
    );

  if (categoriasValidas.length === 0) {
    return null;
  }

  const fondoContenedor =
    paginaDesplazada
      ? colorHeader
      : "var(--color-bg)";

  const bordeContenedor =
    paginaDesplazada
      ? colorBorderHeader
      : colorBorderCategoria;

  return (
    <nav
      aria-label="Categorías de la tienda"
      className={`
        sticky
        z-40
        w-full
        border-b
        transition-[transform,background-color,border-color]
        duration-500
        ease-[cubic-bezier(0.22,1,0.36,1)]
        ${
          mostrarCategorias
            ? "top-20 translate-y-0"
            : "pointer-events-none top-0 -translate-y-full md:top-20"
        }
      `}
      style={{
        backgroundColor: fondoContenedor,
        borderColor: bordeContenedor,
      }}
    >
      <div className="relative w-full px-0 sm:px-4 lg:px-6">
        {/* FLECHA IZQUIERDA */}
        <button
          type="button"
          onClick={() =>
            moverSlider("left")
          }
          disabled={!puedeMoverIzquierda}
          aria-label="Ver categorías anteriores"
          className="absolute left-3 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border outline-none transition active:scale-95 disabled:cursor-default disabled:opacity-30 md:flex"
          style={{
            backgroundColor:
              paginaDesplazada
                ? colorHeader
                : "var(--color-bg)",
            borderColor:
              paginaDesplazada
                ? colorBorderHeader
                : colorBorderCategoria,
            color: paginaDesplazada
              ? colorTextHeader
              : "var(--color-text)",
          }}
        >
          <ChevronLeft
            aria-hidden="true"
            className="h-5 w-5"
          />
        </button>

        {/* CATEGORÍAS */}
        <div
          ref={sliderRef}
          onScroll={
            actualizarEstadoFlechas
          }
          onTouchStart={() => {
            tocandoPantallaRef.current =
              true;
          }}
          onTouchEnd={() => {
            tocandoPantallaRef.current =
              false;
          }}
          className="flex scroll-smooth gap-1.5 overflow-x-auto whitespace-nowrap px-3 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-0 md:px-12"
          style={{
            WebkitOverflowScrolling:
              "touch",
            overscrollBehaviorX: "contain",
          }}
        >
          {categoriasValidas.map(
            (categoria) => {
              const activa =
                categoriaActiva ===
                categoria.id;

              const colorFondo =
                paginaDesplazada
                  ? activa
                    ? `color-mix(in srgb, ${colorHeader} 85%, ${colorTextHeader})`
                    : colorHeader
                  : activa
                    ? colorFondoCategoriaActiva ||
                      colorFondoCategoria
                    : colorFondoCategoria;

              const colorBorde =
                paginaDesplazada
                  ? colorBorderHeader
                  : activa
                    ? colorBorderCategoriaActiva ||
                      colorBorderCategoria
                    : colorBorderCategoria;

              const colorTexto =
                paginaDesplazada
                  ? colorTextHeader
                  : activa
                    ? colorTextoCategoriaActiva ||
                      colorTextoCategoria
                    : colorTextoCategoria;

              return (
                <button
                  key={categoria.id}
                  ref={(elemento) => {
                    if (elemento) {
                      botonesRef.current.set(
                        categoria.id,
                        elemento,
                      );
                    } else {
                      botonesRef.current.delete(
                        categoria.id,
                      );
                    }
                  }}
                  type="button"
                  title={categoria.nombre}
                  aria-current={
                    activa
                      ? "true"
                      : undefined
                  }
                  onClick={() =>
                    seleccionarCategoria(
                      categoria.id,
                    )
                  }
                  className={`
                    relative
                    max-w-[140px]
                    shrink-0
                    touch-manipulation
                    overflow-hidden
                    rounded-lg
                    border
                    px-3
                    py-1.5
                    text-xs
                    font-semibold
                    tracking-normal
                    outline-none
                    transition-all
                    duration-300
                    focus-visible:ring-2
                    focus-visible:ring-[var(--color-primary)]
                    sm:max-w-[200px]
                    sm:px-3.5
                    ${
                      activa
                        ? ""
                        : "active:bg-white/10 md:hover:bg-white/10"
                    }
                  `}
                  style={{
                    backgroundColor:
                      colorFondo,
                    borderColor:
                      colorBorde,
                    color: colorTexto,
                  }}
                >
                  <span className="block truncate">
                    {categoria.nombre}
                  </span>
                </button>
              );
            },
          )}
        </div>

        {/* FLECHA DERECHA */}
        <button
          type="button"
          onClick={() =>
            moverSlider("right")
          }
          disabled={!puedeMoverDerecha}
          aria-label="Ver categorías siguientes"
          className="absolute right-3 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border outline-none transition active:scale-95 disabled:cursor-default disabled:opacity-30 md:flex"
          style={{
            backgroundColor:
              paginaDesplazada
                ? colorHeader
                : "var(--color-bg)",
            borderColor:
              paginaDesplazada
                ? colorBorderHeader
                : colorBorderCategoria,
            color: paginaDesplazada
              ? colorTextHeader
              : "var(--color-text)",
          }}
        >
          <ChevronRight
            aria-hidden="true"
            className="h-5 w-5"
          />
        </button>
      </div>
    </nav>
  );
}