"use client";

import {
  useEffect,
  useState,
  type CSSProperties,
} from "react";

import TiendaHeader from "@/components/public/TiendaHeader";
import TiendaFooter from "@/components/public/TiendaFooter";
import TiendaLista from "@/components/public/TiendaLista";
import TiendaGaleria from "@/components/public/TiendaGaleria";
import CategoriasSlider from "@/components/public/CategoriasSlider";

interface Producto {
  id: string;
  nombre: string;
  precio: number;
  descripcion?: string | null;
  imagen_url?: string | null;
  disponible?: boolean | null;
  stock?: number | null;
  slug: string;
}

interface Categoria {
  id: string;
  nombre: string;
  productos: Producto[];
}

interface PreviewData {
  catalogo: {
    id: string;
    user_id: string;
    nombre: string;
    logo?: string | null;
    slug?: string | null;
    estilo_menu: "lista" | "galeria";
    pais_code: string;

    color_primario?: string | null;
    color_fondo: string;
    color_header: string;
    color_text_header: string;
    color_border_header: string;
    color_footer: string;
    color_texto: string;
    color_precio: string;
    color_hamburguesa: string;
    color_tarjeta: string;
    color_categoria?: string | null;
    color_lupa: string;
    color_fondo_categoria: string;
    color_texto_categoria: string;
    color_border_categoria: string;

    whatsapp?: string | null;
    instagram?: string | null;
    facebook?: string | null;
    tiktok?: string | null;
    youtube?: string | null;
  };

  categorias: Categoria[];
  countryCode: string;
}

function ignorarTracking(): void {
  // La vista previa no registra estadísticas.
}

export default function PreviewCatalogoPage() {
  const [preview, setPreview] =
    useState<PreviewData | null>(null);

  useEffect(() => {
    const recibirDatos = (
      event: MessageEvent,
    ) => {
      if (
        event.origin !== window.location.origin
      ) {
        return;
      }

      if (
        event.data?.type !==
        "CATALOGO_PREVIEW"
      ) {
        return;
      }

      const payload =
        event.data.payload as
          | PreviewData
          | undefined;

      if (
        !payload?.catalogo ||
        !Array.isArray(payload.categorias)
      ) {
        return;
      }

      setPreview(payload);

      /*
       * Confirma a la ventana principal que
       * los datos fueron recibidos.
       */
      window.parent.postMessage(
        {
          type: "CATALOGO_PREVIEW_RECIBIDO",
        },
        event.origin,
      );
    };

    window.addEventListener(
      "message",
      recibirDatos,
    );

    /*
     * Avisa a la ventana principal que la vista
     * previa está lista para recibir datos.
     */
    if (window.parent !== window) {
      window.parent.postMessage(
        {
          type: "CATALOGO_PREVIEW_LISTO",
        },
        window.location.origin,
      );
    }

    return () => {
      window.removeEventListener(
        "message",
        recibirDatos,
      );
    };
  }, []);

  if (!preview) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-100 text-xs text-zinc-500">
        Cargando vista previa...
      </div>
    );
  }

  const {
    catalogo,
    categorias,
    countryCode,
  } = preview;

  const categoriasSeguras = Array.isArray(
    categorias,
  )
    ? categorias
    : [];

  /*
   * Si el catálogo ya tiene slug, los productos
   * abrirán la tienda pública real.
   *
   * Si todavía no tiene slug, permanecemos
   * dentro de la página de vista previa.
   */
  const slugTienda =
    catalogo.slug?.trim();

  const rutaBase = slugTienda
    ? `/${slugTienda}`
    : "/preview-catalogo";

  const theme = {
    "--color-bg":
      catalogo.color_fondo,
    "--color-header":
      catalogo.color_header,
    "--color-text-header":
      catalogo.color_text_header,
    "--color-border-header":
      catalogo.color_border_header,
    "--color-footer":
      catalogo.color_footer,
    "--color-text":
      catalogo.color_texto,
    "--color-price":
      catalogo.color_precio,
    "--color-hamburguesa":
      catalogo.color_hamburguesa,
    "--color-card":
      catalogo.color_tarjeta,
    "--color-categoria":
      catalogo.color_categoria ??
      "#eae9e9",
    "--color-primary":
      catalogo.color_primario ??
      "#f97316",
    "--color-lupa":
      catalogo.color_lupa,
    "--color-fondo-categoria":
      catalogo.color_fondo_categoria,
    "--color-texto-categoria":
      catalogo.color_texto_categoria,
    "--color-border-categoria":
      catalogo.color_border_categoria,
  } as CSSProperties;

  return (
    <div
      className="flex min-h-screen w-full flex-col bg-[var(--color-bg)]"
      style={theme}
    >
      <TiendaHeader
        catalogo={catalogo}
        categorias={categoriasSeguras}
        rutaBase={rutaBase}
      />

      <CategoriasSlider
        categorias={categoriasSeguras}
        onTrackCategoria={
          ignorarTracking
        }
        colorFondoCategoria={
          catalogo.color_fondo_categoria
        }
        colorTextoCategoria={
          catalogo.color_texto_categoria
        }
        colorBorderCategoria={
          catalogo.color_border_categoria
        }
        colorHeader={
          catalogo.color_header
        }
        colorTextHeader={
          catalogo.color_text_header
        }
        colorBorderHeader={
          catalogo.color_border_header
        }
      />

      <main className="w-full flex-grow px-0 pt-8">
        {catalogo.estilo_menu ===
        "lista" ? (
          <TiendaLista
            categorias={
              categoriasSeguras
            }
            countryCode={countryCode}
            rutaBase={rutaBase}
            colorFondoCategoria={
              catalogo.color_fondo_categoria
            }
            colorTextoCategoria={
              catalogo.color_texto_categoria
            }
            colorBorderCategoria={
              catalogo.color_border_categoria
            }
          />
        ) : (
          <TiendaGaleria
            categorias={
              categoriasSeguras
            }
            countryCode={countryCode}
            rutaBase={rutaBase}
            colorFondoCategoria={
              catalogo.color_fondo_categoria
            }
            colorTextoCategoria={
              catalogo.color_texto_categoria
            }
            colorBorderCategoria={
              catalogo.color_border_categoria
            }
          />
        )}
      </main>

      <TiendaFooter
        instagram={catalogo.instagram}
        facebook={catalogo.facebook}
        tiktok={catalogo.tiktok}
        youtube={catalogo.youtube}
        nombreTienda={catalogo.nombre}
      />
    </div>
  );
}