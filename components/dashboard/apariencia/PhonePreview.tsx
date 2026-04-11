"use client";

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

  // 🎨 TODOS LOS COLORES CONTROLABLES
  colorHeader: string;
  colorFooter: string;
  colorTexto: string;
  colorPrecio: string;
  colorHamburguesa: string;
  colorTarjeta: string;
  colorCategoria: string;
}

export default function PhonePreview({
  nombre,
  colorFondo,
  estiloMenu,
  logo,
  categorias,
  colorHeader,
  colorFooter,
  colorTexto,
  colorPrecio,
  colorHamburguesa,
  colorTarjeta,
  colorCategoria,
}: Props) {
  return (
    <div className="w-[300px] h-[600px] rounded-[40px] border-8 border-gray-800 shadow-2xl overflow-hidden flex flex-col">

      {/* 🔥 HEADER */}
      <div
        style={{ backgroundColor: colorHeader }}
        className="p-3 flex items-center justify-between"
      >
        {/* ☰ MENU */}
        <div style={{ color: colorHamburguesa }} className="text-xl">
          ☰
        </div>

        {/* LOGO + NOMBRE */}
        <div className="text-center flex-1">
          {logo && (
            <img src={logo} className="h-6 mx-auto mb-1" />
          )}
          <p style={{ color: colorTexto }} className="text-sm font-bold">
            {nombre}
          </p>
        </div>

        <div className="w-5" />
      </div>

      {/* BODY */}
      <div
        style={{ backgroundColor: colorFondo }}
        className="flex-1 overflow-y-auto p-3 space-y-4"
      >
        {categorias.map((cat) => (
          <div key={cat.id}>
            {/* 🏷️ CATEGORÍA */}
            <h2
              style={{ color: colorCategoria }}
              className="font-semibold mb-2"
            >
              {cat.nombre}
            </h2>

            {estiloMenu === "lista" ? (
              <div className="space-y-2">
                {cat.productos.map((p) => (
                  <div
                    key={p.id}
                    style={{ backgroundColor: colorTarjeta }}
                    className="p-2 rounded-lg flex gap-2"
                  >
                    {p.imagen_url && (
                      <img
                        src={p.imagen_url}
                        className="w-12 h-12 rounded object-cover"
                      />
                    )}

                    <div className="flex-1">
                      {/* NOMBRE */}
                      <p
                        style={{ color: colorTexto }}
                        className="text-sm font-semibold"
                      >
                        {p.nombre}
                      </p>

                      {/* DESCRIPCIÓN */}
                      {p.descripcion && (
                        <p
                          style={{ color: colorTexto }}
                          className="text-xs opacity-70"
                        >
                          {p.descripcion}
                        </p>
                      )}

                      {/* PRECIO */}
                      <p
                        style={{ color: colorPrecio }}
                        className="text-xs font-bold"
                      >
                        ${p.precio}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {cat.productos.map((p) => (
                  <div
                    key={p.id}
                    style={{ backgroundColor: colorTarjeta }}
                    className="p-2 rounded-lg text-center"
                  >
                    {p.imagen_url && (
                      <img
                        src={p.imagen_url}
                        className="w-full h-20 object-cover rounded mb-1"
                      />
                    )}

                    <p style={{ color: colorTexto }} className="text-xs">
                      {p.nombre}
                    </p>

                    <p
                      style={{ color: colorPrecio }}
                      className="text-xs font-bold"
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
        style={{ backgroundColor: colorFooter }}
        className="p-2 text-center text-xs"
      >
        <p style={{ color: colorTexto }}>
          © {nombre || "Mi Restaurante"}
        </p>
      </div>
    </div>
  );
}