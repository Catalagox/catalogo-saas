"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface Producto {
  id: string;
  nombre: string;
  precio: number;
  descripcion?: string;
  imagen_url: string | null;
  disponible?: boolean;
  slug?: string;
}

interface Categoria {
  id: string;
  nombre: string;
  productos: Producto[];
}

interface Props {
  nombre: string;
  logo?: string | null;
  categorias: Categoria[];
  estiloMenu: "lista" | "galeria";
  countryCode?: string;

  colorFondo: string;
  colorHeader: string;
  colorTextHeader?: string;
  colorBorderHeader?: string;
  colorFooter: string;
  colorTexto: string;
  colorPrecio: string;
  colorHamburguesa: string;
  colorTarjeta: string;
  colorLupa: string;
  colorFondoCategoria: string;
  colorTextoCategoria: string;
  colorBorderCategoria: string;

  instagram?: string;
  facebook?: string;
  tiktok?: string;
  youtube?: string;
}

export default function PhonePreview({
  nombre,
  logo,
  categorias,
  estiloMenu,
  countryCode = "PE",
  colorFondo,
  colorHeader,
  colorTextHeader = "#ffffff",
  colorBorderHeader = "rgba(255,255,255,0.1)",
  colorFooter,
  colorTexto,
  colorPrecio,
  colorHamburguesa,
  colorTarjeta,
  colorLupa,
  colorFondoCategoria,
  colorTextoCategoria,
  colorBorderCategoria,
  instagram,
  facebook,
  tiktok,
  youtube,
}: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [previewRecibida, setPreviewRecibida] = useState(false);

  const previewData = useMemo(
    () => ({
      catalogo: {
        id: "preview",
        user_id: "preview",
        nombre,
        logo: logo ?? undefined,
        estilo_menu: estiloMenu,
        pais_code: countryCode,

        color_fondo: colorFondo,
        color_header: colorHeader,
        color_text_header: colorTextHeader,
        color_border_header: colorBorderHeader,
        color_footer: colorFooter,
        color_texto: colorTexto,
        color_precio: colorPrecio,
        color_hamburguesa: colorHamburguesa,
        color_tarjeta: colorTarjeta,
        color_lupa: colorLupa,
        color_fondo_categoria: colorFondoCategoria,
        color_texto_categoria: colorTextoCategoria,
        color_border_categoria: colorBorderCategoria,

        instagram,
        facebook,
        tiktok,
        youtube,
      },

      categorias: categorias.map((categoria) => ({
        ...categoria,
        productos: categoria.productos.map((producto) => ({
          ...producto,
          imagen_url: producto.imagen_url ?? undefined,
          slug: producto.slug ?? `preview-${producto.id}`,
        })),
      })),

      countryCode,
    }),
    [
      nombre,
      logo,
      categorias,
      estiloMenu,
      countryCode,
      colorFondo,
      colorHeader,
      colorTextHeader,
      colorBorderHeader,
      colorFooter,
      colorTexto,
      colorPrecio,
      colorHamburguesa,
      colorTarjeta,
      colorLupa,
      colorFondoCategoria,
      colorTextoCategoria,
      colorBorderCategoria,
      instagram,
      facebook,
      tiktok,
      youtube,
    ],
  );

  const enviarDatos = useCallback(() => {
    iframeRef.current?.contentWindow?.postMessage(
      {
        type: "CATALOGO_PREVIEW",
        payload: previewData,
      },
      window.location.origin,
    );
  }, [previewData]);

  // Si cambian colores, logo o productos, se vuelve a enviar la preview.
  useEffect(() => {
    setPreviewRecibida(false);
  }, [previewData]);

  // Recibe los mensajes enviados desde /preview-catalogo.
  useEffect(() => {
    const recibirMensaje = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === "CATALOGO_PREVIEW_LISTO") {
        enviarDatos();
      }

      if (event.data?.type === "CATALOGO_PREVIEW_RECIBIDO") {
        setPreviewRecibida(true);
      }
    };

    window.addEventListener("message", recibirMensaje);

    return () => {
      window.removeEventListener("message", recibirMensaje);
    };
  }, [enviarDatos]);

  // Reintenta mientras el iframe termina de cargar y hasta confirmar recepción.
  useEffect(() => {
    if (previewRecibida) return;

    enviarDatos();

    const intervalo = window.setInterval(enviarDatos, 300);

    return () => {
      window.clearInterval(intervalo);
    };
  }, [previewRecibida, enviarDatos]);

  return (
    <div
      className="
    w-full max-w-[320px]
    h-[650px] max-h-[calc(100dvh-2rem)]
    rounded-[42px]
    border-[10px] border-zinc-200
    bg-zinc-200
    shadow-[0_0_0_2px_rgba(255,255,255,0.25),0_25px_50px_rgba(0,0,0,0.45)]
    overflow-hidden
    flex flex-col
  "
    >
      <div className="h-6 shrink-0 flex items-center justify-center bg-zinc-200">
        <div className="w-28 h-4 rounded-full bg-zinc-900" />
      </div>

      <iframe
        ref={iframeRef}
        src="/preview-catalogo"
        title="Vista previa del catálogo"
        onLoad={enviarDatos}
        className="w-full flex-1 border-0 bg-white"
      />
    </div>
  );
}
