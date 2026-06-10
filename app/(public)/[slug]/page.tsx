import { createClient } from "@/lib/supabase/server";
import MenuClient from "@/components/public/MenuClient";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ qr?: string }>;
}

// 1. FUNCIÓN AUXILIAR PARA OBTENER LOS DATOS DEL CATÁLOGO Y PROCESAR EL LOGO
async function getCatalogo(slug: string) {
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
      color_footer,
      color_texto,
      color_precio,
      color_hamburguesa,
      color_tarjeta,
      color_categoria,
      color_lupa,
      whatsapp,
      instagram,
      facebook,
      tiktok,
      youtube,
      plan_vence_el,
      suscripcion_activa,
      subscription_status
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
      // 🚨 FIX: Asegura que espacios o caracteres especiales en el nombre del archivo no rompan el crawler de WhatsApp
      logoUrl = encodeURI(`https://yhlqooguctlzorinsxde.supabase.co/storage/v1/object/public/logos/${data.logo}`);
    }
  }

  return {
    ...data,
    logoUrl,
  };
}

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
      locale: "es_AR",
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
  const { slug } = await params;
  const { qr } = await searchParams;

  const supabase = await createClient();

  if (!slug) {
    return <div className="p-10 text-center">Slug inválido</div>;
  }

  const catalogoDB = await getCatalogo(slug);

  if (!catalogoDB) {
    return (
      <div className="p-10 text-center">
        Catálogo no disponible
      </div>
    );
  }

  const catalogo = {
    ...catalogoDB,
    logo: catalogoDB.logoUrl,
    color_primario: catalogoDB.color_primario ?? "#f97316",
    color_fondo: catalogoDB.color_fondo ?? "#111827",
    color_header: catalogoDB.color_header ?? "#f97316",
    color_footer: catalogoDB.color_footer ?? "#111827",
    color_texto: catalogoDB.color_texto ?? "#ffffff",
    color_precio: catalogoDB.color_precio ?? "#22c55e",
    color_hamburguesa: catalogoDB.color_hamburguesa ?? "#ffffff",
    color_tarjeta: catalogoDB.color_tarjeta ?? "#ffffff10",
    color_categoria: catalogoDB.color_categoria ?? "#ffffff",
    color_lupa: catalogoDB.color_lupa ?? "#ffffff",
  };

  // 🔥 TRACKING ESTADÍSTICAS
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
        disponible,
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
    <MenuClient
      catalogo={catalogo}
      categorias={categorias ?? []}
    />
  );
}