"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface Producto {
  id: string;
  nombre: string;
  precio: number;
  descripcion?: string | null;
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

  useEffect(() => {
    const recibirMensaje = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.source !== iframeRef.current?.contentWindow) return;

      if (
        !event.data ||
        typeof event.data !== "object"
      ) {
        return;
      }

      if (event.data.type === "CATALOGO_PREVIEW_LISTO") {
        enviarDatos();
      }

      if (event.data.type === "CATALOGO_PREVIEW_RECIBIDO") {
        setPreviewRecibida(true);
      }
    };

    window.addEventListener("message", recibirMensaje);

    return () => {
      window.removeEventListener("message", recibirMensaje);
    };
  }, [enviarDatos]);

  // Envía los cambios y reintenta hasta recibir confirmación.
  useEffect(() => {
    setPreviewRecibida(false);

    enviarDatos();

    const intervalo = window.setInterval(enviarDatos, 300);

    const recibirConfirmacion = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.source !== iframeRef.current?.contentWindow) return;

      if (event.data?.type === "CATALOGO_PREVIEW_RECIBIDO") {
        window.clearInterval(intervalo);
      }
    };

    window.addEventListener("message", recibirConfirmacion);

    return () => {
      window.clearInterval(intervalo);
      window.removeEventListener("message", recibirConfirmacion);
    };
  }, [enviarDatos]);

  return (
    <div className="mx-auto w-full max-w-[320px] text-[var(--text-primary)]">
      <div className="mb-3 flex items-center justify-between gap-3 px-1">
        <p className="text-sm font-semibold">
          Vista previa móvil
        </p>

        <span
          role="status"
          className="text-xs text-[var(--text-secondary)]"
        >
          {previewRecibida ? "Actualizada" : "Actualizando..."}
        </span>
      </div>

      <div className="flex h-[650px] max-h-[calc(100dvh-6rem)] min-h-[280px] w-full flex-col overflow-hidden rounded-[42px] border-[10px] border-[var(--border-card)] bg-[var(--bg-secondary)] shadow-xl">
        <div
          aria-hidden="true"
          className="flex h-6 shrink-0 items-center justify-center bg-[var(--bg-secondary)]"
        >
          <div className="h-3 w-24 rounded-full bg-[var(--text-primary)]" />
        </div>

        <iframe
          ref={iframeRef}
          src="/preview-catalogo"
          title="Vista previa de tu tienda en móvil"
          onLoad={() => {
            setPreviewRecibida(false);
            enviarDatos();
          }}
          className="min-h-0 w-full flex-1 border-0"
          style={{ backgroundColor: colorFondo }}
        />
      </div>
    </div>
  );
}