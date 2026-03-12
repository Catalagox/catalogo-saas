"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import ProductGrid from "@/components/dashboard/productos/ProductGrid";
import ProductEditModal from "@/components/dashboard/productos/ProductEditModal";

// Definimos los tipos aquí para que sean consistentes
export type Categoria = { id: string; nombre: string; };
export type Producto = {
  id: string;
  nombre: string;
  precio: number;
  descripcion?: string;
  disponible: boolean;
  categoria_id: string;
  imagen_url?: string;
};

export default function ProductosDashboard() {
  const [userId, setUserId] = useState<string | null>(null);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    iniciar();
  }, []);

  const iniciar = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setUserId(user.id);
    await cargarDatos(user.id);
    setLoading(false);
  };

  const cargarDatos = async (uid: string) => {
    const { data: prod } = await supabase.from("productos").select("*").eq("user_id", uid).order("id", { ascending: false });
    const { data: cat } = await supabase.from("categorias").select("*").eq("user_id", uid);
    setProductos(prod || []);
    setCategorias(cat || []);
  };

  const eliminarProducto = async (id: string) => {
    if (!confirm("¿Eliminar este producto?")) return;
    await supabase.from("productos").delete().eq("id", id);
    cargarDatos(userId!);
  };

  const cambiarDisponibilidad = async (producto: Producto) => {
    await supabase.from("productos").update({ disponible: !producto.disponible }).eq("id", producto.id);
    cargarDatos(userId!);
  };

  const subirImagen = async (): Promise<string | null> => {
    if (!newImageFile) return editingProduct?.imagen_url || null;
    const fileName = `${editingProduct!.id}-${Date.now()}`;
    const { error: uploadError } = await supabase.storage.from("productos").upload(fileName, newImageFile);
    if (uploadError) return editingProduct?.imagen_url || null;
    return supabase.storage.from("productos").getPublicUrl(fileName).data.publicUrl;
  };

  const guardarEdicion = async () => {
    if (!editingProduct) return;
    const imagen_url = await subirImagen();
    await supabase.from("productos").update({
      nombre: editingProduct.nombre,
      precio: editingProduct.precio,
      descripcion: editingProduct.descripcion,
      categoria_id: editingProduct.categoria_id,
      imagen_url,
    }).eq("id", editingProduct.id);

    cerrarModal();
    cargarDatos(userId!);
  };

  const cerrarModal = () => {
    setEditingProduct(null);
    setNewImageFile(null);
    setPreviewImage(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setNewImageFile(e.target.files[0]);
    setPreviewImage(URL.createObjectURL(e.target.files[0]));
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-10">
      <h1 className="text-3xl font-bold mb-10 text-center">Gestión de Productos</h1>
      
      <ProductGrid 
        productos={productos} 
        categorias={categorias}
        onToggle={cambiarDisponibilidad}
        onEdit={(p) => setEditingProduct(p)}
        onDelete={eliminarProducto}
      />

      {editingProduct && (
        <ProductEditModal 
          producto={editingProduct}
          categorias={categorias}
          previewImage={previewImage}
          onFileChange={handleFileChange}
          setProducto={setEditingProduct}
          onCancel={cerrarModal}
          onSave={guardarEdicion}
        />
      )}
    </div>
  );
}