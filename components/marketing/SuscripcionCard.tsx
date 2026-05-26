"use client";

import { useState } from "react";
import { Check, Zap } from "lucide-react";

interface SuscripcionCardProps {
  user: {
    id: string;
    email: string;
  } | null;
}

export default function SuscripcionCard({ user }: SuscripcionCardProps) {
  const [loading, setLoading] = useState(false);

  const handleSuscribirse = async () => {
    if (!user) return alert("No se encontraron datos del usuario.");
    setLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Error iniciando el pago.");
      }
    } catch (error) {
      console.error(error);
      alert("Error iniciando pago");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[440px] mx-auto group relative my-6">
      {/* Animated Border */}
      <div className="absolute -inset-0.5 rounded-[42px] bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-400 opacity-75 blur-sm group-hover:opacity-100 transition-opacity duration-500 group-hover:duration-200 animate-tilt"></div>

      <div className="relative bg-white rounded-[40px] p-8 md:p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] transition-all duration-500 group-hover:shadow-[0_48px_80px_-16px_rgba(0,0,0,0.12)] group-hover:-translate-y-1">
        {/* BADGE */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#16A34A] text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
          Recomendado
        </div>

        {/* PRICE */}
        <div className="text-center mb-10">
          <h3 className="text-gray-400 font-bold text-sm uppercase tracking-widest mb-2">
            Plan Pro
          </h3>

          <div className="flex items-baseline justify-center gap-1">
            <span className="text-2xl font-bold text-gray-400">$</span>
            <span className="text-8xl font-black text-gray-900 tracking-tighter">
              5
            </span>
            <span className="text-gray-400 font-semibold">/mes</span>
          </div>
        </div>

        {/* FEATURES */}
        <div className="space-y-4 mb-10">
          {[
            "1 Menú Digital Profesional",
            "QR Personalizado de Alta Calidad",
            "Edición de Platillos Ilimitada",
            "Soporte Prioritario 24/7",
            "Panel de Administración Pro",
            "Sin Comisiones por Venta",
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 group/item">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 text-white transition-transform group-hover/item:scale-110">
                <Check size={14} strokeWidth={3} />
              </div>
              <span className="text-gray-700 font-medium text-[15px]">
                {item}
              </span>
            </div>
          ))}
        </div>

        {/* BUTTON */}
        <button
          onClick={handleSuscribirse}
          disabled={loading}
          className="relative overflow-hidden w-full py-5 rounded-2xl bg-[#16A34A] text-white font-bold text-lg shadow-2xl transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-70 cursor-pointer"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {loading ? (
              "Procesando..."
            ) : (
              <>
                ¡Activar Plan Pro ahora!
                <Zap size={18} className="fill-current" />
              </>
            )}
          </span>
        </button>

        {/* FOOTER */}
        <div className="mt-6 flex items-center justify-center gap-2 text-gray-400">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <p className="text-xs font-medium uppercase tracking-tight">
            Garantía de satisfacción
          </p>
        </div>
      </div>
    </div>
  );
}
