"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import imageCompression from "browser-image-compression";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";

import { supabase } from "@/lib/supabaseClient";
import IlustracionTienda from "@/components/public/IlustracionTienda";

interface EditorImagenPortadaProps {
  catalogoId: string;
  imagenUrl: string | null;
  onChange: (url: string | null) => void;
  disabled?: boolean;
  onSubiendoChange?: (subiendo: boolean) => void;
}

const BUCKET = "tienda-diseno";
const MAX_ARCHIVO_ORIGINAL = 25 * 1024 * 1024;
const MAX_ARCHIVO_SUBIDO = 5 * 1024 * 1024;

const FORMATOS_ADMITIDOS = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export default function EditorImagenPortada({
  catalogoId,
  imagenUrl,
  onChange,
  disabled = false,
  onSubiendoChange,
}: EditorImagenPortadaProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const bloqueoRef = useRef(false);
  const montadoRef = useRef(false);
  const operacionRef = useRef(0);

  const onChangeRef = useRef(onChange);
  const onSubiendoRef = useRef(onSubiendoChange);

  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [imagenFallida, setImagenFallida] = useState<string | null>(
    null,
  );

  useEffect(() => {
    onChangeRef.current = onChange;
    onSubiendoRef.current = onSubiendoChange;
  }, [onChange, onSubiendoChange]);

  useEffect(() => {
    montadoRef.current = true;

    return () => {
      montadoRef.current = false;
      operacionRef.current += 1;

      if (bloqueoRef.current) {
        onSubiendoRef.current?.(false);
      }
    };
  }, []);

  // Una subida iniciada para otra tienda no debe modificar esta.
  useEffect(() => {
    operacionRef.current += 1;
    bloqueoRef.current = false;
    setSubiendo(false);
    setError("");
    setMensaje("");
    onSubiendoRef.current?.(false);
  }, [catalogoId]);

  const subirImagen = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const archivo = event.target.files?.[0];

    // Permite seleccionar nuevamente el mismo archivo.
    event.target.value = "";

    if (!archivo || disabled || bloqueoRef.current) return;

    setError("");
    setMensaje("");

    if (!catalogoId) {
      setError("No encontramos la tienda para subir la imagen.");
      return;
    }

    if (!FORMATOS_ADMITIDOS.has(archivo.type)) {
      setError("Selecciona una imagen JPG, PNG o WebP.");
      return;
    }

    if (archivo.size > MAX_ARCHIVO_ORIGINAL) {
      setError("La imagen original debe pesar menos de 25 MB.");
      return;
    }

    const operacion = ++operacionRef.current;

    const sigueActiva = () =>
      montadoRef.current &&
      operacionRef.current === operacion;

    bloqueoRef.current = true;
    setSubiendo(true);
    onSubiendoRef.current?.(true);

    try {
      const {
        data: { user },
        error: errorUsuario,
      } = await supabase.auth.getUser();

      if (errorUsuario || !user) {
        throw new Error(
          "Tu sesión venció. Inicia sesión nuevamente.",
        );
      }

      if (!sigueActiva()) return;

      const comprimida = await imageCompression(archivo, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: "image/webp",
        initialQuality: 0.85,
      });

      if (!sigueActiva()) return;

      if (
        comprimida.size === 0 ||
        comprimida.size > MAX_ARCHIVO_SUBIDO
      ) {
        throw new Error(
          "No pudimos reducir suficientemente la imagen. Prueba con otra más pequeña.",
        );
      }

      const tipo = comprimida.type;
      const extension =
        tipo === "image/webp"
          ? "webp"
          : tipo === "image/jpeg"
            ? "jpg"
            : tipo === "image/png"
              ? "png"
              : null;

      if (!extension) {
        throw new Error(
          "No pudimos convertir la imagen a un formato compatible.",
        );
      }

      const ruta = [
        user.id,
        catalogoId,
        `${crypto.randomUUID()}.${extension}`,
      ].join("/");

      const { error: errorSubida } = await supabase.storage
        .from(BUCKET)
        .upload(ruta, comprimida, {
          contentType: tipo,
          cacheControl: "31536000",
          upsert: false,
        });

      if (errorSubida) {
        console.error("Error subiendo la portada:", errorSubida);

        throw new Error(
          "No pudimos subir la imagen. Comprueba tu conexión e inténtalo nuevamente.",
        );
      }

      if (!sigueActiva()) return;

      const { data } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(ruta);

      if (!data.publicUrl) {
        throw new Error(
          "La imagen se subió, pero no pudimos obtener su dirección.",
        );
      }

      setImagenFallida(null);
      onChangeRef.current(data.publicUrl);

      const pesoKB = Math.max(
        1,
        Math.round(comprimida.size / 1024),
      );

      setMensaje(
        `Imagen lista (${pesoKB} KB). Guarda el borrador para conservar el cambio.`,
      );
    } catch (err) {
      if (!sigueActiva()) return;

      console.error("Error preparando la portada:", err);

      setError(
        err instanceof Error
          ? err.message
          : "No pudimos preparar la imagen.",
      );
    } finally {
      if (sigueActiva()) {
        bloqueoRef.current = false;
        setSubiendo(false);
        onSubiendoRef.current?.(false);
      }
    }
  };

  const quitarImagen = () => {
    if (disabled || bloqueoRef.current) return;

    setError("");
    setImagenFallida(null);
    onChangeRef.current(null);
    setMensaje(
      "Se mostrará la ilustración. Guarda el borrador para conservar el cambio.",
    );

    // No eliminamos el archivo: el diseño publicado
    // todavía podría estar utilizándolo.
  };

  const imagen = imagenUrl?.trim() || null;
  const mostrarImagen = imagen && imagenFallida !== imagen;
  const bloqueado = disabled || subiendo;

  const claseBoton =
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <div className="space-y-3" aria-busy={subiendo}>
      <p className="text-sm font-semibold text-[var(--text-primary)]">
        Imagen de portada
      </p>

      <div className="aspect-[2/1] overflow-hidden rounded-xl border border-[var(--border-card)] bg-[var(--bg-tertiary)]">
        {mostrarImagen ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={imagen}
            src={imagen}
            alt="Imagen de portada seleccionada"
            decoding="async"
            onError={() => setImagenFallida(imagen)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            role="img"
            aria-label="Ilustración de portada"
            className="h-full w-full"
          >
            <IlustracionTienda variante="portada" />
          </div>
        )}
      </div>

      {imagen && imagenFallida === imagen && (
        <p className="text-xs text-[var(--text-secondary)]">
          No pudimos cargar la vista previa de esta imagen.
          Puedes reemplazarla.
        </p>
      )}

      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        aria-label="Seleccionar imagen de portada"
        disabled={bloqueado}
        onChange={(event) => void subirImagen(event)}
        className="hidden"
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={bloqueado}
          aria-controls={inputId}
          onClick={() => inputRef.current?.click()}
          className={`${claseBoton} bg-[var(--color-primary)] text-[var(--color-text-inverse)] hover:bg-[var(--color-primary-hover)]`}
        >
          {subiendo ? (
            <Loader2
              size={17}
              aria-hidden="true"
              className="animate-spin"
            />
          ) : (
            <ImagePlus size={17} aria-hidden="true" />
          )}

          {subiendo
            ? "Preparando y subiendo…"
            : imagen
              ? "Cambiar imagen"
              : "Subir imagen"}
        </button>

        {imagen && (
          <button
            type="button"
            disabled={bloqueado}
            onClick={quitarImagen}
            className={`${claseBoton} border border-[var(--border-card)] text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]`}
          >
            <Trash2 size={16} aria-hidden="true" />
            Quitar imagen
          </button>
        )}
      </div>

      <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
        JPG, PNG o WebP. La imagen se optimiza automáticamente
        antes de subirla. Para la portada, recomendamos una
        imagen horizontal.
      </p>

      {mensaje && (
        <p
          role="status"
          className="text-xs leading-relaxed text-[var(--text-secondary)]"
        >
          {mensaje}
        </p>
      )}

      {error && (
        <p
          role="alert"
          className="text-sm text-[var(--color-danger)]"
        >
          {error}
        </p>
      )}
    </div>
  );
}