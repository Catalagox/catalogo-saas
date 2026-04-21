"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

import {
  MenuSquare,
  Package,
  Tags,
  QrCode,
  Palette,
  BarChart3,
  Globe,
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
      .select("id, nombre, slug, created_at")
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (catalogoData) setCatalogo(catalogoData);

    const { count: productos } = await supabase
      .from("productos")
      .select("*", { count: "exact", head: true })
      .eq("user_id", session.user.id);

    setProductosCount(productos || 0);

    const { count: categorias } = await supabase
      .from("categorias")
      .select("*", { count: "exact", head: true })
      .eq("user_id", session.user.id);

    setCategoriasCount(categorias || 0);

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
      <div className="flex items-center justify-center py-20 text-[var(--text-secondary)]">
        Cargando dashboard...
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* HEADER */}
        <div className="bg-[var(--bg-card)] border-b border-[var(--border-card)] sticky top-0 z-20 backdrop-blur-md px-5 py-6 md:px-10 md:py-8 mb-6 md:mb-8">
          <div className="max-w-6xl mx-auto flex flex-col gap-3">
            <div className="flex items-center gap-2 text-[var(--text-secondary)] text-xs font-bold uppercase tracking-widest">
              <MenuSquare className="w-4 h-4" />
              <span>principal</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
              Panel de control
            </h1>
          </div>
        </div>

        {/* DASHBOARD */}
        {catalogo && (
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
              {
                icon: <Globe className="text-cyan-500 mb-3" />,
                label: "Menú público",
                value: "Ver online",
                action: () => irA(`/${catalogo.slug}`),
              },
            ].map((card, i) => (
              <button
                key={i}
                onClick={card.action}
                className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-6 text-left hover:bg-[var(--bg-card-hover)] transition duration-200"
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
          </div>
        )}

        {/* SIN MENÚ */}
        {!catalogo && (
          <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-8 max-w-xl">
            <h2 className="text-2xl font-bold mb-3 text-[var(--text-primary)]">
              Crea tu primer menú
            </h2>

            <p className="text-[var(--text-secondary)] mb-6">
              Configura tu menú digital en menos de 5 minutos.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Nombre del menú"
                value={nuevoNombre}
                onChange={(e) => setNuevoNombre(e.target.value)}
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-[var(--text-primary)]"
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
      </div>
    </div>
  );
}
