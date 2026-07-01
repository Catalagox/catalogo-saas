"use client";

import { useState } from "react";
import Image from "next/image";

interface InteractiveProductImageProps {
  src: string;
  alt: string;
}

export default function InteractiveProductImage({ src, alt }: InteractiveProductImageProps) {
  const [isMaximized, setIsMaximized] = useState(false);

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  return (
    <>
      {/* Imagen normal (Hero) */}
      <div 
        className="w-full h-full cursor-zoom-in relative outline-none touch-manipulation" 
        onClick={toggleMaximize}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority
         
          className="object-cover opacity-90 transition-opacity md:hover:opacity-100"
        />
       
        <div className="absolute bottom-4 right-4 bg-black/50 p-2 rounded-full text-white/70 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
            </svg>
        </div>
      </div>

      {/* Imagen Maximizada (Overlay) */}
      {isMaximized && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out animate-fade-in touch-manipulation"
          onClick={toggleMaximize}
        >
          
          <button 
           
            className="absolute top-6 right-6 text-white/70 md:hover:text-white active:text-white p-3 rounded-full bg-black/50 active:scale-95 transition-transform outline-none"
            onClick={(e) => {
                e.stopPropagation(); // Evita que el clic en el botón cierre también por el div padre
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
              className="object-contain" // "contain" asegura que se vea completa sin recortar
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
          </div>
        </div>
      )}
    </>
  );
}