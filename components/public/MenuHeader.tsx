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
    <>
     <header className="bg-zinc-900 text-white sticky top-0 z-50 shadow-md">

  <div className="max-w-3xl mx-auto flex items-center justify-between p-4">

    {/* IZQUIERDA */}
    <div className="flex items-center gap-3">

      {/* 🍔 SOLO MOBILE */}
      <button
        onClick={() => setOpen(true)}
        className="flex flex-col gap-1 md:hidden"
      >
        <span className="w-6 h-[2px] bg-white"></span>
        <span className="w-6 h-[2px] bg-white"></span>
        <span className="w-6 h-[2px] bg-white"></span>
      </button>

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

    {/* 💻 DESKTOP MENU */}
    <nav className="hidden md:flex items-center gap-6 text-sm">

      {categorias.map((cat) => (
        <a
          key={cat.id}
          href={`#cat-${cat.id}`}
          className="text-zinc-300 hover:text-white transition"
        >
          {cat.nombre}
        </a>
      ))}

    </nav>

  </div>

</header>

      {/* 🌑 OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 z-40"
        />
      )}

      {/* 📱 DRAWER LATERAL */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-zinc-900 text-white z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >

        {/* HEADER DEL MENU */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">

          <h2 className="font-semibold">Categorías</h2>

          <button onClick={() => setOpen(false)}>
            ✕
          </button>

        </div>

        {/* LISTA */}
        <div className="py-2">

          {categorias.map((cat) => (
            <a
              key={cat.id}
              href={`#cat-${cat.id}`}
              onClick={() => setOpen(false)}
              className="block px-4 py-3 hover:bg-zinc-800 transition"
            >
              {cat.nombre}
            </a>
          ))}

        </div>

      </div>
    </>
  );
}