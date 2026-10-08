import { cache } from "react";
import { headers } from "next/headers";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { obtenerDisenoPublicado } from "@/lib/tienda-diseno/server";
import TiendaLayout from "@/components/public/TiendaLayout";

interface PageProps {
  params: Promise<{ slug: string; pagina: string }>;
}

export const dynamic = "force-dynamic";

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
  if (!valor) return "";
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
  if (error) {
    console.error("Error cargando la tienda:", error);
    return null;
  }
  if (!data) return null;
  const { data: accesoGratis, error: accesoGratisError } = await supabase.rpc(
    "catalogo_con_acceso_gratis",
    {
      p_catalogo_id: data.id,
    },
  );
  if (accesoGratisError) {
    console.error("Error comprobando el acceso gratis:", accesoGratisError);
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
  const accesoPorSuscripcion =
    data.suscripcion_activa && suscripcionPermitida && !vencida;
  if (!accesoPorSuscripcion && accesoGratis !== true) {
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

const getPaginaData = cache(async (slug: string, paginaSlug: string) => {
  if (!slug || !paginaSlug || paginaSlug.length > 100 || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(paginaSlug)) return null;

  // Usa exactamente las condiciones de acceso de la tienda principal.
  const catalogo = await getCatalogo(slug);
  if (!catalogo) return null;

  const supabase = await createClient();
  const { data: pagina, error } = await supabase
    .from("paginas_tienda")
    .select("id, catalogo_id, titulo, slug, contenido, estado, created_at, updated_at")
    .eq("catalogo_id", catalogo.id)
    .eq("slug", paginaSlug)
    .eq("estado", "publicada")
    .maybeSingle();

  if (error) {
    console.error("Error cargando la página de la tienda:", error);
    throw new Error("No pudimos cargar esta página.");
  }
  if (!pagina) return null;

  return { catalogo, pagina };
});

function obtenerUrlPagina(host: string, slugTienda: string, slugPagina: string) {
  return `${obtenerUrlTienda(host, slugTienda)}/paginas/${encodeURIComponent(slugPagina)}`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const [{ slug, pagina: paginaSlug }, host] = await Promise.all([params, obtenerHostActual()]);
  const data = await getPaginaData(slug, paginaSlug);
  if (!data) {
    return { title: "Página no encontrada", robots: { index: false, follow: false } };
  }

  const { catalogo, pagina } = data;
  const titulo = `${pagina.titulo} | ${catalogo.nombre}`;
  const descripcion = pagina.contenido.trim().replace(/\s+/g, " ").slice(0, 160)
    || `${pagina.titulo} de ${catalogo.nombre}.`;
  const urlPagina = obtenerUrlPagina(host, catalogo.slug || slug, pagina.slug);

  return {
    metadataBase: new URL(urlPagina),
    title: titulo,
    description: descripcion,
    alternates: { canonical: urlPagina },
    robots: { index: true, follow: true },
    openGraph: {
      title: titulo,
      description: descripcion,
      url: urlPagina,
      siteName: catalogo.nombre,
      locale: "es_ES",
      type: "website",
      images: [{ url: catalogo.logoUrl, width: 1200, height: 630, alt: `Logo de ${catalogo.nombre}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: titulo,
      description: descripcion,
      images: [catalogo.logoUrl],
    },
  };
}

export default async function PaginaPublicaPage({ params }: PageProps) {
  const [{ slug, pagina: paginaSlug }, host] = await Promise.all([params, obtenerHostActual()]);
  const data = await getPaginaData(slug, paginaSlug);
  if (!data) notFound();

  const { catalogo: catalogoDB, pagina } = data;
  const [diseno, categorias] = await Promise.all([
    obtenerDisenoPublicado(catalogoDB.id, catalogoDB),
    getCategoriasConProductos(catalogoDB.id),
  ]);
  if (!categorias) throw new Error("No pudimos cargar las categorías de la tienda.");

  const catalogo = {
    ...catalogoDB,
    ...diseno.config,
    pais_code: catalogoDB.pais_code ?? "PE",
    logo: catalogoDB.logoUrl,
  };
  const slugTienda = catalogo.slug || slug;
  const rutaBase = esDominioDeCatalagox(host) ? `/${slugTienda}` : "";

  return (
    <div className="relative min-h-screen w-full" style={{ backgroundColor: diseno.config.color_fondo }}>
      <TiendaLayout
        key={catalogo.id}
        catalogo={catalogo}
        categorias={categorias}
        rutaBase={rutaBase}
        config={diseno.config}
      >
        <main className="min-h-[60vh] bg-[var(--color-bg)] text-[var(--color-text)]">
          <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
            <Link
              href={rutaBase || "/"}
              className="mb-6 inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-semibold outline-none hover:underline focus-visible:ring-2 focus-visible:ring-current"
            >
              Volver a la tienda
            </Link>
            <article className="min-w-0 space-y-6">
              <h1 className="break-words text-3xl font-bold leading-tight sm:text-4xl">{pagina.titulo}</h1>
              <div className="whitespace-pre-wrap break-words text-base leading-8">{pagina.contenido}</div>
            </article>
          </div>
        </main>
      </TiendaLayout>
    </div>
  );
}
