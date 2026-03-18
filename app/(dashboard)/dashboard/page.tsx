"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

import {
  MenuSquare,
  Package,
  Tags,
  QrCode,
  Palette,
  BarChart3,
  Globe,
} from "lucide-react";

type Catalogo = {
  id: string;
  nombre: string;
  slug: string;
  created_at: string;
};

export default function DashboardPage() {
  const router = useRouter();

  const [catalogo, setCatalogo] = useState<Catalogo | null>(null);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const [productosCount, setProductosCount] = useState(0);
  const [categoriasCount, setCategoriasCount] = useState(0);

  useEffect(() => {
    inicializar();
  }, []);

  const irA = (ruta: string) => router.push(ruta);

  const inicializar = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.push("/");
      return;
    }

    setUser(session.user);

    // CATÁLOGO
    const { data: catalogoData } = await supabase
      .from("catalogos")
      .select("id, nombre, slug, created_at")
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (catalogoData) {
      setCatalogo(catalogoData);
    }

    // PRODUCTOS
    const { count: productos } = await supabase
      .from("productos")
      .select("*", { count: "exact", head: true })
      .eq("user_id", session.user.id);

    setProductosCount(productos || 0);

    // CATEGORÍAS
    const { count: categorias } = await supabase
      .from("categorias")
      .select("*", { count: "exact", head: true })
      .eq("user_id", session.user.id);

    setCategoriasCount(categorias || 0);

    setLoading(false);
  };

  const crearCatalogo = async () => {
    if (!nuevoNombre.trim() || !user) return;

    const { data, error } = await supabase
      .from("catalogos")
      .insert([
        {
          nombre: nuevoNombre,
          user_id: user.id,
        },
      ])
      .select()
      .single();

    if (!error && data) {
      setCatalogo(data);
      setNuevoNombre("");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        Cargando dashboard...
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">

       <div className="bg-gray-900/50 border-b border-gray-800 sticky top-0 z-20 backdrop-blur-md px-5 py-6 md:px-10 md:py-8 mb-6 md:mb-8">
  <div className="max-w-6xl mx-auto flex flex-col items-start text-left gap-3">

    {/* Label */}
    <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-widest">
      <MenuSquare className="w-4 h-4" />
      <span>principal</span>
    </div>

    {/* Título */}
    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
      Panel de control
    </h1>

  </div>
</div>

        {/* DASHBOARD */}
        {catalogo && (
          //<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {/* MENÚ */}
            <button
              onClick={() => irA("/dashboard/agregar-producto")}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-left hover:bg-gray-800 transition"
            >
              <MenuSquare className="text-orange-500 mb-3" />
              <p className="text-gray-400 text-sm">Menú</p>
              <h3 className="text-xl font-bold">
                {catalogo.nombre}
              </h3>
            </button>

            {/* PRODUCTOS */}
            <button
              onClick={() => irA("/dashboard/productos")}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-left hover:bg-gray-800 transition"
            >
              <Package className="text-green-500 mb-3" />
              <p className="text-gray-400 text-sm">Productos</p>
              <h3 className="text-xl font-bold">
                {productosCount}
              </h3>
            </button>

            {/* CATEGORÍAS */}
            <button
              onClick={() => irA("/dashboard/categorias")}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-left hover:bg-gray-800 transition"
            >
              <Tags className="text-blue-500 mb-3" />
              <p className="text-gray-400 text-sm">Categorías</p>
              <h3 className="text-xl font-bold">
                {categoriasCount}
              </h3>
            </button>

            {/* QR */}
            <button
              onClick={() => irA("/dashboard/qr")}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-left hover:bg-gray-800 transition"
            >
              <QrCode className="text-purple-500 mb-3" />
              <p className="text-gray-400 text-sm">QR</p>
              <h3 className="text-xl font-bold">Activo</h3>
            </button>

            {/* APARIENCIA */}
            <button
              onClick={() => irA("/dashboard/apariencia")}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-left hover:bg-gray-800 transition"
            >
              <Palette className="text-pink-500 mb-3" />
              <p className="text-gray-400 text-sm">Apariencia</p>
              <h3 className="text-xl font-bold">Personalizar</h3>
            </button>

            {/* ESTADÍSTICAS */}
            <button
              onClick={() => irA("/dashboard/estadisticas")}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-left hover:bg-gray-800 transition"
            >
              <BarChart3 className="text-yellow-500 mb-3" />
              <p className="text-gray-400 text-sm">Estadísticas</p>
              <h3 className="text-xl font-bold">Ver datos</h3>
            </button>

            {/* MENÚ PÚBLICO */}
            <button
              onClick={() => irA(`/${catalogo.slug}`)}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-left hover:bg-gray-800 transition"
            >
              <Globe className="text-cyan-500 mb-3" />
              <p className="text-gray-400 text-sm">Menú público</p>
              <h3 className="text-xl font-bold">
                Ver online
              </h3>
            </button>

          </div>
        )}

        {/* SIN MENÚ */}
        {!catalogo && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-xl">

            <h2 className="text-2xl font-bold mb-3">
              Crea tu primer menú
            </h2>

            <p className="text-gray-400 mb-6">
              Configura tu menú digital en menos de 5 minutos.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">

              <input
                type="text"
                placeholder="Nombre del menú"
                value={nuevoNombre}
                onChange={(e) => setNuevoNombre(e.target.value)}
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
              />

              <button
                onClick={crearCatalogo}
                className="bg-white text-black px-6 py-2 rounded-lg font-medium hover:bg-gray-200"
              >
                Crear menú
              </button>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}