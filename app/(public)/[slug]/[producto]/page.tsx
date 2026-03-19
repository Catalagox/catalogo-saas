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

  const { data: catalogo } = await supabase.from("catalogos").select("id").eq("slug", slug).single();
  if (!catalogo) return notFound();

  const { data } = await supabase.from("productos").select("*").eq("catalogo_id", catalogo.id).eq("slug", productoSlug).single();
  if (!data) return notFound();

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* --- HERO: Imagen con degradado profundo --- */}
      <div className="relative w-full h-[45vh] md:h-[55vh] bg-zinc-900 overflow-hidden">
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
          <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-500 font-bold uppercase text-xs">
            Sin foto
          </div>
        )}

        {/* Gradiente extra oscuro en la base para que el texto resalte al 100% */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
        
        <div className="absolute bottom-12 left-0 w-full px-6 z-20">
            <span className="bg-orange-500 text-[10px] font-black uppercase px-2 py-1 rounded-md mb-3 inline-block tracking-widest text-white shadow-lg">
                Detalles
            </span>
            <h1 className="text-3xl md:text-6xl font-black tracking-tighter text-white drop-shadow-2xl leading-tight">
                {data.nombre}
            </h1>
        </div>
      </div>

      {/* --- CUERPO --- */}
      <main className="relative z-30 -mt-10">
        <div className="max-w-2xl mx-auto bg-white rounded-t-[40px] shadow-2xl shadow-black/5 border-t border-zinc-50">
          <div className="p-8 space-y-8">
            
            {/* Precio y Disponibilidad */}
            <div className="flex justify-between items-center gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1 text-orange-500">Precio Sugerido</span>
                <span className="text-4xl font-black text-zinc-900 tracking-tighter">
                  ${Number(data.precio).toLocaleString('es-CL')}
                </span>
              </div>
              
              <div className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 ${
                  data.disponible 
                  ? "bg-green-50 border-green-200 text-green-600" 
                  : "bg-red-50 border-red-200 text-red-600"
              }`}>
                {data.disponible ? "Disponible" : "Agotado"}
              </div>
            </div>

            {/* --- SECCIÓN DESCRIPCIÓN CON FONDO NEGRO CLARO --- */}
            <div className="bg-zinc-50 border border-zinc-100 p-6 rounded-[30px] space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-4 bg-orange-500 rounded-full" />
                <h3 className="text-xs font-black text-zinc-800 uppercase tracking-widest">Descripción</h3>
              </div>
              <p className="text-zinc-500 text-lg leading-relaxed font-medium">
                {data.descripcion || "Este producto es una de nuestras recomendaciones especiales del chef."}
              </p>
            </div>

          </div>
        </div>
      </main>

      {/* --- BARRA FIJA: Botón Naranja con Signo + --- */}
      <div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-xl border-t border-zinc-100 px-6 py-6 z-[100]">
        <div className="max-w-2xl mx-auto">
          <button 
            disabled={!data.disponible}
            className={`w-full h-16 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-orange-200 transition-all active:scale-[0.97] flex items-center justify-center gap-4 ${
                data.disponible 
                ? "bg-orange-500 text-white hover:bg-orange-600" 
                : "bg-zinc-200 text-zinc-400 cursor-not-allowed shadow-none"
            }`}
          >
            {data.disponible ? (
                <>
                  <div className="bg-white/20 p-1.5 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Ordenar ahora</span>
                </>
            ) : "No disponible"}
          </button>
        </div>
      </div>
    </div>
  );
}