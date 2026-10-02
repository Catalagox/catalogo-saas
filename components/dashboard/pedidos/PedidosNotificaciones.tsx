"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Bell, X } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

type Contexto = {
  pedidosNuevos: number;
  sonidoActivo: boolean;
  alternarSonido: () => Promise<void>;
};

type Tema = "light" | "dark" | "system";

const THEME_KEY = "catalogox-dashboard-theme";
const THEME_EVENT = "catalogox-dashboard-theme-change";

const PedidosContext = createContext<Contexto | null>(null);

export function usePedidosNotificaciones() {
  return useContext(PedidosContext);
}

function esTema(value: unknown): value is Tema {
  return value === "light" || value === "dark" || value === "system";
}

function sonar(contexto: AudioContext) {
  if (contexto.state !== "running") return;

  const oscilador = contexto.createOscillator();
  const volumen = contexto.createGain();

  oscilador.type = "sine";
  oscilador.frequency.value = 880;

  volumen.gain.setValueAtTime(0.001, contexto.currentTime);
  volumen.gain.exponentialRampToValueAtTime(
    0.12,
    contexto.currentTime + 0.02,
  );
  volumen.gain.exponentialRampToValueAtTime(
    0.001,
    contexto.currentTime + 0.32,
  );

  oscilador.connect(volumen);
  volumen.connect(contexto.destination);

  oscilador.onended = () => {
    oscilador.disconnect();
    volumen.disconnect();
  };

  oscilador.start();
  oscilador.stop(contexto.currentTime + 0.34);
}

export default function PedidosNotificacionesProvider({
  catalogoId,
  children,
}: {
  catalogoId: string;
  children: ReactNode;
}) {
  const pathname = usePathname();

  const enPedidosRef = useRef(pathname === "/dashboard/pedidos");
  enPedidosRef.current = pathname === "/dashboard/pedidos";

  const [pedidosNuevos, setPedidosNuevos] = useState(0);
  const [sonidoActivo, setSonidoActivo] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);
  const [temaAplicado, setTemaAplicado] =
    useState<"light" | "dark">("light");

  const audioRef = useRef<AudioContext | null>(null);
  const sonidoActivoRef = useRef(false);
  const activandoSonidoRef = useRef(false);
  const ultimaListaRef = useRef<Set<string> | null>(null);
  const consultandoRef = useRef(false);
  const avisoTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  // El aviso está fuera del contenedor del layout.
  // Por eso resuelve su tema de forma independiente.
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    let preferencia: Tema = "light";

    const aplicar = () => {
      setTemaAplicado(
        preferencia === "system"
          ? media.matches
            ? "dark"
            : "light"
          : preferencia,
      );
    };

    const leer = () => {
      try {
        const guardado = localStorage.getItem(THEME_KEY);
        preferencia = esTema(guardado) ? guardado : "light";
      } catch {
        preferencia = "light";
      }

      aplicar();
    };

    const cambiar = (event: Event) => {
      const valor = (event as CustomEvent<unknown>).detail;

      if (esTema(valor)) {
        preferencia = valor;
        aplicar();
      }
    };

    const sincronizar = (event: StorageEvent) => {
      if (event.key === THEME_KEY || event.key === null) leer();
    };

    leer();

    media.addEventListener("change", aplicar);
    window.addEventListener(THEME_EVENT, cambiar);
    window.addEventListener("storage", sincronizar);

    return () => {
      media.removeEventListener("change", aplicar);
      window.removeEventListener(THEME_EVENT, cambiar);
      window.removeEventListener("storage", sincronizar);
    };
  }, []);

  useEffect(() => {
    if (pathname === "/dashboard/pedidos") {
      setAviso(null);

      if (avisoTimerRef.current) {
        clearTimeout(avisoTimerRef.current);
        avisoTimerRef.current = null;
      }
    }
  }, [pathname]);

  const alternarSonido = async () => {
    if (activandoSonidoRef.current) return;

    if (sonidoActivoRef.current) {
      sonidoActivoRef.current = false;
      setSonidoActivo(false);
      return;
    }

    activandoSonidoRef.current = true;

    try {
      const contexto =
        audioRef.current?.state !== "closed" && audioRef.current
          ? audioRef.current
          : new AudioContext();

      audioRef.current = contexto;
      await contexto.resume();

      sonidoActivoRef.current = contexto.state === "running";
      setSonidoActivo(sonidoActivoRef.current);

      if (sonidoActivoRef.current) sonar(contexto);
    } catch (error) {
      console.error("No se pudo activar el sonido:", error);
      sonidoActivoRef.current = false;
      setSonidoActivo(false);
    } finally {
      activandoSonidoRef.current = false;
    }
  };

  const consultar = useCallback(async () => {
    if (consultandoRef.current) return;

    consultandoRef.current = true;

    try {
      const [conteo, lista] = await Promise.all([
        supabase
          .from("pedidos")
          .select("id", { count: "exact", head: true })
          .eq("catalogo_id", catalogoId)
          .is("visto_por_vendedor_at", null),

        supabase
          .from("pedidos")
          .select("id, numero")
          .eq("catalogo_id", catalogoId)
          .is("visto_por_vendedor_at", null)
          .order("created_at", { ascending: false })
          .limit(50),
      ]);

      if (conteo.error || lista.error) {
        throw conteo.error ?? lista.error;
      }

      const registros = lista.data ?? [];
      const ids = new Set(registros.map((pedido) => pedido.id));
      const anterior = ultimaListaRef.current;

      if (anterior) {
        const nuevos = registros.filter(
          (pedido) => !anterior.has(pedido.id),
        );

        if (nuevos.length > 0 && !enPedidosRef.current) {
          setAviso(
            nuevos.length === 1
              ? `Llegó el pedido PED-${String(nuevos[0].numero).padStart(6, "0")}`
              : `Llegaron ${nuevos.length} pedidos nuevos`,
          );

          if (avisoTimerRef.current) {
            clearTimeout(avisoTimerRef.current);
          }

          avisoTimerRef.current = setTimeout(() => {
            setAviso(null);
            avisoTimerRef.current = null;
          }, 9000);

          if (sonidoActivoRef.current && audioRef.current) {
            sonar(audioRef.current);
          }
        }
      }

      ultimaListaRef.current = ids;
      setPedidosNuevos(conteo.count ?? 0);
    } catch (error) {
      console.error(
        "No pudimos comprobar los pedidos sin leer:",
        error,
      );
    } finally {
      consultandoRef.current = false;
    }
  }, [catalogoId]);

  useEffect(() => {
    ultimaListaRef.current = null;
    void consultar();

    const intervalo = window.setInterval(
      () => void consultar(),
      15_000,
    );

    const alVolver = () => {
      if (document.visibilityState === "visible") {
        void consultar();
      }
    };

    const alActualizar = () => void consultar();

    document.addEventListener("visibilitychange", alVolver);
    window.addEventListener("pedidos:actualizados", alActualizar);

    return () => {
      clearInterval(intervalo);
      document.removeEventListener("visibilitychange", alVolver);
      window.removeEventListener(
        "pedidos:actualizados",
        alActualizar,
      );

      if (avisoTimerRef.current) {
        clearTimeout(avisoTimerRef.current);
        avisoTimerRef.current = null;
      }
    };
  }, [consultar]);

  useEffect(() => {
    return () => {
      const contexto = audioRef.current;
      audioRef.current = null;

      if (contexto && contexto.state !== "closed") {
        void contexto.close().catch(() => {});
      }
    };
  }, []);

  return (
    <PedidosContext.Provider
      value={{ pedidosNuevos, sonidoActivo, alternarSonido }}
    >
      {children}

      {aviso && (
        <div
          data-theme={temaAplicado}
          className="dashboard-theme fixed right-4 top-20 z-[80] max-w-[calc(100vw-2rem)] rounded-xl lg:top-4"
        >
          <div
            role="status"
            aria-live="polite"
            className="flex items-center gap-3 rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] p-4 text-sm text-[var(--text-primary)] shadow-[var(--shadow-card)]"
          >
            <Bell
              size={19}
              className="shrink-0"
              aria-hidden="true"
            />

            <Link
              href="/dashboard/pedidos"
              onClick={() => setAviso(null)}
              className="min-w-0 font-semibold underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-[var(--color-primary)]"
            >
              {aviso}. Ver pedidos
            </Link>

            <button
              type="button"
              onClick={() => setAviso(null)}
              aria-label="Cerrar aviso"
              className="ml-auto shrink-0 rounded-lg p-1.5 text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-[var(--color-primary)]"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </PedidosContext.Provider>
  );
}