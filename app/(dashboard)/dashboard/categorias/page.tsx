"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import CreateCategoryForm from "@/components/dashboard/agregar-producto/CreateCategoryForm";
import CategoryList from "@/components/dashboard/categorias/CategoryList";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Tag } from "lucide-react"; 

type Categoria = {
  id: string;
  nombre: string;
};

export default function CategoriasPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [catalogoId, setCatalogoId] = useState<string | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    iniciar();
  }, []);

  const iniciar = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    setUserId(user.id);

    const { data: catalogo } = await supabase
      .from("catalogos")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (catalogo) {
      setCatalogoId(catalogo.id);
      await cargarCategorias(catalogo.id);
    }

    setLoading(false);
  };

  const cargarCategorias = async (catalogoId: string) => {
    const { data } = await supabase
      .from("categorias")
      .select("*")
      .eq("catalogo_id", catalogoId)
      .order("created_at", { ascending: true });

    setCategorias(data || []);
  };

  const eliminarCategoria = async (id: string) => {
    const confirmar = confirm("¿Eliminar esta categoría?");
    if (!confirmar) return;

    await supabase.from("categorias").delete().eq("id", id);

    if (catalogoId) cargarCategorias(catalogoId);
  };

  const iniciarEdicion = (categoria: Categoria) => {
    setEditingId(categoria.id);
    setNuevoNombre(categoria.nombre);
  };

  const guardarEdicion = async () => {
    if (!editingId) return;

    await supabase
      .from("categorias")
      .update({ nombre: nuevoNombre })
      .eq("id", editingId);

    setEditingId(null);
    setNuevoNombre("");

    if (catalogoId) cargarCategorias(catalogoId);
  };

  // 🔄 LOADING (SKELETON PÁGINA CATEGORÍAS)
  if (loading) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 animate-pulse">
        <div className="max-w-3xl mx-auto space-y-10">
          
          {/* 🟢 HEADER SKELETON (PageHeader) */}
          <div className="flex items-center justify-between py-4 border-b border-[var(--border-card)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)]" />
              <div className="space-y-2">
                <div className="h-3 w-16 rounded bg-white/10" />
                <div className="h-6 w-52 rounded-lg bg-white/10" />
              </div>
            </div>
            <div className="h-9 w-20 rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)]" />
          </div>

          {/* 🟢 CARD SKELETON: FORMULARIO CREAR CATEGORÍA */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="h-4 w-36 rounded bg-white/10" />
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Input */}
              <div className="h-12 w-full rounded-xl bg-white/5 border border-[var(--border-card)]" />
              {/* Botón */}
              <div className="h-12 w-full sm:w-36 rounded-xl bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/30 shrink-0" />
            </div>
          </div>

          {/* 🟢 CARD SKELETON: LISTA DE CATEGORÍAS */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-6 space-y-6">
            {/* Título de la lista */}
            <div className="h-6 w-40 rounded-md bg-white/10" />

            {/* Filas de categorías (Simulación de 4 elementos) */}
            <div className="space-y-3">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-[var(--border-card)]"
                >
                  {/* Nombre de categoría con icono tenue */}
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 rounded bg-white/10" />
                    <div className="h-4 w-32 rounded bg-white/10" />
                  </div>

                  {/* Acciones (Botones Editar y Eliminar) */}
                  <div className="flex gap-2">
                    <div className="h-8 w-8 rounded-lg bg-white/10" />
                    <div className="h-8 w-8 rounded-lg bg-white/10" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-10">

        
        <PageHeader
          title="Gestión de Categorías"
          category="Catálogo"
          icon={Tag}
          showBackButton={true}
        />

        {/* Crear categoría */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-6 sm:p-8">
          <CreateCategoryForm
            userId={userId}
            catalogoId={catalogoId}
            onCreated={() => catalogoId && cargarCategorias(catalogoId)}
          />
        </div>

        {/* Lista de categorías */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-6 text-[var(--text-primary)]">
            Tus categorías
          </h2>

          <CategoryList
            categorias={categorias}
            editingId={editingId}
            nuevoNombre={nuevoNombre}
            setNuevoNombre={setNuevoNombre}
            iniciarEdicion={iniciarEdicion}
            guardarEdicion={guardarEdicion}
            cancelarEdicion={() => setEditingId(null)}
            eliminarCategoria={eliminarCategoria}
          />
        </div>
      </div>
    </div>
  );
}
