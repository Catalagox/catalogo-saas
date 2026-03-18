import ProductoCard from "@/components/public/ProductoCard";

type Categoria = {
  id: string;
  nombre: string;
  productos: any[];
};

export default function CategoriaSection({ categoria }: { categoria: Categoria }) {
  return (
    <section
      id={`cat-${categoria.id}`}
      className="scroll-mt-24"
    >
      {/* título categoría */}
      <div className="flex items-center gap-3 mb-5">
        <div className="h-[2px] flex-1 bg-zinc-200"></div>

        <h2 className="text-xl font-bold text-zinc-800 tracking-wide whitespace-nowrap">
          {categoria.nombre}
        </h2>

        <div className="h-[2px] flex-1 bg-zinc-200"></div>
      </div>

      {/* productos */}
      <div className="space-y-4">
        {categoria.productos?.length > 0 ? (
          categoria.productos.map((producto: any) => (
            <ProductoCard
              key={producto.id}
              producto={producto}
            />
          ))
        ) : (
          <div className="bg-white border border-zinc-200 rounded-xl p-4 text-center text-zinc-500 text-sm">
            No hay productos disponibles
          </div>
        )}
      </div>
    </section>
  );
}