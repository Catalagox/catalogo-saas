"use client";

import { CreditCard } from "lucide-react";

// Tu enlace real de Stripe activo
const ENLACE_PORTAL_STRIPE = "https://billing.stripe.com/p/login/test_00w28s6ttaeW75Y80Ze3e00";

export default function BotonSuscripcionPortal() {
  return (
    <div className="pt-2">
      <a
        href={ENLACE_PORTAL_STRIPE}
        target="_blank"
        rel="noopener noreferrer"
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
      </a>
      <p className="text-xs text-[var(--text-secondary)] mt-1.5">
        Haz clic para ver tus facturas, cambiar tu tarjeta o dar de baja el plan desde Stripe.
      </p>
    </div>
  );
}