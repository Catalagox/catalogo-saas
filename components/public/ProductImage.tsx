"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface InteractiveProductImageProps {
  src: string;
  alt: string;
}

export default function InteractiveProductImage({ src, alt }: InteractiveProductImageProps) {
  const [isMaximized, setIsMaximized] = useState(false);

  const toggleMaximize = useCallback(() => {
    setIsMaximized((prev) => !prev);
  }, []);

  // 🔒 Bloquear el scroll de fondo cuando el modal esté abierto
  // ⌨️ Cerrar al presionar la tecla Escape
  useEffect(() => {
    if (!isMaximized) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMaximized(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMaximized]);

  return (
    <>
      <div 
        role="button"
        tabIndex={0}
        aria-label={`Ampliar imagen de ${alt}`}
        className="w-full h-full cursor-zoom-in relative outline-none touch-manipulation focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-lg overflow-hidden" 
        onClick={toggleMaximize}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleMaximize();
          }
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover opacity-90 transition-opacity md:hover:opacity-100"
        />
        
        <div className="absolute bottom-4 right-4 bg-black/50 p-2 rounded-full text-white/70 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
          </svg>
        </div>
      </div>

      {isMaximized && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-label={`Vista ampliada de ${alt}`}
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out animate-fade-in touch-manipulation"
          onClick={toggleMaximize}
        >
          <button 
            type="button"
            aria-label="Cerrar imagen ampliada"
            className="absolute top-6 right-6 text-white/70 md:hover:text-white active:text-white p-3 rounded-full bg-black/50 active:scale-95 transition-transform outline-none focus-visible:ring-2 focus-visible:ring-white z-10"
            onClick={(e) => {
              e.stopPropagation(); 
              toggleMaximize();
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="relative w-full h-full max-w-7xl max-h-[90vh]">
            <Image
              src={src}
              alt={alt}
              fill
              className="object-contain"
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
          </div>
        </div>
      )}
    </>
  );
}