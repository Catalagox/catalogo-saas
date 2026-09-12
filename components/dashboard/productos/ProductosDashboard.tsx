
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import ProductGrid from "@/components/dashboard/productos/ProductGrid";
import ProductEditModal from "@/components/dashboard/productos/ProductEditModal";
import { Loader2, Package, Search, Filter } from "lucide-react";
import imageCompression from "browser-image-compression";
import { PageHeader } from "@/components/dashboard/PageHeader";

// ==================================================
// TIPOS CONSISTENTES
// ==================================================

export type Categoria = {
  id: string;
  nombre: string;
};

export type Producto = {
  id: string;
  nombre: string;
  precio: number;
  descripcion?: string;
  disponible: boolean;
  categoria_id: string;
  imagen_url?: string;

  // Stock:
  // null / undefined = inventario no administrado
  // 0 = agotado
  // > 0 = unidades disponibles
  stock?: number | null;
};

export default function ProductosDashboard() {
  const [userId, setUserId] = useState<string | null>(null);

  const [productos, setProductos] = useState<Producto[]>(
    []
  );

  const [categorias, setCategorias] = useState<
    Categoria[]
  >([]);

  const [paisCode, setPaisCode] = useState("PE");

  const [loading, setLoading] = useState(true);

  const [editingProduct, setEditingProduct] =
    useState<Producto | null>(null);

  const [newImageFile, setNewImageFile] =
    useState<File | null>(null);

  const [previewImage, setPreviewImage] =
    useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

  // ==================================================
  // INICIALIZAR
  // ==================================================

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

  // ==================================================
  // CARGAR DATOS
  // ==================================================

  const cargarDatos = async (uid: string) => {
    // ----------------------------------------------
    // 1. CÓDIGO DE PAÍS
    // ----------------------------------------------

    const { data: catData } = await supabase
      .from("catalogos")
      .select("pais_code")
      .eq("user_id", uid)
      .single();

    if (catData?.pais_code) {
      setPaisCode(catData.pais_code);
    }

    // ----------------------------------------------
    // 2. PRODUCTOS
    // ----------------------------------------------

    const { data: prod, error: productosError } =
      await supabase
        .from("productos")
        .select("*")
        .eq("user_id", uid)
        .order("nombre", {
          ascending: true,
        });

    if (productosError) {
      console.error(
        "Error cargando productos:",
        productosError
      );
    }

    // ----------------------------------------------
    // 3. CATEGORÍAS
    // ----------------------------------------------

    const { data: cat, error: categoriasError } =
      await supabase
        .from("categorias")
        .select("*")
        .eq("user_id", uid)
        .order("nombre", {
          ascending: true,
        });

    if (categoriasError) {
      console.error(
        "Error cargando categorías:",
        categoriasError
      );
    }

    setProductos(prod || []);
    setCategorias(cat || []);
  };

  // ==================================================
  // OBTENER PATH DE STORAGE DESDE URL
  // ==================================================

  const obtenerPathDesdeUrl = (
    url?: string
  ): string | null => {
    if (!url) return null;

    const splitKey =
      "/storage/v1/object/public/productos/";

    const parts = url.split(splitKey);

    return parts.length > 1 ? parts[1] : null;
  };

  // ==================================================
  // BORRAR ARCHIVO DEL STORAGE
  // ==================================================

  const borrarArchivoStorage = async (
    urlCompleta?: string
  ) => {
    const pathArchivo =
      obtenerPathDesdeUrl(urlCompleta);

    if (!pathArchivo) return;

    const { error } = await supabase.storage
      .from("productos")
      .remove([pathArchivo]);

    if (error) {
      console.error(
        "Error al eliminar archivo del Storage:",
        error.message
      );
    } else {
      console.log(
        "✅ Archivo eliminado con éxito de Supabase Storage:",
        pathArchivo
      );
    }
  };

  // ==================================================
  // ELIMINAR PRODUCTO
  // ==================================================

  const eliminarProducto = async (id: string) => {
    if (
      !confirm(
        "¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer."
      )
    ) {
      return;
    }

    try {
      // 1. Buscar producto localmente
      const productoAEliminar =
        productos.find((p) => p.id === id);

      // 2. Borrar imagen si existe
      if (productoAEliminar?.imagen_url) {
        await borrarArchivoStorage(
          productoAEliminar.imagen_url
        );
      }

      // 3. Eliminar producto
      const { error } = await supabase
        .from("productos")
        .delete()
        .eq("id", id);

      if (!error) {
        setProductos(
          productos.filter((p) => p.id !== id)
        );

        alert(
          "Producto eliminado correctamente"
        );
      } else {
        throw error;
      }
    } catch (err) {
      console.error(err);

      alert(
        "Error al eliminar el producto de la base de datos"
      );
    }
  };

  // ==================================================
  // CAMBIAR DISPONIBILIDAD
  // ==================================================

  const cambiarDisponibilidad = async (
    producto: Producto
  ) => {
    const nuevoEstado =
      !producto.disponible;

    setProductos(
      productos.map((p) =>
        p.id === producto.id
          ? {
              ...p,
              disponible: nuevoEstado,
            }
          : p
      )
    );

    const { error } = await supabase
      .from("productos")
      .update({
        disponible: nuevoEstado,
      })
      .eq("id", producto.id);

    if (error) {
      cargarDatos(userId!);

      alert(
        "Error al actualizar disponibilidad"
      );
    }
  };

  // ==================================================
  // SUBIR / COMPRIMIR IMAGEN
  // ==================================================

  const subirImagen = async (): Promise<
    string | null
  > => {
    if (!newImageFile) {
      return (
        editingProduct?.imagen_url || null
      );
    }

    const opciones = {
      maxSizeMB: 0.8,
      maxWidthOrHeight: 1000,
      useWebWorker: true,
      fileType: "image/webp",
    };

    try {
      console.log(
        `📸 [Original] Peso: ${(
          newImageFile.size /
          (1024 * 1024)
        ).toFixed(2)} MB`
      );

      // 1. Comprimir
      const imagenComprimidaFile =
        await imageCompression(
          newImageFile,
          opciones
        );

      console.log(
        `⚡ [Comprimido WebP] Peso: ${(
          imagenComprimidaFile.size / 1024
        ).toFixed(2)} KB`
      );

      // 2. Nombre único
      const fileName = `${userId}/${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 7)}.webp`;

      // 3. Subir
      const { error: uploadError } =
        await supabase.storage
          .from("productos")
          .upload(
            fileName,
            imagenComprimidaFile,
            {
              cacheControl:
                "public, max-age=31536000, immutable",
              contentType: "image/webp",
            }
          );

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from("productos")
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error(
        "Error al procesar/subir imagen:",
        error
      );

      alert(
        "No se pudo procesar la nueva imagen"
      );

      return (
        editingProduct?.imagen_url || null
      );
    }
  };

  // ==================================================
  // GUARDAR EDICIÓN
  // ==================================================

  const guardarEdicion = async () => {
    if (!editingProduct) return;

    try {
      setLoading(true);

      // ----------------------------------------------
      // FOTO ANTERIOR
      // ----------------------------------------------

      const fotoViejaUrl =
        productos.find(
          (p) =>
            p.id === editingProduct.id
        )?.imagen_url;

      // ----------------------------------------------
      // SUBIR NUEVA IMAGEN
      // ----------------------------------------------

      const imagen_url =
        await subirImagen();

      // ----------------------------------------------
      // BORRAR FOTO ANTERIOR
      // ----------------------------------------------

      if (
        newImageFile &&
        fotoViejaUrl &&
        imagen_url !== fotoViejaUrl
      ) {
        await borrarArchivoStorage(
          fotoViejaUrl
        );
      }

      // ----------------------------------------------
      // GUARDAR PRODUCTO EN SUPABASE
      // ----------------------------------------------

      const { error } = await supabase
        .from("productos")
        .update({
          nombre: editingProduct.nombre,

          precio: Number(
            editingProduct.precio
          ),

          descripcion:
            editingProduct.descripcion,

          categoria_id:
            editingProduct.categoria_id,

          imagen_url:
            imagen_url || "",

          // ==========================================
          // NUEVO: STOCK
          // ==========================================
          //
          // null significa que este producto no
          // administra inventario.
          //
          stock:
            editingProduct.stock ??
            null,
        })
        .eq("id", editingProduct.id);

      if (error) {
        throw error;
      }

      // ----------------------------------------------
      // CERRAR MODAL
      // ----------------------------------------------

      cerrarModal();

      // ----------------------------------------------
      // RECARGAR PRODUCTOS
      // ----------------------------------------------

      await cargarDatos(userId!);

      alert(
        "Producto editado exitosamente"
      );
    } catch (err) {
      console.error(err);

      alert(
        "Error al guardar los cambios"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // CERRAR MODAL
  // ==================================================

  const cerrarModal = () => {
    setEditingProduct(null);
    setNewImageFile(null);
    setPreviewImage(null);
  };

  // ==================================================
  // CAMBIAR IMAGEN
  // ==================================================

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setNewImageFile(file);

    setPreviewImage(
      URL.createObjectURL(file)
    );
  };

  // ==================================================
  // FILTRAR PRODUCTOS
  // ==================================================

  const productosFiltrados =
    productos.filter((p) =>
      p.nombre
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        )
    );

  // ==================================================
  // LOADING
  // ==================================================

  if (
    loading &&
    productos.length === 0
  ) {
    return (
      <div className="min-h-screen text-white pb-20 animate-pulse">
        <div className="max-w-7xl mx-auto px-6 pt-6 md:px-10 md:pt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-[var(--border-card)]">

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)]" />

              <div className="space-y-2">
                <div className="h-3 w-20 rounded bg-white/10" />

                <div className="h-6 w-40 rounded-lg bg-white/10" />
              </div>
            </div>

            <div className="h-10 w-full sm:w-80 rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)]" />
          </div>
        </div>

        <main className="max-w-7xl mx-auto p-6 md:p-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              1, 2, 3, 4, 5, 6, 7, 8,
            ].map((item) => (
              <div
                key={item}
                className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl overflow-hidden flex flex-col justify-between p-4 space-y-4"
              >
                <div className="w-full h-44 rounded-xl bg-white/5 border border-white/5" />

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="h-4 w-2/3 rounded bg-white/10" />

                    <div className="h-4 w-12 rounded bg-emerald-500/20" />
                  </div>

                  <div className="h-3 w-1/3 rounded bg-white/5" />
                </div>

                <div className="pt-2 border-t border-[var(--border-card)] flex items-center justify-between">
                  <div className="h-6 w-16 rounded-full bg-white/10" />

                  <div className="flex gap-2">
                    <div className="h-8 w-8 rounded-lg bg-white/5" />

                    <div className="h-8 w-8 rounded-lg bg-white/5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // ==================================================
  // DASHBOARD
  // ==================================================

  return (
    <div className="min-h-screen text-white pb-20">

      {/* HEADER */}

      <div className="max-w-7xl mx-auto px-6 pt-6 md:px-10 md:pt-8">
        <PageHeader
          title="Mis Productos"
          category="Inventario"
          icon={Package}
          showBackButton={true}
        >
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />

            <input
              type="text"
              placeholder="Buscar producto..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
              className="w-full bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </PageHeader>
      </div>

      {/* PRODUCTOS */}

      <main className="max-w-7xl mx-auto p-6 md:p-10">
        {productosFiltrados.length > 0 ? (
          <ProductGrid
            productos={productosFiltrados}
            categorias={categorias}
            paisCode={paisCode}
            onToggle={cambiarDisponibilidad}
            onEdit={(p) =>
              setEditingProduct(p)
            }
            onDelete={eliminarProducto}
          />
        ) : (
          <div className="text-center py-20 bg-gray-900/30 rounded-3xl border border-dashed border-gray-800">
            <Package className="w-12 h-12 text-gray-700 mx-auto mb-4" />

            <h3 className="text-lg font-medium text-gray-400">
              No se encontraron productos
            </h3>

            <p className="text-gray-600">
              Prueba ajustando tu búsqueda o
              agrega uno nuevo.
            </p>
          </div>
        )}
      </main>

      {/* MODAL DE EDICIÓN */}

      {editingProduct && (
        <ProductEditModal
          producto={editingProduct}
          categorias={categorias}
          paisCode={paisCode}
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