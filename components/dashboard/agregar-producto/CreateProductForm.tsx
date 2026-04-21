"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import ButtonPrimary from "@/components/dashboard/agregar-producto/ButtonPrimary";
import { Upload, X, Plus } from "lucide-react";

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

  const handleChange = (e: any) => {
    setProducto({ ...producto, [e.target.name]: e.target.value });
  };

  const handleImagenChange = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImagen(file);
    setPreview(URL.createObjectURL(file));
  };

  const eliminarImagen = (e: any) => {
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
    if (!res.ok) throw new Error(data.error);

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

      await supabase.from("productos").insert([
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

      setProducto({
        nombre: "",
        descripcion: "",
        precio: "",
        categoria_id: "",
      });
      setImagen(null);
      setPreview(null);
      onCreated();
      alert("Producto creado correctamente");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-[var(--bg-card)] border border-[var(--border-card)] p-5 md:p-8 rounded-2xl shadow-2xl mb-12">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-[var(--color-primary)]/10 rounded-lg">
          <Plus className="w-5 h-5 text-[var(--color-primary)]" />
        </div>

        <h2 className="text-2xl font-bold text-[var(--text-primary)]">
          Nuevo Producto
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* IMAGEN */}
        <div className="lg:col-span-2">
          <label className="block text-sm text-[var(--text-secondary)] mb-3">
            Imagen de portada
          </label>

          <div
            onClick={() => fileInputRef.current?.click()}
            className={`relative group aspect-square flex flex-col items-center justify-center border-2 border-dashed rounded-2xl cursor-pointer transition
              ${
                preview
                  ? "border-transparent bg-[var(--bg-tertiary)]"
                  : "border-[var(--border-card)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5"
              }`}
          >
            {preview ? (
              <>
                <img src={preview} className="w-full h-full object-cover" />

                <button
                  onClick={eliminarImagen}
                  className="absolute top-3 right-3 p-1.5 bg-[var(--color-danger)] text-white rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="text-center p-6">
                <div className="mb-4 inline-flex p-4 bg-[var(--bg-tertiary)] rounded-full text-[var(--text-secondary)] group-hover:text-[var(--color-primary)] transition">
                  <Upload className="w-8 h-8" />
                </div>

                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  Click para subir
                </p>

                <p className="text-xs text-[var(--text-secondary)] mt-2">
                  JPG, PNG o WEBP
                </p>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleImagenChange}
          />
        </div>

        {/* FORM */}
        <div className="lg:col-span-3 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-[var(--text-secondary)]">
                Nombre
              </label>
              <input
                name="nombre"
                value={producto.nombre}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-card)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] text-[var(--text-primary)]"
              />
            </div>

            <div>
              <label className="text-sm text-[var(--text-secondary)]">
                Precio
              </label>
              <input
                name="precio"
                type="number"
                value={producto.precio}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-card)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] text-[var(--text-primary)]"
              />
            </div>
          </div>

          <select
            name="categoria_id"
            value={producto.categoria_id}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-card)] text-[var(--text-primary)]"
          >
            <option value="">Sin categoría</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>

          <textarea
            name="descripcion"
            rows={4}
            value={producto.descripcion}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-card)] text-[var(--text-primary)]"
          />

          <ButtonPrimary
            onClick={crearProducto}
            disabled={loading}
            className="w-full py-4 rounded-xl font-bold text-lg"
          >
            {loading ? "Procesando..." : "Publicar Producto"}
          </ButtonPrimary>
        </div>
      </div>
    </div>
  );
}
