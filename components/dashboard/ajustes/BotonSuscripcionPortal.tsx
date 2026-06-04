"use client";

import { useState } from "react";
import { CreditCard } from "lucide-react";

export default function BotonSuscripcionPortal() {
  const [loading, setLoading] = useState(false);

  const handleOpenPortal = async () => {
    try {
      setLoading(true);

      // Llamamos a nuestra API limpia (Next.js envía las cookies automáticamente)
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al conectar con Stripe");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Ocurrió un error inesperado al abrir el portal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-2">
      <button
        onClick={handleOpenPortal}
        disabled={loading}
        className="
          inline-flex 
          items-center 
          gap-2 
          bg-gray-800 
          hover:bg-gray-700 
          border 
          border-gray-700 
          text-gray-200 
          px-5 
          py-2.5 
          rounded-lg 
          font-semibold 
          text-sm 
          transition 
          duration-200 
          hover:scale-[1.01]
          disabled:opacity-50
          disabled:cursor-not-allowed
          disabled:hover:scale-100
        "
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Conectando con Stripe...
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4 text-gray-400" />
            Gestionar o cancelar suscripción
          </>
        )}
      </button>
      <p className="text-xs text-[var(--text-secondary)] mt-1.5">
        Haz clic para ver tus facturas, cambiar tu tarjeta o dar de baja el plan al instante desde Stripe.
      </p>
    </div>
  );
}