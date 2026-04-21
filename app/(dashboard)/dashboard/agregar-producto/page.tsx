"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import CreateProductForm from "@/components/dashboard/agregar-producto/CreateProductForm";
import { Loader2, AlertCircle } from "lucide-react";

type Categoria = {
  id: string;
  nombre: string;
};

export default function NuevoProductoPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [catalogoId, setCatalogoId] = useState<string | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    iniciar();
  }, []);

  const iniciar = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      setUserId(user.id);

      const { data: catalogo, error: catalogoError } = await supabase
        .from("catalogos")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (catalogoError) throw catalogoError;
      setCatalogoId(catalogo.id);

      const { data: categoriasData, error: categoriasError } = await supabase
        .from("categorias")
        .select("id, nombre")
        .eq("user_id", user.id)
        .order("nombre");

      if (categoriasError) throw categoriasError;
      setCategorias(categoriasData || []);

    } catch (error) {
      console.error("Error al iniciar:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔄 LOADING
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-[var(--color-primary)] animate-spin" />
        <p className="text-[var(--text-secondary)] font-medium animate-pulse">
          Sincronizando catálogo...
        </p>
      </div>
    );
  }

  // ⚠️ SIN CATÁLOGO
  if (!catalogoId) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 text-center bg-[var(--bg-card)] border border-[var(--border-card)] rounded-3xl">

        <div className="bg-[var(--color-warning)]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-[var(--color-warning)]" />
        </div>

        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
          Falta configuración
        </h2>

        <p className="text-[var(--text-secondary)] mb-6">
          Para agregar productos, primero debes configurar la información básica de tu menú.
        </p>

        <button className="text-[var(--color-primary)] font-semibold hover:underline">
          Ir a configuración del catálogo →
        </button>

      </div>
    );
  }

  return (
    <div className="w-full min-h-screen pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="relative">

          {/* Glow adaptado a tu verde */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[var(--color-primary)]/10 blur-[100px] pointer-events-none" />

          {userId ? (
            <CreateProductForm
              userId={userId}
              catalogoId={catalogoId}
              categorias={categorias}
              onCreated={() => {
                console.log("Producto creado");
              }}
            />
          ) : (
            <div className="bg-[var(--bg-card)] border border-[var(--border-card)] p-10 rounded-2xl text-center">
              <Loader2 className="w-8 h-8 text-[var(--color-primary)] animate-spin mx-auto mb-4" />
              <p className="text-[var(--text-secondary)]">
                Validando sesión de usuario...
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}