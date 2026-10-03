"use client";

import { Layers } from "lucide-react";
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
      <div className="rounded-2xl border border-dashed border-[var(--border-card)] bg-[var(--bg-card)] px-5 py-10 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--bg-secondary)] text-[var(--text-secondary)]">
          <Layers size={24} aria-hidden="true" />
        </div>

        <p className="font-semibold text-[var(--text-primary)]">
          Aún no tienes categorías
        </p>

        <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
          Crea tu primera categoría para organizar los productos de tu tienda.
        </p>
      </div>
    );
  }

  return (
    <ul aria-label="Categorías de la tienda" className="space-y-3">
      {categorias.map((categoria) => (
        <li key={categoria.id}>
          <CategoryItem
            categoria={categoria}
            editingId={editingId}
            nuevoNombre={nuevoNombre}
            setNuevoNombre={setNuevoNombre}
            iniciarEdicion={iniciarEdicion}
            guardarEdicion={guardarEdicion}
            cancelarEdicion={cancelarEdicion}
            eliminarCategoria={eliminarCategoria}
          />
        </li>
      ))}
    </ul>
  );
}