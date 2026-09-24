import { cache } from "react";
import { headers } from "next/headers";
import type { Metadata } from "next";

import { createClient } from "@/lib/supabase/server";
import TiendaClient from "@/components/public/TiendaClient";
import { CartProvider } from "@/context/CartContext";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;

  searchParams: Promise<{
    qr?: string;
  }>;
}

export const revalidate = 60;

const DEFAULT_THEME = {
  pais_code: "PE",
  color_primario: "#f97316",
  color_fondo: "#ffffff",
  color_header: "#1e1f1e",
  color_text_header: "#ffffff",
  color_border_header: "rgba(255,255,255,0.1)",
  color_footer: "#111827",
  color_texto: "#ffffff",
  color_precio: "#22c55e",
  color_hamburguesa: "#ffffff",
  color_tarjeta: "#ffffff10",
  color_categoria: "#ffffff",
  color_lupa: "#ffffff",
  color_fondo_categoria: "#ffffff",
  color_texto_categoria: "#111827",
  color_border_categoria: "#e5e7eb",
};

function getLogoUrl(logoPath?: string | null): string {
  if (!logoPath) {
    return "https://catalagox.com/default-share-image.png";
  }

  if (logoPath.startsWith("http://") || logoPath.startsWith("https://")) {
    return logoPath;
  }

  const archivoCodificado = encodeURIComponent(logoPath);

  return `https://yhlqooguctlzorinsxde.supabase.co/storage/v1/object/public/logos/${archivoCodificado}`;
}

function limpiarHost(valor: string | null): string {
  if (!valor) {
    return "";
  }

  return valor
    .split(",")[0]
    .trim()
    .toLowerCase()
    .split(":")[0]
    .replace(/\.$/, "");
}

function esDominioDeCatalagox(host: string): boolean {
  return (
    !host ||
    host === "catalagox.com" ||
    host === "www.catalagox.com" ||
    host === "localhost" ||
    host === "127.0.0.1" ||
    host.endsWith(".vercel.app")
  );
}

async function obtenerHostActual(): Promise<string> {
  const headersList = await headers();

  return limpiarHost(
    headersList.get("x-forwarded-host") ?? headersList.get("host"),
  );
}

function obtenerUrlTienda(host: string, slug: string): string {
  if (!esDominioDeCatalagox(host)) {
    return `https://${host}`;
  }

  return `https://catalagox.com/${slug}`;
}

const getCatalogo = cache(async (slug: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("catalogos")
    .select(
      `
      id,
      nombre,
      logo,
      user_id,
      estilo_menu,
      slug,
      color_primario,
      color_fondo,
      color_header,
      color_text_header,
      color_border_header,
      color_footer,
      color_texto,
      color_precio,
      color_hamburguesa,
      color_tarjeta,
      color_categoria,
      color_lupa,
      color_fondo_categoria,
      color_texto_categoria,
      color_border_categoria,
      whatsapp,
      instagram,
      facebook,
      tiktok,
      youtube,
      plan_vence_el,
      suscripcion_activa,
      subscription_status,
      pais_code
    `,
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  const fechaVencimiento = data.plan_vence_el
    ? new Date(data.plan_vence_el)
    : null;

  const vencida =
    !fechaVencimiento ||
    Number.isNaN(fechaVencimiento.getTime()) ||
    fechaVencimiento.getTime() < Date.now();

  const suscripcionPermitida =
    data.subscription_status === "active" ||
    data.subscription_status === "trialing" ||
    data.subscription_status === "trial";

  if (!data.suscripcion_activa || !suscripcionPermitida || vencida) {
    return null;
  }

  return {
    ...data,
    logoUrl: getLogoUrl(data.logo),
  };
});

const getCategoriasConProductos = cache(async (catalogoId: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categorias")
    .select(
      `
        id,
        nombre,
        productos (
          id,
          nombre,
          descripcion,
          precio,
          imagen_url,
          disponible,
          stock,
          slug
        )
      `,
    )
    .eq("catalogo_id", catalogoId)
    .order("created_at");

  if (error) {
    console.error("Error cargando categorías:", error);

    return null;
  }

  return data;
});

async function registrarEstadistica(userId: string, isQr: boolean) {
  try {
    const supabase = await createClient();

    const inserts = [
      {
        user_id: userId,
        tipo: "menu_view",
      },
    ];

    if (isQr) {
      inserts.push({
        user_id: userId,
        tipo: "qr_scan",
      });
    }

    await supabase.from("estadisticas").insert(inserts);
  } catch (error) {
    console.error("Error registrando estadística:", error);
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const [{ slug }, host] = await Promise.all([params, obtenerHostActual()]);

  if (!slug) {
    return {};
  }

  const catalogo = await getCatalogo(slug);

  if (!catalogo) {
    return {
      title: "Tienda no encontrada",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const slugTienda = catalogo.slug || slug;

  const urlTienda = obtenerUrlTienda(host, slugTienda);

  const titulo = `${catalogo.nombre} | Tienda Online`;

  const descripcion = `Descubre los productos, precios y novedades de ${catalogo.nombre}. Compra o realiza tu pedido directamente desde su tienda online.`;

  return {
    metadataBase: new URL(urlTienda),
    title: titulo,
    description: descripcion,

    alternates: {
      canonical: urlTienda,
    },

    robots: {
      index: true,
      follow: true,
      nocache: false,

      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    openGraph: {
      title: titulo,
      description: descripcion,
      url: urlTienda,
      siteName: catalogo.nombre,
      locale: "es_ES",
      type: "website",

      images: [
        {
          url: catalogo.logoUrl,
          width: 1200,
          height: 630,
          alt: `Logo de ${catalogo.nombre}`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: titulo,
      description: descripcion,

      images: [
        {
          url: catalogo.logoUrl,
          alt: `Logo de ${catalogo.nombre}`,
        },
      ],
    },
  };
}

export default async function TiendaPage({ params, searchParams }: PageProps) {
  const [{ slug }, { qr }, host] = await Promise.all([
    params,
    searchParams,
    obtenerHostActual(),
  ]);

  if (!slug) {
    return <div className="p-10 text-center">Enlace de tienda inválido</div>;
  }

  const catalogoDB = await getCatalogo(slug);

  if (!catalogoDB) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg-main)] p-6 text-center text-[var(--text-primary)]">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 text-red-500">
          <svg
            className="h-8 w-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="mb-2 text-xl font-bold">Tienda no disponible</h1>

        <p className="max-w-sm text-sm text-[var(--text-secondary)]">
          Esta tienda no existe o la suscripción del comercio no está activa.
        </p>
      </div>
    );
  }

  const catalogo = {
    ...DEFAULT_THEME,
    ...catalogoDB,
    logo: catalogoDB.logoUrl,
  };

  const [, categorias] = await Promise.all([
    registrarEstadistica(catalogo.user_id, Boolean(qr)),

    getCategoriasConProductos(catalogo.id),
  ]);

  if (!categorias) {
    return (
      <div className="p-10 text-center">Error al cargar los productos</div>
    );
  }

  const urlTienda = obtenerUrlTienda(host, catalogo.slug || slug);

  /*
   * En Catalagox los productos viven debajo del slug:
   * /mi-tienda/mi-producto
   *
   * En un dominio personalizado parten desde la raíz:
   * /mi-producto
   */
  const rutaBase = esDominioDeCatalagox(host)
    ? `/${catalogo.slug || slug}`
    : "";

  const schemaOrgJSONLD = {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    name: catalogo.nombre,
    url: urlTienda,
    logo: catalogo.logoUrl,

    sameAs: [
      catalogo.facebook,
      catalogo.instagram,
      catalogo.tiktok,
      catalogo.youtube,
    ].filter(Boolean),

    contactPoint: catalogo.whatsapp
      ? {
          "@type": "ContactPoint",
          telephone: catalogo.whatsapp,
          contactType: "customer service",
          availableLanguage: "Spanish",
        }
      : undefined,

    areaServed: catalogo.pais_code,
  };

  const schemaSeguro = JSON.stringify(schemaOrgJSONLD).replace(/</g, "\\u003c");

  return (
    <div
      className="relative min-h-screen w-full transition-colors duration-300"
      style={{
        backgroundColor: catalogo.color_fondo,
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: schemaSeguro,
        }}
      />

      <CartProvider key={catalogo.id} catalogoId={catalogo.id}>
        <TiendaClient
          catalogo={catalogo}
          categorias={categorias}
          countryCode={catalogo.pais_code}
          rutaBase={rutaBase}
        />
      </CartProvider>
    </div>
  );
}
