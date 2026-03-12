type Producto = {
  id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  imagen_url?: string;
  disponible?: boolean;
};

export default function ProductoCard({ producto }: { producto: Producto }) {

  const precio = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(producto.precio);

  return (
    <div className="flex gap-4 bg-white border border-zinc-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200">

      {/* info */}
      <div className="flex-1 flex flex-col justify-between">

        <div>

          <h3 className="text-base font-semibold text-zinc-900 leading-tight">
            {producto.nombre}
          </h3>

          {producto.descripcion && (
            <p className="text-sm text-zinc-600 mt-1 line-clamp-2">
              {producto.descripcion}
            </p>
          )}

        </div>

        <div className="flex items-center justify-between mt-3">

          <p className="text-lg font-bold text-zinc-900">
            {precio}
          </p>

          {!producto.disponible && (
            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-md">
              No disponible
            </span>
          )}

        </div>

      </div>

      {/* imagen */}
      {producto.imagen_url && (
        <div className="w-24 h-24 flex-shrink-0">

          <img
            src={producto.imagen_url}
            alt={producto.nombre}
            className="w-full h-full object-cover rounded-lg"
          />

        </div>
      )}

    </div>
  );
}