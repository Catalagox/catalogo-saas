import { Layers } from "lucide-react";

export default function CategoryHeader() {
  return (
    <div className="bg-[var(--bg-card)] border-b border-[var(--border-card)] sticky top-0 z-20 backdrop-blur-md px-6 py-8 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-[var(--text-secondary)] text-xs font-bold uppercase tracking-widest mb-2">
          <Layers className="w-4 h-4 text-[var(--text-secondary)]" />
          <span>Categorías</span>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
          Gestión de Categorías
        </h1>

        <p className="text-[var(--text-secondary)] mt-2">
          Organiza tu menú creando categorías.
        </p>
      </div>
    </div>
  );
}
