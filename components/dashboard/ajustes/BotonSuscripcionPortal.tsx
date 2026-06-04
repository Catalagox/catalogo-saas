"use client";

import { CreditCard } from "lucide-react";

// ⚠️ REEMPLAZA ESTA URL por el enlace que copiaste de tu Dashboard de Stripe
// (Configuración ➔ Portal de clientes ➔ Enlace directo)
const ENLACE_PORTAL_STRIPE = "https://billing.stripe.com/p/login/TU_ENLACE_REAL_AQUÍ";

export default function BotonSuscripcionPortal() {
  
  const handleOpenPortal = () => {
    // Te redirige directamente al portal seguro de Stripe
    window.location.href = ENLACE_PORTAL_STRIPE;
  };

  return (
    <div className="pt-2">
      <button
        onClick={handleOpenPortal}
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
        "
      >
        <CreditCard className="w-4 h-4 text-gray-400" />
        Gestionar o cancelar suscripción
      </button>
    </div>
  );
}