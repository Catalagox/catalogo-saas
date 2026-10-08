"use client";

import { useMemo, useState, type ReactNode } from "react";

import { CartProvider, useCart } from "@/context/CartContext";

import TiendaHeader from "@/components/public/TiendaHeader";
import TiendaFooter from "@/components/public/TiendaFooter";
import CartDrawer from "@/components/public/CartDrawer";
import MisPedidosPanel from "@/components/public/MisPedidosPanel";

import { normalizarConfig } from "@/lib/tienda-diseno/config";
import { crearTemaTienda } from "@/lib/tienda-diseno/theme";

import type { ConfigDiseno } from "@/lib/tienda-diseno/types";

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

  estilo_menu?: "lista" | "galeria" | null;

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
  config?: ConfigDiseno;
  children: ReactNode;
};

function ContenidoTienda({
  catalogo,
  categorias,
  rutaBase,
  config,
  children,
}: Props) {
  const { cantidadTotal } = useCart();

  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [pedidosAbiertos, setPedidosAbiertos] = useState(false);

  // El respaldo mantiene compatibles las llamadas antiguas.
  const configAplicada = useMemo(
    () => normalizarConfig(config ?? catalogo),
    [config, catalogo],
  );

  const tema = useMemo(() => crearTemaTienda(configAplicada), [configAplicada]);

  const catalogoVisual = {
    ...catalogo,
    ...configAplicada,
  };

  return (
    <div
      className="relative flex min-h-screen w-full flex-col bg-[var(--color-bg)] text-[var(--color-text)]"
      style={{
        ...tema,
        fontFamily: "var(--tienda-font-family)",
        fontSize: "var(--tienda-font-size)",
      }}
    >
      <TiendaHeader
        catalogo={catalogoVisual}
        categorias={categorias}
        rutaBase={rutaBase}
        config={config}
        cartCount={cantidadTotal}
        onOpenCart={() => {
          setPedidosAbiertos(false);
          setCarritoAbierto(true);
        }}
        onOpenOrders={() => {
          setCarritoAbierto(false);
          setPedidosAbiertos(true);
        }}
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
