import CategoryItem from "@/components/dashboard/categorias/CategoryItem";

type Categoria = {
  id: string;
  nombre: string;
};

type Props = {
  categorias: Categoria[];
  editingId: string | null;
  nuevoNombre: string;
  setNuevoNombre: (v: string) => void;
  iniciarEdicion: (c: Categoria) => void;
  guardarEdicion: () => void;
  cancelarEdicion: () => void;
  eliminarCategoria: (id: string) => void;
};

export default function CategoryList({
  categorias,
  editingId,
  nuevoNombre,
  setNuevoNombre,
  iniciarEdicion,
  guardarEdicion,
  cancelarEdicion,
  eliminarCategoria,
}: Props) {
  if (categorias.length === 0) {
    return (
      <p className="text-[var(--text-secondary)]">Aún no tienes categorías.</p>
    );
  }

  return (
    <div className="space-y-3">
      {categorias.map((cat) => (
        <CategoryItem
          key={cat.id}
          categoria={cat}
          editingId={editingId}
          nuevoNombre={nuevoNombre}
          setNuevoNombre={setNuevoNombre}
          iniciarEdicion={iniciarEdicion}
          guardarEdicion={guardarEdicion}
          cancelarEdicion={cancelarEdicion}
          eliminarCategoria={eliminarCategoria}
        />
      ))}
    </div>
  );
}
