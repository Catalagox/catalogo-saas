"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export default function PedidoVisto({
  pedidoId,
  vistoInicialmente,
  children,
}: {
  pedidoId: string;
  vistoInicialmente: boolean;
  children: ReactNode;
}) {
  const [visto, setVisto] = useState(vistoInicialmente);
  const elementoRef = useRef<HTMLDivElement>(null);
  const enviandoRef = useRef(false);

  useEffect(() => {
    if (visto) return;
    const elemento = elementoRef.current;
    if (!elemento) return;
    let temporizador: ReturnType<typeof setTimeout> | null = null;
    let activo = true;
    const observador = new IntersectionObserver(([entrada]) => {
      if (entrada.isIntersecting && document.visibilityState === "visible") {
        if (!temporizador && !enviandoRef.current) {
          temporizador = setTimeout(async () => {
            temporizador = null;
            if (document.visibilityState !== "visible" || enviandoRef.current) return;
            enviandoRef.current = true;
            try {
              const respuesta = await fetch("/api/pedidos/vistos", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pedidoId }),
              });
              if (!respuesta.ok) throw new Error("No se pudo marcar como visto.");
              if (activo) {
                setVisto(true);
                window.dispatchEvent(new Event("pedidos:actualizados"));
              }
            } catch (error) {
              console.error("Error marcando el pedido como visto:", error);
            } finally {
              enviandoRef.current = false;
            }
          }, 1000);
        }
      } else if (temporizador) {
        clearTimeout(temporizador);
        temporizador = null;
      }
    }, { threshold: 0.25 });
    observador.observe(elemento);
    return () => {
      activo = false;
      observador.disconnect();
      if (temporizador) clearTimeout(temporizador);
    };
  }, [pedidoId, visto]);

  return (
    <div
      ref={elementoRef}
      className={visto ? "" : "rounded-2xl ring-2 ring-[var(--color-primary)] shadow-lg"}
    >
      {!visto && (
        <div className="rounded-t-2xl bg-[var(--color-primary)] px-5 py-1.5 text-xs font-bold text-white">
          Pedido sin leer
        </div>
      )}
      {children}
    </div>
  );
}
