"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

import {
  MenuSquare,
  Package,
  Tags,
  QrCode,
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

  useEffect(() => {
    inicializar();
  }, []);

  const inicializar = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.push("/");
      return;
    }

    setUser(session.user);

    const { data } = await supabase
      .from("catalogos")
      .select("id, nombre, slug, created_at")
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (data) {
      setCatalogo(data);
    }

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

        {/* DASHBOARD STATS */}

        {catalogo && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <MenuSquare className="text-orange-500 mb-3" />
              <p className="text-gray-400 text-sm">Menú</p>
              <h3 className="text-xl font-bold">
                {catalogo.nombre}
              </h3>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <Package className="text-green-500 mb-3" />
              <p className="text-gray-400 text-sm">Productos</p>
              <h3 className="text-xl font-bold">0</h3>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <Tags className="text-blue-500 mb-3" />
              <p className="text-gray-400 text-sm">Categorías</p>
              <h3 className="text-xl font-bold">0</h3>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <QrCode className="text-purple-500 mb-3" />
              <p className="text-gray-400 text-sm">QR activo</p>
              <h3 className="text-xl font-bold">1</h3>
            </div>

          </div>
        )}

        {/* SI NO TIENE MENÚ */}

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

        {/* ACCIONES RÁPIDAS */}

        {catalogo && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">

            <h2 className="text-xl font-semibold mb-6">
              Acciones rápidas
            </h2>

            <div className="flex flex-wrap gap-4">

              <button
                onClick={() => router.push("/dashboard/agregar-producto")}
                className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-200"
              >
                Editar menú
              </button>

              <button
                onClick={() => router.push("/dashboard/qr")}
                className="border border-gray-700 px-6 py-3 rounded-lg hover:bg-gray-800"
              >
                Ver QR
              </button>

              <button
  onClick={() => router.push(`/${catalogo.slug}`)}
  className="border border-gray-700 px-6 py-3 rounded-lg hover:bg-gray-800"
>
  Ver menú público
</button>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}