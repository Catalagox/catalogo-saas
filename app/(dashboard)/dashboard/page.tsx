"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import SuscripcionCard from "@/components/marketing/SuscripcionCard";

import {
  MenuSquare,
  Package,
  Tags,
  QrCode,
  Palette,
  BarChart3,
  Globe,
  Clock,
  AlertTriangle,
} from "lucide-react";

type Catalogo = {
  id: string;
  nombre: string;
  slug: string;
  created_at: string;
  plan_vence_el: string | null;
};

export default function DashboardPage() {
  const router = useRouter();

  const [catalogo, setCatalogo] = useState<Catalogo | null>(null);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
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

    const { data: catalogoData } = await supabase
      .from("catalogos")
      .select("id, nombre, slug, created_at, plan_vence_el")
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (catalogoData) {
      setCatalogo(catalogoData);
    }

    const { count: productos } = await supabase
      .from("productos")
      .select("*", { count: "exact", head: true })
      .eq("user_id", session.user.id);

    setProductosCount(productos || 0);

    const { count: categories } = await supabase
      .from("categorias")
      .select("*", { count: "exact", head: true })
      .eq("user_id", session.user.id);

    setCategoriasCount(categories || 0);

    setLoading(false);
  };

  const crearCatalogo = async () => {
    if (!nuevoNombre.trim() || !user || isCreating) return;

    setIsCreating(true);

    const fechaVencimiento = new Date();
    fechaVencimiento.setDate(fechaVencimiento.getDate() + 7);

    // Generamos un slug básico a partir del nombre
    const slugGenerado = nuevoNombre
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const { data: catalogoData, error: catalogoError } = await supabase
      .from("catalogos")
      .insert([
        {
          nombre: nuevoNombre,
          slug: slugGenerado,
          user_id: user.id,
          plan_vence_el: fechaVencimiento.toISOString(),
        },
      ])
      .select()
      .single();

    if (catalogoError || !catalogoData) {
      console.error("Error al crear el catálogo:", catalogoError);
      setIsCreating(false);
      return;
    }

    const { error: categoriaError } = await supabase.from("categorias").insert([
      {
        nombre: "General",
        user_id: user.id,
        catalogo_id: catalogoData.id,
      },
    ]);

    if (categoriaError) {
      console.error("Error al crear la categoría por defecto:", categoriaError);
    }

    setCatalogo(catalogoData);
    setCategoriasCount(1);
    setNuevoNombre("");
    setIsCreating(false);
  };

  const obtenerDiasRestantes = (fechaVencimientoISO: string | null) => {
    if (!fechaVencimientoISO) return { dias: 0, expirado: true };

    const ahora = new Date().getTime();
    const vencimiento = new Date(fechaVencimientoISO).getTime();
    const diferenciaMs = vencimiento - ahora;

    if (diferenciaMs <= 0) {
      return { dias: 0, expirado: true };
    }

    const dias = Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));
    return { dias, expirado: false };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-[var(--text-secondary)]">
        Cargando dashboard...
      </div>
    );
  }

  const infoPlan = obtenerDiasRestantes(catalogo?.plan_vence_el || null);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6 md:space-y-10">
        {/* HEADER */}
        <div className="bg-[var(--bg-card)] border-b border-[var(--border-card)] sticky top-0 z-20 backdrop-blur-md px-5 py-6 md:px-10 md:py-8 mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[var(--text-secondary)] text-xs font-bold uppercase tracking-widest">
              <MenuSquare className="w-4 h-4" />
              <span>principal</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
              Panel de control
            </h1>
          </div>

          {/* INDICADOR DE DÍAS REALES */}
          {catalogo && catalogo.plan_vence_el && (
            <div
              className={`flex items-center gap-2 self-start sm:self-center px-3.5 py-1.5 border rounded-full text-xs font-semibold ${
                infoPlan.expirado
                  ? "bg-red-500/10 border-red-500/20 text-red-400"
                  : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              }`}
            >
              {infoPlan.expirado ? (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                  <span>Prueba expirada (0 días)</span>
                </>
              ) : (
                <>
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    Suscripción: Activa ({infoPlan.dias}{" "}
                    {infoPlan.dias === 1 ? "día" : "días"} restantes)
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* CONTROL DE BLOQUEO POR EXPIRACIÓN */}
        {catalogo && infoPlan.expirado ? (
          <div className="bg-red-500/5 border border-red-500/20 rounded-3xl p-6 md:p-10 text-center space-y-4">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-black text-red-400 flex items-center justify-center gap-2">
                <AlertTriangle className="w-6 h-6 animate-bounce" /> Tu tiempo
                de prueba ha terminado
              </h2>
              <p className="text-[var(--text-secondary)] text-sm mt-2">
                Para seguir gestionando tus productos, ver estadísticas y
                mantener tu menú QR público disponible para tus clientes, activa
                tu membresía premium por solo $5 USD al mes.
              </p>
            </div>

            <SuscripcionCard user={user} />
          </div>
        ) : catalogo ? (
          /* GRID DEL DASHBOARD */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[
              {
                icon: <MenuSquare className="text-orange-500 mb-3" />,
                label: "Menú",
                value: catalogo.nombre,
                action: () => irA("/dashboard/agregar-producto"),
              },
              {
                icon: <Package className="text-green-500 mb-3" />,
                label: "Productos",
                value: productosCount,
                action: () => irA("/dashboard/productos"),
              },
              {
                icon: <Tags className="text-blue-500 mb-3" />,
                label: "Categorías",
                value: categoriasCount,
                action: () => irA("/dashboard/categorias"),
              },
              {
                icon: <QrCode className="text-purple-500 mb-3" />,
                label: "QR",
                value: "Activo",
                action: () => irA("/dashboard/qr"),
              },
              {
                icon: <Palette className="text-pink-500 mb-3" />,
                label: "Apariencia",
                value: "Personalizar",
                action: () => irA("/dashboard/apariencia"),
              },
              {
                icon: <BarChart3 className="text-yellow-500 mb-3" />,
                label: "Estadísticas",
                value: "Ver datos",
                action: () => irA("/dashboard/estadistica"),
              },
            ].map((card, i) => (
              <button
                key={i}
                onClick={card.action}
                className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-6 text-left hover:bg-[var(--bg-card-hover)] transition duration-200 cursor-pointer"
              >
                {card.icon}
                <p className="text-[var(--text-secondary)] text-sm">
                  {card.label}
                </p>
                <h3 className="text-xl font-bold text-[var(--text-primary)]">
                  {card.value}
                </h3>
              </button>
            ))}

            {/* TARJETA ESPECIAL DEL MENÚ PÚBLICO (Abre en pestaña nueva fuera del Dashboard) */}
            <a
              href={`/${catalogo.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-6 text-left hover:bg-[var(--bg-card-hover)] transition duration-200 cursor-pointer"
            >
              <Globe className="text-cyan-500 mb-3" />
              <p className="text-[var(--text-secondary)] text-sm">
                Menú público
              </p>
              <h3 className="text-xl font-bold text-[var(--text-primary)]">
                Ver online
              </h3>
            </a>
          </div>
        ) : (
          /* CREAR PRIMER CATALOGO */
          <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-8 max-w-xl">
            <h2 className="text-2xl font-bold mb-3 text-[var(--text-primary)]">
              Crea tu primer menú
            </h2>
            <p className="text-[var(--text-secondary)] mb-6">
              Configura tu menú digital en menos de 5 minutes y obtén 7 días de
              prueba completamente gratis.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Nombre del menú"
                value={nuevoNombre}
                onChange={(e) => setNuevoNombre(e.target.value)}
                disabled={isCreating}
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-[var(--text-primary)] disabled:opacity-50"
              />
              <button
                onClick={crearCatalogo}
                disabled={isCreating}
                className="bg-white text-black px-6 py-2 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50 transition cursor-pointer"
              >
                {isCreating ? "Creando..." : "Crear menú"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
