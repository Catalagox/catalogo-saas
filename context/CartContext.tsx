
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export interface CartItem {
  id: string;
  nombre: string;
  precio: number;
  imagen?: string;
  cantidad: number;

  // Stock del producto.
  // null / undefined = inventario no administrado.
  stock?: number | null;
}

interface CartContextType {
  items: CartItem[];

  addToCart: (
    producto: Omit<CartItem, "cantidad">
  ) => void;

  removeFromCart: (id: string) => void;

  increaseQuantity: (id: string) => void;

  decreaseQuantity: (id: string) => void;

  clearCart: () => void;

  total: number;

  cantidadTotal: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [items, setItems] = useState<CartItem[]>([]);

  // ==================================================
  // CARGAR CARRITO GUARDADO
  // ==================================================

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");

    if (!savedCart) return;

    try {
      const carritoGuardado = JSON.parse(savedCart);

      if (Array.isArray(carritoGuardado)) {
        setItems(carritoGuardado);
      }
    } catch (error) {
      console.error(
        "Error al cargar el carrito:",
        error
      );

      localStorage.removeItem("cart");
    }
  }, []);

  // ==================================================
  // GUARDAR CARRITO
  // ==================================================

  useEffect(() => {
    localStorage.setItem(
      "cart",
      JSON.stringify(items)
    );
  }, [items]);

  // ==================================================
  // AGREGAR PRODUCTO
  // ==================================================

  const addToCart = (
    producto: Omit<CartItem, "cantidad">
  ) => {
    setItems((prev) => {
      const existe = prev.find(
        (item) => item.id === producto.id
      );

      // ----------------------------------------------
      // PRODUCTO YA EXISTE EN EL CARRITO
      // ----------------------------------------------

      if (existe) {
        // Si el producto tiene stock administrado,
        // no permitimos superar la cantidad disponible.
        if (
          producto.stock !== null &&
          producto.stock !== undefined
        ) {
          if (producto.stock <= 0) {
            return prev;
          }

          if (existe.cantidad >= producto.stock) {
            return prev;
          }
        }

        return prev.map((item) =>
          item.id === producto.id
            ? {
                ...item,

                // Actualizamos el stock por si el usuario
                // volvió a entrar al producto y cambió.
                stock: producto.stock,

                cantidad: item.cantidad + 1,
              }
            : item
        );
      }

      // ----------------------------------------------
      // PRODUCTO NUEVO
      // ----------------------------------------------

      // Si tiene stock administrado y está agotado,
      // no lo agregamos.
      if (
        producto.stock !== null &&
        producto.stock !== undefined &&
        producto.stock <= 0
      ) {
        return prev;
      }

      return [
        ...prev,
        {
          ...producto,
          cantidad: 1,
        },
      ];
    });
  };

  // ==================================================
  // ELIMINAR PRODUCTO
  // ==================================================

  const removeFromCart = (id: string) => {
    setItems((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  // ==================================================
  // AUMENTAR CANTIDAD
  // ==================================================

  const increaseQuantity = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) {
          return item;
        }

        // Si el producto tiene stock administrado,
        // respetamos el máximo.
        if (
          item.stock !== null &&
          item.stock !== undefined
        ) {
          if (item.stock <= 0) {
            return item;
          }

          if (item.cantidad >= item.stock) {
            return item;
          }
        }

        return {
          ...item,
          cantidad: item.cantidad + 1,
        };
      })
    );
  };

  // ==================================================
  // DISMINUIR CANTIDAD
  // ==================================================

  const decreaseQuantity = (id: string) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? {
                ...item,
                cantidad: item.cantidad - 1,
              }
            : item
        )
        .filter((item) => item.cantidad > 0)
    );
  };

  // ==================================================
  // VACIAR CARRITO
  // ==================================================

  const clearCart = () => {
    setItems([]);
  };

  // ==================================================
  // TOTAL $
  // ==================================================

  const total = items.reduce(
    (acc, item) =>
      acc + item.precio * item.cantidad,
    0
  );

  // ==================================================
  // CANTIDAD TOTAL DE PRODUCTOS
  // ==================================================

  const cantidadTotal = items.reduce(
    (acc, item) =>
      acc + item.cantidad,
    0
  );

  // ==================================================
  // PROVIDER
  // ==================================================

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        total,
        cantidadTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ==================================================
// HOOK
// ==================================================

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart debe usarse dentro de CartProvider"
    );
  }

  return context;
}

