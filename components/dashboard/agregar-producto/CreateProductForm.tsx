"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import ButtonPrimary from "@/components/dashboard/agregar-producto/ButtonPrimary";
import { Upload, X, ImageIcon, Plus } from "lucide-react"; // O usa tus iconos preferidos

type Categoria = {
  id: string;
  nombre: string;
};

type Props = {
  userId: string | null;
  catalogoId: string;
  categorias: Categoria[];
  onCreated: () => void;
};

export default function CreateProductForm({
  userId,
  catalogoId,
  categorias,
  onCreated,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [imagen, setImagen] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [producto, setProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria_id: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setProducto({
      ...producto,
      [e.target.name]: e.target.value,
    });
  };

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImagen(file);
    setPreview(URL.createObjectURL(file));
  };

  const eliminarImagen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImagen(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const subirImagen = async (): Promise<string> => {
    if (!imagen) throw new Error("Debes seleccionar una imagen");
    if (!userId) throw new Error("Usuario no autenticado");

    const formData = new FormData();
    formData.append("file", imagen);
    formData.append("userId", userId);

    const res = await fetch("/api/upload-product-image", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error subiendo imagen");

    return data.url;
  };

  const crearProducto = async () => {
    if (!userId) return alert("Usuario no autenticado");
    if (!producto.nombre || !producto.precio)
      return alert("Nombre y precio son obligatorios");
    if (!imagen) return alert("Debes subir una imagen");

    try {
      setLoading(true);
      const imagen_url = await subirImagen();

      const { error } = await supabase.from("productos").insert([
        {
          user_id: userId,
          catalogo_id: catalogoId,
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          precio: Number(producto.precio),
          categoria_id: producto.categoria_id || null,
          imagen_url,
          disponible: true,
        },
      ]);

      if (error) throw error;

      setProducto({ nombre: "", descripcion: "", precio: "", categoria_id: "" });
      setImagen(null);
      setPreview(null);
      onCreated();
      alert("Producto creado correctamente");
    } catch (err: any) {
      alert(err.message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-gray-900 border border-gray-800 p-5 md:p-8 rounded-2xl shadow-2xl mb-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-indigo-500/10 rounded-lg">
          <Plus className="w-5 h-5 text-indigo-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">Nuevo Producto</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Columna Izquierda: Imagen */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-400 mb-3">
            Imagen de portada
          </label>
          
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`relative group aspect-square flex flex-col items-center justify-center border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden
              ${preview 
                ? "border-transparent bg-gray-800" 
                : "border-gray-700 hover:border-indigo-500 hover:bg-indigo-500/5"
              }`}
          >
            {preview ? (
              <>
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <p className="text-white text-sm font-medium">Cambiar imagen</p>
                </div>
                <button
                  onClick={eliminarImagen}
                  className="absolute top-3 right-3 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-transform hover:scale-110 z-10"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="text-center p-6">
                <div className="mb-4 inline-flex p-4 bg-gray-800 rounded-full text-gray-500 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-colors">
                  <Upload className="w-8 h-8" />
                </div>
                <p className="text-sm font-semibold text-gray-300">Click para subir</p>
                <p className="text-xs text-gray-500 mt-2">JPG, PNG o WEBP (Máx. 5MB)</p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImagenChange}
          />
        </div>

        {/* Columna Derecha: Datos */}
        <div className="lg:col-span-3 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400 ml-1">Nombre</label>
              <input
                name="nombre"
                placeholder="Ej: Hamburguesa Doble"
                value={producto.nombre}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400 ml-1">Precio</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  name="precio"
                  type="number"
                  placeholder="0.00"
                  value={producto.precio}
                  onChange={handleChange}
                  className="w-full pl-8 pr-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-white"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400 ml-1">Categoría</label>
            <select
              name="categoria_id"
              value={producto.categoria_id}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-white appearance-none cursor-pointer"
            >
              <option value="">Sin categoría</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400 ml-1">Descripción</label>
            <textarea
              name="descripcion"
              rows={4}
              placeholder="Cuéntanos más sobre este producto..."
              value={producto.descripcion}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-white resize-none"
            />
          </div>

          <div className="pt-4">
            <ButtonPrimary onClick={crearProducto} disabled={loading} className="w-full py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-500/20">
              {loading ? "Procesando..." : "Publicar Producto"}
            </ButtonPrimary>
          </div>
        </div>
      </div>
    </div>
  );
}