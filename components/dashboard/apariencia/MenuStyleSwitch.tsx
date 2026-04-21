"use client";

import { LayoutList, LayoutGrid } from "lucide-react";

interface MenuStyleSwitchProps {
  value: "lista" | "galeria";
  onChange: (value: "lista" | "galeria") => void;
}

export default function MenuStyleSwitch({
  value,
  onChange,
}: MenuStyleSwitchProps) {
  return (
    <div className="bg-[var(--bg-tertiary)] border border-[var(--border-card)] p-1 rounded-xl flex gap-1 w-fit">
      {/* LISTA */}
      <button
        onClick={() => onChange("lista")}
        className={`flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${
          value === "lista"
            ? "bg-[var(--bg-card)] text-[var(--text-primary)] shadow"
            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        }`}
      >
        <LayoutList className="w-4 h-4" />
        <span className="hidden sm:inline">Lista</span>
      </button>

      {/* GALERÍA */}
      <button
        onClick={() => onChange("galeria")}
        className={`flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${
          value === "galeria"
            ? "bg-[var(--bg-card)] text-[var(--text-primary)] shadow"
            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        }`}
      >
        <LayoutGrid className="w-4 h-4" />
        <span className="hidden sm:inline">Galería</span>
      </button>
    </div>
  );
}
