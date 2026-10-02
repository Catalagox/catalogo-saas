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
      className="inline-flex min-h-11 max-w-full flex-wrap items-center gap-3 rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] px-3 py-2 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-card-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
    >
      {sonidoActivo ? (
        <Bell size={18} aria-hidden="true" className="shrink-0" />
      ) : (
        <BellOff size={18} aria-hidden="true" className="shrink-0" />
      )}

      <span>Sonido de pedidos</span>

      <span
        aria-hidden="true"
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          sonidoActivo
            ? "bg-[var(--color-primary)]"
            : "bg-[var(--border-card)]"
        }`}
      >
        <span
          className={`absolute left-1 top-1 h-4 w-4 rounded-full transition-transform ${
            sonidoActivo
              ? "translate-x-5 bg-[var(--color-text-inverse)]"
              : "translate-x-0 bg-[var(--text-secondary)]"
          }`}
        />
      </span>

      <span className="sr-only">
        {sonidoActivo ? "Activado" : "Desactivado"}
      </span>
    </button>
  );
}
