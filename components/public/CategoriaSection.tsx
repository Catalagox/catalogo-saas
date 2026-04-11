import ProductoCard from "@/components/public/ProductoCard";

type Categoria = {
  id: string;
  nombre: string;
  productos: any[];
};

interface Props {
  categoria: Categoria;

  // 🎨 NUEVOS
  colorCategoria: string;
  colorTexto: string;
  colorTarjeta: string;
  colorPrecio: string;
}

export default function CategoriaSection({
  categoria,
  colorCategoria,
  colorTexto,
  colorTarjeta,
  colorPrecio,
}: Props) {

  const productosValidos =
    (categoria.productos ?? []).filter(
      (p) => p && p.id && p.nombre
    );

  if (productosValidos.length === 0) return null;

  return (
    <section
      id={`cat-${categoria.id}`}
      className="scroll-mt-28 py-6"
    >

      {/* 🏷️ HEADER CATEGORÍA */}
      <div className="flex items-center gap-4 mb-6">

        <div
          className="flex items-center gap-3 px-4 py-2 rounded-full"
          style={{ backgroundColor: colorTarjeta }}
        >
          {/* 🔥 PUNTO */}
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: colorCategoria }}
          />

          {/* NOMBRE */}
          <h2
            className="text-lg font-bold uppercase"
            style={{ color: colorCategoria }}
          >
            {categoria.nombre}
          </h2>

          {/* CANTIDAD */}
          <span
            className="text-xs px-2 py-1 rounded-full"
            style={{
              backgroundColor: colorCategoria + "20",
              color: colorCategoria,
            }}
          >
            {productosValidos.length}
          </span>
        </div>

        <div className="flex-1 h-[1px]" style={{ backgroundColor: colorCategoria + "30" }} />

      </div>

      {/* 📦 PRODUCTOS */}
      <div className="grid grid-cols-1 gap-4">
        {productosValidos.map((producto) => (
          <ProductoCard
            key={producto.id}
            producto={producto}

            // 🎨 PASAMOS COLORES
            colorTexto={colorTexto}
            colorPrecio={colorPrecio}
            colorTarjeta={colorTarjeta}
          />
        ))}
      </div>
    </section>
  );
}