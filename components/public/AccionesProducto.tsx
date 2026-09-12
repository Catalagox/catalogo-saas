"use client";

import { useState } from "react";
import { Plus, Minus, ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import StockBadge from "@/components/public/StockBadge";

type AccionesProductoProps = {
  producto: {
    id: string;
    nombre: string;
    precio: number;
    imagen_url?: string;
    disponible?: boolean;
    stock?: number | null;
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

  // --------------------------------------------------
  // STOCK
  // --------------------------------------------------

  // stock === null / undefined significa que el producto
  // todavía no tiene inventario administrado.
  const tieneStockAdministrado =
    producto.stock !== null && producto.stock !== undefined;

  const stock = producto.stock ?? null;

  const agotado =
    producto.disponible === false ||
    (tieneStockAdministrado && stock !== null && stock <= 0);

  const incrementar = () => {
    setCantidad((prev) => {
      // Si no se administra stock, funciona sin límite.
      if (!tieneStockAdministrado) {
        return prev + 1;
      }

      // No permitir superar el stock disponible.
      if (stock !== null && prev >= stock) {
        return prev;
      }

      return prev + 1;
    });
  };

  const decrementar = () => {
    setCantidad((prev) => (prev > 1 ? prev - 1 : 1));
  };

  // --------------------------------------------------
  // AGREGAR AL CARRITO
  // --------------------------------------------------

  const handleAgregar = () => {
    if (agotado) return;

    // Seguridad adicional:
    // aunque el botón + ya limite la cantidad,
    // volvemos a comprobar el stock antes de agregar.
    if (
      tieneStockAdministrado &&
      stock !== null &&
      cantidad > stock
    ) {
      setCantidad(stock > 0 ? stock : 1);
      return;
    }

    for (let i = 0; i < cantidad; i++) {
      addToCart({
        id: producto.id,
        nombre: producto.nombre,
        precio: Number(producto.precio),
        imagen: producto.imagen_url,
        stock: producto.stock,
      });
    }

    setAgregado(true);

    setTimeout(() => {
      setAgregado(false);
    }, 2000);
  };

  return (
    <div className="space-y-4 pt-4 border-t border-black/10 dark:border-white/10">

      {/* ESTADO DEL STOCK */}
      <StockBadge
        stock={producto.stock}
        disponible={producto.disponible}
        mostrarTextoCompleto={true}
      />

      {/* SELECTOR + BOTÓN */}
      <div className="flex items-center gap-3">

        {/* SELECTOR DE CANTIDAD */}
        <div
          style={{ borderColor: colorPrimario }}
          className="flex items-center justify-between rounded-xl bg-black/5 dark:bg-white/10 border-2 p-1.5 w-32 shrink-0 shadow-sm"
        >
          {/* RESTAR */}
          <button
            onClick={decrementar}
            disabled={cantidad <= 1 || agotado}
            style={{ color: colorPrimario }}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 transition-all active:scale-95 disabled:opacity-25 disabled:pointer-events-none"
            aria-label="Reducir cantidad"
          >
            <Minus size={16} strokeWidth={2.5} />
          </button>

          {/* CANTIDAD */}
          <span className="font-black text-base w-6 text-center select-none">
            {cantidad}
          </span>

          {/* SUMAR */}
          <button
            onClick={incrementar}
            disabled={
              agotado ||
              (tieneStockAdministrado &&
                stock !== null &&
                cantidad >= stock)
            }
            style={{ color: colorPrimario }}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 transition-all active:scale-95 disabled:opacity-25 disabled:pointer-events-none"
            aria-label="Aumentar cantidad"
          >
            <Plus size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* BOTÓN AÑADIR AL CARRITO */}
        <button
          onClick={handleAgregar}
          disabled={agotado}
          style={{
            backgroundColor: agotado
              ? undefined
              : colorPrimario,
          }}
          className={`flex-1 h-12 rounded-xl font-bold text-white flex items-center justify-center gap-2 shadow-lg transition-all ${
            agotado
              ? "bg-gray-400 cursor-not-allowed opacity-70"
              : "hover:brightness-110 active:scale-[0.98]"
          }`}
        >
          {agotado ? (
            <>
              <ShoppingBag size={18} />
              <span>Agotado</span>
            </>
          ) : agregado ? (
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
