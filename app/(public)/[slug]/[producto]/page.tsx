import { createClient } from "@/lib/supabase/server";
import BackButton from "@/components/public/BackButton";
import Image from "next/image";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string; producto: string }>;
}

export default async function ProductoPage({ params }: PageProps) {
  const { slug, producto: productoSlug } = await params;
  const supabase = await createClient();

  if (!slug || !productoSlug) return notFound();

  const { data: catalogo, error: catalogoError } = await supabase
    .from("catalogos")
    .select(
      `
      id, 
      color_fondo, 
      color_header, 
      color_texto, 
      color_precio, 
      color_primario,
      color_tarjeta
    `,
    )
    .eq("slug", slug)
    .single();

  if (catalogoError || !catalogo) return notFound();

  const { data: producto, error: productoError } = await supabase
    .from("productos")
    .select("*")
    .eq("catalogo_id", catalogo.id)
    .eq("slug", productoSlug)
    .single();

  if (productoError || !producto) return notFound();

  const theme = {
    "--color-bg": catalogo.color_fondo ?? "#111827",
    "--color-text": catalogo.color_texto ?? "#ffffff",
    "--color-price": catalogo.color_precio ?? "#22c55e",
    "--color-primary": catalogo.color_primario ?? "#f97316",
    "--color-card": catalogo.color_tarjeta ?? "rgba(255,255,255,0.05)",
  } as React.CSSProperties;

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

      {/* --- HOJA DESLIZABLE (SHEET) --- */}
      <main className="relative z-10 mt-[50vh] min-h-[50vh] bg-[var(--color-bg)] rounded-t-[45px] shadow-[0_-15px_50px_rgba(0,0,0,0.5)] pb-32">
        {/* Handle bar */}
        <div className="flex justify-center pt-5">
          <div className="w-16 h-1.5 rounded-full bg-[var(--color-primary)] opacity-70" />
        </div>

        <div className="max-w-2xl mx-auto px-8 py-10 space-y-10">
          {/* TÍTULO Y BADGE */}
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

          {/* PRECIO E "INVERSIÓN" */}
          <div className="flex justify-between items-center p-6 rounded-[2rem] bg-[var(--color-card)] border border-white/5">
            <div>
              <p className="text-[10px] font-black uppercase mb-1 tracking-widest text-[var(--color-primary)]">
                Inversión
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

          {/* REFERENCIA */}
          <div className="pt-6 border-t border-white/10">
            <p className="text-[10px] uppercase tracking-widest text-[var(--color-text)] font-medium">
              Referencia: {producto.slug}
            </p>
          </div>
        </div>
      </main>

      {/* --- BOTÓN FIJO --- */}
      <div className="fixed bottom-0 left-0 w-full p-6 z-50 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)] to-transparent">
        <div className="max-w-2xl mx-auto">
          <button
            disabled={!producto.disponible}
            className="w-full h-16 rounded-2xl font-black text-sm tracking-widest uppercase transition-all hover:brightness-110 active:scale-[0.98] shadow-2xl disabled:opacity-50 disabled:grayscale"
            style={{
              backgroundColor: producto.disponible
                ? "var(--color-primary)"
                : "#222",
              color: "#fff",
            }}
          >
            {producto.disponible ? "Añadir a mi pedido" : "No disponible"}
          </button>
        </div>
      </div>
    </div>
  );
}
