"use client";

import Link from "next/link";
import { Clock, AlertTriangle, ShieldCheck } from "lucide-react";

type Props = {
  planVenceEl: string | null;
};

export default function IndicadorSuscripcion({ planVenceEl }: Props) {
  // 🔥 CÁLCULO DE DÍAS RESTANTES
  const obtenerDiasRestantes = (fechaVencimientoISO: string | null) => {
    if (!fechaVencimientoISO) {
      return { dias: 0, expirado: true, advertencia: false };
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const vencimiento = new Date(fechaVencimientoISO);
    vencimiento.setHours(0, 0, 0, 0);

    const diferenciaMs = vencimiento.getTime() - hoy.getTime();

    if (diferenciaMs < 0) {
      return { dias: 0, expirado: true, advertencia: false };
    }

    const dias = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));

    return {
      dias,
      expirado: false,
      // Se activa la advertencia si quedan 5 días o menos
      advertencia: dias <= 5,
    };
  };

  const infoPlan = obtenerDiasRestantes(planVenceEl);

  if (!planVenceEl) return null;

  // 🎨 CONFIGURACIÓN DINÁMICA DE ESTILOS SEGÚN EL ESTADO
  let estilosFondo = "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/40";
  
  if (infoPlan.expirado) {
    estilosFondo = "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 animate-pulse";
  } else if (infoPlan.advertencia) {
    estilosFondo = "bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20 hover:border-amber-500/50";
  }

  return (
    <Link
      href="/suscripcion"
      className={`
        flex
        items-center
        gap-2
        self-start
        sm:self-center
        px-3.5
        py-1.5
        border
        rounded-full
        text-xs
        font-medium
        tracking-wide
        transition-all
        duration-200
        hover:scale-[1.02]
        cursor-pointer
        shadow-sm
        ${estilosFondo}
      `}
    >
      {/* CASO 1: PLAN EXPIRADO (ROJO) */}
      {infoPlan.expirado && (
        <>
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Suscripción vencida • <span className="underline font-bold">Renovar ahora</span></span>
        </>
      )}

      {/* CASO 2: PLAN PRÓXIMO A VENCER (AMARILLO) */}
      {!infoPlan.expirado && infoPlan.advertencia && (
        <>
          <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
          <span>
            Vence en {infoPlan.dias} {infoPlan.dias === 1 ? "día" : "días"} • <span className="underline font-bold">Pagar plan</span>
          </span>
        </>
      )}

      {/* CASO 3: PLAN TODO OK (VERDE) */}
      {!infoPlan.expirado && !infoPlan.advertencia && (
        <>
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>
            Plan Activo ({infoPlan.dias} {infoPlan.dias === 1 ? "día" : "días"})
          </span>
        </>
      )}
    </Link>
  );
}