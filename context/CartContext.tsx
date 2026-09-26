"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

export interface CartItem {
  id: string;
  nombre: string;
  precio: number;
  imagen?: string;
  cantidad: number;
  stock?: number | null;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (producto: Omit<CartItem, "cantidad">) => void;
  removeFromCart: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  clearCart: () => void;
  total: number;
  cantidadTotal: number;
}

const CartContext = createContext<CartContextType | null>(null);

function leerCarrito(clave: string): CartItem[] {
  try {
    const guardado = localStorage.getItem(clave);
    if (!guardado) return [];
    const parsed: unknown = JSON.parse(guardado);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is CartItem =>
        typeof item === "object" &&
        item !== null &&
        typeof item.id === "string" &&
        typeof item.nombre === "string" &&
        typeof item.precio === "number" &&
        Number.isFinite(item.precio) &&
        item.precio >= 0 &&
        typeof item.cantidad === "number" &&
        Number.isInteger(item.cantidad) &&
        item.cantidad > 0 &&
        (item.stock == null ||
          (typeof item.stock === "number" &&
            Number.isInteger(item.stock) && item.stock >= 0)),
    );
  } catch (error) {
    console.error("No se pudo leer el carrito:", error);
    return [];
  }
}

export function CartProvider({
  children,
  catalogoId,
}: {
  children: ReactNode;
  catalogoId: string;
}) {
  const clave = `cart:${catalogoId}`;
  const [items, setItems] = useState<CartItem[]>([]);
  const [claveCargada, setClaveCargada] = useState<string | null>(null);
  const itemsRef = useRef<CartItem[]>([]);
  const claveRef = useRef<string | null>(null);

  useEffect(() => {
    // Se carga el carrito de esta tienda sin escribir [] sobre su contenido.
    const cargados = leerCarrito(clave);
    itemsRef.current = cargados;
    claveRef.current = clave;
    setItems(cargados);
    setClaveCargada(clave);
  }, [clave]);

  const actualizar = (calcular: (actuales: CartItem[]) => CartItem[]) => {
    // El usuario no puede editar mientras se carga una tienda distinta.
    if (claveRef.current !== clave || claveCargada !== clave) return;

    const siguientes = calcular(itemsRef.current);
    if (siguientes === itemsRef.current) return;

    // Persistimos durante la acción. Así, al navegar justo después de añadir
    // un producto, la página siguiente encuentra el estado actualizado.
    try {
      localStorage.setItem(clave, JSON.stringify(siguientes));
    } catch (error) {
      console.error("No se pudo guardar el carrito:", error);
    }
    itemsRef.current = siguientes;
    setItems(siguientes);
  };

  const addToCart = (producto: Omit<CartItem, "cantidad">) => {
    actualizar((actuales) => {
      const stock = producto.stock;
      if (stock != null && stock <= 0) return actuales;
      const existente = actuales.find((item) => item.id === producto.id);

      if (existente) {
        if (stock != null && existente.cantidad >= stock) return actuales;
        return actuales.map((item) =>
          item.id === producto.id
            ? {
                ...item,
                nombre: producto.nombre,
                precio: producto.precio,
                imagen: producto.imagen,
                stock,
                cantidad: item.cantidad + 1,
              }
            : item,
        );
      }
      return [...actuales, { ...producto, cantidad: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    actualizar((actuales) => actuales.filter((item) => item.id !== id));
  };

  const increaseQuantity = (id: string) => {
    actualizar((actuales) =>
      actuales.map((item) => {
        if (item.id !== id) return item;
        if (item.stock != null && item.cantidad >= item.stock) return item;
        return { ...item, cantidad: item.cantidad + 1 };
      }),
    );
  };

  const decreaseQuantity = (id: string) => {
    actualizar((actuales) =>
      actuales
        .map((item) =>
          item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item,
        )
        .filter((item) => item.cantidad > 0),
    );
  };

  const clearCart = () => actualizar(() => []);
  const itemsVisibles = claveCargada === clave ? items : [];
  const total = itemsVisibles.reduce(
    (suma, item) => suma + item.precio * item.cantidad,
    0,
  );
  const cantidadTotal = itemsVisibles.reduce(
    (suma, item) => suma + item.cantidad,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items: itemsVisibles,
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

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de CartProvider");
  return context;
}

