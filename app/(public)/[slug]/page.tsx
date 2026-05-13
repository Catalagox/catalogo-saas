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

  if (!slug) {
    return <div className="p-10 text-center">Slug inválido</div>;
  }

  const { data: catalogoDB, error: catalogoError } = await supabase
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
      color_lupa
    `,
    )
    .eq("slug", slug)
    .maybeSingle();

  if (catalogoError) {
    console.error("Error catálogo:", catalogoError);

    return <div className="p-10 text-center">Error cargando menú</div>;
  }

  if (!catalogoDB) {
    return <div className="p-10 text-center">Menú no encontrado</div>;
  }

  const data = catalogoDB;

  if (!data) {
    return <div className="p-10 text-center">Menú no encontrado</div>;
  }

  const catalogo = {
    ...data,

    color_primario: data.color_primario ?? "#f97316",

    color_fondo: data.color_fondo ?? "#111827",

    color_header: data.color_header ?? "#f97316",

    color_footer: data.color_footer ?? "#111827",

    color_texto: data.color_texto ?? "#ffffff",

    color_precio: data.color_precio ?? "#22c55e",

    color_hamburguesa: data.color_hamburguesa ?? "#ffffff",

    color_tarjeta: data.color_tarjeta ?? "#ffffff10",

    color_categoria: data.color_categoria ?? "#ffffff",

    // 🔥 NUEVO
    color_lupa: data.color_lupa ?? "#ffffff",
  };

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
    `,
    )
    .eq("catalogo_id", catalogo.id)
    .order("created_at");

  if (categoriasError) {
    console.error("Error categorías:", categoriasError);

    return <div className="p-10 text-center">Error al cargar categorías</div>;
  }

  return <MenuClient catalogo={catalogo} categorias={categorias ?? []} />;
}
