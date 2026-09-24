"use client";

import { useState, type FormEvent } from "react";

import { useCart, type CartItem } from "@/context/CartContext";
import Price from "@/components/ui/Price";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  catalogoId: string;
  catalogoNombre: string;
  whatsapp?: string;
  userCountry: string;
}

interface PedidoConfirmado {
  id: string;
  total: number;
  moneda: string;
  nombre: string;
  telefono: string;
  direccion: string;
  notas: string;
  items: CartItem[];
}

function formatPrice(amount: number, countryCode: string) {
  const etiquetas: Record<string, string> = {
    AR: "$ARS",
    BO: "Bs.",
    BR: "R$",
    CA: "$CAD",
    CL: "$CLP",
    CO: "$COP",
    MX: "$MXN",
    PE: "S/.",
    US: "$USD",
    UY: "$UYU",
  };

  return `${etiquetas[countryCode] ?? "$"} ${amount.toLocaleString("es", {
    maximumFractionDigits: 2,
  })}`;
}

function obtenerClaveIntento(catalogoId: string, contenido: string): string {
  const storageKey = `pedido-intento:${catalogoId}`;

  try {
    const anterior = sessionStorage.getItem(storageKey);

    if (anterior) {
      const parsed = JSON.parse(anterior) as {
        contenido?: string;
        clave?: string;
      };

      if (parsed.contenido === contenido && parsed.clave) {
        return parsed.clave;
      }
    }

    const clave = crypto.randomUUID();

    sessionStorage.setItem(storageKey, JSON.stringify({ contenido, clave }));

    return clave;
  } catch {
    // El pedido también funciona si el navegador bloquea sessionStorage.
    return crypto.randomUUID();
  }
}

export default function CartDrawer({
  isOpen,
  onClose,
  catalogoId,
  catalogoNombre,
  whatsapp,
  userCountry,
}: CartDrawerProps) {
  const { items, increaseQuantity, decreaseQuantity, total, clearCart } =
    useCart();

  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [direccion, setDireccion] = useState("");
  const [notas, setNotas] = useState("");

  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [confirmado, setConfirmado] = useState<PedidoConfirmado | null>(null);

  if (!isOpen) return null;

  const confirmarPedido = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (enviando || items.length === 0) return;

    const itemsParaEnviar = items.map((item) => ({
      id: item.id,
      cantidad: item.cantidad,
    }));

    const datos = {
      catalogoId,
      nombre: nombre.trim(),
      telefono: telefono.trim(),
      email: email.trim(),
      direccion: direccion.trim(),
      notas: notas.trim(),
      items: itemsParaEnviar,
    };

    const contenido = JSON.stringify(datos);
    const claveIdempotencia = obtenerClaveIntento(catalogoId, contenido);

    setEnviando(true);
    setError("");

    try {
      const response = await fetch("/api/pedidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...datos,
          claveIdempotencia,
        }),
      });

      if (response.status === 429) {
        throw new Error(
          "Demasiados intentos. Espera un minuto y vuelve a intentarlo.",
        );
      }

      const resultado: {
        pedidoId?: string;
        total?: number;
        moneda?: string;
        error?: string;
      } = await response.json().catch(() => ({}));

      if (
        !response.ok ||
        !resultado.pedidoId ||
        typeof resultado.total !== "number"
      ) {
        throw new Error(resultado.error ?? "No pudimos registrar el pedido.");
      }

      // Conservar una copia para mostrar el resumen después de
      // vaciar el carrito.
      setConfirmado({
        id: resultado.pedidoId,
        total: resultado.total,
        moneda: resultado.moneda ?? "",
        nombre: datos.nombre,
        telefono: datos.telefono,
        direccion: datos.direccion,
        notas: datos.notas,
        items: items.map((item) => ({ ...item })),
      });

      try {
        sessionStorage.removeItem(`pedido-intento:${catalogoId}`);
      } catch {
        // No impide mostrar el pedido ya guardado.
      }

      clearCart();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No pudimos registrar el pedido.",
      );
    } finally {
      setEnviando(false);
    }
  };

  const abrirWhatsApp = () => {
    if (!confirmado || !whatsapp) return;

    const numero = whatsapp.replace(/\D/g, "");

    if (!numero) return;

    let mensaje = `*Hola, hice el pedido ${confirmado.id} en ${catalogoNombre}.*\n\n`;

    confirmado.items.forEach((item) => {
      mensaje += `- ${item.cantidad}x ${item.nombre}: ${formatPrice(
        item.precio * item.cantidad,
        userCountry,
      )}\n`;
    });

    mensaje += `\n*Total: ${formatPrice(confirmado.total, userCountry)}*`;

    mensaje += `\nNombre: ${confirmado.nombre}`;
    mensaje += `\nTeléfono: ${confirmado.telefono}`;

    if (confirmado.direccion) {
      mensaje += `\nDirección: ${confirmado.direccion}`;
    }

    if (confirmado.notas) {
      mensaje += `\nNotas: ${confirmado.notas}`;
    }

    window.open(
      `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <div className="fixed inset-0 z-[9999] flex justify-end bg-black/60 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Tu pedido"
        className="flex h-full w-full max-w-md flex-col overflow-y-auto p-6 shadow-2xl"
        style={{
          backgroundColor: "var(--color-bg)",
          color: "var(--color-text)",
        }}
      >
        <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="text-xl font-black uppercase tracking-wider">
            {confirmado ? "Pedido registrado" : "Tu pedido"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-xl opacity-70 hover:opacity-100"
            aria-label="Cerrar carrito"
          >
            ✕
          </button>
        </div>

        {confirmado ? (
          <div className="flex flex-1 flex-col justify-center gap-5">
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5">
              <p className="text-lg font-bold">Tu pedido quedó registrado</p>

              <p className="mt-2 text-sm opacity-80">Número de pedido:</p>

              <p className="break-all text-sm font-bold">{confirmado.id}</p>

              <p className="mt-4 text-sm">
                Total:{" "}
                <strong>{formatPrice(confirmado.total, userCountry)}</strong>
              </p>

              <p className="mt-2 text-xs opacity-70">
                Pago pendiente. La tienda confirmará los detalles contigo.
              </p>
            </div>

            {whatsapp && (
              <button
                type="button"
                onClick={abrirWhatsApp}
                className="min-h-14 rounded-xl bg-[#25D366] px-4 font-black uppercase tracking-wider text-white"
              >
                Avisar a la tienda por WhatsApp
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="min-h-12 rounded-xl border border-white/20 px-4 font-bold"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {items.map((item) => {
                const tieneStock =
                  item.stock !== null && item.stock !== undefined;

                const llegoAlStock =
                  tieneStock &&
                  item.stock !== null &&
                  item.stock !== undefined &&
                  item.cantidad >= item.stock;

                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-4"
                  >
                    <div className="min-w-0 pr-3">
                      <p className="truncate text-sm font-bold sm:text-base">
                        {item.nombre}
                      </p>

                      <div className="text-xs font-black text-[var(--color-price)]">
                        <Price amount={item.precio} countryCode={userCountry} />
                      </div>

                      {tieneStock && (
                        <p className="mt-1 text-[10px] font-bold opacity-60">
                          Máximo disponible: {item.stock}
                        </p>
                      )}
                    </div>

                    <div className="flex shrink-0 items-center gap-3 rounded-lg border border-white/10 bg-black/20 p-1">
                      <button
                        type="button"
                        onClick={() => decreaseQuantity(item.id)}
                        disabled={enviando}
                        className="flex h-8 w-8 items-center justify-center rounded font-bold disabled:opacity-40"
                        aria-label={`Disminuir cantidad de ${item.nombre}`}
                      >
                        −
                      </button>

                      <span className="w-4 text-center text-sm font-bold">
                        {item.cantidad}
                      </span>

                      <button
                        type="button"
                        onClick={() => increaseQuantity(item.id)}
                        disabled={enviando || llegoAlStock}
                        className="flex h-8 w-8 items-center justify-center rounded font-bold disabled:opacity-25"
                        aria-label={`Aumentar cantidad de ${item.nombre}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <form
              onSubmit={confirmarPedido}
              className="mt-6 space-y-4 border-t border-white/10 pt-5"
            >
              <h3 className="font-bold">Tus datos</h3>

              <label className="block text-sm">
                Nombre *
                <input
                  required
                  minLength={2}
                  maxLength={120}
                  value={nombre}
                  onChange={(event) => setNombre(event.target.value)}
                  autoComplete="name"
                  className="mt-1 w-full rounded-xl border border-white/20 bg-transparent p-3"
                />
              </label>

              <label className="block text-sm">
                Teléfono *
                <input
                  required
                  type="tel"
                  minLength={5}
                  maxLength={40}
                  value={telefono}
                  onChange={(event) => setTelefono(event.target.value)}
                  autoComplete="tel"
                  className="mt-1 w-full rounded-xl border border-white/20 bg-transparent p-3"
                />
              </label>

              <label className="block text-sm">
                Correo electrónico (opcional)
                <input
                  type="email"
                  maxLength={254}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  className="mt-1 w-full rounded-xl border border-white/20 bg-transparent p-3"
                />
              </label>

              <label className="block text-sm">
                Dirección o lugar de entrega (opcional)
                <textarea
                  maxLength={500}
                  rows={2}
                  value={direccion}
                  onChange={(event) => setDireccion(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/20 bg-transparent p-3"
                />
              </label>

              <label className="block text-sm">
                Nota para la tienda (opcional)
                <textarea
                  maxLength={1000}
                  rows={2}
                  value={notas}
                  onChange={(event) => setNotas(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/20 bg-transparent p-3"
                />
              </label>

              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <span className="text-sm font-bold">Total estimado</span>

                <span className="text-xl font-black text-[var(--color-price)]">
                  <Price amount={total} countryCode={userCountry} />
                </span>
              </div>

              <p className="text-xs opacity-70">
                El precio y el stock se verificarán al confirmar.
              </p>

              {error && (
                <p role="alert" className="text-sm font-bold text-red-500">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={enviando || items.length === 0}
                className="min-h-14 w-full rounded-xl bg-[#25D366] px-4 text-sm font-black uppercase tracking-wider text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {enviando ? "Registrando pedido..." : "Confirmar pedido"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
