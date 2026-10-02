"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

type Props = {
  pedidoId: string;
  estadoPedido: string;
  estadoPago: string;
};

const SIGUIENTE_ESTADO: Record<
  string,
  { estado: string; texto: string }
> = {
  nuevo: { estado: "confirmado", texto: "Confirmar pedido" },
  confirmado: {
    estado: "en_preparacion",
    texto: "Iniciar preparación",
  },
  en_preparacion: {
    estado: "enviado",
    texto: "Marcar como enviado",
  },
  enviado: {
    estado: "entregado",
    texto: "Marcar como entregado",
  },
};

export default function PedidoAcciones({
  pedidoId,
  estadoPedido,
  estadoPago,
}: Props) {
  const router = useRouter();
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const guardandoRef = useRef(false);

  const siguiente = SIGUIENTE_ESTADO[estadoPedido];

  const sePuedeCancelar =
    ["nuevo", "confirmado", "en_preparacion"].includes(estadoPedido) &&
    ["pendiente", "fallido"].includes(estadoPago);

  const cambiarEstado = async (estado: string) => {
    if (guardandoRef.current) return;

    if (
      estado === "cancelado" &&
      !window.confirm(
        "¿Cancelar este pedido y devolver sus unidades al stock?",
      )
    ) {
      return;
    }

    guardandoRef.current = true;
    setGuardando(true);
    setError("");

    try {
      const response = await fetch(
        `/api/pedidos/${encodeURIComponent(pedidoId)}/estado`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ estado }),
        },
      );

      const resultado: { estado?: string; error?: string } =
        await response.json();

      if (!response.ok) {
        throw new Error(
          resultado.error ?? "No pudimos actualizar el pedido.",
        );
      }

      window.dispatchEvent(new Event("pedidos:actualizados"));
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No pudimos actualizar el pedido.",
      );
    } finally {
      guardandoRef.current = false;
      setGuardando(false);
    }
  };

  if (!siguiente && !sePuedeCancelar) return null;

  return (
    <div
      aria-busy={guardando}
      className="mt-5 border-t border-[var(--border-card)] pt-4"
    >
      <div className="flex flex-wrap gap-3">
        {siguiente && (
          <button
            type="button"
            disabled={guardando}
            onClick={() => void cambiarEstado(siguiente.estado)}
            className="rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-bold text-[var(--color-text-inverse)] transition-colors hover:bg-[var(--color-primary-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {guardando ? "Guardando..." : siguiente.texto}
          </button>
        )}

        {sePuedeCancelar && (
          <button
            type="button"
            disabled={guardando}
            onClick={() => void cambiarEstado("cancelado")}
            className="rounded-xl border border-red-500/40 bg-[var(--bg-card)] px-4 py-2.5 text-sm font-bold text-[var(--text-primary)] transition-colors hover:bg-red-500/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-danger)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancelar pedido
          </button>
        )}
      </div>

      {error && (
        <p
          role="alert"
          className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-[var(--text-primary)]"
        >
          {error}
        </p>
      )}
    </div>
  );
}