"use client";

interface FormNombreMenuProps {
  nombreMenu: string;
  setNombreMenu: (val: string) => void;
  generarSlug: (texto: string) => string;
  guardarNombreMenu: () => Promise<void>;
}

export default function FormNombreMenu({
  nombreMenu,
  setNombreMenu,
  generarSlug,
  guardarNombreMenu,
}: FormNombreMenuProps) {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-6 space-y-4">
      <h2 className="text-xl font-semibold text-[var(--text-primary)]">
        Nombre del restaurante
      </h2>

      <input
        value={nombreMenu}
        onChange={(e) => setNombreMenu(e.target.value)}
        placeholder="Ej: Burger House"
        className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-card)] text-[var(--text-primary)] rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-[var(--color-primary)] placeholder:text-[var(--text-secondary)]"
      />

      <div className="space-y-1">
        <p className="text-sm text-[var(--text-secondary)]">
          URL de tu catálogo
        </p>
        <div className="bg-[var(--bg-tertiary)] border border-[var(--border-card)] rounded-lg p-3 text-sm break-all text-[var(--text-primary)]">
          catalagox.com/{generarSlug(nombreMenu)}
        </div>
      </div>

      <button
        onClick={guardarNombreMenu}
        className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-text-inverse)] px-5 py-2 rounded-lg font-semibold transition"
      >
        Guardar cambios
      </button>
    </div>
  );
}