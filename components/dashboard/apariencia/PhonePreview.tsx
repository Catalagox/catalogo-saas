"use client";

import { Search } from "lucide-react";

interface Producto {
  id: string;
  nombre: string;
  precio: number;
  descripcion?: string;
  imagen_url: string | null;
}

interface Categoria {
  id: string;
  nombre: string;
  productos: Producto[];
}

interface Props {
  nombre: string;
  colorFondo: string;
  estiloMenu: "lista" | "galeria";
  logo?: string | null;
  categorias: Categoria[];

  // 🎨 COLORES
  colorHeader: string;
  colorTextHeader?: string;
  colorBorderHeader?: string;
  colorFooter: string;
  colorTexto: string;
  colorPrecio: string;
  colorHamburguesa: string;
  colorTarjeta: string;
  colorLupa: string;
  colorFondoCategoria: string;
  colorTextoCategoria: string;
  colorBorderCategoria: string;
}

export default function PhonePreview({
  nombre,
  colorFondo,
  estiloMenu,
  logo,
  categorias,
  colorHeader,
  colorTextHeader = "#ffffff",
  colorBorderHeader = "#ffffff10",
  colorFooter,
  colorTexto,
  colorPrecio,
  colorHamburguesa,
  colorTarjeta,
  colorLupa,
  colorFondoCategoria,
  colorTextoCategoria,
  colorBorderCategoria,
}: Props) {
  return (
    <div
      className="
        w-[320px]
        h-[650px]
        rounded-[42px]
        border-[10px]
        border-black
        shadow-2xl
        overflow-hidden
        flex
        flex-col
        bg-black
      "
    >
      {/* 🔥 TOP BAR IPHONE */}
      <div className="h-6 bg-black flex items-center justify-center">
        <div className="w-28 h-4 rounded-full bg-zinc-900" />
      </div>

      {/* 🔥 HEADER */}
      <div
        style={{ 
          backgroundColor: colorHeader,
          borderColor: colorBorderHeader
        }}
        className="
          px-4
          pt-3
          pb-4
          border-b
        "
      >
        {/* TOP */}
        <div className="flex items-center justify-between">
          {/* IZQUIERDA */}
          <div className="flex items-center gap-3">
            {/* ☰ */}
            <div style={{ color: colorHamburguesa }} className="text-xl">
              ☰
            </div>

            {/* LOGO */}
            <div className="flex items-center gap-2">
              {logo && (
                <img
                  src={logo}
                  className="
                    w-9
                    h-9
                    rounded-full
                    object-cover
                    border
                    border-white/20
                  "
                  alt="Logo"
                />
              )}

              <div>
                <p
                  style={{ color: colorTextHeader }}
                  className="
                    text-sm
                    font-bold
                    leading-none
                  "
                >
                  {nombre}
                </p>

                <p
                  className="
                    text-[10px]
                    opacity-70
                    mt-1
                  "
                  style={{
                    color: colorTextHeader,
                  }}
                >
                  Menú digital
                </p>
              </div>
            </div>
          </div>

          {/* 🔍 LUPA */}
          <button
            className="
              w-9
              h-9
              rounded-full
              flex
              items-center
              justify-center
              bg-white/10
              border
              border-white/10
              backdrop-blur-md
            "
          >
            <Search
              size={18}
              style={{
                color: colorLupa,
              }}
            />
          </button>
        </div>

        {/* 🔍 BUSCADOR */}
        <div className="mt-4">
          <div
            className="
              h-11
              rounded-2xl
              border
              flex
              items-center
              px-4
              text-xs
              backdrop-blur-md
            "
            style={{
              borderColor: `${colorLupa}25`,
              color: colorTextHeader,
              backgroundColor: "rgba(255,255,255,0.06)",
            }}
          >
            <Search size={14} className="mr-2 opacity-70" />
            <span className="opacity-70">Buscar productos...</span>
          </div>
        </div>

        {/* 🔥 CATEGORÍAS HORIZONTALES (Pestañas superiores) */}
        <div
          className="
            mt-4
            flex
            gap-2
            overflow-x-auto
            scrollbar-hide
            pb-1
          "
        >
          {categorias.map((cat, index) => (
            <div
              key={cat.id}
              className={`
                px-4
                py-2
                rounded-2xl
                text-xs
                font-bold
                whitespace-nowrap
                border
                shadow-sm
                flex-shrink-0
                ${index === 0 ? "" : "bg-white/5"}
              `}
              style={{
                backgroundColor:
                  index === 0
                    ? colorFondoCategoria
                    : "rgba(255,255,255,0.05)",
                borderColor: colorBorderCategoria,
                color: colorTextoCategoria,
              }}
            >
              {cat.nombre}
            </div>
          ))}
        </div>
      </div>

      {/* 🔥 BODY */}
      <div
        style={{ backgroundColor: colorFondo }}
        className="
          flex-1
          overflow-y-auto
          p-4
          space-y-6
        "
      >
        {categorias.map((cat) => (
          <div key={cat.id}>
            {/* 🏷️ HEADER CATEGORÍA (Encabezado dentro del menú body) */}
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: colorTextoCategoria,
                }}
              />

              <h2
                style={{
                  color: colorTextoCategoria,
                }}
                className="
                  font-bold
                  uppercase
                  tracking-wide
                  text-sm
                "
              >
                {cat.nombre}
              </h2>

              <div
                className="flex-1 h-[1px]"
                style={{
                  backgroundColor: colorBorderCategoria,
                }}
              />
            </div>

            {/* 🔥 LISTA */}
            {estiloMenu === "lista" ? (
              <div className="space-y-3">
                {cat.productos.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      backgroundColor: colorTarjeta,
                    }}
                    className="
                      p-3
                      rounded-2xl
                      flex
                      gap-3
                      border
                      border-white/5
                      backdrop-blur-md
                    "
                  >
                    {p.imagen_url && (
                      <img
                        src={p.imagen_url}
                        className="
                          w-16
                          h-16
                          rounded-xl
                          object-cover
                        "
                        alt={p.nombre}
                      />
                    )}

                    <div className="flex-1">
                      {/* NOMBRE */}
                      <p
                        style={{
                          color: colorTexto,
                        }}
                        className="
                          text-sm
                          font-bold
                        "
                      >
                        {p.nombre}
                      </p>

                      {/* DESC */}
                      {p.descripcion && (
                        <p
                          style={{
                            color: colorTexto,
                          }}
                          className="
                            text-xs
                            opacity-70
                            mt-1
                            line-clamp-2
                          "
                        >
                          {p.descripcion}
                        </p>
                      )}

                      {/* PRECIO */}
                      <p
                        style={{
                          color: colorPrecio,
                        }}
                        className="
                          text-sm
                          font-black
                          mt-2
                        "
                      >
                        ${p.precio}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* 🔥 GALERÍA */
              <div className="grid grid-cols-2 gap-3">
                {cat.productos.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      backgroundColor: colorTarjeta,
                    }}
                    className="
                      p-2
                      rounded-2xl
                      border
                      border-white/5
                      overflow-hidden
                    "
                  >
                    {p.imagen_url && (
                      <img
                        src={p.imagen_url}
                        className="
                          w-full
                          h-24
                          object-cover
                          rounded-xl
                          mb-2
                        "
                        alt={p.nombre}
                      />
                    )}

                    <p
                      style={{
                        color: colorTexto,
                      }}
                      className="
                        text-xs
                        font-semibold
                        line-clamp-1
                      "
                    >
                      {p.nombre}
                    </p>

                    <p
                      style={{
                        color: colorPrecio,
                      }}
                      className="
                        text-xs
                        font-black
                        mt-1
                      "
                    >
                      ${p.precio}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 🔥 FOOTER */}
      <div
        style={{
          backgroundColor: colorFooter,
        }}
        className="
          p-3
          text-center
          text-xs
          border-t
          border-white/10
        "
      >
        <p style={{ color: colorTexto }}>© {nombre || "Mi Catalógo"}</p>
      </div>
    </div>
  );
}