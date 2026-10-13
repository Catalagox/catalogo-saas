"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Clock, AlertTriangle, ShieldCheck, ArrowRight } from "lucide-react";

type Props = {
  planVenceEl: string | null;
  subscriptionStatus?: string | null;
  accesoGratisVenceEl?: string | null;
  onNavigate?: () => void;
};
const DIA_MS = 86_400_000;
export default function IndicadorSuscripcion({ planVenceEl, subscriptionStatus, accesoGratisVenceEl, onNavigate }: Props) {
  const [ahora, setAhora] = useState<number | null>(null);
  useEffect(() => {
    setAhora(Date.now());
    const intervalo = window.setInterval(() => setAhora(Date.now()), 60_000);
    return () => window.clearInterval(intervalo);
  }, []);
  const fechaPlan = planVenceEl ? new Date(planVenceEl).getTime() : NaN;
  const fechaGratis = accesoGratisVenceEl ? new Date(accesoGratisVenceEl).getTime() : NaN;
  const promocion = ahora !== null && Number.isFinite(fechaGratis) && fechaGratis > ahora;
  const stripeActivo = subscriptionStatus === "active";
  const problema = subscriptionStatus === "past_due" || subscriptionStatus === "canceled";
  const vencimiento = promocion ? fechaGratis : fechaPlan;
  const dias = ahora !== null && Number.isFinite(vencimiento) ? Math.max(0, Math.ceil((vencimiento - ahora) / DIA_MS)) : null;
  const expirado = ahora !== null && !promocion && (problema || (!stripeActivo && Number.isFinite(fechaPlan) && fechaPlan <= ahora));
  const advertencia = !expirado && dias !== null && dias <= 5;
  const titulo = ahora === null ? "Tu plan" : promocion ? "Acceso gratuito" : expirado ? "Revisar suscripción" : stripeActivo ? "Suscripción activa" : subscriptionStatus === "trialing" || (dias !== null && dias > 0) ? "Periodo de prueba" : "Tu plan";
  const venceHoy = ahora !== null && Number.isFinite(vencimiento) && vencimiento > ahora && new Date(vencimiento).toDateString() === new Date(ahora).toDateString();
  const detalle = ahora === null ? "Consulta tu suscripción" : expirado ? "Revisa tu acceso y facturación" : dias !== null ? `${stripeActivo && !promocion ? "Próxima renovación" : "Vence"}${venceHoy ? " hoy" : ` en ${dias} ${dias === 1 ? "día" : "días"}`}` : "Consulta tu suscripción";
  const Icon = expirado ? AlertTriangle : advertencia ? Clock : ShieldCheck;
  const color = expirado ? "text-[var(--color-danger)]" : advertencia ? "text-amber-600" : "text-[var(--color-primary)]";
  return (
    <Link href="/dashboard/ajustes#suscripcion" onClick={onNavigate} className="block rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] p-3 transition-colors hover:bg-[var(--bg-card-hover)] focus-visible:outline-2 focus-visible:outline-[var(--color-primary)]">
      <div className="flex items-center gap-2"><Icon size={16} aria-hidden="true" className={`shrink-0 ${color}`} /><span className="text-sm font-semibold text-[var(--text-primary)]">{titulo}</span></div>
      <p className="mt-1 text-xs text-[var(--text-secondary)]">{detalle}</p>
      <span className="mt-2 flex items-center justify-between gap-2 text-xs font-semibold text-[var(--color-primary)]">Gestionar plan<ArrowRight size={14} aria-hidden="true" /></span>
    </Link>
  );
}
