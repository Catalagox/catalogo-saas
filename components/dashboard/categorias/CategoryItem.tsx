type Categoria = {
  id: string;
  nombre: string;
};

type Props = {
  categoria: Categoria;
  editingId: string | null;
  nuevoNombre: string;
  setNuevoNombre: (v: string) => void;
  iniciarEdicion: (c: Categoria) => void;
  guardarEdicion: () => void;
  cancelarEdicion: () => void;
  eliminarCategoria: (id: string) => void;
};

export default function CategoryItem({
  categoria,
  editingId,
  nuevoNombre,
  setNuevoNombre,
  iniciarEdicion,
  guardarEdicion,
  cancelarEdicion,
  eliminarCategoria,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-800 rounded-lg p-4 gap-3">

      {editingId === categoria.id ? (
        <input
          value={nuevoNombre}
          onChange={(e) => setNuevoNombre(e.target.value)}
          className="bg-gray-700 px-3 py-1 rounded w-full sm:w-auto"
        />
      ) : (
        <span className="font-medium">
          {categoria.nombre}
        </span>
      )}

      <div className="flex gap-2">

        {editingId === categoria.id ? (
          <>
            <button
              onClick={guardarEdicion}
              className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
            >
              Guardar
            </button>

            <button
              onClick={cancelarEdicion}
              className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded text-sm"
            >
              Cancelar
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => iniciarEdicion(categoria)}
              className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
            >
              Editar
            </button>

            <button
              onClick={() => eliminarCategoria(categoria.id)}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
            >
              Eliminar
            </button>
          </>
        )}

      </div>
    </div>
  );
}