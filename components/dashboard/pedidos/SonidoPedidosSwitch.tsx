"use client";

import { Bell, BellOff } from "lucide-react";
import { usePedidosNotificaciones } from "@/components/dashboard/pedidos/PedidosNotificaciones";

export default function SonidoPedidosSwitch() {
  const notificaciones = usePedidosNotificaciones();
  if (!notificaciones) return null;
  const { sonidoActivo, alternarSonido } = notificaciones;
  return (
    <button
      type="button"
      role="switch"
      aria-checked={sonidoActivo}
      onClick={() => void alternarSonido()}
      className="inline-flex min-h-11 items-center gap-3 rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] px-3 py-2 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-card-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
    >
      {sonidoActivo ? <Bell size={18} aria-hidden="true" /> : <BellOff size={18} aria-hidden="true" />}
      <span>Sonido de pedidos</span>
      <span aria-hidden="true" className={`relative h-6 w-11 rounded-full transition-colors ${sonidoActivo ? "bg-[var(--color-primary)]" : "bg-gray-500"}`}>
        <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${sonidoActivo ? "left-1 translate-x-5" : "left-1"}`} />
      </span>
      <span className="sr-only">{sonidoActivo ? "Activado" : "Desactivado"}</span>
    </button>
  );
}
