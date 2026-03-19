"use client";

import { useState, useEffect } from "react";

type Categoria = {
  id: string;
  nombre: string;
};

type Props = {
  catalogo: {
    nombre: string;
    logo?: string;
  };
  categorias: Categoria[];
};

export default function MenuHeader({ catalogo, categorias }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Un margen pequeño para activar el cambio
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header 
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled 
            ? "bg-zinc-950 shadow-xl py-3" // Fondo negro sólido al bajar para máxima visibilidad
            : "bg-zinc-900 py-5"
        } text-white`}
      >
        <div className="max-w-3xl mx-auto flex items-center justify-between px-5">
          
          <div className="flex items-center gap-4">
            {/* 🍔 BOTÓN HAMBURGUESA: Reforzado */}
            <button
              onClick={() => setOpen(true)}
              className="flex flex-col justify-center items-center w-8 h-8 md:hidden group"
              aria-label="Menu"
            >
              <span className="block w-6 h-0.5 bg-white mb-1.5 transition-all group-hover:bg-orange-400"></span>
              <span className="block w-6 h-0.5 bg-white mb-1.5 transition-all group-hover:bg-orange-400"></span>
              <span className="block w-6 h-0.5 bg-white transition-all group-hover:bg-orange-400"></span>
            </button>

            <div className="flex items-center gap-3">
              {catalogo.logo && (
                <img
                  src={catalogo.logo}
                  alt={catalogo.nombre}
                  className="w-9 h-9 rounded-full object-cover border border-zinc-700"
                />
              )}
              <h1 className="text-lg font-bold tracking-tight">
                {catalogo.nombre}
              </h1>
            </div>
          </div>

          {/* NAVEGACIÓN DESKTOP */}
          <nav className="hidden md:flex items-center gap-2">
            {categorias.slice(0, 5).map((cat) => (
              <a
                key={cat.id}
                href={`#cat-${cat.id}`}
                className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
              >
                {cat.nombre}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] transition-opacity"
        />
      )}

      {/* DRAWER LATERAL */}
      <aside
        className={`fixed top-0 left-0 h-full w-[280px] bg-zinc-950 text-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-zinc-900 flex items-center justify-between">
          <h2 className="text-xl font-bold">Menú</h2>
          <button 
            onClick={() => setOpen(false)}
            className="text-2xl hover:text-orange-500"
          >
            ✕
          </button>
        </div>

        <nav className="py-4">
          {categorias.map((cat) => (
            <a
              key={cat.id}
              href={`#cat-${cat.id}`}
              onClick={() => setOpen(false)}
              className="block px-6 py-4 text-lg border-b border-zinc-900/50 hover:bg-zinc-900 hover:text-orange-400 transition-all"
            >
              {cat.nombre}
            </a>
          ))}
        </nav>
      </aside>
    </>
  );
}