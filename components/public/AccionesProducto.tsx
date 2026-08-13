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

    // Agrega la cantidad de veces seleccionada al carrito
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
    <div className="space-y-4 pt-4 border-t border-white/10">
      <div className="flex items-center gap-3">
        {/* SELECTOR DE CANTIDAD (- / +) */}
        <div className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 p-1.5 w-32 shrink-0">
          <button
            onClick={decrementar}
            disabled={cantidad <= 1}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10 disabled:opacity-30"
            aria-label="Reducir cantidad"
          >
            <Minus size={16} />
          </button>
          <span className="font-bold text-base w-6 text-center">
            {cantidad}
          </span>
          <button
            onClick={incrementar}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10"
            aria-label="Aumentar cantidad"
          >
            <Plus size={16} />
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