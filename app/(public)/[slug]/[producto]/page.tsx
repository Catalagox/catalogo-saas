import { cache } from "react";
import { headers } from "next/headers";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ShieldCheck, Truck } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { obtenerDisenoPublicado } from "@/lib/tienda-diseno/server";

import BackButton from "@/components/public/BackButton";
import BotonCompartir from "@/components/public/BotonCompartir";
import AccionesProducto from "@/components/public/AccionesProducto";
import StockBadge from "@/components/public/StockBadge";
import TiendaLayout from "@/components/public/TiendaLayout";
import Price from "@/components/ui/Price";

interface PageProps {
  params: Promise<{
    slug: string;
    producto: string;
  }>;
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

const blurDataURL =
  "data:image/svg+xml;base64," +
  "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+";

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

function obtenerUrlProducto(
  host: string,
  slugTienda: string,
  slugProducto: string,
): string {
  if (!esDominioDeCatalagox(host)) {
    return `https://${host}/${slugProducto}`;
  }

  return `https://catalagox.com/${slugTienda}/${slugProducto}`;
}

function obtenerLogoUrl(logoPath?: string | null): string | null {
  if (!logoPath) return null;

  if (logoPath.startsWith("http://") || logoPath.startsWith("https://")) {
    return logoPath;
  }

  return (
    "https://yhlqooguctlzorinsxde.supabase.co/storage/v1/object/public/logos/" +
    encodeURIComponent(logoPath)
  );
}

// Comparte la consulta entre los metadatos y el contenido
// durante el renderizado de esta página.
const getProductoData = cache(async (slug: string, productoSlug: string) => {
  if (!slug || !productoSlug) return null;

  const supabase = await createClient();

  const { data: catalogo, error: errorCatalogo } = await supabase
    .from("catalogos")
    .select(
      `
        id,
        user_id,
        nombre,
        slug,
        logo,
        pais_code,
        whatsapp,
        estilo_menu,
        color_header,
        color_text_header,
        color_border_header,
        color_footer,
        color_hamburguesa,
        color_categoria,
        color_lupa,
        color_fondo_categoria,
        color_texto_categoria,
        color_border_categoria,
        instagram,
        facebook,
        tiktok,
        youtube,
        color_primario,
        color_fondo,
        color_texto,
        color_precio,
        color_tarjeta,
        plan_vence_el,
        suscripcion_activa,
        subscription_status
      `,
    )
    .eq("slug", slug)
    .maybeSingle();

  if (errorCatalogo) {
    console.error("Error cargando la tienda:", errorCatalogo);
    return null;
  }

  if (!catalogo) return null;

  const { data: accesoGratis, error: accesoGratisError } = await supabase.rpc(
    "catalogo_con_acceso_gratis",
    {
      p_catalogo_id: catalogo.id,
    },
  );

  if (accesoGratisError) {
    console.error("Error comprobando el acceso gratis:", accesoGratisError);
    return null;
  }

  const fechaVencimiento = catalogo.plan_vence_el
    ? new Date(catalogo.plan_vence_el)
    : null;

  const planVencido =
    !fechaVencimiento ||
    Number.isNaN(fechaVencimiento.getTime()) ||
    fechaVencimiento.getTime() < Date.now();

  const suscripcionPermitida =
    catalogo.subscription_status === "active" ||
    catalogo.subscription_status === "trialing" ||
    catalogo.subscription_status === "trial";

  const accesoPorSuscripcion =
    catalogo.suscripcion_activa && suscripcionPermitida && !planVencido;

  if (!accesoPorSuscripcion && accesoGratis !== true) {
    return null;
  }

  const { data: producto, error: errorProducto } = await supabase
    .from("productos")
    .select("*")
    .eq("catalogo_id", catalogo.id)
    .eq("slug", productoSlug)
    .maybeSingle();

  if (errorProducto) {
    console.error("Error cargando el producto:", errorProducto);
    return null;
  }

  if (!producto) return null;

  return { catalogo, producto };
});

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const [{ slug, producto: productoSlug }, host] = await Promise.all([
    params,
    obtenerHostActual(),
  ]);

  const data = await getProductoData(slug, productoSlug);

  if (!data) {
    return {
      title: "Producto no encontrado",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const { producto, catalogo } = data;

  const titulo = `${producto.nombre} | ${catalogo.nombre}`;

  const descripcion = producto.descripcion
    ? `${producto.descripcion.substring(0, 150)}... ¡Pídelo aquí!`
    : `Mira nuestro producto ${producto.nombre} en ${catalogo.nombre}.`;

  const imagenUrl =
    producto.imagen_url || "https://catalagox.com/default-share-image.png";

  const urlProducto = obtenerUrlProducto(
    host,
    catalogo.slug || slug,
    producto.slug || productoSlug,
  );

  return {
    metadataBase: new URL(urlProducto),
    title: titulo,
    description: descripcion,
    alternates: {
      canonical: urlProducto,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: titulo,
      description: descripcion,
      url: urlProducto,
      siteName: catalogo.nombre,
      images: [
        {
          url: imagenUrl,
          width: 800,
          height: 600,
          alt: producto.nombre,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: titulo,
      description: descripcion,
      images: [imagenUrl],
    },
  };
}

export default async function ProductoPage({ params }: PageProps) {
  const { slug, producto: productoSlug } = await params;

  const supabase = await createClient();

  const [data, host] = await Promise.all([
    getProductoData(slug, productoSlug),
    obtenerHostActual(),
  ]);

  if (!data) {
    notFound();
  }

  const { catalogo: catalogoDB, producto } = data;

  const [diseno, resultadoCategorias] = await Promise.all([
    obtenerDisenoPublicado(catalogoDB.id, catalogoDB),

    supabase
      .from("categorias")
      .select("id, nombre, productos(id, nombre, imagen_url, slug)")
      .eq("catalogo_id", catalogoDB.id)
      .order("created_at"),
  ]);

  if (resultadoCategorias.error) {
    console.error(
      "No se pudieron cargar las categorías del producto:",
      resultadoCategorias.error,
    );
  }

  const categorias = resultadoCategorias.data ?? [];

  // Los colores publicados tienen prioridad sobre los antiguos.
  const catalogo = {
    ...catalogoDB,
    ...diseno.config,
    pais_code: catalogoDB.pais_code ?? "PE",
    logo: obtenerLogoUrl(catalogoDB.logo),
  };

  const rutaBase = esDominioDeCatalagox(host)
    ? `/${catalogo.slug || slug}`
    : "";

  try {
    const { error } = await supabase.from("estadisticas").insert({
      user_id: catalogo.user_id,
      tipo: "producto_view",
    });

    if (error) {
      console.error("Error registrando la vista del producto:", error);
    }
  } catch (error) {
    console.error("Error registrando la vista del producto:", error);
  }

  const userCountry = catalogo.pais_code;
  const colorPrimario = diseno.config.color_primario;

  return (
    <TiendaLayout
      key={catalogo.id}
      catalogo={catalogo}
      categorias={categorias}
      rutaBase={rutaBase}
      config={diseno.config}
    >
      <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-200">
        <div className="mx-auto max-w-7xl px-4 pb-32 pt-4 sm:px-6 sm:pt-7 lg:px-8 lg:pt-9">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12 xl:gap-16">
            {/* Imagen */}
            <div className="lg:col-span-7">
              <div
                className="relative aspect-square w-full overflow-hidden rounded-2xl border border-black/[0.06] shadow-sm sm:aspect-[4/3] sm:rounded-3xl lg:aspect-square dark:border-white/[0.08]"
                style={{
                  backgroundColor: "var(--color-card)",
                }}
              >
                <div className="absolute left-3 top-3 z-20 sm:left-4 sm:top-4">
                  <BackButton />
                </div>

                {producto.imagen_url ? (
                  <Image
                    src={producto.imagen_url}
                    alt={producto.nombre}
                    fill
                    priority
                    quality={90}
                    placeholder="blur"
                    blurDataURL={blurDataURL}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 58vw"
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.025]"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="text-sm font-medium opacity-40">
                      Sin imagen disponible
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Información */}
            <div className="lg:sticky lg:top-8 lg:col-span-5">
              <div className="space-y-6 sm:space-y-7">
                <div>
                  <h1 className="text-3xl font-extrabold leading-[1.05] tracking-tight sm:text-4xl lg:text-[42px]">
                    {producto.nombre}
                  </h1>
                </div>

                <div className="border-b border-black/[0.07] pb-6 dark:border-white/[0.09]">
                  <div className="text-4xl font-extrabold tracking-tight text-[var(--color-price)] sm:text-5xl">
                    <Price amount={producto.precio} countryCode={userCountry} />
                  </div>
                </div>

                {producto.descripcion && (
                  <div>
                    <p className="whitespace-pre-line text-[15px] leading-7 opacity-70 sm:text-base">
                      {producto.descripcion}
                    </p>
                  </div>
                )}

                {/* Stock, compartir y carrito */}
                <div
                  className="rounded-2xl border border-black/[0.06] p-4 sm:p-5 dark:border-white/[0.08]"
                  style={{
                    backgroundColor: "var(--color-card)",
                  }}
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <StockBadge
                        stock={producto.stock}
                        disponible={producto.disponible}
                        mostrarTextoCompleto={true}
                      />
                    </div>

                    <div className="shrink-0">
                      <BotonCompartir titulo={producto.nombre} />
                    </div>
                  </div>

                  <AccionesProducto
                    producto={producto}
                    colorPrimario={colorPrimario}
                  />
                </div>

                {/* Beneficios */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-3 rounded-xl border border-black/[0.05] p-3.5 dark:border-white/[0.08]">
                    <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full">
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 opacity-10"
                        style={{
                          backgroundColor: colorPrimario,
                        }}
                      />

                      <ShieldCheck
                        size={18}
                        className="relative"
                        style={{
                          color: colorPrimario,
                        }}
                        aria-hidden="true"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-bold">Pedido seguro</p>

                      <p className="mt-0.5 text-[11px] opacity-55">
                        Compra directamente
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl border border-black/[0.05] p-3.5 dark:border-white/[0.08]">
                    <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full">
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 opacity-10"
                        style={{
                          backgroundColor: colorPrimario,
                        }}
                      />

                      <Truck
                        size={18}
                        className="relative"
                        style={{
                          color: colorPrimario,
                        }}
                        aria-hidden="true"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-bold">Atención directa</p>

                      <p className="mt-0.5 text-[11px] opacity-55">
                        Pedido por WhatsApp
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </TiendaLayout>
  );
}
