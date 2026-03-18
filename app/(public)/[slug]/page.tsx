import { createClient } from "@/lib/supabase/server";
import MenuHeader from "@/components/public/MenuHeader";
import MenuFooter from "@/components/public/MenuFooter";
import CategoriaSection from "@/components/public/CategoriaSection";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ qr?: string }>;
}

export default async function MenuPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { qr } = await searchParams;

  const supabase = await createClient();

  // 🔥 Buscar catálogo (IMPORTANTE: agregar user_id)
  const { data: catalogo, error: catalogoError } = await supabase
    .from("catalogos")
    .select("id, nombre, logo, user_id")
    .eq("slug", slug)
    .maybeSingle();

  if (catalogoError || !catalogo) {
    return <div className="p-10 text-center">Menú no encontrado</div>;
  }

  // 🔥 Registrar vista del menú
  supabase.from("estadisticas").insert({
    user_id: catalogo.user_id,
    tipo: "menu_view",
  });

  // 🔥 Registrar escaneo QR (si existe ?qr=1)
  if (qr) {
    supabase.from("estadisticas").insert({
      user_id: catalogo.user_id,
      tipo: "qr_scan",
    });
  }

  // 🔥 Buscar categorías + productos
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
        user_id
      )
    `)
    .eq("catalogo_id", catalogo.id)
    .order("created_at");

  if (categoriasError) {
    return <div className="p-10 text-center">Error al cargar categorías</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      <MenuHeader 
        catalogo={catalogo}
        categorias={categorias ?? []}
      />

      <main className="max-w-3xl mx-auto w-full p-4 space-y-10 flex-grow">
        {categorias?.map((categoria) => (
          <CategoriaSection
            key={categoria.id}
            categoria={categoria}
          />
        ))}
      </main>

      <MenuFooter />
    </div>
  );
}