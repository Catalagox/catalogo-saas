"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Check,
  ShoppingCart,
} from "lucide-react";

import { useCart } from "@/context/CartContext";

interface ProductoDetalle {
  id: string;
  nombre: string;
  precio: number;
  imagen_url?: string | null;
  disponible?: boolean;
  stock?: number | null;
}

interface BotonAgregarDetalleProps {
  producto: ProductoDetalle;
  colorPrimario: string;

  /*
   * Estas propiedades se mantienen temporalmente para
   * no romper componentes que todavía las envían.
   *
   * El botón no necesita WhatsApp ni país para agregar
   * un producto al carrito.
   */
  whatsappNumero?: string;
  countryCode?: string;
}

export default function BotonAgregarDetalle({
  producto,
  colorPrimario,
}: BotonAgregarDetalleProps) {
  const { addToCart } = useCart();

  const [agregado, setAgregado] =
    useState(false);

  const temporizadorRef =
    useRef<ReturnType<
      typeof setTimeout
    > | null>(null);

  const precioNormalizado =
    Number(producto.precio);

  const precioValido =
    Number.isFinite(precioNormalizado) &&
    precioNormalizado >= 0;

  const stockAdministrado =
    typeof producto.stock === "number" &&
    Number.isFinite(producto.stock);

  const cantidadDisponible =
    stockAdministrado
      ? Math.max(
          0,
          Math.floor(
            Number(producto.stock),
          ),
        )
      : null;

  const productoDisponible =
    producto.disponible !== false &&
    cantidadDisponible !== 0 &&
    precioValido;

  useEffect(() => {
    return () => {
      if (temporizadorRef.current) {
        clearTimeout(
          temporizadorRef.current,
        );
      }
    };
  }, []);

  const agregarAlCarrito =
    useCallback(() => {
      if (!productoDisponible) {
        return;
      }

      addToCart({
        id: producto.id,
        nombre: producto.nombre,
        precio: precioNormalizado,
        imagen:
          producto.imagen_url ?? undefined,
      });

      setAgregado(true);

      if (temporizadorRef.current) {
        clearTimeout(
          temporizadorRef.current,
        );
      }

      temporizadorRef.current =
        setTimeout(() => {
          setAgregado(false);
          temporizadorRef.current = null;
        }, 1500);
    }, [
      addToCart,
      producto.id,
      producto.nombre,
      producto.imagen_url,
      productoDisponible,
      precioNormalizado,
    ]);

  let textoBoton = "Añadir al carrito";

  if (!precioValido) {
    textoBoton = "Precio no disponible";
  } else if (!productoDisponible) {
    textoBoton = "Producto agotado";
  } else if (agregado) {
    textoBoton = "Agregado al carrito";
  }

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={agregarAlCarrito}
        disabled={!productoDisponible}
        aria-label={
          productoDisponible
            ? `${textoBoton}: ${producto.nombre}`
            : textoBoton
        }
        className={`
          flex
          h-14
          w-full
          items-center
          justify-center
          gap-2
          rounded-2xl
          px-5
          text-sm
          font-bold
          shadow-lg
          outline-none
          transition-all
          duration-200
          focus-visible:ring-2
          focus-visible:ring-[var(--color-primary)]
          focus-visible:ring-offset-2
          focus-visible:ring-offset-[var(--color-bg)]
          ${
            productoDisponible
              ? agregado
                ? "scale-[1.01]"
                : "hover:brightness-110 active:scale-[0.98]"
              : "cursor-not-allowed opacity-50 grayscale"
          }
        `}
        style={{
          backgroundColor:
            !productoDisponible
              ? "#374151"
              : agregado
                ? "#22c55e"
                : colorPrimario,

          color: "#ffffff",
        }}
      >
        {agregado ? (
          <Check
            aria-hidden="true"
            className="h-5 w-5"
          />
        ) : (
          <ShoppingCart
            aria-hidden="true"
            className="h-5 w-5"
          />
        )}

        <span>{textoBoton}</span>
      </button>

      <span
        role="status"
        aria-live="polite"
        className="sr-only"
      >
        {agregado
          ? `${producto.nombre} fue agregado al carrito`
          : ""}
      </span>
    </div>
  );
}