"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import ButtonPrimary from "@/components/dashboard/agregar-producto/ButtonPrimary";


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

  const [producto, setProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria_id: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setProducto({
      ...producto,
      [e.target.name]: e.target.value,
    });
  };

const subirImagen = async () => {
  if (!imagen || !userId) return null;

  const formData = new FormData();
  formData.append("file", imagen);
  formData.append("userId", userId);

  const res = await fetch("/api/upload-product-image", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    console.error(data.error);
    return null;
  }

  return data.url;
};

  const crearProducto = async () => {
    if (!userId) return;

    if (!producto.nombre || !producto.precio) {
      alert("Nombre y precio son obligatorios");
      return;
    }

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

      if (error) {
        console.error("Error creando producto:", error);
        alert("Error creando el producto");
        return;
      }

      // limpiar formulario
      setProducto({
        nombre: "",
        descripcion: "",
        precio: "",
        categoria_id: "",
      });

      setImagen(null);

      onCreated();

    } catch (err) {
      console.error("Error inesperado:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-xl mb-12">
      <h2 className="text-xl font-semibold mb-6">
        Nuevo Producto
      </h2>

      <div className="grid gap-4 md:grid-cols-2">

        <input
          name="nombre"
          placeholder="Nombre del producto"
          value={producto.nombre}
          onChange={handleChange}
          className="px-4 py-2 rounded bg-gray-800 border border-gray-700"
        />

        <input
          name="precio"
          type="number"
          placeholder="Precio"
          value={producto.precio}
          onChange={handleChange}
          className="px-4 py-2 rounded bg-gray-800 border border-gray-700"
        />

        <select
          name="categoria_id"
          value={producto.categoria_id}
          onChange={handleChange}
          className="px-4 py-2 rounded bg-gray-800 border border-gray-700"
        >
          <option value="">Seleccionar categoría</option>

          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre}
            </option>
          ))}
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setImagen(e.target.files ? e.target.files[0] : null)
          }
          className="px-4 py-2 rounded bg-gray-800 border border-gray-700"
        />

      </div>

      <textarea
        name="descripcion"
        placeholder="Descripción del producto"
        value={producto.descripcion}
        onChange={handleChange}
        className="mt-4 w-full px-4 py-2 rounded bg-gray-800 border border-gray-700"
      />

      <div className="mt-6">
        <ButtonPrimary onClick={crearProducto} disabled={loading}>
          {loading ? "Creando..." : "Crear Producto"}
        </ButtonPrimary>
      </div>
    </div>
  );
}