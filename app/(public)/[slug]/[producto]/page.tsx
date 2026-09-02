import { createClient } from "@/lib/supabase/server";
import BackButton from "@/components/public/BackButton";
import BotonCompartir from "@/components/public/BotonCompartir";
import AccionesProducto from "@/components/public/AccionesProducto";
import CartWidget from "@/components/public/CartWidget";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Price from "@/components/ui/Price";
import Image from "next/image";
import { ShieldCheck, Truck, FileText } from "lucide-react";

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

// Data-URL SVG para placeholder dinámico ultraligero
const blurDataURL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+";

async function getProductoData(slug: string, productoSlug: string) {
  const supabase = await createClient();

  if (!slug || !productoSlug) return null;

  const { data: catalogo } = await supabase
    .from("catalogos")
    .select(`
      id, 
      user_id, 
      nombre, 
      pais_code,
      whatsapp,
      color_primario,
      color_fondo,
      color_texto,
      color_precio,
      color_tarjeta
    `)
    .eq("slug", slug)
    .maybeSingle();

  if (!catalogo) return null;

  const { data: producto } = await supabase
    .from("productos")
    .select("*")
    .eq("catalogo_id", catalogo.id)
    .eq("slug", productoSlug)
    .maybeSingle();

  if (!producto) return null;

  return { catalogo, producto };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, producto: productoSlug } = await params;
  const data = await getProductoData(slug, productoSlug);

  if (!data) return { title: "Producto no encontrado" };

  const { producto, catalogo } = data;
  const titulo = `${producto.nombre} | ${catalogo.nombre}`;
  const descripcion = producto.descripcion
    ? `${producto.descripcion.substring(0, 150)}... ¡Pídelo aquí!`
    : `Mira nuestro producto ${producto.nombre} en el catálogo digital.`;

  const imagenUrl =
    producto.imagen_url || "https://catalagox.com/default-share-image.png";

  return {
    title: titulo,
    description: descripcion,
    openGraph: {
      title: titulo,
      description: descripcion,
      url: `https://catalagox.com/${slug}/${productoSlug}`,
      siteName: catalogo.nombre,
      images: [{ url: imagenUrl, width: 800, height: 600, alt: producto.nombre }],
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
  if (!data) return notFound();

  const { catalogo, producto } = data;

  try {
    await supabase.from("estadisticas").insert({
      user_id: catalogo.user_id,
      tipo: "producto_view",
    });
  } catch (err) {
    console.error("TRACKING PRODUCT ERROR:", err);
  }

  const userCountry = catalogo.pais_code ?? "PE";

  const dynamicTheme = {
    "--color-bg": catalogo.color_fondo || DEFAULT_COLORS.color_fondo,
    "--color-text": catalogo.color_texto || DEFAULT_COLORS.color_texto,
    "--color-price": catalogo.color_precio || DEFAULT_COLORS.color_precio,
    "--color-primary": catalogo.color_primario || DEFAULT_COLORS.color_primario,
    "--color-card": catalogo.color_tarjeta || DEFAULT_COLORS.color_tarjeta,
  } as React.CSSProperties;

  return (
    <main
      className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-200 relative"
      style={dynamicTheme}
    >
      <div className="max-w-6xl mx-auto px-0 sm:px-6 pt-0 sm:pt-10 pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
          
          <div className="lg:col-span-6 relative w-full">
            <div className="relative w-full aspect-square sm:rounded-3xl overflow-hidden bg-black/[0.02] dark:bg-white/[0.02] sm:border sm:border-black/5 dark:sm:border-white/10 flex items-center justify-center">
              
              <div className="absolute top-4 left-4 z-20">
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
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover sm:object-contain hover:scale-105 transition-transform duration-500 ease-out p-0 sm:p-4"
                />
              ) : (
                <div className="text-sm font-medium opacity-40">
                  Sin imagen disponible
                </div>
              )}
            </div>
          </div>

          {/* COLUMNA DERECHA: DETALLES DEL PRODUCTO */}
          <div className="lg:col-span-6 space-y-6 px-4 sm:px-0">
            
            {/* TÍTULO DEL PRODUCTO */}
            <div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                {producto.nombre}
              </h1>
            </div>

            {/* SECCIÓN DE PRECIO CON BOTÓN COMPARTIR */}
            <div className="py-2 border-b border-black/5 dark:border-white/10 flex items-end justify-between gap-4">
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest opacity-40 block mb-1">
                  Precio
                </span>
                <div className="text-4xl sm:text-5xl font-black text-[var(--color-price)] tracking-tight">
                  <Price amount={producto.precio} countryCode={userCountry} />
                </div>
              </div>

              <div className="pb-1">
                <BotonCompartir titulo={producto.nombre} />
              </div>
            </div>

            {/* BOTONES DE ACCIÓN */}
            <div className="pt-2">
              <AccionesProducto
                producto={producto}
                colorPrimario={catalogo.color_primario ?? DEFAULT_COLORS.color_primario}
              />
            </div>

            {/* GARANTÍAS DE SEGURIDAD Y ATENCIÓN */}
            <div className="grid grid-cols-2 gap-4 py-4 border-y border-black/5 dark:border-white/10 text-xs font-semibold opacity-80">
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={18} className="text-[var(--color-primary)] shrink-0" />
                <span>Pedido seguro</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Truck size={18} className="text-[var(--color-primary)] shrink-0" />
                <span>Atención directa</span>
              </div>
            </div>

            {/* DESCRIPCIÓN DEL PRODUCTO */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2">
                <FileText size={16} className="opacity-50" />
                <h2 className="text-xs font-black uppercase tracking-[0.2em] opacity-60">
                  Detalles del Producto
                </h2>
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-line opacity-80 font-normal">
                {producto.descripcion
                  ? producto.descripcion
                  : "No hay detalles adicionales para este producto."}
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* COMPONENTE FLOTANTE DE CARRITO */}
      <CartWidget
        catalogoNombre={catalogo.nombre}
        whatsapp={catalogo.whatsapp}
        userCountry={userCountry}
        colorPrimario={catalogo.color_primario}
      />
    </main>
  );
}