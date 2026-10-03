"use client";

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
  const editando = editingId === categoria.id;
  const nombreVacio = nuevoNombre.trim().length === 0;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] p-4 text-[var(--text-primary)] sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        {editando ? (
          <input
            type="text"
            value={nuevoNombre}
            onChange={(event) => setNuevoNombre(event.target.value)}
            onKeyDown={(event) => {
              if (event.nativeEvent.isComposing) return;

              if (event.key === "Enter") {
                event.preventDefault();
                if (!nombreVacio) guardarEdicion();
              }

              if (event.key === "Escape") {
                event.preventDefault();
                cancelarEdicion();
              }
            }}
            aria-label={`Editar nombre de la categoría ${categoria.nombre}`}
            placeholder="Nombre de la categoría"
            autoFocus
            className="min-h-11 w-full rounded-xl border border-[var(--border-card)] bg-[var(--bg-secondary)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
          />
        ) : (
          <span className="block break-words text-sm font-semibold sm:text-base">
            {categoria.nombre}
          </span>
        )}
      </div>

      <div className="flex shrink-0 flex-wrap gap-2">
        {editando ? (
          <>
            <button
              type="button"
              onClick={guardarEdicion}
              disabled={nombreVacio}
              className="min-h-11 flex-1 rounded-xl bg-[var(--color-primary)] px-4 py-2 text-sm font-bold text-[var(--color-text-inverse)] transition-colors hover:bg-[var(--color-primary-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
            >
              Guardar
            </button>

            <button
              type="button"
              onClick={cancelarEdicion}
              className="min-h-11 flex-1 rounded-xl border border-[var(--border-card)] bg-[var(--bg-secondary)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-card-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] sm:flex-none"
            >
              Cancelar
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => iniciarEdicion(categoria)}
              aria-label={`Editar categoría ${categoria.nombre}`}
              className="min-h-11 flex-1 rounded-xl border border-[var(--border-card)] bg-[var(--bg-secondary)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:border-[var(--color-primary)] hover:bg-[var(--bg-card-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] sm:flex-none"
            >
              Editar
            </button>

            <button
              type="button"
              onClick={() => eliminarCategoria(categoria.id)}
              aria-label={`Eliminar categoría ${categoria.nombre}`}
              className="min-h-11 flex-1 rounded-xl border border-[var(--color-danger)] bg-[var(--bg-card)] px-4 py-2 text-sm font-semibold text-[var(--color-danger)] transition-colors hover:bg-[var(--bg-card-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-danger)] sm:flex-none"
            >
              Eliminar
            </button>
          </>
        )}
      </div>
    </div>
  );
}