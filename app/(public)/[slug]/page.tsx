import { createClient } from "@/lib/supabase/server";
import MenuClient from "@/components/public/MenuClient";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ qr?: string }>;
}

export default async function MenuPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { qr } = await searchParams;

  const supabase = await createClient();

  // 🔥 VALIDACIÓN BÁSICA
  if (!slug) {
    return <div className="p-10 text-center">Slug inválido</div>;
  }

  // 🔥 CATÁLOGO
  const { data: catalogoDB, error: catalogoError } = await supabase
    .from("catalogos")
    .select(`
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
      color_categoria
    `)
    .eq("slug", slug)
    .maybeSingle();

  if (catalogoError) {
    console.error("Error catálogo:", catalogoError);
    return <div className="p-10 text-center">Error cargando menú</div>;
  }

  if (!catalogoDB) {
    return <div className="p-10 text-center">Menú no encontrado</div>;
  }

  // 🔥 NORMALIZACIÓN (CLAVE para CSS variables)
  const catalogo = {
    ...catalogoDB,

    color_primario: catalogoDB.color_primario ?? "#f97316",
    color_fondo: catalogoDB.color_fondo ?? "#111827",
    color_header: catalogoDB.color_header ?? "#f97316",
    color_footer: catalogoDB.color_footer ?? "#111827",
    color_texto: catalogoDB.color_texto ?? "#ffffff",
    color_precio: catalogoDB.color_precio ?? "#22c55e",
    color_hamburguesa: catalogoDB.color_hamburguesa ?? "#ffffff",
    color_tarjeta: catalogoDB.color_tarjeta ?? "#ffffff10",
    color_categoria: catalogoDB.color_categoria ?? "#ffffff",
  };

  // 🔥 TRACKING (NO bloquear render)
  try {
    await Promise.all([
      supabase.from("estadisticas").insert({
        user_id: catalogo.user_id,
        tipo: "menu_view",
      }),
      qr
        ? supabase.from("estadisticas").insert({
            user_id: catalogo.user_id,
            tipo: "qr_scan",
          })
        : null,
    ]);
  } catch (err) {
    console.warn("Tracking error:", err);
  }

  // 🔥 CATEGORÍAS + PRODUCTOS
  const { data: categorias, error: categoriasError } = await supabase
    .from("categorias")
    .select(`
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
    `)
    .eq("catalogo_id", catalogo.id)
    .order("created_at");

  if (categoriasError) {
    console.error("Error categorías:", categoriasError);
    return <div className="p-10 text-center">Error al cargar categorías</div>;
  }

  return (
    <MenuClient
      catalogo={catalogo}
      categorias={categorias ?? []}
    />
  );
}