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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setProducto((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImagen(file);
    setPreview(URL.createObjectURL(file));
  };

  const eliminarImagen = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setImagen(null);
    setPreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const resetForm = () => {
    setProducto({
      nombre: "",
      descripcion: "",
      precio: "",
      categoria_id: "",
    });

    setImagen(null);
    setPreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ⚡ FUNCIÓN NATIVA PARA COMPRIMIR IMÁGENES A WEBP
  const comprimirImagen = (archivo: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(archivo);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Redimensionar si la imagen es excesivamente grande
          const MAX_WIDTH = 1000;
          const MAX_HEIGHT = 1000;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) return reject(new Error("No se pudo obtener el contexto Canvas"));
          ctx.drawImage(img, 0, 0, width, height);

          // Convertir a WebP con calidad del 75%
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error("Error al comprimir la imagen"));
              }
            },
            "image/webp",
            0.75
          );
        };
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const subirImagen = async (): Promise<string> => {
    if (!imagen) throw new Error("Debes seleccionar una imagen");
    if (!userId) throw new Error("Usuario no autenticado");

    // 📊 Métrica 1: Obtener y mostrar el peso original de la foto elegida
    const pesoOriginalMB = (imagen.size / (1024 * 1024)).toFixed(2);
    console.log(`📸 [Original] Archivo: ${imagen.name} | Peso: ${pesoOriginalMB} MB`);

    // 1. Comprimir la imagen antes de iniciar la carga
    const imagenComprimidaBlob = await comprimirImagen(imagen);

    // 📊 Métrica 2: Calcular el peso comprimido y el porcentaje exacto de ahorro de datos
    const pesoComprimidoKB = (imagenComprimidaBlob.size / 1024).toFixed(2);
    const pesoComprimidoMB = (imagenComprimidaBlob.size / (1024 * 1024)).toFixed(2);
    const ahorroPorcentaje = (100 - (imagenComprimidaBlob.size / imagen.size) * 100).toFixed(0);
    
    console.log(`⚡ [Comprimido WebP] Peso: ${pesoComprimidoKB} KB (${pesoComprimidoMB} MB)`);
    console.log(`🎉 ¡Ahorro del ${ahorroPorcentaje}% en el Cached Egress de tu cuota de Supabase!`);

    // 2. Definir el nombre del archivo siempre con extensión .webp
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 9)}.webp`;

    const filePath = `${userId}/${fileName}`;

    // 3. Subir el archivo optimizado con políticas agresivas de caché para el móvil del cliente
    const { error: uploadError } = await supabase.storage
      .from("productos")
      .upload(filePath, imagenComprimidaBlob, {
        cacheControl: "public, max-age=31536000, immutable",
        upsert: false,
        contentType: "image/webp",
      });

    if (uploadError) {
      throw new Error("Error al subir al storage: " + uploadError.message);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("productos").getPublicUrl(filePath);

    return publicUrl;
  };

  const crearProducto = async () => {
    if (!userId) return alert("Usuario no autenticado");

    // 🔒 Verificar suscripción activa
    const { data: catalogo, error: catalogoError } = await supabase
      .from("catalogos")
      .select("suscripcion_activa")
      .eq("id", catalogoId)
      .single();

    if (catalogoError) {
      console.error(catalogoError);
      return alert("No se pudo validar la suscripción.");
    }

    if (!catalogo?.suscripcion_activa) {
      return alert(
        "Tu suscripción está vencida. Debes renovar tu plan para seguir agregando productos."
      );
    }

    if (!producto.nombre.trim() || !producto.precio) {
      return alert("Nombre y precio son obligatorios");
    }

    if (!imagen) {
      return alert("Debes subir una imagen");
    }

    try {
      setLoading(true);

      const imagen_url = await subirImagen();

      const { error } = await supabase.from("productos").insert([
        {
          user_id: userId,
          catalogo_id: catalogoId,
          nombre: producto.nombre.trim(),
          descripcion: producto.descripcion.trim(),
          precio: Number(producto.precio),
          categoria_id: producto.categoria_id || null,
          imagen_url,
          disponible: true,
        },
      ]);

      if (error) throw error;

      resetForm();
      onCreated();

      alert("Producto creado correctamente");
    } catch (err: any) {
      console.error("Error al crear producto:", err);
      alert(err?.message || "Ocurrió un error al crear el producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-[var(--bg-card)] border border-[var(--border-card)] p-5 md:p-8 rounded-2xl shadow-2xl mb-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-[var(--color-primary)]/10 rounded-lg">
          <Plus className="w-5 h-5 text-[var(--color-primary)]" />
        </div>

        <h2 className="text-2xl font-bold text-[var(--text-primary)]">
          Nuevo Producto
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2">
          <label className="block text-sm text-[var(--text-secondary)] mb-3">
            Imagen de portada
          </label>

          <div
            onClick={() => fileInputRef.current?.click()}
            className={`relative group aspect-square flex flex-col items-center justify-center border-2 border-dashed rounded-2xl cursor-pointer transition ${
              preview
                ? "border-transparent bg-[var(--bg-tertiary)]"
                : "border-[var(--border-card)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5"
            }`}
          >
            {preview ? (
              <>
                <img
                  src={preview}
                  alt="Vista previa del producto"
                  className="w-full h-full object-cover rounded-2xl"
                />

                <button
                  type="button"
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
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handleImagenChange}
          />
        </div>

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
                placeholder="Ej: Camiseta de algodón"
                className="input-dark w-full px-4 py-3 rounded-xl focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
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
                placeholder="0.00"
                className="input-dark w-full px-4 py-3 rounded-xl focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-[var(--text-secondary)]">
              Categoría
            </label>

            <select
              name="categoria_id"
              value={producto.categoria_id}
              onChange={handleChange}
              className="input-dark w-full px-4 py-3 rounded-xl focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
            >
              <option value="">Sin categoría</option>

              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-[var(--text-secondary)]">
              Descripción
            </label>

            <textarea
              name="descripcion"
              rows={4}
              value={producto.descripcion}
              onChange={handleChange}
              placeholder="Describe los detalles de tu producto..."
              className="input-dark w-full px-4 py-3 rounded-xl focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
            />
          </div>

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



/*"use client";

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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setProducto((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImagen(file);
    setPreview(URL.createObjectURL(file));
  };

  const eliminarImagen = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setImagen(null);
    setPreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const resetForm = () => {
    setProducto({
      nombre: "",
      descripcion: "",
      precio: "",
      categoria_id: "",
    });

    setImagen(null);
    setPreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ⚡ FUNCIÓN NATIVA PARA COMPRIMIR IMÁGENES A WEBP
  const comprimirImagen = (archivo: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(archivo);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Redimensionar si la imagen es excesivamente grande
          const MAX_WIDTH = 1000;
          const MAX_HEIGHT = 1000;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) return reject(new Error("No se pudo obtener el contexto Canvas"));
          ctx.drawImage(img, 0, 0, width, height);

          // Convertir a WebP con calidad del 75%
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error("Error al comprimir la imagen"));
              }
            },
            "image/webp",
            0.75
          );
        };
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const subirImagen = async (): Promise<string> => {
    if (!imagen) throw new Error("Debes seleccionar una imagen");
    if (!userId) throw new Error("Usuario no autenticado");

    // 1. Comprimir la imagen antes de iniciar la carga
    const imagenComprimidaBlob = await comprimirImagen(imagen);

    // 2. Definir el nombre del archivo siempre con extensión .webp
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 9)}.webp`;

    const filePath = `${userId}/${fileName}`;

    // 3. Subir el archivo optimizado con políticas agresivas de caché para el móvil del cliente
    const { error: uploadError } = await supabase.storage
      .from("productos")
      .upload(filePath, imagenComprimidaBlob, {
        cacheControl: "public, max-age=31536000, immutable",
        upsert: false,
        contentType: "image/webp",
      });

    if (uploadError) {
      throw new Error("Error al subir al storage: " + uploadError.message);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("productos").getPublicUrl(filePath);

    return publicUrl;
  };

  const crearProducto = async () => {
    if (!userId) return alert("Usuario no autenticado");

    // 🔒 Verificar suscripción activa
    const { data: catalogo, error: catalogoError } = await supabase
      .from("catalogos")
      .select("suscripcion_activa")
      .eq("id", catalogoId)
      .single();

    if (catalogoError) {
      console.error(catalogoError);
      return alert("No se pudo validar la suscripción.");
    }

    if (!catalogo?.suscripcion_activa) {
      return alert(
        "Tu suscripción está vencida. Debes renovar tu plan para seguir agregando productos."
      );
    }

    if (!producto.nombre.trim() || !producto.precio) {
      return alert("Nombre y precio son obligatorios");
    }

    if (!imagen) {
      return alert("Debes subir una imagen");
    }

    try {
      setLoading(true);

      const imagen_url = await subirImagen();

      const { error } = await supabase.from("productos").insert([
        {
          user_id: userId,
          catalogo_id: catalogoId,
          nombre: producto.nombre.trim(),
          descripcion: producto.descripcion.trim(),
          precio: Number(producto.precio),
          categoria_id: producto.categoria_id || null,
          imagen_url,
          disponible: true,
        },
      ]);

      if (error) throw error;

      resetForm();
      onCreated();

      alert("Producto creado correctamente");
    } catch (err: any) {
      console.error("Error al crear producto:", err);
      alert(err?.message || "Ocurrió un error al crear el producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-[var(--bg-card)] border border-[var(--border-card)] p-5 md:p-8 rounded-2xl shadow-2xl mb-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-[var(--color-primary)]/10 rounded-lg">
          <Plus className="w-5 h-5 text-[var(--color-primary)]" />
        </div>

        <h2 className="text-2xl font-bold text-[var(--text-primary)]">
          Nuevo Producto
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2">
          <label className="block text-sm text-[var(--text-secondary)] mb-3">
            Imagen de portada
          </label>

          <div
            onClick={() => fileInputRef.current?.click()}
            className={`relative group aspect-square flex flex-col items-center justify-center border-2 border-dashed rounded-2xl cursor-pointer transition ${
              preview
                ? "border-transparent bg-[var(--bg-tertiary)]"
                : "border-[var(--border-card)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5"
            }`}
          >
            {preview ? (
              <>
                <img
                  src={preview}
                  alt="Vista previa del producto"
                  className="w-full h-full object-cover rounded-2xl"
                />

                <button
                  type="button"
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
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handleImagenChange}
          />
        </div>

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
                placeholder="Ej: Camiseta de algodón"
                className="input-dark w-full px-4 py-3 rounded-xl focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
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
                placeholder="0.00"
                className="input-dark w-full px-4 py-3 rounded-xl focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-[var(--text-secondary)]">
              Categoría
            </label>

            <select
              name="categoria_id"
              value={producto.categoria_id}
              onChange={handleChange}
              className="input-dark w-full px-4 py-3 rounded-xl focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
            >
              <option value="">Sin categoría</option>

              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-[var(--text-secondary)]">
              Descripción
            </label>

            <textarea
              name="descripcion"
              rows={4}
              value={producto.descripcion}
              onChange={handleChange}
              placeholder="Describe los detalles de tu producto..."
              className="input-dark w-full px-4 py-3 rounded-xl focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
            />
          </div>

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
}*/

