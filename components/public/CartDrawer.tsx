"use client";

import { useCart } from "@/context/CartContext";
import Price from "@/components/ui/Price";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  catalogoNombre: string;
  whatsapp?: string;
  userCountry: string;
}

const formatPriceWithCurrency = (amount: number, countryCode: string) => {
  if (countryCode === "PE") return `S/. ${amount.toLocaleString()}`;
  if (countryCode === "CL") return `$CLP ${amount.toLocaleString()}`;
  if (countryCode === "CO") return `$COP ${amount.toLocaleString()}`;
  if (countryCode === "MX") return `$MXN ${amount.toLocaleString()}`;
  if (countryCode === "AR") return `$ARS ${amount.toLocaleString()}`;

  return `$${amount.toLocaleString()}`;
};

export default function CartDrawer({
  isOpen,
  onClose,
  catalogoNombre,
  whatsapp,
  userCountry,
}: CartDrawerProps) {
  const { items, increaseQuantity, decreaseQuantity, total, clearCart } =
    useCart();

  if (!isOpen) return null;

  // ==================================================
  // ENVIAR PEDIDO A WHATSAPP
  // ==================================================

  const enviarPedidoWhatsApp = () => {
    if (items.length === 0 || !whatsapp) return;

    let mensaje = `*Hola! Me gustaria realizar el siguiente pedido en ${catalogoNombre}:*\n\n`;

    items.forEach((item) => {
      const subtotal = item.precio * item.cantidad;

      mensaje += `- ${item.cantidad}x *${item.nombre}* - ${formatPriceWithCurrency(
        item.precio,
        userCountry,
      )} (Subtotal: ${formatPriceWithCurrency(subtotal, userCountry)})\n`;
    });

    mensaje += `\n*Total a pagar: ${formatPriceWithCurrency(
      total,
      userCountry,
    )}*`;

    mensaje += `\n\n_Pedido enviado desde el catalogo web._`;

    const numeroFormateado = whatsapp.replace(/[^0-9]/g, "");

    const whatsappUrl = `https://wa.me/${numeroFormateado}?text=${encodeURIComponent(
      mensaje,
    )}`;

    window.open(whatsappUrl, "_blank");

    clearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-end z-[9999]">
      <div
        className="w-full max-w-md h-full p-6 flex flex-col justify-between shadow-2xl overflow-hidden"
        style={{
          backgroundColor: "var(--color-bg)",
          color: "var(--color-text)",
        }}
      >
        {/* ==================================================
            PRODUCTOS
        ================================================== */}

        <div>
          <div className="flex justify-between items-center mb-6 border-b pb-4 border-white/10">
            <h2 className="text-xl font-black uppercase tracking-wider">
              Tu Pedido
            </h2>

            <button
              onClick={onClose}
              className="text-xl opacity-70 hover:opacity-100 p-2"
              aria-label="Cerrar carrito"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 scrollbar-hide">
            {items.map((item) => {
              // ------------------------------------------------
              // ¿Tiene inventario administrado?
              // ------------------------------------------------

              const tieneStockAdministrado =
                item.stock !== null && item.stock !== undefined;

              // ------------------------------------------------
              // ¿Llegó al máximo disponible?
              // ------------------------------------------------

              const llegoAlStock =
                tieneStockAdministrado &&
                item.stock !== null &&
                item.stock !== undefined &&
                item.cantidad >= item.stock;

              return (
                <div
                  key={item.id}
                  className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5"
                >
                  {/* INFORMACIÓN DEL PRODUCTO */}
                  <div className="min-w-0 pr-3">
                    <p className="font-bold text-sm sm:text-base truncate">
                      {item.nombre}
                    </p>

                    <div className="text-xs font-black text-[var(--color-price)]">
                      <Price amount={item.precio} countryCode={userCountry} />
                    </div>

                    {/* INFORMACIÓN DE STOCK */}
                    {tieneStockAdministrado && item.stock !== null && (
                      <p
                        className={`text-[10px] font-bold mt-1 ${
                          llegoAlStock ? "text-amber-500" : "opacity-50"
                        }`}
                      >
                        {llegoAlStock
                          ? `Máximo disponible: ${item.stock}`
                          : `${item.stock} disponibles`}
                      </p>
                    )}
                  </div>

                  {/* SELECTOR DE CANTIDAD */}
                  <div className="flex items-center gap-3 bg-black/20 rounded-lg p-1 border border-white/10 shrink-0">
                    {/* RESTAR */}
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="w-8 h-8 flex items-center justify-center font-bold md:hover:bg-white/10 active:bg-white/20 rounded"
                      aria-label={`Disminuir cantidad de ${item.nombre}`}
                    >
                      -
                    </button>

                    {/* CANTIDAD */}
                    <span className="font-bold text-sm w-4 text-center">
                      {item.cantidad}
                    </span>

                    {/* SUMAR */}
                    <button
                      onClick={() => increaseQuantity(item.id)}
                      disabled={llegoAlStock}
                      className="w-8 h-8 flex items-center justify-center font-bold md:hover:bg-white/10 active:bg-white/20 rounded disabled:opacity-25 disabled:pointer-events-none"
                      aria-label={`Aumentar cantidad de ${item.nombre}`}
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ==================================================
            TOTAL + WHATSAPP
        ================================================== */}

        <div className="border-t pt-4 border-white/10">
          <div className="flex justify-between items-center mb-4 px-1">
            <span className="text-sm font-bold uppercase opacity-60 tracking-wider">
              Total estimado:
            </span>

            <div className="text-2xl font-black text-[var(--color-price)]">
              <Price amount={total} countryCode={userCountry} />
            </div>
          </div>

          <button
            onClick={enviarPedidoWhatsApp}
            disabled={!whatsapp || items.length === 0}
            className="w-full h-14 rounded-xl font-black text-sm uppercase tracking-widest text-white flex justify-center items-center gap-2 transition-all md:hover:brightness-110 active:scale-[0.98] touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#25D366" }}
          >
            Enviar a WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
