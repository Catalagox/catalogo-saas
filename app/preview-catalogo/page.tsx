"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

import MenuHeader from "@/components/public/MenuHeader";
import MenuFooter from "@/components/public/MenuFooter";
import MenuLista from "@/components/public/MenuLista";
import MenuGaleria from "@/components/public/MenuGaleria";
import CategoriasSlider from "@/components/public/CategoriasSlider";

type Producto = {
  id: string;
  nombre: string;
  precio: number;
  descripcion?: string;
  imagen_url?: string;
  disponible?: boolean;
  slug: string;
};

type Categoria = {
  id: string;
  nombre: string;
  productos: Producto[];
};

type PreviewData = {
  catalogo: {
    id: string;
    user_id: string;
    nombre: string;
    logo?: string;
    estilo_menu: "lista" | "galeria";
    pais_code: string;

    color_fondo: string;
    color_header: string;
    color_text_header: string;
    color_border_header: string;
    color_footer: string;
    color_texto: string;
    color_precio: string;
    color_hamburguesa: string;
    color_tarjeta: string;
    color_lupa: string;
    color_fondo_categoria: string;
    color_texto_categoria: string;
    color_border_categoria: string;

    instagram?: string;
    facebook?: string;
    tiktok?: string;
    youtube?: string;
  };

  categorias: Categoria[];
  countryCode: string;
};

export default function PreviewCatalogoPage() {
  const [preview, setPreview] = useState<PreviewData | null>(null);

  useEffect(() => {
    const recibirDatos = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type !== "CATALOGO_PREVIEW") return;

      setPreview(event.data.payload);

      // Confirma al teléfono que ya recibió los datos.
      window.parent.postMessage(
        { type: "CATALOGO_PREVIEW_RECIBIDO" },
        event.origin
      );
    };

    window.addEventListener("message", recibirDatos);

    // Avisa al teléfono que esta página ya está lista para recibir datos.
    if (window.parent !== window) {
      window.parent.postMessage(
        { type: "CATALOGO_PREVIEW_LISTO" },
        window.location.origin
      );
    }

    return () => {
      window.removeEventListener("message", recibirDatos);
    };
  }, []);

  if (!preview) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-100 text-xs text-zinc-500">
        Cargando vista previa...
      </div>
    );
  }

  const { catalogo, categorias, countryCode } = preview;

  const theme = {
    "--color-bg": catalogo.color_fondo,
    "--color-header": catalogo.color_header,
    "--color-text-header": catalogo.color_text_header,
    "--color-border-header": catalogo.color_border_header,
    "--color-footer": catalogo.color_footer,
    "--color-text": catalogo.color_texto,
    "--color-price": catalogo.color_precio,
    "--color-hamburguesa": catalogo.color_hamburguesa,
    "--color-card": catalogo.color_tarjeta,
    "--color-lupa": catalogo.color_lupa,
    "--color-fondo-categoria": catalogo.color_fondo_categoria,
    "--color-texto-categoria": catalogo.color_texto_categoria,
    "--color-border-categoria": catalogo.color_border_categoria,
  } as CSSProperties;

  return (
    <div
      className="min-h-screen w-full flex flex-col bg-[var(--color-bg)]"
      style={theme}
    >
      <MenuHeader catalogo={catalogo} categorias={categorias} />

      <CategoriasSlider
        categorias={categorias}
        onTrackCategoria={() => {}}
        colorFondoCategoria={catalogo.color_fondo_categoria}
        colorTextoCategoria={catalogo.color_texto_categoria}
        colorBorderCategoria={catalogo.color_border_categoria}
        colorHeader={catalogo.color_header}
        colorTextHeader={catalogo.color_text_header}
        colorBorderHeader={catalogo.color_border_header}
      />

      <main className="w-full px-0 pt-8 flex-grow">
        {catalogo.estilo_menu === "lista" ? (
          <MenuLista
            categorias={categorias}
            countryCode={countryCode}
            colorFondoCategoria={catalogo.color_fondo_categoria}
            colorTextoCategoria={catalogo.color_texto_categoria}
            colorBorderCategoria={catalogo.color_border_categoria}
          />
        ) : (
          <MenuGaleria
            categorias={categorias}
            slug="preview"
            countryCode={countryCode}
            colorFondoCategoria={catalogo.color_fondo_categoria}
            colorTextoCategoria={catalogo.color_texto_categoria}
            colorBorderCategoria={catalogo.color_border_categoria}
          />
        )}
      </main>

      <MenuFooter
        instagram={catalogo.instagram}
        facebook={catalogo.facebook}
        tiktok={catalogo.tiktok}
        youtube={catalogo.youtube}
      />
    </div>
  );
}