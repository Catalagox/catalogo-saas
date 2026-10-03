"use client";

import { useId } from "react";

interface Props {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

function obtenerColorNativo(value: string): string {
  const color = value.trim();

  if (/^#[0-9a-f]{6}([0-9a-f]{2})?$/i.test(color)) {
    return color.slice(0, 7);
  }

  if (/^#[0-9a-f]{3}([0-9a-f])?$/i.test(color)) {
    return (
      "#" +
      color
        .slice(1, 4)
        .split("")
        .map((letra) => letra + letra)
        .join("")
    );
  }

  const rgb = color.match(
    /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*[\d.]+)?\s*\)$/i,
  );

  if (rgb) {
    return (
      "#" +
      rgb
        .slice(1, 4)
        .map((canal) =>
          Math.min(255, Number(canal)).toString(16).padStart(2, "0"),
        )
        .join("")
    );
  }

  return "#ffffff";
}

function conservarTransparencia(nuevoHex: string, actual: string): string {
  const color = actual.trim();

  if (/^#[0-9a-f]{8}$/i.test(color)) {
    return nuevoHex + color.slice(7, 9);
  }

  if (/^#[0-9a-f]{4}$/i.test(color)) {
    return nuevoHex + color[4] + color[4];
  }

  const rgba = color.match(
    /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*([\d.]+)\s*\)$/i,
  );

  if (rgba) {
    const rojo = parseInt(nuevoHex.slice(1, 3), 16);
    const verde = parseInt(nuevoHex.slice(3, 5), 16);
    const azul = parseInt(nuevoHex.slice(5, 7), 16);
    const alpha = Math.max(0, Math.min(1, Number(rgba[1])));

    return `rgba(${rojo}, ${verde}, ${azul}, ${alpha})`;
  }

  if (color.toLowerCase() === "transparent") {
    return `${nuevoHex}00`;
  }

  return nuevoHex;
}

export default function ColorPicker({
  label,
  value,
  onChange,
}: Props) {
  const id = useId();
  const colorNativo = obtenerColorNativo(value || "");

  return (
    <div className="min-w-0 space-y-3 rounded-xl border border-[var(--border-card)] bg-[var(--bg-secondary)] p-4 transition-colors hover:border-[var(--color-primary)]">
      <label
        htmlFor={`${id}-texto`}
        className="block text-sm font-semibold text-[var(--text-primary)]"
      >
        {label}
      </label>

      <div className="flex min-w-0 items-center gap-3">
        <div
          className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-[var(--border-card)] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[var(--color-primary)]"
          style={{
            backgroundColor: "#ffffff",
            backgroundImage:
              "conic-gradient(#d1d5db 25%, #ffffff 0 50%, #d1d5db 0 75%, #ffffff 0)",
            backgroundSize: "12px 12px",
          }}
        >
          <span
            aria-hidden="true"
            className="absolute inset-0"
            style={{ backgroundColor: value || colorNativo }}
          />

          <input
            type="color"
            value={colorNativo}
            onChange={(event) =>
              onChange(
                conservarTransparencia(event.target.value, value || ""),
              )
            }
            aria-label={`Elegir ${label.toLowerCase()}`}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </div>

        <input
          id={`${id}-texto`}
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="#FFFFFF"
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          aria-describedby={`${id}-ayuda`}
          className="min-h-11 min-w-0 flex-1 rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] px-3 py-2 font-mono text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
        />
      </div>

      <p
        id={`${id}-ayuda`}
        className="text-xs leading-relaxed text-[var(--text-secondary)]"
      >
        Elige un color o escribe un valor HEX, RGB o RGBA.
      </p>
    </div>
  );
}