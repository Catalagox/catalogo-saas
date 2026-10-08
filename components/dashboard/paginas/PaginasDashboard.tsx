"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FileText, Plus, Pencil, Trash2, Save, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import type { EstadoPaginaTienda, PaginaTienda } from "@/lib/tienda-diseno/types";

type Props = {
  catalogoId: string;
  nombreTienda: string;
  paginasIniciales: PaginaTienda[];
};

type Formulario = {
  titulo: string;
  slug: string;
  contenido: string;
  estado: EstadoPaginaTienda;
};

const VACIO: Formulario = { titulo: "", slug: "", contenido: "", estado: "borrador" };
const CAMPOS = "id, catalogo_id, titulo, slug, contenido, estado, created_at, updated_at";

function crearSlug(texto: string) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 100)
    .replace(/-+$/g, "");
}

const boton = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[var(--border-card)] px-4 py-2 text-sm font-semibold transition hover:bg-[var(--bg-card-hover)] disabled:cursor-not-allowed disabled:opacity-50";
const campo = "mt-2 w-full rounded-xl border border-[var(--border-card)] bg-[var(--bg-secondary)] px-3 py-2.5 text-[var(--text-primary)] outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]";

export default function PaginasDashboard({ catalogoId, nombreTienda, paginasIniciales }: Props) {
  const router = useRouter();
  const [paginas, setPaginas] = useState(paginasIniciales);
  const [editando, setEditando] = useState<PaginaTienda | null>(null);
  const [abierto, setAbierto] = useState(false);
  const [form, setForm] = useState<Formulario>({ ...VACIO });
  const [slugManual, setSlugManual] = useState(false);
  const [ocupado, setOcupado] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const bloqueo = useRef(false);
  const formularioRef = useRef<HTMLFormElement>(null);

  const hayCambios = abierto && (
    form.titulo !== (editando?.titulo ?? "") ||
    form.slug !== (editando?.slug ?? "") ||
    form.contenido !== (editando?.contenido ?? "") ||
    form.estado !== (editando?.estado ?? "borrador")
  );

  function permitirCambio() {
    return !hayCambios || window.confirm("Tienes cambios sin guardar. ¿Quieres descartarlos?");
  }

  function abrir(pagina: PaginaTienda | null) {
    if (bloqueo.current || !permitirCambio()) return;
    setEditando(pagina);
    setForm(pagina ? {
      titulo: pagina.titulo, slug: pagina.slug, contenido: pagina.contenido, estado: pagina.estado,
    } : { ...VACIO });
    setSlugManual(!!pagina);
    setAbierto(true);
    setError("");
    setMensaje("");
    requestAnimationFrame(() => {
      formularioRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      formularioRef.current?.querySelector<HTMLInputElement>("#pagina-titulo")?.focus({ preventScroll: true });
    });
  }

  async function guardar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (bloqueo.current) return;
    setError("");
    setMensaje("");
    const titulo = form.titulo.trim();
    const slug = form.slug.trim();
    if (!titulo || titulo.length > 120) {
      setError("Escribe un título de entre 1 y 120 caracteres."); return;
    }
    if (slug.length > 100 || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
      setError("El identificador admite hasta 100 caracteres: letras minúsculas, números y guiones entre palabras."); return;
    }
    if (form.estado !== "borrador" && form.estado !== "publicada") {
      setError("Selecciona un estado válido."); return;
    }
    bloqueo.current = true;
    setOcupado(true);
    try {
      const valores = { titulo, slug, contenido: form.contenido, estado: form.estado };
      const resultado = editando
        ? await supabase.from("paginas_tienda").update(valores)
            .eq("id", editando.id).eq("catalogo_id", catalogoId)
            .eq("updated_at", editando.updated_at).select(CAMPOS).single()
        : await supabase.from("paginas_tienda").insert({ ...valores, catalogo_id: catalogoId })
            .select(CAMPOS).single();
      if (resultado.error) {
        if (resultado.error.code === "23505") throw new Error("Ya existe una página con ese identificador. Elige otro.");
        if (resultado.error.code === "PGRST116") throw new Error("La página cambió o ya no está disponible. Recarga antes de volver a editarla.");
        throw new Error("No pudimos guardar la página. Revisa tu conexión y vuelve a intentarlo.");
      }
      if (!resultado.data) throw new Error("No pudimos confirmar el guardado.");
      const guardada = resultado.data as PaginaTienda;
      setPaginas((actuales) => editando
        ? actuales.map((p) => p.id === guardada.id ? guardada : p)
        : [guardada, ...actuales]);
      setAbierto(false);
      setEditando(null);
      setForm({ ...VACIO });
      setMensaje(guardada.estado === "publicada" ? "Página guardada como publicada." : "Borrador guardado.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No pudimos guardar la página.");
    } finally {
      bloqueo.current = false;
      setOcupado(false);
    }
  }

  async function eliminar(pagina: PaginaTienda) {
    if (bloqueo.current) return;
    if (!window.confirm(`¿Eliminar “${pagina.titulo}”? Esta acción no se puede deshacer.`)) return;
    bloqueo.current = true;
    setOcupado(true);
    setError("");
    setMensaje("");
    try {
      const { data, error: errorEliminar } = await supabase.from("paginas_tienda").delete()
        .eq("id", pagina.id).eq("catalogo_id", catalogoId)
        .eq("updated_at", pagina.updated_at).select("id").single();
      if (errorEliminar || !data) throw new Error("No pudimos eliminarla. Puede haber cambiado; recarga la pantalla y vuelve a intentarlo.");
      setPaginas((actuales) => actuales.filter((p) => p.id !== pagina.id));
      if (editando?.id === pagina.id) {
        setAbierto(false); setEditando(null); setForm({ ...VACIO });
      }
      setMensaje("Página eliminada.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No pudimos eliminar la página.");
    } finally {
      bloqueo.current = false;
      setOcupado(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 text-[var(--text-primary)] sm:px-6">
      <header className="flex flex-col gap-4 border-b border-[var(--border-card)] pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <FileText size={18} aria-hidden="true" /> {nombreTienda}
          </div>
          <h1 className="text-2xl font-bold md:text-3xl">Páginas</h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">Crea contenido como Contacto o Sobre nosotros.</p>
        </div>
        <button type="button" disabled={ocupado} onClick={() => abrir(null)}
          className={`${boton} bg-[var(--color-primary)] text-[var(--color-text-inverse)] hover:bg-[var(--color-primary-hover)]`}>
          <Plus size={18} aria-hidden="true" /> Crear página
        </button>
      </header>

      {error && <p role="alert" className="rounded-xl border border-red-500/30 p-4 text-[var(--color-danger)]">{error}</p>}
      {mensaje && <p role="status" className="rounded-xl border border-[var(--color-primary)] p-4">{mensaje}</p>}

      {abierto && (
        <form ref={formularioRef} onSubmit={guardar} className="scroll-mt-6 rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-4 sm:p-6">
          <h2 className="mb-5 text-lg font-bold">{editando ? "Editar página" : "Nueva página"}</h2>
          <fieldset disabled={ocupado} className="space-y-5">
            <div>
              <label htmlFor="pagina-titulo" className="text-sm font-semibold">Título</label>
              <input id="pagina-titulo" required maxLength={120} value={form.titulo} className={campo}
                placeholder="Sobre nosotros" onChange={(e) => {
                  const titulo = e.target.value;
                  setForm((actual) => ({ ...actual, titulo, slug: slugManual ? actual.slug : crearSlug(titulo) }));
                }} />
            </div>
            <div>
              <label htmlFor="pagina-slug" className="text-sm font-semibold">Identificador de la página</label>
              <input id="pagina-slug" required maxLength={100} value={form.slug} className={campo}
                pattern="[a-z0-9]+(-[a-z0-9]+)*" autoCapitalize="none" spellCheck={false}
                placeholder="sobre-nosotros" aria-describedby="pagina-slug-ayuda"
                onChange={(e) => { setSlugManual(true); setForm((actual) => ({ ...actual, slug: e.target.value })); }} />
              <p id="pagina-slug-ayuda" className="mt-2 text-xs text-[var(--text-secondary)]">Usa letras minúsculas, números y guiones. Ejemplo: sobre-nosotros.</p>
            </div>
            <div>
              <label htmlFor="pagina-contenido" className="text-sm font-semibold">Contenido</label>
              <textarea id="pagina-contenido" rows={12} value={form.contenido} className={`${campo} resize-y`}
                placeholder="Escribe el contenido de tu página..."
                onChange={(e) => setForm((actual) => ({ ...actual, contenido: e.target.value }))} />
            </div>
            <div>
              <label htmlFor="pagina-estado" className="text-sm font-semibold">Estado</label>
              <select id="pagina-estado" value={form.estado} className={campo}
                onChange={(e) => setForm((actual) => ({ ...actual, estado: e.target.value as EstadoPaginaTienda }))}>
                <option value="borrador">Borrador</option>
                <option value="publicada">Publicada</option>
              </select>
              <p className="mt-2 text-xs text-[var(--text-secondary)]">Los borradores son privados. Al guardar una página publicada, su contenido queda disponible públicamente.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="submit" className={`${boton} bg-[var(--color-primary)] text-[var(--color-text-inverse)] hover:bg-[var(--color-primary-hover)]`}>
                {ocupado ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}
                {ocupado ? "Guardando..." : "Guardar página"}
              </button>
              <button type="button" className={boton} onClick={() => {
                if (permitirCambio()) { setAbierto(false); setEditando(null); setForm({ ...VACIO }); }
              }}>Cancelar</button>
            </div>
          </fieldset>
        </form>
      )}

      <section aria-label="Páginas de la tienda" className="space-y-3">
        {paginas.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border-card)] p-8 text-center">
            <h2 className="text-lg font-semibold">Todavía no tienes páginas</h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">Usa Crear página para agregar la primera.</p>
          </div>
        ) : paginas.map((pagina) => (
          <article key={pagina.id} className="flex flex-col gap-4 rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h2 className="break-words font-bold">{pagina.titulo}</h2>
              <p className="mt-1 break-all text-sm text-[var(--text-secondary)]">{pagina.slug}</p>
              <span className="mt-2 inline-block rounded-lg bg-[var(--bg-tertiary)] px-2 py-1 text-xs font-semibold">
                {pagina.estado === "publicada" ? "Publicada" : "Borrador"}
              </span>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <button type="button" disabled={ocupado} className={boton} onClick={() => abrir(pagina)} aria-label={`Editar ${pagina.titulo}`}>
                <Pencil size={16} aria-hidden="true" /> Editar
              </button>
              <button type="button" disabled={ocupado} className={`${boton} text-[var(--color-danger)]`} onClick={() => void eliminar(pagina)} aria-label={`Eliminar ${pagina.titulo}`}>
                <Trash2 size={16} aria-hidden="true" /> Eliminar
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
