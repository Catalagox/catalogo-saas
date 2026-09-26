"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { CartProvider, useCart } from "@/context/CartContext";
import TiendaHeader from "@/components/public/TiendaHeader";
import TiendaFooter from "@/components/public/TiendaFooter";
import CartDrawer from "@/components/public/CartDrawer";
import MisPedidosPanel from "@/components/public/MisPedidosPanel";

type Categoria = {
  id: string;
  nombre: string;
  productos?: {
    id: string;
    nombre: string;
    imagen_url?: string | null;
    slug?: string;
  }[];
};

type Catalogo = {
  id: string;
  nombre: string;
  logo?: string | null;
  slug?: string | null;
  whatsapp?: string | null;
  pais_code?: string | null;
  color_primario?: string | null;
  color_fondo?: string | null;
  color_header?: string | null;
  color_text_header?: string | null;
  color_border_header?: string | null;
  color_footer?: string | null;
  color_texto?: string | null;
  color_precio?: string | null;
  color_hamburguesa?: string | null;
  color_tarjeta?: string | null;
  color_categoria?: string | null;
  color_lupa?: string | null;
  color_fondo_categoria?: string | null;
  color_texto_categoria?: string | null;
  color_border_categoria?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  tiktok?: string | null;
  youtube?: string | null;
};

type Props = {
  catalogo: Catalogo;
  categorias: Categoria[];
  rutaBase: string;
  children: ReactNode;
};

function ContenidoTienda({ catalogo, categorias, rutaBase, children }: Props) {
  const { cantidadTotal } = useCart();
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [pedidosAbiertos, setPedidosAbiertos] = useState(false);

  const tema = {
    "--color-bg": catalogo.color_fondo ?? "#fefefe",
    "--color-header": catalogo.color_header ?? "#2c2c2c",
    "--color-text-header": catalogo.color_text_header ?? "#ffffff",
    "--color-border-header": catalogo.color_border_header ?? "rgba(255,255,255,0.1)",
    "--color-footer": catalogo.color_footer ?? "#111827",
    "--color-text": catalogo.color_texto ?? "#4f4d4d",
    "--color-price": catalogo.color_precio ?? "#22c55e",
    "--color-hamburguesa": catalogo.color_hamburguesa ?? "#ffffff",
    "--color-card": catalogo.color_tarjeta ?? "#ffffff10",
    "--color-categoria": catalogo.color_categoria ?? "#eae9e9",
    "--color-primary": catalogo.color_primario ?? "#f97316",
    "--color-lupa": catalogo.color_lupa ?? "#ffffff",
    "--color-fondo-categoria": catalogo.color_fondo_categoria ?? "#ffffff",
    "--color-texto-categoria": catalogo.color_texto_categoria ?? "#111827",
    "--color-border-categoria": catalogo.color_border_categoria ?? "#e5e7eb",
  } as CSSProperties;

  return (
    <div
      className="relative flex min-h-screen w-full flex-col bg-[var(--color-bg)] text-[var(--color-text)]"
      style={tema}
    >
      <TiendaHeader
        catalogo={catalogo}
        categorias={categorias}
        rutaBase={rutaBase}
        cartCount={cantidadTotal}
        onOpenCart={() => { setPedidosAbiertos(false); setCarritoAbierto(true); }}
        onOpenOrders={() => { setCarritoAbierto(false); setPedidosAbiertos(true); }}
      />

      {children}

      <TiendaFooter
        instagram={catalogo.instagram ?? undefined}
        facebook={catalogo.facebook ?? undefined}
        tiktok={catalogo.tiktok ?? undefined}
        youtube={catalogo.youtube ?? undefined}
        nombreTienda={catalogo.nombre}
      />

      <MisPedidosPanel
        isOpen={pedidosAbiertos}
        onClose={() => setPedidosAbiertos(false)}
        catalogoId={catalogo.id}
      />

      <CartDrawer
        isOpen={carritoAbierto}
        onClose={() => setCarritoAbierto(false)}
        catalogoId={catalogo.id}
        catalogoNombre={catalogo.nombre}
        whatsapp={catalogo.whatsapp ?? undefined}
        userCountry={catalogo.pais_code ?? "PE"}
      />
    </div>
  );
}

export default function TiendaLayout(props: Props) {
  return (
    <CartProvider key={props.catalogo.id} catalogoId={props.catalogo.id}>
      <ContenidoTienda {...props} />
    </CartProvider>
  );
}
