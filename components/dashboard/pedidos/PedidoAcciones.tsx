"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  pedidoId: string;
  estadoPedido: string;
  estadoPago: string;
};

const SIGUIENTE_ESTADO: Record<
  string,
  { estado: string; texto: string }
> = {
  nuevo: {
    estado: "confirmado",
    texto: "Confirmar pedido",
  },
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

  const siguiente = SIGUIENTE_ESTADO[estadoPedido];

  const sePuedeCancelar =
    ["nuevo", "confirmado", "en_preparacion"].includes(
      estadoPedido,
    ) &&
    ["pendiente", "fallido"].includes(estadoPago);

  const cambiarEstado = async (estado: string) => {
    if (guardando) return;

    if (
      estado === "cancelado" &&
      !window.confirm(
        "¿Cancelar este pedido y devolver sus unidades al stock?",
      )
    ) {
      return;
    }

    setGuardando(true);
    setError("");

    try {
      const response = await fetch(
        `/api/pedidos/${pedidoId}/estado`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ estado }),
        },
      );

      const resultado: {
        estado?: string;
        error?: string;
      } = await response.json();

      if (!response.ok) {
        throw new Error(
          resultado.error ?? "No pudimos actualizar el pedido.",
        );
      }

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No pudimos actualizar el pedido.",
      );
    } finally {
      setGuardando(false);
    }
  };

  if (!siguiente && !sePuedeCancelar) return null;

  return (
    <div className="mt-5 border-t border-[var(--border-card)] pt-4">
      <div className="flex flex-wrap gap-3">
        {siguiente && (
          <button
            type="button"
            disabled={guardando}
            onClick={() => void cambiarEstado(siguiente.estado)}
            className="rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"
          >
            {guardando ? "Guardando..." : siguiente.texto}
          </button>
        )}

        {sePuedeCancelar && (
          <button
            type="button"
            disabled={guardando}
            onClick={() => void cambiarEstado("cancelado")}
            className="rounded-xl border border-red-500/40 px-4 py-2.5 text-sm font-bold text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
          >
            Cancelar pedido
          </button>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}