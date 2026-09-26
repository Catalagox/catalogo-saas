import type { CSSProperties } from "react";
import { headers } from "next/headers";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ShieldCheck, Truck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
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
const DEFAULT_COLORS = {
  color_fondo: "#ffffff",
  color_texto: "#111827",
  color_precio: "#000000",
  color_primario: "#f97316",
  color_tarjeta: "rgba(0,0,0,0.02)",
};
// Placeholder ligero
const blurDataURL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+";
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
    headersList.get("x-forwarded-host") ??
      headersList.get("host"),
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
async function getProductoData(slug: string, productoSlug: string) {
  const supabase = await createClient();
  if (!slug || !productoSlug) return null;
  const { data: catalogo } = await supabase
    .from("catalogos")
    .select(`
      id,
      user_id,
      nombre,
      slug,
      logo,
      pais_code,
      whatsapp,
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
    `)
    .eq("slug", slug)
    .maybeSingle();
  if (!catalogo) return null;
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
  if (
    !catalogo.suscripcion_activa ||
    !suscripcionPermitida ||
    planVencido
  ) {
    return null;
  }
  const { data: producto } = await supabase
    .from("productos")
    .select("*")
    .eq("catalogo_id", catalogo.id)
    .eq("slug", productoSlug)
    .maybeSingle();
  if (!producto) return null;
  return { catalogo, producto };
}
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const [{ slug, producto: productoSlug }, host] =
    await Promise.all([
      params,
      obtenerHostActual(),
    ]);
  const data = await getProductoData(slug, productoSlug);
  if (!data) {
    return {
      title: "Producto no encontrado",
    };
  }
  const { producto, catalogo } = data;
  const titulo = `${producto.nombre} | ${catalogo.nombre}`;
  const descripcion = producto.descripcion
    ? `${producto.descripcion.substring(0, 150)}... ¡Pídelo aquí!`
    : `Mira nuestro producto ${producto.nombre} en ${catalogo.nombre}.`;
  const imagenUrl =
    producto.imagen_url ||
    "https://catalagox.com/default-share-image.png";
  const urlProducto = obtenerUrlProducto(
    host,
    slug,
    productoSlug,
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
  const data = await getProductoData(slug, productoSlug);
  if (!data) {
    return notFound();
  }
  const { catalogo, producto } = data;
  const host = await obtenerHostActual();
  const rutaBase = esDominioDeCatalagox(host)
    ? `/${catalogo.slug || slug}`
    : "";

  // El buscador del encabezado necesita las categorías y productos de esta tienda.
  const { data: categorias, error: categoriasError } = await supabase
    .from("categorias")
    .select("id, nombre, productos(id, nombre, imagen_url, slug)")
    .eq("catalogo_id", catalogo.id)
    .order("created_at");

  if (categoriasError) {
    console.error("No se pudieron cargar las categorías del producto:", categoriasError);
  }
  // ---------------------------------------------
  // TRACKING
  // ---------------------------------------------
  try {
    await supabase.from("estadisticas").insert({
      user_id: catalogo.user_id,
      tipo: "producto_view",
    });
  } catch (err) {
    console.error("TRACKING PRODUCT ERROR:", err);
  }
  // ---------------------------------------------
  // CONFIGURACIÓN
  // ---------------------------------------------
  const userCountry = catalogo.pais_code ?? "PE";
  const colorPrimario =
    catalogo.color_primario || DEFAULT_COLORS.color_primario;
  const dynamicTheme = {
    "--color-bg":
      catalogo.color_fondo || DEFAULT_COLORS.color_fondo,
    "--color-text":
      catalogo.color_texto || DEFAULT_COLORS.color_texto,
    "--color-price":
      catalogo.color_precio || DEFAULT_COLORS.color_precio,
    "--color-primary":
      colorPrimario,
    "--color-card":
      catalogo.color_tarjeta || DEFAULT_COLORS.color_tarjeta,
  } as CSSProperties;
  return (
    <TiendaLayout catalogo={catalogo} categorias={categorias ?? []} rutaBase={rutaBase}>
      <main
        className="
        min-h-screen
        bg-[var(--color-bg)]
        text-[var(--color-text)]
        transition-colors
        duration-200
      "
        style={dynamicTheme}
      >
      <div
        className="
          max-w-7xl
          mx-auto
          px-4
          sm:px-6
          lg:px-8
          pt-4
          sm:pt-7
          lg:pt-9
          pb-32
        "
      >
        {/* ================================================= */}
        {/* PRODUCTO                                          */}
        {/* ================================================= */}
        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-12
            gap-8
            lg:gap-12
            xl:gap-16
            items-start
          "
        >
          {/* ================================================= */}
          {/* IMAGEN                                            */}
          {/* ================================================= */}
          <div className="lg:col-span-7">
            <div
              className="
                relative
                w-full
                aspect-square
                sm:aspect-[4/3]
                lg:aspect-square
                rounded-2xl
                sm:rounded-3xl
                overflow-hidden
                border
                border-black/[0.06]
                dark:border-white/[0.08]
                shadow-sm
              "
              style={{
                backgroundColor: "var(--color-card)",
              }}
            >
              {/* BOTÓN VOLVER */}
              <div
                className="
                  absolute
                  top-3
                  left-3
                  sm:top-4
                  sm:left-4
                  z-20
                "
              >
                <BackButton />
              </div>
              {/* IMAGEN */}
              {producto.imagen_url ? (
                <Image
                  src={producto.imagen_url}
                  alt={producto.nombre}
                  fill
                  priority
                  quality={90}
                  placeholder="blur"
                  blurDataURL={blurDataURL}
                  sizes="
                    (max-width: 640px) 100vw,
                    (max-width: 1024px) 90vw,
                    58vw
                  "
                  className="
                    object-cover
                    w-full
                    h-full
                    transition-transform
                    duration-500
                    hover:scale-[1.025]
                  "
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="text-sm font-medium opacity-40">
                    Sin imagen disponible
                  </span>
                </div>
              )}
            </div>
          </div>
          {/* ================================================= */}
          {/* INFORMACIÓN                                      */}
          {/* ================================================= */}
          <div
            className="
              lg:col-span-5
              lg:sticky
              lg:top-8
            "
          >
            <div className="space-y-6 sm:space-y-7">
              {/* --------------------------------------------- */}
              {/* TÍTULO                                        */}
              {/* --------------------------------------------- */}
              <div>
                <h1
                  className="
                    text-3xl
                    sm:text-4xl
                    lg:text-[42px]
                    font-extrabold
                    tracking-tight
                    leading-[1.05]
                  "
                >
                  {producto.nombre}
                </h1>
              </div>
              {/* --------------------------------------------- */}
              {/* PRECIO                                        */}
              {/* --------------------------------------------- */}
              <div
                className="
                  pb-6
                  border-b
                  border-black/[0.07]
                  dark:border-white/[0.09]
                "
              >
                <div
                  className="
                    text-4xl
                    sm:text-5xl
                    font-extrabold
                    tracking-tight
                    text-[var(--color-price)]
                  "
                >
                  <Price
                    amount={producto.precio}
                    countryCode={userCountry}
                  />
                </div>
              </div>
              {/* --------------------------------------------- */}
              {/* DESCRIPCIÓN                                   */}
              {/* --------------------------------------------- */}
              {producto.descripcion && (
                <div>
                  <p
                    className="
                      text-[15px]
                      sm:text-base
                      leading-7
                      opacity-70
                      whitespace-pre-line
                    "
                  >
                    {producto.descripcion}
                  </p>
                </div>
              )}
              {/* --------------------------------------------- */}
              {/* STOCK + COMPARTIR + ACCIONES                 */}
              {/* --------------------------------------------- */}
              <div
                className="
                  rounded-2xl
                  border
                  border-black/[0.06]
                  dark:border-white/[0.08]
                  p-4
                  sm:p-5
                "
                style={{
                  backgroundColor: "var(--color-card)",
                }}
              >
                {/* STOCK + COMPARTIR */}
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-3
                    mb-4
                  "
                >
                  {/* STOCK */}
                  <div className="min-w-0">
                    <StockBadge
                      stock={producto.stock}
                      disponible={producto.disponible}
                      mostrarTextoCompleto={true}
                    />
                  </div>
                  {/* COMPARTIR */}
                  <div className="shrink-0">
                    <BotonCompartir titulo={producto.nombre} />
                  </div>
                </div>
                {/* SELECTOR + CARRITO */}
                <AccionesProducto
                  producto={producto}
                  colorPrimario={colorPrimario}
                />
              </div>
              {/* --------------------------------------------- */}
              {/* BENEFICIOS                                    */}
              {/* --------------------------------------------- */}
              <div
                className="
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  gap-3
                "
              >
                {/* Pedido seguro */}
                <div
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    border
                    border-black/[0.05]
                    dark:border-white/[0.08]
                    p-3.5
                  "
                >
                  <div
                    className="
                      w-9
                      h-9
                      rounded-full
                      flex
                      items-center
                      justify-center
                      shrink-0
                    "
                    style={{
                      backgroundColor: `${colorPrimario}15`,
                    }}
                  >
                    <ShieldCheck
                      size={18}
                      style={{
                        color: colorPrimario,
                      }}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold">
                      Pedido seguro
                    </p>
                    <p className="text-[11px] opacity-55 mt-0.5">
                      Compra directamente
                    </p>
                  </div>
                </div>
                {/* Atención directa */}
                <div
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    border
                    border-black/[0.05]
                    dark:border-white/[0.08]
                    p-3.5
                  "
                >
                  <div
                    className="
                      w-9
                      h-9
                      rounded-full
                      flex
                      items-center
                      justify-center
                      shrink-0
                    "
                    style={{
                      backgroundColor: `${colorPrimario}15`,
                    }}
                  >
                    <Truck
                      size={18}
                      style={{
                        color: colorPrimario,
                      }}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold">
                      Atención directa
                    </p>
                    <p className="text-[11px] opacity-55 mt-0.5">
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
