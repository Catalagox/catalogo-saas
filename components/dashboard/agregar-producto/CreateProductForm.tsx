"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { Upload, X, Plus } from "lucide-react";
import imageCompression from "browser-image-compression";
import { supabase } from "@/lib/supabaseClient";

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

const campoClassName =
  "min-h-11 w-full rounded-xl border border-[var(--border-card)] bg-[var(--bg-secondary)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-60";

const labelClassName =
  "mb-2 block text-sm font-semibold text-[var(--text-primary)]";

export default function CreateProductForm({
  userId,
  catalogoId,
  categorias,
  onCreated,
}: Props) {
  const id = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const enviandoRef = useRef(false);

  const [loading, setLoading] = useState(false);
  const [imagen, setImagen] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [producto, setProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria_id: "",
  });

  useEffect(() => {
    if (!imagen) {
      setPreview(null);
      return;
    }

    const url = URL.createObjectURL(imagen);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [imagen]);

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;

    setProducto((actual) => ({
      ...actual,
      [name]: value,
    }));

    setError("");
    setMensaje("");
  };

  const handleImagenChange = (event: ChangeEvent<HTMLInputElement>) => {
    const archivo = event.target.files?.[0];
    if (!archivo) return;

    setError("");
    setMensaje("");

    if (!archivo.type.startsWith("image/")) {
      setError("Selecciona un archivo de imagen.");
      event.target.value = "";
      return;
    }

    setImagen(archivo);
  };

  const eliminarImagen = () => {
    setImagen(null);
    setError("");
    setMensaje("");

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

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const subirImagen = async (archivo: File, propietarioId: string) => {
    const opciones = {
      maxSizeMB: 0.8,
      maxWidthOrHeight: 1200,
      useWebWorker: true,
      fileType: "image/webp",
      alwaysKeepResolution: false,
    };

    let comprimida: File;

    try {
      comprimida = await imageCompression(archivo, opciones);
    } catch {
      try {
        comprimida = await imageCompression(archivo, {
          ...opciones,
          useWebWorker: false,
        });
      } catch {
        throw new Error(
          "No pudimos procesar la imagen. Intenta con una imagen JPG, PNG o WebP.",
        );
      }
    }

    if (comprimida.type !== "image/webp") {
      throw new Error(
        "No pudimos convertir la imagen a WebP. Intenta con otra imagen.",
      );
    }

    const filePath = `${propietarioId}/${crypto.randomUUID()}.webp`;

    const { error: uploadError } = await supabase.storage
      .from("productos")
      .upload(filePath, comprimida, {
        cacheControl: "31536000",
        upsert: false,
        contentType: "image/webp",
      });

    if (uploadError) {
      console.error("Error subiendo imagen:", uploadError);
      throw new Error("No pudimos subir la imagen. Inténtalo nuevamente.");
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("productos").getPublicUrl(filePath);

    return { publicUrl, filePath };
  };

  const crearProducto = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (enviandoRef.current) return;

    setError("");
    setMensaje("");

    if (!userId || !catalogoId) {
      setError("No pudimos identificar tu tienda. Recarga la página.");
      return;
    }

    const nombre = producto.nombre.trim();
    const precio = Number(producto.precio);

    if (!nombre) {
      setError("Escribe el nombre del producto.");
      return;
    }

    if (
      !producto.precio.trim() ||
      !Number.isFinite(precio) ||
      precio < 0
    ) {
      setError("Ingresa un precio válido, igual o mayor que cero.");
      return;
    }

    if (!imagen) {
      setError("Selecciona una imagen para el producto.");
      return;
    }

    enviandoRef.current = true;
    setLoading(true);

    let rutaSubida: string | null = null;

    try {
      const { data: catalogo, error: catalogoError } = await supabase
        .from("catalogos")
        .select("suscripcion_activa")
        .eq("id", catalogoId)
        .eq("user_id", userId)
        .single();

      if (catalogoError) {
        console.error("Error validando suscripción:", catalogoError);
        throw new Error("No pudimos validar la suscripción.");
      }

      if (!catalogo.suscripcion_activa) {
        throw new Error(
          "Tu suscripción está vencida. Renueva tu plan para seguir agregando productos.",
        );
      }

      const subida = await subirImagen(imagen, userId);
      rutaSubida = subida.filePath;

      const { error: insertError } = await supabase
        .from("productos")
        .insert({
          user_id: userId,
          catalogo_id: catalogoId,
          nombre,
          descripcion: producto.descripcion.trim(),
          precio,
          categoria_id: producto.categoria_id || null,
          imagen_url: subida.publicUrl,
          disponible: true,
        });

      if (insertError) {
        console.error("Error guardando producto:", insertError);
        throw new Error("No pudimos guardar el producto. Inténtalo nuevamente.");
      }
    } catch (err) {
      if (rutaSubida) {
        try {
          const { error: cleanupError } = await supabase.storage
            .from("productos")
            .remove([rutaSubida]);

          if (cleanupError) {
            console.error("Error eliminando imagen sin producto:", cleanupError);
          }
        } catch (cleanupError) {
          console.error("Error limpiando imagen:", cleanupError);
        }
      }

      setError(
        err instanceof Error
          ? err.message
          : "Ocurrió un error al crear el producto.",
      );
      return;
    } finally {
      enviandoRef.current = false;
      setLoading(false);
    }

    resetForm();
    setMensaje(`Producto “${nombre}” creado correctamente.`);
    onCreated();
  };

  return (
    <section
      aria-labelledby={`${id}-titulo`}
      className="mx-auto mb-12 w-full max-w-4xl rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-5 text-[var(--text-primary)] shadow-sm md:p-8"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--bg-secondary)]">
          <Plus size={22} aria-hidden="true" />
        </div>

        <h2
          id={`${id}-titulo`}
          className="text-xl font-bold sm:text-2xl"
        >
          Nuevo producto
        </h2>
      </div>

      <form onSubmit={crearProducto} aria-busy={loading}>
        <fieldset
          disabled={loading}
          className="m-0 min-w-0 border-0 p-0"
        >
          <legend className="sr-only">Datos del producto</legend>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:gap-8">
            <div className="min-w-0 lg:col-span-2">
              <p className={labelClassName}>Imagen de portada</p>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label={
                    preview
                      ? "Cambiar imagen del producto"
                      : "Seleccionar imagen del producto"
                  }
                  className="group flex aspect-square w-full flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[var(--border-card)] bg-[var(--bg-secondary)] transition-colors hover:border-[var(--color-primary)] hover:bg-[var(--bg-card-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={preview}
                      alt="Vista previa del producto"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="block p-6 text-center">
                      <Upload
                        className="mx-auto mb-4 h-8 w-8 text-[var(--text-secondary)]"
                        aria-hidden="true"
                      />

                      <span className="block text-sm font-semibold">
                        Seleccionar imagen
                      </span>

                      <span className="mt-2 block text-xs leading-relaxed text-[var(--text-secondary)]">
                        La imagen se optimiza antes de subirla.
                      </span>
                    </span>
                  )}
                </button>

                {preview && (
                  <button
                    type="button"
                    onClick={eliminarImagen}
                    aria-label="Eliminar imagen seleccionada"
                    className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-card)] bg-[var(--bg-card)] text-[var(--color-danger)] shadow-sm transition-colors hover:bg-[var(--bg-card-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-danger)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <X size={18} aria-hidden="true" />
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                aria-label="Imagen del producto"
                className="hidden"
                onChange={handleImagenChange}
              />

              {imagen && (
                <p className="mt-2 break-all text-xs text-[var(--text-secondary)]">
                  {imagen.name}
                </p>
              )}
            </div>

            <div className="min-w-0 space-y-5 lg:col-span-3">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor={`${id}-nombre`} className={labelClassName}>
                    Nombre
                  </label>

                  <input
                    id={`${id}-nombre`}
                    name="nombre"
                    type="text"
                    required
                    value={producto.nombre}
                    onChange={handleChange}
                    placeholder="Ej.: Camiseta de algodón"
                    className={campoClassName}
                  />
                </div>

                <div>
                  <label htmlFor={`${id}-precio`} className={labelClassName}>
                    Precio
                  </label>

                  <input
                    id={`${id}-precio`}
                    name="precio"
                    type="number"
                    min="0"
                    step="0.01"
                    inputMode="decimal"
                    required
                    value={producto.precio}
                    onChange={handleChange}
                    placeholder="0.00"
                    className={campoClassName}
                  />
                </div>
              </div>

              <div>
                <label htmlFor={`${id}-categoria`} className={labelClassName}>
                  Categoría
                </label>

                <select
                  id={`${id}-categoria`}
                  name="categoria_id"
                  value={producto.categoria_id}
                  onChange={handleChange}
                  className={campoClassName}
                >
                  <option value="">Sin categoría</option>

                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor={`${id}-descripcion`}
                  className={labelClassName}
                >
                  Descripción
                  <span className="ml-1 font-normal text-[var(--text-secondary)]">
                    (opcional)
                  </span>
                </label>

                <textarea
                  id={`${id}-descripcion`}
                  name="descripcion"
                  rows={4}
                  value={producto.descripcion}
                  onChange={handleChange}
                  placeholder="Describe los detalles de tu producto..."
                  className={`${campoClassName} resize-y`}
                />
              </div>

              <button
                type="submit"
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-bold text-[var(--color-text-inverse)] transition-colors hover:bg-[var(--color-primary-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus size={18} aria-hidden="true" />
                {loading ? "Procesando..." : "Publicar producto"}
              </button>
            </div>
          </div>
        </fieldset>

        {error && (
          <p
            role="alert"
            className="mt-5 text-sm leading-relaxed text-[var(--color-danger)]"
          >
            {error}
          </p>
        )}

        {mensaje && (
          <p
            role="status"
            className="mt-5 text-sm leading-relaxed text-[var(--text-primary)]"
          >
            {mensaje}
          </p>
        )}
      </form>
    </section>
  );
}
