"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import CreateCategoryForm from "@/components/dashboard/agregar-producto/CreateCategoryForm";

import CategoryHeader from "@/components/dashboard/categorias/CategoryHeader";
import CategoryList from "@/components/dashboard/categorias/CategoryList";

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

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        Cargando categorías...
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">

      <div className="max-w-3xl mx-auto space-y-10">

        <CategoryHeader />

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8">
          <CreateCategoryForm
            userId={userId}
            catalogoId={catalogoId}
            onCreated={() => catalogoId && cargarCategorias(catalogoId)}
          />
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">

          <h2 className="text-xl font-semibold mb-6">
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