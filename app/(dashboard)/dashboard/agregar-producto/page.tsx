"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import CreateProductForm from "@/components/dashboard/agregar-producto/CreateProductForm";

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

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    setUserId(user.id);

    // cargar catalogo
    const { data: catalogo, error: catalogoError } = await supabase
      .from("catalogos")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (catalogoError) {
      console.error(catalogoError);
      setLoading(false);
      return;
    }

    setCatalogoId(catalogo.id);

    // cargar categorias
    const { data: categoriasData, error: categoriasError } = await supabase
      .from("categorias")
      .select("id, nombre")
      .eq("user_id", user.id)
      .order("nombre");

    if (categoriasError) {
      console.error(categoriasError);
    }

    setCategorias(categoriasData || []);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        Cargando...
      </div>
    );
  }

  if (!catalogoId) {
    return (
      <div className="flex justify-center py-20 text-gray-400">
        Primero debes crear un menú.
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">

      <div className="max-w-3xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Agregar producto
          </h1>

          <p className="text-gray-400 mt-2">
            Crea un nuevo producto para tu menú.
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8">

          <CreateProductForm
            userId={userId}
            catalogoId={catalogoId}
            categorias={categorias}
            onCreated={() => {
              alert("Producto creado correctamente");
            }}
          />

        </div>

      </div>

    </div>
  );
}