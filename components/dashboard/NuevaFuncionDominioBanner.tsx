"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Globe2,
  Sparkles,
  X,
} from "lucide-react";

const STORAGE_KEY =
  "catalagox-novedad-dominios-v1";

export function NuevaFuncionDominioBanner() {
  const [visible, setVisible] =
    useState(false);

  useEffect(() => {
    /*
     * Si el usuario ya cerró este anuncio,
     * no volvemos a mostrarlo en este navegador.
     */
    const anuncioCerrado =
      window.localStorage.getItem(
        STORAGE_KEY,
      );

    if (!anuncioCerrado) {
      setVisible(true);
    }
  }, []);

  const cerrarAnuncio = () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      "cerrado",
    );

    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <section
      aria-labelledby="novedad-dominios-titulo"
      className="
        relative
        mb-6
        overflow-hidden
        rounded-2xl
        border
        border-emerald-500/25
        bg-[var(--bg-card)]
        p-5
        shadow-lg
        sm:p-6
      "
    >
      <button
        type="button"
        onClick={cerrarAnuncio}
        aria-label="Cerrar anuncio"
        title="Cerrar anuncio"
        className="
          absolute
          right-3
          top-3
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-full
          text-[var(--text-secondary)]
          transition
          hover:bg-[var(--bg-card-hover)]
          hover:text-[var(--text-primary)]
        "
      >
        <X
          size={18}
          aria-hidden="true"
        />
      </button>

      <div className="flex flex-col gap-5 pr-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div
            className="
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-emerald-500/15
              text-emerald-500
            "
          >
            <Globe2
              size={25}
              aria-hidden="true"
            />
          </div>

          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span
                className="
                  inline-flex
                  items-center
                  gap-1
                  rounded-full
                  bg-emerald-500/15
                  px-2.5
                  py-1
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-emerald-500
                "
              >
                <Sparkles
                  size={12}
                  aria-hidden="true"
                />
                Nueva función
              </span>
            </div>

            <h2
              id="novedad-dominios-titulo"
              className="text-lg font-bold text-[var(--text-primary)] sm:text-xl"
            >
              Conecta tu propio dominio
            </h2>

            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)]">
              Ahora puedes usar un dominio
              personalizado en tu tienda, como{" "}
              <span className="font-semibold text-[var(--text-primary)]">
                mitienda.com
              </span>
              , y ofrecer una experiencia más
              profesional a tus clientes.
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/ajustes/dominios"
          className="
            inline-flex
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-[var(--color-primary)]
            px-5
            py-3
            text-sm
            font-bold
            text-[var(--color-text-inverse)]
            transition
            hover:bg-[var(--color-primary-hover)]
            active:scale-[0.98]
          "
        >
          Conectar mi dominio
        </Link>
      </div>
    </section>
  );
}