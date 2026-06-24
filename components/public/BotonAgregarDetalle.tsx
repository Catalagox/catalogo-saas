"use client";

import { useCart } from "@/context/CartContext";
import { useState } from "react";

interface BotonProps {
  producto: {
    id: string;
    nombre: string;
    precio: number;
    imagen_url?: string;
    disponible: boolean;
  };
  colorPrimario: string;
  whatsappNumero: string;
}

export default function BotonAgregarDetalle({ producto, colorPrimario, whatsappNumero }: BotonProps) {
  const { addToCart } = useCart();
  const [agregado, setAgregado] = useState(false);

  const handleAgregar = () => {
    if (!producto.disponible) return;
    
    addToCart({
      id: producto.id,
      nombre: producto.nombre,
      precio: Number(producto.precio),
      imagen: producto.imagen_url,
    });

    // Activa el estado de éxito visual
    setAgregado(true);
    
    // Regresa a su estado original después de 1.5 segundos
    setTimeout(() => {
      setAgregado(false);
    }, 1500);
  };

  return (
    <button
      onClick={handleAgregar}
      disabled={!producto.disponible}
      className={`w-full h-16 rounded-2xl font-black text-sm tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-300 shadow-2xl ${
        producto.disponible
          ? agregado 
            ? "scale-105 shadow-[0_0_20px_rgba(34,197,94,0.4)]" // Efecto Pop + Brillo verde al agregar
            : "hover:brightness-110 active:scale-[0.98]"
          : "opacity-50 grayscale pointer-events-none"
      }`}
      style={{
        // Si está agregado cambia a verde, si está disponible usa tu color primario dinámico, si no, gris oscuro
        backgroundColor: !producto.disponible 
          ? "#222" 
          : agregado 
            ? "#22c55e" 
            : colorPrimario,
        color: "#fff",
      }}
    >
      {!producto.disponible ? (
        "No disponible"
      ) : agregado ? (
        <>
          <span>✓ ¡Agregado con Éxito! 🛒</span>
        </>
      ) : (
        "Añadir al Carrito"
      )}
    </button>
  );
}