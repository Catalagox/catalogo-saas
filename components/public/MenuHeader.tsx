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

export default function MenuHeader({
  catalogo,
  categorias,
}: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* HEADER */}
      <header
        className="sticky top-0 z-50 transition-all duration-300 bg-[var(--color-header)]"
        style={{
          boxShadow: scrolled ? "0 8px 20px rgba(0,0,0,0.3)" : "none",
        }}
      >
        <div className="max-w-3xl mx-auto flex items-center justify-between px-5 py-4">

          {/* IZQUIERDA */}
          <div className="flex items-center gap-4">

            {/* 🍔 HAMBURGUESA */}
            <button
              onClick={() => setOpen(true)}
              className="flex flex-col justify-center items-center w-8 h-8 md:hidden"
            >
              <span className="block w-6 h-[2px] mb-1.5 bg-[var(--color-hamburguesa)]" />
              <span className="block w-6 h-[2px] mb-1.5 bg-[var(--color-hamburguesa)]" />
              <span className="block w-6 h-[2px] bg-[var(--color-hamburguesa)]" />
            </button>

            {/* LOGO + NOMBRE */}
            <div className="flex items-center gap-3">
              {catalogo.logo && (
                <img
                  src={catalogo.logo}
                  alt={catalogo.nombre}
                  className="w-9 h-9 rounded-full object-cover"
                />
              )}
              <h1 className="text-lg font-bold text-[var(--color-text)]">
                {catalogo.nombre}
              </h1>
            </div>
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-3">
            {categorias.slice(0, 5).map((cat) => (
              <a
                key={cat.id}
                href={`#cat-${cat.id}`}
                className="text-xs font-semibold uppercase tracking-wider transition text-[var(--color-categoria)]"
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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
        />
      )}

      {/* DRAWER */}
      <aside
        className={`fixed top-0 left-0 h-full w-[280px] z-[70] transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } bg-[var(--color-header)]`}
      >
        {/* HEADER DRAWER */}
        <div className="p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[var(--color-text)]">
            Menú
          </h2>

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
              className="block px-6 py-4 text-lg border-b border-white/10 transition text-[var(--color-categoria)]"
            >
              {cat.nombre}
            </a>
          ))}
        </nav>
      </aside>
    </>
  );
}