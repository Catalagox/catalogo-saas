"use client";

import { useState } from "react";
import { ShoppingBag } from "lucide-react";

import { useCart } from "@/context/CartContext";
import CartDrawer from "./CartDrawer";

interface CartWidgetProps {
  catalogoId: string;
  catalogoNombre: string;
  whatsapp?: string;
  userCountry: string;
  colorPrimario?: string;
}

export default function CartWidget({
  catalogoId,
  catalogoNombre,
  whatsapp,
  userCountry,
  colorPrimario = "#f97316",
}: CartWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { cantidadTotal } = useCart();

  // Mantener el drawer montado mientras muestra la confirmación,
  // aunque el carrito ya se haya vaciado.
  if (cantidadTotal === 0 && !isOpen) return null;

  return (
    <>
      {cantidadTotal > 0 && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full px-5 py-3.5 text-sm font-black uppercase tracking-wider text-white shadow-2xl transition-transform active:scale-95"
          style={{ backgroundColor: colorPrimario }}
          aria-label="Ver pedido"
        >
          <div className="relative">
            <ShoppingBag size={20} />

            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-black">
              {cantidadTotal}
            </span>
          </div>

          <span>Ver pedido</span>
        </button>
      )}

      <CartDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        catalogoId={catalogoId}
        catalogoNombre={catalogoNombre}
        whatsapp={whatsapp}
        userCountry={userCountry}
      />
    </>
  );
}