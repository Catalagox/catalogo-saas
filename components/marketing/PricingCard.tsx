"use client";

import { Check, Zap } from "lucide-react";

// 📋 Interfaz estricta para solucionar los errores de tipado en TypeScript
interface PricingCardProps {
  title: string;
  price: string;
  period: string;
  badgeText: string;
  badgeColor: string;
  isPopular?: boolean;      // El signo '?' hace que la propiedad sea opcional
  subPriceText?: string;    // Propiedad opcional
  isLoading: boolean;
  isDisabled: boolean;
  onSubmit: () => void;     // Indica que es una función que no retorna nada
}

// Lista compartida de características de tus planes
const FEATURES = [
  "1 Catalógo Digital Profesional",
  "QR Personalizado de Alta Calidad",
  "Edición de Productos",
  "Soporte Prioritario 24/7",
  "Panel de Administración Pro",
  "Sin Comisiones por Venta",
  "Sin Contratos ni Permanencia",
];

export default function PricingCard({
  title,
  price,
  period,
  badgeText,
  badgeColor,
  isPopular = false,
  subPriceText,
  isLoading,
  isDisabled,
  onSubmit,
}: PricingCardProps) { // 👈 Asignamos la interfaz aquí
  return (
    <div className="w-full mx-auto group relative flex flex-col h-full">
      {/* Efecto de borde brillante gradiente */}
      <div
        className={`absolute -inset-0.5 rounded-[42px] bg-gradient-to-r from-emerald-500 via-emerald-400 to-green-600 transition-opacity duration-500 animate-tilt ${
          isPopular ? "opacity-60 group-hover:opacity-100" : "opacity-25 group-hover:opacity-70"
        }`}
      ></div>

      <div className="relative flex flex-col justify-between h-full bg-[#0e1412] border border-[#1e261b] rounded-[40px] p-8 md:p-10 shadow-2xl transition-all duration-500 group-hover:-translate-y-1">
        
        {/* Etiqueta Superior */}
        <div className={`absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg whitespace-nowrap ${badgeColor}`}>
          {badgeText}
        </div>

        <div>
          {/* Sección de Precio */}
          <div className="text-center mb-10 mt-2">
            <h3 className="text-[#7f8781] font-bold text-sm uppercase tracking-widest mb-2">
              {title}
            </h3>

            <div className="flex items-baseline justify-center gap-1">
              <span className="text-2xl font-bold text-[#7f8781]">$</span>
              <span className="text-7xl font-black text-white tracking-tighter">
                {price}
              </span>
              <span className="text-[#7f8781] font-semibold">{period}</span>
            </div>

            {subPriceText && (
              <p className="text-[#22c55e] text-xs font-bold mt-2 tracking-wide uppercase">
                {subPriceText}
              </p>
            )}
          </div>

          {/* Listado de Características */}
          <div className="space-y-4 mb-10">
            {FEATURES.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 group/item">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20 transition-transform group-hover/item:scale-110">
                  <Check size={14} strokeWidth={3} />
                </div>
                <span className="text-[#c4c7c4] font-medium text-[15px]">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Botón de Acción */}
        <button
          onClick={onSubmit}
          disabled={isDisabled}
          className="relative overflow-hidden w-full py-5 rounded-2xl bg-[#22c55e] hover:bg-[#16a34a] text-[#050807] font-bold text-lg shadow-xl transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 cursor-pointer mt-auto"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isLoading ? (
              "Procesando..."
            ) : (
              <>
                ¡Empezar ahora!
                <Zap size={18} className="fill-current" />
              </>
            )}
          </span>

          {!isLoading && (
            <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-shine" />
          )}
        </button>
        
      </div>
    </div>
  );
}