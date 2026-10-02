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
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const aplicarTema = (preferencia: Tema) => {
      setTema(preferencia);

      const resultado =
        preferencia === "system"
          ? media.matches
            ? "dark"
            : "light"
          : preferencia;

      document
        .querySelectorAll<HTMLElement>(".dashboard-theme")
        .forEach((elemento) => {
          elemento.dataset.theme = resultado;
        });
    };

    const sincronizar = () => {
      let preferencia: Tema = "light";

      try {
        const guardado = localStorage.getItem(STORAGE_KEY);
        if (esTema(guardado)) preferencia = guardado;
      } catch {
        // El selector sigue funcionando si el almacenamiento no está disponible.
      }

      aplicarTema(preferencia);
    };

    const cambiar = (event: Event) => {
      const preferencia = (event as CustomEvent<unknown>).detail;
      if (esTema(preferencia)) aplicarTema(preferencia);
    };

    const cambiarSistema = () => {
      setTema((actual) => {
        if (actual === "system") aplicarTema(actual);
        return actual;
      });
    };

    sincronizar();

    window.addEventListener(EVENT_NAME, cambiar);
    window.addEventListener("storage", sincronizar);
    media.addEventListener("change", cambiarSistema);

    return () => {
      window.removeEventListener(EVENT_NAME, cambiar);
      window.removeEventListener("storage", sincronizar);
      media.removeEventListener("change", cambiarSistema);
    };
  }, []);

  const seleccionar = (nuevoTema: Tema) => {
    try {
      localStorage.setItem(STORAGE_KEY, nuevoTema);
    } catch {
      // La elección se aplica igualmente durante esta sesión.
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
          if (esTema(valor)) seleccionar(valor);
        }}
        className="w-full rounded-xl border border-[var(--border-card)] bg-[var(--bg-tertiary)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
      >
        <option value="light">Claro</option>
        <option value="dark">Oscuro</option>
        <option value="system">Sistema</option>
      </select>
    </label>
  );
}