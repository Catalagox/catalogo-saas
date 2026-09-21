"use client";

import { countriesList } from "@/lib/countries";

interface SelectorPaisesProps {
  value: string;
  onChange: (codigo: string) => void;
  disabled?: boolean;
  required?: boolean;
  showPlaceholder?: boolean;
  className?: string;
}

export default function SelectorPaises({
  value,
  onChange,
  disabled = false,
  required = false,
  showPlaceholder = false,
  className = "",
}: SelectorPaisesProps) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      required={required}
      className={
        className ||
        `
          w-full
          rounded-lg
          border
          border-[var(--border-card)]
          bg-[var(--bg-tertiary)]
          p-3
          text-sm
          text-[var(--text-primary)]
          outline-none
          transition-colors
          focus:border-[var(--color-primary)]
          disabled:cursor-not-allowed
          disabled:opacity-60
        `
      }
    >
      {showPlaceholder && (
        <option value="">Selecciona tu país</option>
      )}

      {countriesList.map((country) => (
        <option key={country.code} value={country.code}>
          {country.name} ({country.symbol})
        </option>
      ))}
    </select>
  );
}