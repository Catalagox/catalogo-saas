'use client';

interface InstallIOSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InstallIOSModal({ isOpen, onClose }: InstallIOSModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl transition-all">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Instalar CatalagoX</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        <p className="mt-3 text-sm text-gray-600">
          Para instalar la aplicación en tu iPhone, sigue estos sencillos pasos desde Safari:
        </p>

        <div className="mt-4 space-y-3 text-sm text-gray-700">
          <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-2.5">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
              1
            </span>
            <p>
              Pulsa el botón <strong>Compartir</strong> <span className="inline-block">⎋</span> en la barra inferior.
            </p>
          </div>

          <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-2.5">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
              2
            </span>
            <p>
              Desplázate hacia abajo y selecciona <strong>Añadir a pantalla de inicio</strong> ➕.
            </p>
          </div>

          <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-2.5">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
              3
            </span>
            <p>
              Toca <strong>Añadir</strong> en la esquina superior derecha.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-blue-600 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}