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

const PedidosContext = createContext<Contexto | null>(null);

export function usePedidosNotificaciones() {
  return useContext(PedidosContext);
}

function sonar(contexto: AudioContext) {
  if (contexto.state !== "running") return;
  const oscilador = contexto.createOscillator();
  const volumen = contexto.createGain();
  oscilador.type = "sine";
  oscilador.frequency.value = 880;
  volumen.gain.setValueAtTime(0.001, contexto.currentTime);
  volumen.gain.exponentialRampToValueAtTime(0.12, contexto.currentTime + 0.02);
  volumen.gain.exponentialRampToValueAtTime(0.001, contexto.currentTime + 0.32);
  oscilador.connect(volumen);
  volumen.connect(contexto.destination);
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
  const audioRef = useRef<AudioContext | null>(null);
  const sonidoActivoRef = useRef(false);
  const ultimaListaRef = useRef<Set<string> | null>(null);
  const consultandoRef = useRef(false);
  const avisoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (pathname === "/dashboard/pedidos") {
      setAviso(null);
      if (avisoTimerRef.current) clearTimeout(avisoTimerRef.current);
    }
  }, [pathname]);

  const alternarSonido = async () => {
    if (sonidoActivo) {
      sonidoActivoRef.current = false;
      setSonidoActivo(false);
      return;
    }
    try {
      const contexto = audioRef.current ?? new AudioContext();
      audioRef.current = contexto;
      await contexto.resume();
      sonidoActivoRef.current = contexto.state === "running";
      setSonidoActivo(sonidoActivoRef.current);
      if (contexto.state === "running") sonar(contexto);
    } catch (error) {
      console.error("No se pudo activar el sonido:", error);
      sonidoActivoRef.current = false;
      setSonidoActivo(false);
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
      if (conteo.error || lista.error) throw conteo.error ?? lista.error;

      const registros = lista.data ?? [];
      const ids = new Set(registros.map((pedido) => pedido.id));
      const anterior = ultimaListaRef.current;
      if (anterior) {
        const nuevos = registros.filter((pedido) => !anterior.has(pedido.id));
        if (nuevos.length > 0 && !enPedidosRef.current) {
          setAviso(nuevos.length === 1
            ? `Llegó el pedido PED-${String(nuevos[0].numero).padStart(6, "0")}`
            : `Llegaron ${nuevos.length} pedidos nuevos`);
          if (avisoTimerRef.current) clearTimeout(avisoTimerRef.current);
          avisoTimerRef.current = setTimeout(() => setAviso(null), 9000);
          if (sonidoActivoRef.current && audioRef.current) sonar(audioRef.current);
        }
      }
      ultimaListaRef.current = ids;
      setPedidosNuevos(conteo.count ?? 0);
    } catch (error) {
      console.error("No pudimos comprobar los pedidos sin leer:", error);
    } finally {
      consultandoRef.current = false;
    }
  }, [catalogoId]);

  useEffect(() => {
    ultimaListaRef.current = null;
    void consultar();
    const intervalo = window.setInterval(() => void consultar(), 15_000);
    const alVolver = () => {
      if (document.visibilityState === "visible") void consultar();
    };
    document.addEventListener("visibilitychange", alVolver);
    window.addEventListener("pedidos:actualizados", consultar);
    return () => {
      clearInterval(intervalo);
      document.removeEventListener("visibilitychange", alVolver);
      window.removeEventListener("pedidos:actualizados", consultar);
      if (avisoTimerRef.current) clearTimeout(avisoTimerRef.current);
      void audioRef.current?.close();
      audioRef.current = null;
    };
  }, [consultar]);

  return (
    <PedidosContext.Provider value={{ pedidosNuevos, sonidoActivo, alternarSonido }}>
      {children}
      <div className="fixed right-4 top-20 z-[80] flex max-w-[calc(100vw-2rem)] flex-col items-end gap-2 lg:top-4">
        {aviso && (
          <div role="status" className="flex w-full items-center gap-3 rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] p-4 text-sm text-[var(--text-primary)] shadow-2xl">
            <Bell size={19} className="shrink-0 text-[var(--color-primary)]" />
            <Link href="/dashboard/pedidos" onClick={() => setAviso(null)} className="font-semibold underline underline-offset-2">
              {aviso}. Ver pedidos
            </Link>
            <button type="button" onClick={() => setAviso(null)} aria-label="Cerrar aviso" className="ml-auto p-1"><X size={16} /></button>
          </div>
        )}
      </div>
    </PedidosContext.Provider>
  );
}
