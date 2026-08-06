"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import imageCompression from "browser-image-compression";

import { PageHeader } from "@/components/dashboard/PageHeader";
import { Settings } from "lucide-react";

// Importación de subcomponentes visuales
import FormNombreMenu from "@/components/dashboard/ajustes/FormNombreMenu";
import FormLogo from "@/components/dashboard/ajustes/FormLogo";
import FormContacto from "@/components/dashboard/ajustes/FormContacto";
import FormPassword from "@/components/dashboard/ajustes/FormPassword";
import BotonSuscripcionPortal from "@/components/dashboard/ajustes/BotonSuscripcionPortal";

export default function AjustesPage() {
  const [email, setEmail] = useState("");
  const [nombreMenu, setNombreMenu] = useState("");
  const [password, setPassword] = useState("");

  // PAÍS DE REGISTRO
  const [paisCode, setPaisCode] = useState("PE"); // 👈 NUEVO: Estado maestro inicializado por defecto

  // LOGO
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
        youtube,
        pais_code   
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
      setPaisCode(data.pais_code || "PE"); 
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

  // SUBIR LOGO (CON COMPRESIÓN INTEGRADAS)
  const subirLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setSubiendoLogo(true);
      let file = e.target.files?.[0];
      if (!file) return;

      // ─── CONFIGURACIÓN Y PROCESO DE COMPRESIÓN ───
      const opciones = {
        maxSizeMB: 0.2,            // Máximo 200KB de peso objetivo
        maxWidthOrHeight: 500,     // Redimensionar si mide más de 500px de ancho o alto
        useWebWorker: true,
      };

      try {
        file = await imageCompression(file, opciones);
      } catch (compressionError) {
        console.error("Error al comprimir, se intentará subir original:", compressionError);
      }
      // ─────────────────────────────────────────────

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

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

      const fileExt = file.name.split(".").pop() || "jpg";
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

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

      const { data } = supabase.storage.from("logos").getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

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
      alert("Logo optimizado y actualizado correctamente");
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error");
    } finally {
      setSubiendoLogo(false);
    }
  };

  // GUARDAR CONTACTO Y PAÍS
  const guardarContacto = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const whatsappLimpio = whatsapp.replace("+", "");

    const { error } = await supabase
      .from("catalogos")
      .update({
        whatsapp: whatsappLimpio,
        instagram,
        facebook,
        tiktok,
        youtube,
        pais_code: paisCode, // 👈 NUEVO: Guardamos el código de país en Supabase
      })
      .eq("user_id", user.id);

    if (error) {
      alert("Error al guardar contacto");
    } else {
      alert("Contacto y configuración de moneda actualizados correctamente");
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

  // 1. Agrega useEffect en tus hooks si aún no lo tienes
useEffect(() => {
  if (!loading) {
    // Si la URL tiene #logo, hace scroll suave hacia ese elemento
    if (window.location.hash === "#logo") {
      const el = document.getElementById("logo");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }
}, [loading]);

 // 🔄 LOADING (SKELETON PÁGINA AJUSTES)
  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-pulse">
        {/* 🟢 HEADER SKELETON (PageHeader) */}
        <div className="flex items-center justify-between py-4 border-b border-[var(--border-card)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)]" />
            <div className="space-y-2">
              <div className="h-3 w-20 rounded bg-white/10" />
              <div className="h-6 w-48 rounded-lg bg-white/10" />
            </div>
          </div>
          <div className="h-9 w-20 rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)]" />
        </div>

        {/* 🟢 CONTENEDOR DE SECCIONES (MAX-W-2XL) */}
        <div className="max-w-2xl mx-auto space-y-8">
          
          {/* Section 1: FormNombreMenu */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-6 space-y-4">
            <div className="h-5 w-40 rounded bg-white/10 mb-2" />
            <div className="space-y-2">
              <div className="h-3 w-24 rounded bg-white/10" />
              <div className="h-11 w-full rounded-xl bg-white/5 border border-[var(--border-card)]" />
            </div>
            <div className="h-10 w-28 rounded-xl bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/30 ml-auto" />
          </div>

          {/* Section 2: FormLogo */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-6 space-y-4">
            <div className="h-5 w-32 rounded bg-white/10 mb-2" />
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-white/10 border border-[var(--border-card)] shrink-0" />
              <div className="space-y-2 w-full">
                <div className="h-3 w-48 rounded bg-white/10" />
                <div className="h-9 w-36 rounded-xl bg-white/5 border border-[var(--border-card)]" />
              </div>
            </div>
          </div>

          {/* Section 3: FormContacto */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-6 space-y-4">
            <div className="h-5 w-48 rounded bg-white/10 mb-2" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-3 w-20 rounded bg-white/10" />
                  <div className="h-11 w-full rounded-xl bg-white/5 border border-[var(--border-card)]" />
                </div>
              ))}
            </div>
            <div className="h-10 w-28 rounded-xl bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/30 ml-auto" />
          </div>

          {/* Section 4: Cuenta & Suscripción */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-6 space-y-6">
            <div className="h-5 w-24 rounded bg-white/10" />
            <div className="space-y-2">
              <div className="h-3 w-32 rounded bg-white/10" />
              <div className="h-11 w-full rounded-lg bg-white/5 border border-[var(--border-card)]" />
            </div>
            <div className="border-t border-[var(--border-card)] pt-4 space-y-3">
              <div className="h-4 w-40 rounded bg-white/10" />
              <div className="h-10 w-44 rounded-xl bg-white/5 border border-[var(--border-card)]" />
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* HEADER REUTILIZABLE */}
      <PageHeader
        title="Ajustes de la cuenta"
        category="Configuración"
        icon={Settings}
        showBackButton={true}
      />

      <div className="max-w-2xl mx-auto space-y-8">
        {/* NOMBRE DEL MENÚ */}
        <FormNombreMenu
          nombreMenu={nombreMenu}
          setNombreMenu={setNombreMenu}
          generarSlug={generarSlug}
          guardarNombreMenu={guardarNombreMenu}
        />

        {/* LOGO */}
        <FormLogo
          logo={logo}
          subiendoLogo={subiendoLogo}
          subirLogo={subirLogo}
        />

        {/* CONTACTO Y REDES */}
        <FormContacto
          paisCode={paisCode}      
          setPaisCode={setPaisCode} 
          whatsapp={whatsapp}
          setWhatsapp={setWhatsapp}
          instagram={instagram}
          setInstagram={setInstagram}
          facebook={facebook}
          setFacebook={setFacebook}
          tiktok={tiktok}
          setTiktok={setTiktok}
          youtube={youtube}
          setYoutube={setYoutube}
          guardarContacto={guardarContacto}
        />

        {/* PASSWORD */}
        <FormPassword
          password={password}
          setPassword={setPassword}
          cambiarPassword={cambiarPassword}
        />

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