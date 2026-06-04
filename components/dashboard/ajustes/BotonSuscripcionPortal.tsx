"use client";

import { CreditCard } from "lucide-react";

// Enlace real de producción para Catalogox
const ENLACE_PORTAL_STRIPE = "https://billing.stripe.com/p/login/4gM5kE6sV3EP57Zck16sw00";

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