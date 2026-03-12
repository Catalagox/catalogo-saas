"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AjustesPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [nombreMenu, setNombreMenu] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    setEmail(user.email || "");

    const { data } = await supabase
      .from("catalogos")
      .select("nombre")
      .eq("user_id", user.id)
      .single();

    if (data) {
      setNombreMenu(data.nombre);
    }

    setLoading(false);
  };

  const guardarNombreMenu = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase
      .from("catalogos")
      .update({ nombre: nombreMenu })
      .eq("user_id", user.id);

    alert("Nombre del menú actualizado");
  };

  const cambiarPassword = async () => {
    if (!password) return;

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      alert("Error al cambiar contraseña");
    } else {
      alert("Contraseña actualizada");
      setPassword("");
    }
  };

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        Cargando ajustes...
      </div>
    );
  }

  return (
    <div className="flex justify-center w-full">

      <div className="w-full max-w-2xl space-y-8">

        <h1 className="text-3xl font-bold">
          Ajustes
        </h1>

        {/* INFORMACIÓN DE CUENTA */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">

          <h2 className="text-xl font-semibold">
            Cuenta
          </h2>

          <div>
            <p className="text-sm text-gray-400">
              Email
            </p>

            <div className="bg-gray-800 rounded-lg p-3 text-sm">
              {email}
            </div>
          </div>

        </div>

        {/* NOMBRE DEL MENU */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">

          <h2 className="text-xl font-semibold">
            Nombre del menú
          </h2>

          <input
            value={nombreMenu}
            onChange={(e) => setNombreMenu(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
          />

          <button
            onClick={guardarNombreMenu}
            className="bg-orange-500 hover:bg-orange-600 px-5 py-2 rounded-lg font-semibold"
          >
            Guardar
          </button>

        </div>

        {/* CAMBIAR PASSWORD */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">

          <h2 className="text-xl font-semibold">
            Cambiar contraseña
          </h2>

          <input
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
          />

          <button
            onClick={cambiarPassword}
            className="bg-orange-500 hover:bg-orange-600 px-5 py-2 rounded-lg font-semibold"
          >
            Actualizar contraseña
          </button>

        </div>

        {/* CERRAR SESIÓN */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">

          <button
            onClick={cerrarSesion}
            className="w-full bg-red-500 hover:bg-red-600 py-3 rounded-lg font-semibold"
          >
            Cerrar sesión
          </button>

        </div>

      </div>

    </div>
  );
}