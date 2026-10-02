"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Clock, AlertTriangle, ShieldCheck } from "lucide-react";

type Props = {
  planVenceEl: string | null;
};

const DIA_MS = 24 * 60 * 60 * 1000;

export default function IndicadorSuscripcion({
  planVenceEl,
}: Props) {
  const [ahora, setAhora] = useState<number | null>(null);

  useEffect(() => {
    setAhora(Date.now());

    const intervalo = window.setInterval(() => {
      setAhora(Date.now());
    }, 60_000);

    return () => window.clearInterval(intervalo);
  }, []);

  if (!planVenceEl || ahora === null) return null;

  const vencimiento = new Date(planVenceEl).getTime();

  if (!Number.isFinite(vencimiento)) return null;

  const diferencia = vencimiento - ahora;
  const expirado = diferencia <= 0;
  const dias = Math.max(0, Math.ceil(diferencia / DIA_MS));
  const advertencia = !expirado && dias <= 5;
  const venceHoy =
    !expirado &&
    new Date(vencimiento).toDateString() ===
      new Date(ahora).toDateString();

  const estilos = expirado
    ? "border-red-500/30 bg-red-500/10 hover:border-red-500/50 hover:bg-red-500/20"
    : advertencia
      ? "border-amber-500/30 bg-amber-500/10 hover:border-amber-500/50 hover:bg-amber-500/20"
      : "border-emerald-500/30 bg-emerald-500/10 hover:border-emerald-500/50 hover:bg-emerald-500/20";

  const Icon = expirado
    ? AlertTriangle
    : advertencia
      ? Clock
      : ShieldCheck;

  const unidad = dias === 1 ? "día" : "días";

  return (
    <Link
      href="/suscripcion"
      className={`inline-flex max-w-full items-center gap-2 self-start rounded-full border px-3.5 py-2 text-xs font-medium leading-relaxed tracking-wide text-[var(--text-primary)] shadow-sm transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] sm:self-center ${estilos}`}
    >
      <Icon
        aria-hidden="true"
        className="h-3.5 w-3.5 shrink-0"
      />

      <span className="min-w-0">
        {expirado ? (
          <>
            Suscripción vencida •{" "}
            <span className="font-bold underline">
              Renovar ahora
            </span>
          </>
        ) : advertencia ? (
          <>
            {venceHoy
              ? "Vence hoy"
              : `Vence en ${dias} ${unidad}`}{" "}
            •{" "}
            <span className="font-bold underline">
              Pagar plan
            </span>
          </>
        ) : (
          <>Plan activo ({dias} {unidad})</>
        )}
      </span>
    </Link>
  );
}