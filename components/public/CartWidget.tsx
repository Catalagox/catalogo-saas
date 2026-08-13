"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import CartDrawer from "./CartDrawer";
import { ShoppingBag } from "lucide-react";

interface CartWidgetProps {
  catalogoNombre: string;
  whatsapp?: string;
  userCountry: string;
  colorPrimario?: string;
}

export default function CartWidget({
  catalogoNombre,
  whatsapp,
  userCountry,
  colorPrimario = "#f97316",
}: CartWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { cantidadTotal } = useCart();

  // Si el carrito está vacío, no se dibuja nada
  if (cantidadTotal === 0) return null;

  return (
    <>
      {/* BOTÓN FLOTANTE */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-full shadow-2xl text-white font-black text-sm tracking-wider uppercase transition-transform active:scale-95"
        style={{ backgroundColor: colorPrimario }}
        aria-label="Ver pedido"
      >
        <div className="relative">
          <ShoppingBag size={20} />
          <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
            {cantidadTotal}
          </span>
        </div>
        <span>Ver Pedido</span>
      </button>

      {/* DRAWER DESLIZABLE (TU COMPONENTE EXISTENTE) */}
      <CartDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        catalogoNombre={catalogoNombre}
        whatsapp={whatsapp}
        userCountry={userCountry}
      />
    </>
  );
}
