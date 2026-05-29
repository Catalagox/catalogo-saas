"use client";

import Link from "next/link";
import { Clock, AlertTriangle } from "lucide-react";

type Props = {
  planVenceEl: string | null;
};

export default function IndicadorSuscripcion({ planVenceEl }: Props) {
  // 🔥 CÁLCULO DE DÍAS RESTANTES
  const obtenerDiasRestantes = (fechaVencimientoISO: string | null) => {
    if (!fechaVencimientoISO) {
      return { dias: 0, expirado: true };
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const vencimiento = new Date(fechaVencimientoISO);
    vencimiento.setHours(0, 0, 0, 0);

    const diferenciaMs = vencimiento.getTime() - hoy.getTime();

    if (diferenciaMs < 0) {
      return { dias: 0, expirado: true };
    }

    const dias = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));

    return {
      dias,
      expirado: false,
    };
  };

  const infoPlan = obtenerDiasRestantes(planVenceEl);

  if (!planVenceEl) return null;

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
        font-semibold
        transition
        duration-200
        hover:scale-[1.02]
        cursor-pointer
        ${
          infoPlan.expirado
            ? "bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
            : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
        }
      `}
    >
      {infoPlan.expirado ? (
        <>
          <AlertTriangle className="w-3.5 h-3.5 text-red-400 animate-pulse" />

          <span>Prueba expirada (0 días)</span>
        </>
      ) : (
        <>
          <Clock className="w-3.5 h-3.5 text-emerald-400" />

          <span>
            Suscripción: Activa ({infoPlan.dias}{" "}
            {infoPlan.dias === 1 ? "día" : "días"} restantes)
          </span>
        </>
      )}
    </Link>
  );
}
