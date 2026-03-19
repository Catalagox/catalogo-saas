import ProductoCard from "@/components/public/ProductoCard";

type Categoria = {
  id: string;
  nombre: string;
  productos: any[];
};

export default function CategoriaSection({ categoria }: { categoria: Categoria }) {

  // 🧠 limpiamos productos inválidos (mantenemos tu lógica)
  const productosValidos =
    (categoria.productos ?? []).filter(
      (p) => p && p.id && p.nombre
    );

  // Si no hay productos válidos, podríamos incluso no renderizar la sección entera
  // pero mantendremos tu placeholder por si acaso.
  if (productosValidos.length === 0) return null; // Opción A: No mostrar la sección si está vacía.

  return (
    <section
      id={`cat-${categoria.id}`}
      // Aumentamos scroll-mt para que el header no tape el título al hacer clic en el menú
      className="scroll-mt-28 py-6" 
    >
      {/* 🏷️ TÍTULO DE CATEGORÍA MEJORADO */}
      <div className="flex items-center gap-4 mb-8 sticky top-[70px] z-30 -mx-4 px-4 py-2 bg-gray-50/90 backdrop-blur-sm">
        <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-full shadow-sm border border-zinc-100">
          
          {/* Un ícono sutil que combine (opcional, pero recomendado) */}
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse"></span>
          
          <h2 className="text-xl md:text-2xl font-extrabold text-zinc-900 tracking-tighter uppercase whitespace-nowrap">
            {categoria.nombre}
          </h2>

          <span className="text-sm font-bold text-zinc-400 bg-zinc-100 px-3 py-1 rounded-full ml-1">
            {productosValidos.length}
          </span>
        </div>

        {/* Línea decorativa que se extiende hacia la derecha */}
        <div className="h-[2px] flex-1 bg-gradient-to-r from-zinc-200 to-transparent"></div>
      </div>

      {/* 📱 PRODUCTOS (Ajustamos el espaciado y layout responsive) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 md:gap-8 lg:gap-6">
        {productosValidos.map((producto) => (
          <ProductoCard
            key={producto.id}
            producto={producto}
          />
        ))}
      </div>
    </section>
  );
}