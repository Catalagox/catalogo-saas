"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { ArrowUp, ArrowDown, Plus, Trash2, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import type {
  CategoriaTienda, ConfigDiseno, ConfigNavegacion, EnlaceMenuTienda, ResumenPaginaTienda,
} from "@/lib/tienda-diseno/types";

type Props = {
  catalogoId?: string;
  categorias: CategoriaTienda[];
  config: ConfigDiseno;
  onCambiarConfig: (config: ConfigDiseno) => void;
  disabled?: boolean;
};

const input = "min-h-11 w-full rounded-xl border border-[var(--border-card)] bg-[var(--bg-tertiary)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] disabled:opacity-50";
const boton = "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[var(--border-card)] px-3 py-2 text-xs font-semibold hover:bg-[var(--bg-card-hover)] disabled:cursor-not-allowed disabled:opacity-50";
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function urlValida(value: string) {
  const url = value.trim();
  if (url.length > 2048 || !/^https?:\/\//i.test(url) || /[\u0000-\u0020\u007f\\]/.test(url)) return false;
  try {
    const parsed = new URL(url);
    return (parsed.protocol === "https:" || parsed.protocol === "http:") && !!parsed.hostname && !parsed.username && !parsed.password;
  } catch { return false; }
}

export default function EditorNavegacion({ catalogoId, categorias, config, onCambiarConfig, disabled = false }: Props) {
  const prefijo = useId();
  const [paginas, setPaginas] = useState<ResumenPaginaTienda[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  // Conserva campos incompletos mientras el usuario escribe.
  const navegacion: ConfigNavegacion = config.navegacion ?? { modo: "automatica", enlaces: [] };
  const categoriasValidas = categorias.filter((c) => uuid.test(c.id));

  useEffect(() => {
    let activo = true;
    setPaginas([]);
    setError("");
    if (!catalogoId) { setCargando(false); return; }
    setCargando(true);
    async function cargar() {
      try {
        const { data, error: fallo } = await supabase.from("paginas_tienda")
          .select("id, titulo, slug, estado").eq("catalogo_id", catalogoId)
          .order("titulo", { ascending: true });
        if (fallo) throw fallo;
        if (activo) setPaginas((data ?? []) as ResumenPaginaTienda[]);
      } catch {
        if (activo) setError("No pudimos cargar las páginas. Vuelve a intentarlo.");
      } finally {
        if (activo) setCargando(false);
      }
    }
    void cargar();
    return () => { activo = false; };
  }, [catalogoId, revision]);

  function cambiar(valor: ConfigNavegacion) {
    if (!disabled) onCambiarConfig({ ...config, navegacion: valor });
  }

  function actualizar(id: string, transformar: (enlace: EnlaceMenuTienda) => EnlaceMenuTienda) {
    cambiar({ ...navegacion, enlaces: navegacion.enlaces.map((e) => e.id === id ? transformar(e) : e) });
  }

  function destino(enlace: EnlaceMenuTienda, tipo: EnlaceMenuTienda["tipo"]): EnlaceMenuTienda {
    const base = { id: enlace.id, etiqueta: enlace.etiqueta, visible: enlace.visible };
    switch (tipo) {
      case "inicio": return { ...base, tipo };
      case "catalogo": return { ...base, tipo };
      case "categoria": return { ...base, tipo, categoria_id: categoriasValidas[0]?.id ?? "" };
      case "pagina": return { ...base, tipo, pagina_id: paginas.find((p) => p.estado === "publicada")?.id ?? paginas[0]?.id ?? "" };
      case "externo": return { ...base, tipo, url: "https://", nueva_pestana: true };
    }
  }

  function mover(indice: number, paso: number) {
    const siguiente = indice + paso;
    if (siguiente < 0 || siguiente >= navegacion.enlaces.length) return;
    const enlaces = [...navegacion.enlaces];
    [enlaces[indice], enlaces[siguiente]] = [enlaces[siguiente], enlaces[indice]];
    cambiar({ ...navegacion, enlaces });
  }

  return (
    <details open className="rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] p-4">
      <summary className="cursor-pointer text-sm font-bold">Enlaces del menú</summary>
      <div className="mt-4 space-y-4">
        <label className="block space-y-2 text-sm">
          <span>Tipo de menú</span>
          <select className={input} value={navegacion.modo} disabled={disabled}
            onChange={(e) => cambiar({ ...navegacion, modo: e.target.value as ConfigNavegacion["modo"] })}>
            <option value="automatica">Automático: Inicio y categorías</option>
            <option value="personalizada">Personalizado: elegir enlaces</option>
          </select>
        </label>
        <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
          Activa Mostrar navegación para la barra del encabezado. En teléfono y tablet también puedes activar el menú.
        </p>
        {navegacion.modo === "automatica" ? (
          <p className="text-xs text-[var(--text-secondary)]">Se usan Inicio y las categorías de la tienda. Tus enlaces personalizados se conservan al cambiar de modo.</p>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <Link href="/dashboard/paginas" target="_blank" rel="noopener noreferrer" className={boton}>Administrar páginas ↗</Link>
              <button type="button" className={boton} disabled={disabled || cargando || !catalogoId}
                onClick={() => setRevision((r) => r + 1)}>
                <RefreshCw size={14} aria-hidden="true" className={cargando ? "animate-spin" : ""} /> Actualizar páginas
              </button>
            </div>
            {!catalogoId && <p className="text-xs text-[var(--color-danger)]">Falta conectar el identificador de la tienda al editor.</p>}
            {error && <p role="alert" className="text-xs text-[var(--color-danger)]">{error}</p>}
            {cargando && <p role="status" className="text-xs">Cargando páginas...</p>}
            {!cargando && !error && paginas.length === 0 && <p className="text-xs text-[var(--text-secondary)]">Crea una página desde Administrar páginas y luego pulsa Actualizar páginas.</p>}

            {navegacion.enlaces.map((enlace, indice) => {
              const paginaElegida = enlace.tipo === "pagina" ? paginas.find((p) => p.id === enlace.pagina_id) : undefined;
              const categoriaExiste = enlace.tipo === "categoria" && categoriasValidas.some((c) => c.id === enlace.categoria_id);
              return (
                <fieldset key={enlace.id} disabled={disabled} className="min-w-0 space-y-3 rounded-xl border border-[var(--border-card)] p-3">
                  <legend className="px-1 text-xs font-semibold">Enlace {indice + 1}</legend>
                  <label className="block space-y-2 text-sm">
                    <span>Texto del enlace</span>
                    <input className={input} maxLength={80} value={enlace.etiqueta} aria-invalid={!enlace.etiqueta.trim()}
                      onChange={(e) => actualizar(enlace.id, (actual) => ({ ...actual, etiqueta: e.target.value }))} />
                  </label>
                  {!enlace.etiqueta.trim() && <p className="text-xs text-[var(--color-danger)]">Escribe el texto del enlace.</p>}
                  <label className="block space-y-2 text-sm">
                    <span>Destino</span>
                    <select className={input} value={enlace.tipo}
                      onChange={(e) => actualizar(enlace.id, (actual) => destino(actual, e.target.value as EnlaceMenuTienda["tipo"]))}>
                      <option value="inicio">Inicio de la tienda</option>
                      <option value="catalogo">Catálogo de productos</option>
                      <option value="categoria" disabled={categoriasValidas.length === 0}>Categoría</option>
                      <option value="pagina" disabled={paginas.length === 0 || cargando}>Página propia</option>
                      <option value="externo">Enlace externo</option>
                    </select>
                  </label>
                  {enlace.tipo === "categoria" && (
                    <label className="block space-y-2 text-sm"><span>Categoría</span>
                      <select className={input} value={enlace.categoria_id}
                        onChange={(e) => actualizar(enlace.id, (actual) => actual.tipo === "categoria" ? { ...actual, categoria_id: e.target.value } : actual)}>
                        {!categoriaExiste && <option value={enlace.categoria_id}>Selecciona una categoría disponible</option>}
                        {categoriasValidas.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                      </select>
                      {!categoriaExiste && <span className="block text-xs text-[var(--color-danger)]">Selecciona una categoría existente.</span>}
                    </label>
                  )}
                  {enlace.tipo === "pagina" && (
                    <label className="block space-y-2 text-sm"><span>Página</span>
                      <select className={input} value={enlace.pagina_id} disabled={disabled || cargando}
                        onChange={(e) => actualizar(enlace.id, (actual) => actual.tipo === "pagina" ? { ...actual, pagina_id: e.target.value } : actual)}>
                        {!paginaElegida && <option value={enlace.pagina_id}>Selecciona una página disponible</option>}
                        {paginas.map((p) => <option key={p.id} value={p.id}>{p.titulo}{p.estado === "borrador" ? " (borrador)" : ""}</option>)}
                      </select>
                      {!cargando && !error && !paginaElegida && <span className="block text-xs text-[var(--color-danger)]">La página no está disponible. Selecciona otra.</span>}
                      {paginaElegida?.estado === "borrador" && <span className="block text-xs text-[var(--text-secondary)]">Publica esta página desde Páginas para que los visitantes puedan abrirla.</span>}
                    </label>
                  )}
                  {enlace.tipo === "externo" && (
                    <>
                      <label className="block space-y-2 text-sm"><span>Dirección web</span>
                        <input type="url" className={input} maxLength={2048} value={enlace.url} placeholder="https://ejemplo.com" aria-invalid={!urlValida(enlace.url)}
                          onChange={(e) => actualizar(enlace.id, (actual) => actual.tipo === "externo" ? { ...actual, url: e.target.value } : actual)} />
                      </label>
                      {!urlValida(enlace.url) && <p className="text-xs text-[var(--color-danger)]">Escribe una URL completa con http:// o https://.</p>}
                      <label className="flex min-h-10 items-center justify-between gap-3 text-sm"><span>Abrir en otra pestaña</span>
                        <input type="checkbox" className="h-5 w-5 accent-[var(--color-primary)]" checked={enlace.nueva_pestana}
                          onChange={(e) => actualizar(enlace.id, (actual) => actual.tipo === "externo" ? { ...actual, nueva_pestana: e.target.checked } : actual)} />
                      </label>
                    </>
                  )}
                  <label className="flex min-h-10 items-center justify-between gap-3 text-sm"><span>Mostrar enlace</span>
                    <input type="checkbox" className="h-5 w-5 accent-[var(--color-primary)]" checked={enlace.visible}
                      onChange={(e) => actualizar(enlace.id, (actual) => ({ ...actual, visible: e.target.checked }))} />
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" className={boton} disabled={disabled || indice === 0} aria-label={`Subir enlace ${indice + 1}`} onClick={() => mover(indice, -1)}><ArrowUp size={14} /> Subir</button>
                    <button type="button" className={boton} disabled={disabled || indice === navegacion.enlaces.length - 1} aria-label={`Bajar enlace ${indice + 1}`} onClick={() => mover(indice, 1)}><ArrowDown size={14} /> Bajar</button>
                    <button type="button" className={`${boton} text-[var(--color-danger)]`} onClick={() => cambiar({ ...navegacion, enlaces: navegacion.enlaces.filter((e) => e.id !== enlace.id) })}><Trash2 size={14} /> Quitar</button>
                  </div>
                </fieldset>
              );
            })}
            <button type="button" className={`${boton} w-full`} disabled={disabled || navegacion.enlaces.length >= 30}
              onClick={() => cambiar({ ...navegacion, enlaces: [...navegacion.enlaces, { id: crypto.randomUUID(), etiqueta: "Nuevo enlace", visible: true, tipo: "inicio" }] })}>
              <Plus size={16} aria-hidden="true" /> Agregar enlace
            </button>
            <p id={`${prefijo}-ayuda`} className="text-xs leading-relaxed text-[var(--text-secondary)]">
              Hasta 30 enlaces. Quitar un enlace no elimina su página. Guarda el borrador y publica el diseño para aplicar el menú a tu tienda.
            </p>
          </>
        )}
      </div>
    </details>
  );
}
