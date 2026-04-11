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

  // 🔥 TRAEMOS COLORES TAMBIÉN
  const { data: catalogo } = await supabase
    .from("catalogos")
    .select(`
      id,
      color_fondo,
      color_header,
      color_texto,
      color_precio,
      color_primario
    `)
    .eq("slug", slug)
    .single();

  if (!catalogo) return notFound();

  const { data } = await supabase
    .from("productos")
    .select("*")
    .eq("catalogo_id", catalogo.id)
    .eq("slug", productoSlug)
    .single();

  if (!data) return notFound();

  // 🎨 DEFAULTS
  const colorFondo = catalogo.color_fondo || "#111827";
  const colorHeader = catalogo.color_header || "#f97316";
  const colorTexto = catalogo.color_texto || "#ffffff";
  const colorPrecio = catalogo.color_precio || "#22c55e";
  const colorPrimario = catalogo.color_primario || "#f97316";

  return (
    <div
      className="min-h-screen pb-32"
      style={{ backgroundColor: colorFondo }}
    >
      {/* HERO */}
      <div className="relative w-full h-[45vh] md:h-[55vh] overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full z-50">
          <BackButton />
        </div>

        {data.imagen_url ? (
          <Image
            src={data.imagen_url}
            alt={data.nombre}
            fill
            priority
            className="object-cover opacity-90"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm">
            Sin foto
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

        <div className="absolute bottom-10 left-0 w-full px-6">
          <span
            className="text-[10px] font-black uppercase px-2 py-1 rounded-md mb-3 inline-block"
            style={{ backgroundColor: colorPrimario, color: "#fff" }}
          >
            Detalles
          </span>

          <h1
            className="text-3xl md:text-5xl font-black"
            style={{ color: "#fff" }}
          >
            {data.nombre}
          </h1>
        </div>
      </div>

      {/* BODY */}
      <main className="-mt-10">
        <div
          className="max-w-2xl mx-auto rounded-t-[40px] shadow-2xl p-6 space-y-6"
          style={{ backgroundColor: "#ffffff" }}
        >
          {/* PRECIO */}
          <div className="flex justify-between items-center">
            <div>
              <span
                className="text-xs font-bold uppercase"
                style={{ color: colorPrimario }}
              >
                Precio
              </span>

              <p
                className="text-3xl font-black"
                style={{ color: colorPrecio }}
              >
                ${Number(data.precio).toLocaleString()}
              </p>
            </div>

            <div
              className={`px-4 py-2 rounded-xl text-xs font-bold ${
                data.disponible
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {data.disponible ? "Disponible" : "Agotado"}
            </div>
          </div>

          {/* DESCRIPCIÓN */}
          <div
            className="p-5 rounded-2xl"
            style={{ backgroundColor: "#f9fafb" }}
          >
            <h3
              className="text-xs font-bold uppercase mb-2"
              style={{ color: colorPrimario }}
            >
              Descripción
            </h3>

            <p style={{ color: "#555" }}>
              {data.descripcion ||
                "Este producto es una recomendación especial."}
            </p>
          </div>
        </div>
      </main>

      {/* BOTÓN */}
      <div
        className="fixed bottom-0 left-0 w-full p-5"
        style={{ backgroundColor: "#ffffffee", backdropFilter: "blur(10px)" }}
      >
        <div className="max-w-2xl mx-auto">
          <button
            disabled={!data.disponible}
            className="w-full h-14 rounded-xl font-bold transition"
            style={{
              backgroundColor: data.disponible ? colorPrimario : "#ccc",
              color: "#fff",
            }}
          >
            {data.disponible ? "Ordenar ahora" : "No disponible"}
          </button>
        </div>
      </div>
    </div>
  );
}