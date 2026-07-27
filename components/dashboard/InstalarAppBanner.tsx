'use client';

import { usePWA } from '@/hooks/usePWA';
import { InstallIOSModal } from './InstallIOSModal';

export function InstalarAppBanner() {
  const {
    canShowBanner,
    installApp,
    dismissBanner,
    showIOSModal,
    setShowIOSModal,
  } = usePWA();

  if (!canShowBanner) return null;

  return (
    <>
      <div className="w-full p-4 animate-in fade-in slide-in-from-top-4 duration-300">
        <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 shadow-sm sm:p-5">
          <button
            onClick={dismissBanner}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Cerrar"
          >
            ✕
          </button>

          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-xl text-white shadow-md">
              📲
            </div>

            <div className="flex-1 pr-4">
              <h4 className="font-bold text-gray-900">Instala CatalagoX</h4>
              <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                Instala la aplicación para acceder más rápido al panel y disfrutar de una mejor experiencia.
              </p>

              <button
                onClick={installApp}
                className="mt-3 inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all"
              >
                Instalar ahora
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal exclusivo para iOS */}
      <InstallIOSModal
        isOpen={showIOSModal}
        onClose={() => setShowIOSModal(false)}
      />
    </>
  );
}