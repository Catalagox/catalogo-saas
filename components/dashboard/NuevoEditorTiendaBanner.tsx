
"use client";

import Link from "next/link";
import {
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  ArrowRight,
  Check,
  LayoutTemplate,
  Paintbrush,
  Sparkles,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const STORAGE_PREFIX = "catalagox-nuevo-editor-v1";
const MAX_APARICIONES = 3;
const VERDE = "#1DB954";

const contadorMemoria = new Map<string, number>();

function registrarEntrada(userId: string): boolean {
  const clave = `${STORAGE_PREFIX}:${userId}`;
  let contador = contadorMemoria.get(clave) ?? 0;

  try {
    const guardado = localStorage.getItem(clave);
    const numero = guardado === null ? 0 : Number(guardado);

    if (Number.isInteger(numero) && numero >= 0) {
      contador = Math.max(contador, numero);
    }
  } catch {
    // Respaldo en memoria.
  }

  if (contador >= MAX_APARICIONES) return false;

  const siguiente = contador + 1;
  contadorMemoria.set(clave, siguiente);

  try {
    localStorage.setItem(clave, String(siguiente));
  } catch {
    // El anuncio puede mostrarse igualmente.
  }

  return true;
}

export function NuevoEditorTiendaBanner() {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const [montado, setMontado] = useState(false);
  const entradaRegistrada = useRef(false);
  const botonCerrarRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMontado(true);
  }, []);

  useEffect(() => {
    let activo = true;

    async function cargarAnuncio() {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (
          !activo ||
          error ||
          !user ||
          entradaRegistrada.current
        ) {
          return;
        }

        entradaRegistrada.current = true;
        setVisible(registrarEntrada(user.id));
      } catch {
        // No interrumpir el dashboard.
      }
    }

    void cargarAnuncio();

    return () => {
      activo = false;
    };
  }, []);

  useEffect(() => {
    if (!visible) return;

    const scrollAnterior = document.body.style.overflow;
    const elementoAnterior = document.activeElement;

    document.body.style.overflow = "hidden";

    const frame = requestAnimationFrame(() => {
      botonCerrarRef.current?.focus();
    });

    function manejarTeclado(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setVisible(false);
      }

      if (event.key === "Tab") {
        const modal = document.getElementById(
          `${id}-modal`
        );

        if (!modal) return;

        const elementos = Array.from(
          modal.querySelectorAll<HTMLElement>(
            'button:not([disabled]), a[href]'
          )
        );

        if (!elementos.length) return;

        const primero = elementos[0];
        const ultimo = elementos[elementos.length - 1];

        if (
          event.shiftKey &&
          document.activeElement === primero
        ) {
          event.preventDefault();
          ultimo.focus();
        } else if (
          !event.shiftKey &&
          document.activeElement === ultimo
        ) {
          event.preventDefault();
          primero.focus();
        }
      }
    }

    document.addEventListener("keydown", manejarTeclado);

    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = scrollAnterior;
      document.removeEventListener(
        "keydown",
        manejarTeclado
      );

      if (elementoAnterior instanceof HTMLElement) {
        elementoAnterior.focus();
      }
    };
  }, [visible, id]);

  if (!montado || !visible) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[2147483647] flex items-center justify-center bg-black/65 p-3 backdrop-blur-[3px] sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          setVisible(false);
        }
      }}
    >
      <section
        id={`${id}-modal`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-titulo`}
        aria-describedby={`${id}-descripcion`}
        className="relative flex max-h-[min(90dvh,760px)] w-full max-w-[650px] flex-col overflow-hidden rounded-[24px] text-white shadow-2xl sm:rounded-[30px]"
        style={{ backgroundColor: VERDE }}
      >
        {/* Botón cerrar */}
        <button
          ref={botonCerrarRef}
          type="button"
          onClick={() => setVisible(false)}
          aria-label="Cerrar anuncio"
          title="Cerrar"
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <X size={21} />
        </button>

        <div className="overflow-y-auto overscroll-contain p-6 pt-8 sm:p-10">
          {/* Etiqueta */}
          <div className="mb-6 flex flex-wrap items-center gap-3 pr-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-[#159943]">
              <Sparkles size={15} />
              Nueva función
            </span>
          </div>

          {/* Icono */}
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/30 bg-white/15">
            <Paintbrush size={32} strokeWidth={1.8} />
          </div>

          {/* Título */}
          <h2
            id={`${id}-titulo`}
            className="max-w-[500px] text-3xl font-extrabold leading-[1.15] tracking-tight sm:text-4xl"
          >
            ¡Dale tu propio estilo a tu tienda!
          </h2>

          {/* Descripción */}
          <div
            id={`${id}-descripcion`}
            className="mt-5 space-y-4 text-sm leading-7 text-white/95 sm:text-base"
          >
            <p>
              ¡Tenemos novedades en Catalagox!
              Ahora puedes personalizar tu tienda online
              con nuestro <strong>nuevo editor de diseño</strong>.
            </p>

            <p>
              Explora las plantillas disponibles y modifica
              los colores, el encabezado y la presentación
              de tus productos para crear una tienda
              que represente tu negocio.
            </p>

            <p>
              Guarda tus cambios en{" "}
              <strong>borrador</strong> y, cuando estés
              satisfecho con el resultado, presiona{" "}
              <strong>Publicar</strong> para mostrar el
              nuevo diseño a tus clientes.
            </p>
          </div>

          {/* Beneficios */}
          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 p-3 text-xs font-semibold">
              <LayoutTemplate size={19} className="shrink-0" />
              Nuevas plantillas
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 p-3 text-xs font-semibold">
              <Check size={19} className="shrink-0" />
              Edita a tu ritmo
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 p-3 text-xs font-semibold">
              <Check size={19} className="shrink-0" />
              Publica cuando quieras
            </div>
          </div>

          {/* Botones */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard/tienda-online"
              onClick={() => setVisible(false)}
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-center text-sm font-extrabold text-[#159943] transition hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Explorar mi tienda
              <ArrowRight size={18} />
            </Link>

            <button
              type="button"
              onClick={() => setVisible(false)}
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              Lo veré después
            </button>
          </div>

          <p className="mt-5 text-center text-xs text-white/75">
            Esta novedad se mostrará hasta 3 veces.
          </p>
        </div>
      </section>
    </div>,
    document.body
  );
}
