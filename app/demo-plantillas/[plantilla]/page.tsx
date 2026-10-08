"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowLeft, Monitor, Smartphone } from "lucide-react";

import EditorPreview from "@/components/dashboard/editor/EditorPreview";

import { esPlantillaId } from "@/lib/tienda-diseno/config";
import { obtenerDemoPlantilla } from "@/lib/tienda-diseno/demo";
import { obtenerPlantilla } from "@/lib/tienda-diseno/plantillas";

function ignorarSeleccion(): void {}

export default function DemoPlantillaPage() {
  const params = useParams<{ plantilla: string }>();

  const [dispositivo, setDispositivo] = useState<
    "escritorio" | "movil"
  >("escritorio");

  const plantillaId = params.plantilla;

  const demo = useMemo(() => {
    if (!esPlantillaId(plantillaId)) return null;

    return {
      definicion: obtenerPlantilla(plantillaId),
      datos: obtenerDemoPlantilla(plantillaId),
    };
  }, [plantillaId]);

  if (!demo) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-white px-6 text-center text-slate-900">
        <h1 className="text-xl font-bold">
          Esta plantilla no está disponible
        </h1>

        <Link
          href="/dashboard/tienda-online"
          className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold transition hover:bg-slate-100"
        >
          Volver a las plantillas
        </Link>
      </main>
    );
  }

  return (
    <main className="flex h-dvh min-h-0 flex-col overflow-hidden bg-white text-slate-900">
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/dashboard/tienda-online"
            aria-label="Volver a las plantillas"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
          >
            <ArrowLeft size={19} aria-hidden="true" />
          </Link>

          <div className="min-w-0">
            <h1 className="truncate text-sm font-bold sm:text-base">
              Plantilla {demo.definicion.nombre}
            </h1>

            <p className="mt-0.5 text-xs text-slate-600">
              Demostración con productos de ejemplo
            </p>
          </div>
        </div>

        <div
          role="group"
          aria-label="Tamaño de la vista previa"
          className="inline-flex shrink-0 gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1"
        >
          <button
            type="button"
            aria-pressed={dispositivo === "escritorio"}
            onClick={() => setDispositivo("escritorio")}
            className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 ${
              dispositivo === "escritorio"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-600 hover:bg-white"
            }`}
          >
            <Monitor size={18} aria-hidden="true" />
            <span>Escritorio</span>
          </button>

          <button
            type="button"
            aria-pressed={dispositivo === "movil"}
            onClick={() => setDispositivo("movil")}
            className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 ${
              dispositivo === "movil"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-600 hover:bg-white"
            }`}
          >
            <Smartphone size={18} aria-hidden="true" />
            <span>Móvil</span>
          </button>
        </div>
      </header>

      <div className="min-h-0 min-w-0 flex-1 overflow-hidden">
        <EditorPreview
          datos={demo.datos}
          dispositivo={dispositivo}
          modoSeleccion={false}
          seccionSeleccionada={null}
          onSeleccionarSeccion={ignorarSeleccion}
        />
      </div>

      <footer className="shrink-0 border-t border-slate-200 bg-white px-4 py-3 text-center text-xs leading-relaxed text-slate-600">
        Los productos son de ejemplo. Esta demostración no permite
        realizar pedidos.
      </footer>
    </main>
  );
}