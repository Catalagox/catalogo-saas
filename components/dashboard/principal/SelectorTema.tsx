"use client";

import { useEffect, useState } from "react";

type Tema = "light" | "dark" | "system";

const STORAGE_KEY = "catalogox-dashboard-theme";
const EVENT_NAME = "catalogox-dashboard-theme-change";

function esTema(value: unknown): value is Tema {
  return value === "light" || value === "dark" || value === "system";
}

export default function SelectorTema() {
  const [tema, setTema] = useState<Tema>("light");

  useEffect(() => {
    const leerPreferencia = () => {
      try {
        const guardado = localStorage.getItem(STORAGE_KEY);
        setTema(esTema(guardado) ? guardado : "light");
      } catch {
        setTema("light");
      }
    };

    const sincronizarEvento = (event: Event) => {
      const valor = (event as CustomEvent<unknown>).detail;

      if (esTema(valor)) {
        setTema(valor);
      }
    };

    const sincronizarAlmacenamiento = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY || event.key === null) {
        leerPreferencia();
      }
    };

    leerPreferencia();

    window.addEventListener(EVENT_NAME, sincronizarEvento);
    window.addEventListener("storage", sincronizarAlmacenamiento);

    return () => {
      window.removeEventListener(EVENT_NAME, sincronizarEvento);
      window.removeEventListener(
        "storage",
        sincronizarAlmacenamiento,
      );
    };
  }, []);

  const seleccionar = (nuevoTema: Tema) => {
    setTema(nuevoTema);

    try {
      localStorage.setItem(STORAGE_KEY, nuevoTema);
    } catch {
      // Se aplica durante esta sesión aunque no se pueda guardar.
    }

    window.dispatchEvent(
      new CustomEvent(EVENT_NAME, { detail: nuevoTema }),
    );
  };

  return (
    <label className="mb-4 block">
      <span className="mb-2 block text-xs font-medium text-[var(--text-secondary)]">
        Tema del dashboard
      </span>

      <select
        value={tema}
        onChange={(event) => {
          const valor = event.target.value;

          if (esTema(valor)) {
            seleccionar(valor);
          }
        }}
        className="w-full cursor-pointer rounded-xl border border-[var(--border-card)] bg-[var(--bg-tertiary)] px-3 py-2.5 text-sm text-[var(--text-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
      >
        <option value="light">Claro</option>
        <option value="dark">Oscuro</option>
        <option value="system">Sistema</option>
      </select>
    </label>
  );
}