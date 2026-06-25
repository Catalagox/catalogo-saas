"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

// 🔥 IMPORTAMOS TU NUEVO COMPONENTE
import BotonSuscripcionPortal from "@/components/dashboard/ajustes/BotonSuscripcionPortal";

export default function AjustesPage() {
  const [email, setEmail] = useState("");
  const [nombreMenu, setNombreMenu] = useState("");
  const [password, setPassword] = useState("");

  // 🔥 LOGO
  const [logo, setLogo] = useState("");
  const [subiendoLogo, setSubiendoLogo] = useState(false);

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
        slug,
        logo,
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
      setLogo(data.logo || "");
      setWhatsapp(data.whatsapp || "");
      setInstagram(data.instagram || "");
      setFacebook(data.facebook || "");
      setTiktok(data.tiktok || "");
      setYoutube(data.youtube || "");
    }

    setLoading(false);
  };

  // GENERAR SLUG
  const generarSlug = (texto: string) => {
    return texto
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  // GUARDAR NOMBRE Y SLUG
  const guardarNombreMenu = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const slug = generarSlug(nombreMenu);

    const { error } = await supabase
      .from("catalogos")
      .update({
        nombre: nombreMenu,
        slug,
      })
      .eq("user_id", user.id);

    if (error) {
      if (error.message.includes("catalogos_slug_key")) {
        alert("Esa URL ya está en uso");
      } else {
        alert("Error al actualizar");
      }

      return;
    }

    alert("Nombre y URL actualizados");
  };

  // 🔥 SUBIR LOGO REFACTORIZADO (CREA CARPETA INDEPENDIENTE Y ELIMINA EL VIEJO)
  const subirLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setSubiendoLogo(true);

      const file = e.target.files?.[0];

      if (!file) return;

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // 1. 🗑️ LIMPIAR EL LOGO VIEJO SI EXISTE
      if (logo) {
        try {
          const urlParts = logo.split("/logos/");
          if (urlParts.length > 1) {
            const oldFilePath = urlParts[1];
            await supabase.storage.from("logos").remove([oldFilePath]);
            console.log("Logo anterior eliminado con éxito.");
          }
        } catch (cleanError) {
          console.error("Error al remover el logo anterior:", cleanError);
        }
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;

      // 2. 📂 ORGANIZAR EN CARPETA SEPARADA MEDIANTE EL USER_ID
      const filePath = `${user.id}/${fileName}`;

      // 🔥 SUBIR STORAGE
      const { error: uploadError } = await supabase.storage
        .from("logos")
        .upload(filePath, file, {
          upsert: true,
        });

      if (uploadError) {
        console.error(uploadError);

        alert("Error subiendo logo");

        return;
      }

      // 🔥 URL PÚBLICA
      const { data } = supabase.storage.from("logos").getPublicUrl(filePath);

      const publicUrl = data.publicUrl;

      // 🔥 GUARDAR EN DB
      const { error } = await supabase
        .from("catalogos")
        .update({
          logo: publicUrl,
        })
        .eq("user_id", user.id);

      if (error) {
        console.error(error);

        alert("Error guardando logo");

        return;
      }

      setLogo(publicUrl);

      alert("Logo actualizado");
    } catch (err) {
      console.error(err);

      alert("Ocurrió un error");
    } finally {
      setSubiendoLogo(false);
    }
  };

  // GUARDAR CONTACTO
  const guardarContacto = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    // LIMPIAR "+"
    const whatsappLimpio = whatsapp.replace("+", "");

    const { error } = await supabase
      .from("catalogos")
      .update({
        whatsapp: whatsappLimpio,
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

        {/* NOMBRE DEL MENÚ */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            Nombre del restaurante
          </h2>

          <input
            value={nombreMenu}
            onChange={(e) => setNombreMenu(e.target.value)}
            placeholder="Ej: Burger House"
            className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-card)] text-[var(--text-primary)] rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-[var(--color-primary)] placeholder:text-[var(--text-secondary)]"
          />

          {/* URL AUTOMÁTICA */}
          <div className="space-y-1">
            <p className="text-sm text-[var(--text-secondary)]">
              URL de tu catálogo
            </p>

            <div className="bg-[var(--bg-tertiary)] border border-[var(--border-card)] rounded-lg p-3 text-sm break-all text-[var(--text-primary)]">
              catalagox.com/{generarSlug(nombreMenu)}
            </div>
          </div>

          <button
            onClick={guardarNombreMenu}
            className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-text-inverse)] px-5 py-2 rounded-lg font-semibold transition"
          >
            Guardar cambios
          </button>
        </div>

        {/* 🔥 LOGO */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-6 space-y-5">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            Logo del restaurante
          </h2>

          {logo ? (
            <div className="flex justify-center">
              <img
                src={logo}
                alt="Logo"
                className="
                  w-28
                  h-28
                  rounded-full
                  object-cover
                  border
                  border-white/10
                "
              />
            </div>
          ) : (
            <div
              className="
                w-28
                h-28
                mx-auto
                rounded-full
                border
                border-dashed
                border-[var(--border-card)]
                flex
                items-center
                justify-center
                text-sm
                text-[var(--text-secondary)]
              "
            >
              Sin logo
            </div>
          )}

          <label
            className="
              flex
              items-center
              justify-center
              w-full
              h-12
              rounded-xl
              cursor-pointer
              font-semibold
              transition
              bg-[var(--color-primary)]
              hover:bg-[var(--color-primary-hover)]
              text-white
            "
          >
            {subiendoLogo ? "Subiendo..." : "Subir logo"}

            <input
              type="file"
              accept="image/*"
              onChange={subirLogo}
              className="hidden"
            />
          </label>
        </div>

        {/* CONTACTO Y REDES */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-6 space-y-5">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            Contacto y redes
          </h2>

          {/* WHATSAPP */}
          <div className="space-y-2">
            <p className="text-sm text-[var(--text-secondary)]">WhatsApp</p>

            <PhoneInput
              country={"ar"}
              value={whatsapp}
              onChange={(phone) => setWhatsapp(phone)}
              enableSearch
              disableSearchIcon
              inputStyle={{
                width: "100%",
                height: "44px",
                background: "var(--bg-tertiary)",
                border: "1px solid var(--border-card)",
                color: "var(--text-primary)",
                borderRadius: "10px",
                fontSize: "14px",
              }}
              buttonStyle={{
                background: "var(--bg-tertiary)",
                border: "1px solid var(--border-card)",
                borderRadius: "10px 0 0 10px",
              }}
              dropdownStyle={{
                background: "var(--bg-card)",
                color: "#000",
              }}
            />

            <p className="text-xs text-[var(--text-secondary)]">
              Selecciona tu país y escribe tu número.
            </p>
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

        {/* CUENTA */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-6 space-y-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            Cuenta
          </h2>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-[var(--text-secondary)] mb-1">
                Correo electrónico
              </p>

              <div className="bg-[var(--bg-tertiary)] border border-[var(--border-card)] rounded-lg p-3 text-sm text-[var(--text-primary)]">
                {email}
              </div>
            </div>

            {/* 🔥 AQUÍ QUEDA ACOMODADO EL COMPONENTE DE STRIPE */}
            <div className="border-t border-[var(--border-card)] pt-4">
              <p className="text-sm font-medium text-[var(--text-primary)] mb-2">
                Suscripción y Facturación
              </p>
              <BotonSuscripcionPortal />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}