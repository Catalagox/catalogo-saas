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
      youtube
      `
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;

  // 🛠️ CONSTRUCCIÓN AUTOMÁTICA DE LA URL DEL LOGO
  let logoUrl = "https://catalagox.com/default-share-image.png"; // Imagen por defecto por si no tiene logo

  if (data.logo) {
    if (data.logo.startsWith("http://") || data.logo.startsWith("https://")) {
      // Si por alguna razón ya se guardó la URL completa
      logoUrl = data.logo;
    } else {
      // Construcción exacta usando tu ID de proyecto 'yhlqooguctlzorinsxde' y tu bucket 'logos'
      logoUrl = `https://yhlqooguctlzorinsxde.supabase.co/storage/v1/object/public/logos/${data.logo}`;
    }
  }

  return {
    ...data,
    logoUrl,
  };
}

// 2. GENERADOR DINÁMICO DE METADATOS (WhatsApp, Facebook, etc.)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  if (!slug) return {};

  const catalogoDB = await getCatalogo(slug);

  if (!catalogoDB) {
    return {
      title: "Catálogo No Encontrado",
    };
  }

  const titulo = `Menú Digital - ${catalogoDB.nombre}`;
  const descripcion = `¡Hola! Te invito a ver nuestro menú digital actualizado. Revisa nuestros productos y precios aquí.`;

  return {
    title: titulo,
    description: descripcion,
    openGraph: {
      title: titulo,
      description: descripcion,
      url: `https://catalagox.com/${slug}`,
      siteName: "CatalagoX",
      images: [
        {
          url: catalogoDB.logoUrl, // URL absoluta final de la imagen del cliente
          width: 800,
          height: 600,
          alt: `Logo de ${catalogoDB.nombre}`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: titulo,
      description: descripcion,
      images: [catalogoDB.logoUrl],
    },
  };
}

// 3. COMPONENTE PRINCIPAL DE LA PÁGINA
export default async function MenuPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { qr } = await searchParams;
  const supabase = await createClient();

  if (!slug) {
    return <div className="p-10 text-center">Slug inválido</div>;
  }

  const catalogoDB = await getCatalogo(slug);

  if (!catalogoDB) {
    return <div className="p-10 text-center">Menú no encontrado</div>;
  }

  const catalogo = {
    ...catalogoDB,
    logo: catalogoDB.logoUrl, // Le pasamos la URL pública completa ya procesada al componente cliente
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
    return <div className="p-10 text-center">Error al cargar categorías</div>;
  }

  return <MenuClient catalogo={catalogo} categorias={categorias ?? []} />;
}