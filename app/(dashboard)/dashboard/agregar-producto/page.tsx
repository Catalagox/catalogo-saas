"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import CreateProductForm from "@/components/dashboard/agregar-producto/CreateProductForm";
import { Loader2, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Package } from "lucide-react"; // Importamos el ícono para la categoría

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

// 🔄 LOADING (SKELETON PADDING & FORM)
  if (loading) {
    return (
      <div className="w-full min-h-screen pb-20 animate-pulse">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* 🟢 SKELETON HEADER (PageHeader) */}
          <div className="flex items-center justify-between py-4 border-b border-[var(--border-card)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)]" />
              <div className="space-y-2">
                <div className="h-3 w-20 rounded bg-white/10" />
                <div className="h-6 w-48 rounded-lg bg-white/10" />
              </div>
            </div>
            <div className="h-9 w-24 rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)]" />
          </div>

          {/* 🟢 SKELETON DEL FORMULARIO */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-3xl p-6 sm:p-8 space-y-8">
            
            {/* Campo 1: Imagen del producto */}
            <div className="space-y-3">
              <div className="h-4 w-36 rounded bg-white/10" />
              <div className="h-40 w-full rounded-2xl border-2 border-dashed border-[var(--border-card)] bg-white/5 flex items-center justify-center">
                <div className="h-10 w-10 rounded-full bg-white/10" />
              </div>
            </div>

            {/* Grid 2 columnas: Nombre y Precio */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="h-4 w-28 rounded bg-white/10" />
                <div className="h-12 w-full rounded-xl bg-white/5 border border-[var(--border-card)]" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-24 rounded bg-white/10" />
                <div className="h-12 w-full rounded-xl bg-white/5 border border-[var(--border-card)]" />
              </div>
            </div>

            {/* Campo 3: Categoría */}
            <div className="space-y-2">
              <div className="h-4 w-32 rounded bg-white/10" />
              <div className="h-12 w-full rounded-xl bg-white/5 border border-[var(--border-card)]" />
            </div>

            {/* Campo 4: Descripción */}
            <div className="space-y-2">
              <div className="h-4 w-40 rounded bg-white/10" />
              <div className="h-28 w-full rounded-xl bg-white/5 border border-[var(--border-card)]" />
            </div>

            {/* Botón Guardar */}
            <div className="pt-4 flex justify-end">
              <div className="h-12 w-full sm:w-44 rounded-xl bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/30" />
            </div>

          </div>

        </div>
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
        {/* 🟢 HEADER DE PÁGINA */}
      <PageHeader
        title="Crear nuevo producto"
        category="Productos"
        icon={Package}
        showBackButton={true}
      />

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