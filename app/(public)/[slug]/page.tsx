import { createClient } from "@/lib/supabase/server";
import MenuHeader from "@/components/public/MenuHeader";
import MenuFooter from "@/components/public/MenuFooter";
import CategoriaSection from "@/components/public/CategoriaSection";

// Definimos la interfaz para evitar el uso de 'any'
interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function MenuPage({ params }: PageProps) {
  const { slug } = await params;
  
  // 1. IMPORTANTE: Verifica si tu createClient requiere await
  const supabase = await createClient(); 

  // Buscar catálogo
  const { data: catalogo, error: catalogoError } = await supabase
    .from("catalogos")
    .select("id, nombre, logo")
    .eq("slug", slug)
    .maybeSingle();

  if (catalogoError || !catalogo) {
    return <div className="p-10 text-center">Menú no encontrado</div>;
  }

  // Buscar categorías + productos
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
        disponible
      )
    `)
    .eq("catalogo_id", catalogo.id)
    .order("created_at");

  if (categoriasError) {
    return <div className="p-10 text-center">Error al cargar categorías</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Pasamos catalogo como prop */}
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