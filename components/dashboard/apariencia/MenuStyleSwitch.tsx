"use client";

import { LayoutList, LayoutGrid } from "lucide-react";

interface MenuStyleSwitchProps {
  value: "lista" | "galeria";
  onChange: (value: "lista" | "galeria") => void;
}

const opciones = [
  {
    value: "lista",
    label: "Lista",
    icon: LayoutList,
  },
  {
    value: "galeria",
    label: "Galería",
    icon: LayoutGrid,
  },
] as const;

export default function MenuStyleSwitch({
  value,
  onChange,
}: MenuStyleSwitchProps) {
  return (
    <div
      role="group"
      aria-label="Estilo del catálogo"
      className="flex w-full gap-1 rounded-xl border border-[var(--border-card)] bg-[var(--bg-secondary)] p-1 sm:w-fit"
    >
      {opciones.map((opcion) => {
        const seleccionado = value === opcion.value;
        const Icon = opcion.icon;

        return (
          <button
            key={opcion.value}
            type="button"
            aria-pressed={seleccionado}
            onClick={() => onChange(opcion.value)}
            className={`inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] sm:flex-none sm:px-4 ${
              seleccionado
                ? "border-[var(--color-primary)] bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm"
                : "border-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Icon size={18} className="shrink-0" aria-hidden="true" />
            <span>{opcion.label}</span>
          </button>
        );
      })}
    </div>
  );
}