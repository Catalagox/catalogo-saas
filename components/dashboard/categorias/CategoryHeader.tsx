import { Layers } from "lucide-react";

export default function CategoryHeader() {
  return (
    <header className="border-b border-[var(--border-card)] bg-[var(--bg-card)] px-4 py-6 text-[var(--text-primary)] sm:px-6 md:px-10 md:py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">
          <Layers className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>Categorías</span>
        </div>

        <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">
          Gestión de categorías
        </h1>

        <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
          Organiza tu catálogo creando categorías.
        </p>
      </div>
    </header>
  );
}
