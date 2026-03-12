"use client";

import { useState } from "react";

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

  return (
    <header className="bg-zinc-900 text-white sticky top-0 z-50 shadow-md">

      <div className="max-w-3xl mx-auto flex items-center justify-between p-4">

        {/* Logo + nombre */}
        <div className="flex items-center gap-3">

          {catalogo.logo && (
            <img
              src={catalogo.logo}
              className="w-10 h-10 rounded-full object-cover"
            />
          )}

          <h1 className="text-lg font-semibold tracking-wide">
            {catalogo.nombre}
          </h1>

        </div>

        {/* botón hamburguesa */}
        <button
          onClick={() => setOpen(!open)}
          className="flex flex-col gap-1"
        >
          <span className="w-6 h-[2px] bg-white"></span>
          <span className="w-6 h-[2px] bg-white"></span>
          <span className="w-6 h-[2px] bg-white"></span>
        </button>

      </div>

      {/* menú desplegable */}
      {open && (
        <div className="bg-zinc-800 border-t border-zinc-700">

          <div className="max-w-3xl mx-auto py-3">

            {categorias.map((cat) => (
              <a
                key={cat.id}
                href={`#cat-${cat.id}`}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 hover:bg-zinc-700 transition"
              >
                {cat.nombre}
              </a>
            ))}

          </div>

        </div>
      )}

    </header>
  );
}