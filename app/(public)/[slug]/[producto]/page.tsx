import { createClient } from "@/lib/supabase/server";
import BackButton from "@/components/public/BackButton";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string; producto: string }>;
}

// 1. FUNCIÓN AUXILIAR PARA OBTENER LOS DATOS (Evita duplicar consultas)
async function getProductoData(slug: string, productoSlug: string) {
  const supabase = await createClient();

  if (!slug || !productoSlug) return null;

  // Cargar catálogo
  const { data: catalogo, error: catalogoError } = await supabase
    .from("catalogos")
    .select(
      `
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
    `,
    )
    .eq("slug", slug)
    .maybeSingle();

  if (catalogoError || !catalogo) return null;

  // Cargar producto
  const { data: producto, error: productoError } = await supabase
    .from("productos")
    .select("*")
    .eq("catalogo_id", catalogo.id)
    .eq("slug", productoSlug)
    .maybeSingle();

  if (productoError || !producto) return null;

  return { catalogo, producto };
}

// 2. METADATOS DINÁMICOS PARA EL PRODUCTO (Para la vista previa con foto en WhatsApp)
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug, producto: productoSlug } = await params;
  const data = await getProductoData(slug, productoSlug);

  if (!data) return { title: "Producto no encontrado" };

  const { producto, catalogo } = data;
  const titulo = `${producto.nombre} | ${catalogo.nombre}`;
  const descripcion = producto.descripcion
    ? `${producto.descripcion.substring(0, 150)}... ¡Pídelo aquí!`
    : `Mira nuestro producto ${producto.nombre} en el menú digital.`;

  // Usar la imagen del producto, si no tiene, podrías usar un fallback por defecto
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

// 3. COMPONENTE PRINCIPAL
export default async function ProductoPage({ params }: PageProps) {
  const { slug, producto: productoSlug } = await params;
  const supabase = await createClient();

  const data = await getProductoData(slug, productoSlug);
  if (!data) return notFound();

  const { catalogo, producto } = data;

  // 🔥 TRACKING PRODUCTO
  try {
    await supabase.from("estadisticas").insert({
      user_id: catalogo.user_id,
      tipo: "producto_view",
    });
  } catch (err) {
    console.error("TRACKING PRODUCT ERROR:", err);
  }

  // 🔥 THEME
  const theme = {
    "--color-bg": catalogo.color_fondo ?? "#111827",
    "--color-text": catalogo.color_texto ?? "#ffffff",
    "--color-price": catalogo.color_precio ?? "#22c55e",
    "--color-primary": catalogo.color_primario ?? "#f97316",
    "--color-card": catalogo.color_tarjeta ?? "rgba(255,255,255,0.05)",
  } as React.CSSProperties;

  // 🔥 URL ABSOLUTA DEL PRODUCTO (Es vital para que WhatsApp arme la previsualización)
  const urlProducto = `https://catalagox.com/${slug}/${productoSlug}`;

  // 🔥 MENSAJE DE WHATSAPP MEJORADO (Estructura clara + Enlace)
  const mensaje = `🛒 *Nuevo pedido*

📦 *Producto:* ${producto.nombre}
💰 *Precio:* $${Number(producto.precio || 0).toLocaleString()}


🔗 *Ver producto:* ${urlProducto}`;

  // 🔥 LINK WHATSAPP
  const whatsappUrl = catalogo.whatsapp
    ? `https://wa.me/${catalogo.whatsapp}?text=${encodeURIComponent(mensaje)}`
    : "#";

  return (
    <div className="relative min-h-screen bg-black" style={theme}>
      {/* --- HERO IMAGE --- */}
      <div className="fixed top-0 left-0 w-full h-[60vh] z-0">
        <div className="absolute top-6 left-6 z-50">
          <BackButton />
        </div>

        {producto.imagen_url ? (
          <Image
            src={producto.imagen_url}
            alt={producto.nombre}
            fill
            priority
            className="object-cover opacity-90"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-500">
            Sin imagen disponible
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
      </div>

      {/* --- HOJA --- */}
      <main className="relative z-10 mt-[50vh] min-h-[50vh] bg-[var(--color-bg)] rounded-t-[45px] shadow-[0_-15px_50px_rgba(0,0,0,0.5)] pb-32">
        <div className="flex justify-center pt-5">
          <div className="w-16 h-1.5 rounded-full bg-[var(--color-primary)] opacity-70" />
        </div>

        <div className="max-w-2xl mx-auto px-8 py-10 space-y-10">
          {/* TÍTULO */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full animate-pulse bg-[var(--color-primary)]" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--color-primary)]">
                Producto
              </span>
            </div>
            <h1 className="text-4xl font-extrabold text-[var(--color-text)] leading-tight">
              {producto.nombre}
            </h1>
          </div>

          {/* PRECIO */}
          <div className="flex justify-between items-center p-6 rounded-[2rem] bg-[var(--color-card)] border border-white/5">
            <div>
              <p className="text-[10px] font-black uppercase mb-1 tracking-widest text-[var(--color-primary)]">
                Precio
              </p>
              <p className="text-4xl font-black text-[var(--color-price)]">
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

          {/* DESCRIPCIÓN */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-[var(--color-primary)]">
              Descripción
            </h3>
            <div className="text-lg leading-relaxed whitespace-pre-line font-light text-[var(--color-text)]">
              {producto.descripcion
                ? producto.descripcion
                : "No hay detalles adicionales para este producto."}
            </div>
          </div>

        </div>
      </main>

      {/* --- BOTÓN FIJO --- */}
      <div className="fixed bottom-0 left-0 w-full p-6 z-50 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)] to-transparent">
        <div className="max-w-2xl mx-auto">
          <a
            href={producto.disponible ? whatsappUrl : "#"}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full h-16 rounded-2xl font-black text-sm tracking-widest uppercase transition-all shadow-2xl flex items-center justify-center ${
              producto.disponible
                ? "hover:brightness-110 active:scale-[0.98]"
                : "opacity-50 grayscale pointer-events-none"
            }`}
            style={{
              backgroundColor: producto.disponible
                ? "var(--color-primary)"
                : "#222",
              color: "#fff",
            }}
          >
            {producto.disponible ? "Pedir por WhatsApp" : "No disponible"}
          </a>
        </div>
      </div>
    </div>
  );
}
