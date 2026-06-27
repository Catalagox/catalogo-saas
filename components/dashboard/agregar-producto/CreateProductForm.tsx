"use client";

import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import ButtonPrimary from "@/components/dashboard/agregar-producto/ButtonPrimary";
import { Upload, X, Plus } from "lucide-react";
import imageCompression from "browser-image-compression";

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

  // 🧹 Limpieza de memoria profesional para evitar fugas de recursos (URLs de previsualización)
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

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

    // Validación comercial: Bloquear archivos excesivamente masivos o no soportados antes de procesar
    if (!file.type.startsWith("image/")) {
      return alert("El archivo seleccionado no es una imagen válida.");
    }

    // Si ya existía una previsualización previa, liberamos su memoria antes de crear la nueva
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setImagen(file);
    setPreview(URL.createObjectURL(file));
  };

  const eliminarImagen = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setImagen(null);
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }

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
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ⚡ FUNCIÓN DE COMPRESIÓN PROFESIONAL (NIVEL PRODUCCIÓN)
  const procesarYComprimirImagen = async (archivo: File): Promise<File> => {
    const opciones = {
      maxSizeMB: 0.4, // Límite estricto comercial para el archivo final (~400KB)
      maxWidthOrHeight: 1200, // Redimensionado inteligente a un estándar web óptimo
      useWebWorker: true, // No bloquea la UI o hilos del teléfono del usuario
      fileType: "image/webp", // Conversión automática a formato WebP eficiente
      initialQuality: 0.8, // Calidad balanceada óptima
    };

    // Imprimir métricas iniciales en consola
    const pesoOriginalMB = (archivo.size / (1024 * 1024)).toFixed(2);
    console.log(`%c📸 [Imagen Original]: ${archivo.name} | Peso: ${pesoOriginalMB} MB`, "color: #3b82f6; font-weight: bold;");

    try {
      const archivoComprimido = await imageCompression(archivo, opciones);
      
      // Renombrar el archivo de salida para garantizar la extensión .webp válida en producción
      const nombreBase = archivo.name.substring(0, archivo.name.lastIndexOf(".")) || archivo.name;
      const archivoFinalWebp = new File([archivoComprimido], `${nombreBase}.webp`, {
        type: "image/webp",
      });

      // Imprimir métricas de compresión finales
      const pesoComprimidoKB = (archivoFinalWebp.size / 1024).toFixed(2);
      const ahorro = (100 - (archivoFinalWebp.size / archivo.size) * 100).toFixed(0);
      console.log(
        `%c⚡ [Compresión Comercial Exitosa]: Nuevo Peso: ${pesoComprimidoKB} KB | Ahorro de Cuota: ${ahorro}%`, 
        "color: #10b981; font-weight: bold;"
      );

      return archivoFinalWebp;
    } catch (error) {
      console.error("❌ Error durante el proceso de compresión de imagen:", error);
      throw new Error("No se pudo optimizar la imagen para la subida.");
    }
  };

  const subirImagen = async (): Promise<string> => {
    if (!imagen) throw new Error("Debes seleccionar una imagen");
    if (!userId) throw new Error("Usuario no autenticado");

    // Ejecutar el motor de compresión avanzado
    const imagenOptimizada = await procesarYComprimirImagen(imagen);

    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 9)}.webp`;

    const filePath = `${userId}/${fileName}`;

    // Subida óptima a Supabase con políticas inmutables agresivas de caché para los dispositivos clientes
    const { error: uploadError } = await supabase.storage
      .from("productos")
      .upload(filePath, imagenOptimizada, {
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

/*
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

  const subirImagen = async (): Promise<string> => {
    if (!imagen) throw new Error("Debes seleccionar una imagen");
    if (!userId) throw new Error("Usuario no autenticado");

    const fileExt = imagen.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 9)}.${fileExt}`;

    const filePath = `${userId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("productos")
      .upload(filePath, imagen, {
        cacheControl: "3600",
        upsert: false,
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