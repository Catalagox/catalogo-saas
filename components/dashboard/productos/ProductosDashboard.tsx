"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import ProductGrid from "@/components/dashboard/productos/ProductGrid";
import ProductEditModal from "@/components/dashboard/productos/ProductEditModal";
import { Loader2, Package, Search, Filter } from "lucide-react";
import imageCompression from "browser-image-compression"; // 📦 Importamos la librería que ya tienes

// Tipos consistentes
export type Categoria = { id: string; nombre: string };
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
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    iniciar();
  }, []);

  const iniciar = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    setUserId(user.id);
    await cargarDatos(user.id);
    setLoading(false);
  };

  const cargarDatos = async (uid: string) => {
    const { data: prod } = await supabase
      .from("productos")
      .select("*")
      .eq("user_id", uid)
      .order("nombre", { ascending: true });

    const { data: cat } = await supabase
      .from("categorias")
      .select("*")
      .eq("user_id", uid)
      .order("nombre", { ascending: true });

    setProductos(prod || []);
    setCategorias(cat || []);
  };

  // 🛠️ FUNCIÓN AUXILIAR: Extrae la ruta interna (ej: "id_user/archivo.webp") de una URL pública
  const obtenerPathDesdeUrl = (url?: string): string | null => {
    if (!url) return null;
    const splitKey = "/storage/v1/object/public/productos/";
    const parts = url.split(splitKey);
    return parts.length > 1 ? parts[1] : null;
  };

  // 🛠️ FUNCIÓN AUXILIAR: Elimina un archivo físicamente de Supabase Storage
  const borrarArchivoStorage = async (urlCompleta?: string) => {
    const pathArchivo = obtenerPathDesdeUrl(urlCompleta);
    if (!pathArchivo) return;

    const { error } = await supabase.storage
      .from("productos")
      .remove([pathArchivo]);

    if (error) {
      console.error("Error al eliminar archivo del Storage:", error.message);
    } else {
      console.log("✅ Archivo eliminado con éxito de Supabase Storage:", pathArchivo);
    }
  };

  // 🔥 MODIFICADO: Ahora elimina también la foto física de la carpeta Supabase
  const eliminarProducto = async (id: string) => {
    if (
      !confirm(
        "¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.",
      )
    )
      return;

    try {
      // 1. Buscar el producto localmente para conocer su URL actual de imagen
      const productoAEliminar = productos.find((p) => p.id === id);

      // 2. Si tiene imagen asociada, borrarla de Supabase Storage primero
      if (productoAEliminar?.imagen_url) {
        await borrarArchivoStorage(productoAEliminar.imagen_url);
      }

      // 3. Eliminar el registro en la base de datos PostgreSQL
      const { error } = await supabase.from("productos").delete().eq("id", id);
      
      if (!error) {
        setProductos(productos.filter((p) => p.id !== id));
        alert("Producto eliminado correctamente");
      } else {
        throw error;
      }
    } catch (err) {
      console.error(err);
      alert("Error al eliminar el producto de la base de datos");
    }
  };

  const cambiarDisponibilidad = async (producto: Producto) => {
    const nuevoEstado = !producto.disponible;
    setProductos(
      productos.map((p) =>
        p.id === producto.id ? { ...p, disponible: nuevoEstado } : p,
      ),
    );

    const { error } = await supabase
      .from("productos")
      .update({ disponible: nuevoEstado })
      .eq("id", producto.id);

    if (error) {
      cargarDatos(userId!);
      alert("Error al actualizar disponibilidad");
    }
  };

  // ⚡ MODIFICADO: Comprime con tu librería y convierte a .webp de manera automática
  const subirImagen = async (): Promise<string | null> => {
    if (!newImageFile) return editingProduct?.imagen_url || null;

    // Configuración de compresión óptima
    const opciones = {
      maxSizeMB: 0.8,              // Tamaño máximo ~800KB
      maxWidthOrHeight: 1000,      // Max 1000px de ancho/alto
      useWebWorker: true,
      fileType: "image/webp",      // Fuerza la compresión a formato WebP moderno
    };

    try {
      console.log(`📸 [Original] Peso: ${(newImageFile.size / (1024 * 1024)).toFixed(2)} MB`);
      
      // 1. Ejecutar compresión
      const imagenComprimidaFile = await imageCompression(newImageFile, opciones);
      console.log(`⚡ [Comprimido WebP] Peso: ${(imagenComprimidaFile.size / 1024).toFixed(2)} KB`);

      // 2. Generar nombre de archivo único siempre con extensión .webp
      const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(2, 7)}.webp`;

      // 3. Subir el blob optimizado
      const { error: uploadError } = await supabase.storage
        .from("productos")
        .upload(fileName, imagenComprimidaFile, {
          cacheControl: "public, max-age=31536000, immutable",
          contentType: "image/webp",
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("productos").getPublicUrl(fileName);
      return data.publicUrl;
    } catch (error) {
      console.error("Error al procesar/subir imagen:", error);
      alert("No se pudo procesar la nueva imagen");
      return editingProduct?.imagen_url || null;
    }
  };

  // 🔥 MODIFICADO: Controla si hay foto vieja para eliminarla tras subir la nueva
  const guardarEdicion = async () => {
    if (!editingProduct) return;

    try {
      setLoading(true);
      
      const fotoViejaUrl = productos.find((p) => p.id === editingProduct.id)?.imagen_url;
      
      // 1. Subir y comprimir la nueva imagen (si es que se seleccionó una)
      const imagen_url = await subirImagen();

      // 2. Si cambió la foto con éxito (la URL nueva es distinta a la vieja), borrar el archivo viejo
      if (newImageFile && fotoViejaUrl && imagen_url !== fotoViejaUrl) {
        await borrarArchivoStorage(fotoViejaUrl);
      }

      // 3. Guardar cambios en la base de datos
      const { error } = await supabase
        .from("productos")
        .update({
          nombre: editingProduct.nombre,
          precio: Number(editingProduct.precio),
          descripcion: editingProduct.descripcion,
          categoria_id: editingProduct.categoria_id,
          imagen_url: imagen_url || "",
        })
        .eq("id", editingProduct.id);

      if (error) throw error;

      cerrarModal();
      await cargarDatos(userId!);
      alert("Producto editado exitosamente");
    } catch (err) {
      console.error(err);
      alert("Error al guardar los cambios");
    } {
      setLoading(false);
    }
  };

  const cerrarModal = () => {
    setEditingProduct(null);
    setNewImageFile(null);
    setPreviewImage(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewImageFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading && productos.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-[var(--color-primary)] animate-spin" />
        <p className="text-[var(--text-secondary)] animate-pulse">
          Cargando productos...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white pb-20">
      <div className="bg-[var(--bg-card)] border-b border-[var(--border-card)] sticky top-0 z-20 backdrop-blur-md px-6 py-8 md:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-[var(--text-secondary)] text-xs font-bold uppercase tracking-widest mb-2">
              <Package className="w-4 h-4 text-[var(--text-secondary)]" />
              <span>Inventario</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
              Mis Productos
            </h1>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-6 md:p-10">
        {productosFiltrados.length > 0 ? (
          <ProductGrid
            productos={productosFiltrados}
            categorias={categorias}
            onToggle={cambiarDisponibilidad}
            onEdit={(p) => setEditingProduct(p)}
            onDelete={eliminarProducto}
          />
        ) : (
          <div className="text-center py-20 bg-gray-900/30 rounded-3xl border border-dashed border-gray-800">
            <Package className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-400">
              No se encontraron productos
            </h3>
            <p className="text-gray-600">
              Prueba ajustando tu búsqueda o agrega uno nuevo.
            </p>
          </div>
        )}
      </main>

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