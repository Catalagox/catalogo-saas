import { createClient } from "@/lib/supabase/server";
import BackButton from "@/components/public/BackButton";
import { notFound } from "next/navigation";
import { Metadata } from "next";
// 1. IMPORTAMOS TU NUEVO COMPONENTE CLIENTE
import BotonAgregarDetalle from "@/components/public/BotonAgregarDetalle";

interface PageProps {
  params: Promise<{ slug: string; producto: string }>;
}

// 1. FUNCIÓN AUXILIAR PARA OBTENER LOS DATOS
async function getProductoData(slug: string, productoSlug: string) {
  const supabase = await createClient();

  if (!slug || !productoSlug) return null;

  const { data: catalogo, error: catalogoError } = await supabase
    .from("catalogos")
    .select(`
      id,
      user_id,
      nombre,
      color_fondo,
      color_header,
      color_texto,
      color_precio,
      color_primario,
      color_tarjeta,
      whatsapp
    `)
    .eq("slug", slug)
    .maybeSingle();

  if (catalogoError || !catalogo) return null;

  const { data: producto, error: productoError } = await supabase
    .from("productos")
    .select("*")
    .eq("catalogo_id", catalogo.id)
    .eq("slug", productoSlug)
    .maybeSingle();

  if (productoError || !producto) return null;

  return { catalogo, producto };
}

// 2. METADATOS DINÁMICOS
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, producto: productoSlug } = await params;
  const data = await getProductoData(slug, productoSlug);

  if (!data) return { title: "Producto no encontrado" };

  const { producto, catalogo } = data;
  const titulo = `${producto.nombre} | ${catalogo.nombre}`;
  const descripcion = producto.descripcion
    ? `${producto.descripcion.substring(0, 150)}... ¡Pídelo aquí!`
    : `Mira nuestro producto ${producto.nombre} en el menú digital.`;

  const imagenUrl = producto.imagen_url || "https://catalagox.com/default-share-image.png";

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

// 3. COMPONENTE PRINCIPAL
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

  const theme = {
    "--color-bg": catalogo.color_fondo ?? "#111827",
    "--color-text": catalogo.color_texto ?? "#ffffff",
    "--color-price": catalogo.color_precio ?? "#22c55e",
    "--color-primary": catalogo.color_primario ?? "#f97316",
    "--color-card": catalogo.color_tarjeta ?? "rgba(255,255,255,0.05)",
  } as React.CSSProperties;

  return (
    <div className="block min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] pb-32" style={theme}>
      
      {/* --- 1. SECCIÓN DE LA IMAGEN (ARRIBA) --- */}
      <div className="relative w-full block h-[45vh] min-h-[300px] max-h-[500px] bg-black overflow-hidden">
        
        {/* Botón de volver */}
        <div className="absolute top-6 left-6 z-30">
          <BackButton />
        </div>

        {producto.imagen_url ? (
          <img
            src={producto.imagen_url}
            alt={producto.nombre}
            className="w-full h-full object-cover z-10"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-500 z-10">
            Sin imagen disponible
          </div>
        )}
        
        {/* Gradiente decorativo */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)]/50 via-transparent to-transparent z-20" />
      </div>

      {/* --- CUERPO DE LA INFORMACIÓN --- */}
      <main className="max-w-2xl mx-auto px-6 pt-8 space-y-8">
        
        {/* --- 2. CATEGORÍA Y TÍTULO --- */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[var(--color-primary)]">
              {producto.categoria || "Producto"}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight">
            {producto.nombre}
          </h1>
        </div>

        {/* --- 3. PRECIO --- */}
        <div className="flex justify-between items-center p-6 rounded-2xl bg-[var(--color-card)] border border-white/5">
          <div>
            <p className="text-[10px] font-black uppercase mb-1 tracking-widest opacity-60">
              Precio
            </p>
            <p className="text-3xl font-black text-[var(--color-price)]">
              ${Number(producto.precio || 0).toLocaleString()}
            </p>
          </div>

          <div
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
              producto.disponible
                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                : "bg-red-500/10 text-red-400 border border-red-500/20"
            }`}
          >
            {producto.disponible ? "Disponible" : "Agotado"}
          </div>
        </div>

        {/* --- 4. DESCRIPCIÓN --- */}
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-60">
            Descripción
          </h3>
          <div className="text-base sm:text-lg leading-relaxed whitespace-pre-line font-light opacity-90">
            {producto.descripcion
              ? producto.descripcion
              : "No hay detalles adicionales para este producto."}
          </div>
        </div>

      </main>

      {/* --- BOTÓN FIJO EN LA PARTE INFERIOR --- */}
      <div className="fixed bottom-0 left-0 w-full p-6 z-50 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)] to-transparent">
        <div className="max-w-2xl mx-auto">
          
          {/* ✅ AQUÍ CAMBIAMOS EL ENLACE DIRECTO POR TU NUEVO BOTÓN CLIENTE */}
          <BotonAgregarDetalle 
            producto={{
              id: producto.id,
              nombre: producto.nombre,
              precio: producto.precio,
              imagen_url: producto.imagen_url,
              disponible: producto.disponible
            }}
            colorPrimario={catalogo.color_primario ?? "#f97316"}
            whatsappNumero={catalogo.whatsapp}
          />

        </div>
      </div>
    </div>
  );
}