import { createClient } from "@/lib/supabase/server";
import BackButton from "@/components/public/BackButton";
import Image from "next/image";

export default async function ProductoPage({ params }: any) {
  const { slug, producto } = await params;
  const supabase = await createClient();

  const { data: catalogo } = await supabase.from("catalogos").select("id").eq("slug", slug).single();
  if (!catalogo) return <div className="p-10 text-center font-bold">Menú no encontrado</div>;

  const { data } = await supabase.from("productos").select("*").eq("catalogo_id", catalogo.id).eq("slug", producto).single();
  if (!data) return <div className="p-10 text-center font-bold">Producto no encontrado</div>;

  return (
    <div className="min-h-screen bg-zinc-50 pb-32">
      {/* --- HEADER / HERO --- */}
      <div className="relative w-full h-[45vh] md:h-[55vh] bg-zinc-200 overflow-hidden">
        <BackButton />
        
        {data.imagen_url ? (
          <Image
            src={data.imagen_url}
            alt={data.nombre}
            fill
            priority
            className="object-cover transition-transform duration-700 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-100">
            <span className="text-zinc-400 font-bold uppercase tracking-widest">Sin imagen disponible</span>
          </div>
        )}

        {/* Gradiente para que el botón de volver y el nombre resalten */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        
        <div className="absolute bottom-6 left-6 right-6 text-white">
            <span className="bg-orange-500 text-[10px] font-black uppercase px-2 py-1 rounded-md mb-2 inline-block tracking-widest">
                Detalles del Producto
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter drop-shadow-lg">
                {data.nombre}
            </h1>
        </div>
      </div>

      {/* --- CUERPO --- */}
      <main className="max-w-2xl mx-auto -mt-6 relative z-10 bg-white rounded-t-[32px] p-8 shadow-2xl shadow-black/5">
        
        <div className="flex flex-col gap-6">
          {/* Precio Flotante */}
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Precio actual</span>
              <span className="text-3xl font-black text-zinc-900 tracking-tighter">
                ${Number(data.precio).toLocaleString('es-CL')}
              </span>
            </div>
            
            <div className={`px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-wide border-2 ${
                data.disponible 
                ? "bg-green-50 border-green-100 text-green-600" 
                : "bg-red-50 border-red-100 text-red-600"
            }`}>
              {data.disponible ? "● Disponible" : "○ Agotado"}
            </div>
          </div>

          <hr className="border-zinc-100" />

          {/* Descripción */}
          <div>
            <h3 className="text-sm font-black text-zinc-800 uppercase tracking-widest mb-3">Descripción</h3>
            <p className="text-zinc-500 text-lg leading-relaxed font-medium">
              {data.descripcion || "Este producto aún no tiene una descripción detallada, pero te aseguramos que te encantará."}
            </p>
          </div>
        </div>
      </main>

      {/* --- BARRA INFERIOR (CTA) --- */}
      <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-zinc-100 p-6 z-[40]">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <div className="hidden sm:flex flex-col flex-1">
             <span className="text-[10px] font-bold text-zinc-400 uppercase">Total sugerido</span>
             <span className="text-xl font-black text-zinc-900">${Number(data.precio).toLocaleString('es-CL')}</span>
          </div>
          
          <button 
            disabled={!data.disponible}
            className={`flex-1 h-14 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-orange-200 transition-all active:scale-95 flex items-center justify-center gap-3 ${
                data.disponible 
                ? "bg-orange-500 text-white hover:bg-orange-600" 
                : "bg-zinc-200 text-zinc-400 cursor-not-allowed shadow-none"
            }`}
          >
            {data.disponible ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Ordenar ahora
                </>
            ) : "No disponible"}
          </button>
        </div>
      </div>
    </div>
  );
}