"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AparienciaPage() {
  const [nombre, setNombre] = useState("");
  const [colorPrimario, setColorPrimario] = useState("#f97316");
  const [colorFondo, setColorFondo] = useState("#111827");
  const [logo, setLogo] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("catalogos")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (data) {
      setNombre(data.nombre || "");
      setColorPrimario(data.color_primario || "#f97316");
      setColorFondo(data.color_fondo || "#111827");
    }

    setLoading(false);
  };

  const guardar = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase
      .from("catalogos")
      .update({
        nombre,
        color_primario: colorPrimario,
        color_fondo: colorFondo,
      })
      .eq("user_id", user.id);

    alert("Apariencia guardada");
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        Cargando apariencia...
      </div>
    );
  }

  return (
    <div className="flex justify-center w-full">

      <div className="w-full max-w-2xl">

        <h1 className="text-3xl font-bold mb-8">
          Apariencia del menú
        </h1>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 space-y-6">

          {/* NOMBRE */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Nombre del menú
            </label>

            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
            />
          </div>

          {/* LOGO */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Logo del restaurante
            </label>

            <input
              type="file"
              onChange={(e) =>
                setLogo(e.target.files ? e.target.files[0] : null)
              }
              className="w-full text-sm"
            />
          </div>

          {/* COLOR PRINCIPAL */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Color principal
            </label>

            <input
              type="color"
              value={colorPrimario}
              onChange={(e) => setColorPrimario(e.target.value)}
              className="w-20 h-10 border-none"
            />
          </div>

          {/* COLOR FONDO */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Color de fondo
            </label>

            <input
              type="color"
              value={colorFondo}
              onChange={(e) => setColorFondo(e.target.value)}
              className="w-20 h-10 border-none"
            />
          </div>

          {/* BOTON GUARDAR */}
          <button
            onClick={guardar}
            className="w-full bg-orange-500 hover:bg-orange-600 py-3 rounded-lg font-semibold"
          >
            Guardar cambios
          </button>

        </div>

      </div>

    </div>
  );
}