"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Paintbrush, LayoutTemplate, X } from "lucide-react";
import {
  VERSION_CONFIG,
  validarConfig,
} from "@/lib/tienda-diseno/config";
import type {
  DefinicionPlantilla,
  PlantillaId,
} from "@/lib/tienda-diseno/types";
interface SelectorPlantillasProps {
  plantillas: DefinicionPlantilla[];
  plantillaPublicada: PlantillaId;
  plantillaBorrador: PlantillaId;
  borradorUpdatedAt: string;
  catalogoId: string;
}
const RUTA_EDITOR = "/dashboard/tienda-online/editor";
// Las rutas de public se utilizan sin escribir "public".
const IMAGENES_PLANTILLAS: Partial<Record<PlantillaId, string>> = {
  clasica: "/plantillas/Clasica.png",
  moderna: "/plantillas/Moderna.png",
};
function esObjeto(
  valor: unknown,
): valor is Record<string, unknown> {
  return (
    valor !== null &&
    typeof valor === "object" &&
    !Array.isArray(valor)
  );
}
function ImagenPlantilla({
  plantilla,
}: {
  plantilla: DefinicionPlantilla;
}) {
  const src = IMAGENES_PLANTILLAS[plantilla.id];
  const [errorImagen, setErrorImagen] = useState(false);
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-[var(--border-card)] bg-[var(--bg-tertiary)]">
      {src && !errorImagen ? (
        <Image
          src={src}
          alt={`Vista del diseño de la plantilla ${plantilla.nombre}`}
          fill
          unoptimized
          sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
          onError={() => setErrorImagen(true)}
          className="object-contain"
        />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center text-[var(--text-secondary)]">
          <LayoutTemplate size={40} aria-hidden="true" />
          <span className="text-sm font-medium">
            {src
              ? "No se pudo cargar la imagen de la plantilla."
              : `Plantilla ${plantilla.nombre}`}
          </span>
        </div>
      )}
    </div>
  );
}
export default function SelectorPlantillas({
  plantillas,
  plantillaPublicada,
  plantillaBorrador,
  borradorUpdatedAt,
  catalogoId,
}: SelectorPlantillasProps) {
  const router = useRouter();
  const [seleccion, setSeleccion] =
    useState<DefinicionPlantilla | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [actualizando, iniciarActualizacion] = useTransition();
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");
  const bloqueoRef = useRef(false);
  const dialogoRef = useRef<HTMLDialogElement>(null);
  const mensajeRef = useRef<HTMLDivElement>(null);
  // Conserva la nueva versión aunque la página aún esté actualizándose.
  const versionRef = useRef({
    origen: borradorUpdatedAt,
    actual: borradorUpdatedAt,
  });
  const [plantillaAplicada, setPlantillaAplicada] = useState<{
    id: PlantillaId;
    origen: string;
  } | null>(null);
  const cargando = guardando || actualizando;
  const plantillaActual =
    plantillaAplicada?.origen === borradorUpdatedAt
      ? plantillaAplicada.id
      : plantillaBorrador;
  useEffect(() => {
    const dialogo = dialogoRef.current;
    if (!dialogo) return;
    if (seleccion && !dialogo.open) dialogo.showModal();
    else if (!seleccion && dialogo.open) dialogo.close();
  }, [seleccion]);

  useEffect(() => {
    if (seleccion || cargando || (!aviso && !error)) return;
    mensajeRef.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto" : "smooth",
      block: "center",
    });
  }, [seleccion, cargando, aviso, error]);

  const cancelarSeleccion = () => {
    if (bloqueoRef.current || cargando) return;
    setSeleccion(null);
    setError("");
  };

  const elegirPlantilla = async () => {
    if (!seleccion || bloqueoRef.current || cargando) return;
    const plantillaElegida = seleccion;
    const validacion = validarConfig(plantillaElegida.configInicial);
    if (!validacion.valido) {
      setError("La configuración inicial de la plantilla no es válida.");
      return;
    }
    if (versionRef.current.origen !== borradorUpdatedAt) {
      versionRef.current = {
        origen: borradorUpdatedAt,
        actual: borradorUpdatedAt,
      };
    }
    bloqueoRef.current = true;
    setGuardando(true);
    setError("");
    setAviso("");
    try {
      const respuesta = await fetch("/api/tienda-diseno/borrador", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plantilla: plantillaElegida.id,
          config: validacion.config,
          version_config: VERSION_CONFIG,
          expectedUpdatedAt: versionRef.current.actual,
        }),
      });
      const resultado: unknown = await respuesta.json();
      if (!respuesta.ok) {
        throw new Error(
          esObjeto(resultado) && typeof resultado.error === "string"
            ? resultado.error
            : "No pudimos cargar la plantilla.",
        );
      }
      if (!esObjeto(resultado) || !esObjeto(resultado.borrador)) {
        throw new Error(
          "No pudimos confirmar el cambio. Recarga esta página.",
        );
      }
      const borrador = resultado.borrador;
      if (
        borrador.catalogo_id !== catalogoId ||
        borrador.plantilla !== plantillaElegida.id ||
        borrador.version_config !== VERSION_CONFIG ||
        typeof borrador.updated_at !== "string" ||
        !Number.isFinite(Date.parse(borrador.updated_at)) ||
        !validarConfig(borrador.config).valido
      ) {
        throw new Error(
          "No pudimos confirmar la plantilla guardada. Recarga esta página.",
        );
      }
      versionRef.current.actual = borrador.updated_at;
      setPlantillaAplicada({
        id: plantillaElegida.id,
        origen: borradorUpdatedAt,
      });
      setSeleccion(null);
      setAviso(
        `La plantilla ${plantillaElegida.nombre} se aplicó al borrador.`,
      );
      iniciarActualizacion(() => {
        router.refresh();
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No pudimos cargar la plantilla.",
      );
    } finally {
      bloqueoRef.current = false;
      setGuardando(false);
    }
  };
  const claseBoton =
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-60";
  return (
    <div className="mt-5 space-y-5" aria-busy={cargando}>
      <dialog
        ref={dialogoRef}
        aria-labelledby="confirmar-plantilla-titulo"
        aria-describedby="confirmar-plantilla-descripcion"
        aria-busy={cargando}
        onCancel={(event) => {
          event.preventDefault();
          cancelarSeleccion();
        }}
        className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg overflow-y-auto overscroll-contain rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-0 text-[var(--text-primary)] shadow-2xl backdrop:bg-black/60"
      >
        {seleccion && (
          <div className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--bg-tertiary)] text-[var(--color-primary)]">
                  <LayoutTemplate size={23} aria-hidden="true" />
                </div>
                <h3 id="confirmar-plantilla-titulo" className="text-xl font-bold">
                  Usar la plantilla {seleccion.nombre}
                </h3>
              </div>
              <button
                type="button"
                onClick={cancelarSeleccion}
                disabled={cargando}
                aria-label="Cerrar confirmación"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] disabled:opacity-50"
              >
                <X size={19} aria-hidden="true" />
              </button>
            </div>
            <p id="confirmar-plantilla-descripcion" className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
              Reemplazará el diseño del borrador por los estilos iniciales
              de esta plantilla. Tus productos y los datos de tu negocio
              se conservarán. Los cambios aparecerán en tu tienda pública
              cuando publiques el diseño.
            </p>
            {error && (
              <p role="alert" className="mt-4 rounded-xl border border-[var(--border-card)] p-3 text-sm text-[var(--color-danger)]">
                {error}
              </p>
            )}
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={cargando}
                onClick={cancelarSeleccion}
                className={`${claseBoton} border border-[var(--border-card)] text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]`}
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={cargando}
                onClick={() => void elegirPlantilla()}
                className={`${claseBoton} bg-[var(--color-primary)] text-[var(--color-text-inverse)] hover:bg-[var(--color-primary-hover)]`}
              >
                {guardando && <Loader2 size={17} className="animate-spin" aria-hidden="true" />}
                {guardando ? "Aplicando plantilla…" : "Aplicar plantilla"}
              </button>
            </div>
          </div>
        )}
      </dialog>
      <div ref={mensajeRef} className="scroll-mt-24 space-y-3">
      {cargando && (
        <p
          role="status"
          className="flex items-center gap-2 text-sm text-[var(--text-secondary)]"
        >
          <Loader2
            size={16}
            className="animate-spin"
            aria-hidden="true"
          />
          {guardando
            ? "Preparando la plantilla…"
            : "Actualizando la vista de tu tienda…"}
        </p>
      )}
      {!cargando && aviso && (
        <p
          role="status"
          className="rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] p-4 text-sm text-[var(--text-primary)]"
        >
          {aviso} Puedes personalizarla desde el editor.
        </p>
      )}
      {!seleccion && error && (
        <p
          role="alert"
          className="rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] p-4 text-sm text-[var(--color-danger)]"
        >
          {error}
        </p>
      )}
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {plantillas.map((plantilla) => {
          const publicada = plantilla.id === plantillaPublicada;
          const enBorrador = plantilla.id === plantillaActual;
          return (
            <article
              key={plantilla.id}
              className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)]"
            >
              <ImagenPlantilla plantilla={plantilla} />
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-bold text-[var(--text-primary)]">
                  {plantilla.nombre}
                </h3>
                {(publicada || enBorrador) && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {publicada && (
                      <span className="rounded-full bg-[var(--bg-tertiary)] px-3 py-1 text-xs font-semibold text-[var(--text-primary)]">
                        Publicada
                      </span>
                    )}
                    {enBorrador && (
                      <span className="rounded-full bg-[var(--color-primary)]/15 px-3 py-1 text-xs font-semibold text-[var(--text-primary)]">
                        En tu borrador
                      </span>
                    )}
                  </div>
                )}
                <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                  {plantilla.descripcion}
                </p>
                <div className="mt-5 flex flex-col gap-3">
                  {enBorrador ? (
                    <Link
                      href={RUTA_EDITOR}
                      aria-disabled={cargando}
                      tabIndex={cargando ? -1 : undefined}
                      onClick={(event) => {
                        if (cargando || bloqueoRef.current) {
                          event.preventDefault();
                        }
                      }}
                      className={`${claseBoton} border border-[var(--border-card)] text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] ${
                        cargando ? "cursor-not-allowed opacity-60" : ""
                      }`}
                    >
                      <Paintbrush size={16} aria-hidden="true" />
                      Editar tienda
                    </Link>
                  ) : (
                    <button
                      type="button"
                      disabled={cargando}
                      onClick={() => {
                        setSeleccion(plantilla);
                        setError("");
                        setAviso("");
                      }}
                      className={`${claseBoton} bg-[var(--color-primary)] text-[var(--color-text-inverse)] hover:bg-[var(--color-primary-hover)]`}
                    >
                      Elegir plantilla
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}