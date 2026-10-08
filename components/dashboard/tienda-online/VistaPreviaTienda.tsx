"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";

import type { DatosRenderTienda } from "@/lib/tienda-diseno/types";

interface VistaPreviaTiendaProps {
  datos: DatosRenderTienda;
}

export default function VistaPreviaTienda({
  datos,
}: VistaPreviaTiendaProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const enviarRef = useRef<(() => void) | null>(null);

  const [estado, setEstado] = useState<
    "cargando" | "lista" | "error"
  >("cargando");

  const [recarga, setRecarga] = useState(0);

  useEffect(() => {
    const requestId = crypto.randomUUID();
    let confirmado = false;
    let intentos = 0;
    let intervalo: number | undefined;

    setEstado("cargando");

    const detener = () => {
      if (intervalo !== undefined) {
        window.clearInterval(intervalo);
        intervalo = undefined;
      }
    };

    const enviar = () => {
      iframeRef.current?.contentWindow?.postMessage(
        {
          type: "TIENDA_EDITOR_DATOS",
          requestId,
          payload: datos,
          modoSeleccion: false,
        },
        window.location.origin,
      );
    };

    enviarRef.current = enviar;

    const recibir = (event: MessageEvent) => {
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
        enviar();
        return;
      }

      if (
        event.data.type === "TIENDA_PREVIEW_RECIBIDA" &&
        event.data.requestId === requestId
      ) {
        confirmado = true;
        detener();
        setEstado("lista");
      }
    };

    const intentar = () => {
      if (confirmado) return;

      enviar();
      intentos += 1;

      if (intentos >= 40) {
        detener();
        setEstado("error");
      }
    };

    window.addEventListener("message", recibir);

    intervalo = window.setInterval(intentar, 500);
    intentar();

    return () => {
      detener();
      window.removeEventListener("message", recibir);

      if (enviarRef.current === enviar) {
        enviarRef.current = null;
      }
    };
  }, [datos, recarga]);

  return (
    <div
      className="relative h-[520px] w-full overflow-hidden bg-[var(--bg-tertiary)] sm:h-[640px] xl:h-[720px]"
      aria-busy={estado === "cargando"}
    >
      <iframe
        key={recarga}
        ref={iframeRef}
        src="/preview-editor"
        title="Vista previa de tu tienda"
        onLoad={() => enviarRef.current?.()}
        className="block h-full w-full border-0 bg-white"
      />

      {estado === "cargando" && (
        <div
          role="status"
          className="absolute inset-0 flex items-center justify-center gap-3 bg-[var(--bg-card)] text-sm text-[var(--text-secondary)]"
        >
          <Loader2
            size={20}
            aria-hidden="true"
            className="animate-spin"
          />
          Cargando tu tienda…
        </div>
      )}

      {estado === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[var(--bg-card)] p-6 text-center">
          <p
            role="alert"
            className="text-sm text-[var(--text-secondary)]"
          >
            No pudimos cargar la vista previa.
          </p>

          <button
            type="button"
            onClick={() => setRecarga((actual) => actual + 1)}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[var(--border-card)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-card-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
          >
            <RefreshCw size={16} aria-hidden="true" />
            Reintentar
          </button>
        </div>
      )}
    </div>
  );
}