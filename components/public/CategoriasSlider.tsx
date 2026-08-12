"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Categoria {
  id: string;
  nombre: string;
}

interface CategoriasSliderProps {
  categorias: Categoria[];
  onTrackCategoria?: (categoriaId: string) => void;

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
  colorTextoCategoria = "#df0d1f",
  colorBorderCategoria = "#e5e7eb",
  colorFondoCategoriaActiva,
  colorTextoCategoriaActiva,
  colorBorderCategoriaActiva,
  colorHeader = "var(--color-header)",
  colorTextHeader = "var(--color-text-header)",
  colorBorderHeader = "var(--color-border-header)",
}: CategoriasSliderProps) {
  const [categoriaActiva, setCategoriaActiva] = useState<string | null>(null);
  const [showCategories, setShowCategories] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  const lastScrollY = useRef(0);
  const showCategoriesRef = useRef(true);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Sincronizar Ref para el listener de scroll sin forzar re-renders
  useEffect(() => {
    showCategoriesRef.current = showCategories;
  }, [showCategories]);

  // Mover el slider con las flechas
  const moverSlider = (direccion: "left" | "right") => {
    if (!sliderRef.current) return;
    sliderRef.current.scrollBy({
      left: direccion === "left" ? -340 : 340,
      behavior: "smooth",
    });
  };

  // Scroll automático en la barra horizontal para centrar el botón activo
  const autoScrollToActiveButton = useCallback((catId: string) => {
    const activeBtn = buttonRefs.current.get(catId);
    if (activeBtn && sliderRef.current) {
      activeBtn.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, []);

  // Control de scroll y detección de categoría activa
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY.current + 8;
      const scrollingUp = currentScrollY < lastScrollY.current - 8;

      setIsScrolled(currentScrollY > 10);

      if (scrollingDown && currentScrollY > 280) {
        setShowCategories(false);
      }

      if (scrollingUp || currentScrollY <= 120) {
        setShowCategories(true);
      }

      lastScrollY.current = currentScrollY;

      let current: string | null = null;

      for (const categoria of categorias) {
        const element = document.getElementById(`cat-${categoria.id}`);
        if (!element) continue;

        const rect = element.getBoundingClientRect();
        const offsetCheck = showCategoriesRef.current ? 160 : 90;

        if (rect.top <= offsetCheck && rect.bottom >= offsetCheck) {
          current = categoria.id;
          break;
        }
      }

      if (current && current !== categoriaActiva) {
        setCategoriaActiva(current);
        onTrackCategoria?.(current);
        autoScrollToActiveButton(current);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [categorias, categoriaActiva, onTrackCategoria, autoScrollToActiveButton]);

  if (categorias.length === 0) return null;

  const wrapperBackgroundColor = isScrolled ? colorHeader : "var(--color-bg)";
  const wrapperBorderColor = isScrolled
    ? colorBorderHeader
    : "rgba(255,255,255,0.1)";

  return (
    <div
      className={`sticky z-40 w-full border-b transition-[transform,background-color,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        showCategories
          ? "top-20 translate-y-0"
          : "top-0 md:top-20 -translate-y-full pointer-events-none"
      }`}
      style={{
        backgroundColor: wrapperBackgroundColor,
        borderColor: wrapperBorderColor,
      }}
    >
      <div className="relative w-full px-0 sm:px-4 lg:px-6">
        {/* FLECHA IZQUIERDA DESKTOP */}
        <button
          type="button"
          onClick={() => moverSlider("left")}
          aria-label="Mover categorias a la izquierda"
          className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 items-center justify-center rounded-full border transition active:scale-95"
          style={{
            backgroundColor: isScrolled ? colorHeader : "var(--color-bg)",
            borderColor: isScrolled
              ? colorBorderHeader
              : "rgba(255,255,255,0.1)",
            color: isScrolled ? colorTextHeader : "var(--color-text)",
            boxShadow: "none",
          }}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* CONTENEDOR SLIDER */}
        <div
          ref={sliderRef}
          className="overflow-x-auto whitespace-nowrap py-3 px-3 sm:px-0 flex gap-1.5 scroll-smooth md:px-12"
          style={{
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            overscrollBehaviorX: "contain",
          }}
        >
          {categorias.map((categoria) => {
            const isActive = categoriaActiva === categoria.id;

            const backgroundColor = isScrolled
              ? isActive
                ? `color-mix(in srgb, ${colorHeader} 85%, ${colorTextHeader})`
                : colorHeader
              : isActive
              ? colorFondoCategoriaActiva || colorFondoCategoria
              : colorFondoCategoria;

            const borderColor = isScrolled
              ? colorBorderHeader
              : isActive
              ? colorBorderCategoriaActiva || colorBorderCategoria
              : colorBorderCategoria;

            const textColor = isScrolled
              ? colorTextHeader
              : isActive
              ? colorTextoCategoriaActiva || colorTextoCategoria
              : colorTextoCategoria;

            return (
              <button
                key={categoria.id}
                ref={(el) => {
                  if (el) buttonRefs.current.set(categoria.id, el);
                  else buttonRefs.current.delete(categoria.id);
                }}
                type="button"
                title={categoria.nombre}
                onClick={() => {
                  setCategoriaActiva(categoria.id);
                  onTrackCategoria?.(categoria.id);
                  autoScrollToActiveButton(categoria.id);

                  const element = document.getElementById(
                    `cat-${categoria.id}`
                  );
                  if (!element) return;

                  const yOffset = showCategories ? -150 : -90;
                  const y =
                    element.getBoundingClientRect().top +
                    window.scrollY +
                    yOffset;

                  window.scrollTo({ top: y, behavior: "smooth" });
                }}
                className={`relative max-w-[140px] sm:max-w-[200px] px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-lg text-xs sm:text-xs font-semibold tracking-normal transition-all duration-300 border flex-shrink-0 outline-none touch-manipulation overflow-hidden ${
                  isActive ? "" : "md:hover:bg-white/10 active:bg-white/10"
                }`}
                style={{
                  backgroundColor,
                  borderColor,
                  color: textColor,
                  boxShadow: "none",
                }}
              >
                <span className="block truncate">{categoria.nombre}</span>
              </button>
            );
          })}
        </div>

        {/* FLECHA DERECHA DESKTOP */}
        <button
          type="button"
          onClick={() => moverSlider("right")}
          aria-label="Mover categorias a la derecha"
          className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 items-center justify-center rounded-full border transition active:scale-95"
          style={{
            backgroundColor: isScrolled ? colorHeader : "var(--color-bg)",
            borderColor: isScrolled
              ? colorBorderHeader
              : "rgba(255,255,255,0.1)",
            color: isScrolled ? colorTextHeader : "var(--color-text)",
            boxShadow: "none",
          }}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}