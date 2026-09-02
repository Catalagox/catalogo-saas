"use client";

import { useState } from "react";
import { Plus, Minus, ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";

type AccionesProductoProps = {
  producto: {
    id: string;
    nombre: string;
    precio: number;
    imagen_url?: string;
    disponible?: boolean;
  };
  colorPrimario: string;
};

export default function AccionesProducto({
  producto,
  colorPrimario,
}: AccionesProductoProps) {
  const [cantidad, setCantidad] = useState(1);
  const [agregado, setAgregado] = useState(false);
  const { addToCart } = useCart();

  const incrementar = () => setCantidad((prev) => prev + 1);
  const decrementar = () => setCantidad((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAgregar = () => {
    if (producto.disponible === false) return;

    for (let i = 0; i < cantidad; i++) {
      addToCart({
        id: producto.id,
        nombre: producto.nombre,
        precio: Number(producto.precio),
        imagen: producto.imagen_url,
      });
    }

    setAgregado(true);
    setTimeout(() => setAgregado(false), 2000);
  };

  return (
    <div className="space-y-4 pt-4 border-t border-black/10 dark:border-white/10">
      <div className="flex items-center gap-3">
        {/* SELECTOR DE CANTIDAD USANDO EL COLOR PRIMARIO DEL CATÁLOGO */}
        <div
          style={{ borderColor: colorPrimario }}
          className="flex items-center justify-between rounded-xl bg-black/5 dark:bg-white/10 border-2 p-1.5 w-32 shrink-0 shadow-sm"
        >
          <button
            onClick={decrementar}
            disabled={cantidad <= 1}
            style={{ color: colorPrimario }}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 transition-all active:scale-95 disabled:opacity-25 disabled:pointer-events-none"
            aria-label="Reducir cantidad"
          >
            <Minus size={16} strokeWidth={2.5} />
          </button>

          <span className="font-black text-base w-6 text-center select-none">
            {cantidad}
          </span>

          <button
            onClick={incrementar}
            style={{ color: colorPrimario }}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 transition-all active:scale-95"
            aria-label="Aumentar cantidad"
          >
            <Plus size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* BOTÓN AÑADIR AL CARRITO */}
        <button
          onClick={handleAgregar}
          style={{ backgroundColor: colorPrimario }}
          className="flex-1 h-12 rounded-xl font-bold text-white flex items-center justify-center gap-2 shadow-lg hover:brightness-110 active:scale-[0.98] transition-all"
        >
          {agregado ? (
            <>
              <Check size={18} />
              <span>¡Agregado!</span>
            </>
          ) : (
            <>
              <ShoppingBag size={18} />
              <span>Añadir al carrito</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}