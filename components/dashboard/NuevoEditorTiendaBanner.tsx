"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, Check, LayoutTemplate, Paintbrush, Sparkles, X } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const STORAGE_PREFIX = "catalagox-nuevo-editor-v1";
const MAX_APARICIONES = 3;
// Respaldo durante esta carga si el navegador bloquea localStorage.
const contadorMemoria = new Map<string, number>();

function registrarEntrada(userId: string): boolean {
  const clave = `${STORAGE_PREFIX}:${userId}`;
  let contador = contadorMemoria.get(clave) ?? 0;
  try {
    const guardado = localStorage.getItem(clave);
    const numero = guardado === null ? 0 : Number(guardado);
    if (Number.isInteger(numero) && numero >= 0) contador = Math.max(contador, numero);
  } catch {
    // Se utiliza el contador en memoria durante esta carga.
  }
  if (contador >= MAX_APARICIONES) return false;
  const siguiente = contador + 1;
  contadorMemoria.set(clave, siguiente);
  try {
    localStorage.setItem(clave, String(siguiente));
  } catch {
    // El anuncio puede mostrarse aunque el almacenamiento esté bloqueado.
  }
  return true;
}

export function NuevoEditorTiendaBanner() {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const entradaRegistrada = useRef(false);

  useEffect(() => {
    let activo = true;
    async function cargarAnuncio() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (!activo || error || !user || entradaRegistrada.current) return;
        entradaRegistrada.current = true;
        setVisible(registrarEntrada(user.id));
      } catch {
        // Un error al consultar la sesión no interrumpe el dashboard.
      }
    }
    void cargarAnuncio();
    return () => { activo = false; };
  }, []);

  if (!visible) return null;

  return (
    <section
      aria-labelledby={`${id}-titulo`}
      className="relative mb-6 overflow-hidden rounded-2xl border border-[#1DB954]/30 bg-[var(--bg-card)] shadow-[var(--shadow-card)]"
    >
      <div aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-[#1DB954]" />
      <button
        type="button"
        onClick={() => setVisible(false)}
        aria-label="Cerrar anuncio del nuevo editor"
        title="Cerrar anuncio"
        className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full text-[var(--text-secondary)] transition hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1DB954]"
      >
        <X size={18} aria-hidden="true" />
      </button>

      <div className="p-5 sm:p-7">
        <div className="mb-4 flex items-center gap-2 pr-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1DB954] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
            <Sparkles size={13} aria-hidden="true" /> Novedad
          </span>
          <span className="text-xs font-medium text-[var(--text-secondary)]">Tienda online</span>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#1DB954]/25 text-[#1DB954] sm:flex">
              <Paintbrush size={27} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h2 id={`${id}-titulo`} className="pr-4 text-xl font-bold leading-tight text-[var(--text-primary)] sm:text-2xl">
                Dale tu estilo a tu tienda
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
                Ya puedes personalizar tu página desde <strong className="font-semibold text-[var(--text-primary)]">Tienda online</strong> con el nuevo editor.
                Explora las plantillas disponibles y ajusta los colores, el encabezado y la presentación de tus productos.
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
                Guarda tus cambios en <strong className="font-semibold text-[var(--text-primary)]">borrador</strong> y,
                cuando todo esté listo, pulsa <strong className="font-semibold text-[var(--text-primary)]">Publicar</strong> para que tus clientes vean el nuevo diseño.
              </p>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-[var(--text-secondary)]">
                <span className="inline-flex items-center gap-1.5"><LayoutTemplate size={15} className="text-[#1DB954]" aria-hidden="true" /> Nuevas plantillas</span>
                <span className="inline-flex items-center gap-1.5"><Check size={15} className="text-[#1DB954]" aria-hidden="true" /> Edita a tu ritmo</span>
                <span className="inline-flex items-center gap-1.5"><Check size={15} className="text-[#1DB954]" aria-hidden="true" /> Publica cuando esté listo</span>
              </div>
            </div>
          </div>
          <Link
            href="/dashboard/tienda-online"
            onClick={() => setVisible(false)}
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#1DB954] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#189c47] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1DB954]"
          >
            Explorar mi tienda <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
