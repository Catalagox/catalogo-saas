"use client";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title = "No hay elementos aún",
  description = "Todavía no has agregado ningún catálogo. ¡Empieza creando uno ahora!",
  actionLabel = "+ Crear catálogo",
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4 bg-gray-900 rounded-2xl shadow-md">
      
      {/* ICON */}
      <svg
        className="w-20 h-20 mb-6 text-gray-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>

      {/* TEXT */}
      <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
      <p className="text-gray-400 mb-6 max-w-xs">{description}</p>

      {/* BUTTON */}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}