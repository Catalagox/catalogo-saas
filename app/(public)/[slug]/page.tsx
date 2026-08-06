import { createClient } from "@/lib/supabase/server";
import MenuClient from "@/components/public/MenuClient";
import { Metadata } from "next";
import PelotaMundial from "@/components/PelotaMundial";
import { cache } from "react";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ qr?: string }>;
}

export const revalidate = 60;




// ✅ POR ESTO (Envolver la función con cache):
const getCatalogo = cache(async (slug: string) => {
  // ... (deja todo el contenido interno exactamente igual)

   
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
      `
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;

  // 🔒 VERIFICAR SUSCRIPCIÓN
  const fechaVencimiento = data.plan_vence_el
    ? new Date(data.plan_vence_el)
    : null;

  const vencida =
    !fechaVencimiento ||
    fechaVencimiento.getTime() < Date.now();

  if (
    data.suscripcion_activa === false ||
    data.subscription_status === "canceled" ||
    vencida
  ) {
    return null;
  }

  // 🛠️ CONSTRUCCIÓN AUTOMÁTICA DE LA URL DEL LOGO
  let logoUrl = "https://catalagox.com/default-share-image.png";

  if (data.logo) {
    if (
      data.logo.startsWith("http://") ||
      data.logo.startsWith("https://")
    ) {
      logoUrl = data.logo;
    } else {
      const archivoCodificado = encodeURIComponent(data.logo);
      logoUrl = `https://yhlqooguctlzorinsxde.supabase.co/storage/v1/object/public/logos/${archivoCodificado}`;
    }
  }

  return {
    ...data,
    logoUrl,
  };
});

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  if (!slug) return {};

  const catalogoDB = await getCatalogo(slug);

  if (!catalogoDB) {
    return {
      title: "Catálogo No Encontrado",
    };
  }

  const titulo = `Catálogo Digital - ${catalogoDB.nombre}`;
  const descripcion =
    "¡Hola! Te invito a ver nuestro catálogo digital actualizado. Revisa nuestros productos y precios aquí.";

  return {
    metadataBase: new URL("https://catalagox.com"),

    title: titulo,
    description: descripcion,

    alternates: {
      canonical: `https://catalagox.com/${slug}`,
    },

    openGraph: {
      title: titulo,
      description: descripcion,
      url: `https://catalagox.com/${slug}`,
      siteName: "CatalagoX",
      locale: "es_ES",
      type: "website",

      images: [
        {
          url: catalogoDB.logoUrl,
          width: 1200,
          height: 630,
          alt: `Logo de ${catalogoDB.nombre}`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: titulo,
      description: descripcion,
      images: [
        {
          url: catalogoDB.logoUrl,
          alt: `Logo de ${catalogoDB.nombre}`,
        },
      ],
    },
  };
}

// 3. COMPONENTE PRINCIPAL
export default async function MenuPage({
  params,
  searchParams,
}: PageProps) {
 // ✅ POR ESTO (Carga paralela):
const [{ slug }, { qr }] = await Promise.all([params, searchParams]);

if (!slug) {
  return <div className="p-10 text-center">Slug inválido</div>;
}

const [catalogoDB, supabase] = await Promise.all([
  getCatalogo(slug),
  createClient(),
]);

  // ✅ Recomendado:
if (!catalogoDB) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[var(--bg-main)] text-[var(--text-primary)]">
      <div className="w-16 h-16 mb-4 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h1 className="text-xl font-bold mb-2">Catálogo no disponible</h1>
      <p className="text-[var(--text-secondary)] text-sm max-w-sm">
        Este catálogo no existe o la suscripción del comercio no está activa.
      </p>
    </div>
  );
}

 const catalogo = {
  ...catalogoDB,
  logo: catalogoDB.logoUrl,
  pais_code: catalogoDB.pais_code ?? "PE",
  color_primario: catalogoDB.color_primario ?? "#f97316",
  color_fondo: catalogoDB.color_fondo ?? "#ffffff",
  color_header: catalogoDB.color_header ?? "#1e1f1e",
  color_text_header: catalogoDB.color_text_header ?? "#ffffff",
  color_border_header: catalogoDB.color_border_header ?? "rgba(255,255,255,0.1)",
  color_footer: catalogoDB.color_footer ?? "#111827",
  color_texto: catalogoDB.color_texto ?? "#ffffff",
  color_precio: catalogoDB.color_precio ?? "#22c55e",
  color_hamburguesa: catalogoDB.color_hamburguesa ?? "#ffffff",
  color_tarjeta: catalogoDB.color_tarjeta ?? "#ffffff10",
  color_categoria: catalogoDB.color_categoria ?? "#ffffff",
  color_lupa: catalogoDB.color_lupa ?? "#ffffff",

  // ✅ Nuevos colores
  color_fondo_categoria:
    catalogoDB.color_fondo_categoria ?? "#ffffff",
  color_texto_categoria:
    catalogoDB.color_texto_categoria ?? "#111827",
  color_border_categoria:
    catalogoDB.color_border_categoria ?? "#e5e7eb",
};

// 🔥 TRACKING ESTADÍSTICAS (En segundo plano)
  const registrarEstadisticas = async () => {
    try {
      await supabase.from("estadisticas").insert({
        user_id: catalogo.user_id,
        tipo: "menu_view",
      });

      if (qr) {
        await supabase.from("estadisticas").insert({
          user_id: catalogo.user_id,
          tipo: "qr_scan",
        });
      }
    } catch (err) {
      console.error("TRACKING ERROR:", err);
    }
  };

  // Se ejecuta en segundo plano sin bloquear el renderizado
  registrarEstadisticas();

  const { data: categorias, error: categoriasError } = await supabase
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
        available: disponible, 
        slug
      )
      `
    )
    .eq("catalogo_id", catalogo.id)
    .order("created_at");

  if (categoriasError) {
    console.error("Error categorías:", categoriasError);

    return (
      <div className="p-10 text-center">
        Error al cargar categorías
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen w-full transition-colors duration-300 relative"
      style={{ backgroundColor: catalogo.color_fondo }}
    >
      <PelotaMundial />
      
      
      <MenuClient
        catalogo={catalogo}
        categorias={categorias ?? []}
        countryCode={catalogo.pais_code}
      />
    </div>
  );
}