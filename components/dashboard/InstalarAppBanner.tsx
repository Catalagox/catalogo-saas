"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { usePWA } from "@/hooks/usePWA";
import { InstallIOSModal } from "./InstallIOSModal";

const BANNER_SHOWN_KEY = "catalagox-install-banner-shown";

export function InstalarAppBanner() {
  const {
    canShowBanner,
    installApp,
    dismissBanner,
    showIOSModal,
    setShowIOSModal,
  } = usePWA();

  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (!canShowBanner) return;

    try {
      if (localStorage.getItem(BANNER_SHOWN_KEY) === "true") return;

      localStorage.setItem(BANNER_SHOWN_KEY, "true");
    } catch {
      // Se muestra igualmente si el almacenamiento no está disponible.
    }

    setShowBanner(true);
  }, [canShowBanner]);

  const handleClose = () => {
    setShowBanner(false);
    dismissBanner();
  };

  const handleInstall = () => {
    setShowBanner(false);
    void installApp();
  };

  return (
    <>
      {showBanner && (
        <section
          aria-labelledby="instalar-app-titulo"
          className="mb-6 w-full animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <div className="relative overflow-hidden rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-4 shadow-[var(--shadow-card)] sm:p-5">
            <button
              type="button"
              onClick={handleClose}
              aria-label="Cerrar anuncio de instalación"
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
            >
              <X size={18} aria-hidden="true" />
            </button>

            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                <Download size={22} aria-hidden="true" />
              </div>

              <div className="min-w-0 flex-1 pr-7">
                <h4
                  id="instalar-app-titulo"
                  className="font-bold text-[var(--text-primary)]"
                >
                  Instala CatalagoX
                </h4>

                <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                  Instala la aplicación para acceder más rápido al panel
                  y disfrutar de una mejor experiencia.
                </p>

                <button
                  type="button"
                  onClick={handleInstall}
                  className="mt-3 inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 active:scale-95"
                >
                  Instalar ahora
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      <InstallIOSModal
        isOpen={showIOSModal}
        onClose={() => setShowIOSModal(false)}
      />
    </>
  );
}