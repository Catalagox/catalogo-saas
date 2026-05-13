"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AjustesPage() {
  const [email, setEmail] = useState("");
  const [nombreMenu, setNombreMenu] = useState("");
  const [password, setPassword] = useState("");

  // CONTACTO Y REDES
  const [whatsapp, setWhatsapp] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [youtube, setYoutube] = useState("");

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
      .select(
        `
        nombre,
        whatsapp,
        instagram,
        facebook,
        tiktok,
        youtube
      `,
      )
      .eq("user_id", user.id)
      .single();

    if (data) {
      setNombreMenu(data.nombre || "");
      setWhatsapp(data.whatsapp || "");
      setInstagram(data.instagram || "");
      setFacebook(data.facebook || "");
      setTiktok(data.tiktok || "");
      setYoutube(data.youtube || "");
    }

    setLoading(false);
  };

  // GUARDAR NOMBRE
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

  // GUARDAR CONTACTO
  const guardarContacto = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from("catalogos")
      .update({
        whatsapp,
        instagram,
        facebook,
        tiktok,
        youtube,
      })
      .eq("user_id", user.id);

    if (error) {
      alert("Error al guardar contacto");
    } else {
      alert("Contacto actualizado");
    }
  };

  // CAMBIAR PASSWORD
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

        {/* CONTACTO Y REDES */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-6 space-y-5">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            Contacto y redes
          </h2>

          {/* WHATSAPP */}
          <div className="space-y-2">
            <p className="text-sm text-[var(--text-secondary)]">WhatsApp</p>

            <input
              type="text"
              placeholder="5491122334455"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-card)] text-[var(--text-primary)] rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-[var(--color-primary)] placeholder:text-[var(--text-secondary)]"
            />
          </div>

          {/* INSTAGRAM */}
          <div className="space-y-2">
            <p className="text-sm text-[var(--text-secondary)]">Instagram</p>

            <input
              type="text"
              placeholder="https://instagram.com/tu-negocio"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-card)] text-[var(--text-primary)] rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-[var(--color-primary)] placeholder:text-[var(--text-secondary)]"
            />
          </div>

          {/* FACEBOOK */}
          <div className="space-y-2">
            <p className="text-sm text-[var(--text-secondary)]">Facebook</p>

            <input
              type="text"
              placeholder="https://facebook.com/tu-negocio"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-card)] text-[var(--text-primary)] rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-[var(--color-primary)] placeholder:text-[var(--text-secondary)]"
            />
          </div>

          {/* TIKTOK */}
          <div className="space-y-2">
            <p className="text-sm text-[var(--text-secondary)]">TikTok</p>

            <input
              type="text"
              placeholder="https://tiktok.com/@tu-negocio"
              value={tiktok}
              onChange={(e) => setTiktok(e.target.value)}
              className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-card)] text-[var(--text-primary)] rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-[var(--color-primary)] placeholder:text-[var(--text-secondary)]"
            />
          </div>

          {/* YOUTUBE */}
          <div className="space-y-2">
            <p className="text-sm text-[var(--text-secondary)]">YouTube</p>

            <input
              type="text"
              placeholder="https://youtube.com/@tu-negocio"
              value={youtube}
              onChange={(e) => setYoutube(e.target.value)}
              className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-card)] text-[var(--text-primary)] rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-[var(--color-primary)] placeholder:text-[var(--text-secondary)]"
            />
          </div>

          <button
            onClick={guardarContacto}
            className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-text-inverse)] px-5 py-2 rounded-lg font-semibold transition"
          >
            Guardar contacto
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
