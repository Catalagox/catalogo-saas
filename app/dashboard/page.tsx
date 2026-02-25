"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Catalogo = {
  id: string;
  nombre: string;
  created_at: string;
};

export default function DashboardPage() {
  const [catalogos, setCatalogos] = useState<Catalogo[]>([]);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    cargarCatalogos();
    obtenerUsuario();
  }, []);

  const obtenerUsuario = async () => {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
  };

  const cargarCatalogos = async () => {
    const { data } = await supabase
      .from("catalogos")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setCatalogos(data);
    setLoading(false);
  };

  const crearCatalogo = async () => {
    if (!nuevoNombre.trim()) return;

    const { data, error } = await supabase
      .from("catalogos")
      .insert([{ nombre: nuevoNombre }])
      .select();

    if (!error && data) {
      setCatalogos([data[0], ...catalogos]);
      setNuevoNombre("");
    }
  };

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      
      {/* NAVBAR */}
      <header className="border-b border-gray-800 bg-gray-900 px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight">
            Catalagox
          </h1>
          <p className="text-sm text-gray-400">
            Panel de administración
          </p>
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">
                {user.user_metadata?.full_name}
              </p>
              <p className="text-xs text-gray-400">
                {user.email}
              </p>
            </div>

            <img
              src={user.user_metadata?.avatar_url}
              alt="Avatar"
              className="w-10 h-10 rounded-full border border-gray-700"
            />

            <button
              onClick={cerrarSesion}
              className="text-sm bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </header>

      {/* CONTENIDO */}
      <main className="max-w-6xl mx-auto px-6 py-10">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-10 gap-6">
          <div>
            <h2 className="text-3xl font-bold">
              Dashboard
            </h2>
            <p className="text-gray-400 mt-2">
              Gestiona tus catálogos digitales
            </p>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <input
              type="text"
              placeholder="Nombre del catálogo"
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value)}
              className="flex-1 md:w-64 bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            />

            <button
              onClick={crearCatalogo}
              className="bg-white text-black px-6 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
            >
              + Crear
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <p className="text-gray-400 text-sm">
              Total catálogos
            </p>
            <h3 className="text-4xl font-bold mt-2">
              {catalogos.length}
            </h3>
          </div>
        </div>

        {/* TABLA */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-gray-400">
              Cargando...
            </div>
          ) : catalogos.length === 0 ? (
            <div className="p-8 text-gray-400">
              No tienes catálogos todavía.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-800 text-gray-400 uppercase text-xs tracking-wider">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      Nombre
                    </th>
                    <th className="px-6 py-4 text-left">
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {catalogos.map((cat) => (
                    <tr
                      key={cat.id}
                      className="border-t border-gray-800 hover:bg-gray-800 transition"
                    >
                      <td className="px-6 py-4 font-medium text-white">
                        {cat.nombre}
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {new Date(cat.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}