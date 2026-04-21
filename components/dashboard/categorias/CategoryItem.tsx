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
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-[var(--bg-tertiary)] border border-[var(--border-card)] rounded-lg p-4 gap-3">
      {editingId === categoria.id ? (
        <input
          value={nuevoNombre}
          onChange={(e) => setNuevoNombre(e.target.value)}
          className="bg-[var(--bg-card)] border border-[var(--border-card)] text-[var(--text-primary)] px-3 py-1 rounded w-full sm:w-auto outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        />
      ) : (
        <span className="font-medium text-[var(--text-primary)]">
          {categoria.nombre}
        </span>
      )}

      <div className="flex gap-2">
        {editingId === categoria.id ? (
          <>
            <button
              onClick={guardarEdicion}
              className="bg-[var(--color-success)] hover:opacity-90 text-[var(--color-text-inverse)] px-3 py-1 rounded text-sm transition"
            >
              Guardar
            </button>

            <button
              onClick={cancelarEdicion}
              className="bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)] px-3 py-1 rounded text-sm transition"
            >
              Cancelar
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => iniciarEdicion(categoria)}
              className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-text-inverse)] px-3 py-1 rounded text-sm transition"
            >
              Editar
            </button>

            <button
              onClick={() => eliminarCategoria(categoria.id)}
              className="bg-[var(--color-danger)] hover:opacity-90 text-[var(--color-text-inverse)] px-3 py-1 rounded text-sm transition"
            >
              Eliminar
            </button>
          </>
        )}
      </div>
    </div>
  );
}
