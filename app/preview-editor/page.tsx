"use client";

import { useEffect, useState, type MouseEvent } from "react";

import { CartProvider } from "@/context/CartContext";
import TiendaHeader from "@/components/public/TiendaHeader";
import TiendaFooter from "@/components/public/TiendaFooter";
import TiendaPlantilla from "@/components/public/plantillas/TiendaPlantilla";

import {
  esPlantillaId,
  esSeccionEditor,
  validarConfig,
} from "@/lib/tienda-diseno/config";
import { crearTemaTienda } from "@/lib/tienda-diseno/theme";

import type {
  DatosRenderTienda,
  CategoriaTienda,
  ProductoTienda,
  SeccionEditor,
} from "@/lib/tienda-diseno/types";

function esObjeto(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function esTextoOpcional(value: unknown): boolean {
  return value === undefined || value === null || typeof value === "string";
}

function esProducto(value: unknown): value is ProductoTienda {
  if (!esObjeto(value)) return false;

  return (
    typeof value.id === "string" &&
    typeof value.nombre === "string" &&
    typeof value.slug === "string" &&
    typeof value.precio === "number" &&
    Number.isFinite(value.precio) &&
    esTextoOpcional(value.descripcion) &&
    esTextoOpcional(value.imagen_url) &&
    (value.disponible === undefined ||
      value.disponible === null ||
      typeof value.disponible === "boolean") &&
    (value.stock === undefined ||
      value.stock === null ||
      (typeof value.stock === "number" && Number.isFinite(value.stock)))
  );
}

function esCategoria(value: unknown): value is CategoriaTienda {
  return (
    esObjeto(value) &&
    typeof value.id === "string" &&
    typeof value.nombre === "string" &&
    Array.isArray(value.productos) &&
    value.productos.every(esProducto)
  );
}

function leerDatos(value: unknown): DatosRenderTienda | null {
  if (!esObjeto(value) || !esObjeto(value.tienda)) return null;

  const tienda = value.tienda;

  if (
    typeof tienda.id !== "string" ||
    typeof tienda.user_id !== "string" ||
    typeof tienda.nombre !== "string" ||
    typeof tienda.pais_code !== "string" ||
    !(tienda.slug === null || typeof tienda.slug === "string") ||
    !(tienda.logo === null || typeof tienda.logo === "string") ||
    !Array.isArray(value.categorias) ||
    !value.categorias.every(esCategoria) ||
    !esPlantillaId(value.plantilla) ||
    typeof value.rutaBase !== "string"
  ) {
    return null;
  }

  const contacto = [
    "whatsapp",
    "mensaje_whatsapp",
    "instagram",
    "facebook",
    "tiktok",
    "youtube",
  ] as const;

  if (!contacto.every((campo) => esTextoOpcional(tienda[campo]))) {
    return null;
  }

  if (
    tienda.mostrar_boton_whatsapp !== undefined &&
    tienda.mostrar_boton_whatsapp !== null &&
    typeof tienda.mostrar_boton_whatsapp !== "boolean"
  ) {
    return null;
  }

  const validacion = validarConfig(value.config);
  if (!validacion.valido) return null;

  return {
    tienda: {
      id: tienda.id,
      user_id: tienda.user_id,
      nombre: tienda.nombre,
      pais_code: tienda.pais_code,
      slug: tienda.slug,
      logo: tienda.logo,
      whatsapp: tienda.whatsapp as string | null | undefined,
      mensaje_whatsapp: tienda.mensaje_whatsapp as string | null | undefined,
      mostrar_boton_whatsapp: tienda.mostrar_boton_whatsapp as
        | boolean
        | null
        | undefined,
      instagram: tienda.instagram as string | null | undefined,
      facebook: tienda.facebook as string | null | undefined,
      tiktok: tienda.tiktok as string | null | undefined,
      youtube: tienda.youtube as string | null | undefined,
    },
    categorias: value.categorias,
    plantilla: value.plantilla,
    config: validacion.config,
    rutaBase: value.rutaBase,
  };
}

export default function PreviewEditorPage() {
  const [datos, setDatos] = useState<DatosRenderTienda | null>(null);
  const [modoSeleccion, setModoSeleccion] = useState(true);
  const [seleccion, setSeleccion] = useState<SeccionEditor | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const recibirMensaje = (event: MessageEvent) => {
      if (window.parent === window) return;
      if (event.origin !== window.location.origin) return;
      if (event.source !== window.parent) return;
      if (!esObjeto(event.data)) return;

      if (event.data.type === "TIENDA_EDITOR_SELECCION") {
        const seccion = event.data.seccion;

        if (seccion === null || esSeccionEditor(seccion)) {
          setSeleccion(seccion);
        }

        return;
      }

      if (event.data.type !== "TIENDA_EDITOR_DATOS") return;

      if (
        typeof event.data.requestId !== "string" ||
        typeof event.data.modoSeleccion !== "boolean"
      ) {
        return;
      }

      const nuevosDatos = leerDatos(event.data.payload);

      if (!nuevosDatos) {
        setError("La configuración recibida no es válida.");
        return;
      }

      setError("");
      setDatos(nuevosDatos);
      setModoSeleccion(event.data.modoSeleccion);

      window.parent.postMessage(
        {
          type: "TIENDA_PREVIEW_RECIBIDA",
          requestId: event.data.requestId,
        },
        window.location.origin,
      );
    };

    window.addEventListener("message", recibirMensaje);

    if (window.parent !== window) {
      window.parent.postMessage(
        { type: "TIENDA_PREVIEW_LISTA" },
        window.location.origin,
      );
    }

    return () => {
      window.removeEventListener("message", recibirMensaje);
    };
  }, []);

  const seleccionarSeccion = (event: MouseEvent<HTMLDivElement>) => {
    if (!(event.target instanceof Element)) return;

    // Los enlaces no deben sacar al usuario de la vista previa.
    if (event.target.closest("a")) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (!modoSeleccion) return;

    const elemento = event.target.closest<HTMLElement>("[data-editor-section]");

    const seccion = elemento?.dataset.editorSection;
    if (!esSeccionEditor(seccion)) return;

    event.preventDefault();
    event.stopPropagation();

    setSeleccion(seccion);

    window.parent.postMessage(
      {
        type: "TIENDA_SECCION_SELECCIONADA",
        seccion,
      },
      window.location.origin,
    );
  };

  if (!datos) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-white p-6 text-center text-sm text-slate-600">
        <p role={error ? "alert" : "status"}>
          {error || "Esperando la configuración del editor..."}
        </p>
      </div>
    );
  }

  const { tienda, categorias, plantilla, config, rutaBase } = datos;

  const catalogoPreview = {
    ...tienda,
    ...config,
  };

  return (
    <CartProvider
      key={`preview-${tienda.id}`}
      catalogoId={`preview-${tienda.id}`}
    >
      <div
        style={{
          ...crearTemaTienda(config),
          fontFamily: "var(--tienda-font-family)",
          fontSize: "var(--tienda-font-size)",
        }}
        data-seleccion={seleccion ?? ""}
        data-modo-seleccion={modoSeleccion ? "activo" : "inactivo"}
        onClickCapture={seleccionarSeccion}
        onSubmitCapture={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
        className="editor-preview relative flex min-h-dvh w-full flex-col bg-[var(--color-bg)] text-[var(--color-text)]"
      >
        <div data-editor-section="encabezado">
          <TiendaHeader
            catalogo={catalogoPreview}
            categorias={categorias}
            rutaBase={rutaBase}
            config={config}
            cartCount={0}
            onOpenCart={() => {}}
            onOpenOrders={() => {}}
          />
        </div>

        <TiendaPlantilla
          plantilla={plantilla}
          categorias={categorias}
          config={config}
          countryCode={tienda.pais_code}
          rutaBase={rutaBase}
        />

        <div data-editor-section="pie">
          <TiendaFooter
            instagram={tienda.instagram ?? undefined}
            facebook={tienda.facebook ?? undefined}
            tiktok={tienda.tiktok ?? undefined}
            youtube={tienda.youtube ?? undefined}
            nombreTienda={tienda.nombre}
          />
        </div>

        {error && (
          <p
            role="alert"
            className="fixed bottom-4 left-4 right-4 z-[100] rounded-xl bg-red-700 p-3 text-sm text-white"
          >
            {error}
          </p>
        )}

        <style jsx global>{`
          .editor-preview[data-modo-seleccion="activo"] [data-editor-section] {
            cursor: pointer;
          }

          .editor-preview[data-modo-seleccion="activo"]
            [data-editor-section]:hover {
            outline: 2px dashed #2563eb;
            outline-offset: -2px;
          }

          .editor-preview[data-modo-seleccion="activo"][data-seleccion="encabezado"]
            [data-editor-section="encabezado"],
          .editor-preview[data-modo-seleccion="activo"][data-seleccion="catalogo"]
            [data-editor-section="catalogo"],
          .editor-preview[data-modo-seleccion="activo"][data-seleccion="categorias"]
            [data-editor-section="categorias"],
          .editor-preview[data-modo-seleccion="activo"][data-seleccion="pie"]
            [data-editor-section="pie"] {
            outline: 2px solid #2563eb;
            outline-offset: -2px;
          }
        `}</style>
      </div>
    </CartProvider>
  );
}
