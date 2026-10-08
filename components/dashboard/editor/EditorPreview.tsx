"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { esSeccionEditor } from "@/lib/tienda-diseno/config";

import type {
  DatosRenderTienda,
  MensajeEditor,
  SeccionEditor,
} from "@/lib/tienda-diseno/types";

interface EditorPreviewProps {
  datos: DatosRenderTienda;
  dispositivo: "escritorio" | "movil";
  modoSeleccion: boolean;
  seccionSeleccionada: SeccionEditor | null;
  onSeleccionarSeccion: (seccion: SeccionEditor) => void;
}

export default function EditorPreview({
  datos,
  dispositivo,
  modoSeleccion,
  seccionSeleccionada,
  onSeleccionarSeccion,
}: EditorPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const solicitudRef = useRef<{
    requestId: string;
    mensaje: MensajeEditor;
  } | null>(null);

  const seleccionRef = useRef(seccionSeleccionada);
  const onSeleccionarRef = useRef(onSeleccionarSeccion);

  const [estado, setEstado] = useState<
    "actualizando" | "actualizada" | "error"
  >("actualizando");

  const [recarga, setRecarga] = useState(0);

  useEffect(() => {
    onSeleccionarRef.current = onSeleccionarSeccion;
  }, [onSeleccionarSeccion]);

  const enviarSeleccion = useCallback(() => {
    iframeRef.current?.contentWindow?.postMessage(
      {
        type: "TIENDA_EDITOR_SELECCION",
        seccion: seleccionRef.current,
      } satisfies MensajeEditor,
      window.location.origin,
    );
  }, []);

  const enviarDatos = useCallback(() => {
    const solicitud = solicitudRef.current;

    if (!solicitud) return;

    iframeRef.current?.contentWindow?.postMessage(
      solicitud.mensaje,
      window.location.origin,
    );
  }, []);

  // Solo acepta mensajes del iframe de esta vista previa.
  useEffect(() => {
    const recibirMensaje = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.source !== iframeRef.current?.contentWindow) return;

      if (
        !event.data ||
        typeof event.data !== "object" ||
        Array.isArray(event.data)
      ) {
        return;
      }

      if (event.data.type === "TIENDA_PREVIEW_LISTA") {
        enviarDatos();
        enviarSeleccion();
        return;
      }

      if (
        event.data.type === "TIENDA_SECCION_SELECCIONADA" &&
        esSeccionEditor(event.data.seccion)
      ) {
        onSeleccionarRef.current(event.data.seccion);
      }
    };

    window.addEventListener("message", recibirMensaje);

    return () => {
      window.removeEventListener("message", recibirMensaje);
    };
  }, [enviarDatos, enviarSeleccion]);

  // Cada actualización tiene su propia confirmación.
  useEffect(() => {
    const requestId = window.crypto.randomUUID();

    solicitudRef.current = {
      requestId,
      mensaje: {
        type: "TIENDA_EDITOR_DATOS",
        requestId,
        payload: datos,
        modoSeleccion,
      },
    };

    setEstado("actualizando");

    let confirmado = false;
    let intentos = 0;

    // En el navegador, window.setInterval devuelve un número.
    let intervalo: number | null = null;

    const detenerReintentos = () => {
      if (intervalo !== null) {
        window.clearInterval(intervalo);
        intervalo = null;
      }
    };

    const recibirConfirmacion = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.source !== iframeRef.current?.contentWindow) return;

      if (
        !event.data ||
        typeof event.data !== "object" ||
        Array.isArray(event.data)
      ) {
        return;
      }

      if (
        event.data.type !== "TIENDA_PREVIEW_RECIBIDA" ||
        event.data.requestId !== requestId
      ) {
        return;
      }

      confirmado = true;
      detenerReintentos();
      setEstado("actualizada");
      enviarSeleccion();
    };

    const intentarEnviar = () => {
      if (confirmado) return;

      enviarDatos();
      intentos += 1;

      if (intentos >= 40) {
        detenerReintentos();
        setEstado("error");
      }
    };

    window.addEventListener("message", recibirConfirmacion);

    intervalo = window.setInterval(intentarEnviar, 500);
    intentarEnviar();

    return () => {
      detenerReintentos();
      window.removeEventListener("message", recibirConfirmacion);

      if (solicitudRef.current?.requestId === requestId) {
        solicitudRef.current = null;
      }
    };
  }, [datos, modoSeleccion, recarga, enviarDatos, enviarSeleccion]);

  useEffect(() => {
    seleccionRef.current = seccionSeleccionada;
    enviarSeleccion();
  }, [seccionSeleccionada, enviarSeleccion]);

  return (
    <section
      aria-label="Vista previa de la tienda"
      className="flex h-full min-h-0 min-w-0 flex-col bg-[var(--bg-main)]"
    >
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-[var(--border-card)] px-4 py-3">
        <p className="text-sm font-semibold text-[var(--text-primary)]">
          Vista previa
        </p>

        <p
          role="status"
          className="text-xs text-[var(--text-secondary)]"
        >
          {estado === "actualizada"
            ? "Actualizada"
            : estado === "error"
              ? "No se pudo actualizar"
              : "Actualizando..."}
        </p>
      </div>

      {estado === "error" && (
        <div
          role="alert"
          className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-[var(--border-card)] bg-[var(--bg-card)] px-4 py-3"
        >
          <p className="text-sm text-[var(--text-secondary)]">
            La vista previa no respondió. Puedes volver a cargarla.
          </p>

          <button
            type="button"
            onClick={() => setRecarga((actual) => actual + 1)}
            className="min-h-11 rounded-xl border border-[var(--border-card)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-card-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
          >
            Reintentar
          </button>
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-auto p-3 sm:p-5">
        <div
          className={`mx-auto h-full min-h-[400px] overflow-hidden rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] shadow-sm ${
            dispositivo === "movil"
              ? "w-full max-w-[390px]"
              : "w-full"
          }`}
        >
          <iframe
            key={recarga}
            ref={iframeRef}
            src="/preview-editor"
            title="Vista previa del diseño de tu tienda"
            onLoad={() => {
              enviarDatos();
              enviarSeleccion();
            }}
            className="block h-full min-h-[400px] w-full border-0"
          />
        </div>
      </div>
    </section>
  );
}