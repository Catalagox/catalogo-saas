"use client";

import { useEffect, useState } from "react";

type Pedido = {
  id: string;
  numero: number;
  estado_pedido: string;
  estado_pago: string;
  moneda: string;
  total: number;
  created_at: string;
  pedido_items: {
    id: string;
    nombre_producto: string;
    cantidad: number;
    subtotal: number;
  }[];
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  catalogoId: string;
};

const estados: Record<string, string> = {
  nuevo: "Recibido por la tienda",
  confirmado: "Confirmado",
  en_preparacion: "En preparación",
  listo: "Listo para entregar",
  enviado: "Enviado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

function dinero(valor: number, moneda: string) {
  try {
    return new Intl.NumberFormat("es", { style: "currency", currency: moneda })
      .format(Number(valor));
  } catch {
    return `${moneda} ${Number(valor).toLocaleString("es")}`;
  }
}

export default function MisPedidosPanel({ isOpen, onClose, catalogoId }: Props) {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    const controller = new AbortController();
    const cargar = async () => {
      setCargando(true);
      setError("");
      try {
        const response = await fetch(
          `/api/mis-pedidos?catalogoId=${encodeURIComponent(catalogoId)}`,
          { signal: controller.signal, cache: "no-store" },
        );
        const resultado = await response.json();
        if (!response.ok) throw new Error(resultado.error || "No pudimos cargar tus pedidos.");
        setPedidos(Array.isArray(resultado.pedidos) ? resultado.pedidos : []);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : "No pudimos cargar tus pedidos.");
        }
      } finally {
        if (!controller.signal.aborted) setCargando(false);
      }
    };
    void cargar();
    const intervalo = window.setInterval(() => void cargar(), 30_000);
    return () => {
      controller.abort();
      window.clearInterval(intervalo);
    };
  }, [isOpen, catalogoId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex justify-end bg-black/60 backdrop-blur-sm">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Cerrar mis pedidos"
        onClick={onClose}
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-label="Mis pedidos"
        className="relative flex h-full w-full max-w-md flex-col overflow-y-auto bg-[var(--color-bg)] p-6 text-[var(--color-text)] shadow-2xl"
      >
        <div className="mb-5 flex items-center justify-between border-b border-current/10 pb-4">
          <h2 className="text-xl font-black uppercase">Mis pedidos</h2>
          <button type="button" onClick={onClose} aria-label="Cerrar mis pedidos" className="p-2 text-xl">✕</button>
        </div>
        <p className="mb-5 text-sm opacity-70">
          Pedidos realizados desde este navegador en esta tienda. Su estado se actualiza mientras mantienes abierto este panel.
        </p>
        {cargando && pedidos.length === 0 && <p>Cargando pedidos...</p>}
        {error && <p role="alert" className="rounded-xl bg-red-500/10 p-4 text-sm text-red-600">{error}</p>}
        {!cargando && !error && pedidos.length === 0 && (
          <div className="rounded-xl border border-current/10 p-5 text-sm">
            Todavía no hay pedidos asociados a este navegador.
          </div>
        )}
        <div className="space-y-4">
          {pedidos.map((pedido) => (
            <article key={pedido.id} className="rounded-xl border border-current/15 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold">PED-{String(pedido.numero).padStart(6, "0")}</p>
                  <p className="mt-1 text-xs opacity-60">
                    {new Intl.DateTimeFormat("es", { dateStyle: "medium", timeStyle: "short" }).format(new Date(pedido.created_at))}
                  </p>
                </div>
                <span className="rounded-full bg-[var(--color-primary)] px-3 py-1 text-xs font-semibold text-white">
                  {estados[pedido.estado_pedido] ?? pedido.estado_pedido}
                </span>
              </div>
              <ul className="mt-4 space-y-1 border-t border-current/10 pt-3 text-sm">
                {pedido.pedido_items.map((item) => (
                  <li key={item.id} className="flex justify-between gap-3">
                    <span>{item.cantidad} × {item.nombre_producto}</span>
                    <span>{dinero(item.subtotal, pedido.moneda)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex justify-between border-t border-current/10 pt-3 text-sm font-bold">
                <span>Total</span><span>{dinero(pedido.total, pedido.moneda)}</span>
              </div>
              <p className="mt-2 text-xs opacity-65">Pago: {pedido.estado_pago}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
