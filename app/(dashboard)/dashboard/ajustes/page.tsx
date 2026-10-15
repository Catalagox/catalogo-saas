"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { PageHeader } from "@/components/dashboard/PageHeader";
import Link from "next/link";
import SelectorTema from "@/components/dashboard/principal/SelectorTema";
import { ArrowRight, Globe2, Settings } from "lucide-react";
// Importación de subcomponentes visuales
import FormNombreMenu from "@/components/dashboard/ajustes/FormNombreMenu";
import FormContacto from "@/components/dashboard/ajustes/FormContacto";
import FormPassword from "@/components/dashboard/ajustes/FormPassword";
import BotonSuscripcionPortal from "@/components/dashboard/ajustes/BotonSuscripcionPortal";
export default function AjustesPage() {
  const [email, setEmail] = useState("");
  const [nombreMenu, setNombreMenu] = useState("");
  const [password, setPassword] = useState("");
  // PAÍS DE REGISTRO
  const [paisCode, setPaisCode] = useState("PE"); // 👈 NUEVO: Estado maestro inicializado por defecto
  // CONTACTO Y PAÍS
  const [whatsapp, setWhatsapp] = useState("");
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
        whatsapp,
        pais_code  
      `,
      )
      .eq("user_id", user.id)
      .single();
    if (data) {
      setNombreMenu(data.nombre || "");
      setWhatsapp(data.whatsapp || "");
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
  // GUARDAR CONTACTO Y PAÍS
  const guardarContacto = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Tu sesión expiró. Inicia sesión nuevamente.");
    const whatsappLimpio = whatsapp.replace(/\D/g, "");
    const { error } = await supabase
      .from("catalogos")
      .update({
        whatsapp: whatsappLimpio,
        pais_code: paisCode, // 👈 NUEVO: Guardamos el código de país en Supabase
      })
      .eq("user_id", user.id);
    if (error) {
      throw error;
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
        <section id="apariencia" className="scroll-mt-24 rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-5 sm:p-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Apariencia del panel</h2>
          <p className="mt-2 mb-5 text-sm text-[var(--text-secondary)]">Elige cómo quieres ver tu panel de control.</p>
          <div className="max-w-sm"><SelectorTema /></div>
        </section>
        {/* DOMINIO PERSONALIZADO */}
        <Link
          href="/dashboard/ajustes/dominios"
          className="group block rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-5 transition hover:border-[var(--color-primary)]/50 hover:bg-[var(--bg-card-hover)] sm:p-6"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
              <Globe2 className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-bold text-[var(--text-primary)]">
                Dominio personalizado
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                Conecta tu propio dominio para que tus clientes encuentren tu
                tienda fácilmente.
              </p>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-[var(--text-secondary)] transition-transform group-hover:translate-x-1 group-hover:text-[var(--color-primary)]" />
          </div>
        </Link>
        {/* NOMBRE DEL MENÚ */}
        <FormNombreMenu
          nombreMenu={nombreMenu}
          setNombreMenu={setNombreMenu}
          generarSlug={generarSlug}
          guardarNombreMenu={guardarNombreMenu}
        />
        {/* CONTACTO Y PAÍS */}
        <FormContacto
          paisCode={paisCode}
          setPaisCode={setPaisCode}
          whatsapp={whatsapp}
          setWhatsapp={setWhatsapp}
          guardarContacto={guardarContacto}
        />
        {/* PASSWORD */}
        <FormPassword
          password={password}
          setPassword={setPassword}
          cambiarPassword={cambiarPassword}
        />
        {/* CUENTA */}
        <div id="cuenta" className="scroll-mt-24 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-6 space-y-6">
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
            <div id="suscripcion" className="scroll-mt-24 border-t border-[var(--border-card)] pt-4">
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
