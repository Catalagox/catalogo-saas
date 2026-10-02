"use client";

import { X, Share, Plus } from "lucide-react";

interface InstallIOSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InstallIOSModal({
  isOpen,
  onClose,
}: InstallIOSModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[var(--bg-overlay)] p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="instalar-ios-titulo"
        aria-describedby="instalar-ios-descripcion"
        className="max-h-[90dvh] w-full max-w-sm overflow-y-auto rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 text-[var(--text-primary)] shadow-2xl"
      >
        <div className="flex items-center justify-between gap-3 border-b border-[var(--border-card)] pb-3">
          <h3
            id="instalar-ios-titulo"
            className="text-lg font-bold text-[var(--text-primary)]"
          >
            Instalar CatalagoX
          </h3>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar instrucciones de instalación"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <p
          id="instalar-ios-descripcion"
          className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]"
        >
          Para instalar la aplicación en tu iPhone, sigue estos pasos
          desde Safari:
        </p>

        <ol className="mt-4 space-y-3 text-sm text-[var(--text-secondary)]">
          <li className="flex items-start gap-3 rounded-xl bg-[var(--bg-tertiary)] p-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
              1
            </span>

            <p className="leading-relaxed">
              Pulsa el botón{" "}
              <strong className="text-[var(--text-primary)]">
                Compartir
              </strong>{" "}
              <Share
                size={15}
                aria-hidden="true"
                className="inline-block align-text-bottom"
              />{" "}
              en la barra de Safari.
            </p>
          </li>

          <li className="flex items-start gap-3 rounded-xl bg-[var(--bg-tertiary)] p-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
              2
            </span>

            <p className="leading-relaxed">
              Desplázate hacia abajo y selecciona{" "}
              <strong className="text-[var(--text-primary)]">
                Añadir a pantalla de inicio
              </strong>{" "}
              <Plus
                size={15}
                aria-hidden="true"
                className="inline-block align-text-bottom"
              />.
            </p>
          </li>

          <li className="flex items-start gap-3 rounded-xl bg-[var(--bg-tertiary)] p-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
              3
            </span>

            <p className="leading-relaxed">
              Toca{" "}
              <strong className="text-[var(--text-primary)]">
                Añadir
              </strong>{" "}
              para completar la instalación.
            </p>
          </li>
        </ol>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-blue-600 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}