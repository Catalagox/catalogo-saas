"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AjustesPage() {
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

  if (loading) {
    return (
      <div className="text-center py-20 text-[var(--text-secondary)]">
        Cargando ajustes...
      </div>
    );
  }

  return (
    <div className="flex justify-center w-full px-4">
      <div className="w-full max-w-2xl space-y-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">
          Ajustes
        </h1>

        {/* CUENTA */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            Cuenta
          </h2>

          <div>
            <p className="text-sm text-[var(--text-secondary)]">Email</p>

            <div className="bg-[var(--bg-tertiary)] border border-[var(--border-card)] rounded-lg p-3 text-sm text-[var(--text-primary)]">
              {email}
            </div>
          </div>
        </div>

        {/* NOMBRE DEL MENÚ */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            Nombre del menú
          </h2>

          <input
            value={nombreMenu}
            onChange={(e) => setNombreMenu(e.target.value)}
            className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-card)] text-[var(--text-primary)] rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />

          <button
            onClick={guardarNombreMenu}
            className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-text-inverse)] px-5 py-2 rounded-lg font-semibold transition"
          >
            Guardar
          </button>
        </div>

        {/* PASSWORD */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            Cambiar contraseña
          </h2>

          <input
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-card)] text-[var(--text-primary)] rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-[var(--color-primary)] placeholder:text-[var(--text-secondary)]"
          />

          <button
            onClick={cambiarPassword}
            className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-text-inverse)] px-5 py-2 rounded-lg font-semibold transition"
          >
            Actualizar contraseña
          </button>
        </div>
      </div>
    </div>
  );
}
