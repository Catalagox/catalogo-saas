"use client";

import { useId, useState } from "react";
import { normalizarConfig, esColorValido } from "@/lib/tienda-diseno/config";
import { REDES_PIE } from "@/lib/tienda-diseno/config-pie";
import type { ConfigDiseno, ConfigPie, RedSocialPie } from "@/lib/tienda-diseno/types";

interface Props { config: ConfigDiseno; onCambiarConfig: (config: ConfigDiseno) => void; disabled?: boolean; }
const NOMBRES: Record<RedSocialPie, string> = { instagram: "Instagram", facebook: "Facebook", tiktok: "TikTok", youtube: "YouTube" };
const CAMPO = "mt-2 w-full rounded-lg border border-[var(--border-card)] bg-[var(--bg-card)] px-3 py-2 text-sm text-[var(--text-primary)]";
function CampoColorPie({ valor, disabled, onCambiar }: { valor: string; disabled: boolean; onCambiar: (valor: string) => void }) {
  const [borrador, setBorrador] = useState<string | null>(null);
  const [error, setError] = useState(false);
  return <><input type="text" value={borrador ?? valor} maxLength={100} disabled={disabled} aria-invalid={error || undefined}
    onChange={e => { setBorrador(e.target.value); setError(false); if (esColorValido(e.target.value)) onCambiar(e.target.value); }}
    onBlur={() => { if (borrador !== null && !esColorValido(borrador)) setError(true); else setBorrador(null); }} className={CAMPO} placeholder="#ffffff" />
    {error && <span role="alert" className="mt-1 block text-xs text-red-500">Color inválido. Se conserva el último color válido.</span>}</>;
}

export default function EditorPie({ config, onCambiarConfig, disabled = false }: Props) {
  const id = useId();
  const pie = normalizarConfig(config).pie;
  function cambiar(cambios: Partial<ConfigPie>) { if (!disabled) onCambiarConfig({ ...config, pie: { ...pie, ...cambios } }); }
  function interruptor(campo: "mostrar" | "mostrar_nombre" | "mostrar_redes" | "mostrar_derechos" | "heredar_fondo", titulo: string) {
    return <label className="flex min-h-11 items-center justify-between gap-3 text-sm"><span>{titulo}</span><input type="checkbox" role="switch" checked={pie[campo]} onChange={e => cambiar({ [campo]: e.target.checked })} className="h-4 w-4 accent-[var(--color-primary)]" /></label>;
  }
  function texto(campo: "nombre" | "descripcion" | "titulo_redes" | "texto_derechos", titulo: string, max: number) {
    return <label className="block text-sm">{titulo}{campo === "descripcion" ? <textarea value={pie[campo]} maxLength={max} rows={3} onChange={e => cambiar({ [campo]: e.target.value })} className={CAMPO} /> : <input value={pie[campo]} maxLength={max} onChange={e => cambiar({ [campo]: e.target.value })} className={CAMPO} />}</label>;
  }
  function cambiarRed(red: RedSocialPie, cambio: Partial<ConfigPie["redes"][RedSocialPie]>) { cambiar({ redes: { ...pie.redes, [red]: { ...pie.redes[red], ...cambio } } }); }
  function cambiarEnlace(indice: number, cambio: Partial<ConfigPie["enlaces"][number]>) { cambiar({ enlaces: pie.enlaces.map((e, i) => i === indice ? { ...e, ...cambio } : e) }); }
  return (
    <fieldset disabled={disabled} className="min-w-0 space-y-6 text-[var(--text-primary)] disabled:opacity-60">
      <legend className="mb-3 text-sm font-bold">Pie de página</legend>
      {interruptor("mostrar", "Mostrar pie de página")}
      <section className="space-y-4 border-t border-[var(--border-card)] pt-4">
        <h3 className="text-sm font-bold">Información de tu negocio</h3>
        {interruptor("mostrar_nombre", "Mostrar nombre de la tienda")}
        {texto("nombre", "Nombre (vacío usa el nombre de tu tienda)", 120)}
        {texto("descripcion", "Descripción, dirección u horario", 1500)}
      </section>
      <section className="space-y-4 border-t border-[var(--border-card)] pt-4">
        <h3 className="text-sm font-bold">Redes sociales</h3>
        {interruptor("mostrar_redes", "Mostrar redes sociales")}
        {texto("titulo_redes", "Título de las redes", 120)}
        {REDES_PIE.map(red => <div key={red} className="rounded-xl border border-[var(--border-card)] p-3">
          <label className="flex min-h-9 items-center justify-between gap-3 text-sm font-semibold">{NOMBRES[red]}<input type="checkbox" role="switch" checked={pie.redes[red].visible} onChange={e => cambiarRed(red, { visible: e.target.checked })} className="h-4 w-4 accent-[var(--color-primary)]" /></label>
          <label htmlFor={`${id}-${red}`} className="mt-2 block text-xs text-[var(--text-secondary)]">Enlace o @usuario</label>
          <input id={`${id}-${red}`} type="text" maxLength={2048} value={pie.redes[red].url ?? ""} placeholder={pie.redes[red].url === null ? "Usando enlace actual de Ajustes" : "https://... o @usuario"} onChange={e => cambiarRed(red, { url: e.target.value })} className={CAMPO} />
          <p className="mt-2 text-xs text-[var(--text-secondary)]">{pie.redes[red].url === null ? "Se conserva el enlace de Ajustes hasta que escribas otro." : "Este enlace se guarda con el diseño. Un campo vacío no muestra esta red."}</p>
          {pie.redes[red].url !== null && <button type="button" onClick={() => cambiarRed(red, { url: null })} className="mt-2 text-xs underline">Usar enlace de Ajustes</button>}
        </div>)}
      </section>
      <section className="space-y-4 border-t border-[var(--border-card)] pt-4">
        <h3 className="text-sm font-bold">Enlaces del footer</h3>
        <p className="text-xs leading-relaxed text-[var(--text-secondary)]">Añade Contacto, Sobre nosotros u otras páginas existentes. Usa una URL https completa o una ruta de tu tienda, como /paginas/contacto. Añadir un enlace no crea la página.</p>
        {pie.enlaces.map((enlace, indice) => <div key={enlace.id} className="space-y-3 rounded-xl border border-[var(--border-card)] p-3">
          <label className="block text-xs">Texto<input value={enlace.texto} maxLength={100} onChange={e => cambiarEnlace(indice, { texto: e.target.value })} className={CAMPO} /></label>
          <label className="block text-xs">URL o ruta<input value={enlace.url} maxLength={2048} placeholder="https://... o /paginas/contacto" onChange={e => cambiarEnlace(indice, { url: e.target.value })} className={CAMPO} /></label>
          <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={enlace.visible} onChange={e => cambiarEnlace(indice, { visible: e.target.checked })} />Mostrar enlace</label>
          <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={enlace.nueva_pestana} onChange={e => cambiarEnlace(indice, { nueva_pestana: e.target.checked })} />Abrir en otra pestaña</label>
          <button type="button" onClick={() => cambiar({ enlaces: pie.enlaces.filter((_, i) => i !== indice) })} className="text-xs underline">Eliminar enlace</button>
        </div>)}
        <button type="button" disabled={pie.enlaces.length >= 12} onClick={() => cambiar({ enlaces: [...pie.enlaces, { id: crypto.randomUUID(), texto: "Nuevo enlace", url: "", visible: true, nueva_pestana: false }] })} className="min-h-10 rounded-lg border border-[var(--border-card)] px-3 text-sm disabled:opacity-40">Añadir enlace</button>
      </section>
      <section className="space-y-4 border-t border-[var(--border-card)] pt-4">
        <h3 className="text-sm font-bold">Diseño</h3>
        <label className="block text-sm">Alineación<select value={pie.alineacion} onChange={e => cambiar({ alineacion: e.target.value as ConfigPie["alineacion"] })} className={CAMPO}><option value="izquierda">Izquierda</option><option value="centro">Centro</option><option value="derecha">Derecha</option></select></label>
        {interruptor("heredar_fondo", "Usar color de fondo general del footer")}
        {([ ["color_fondo", "Fondo"], ["color_texto", "Texto"], ["color_iconos", "Iconos"], ["color_fondo_iconos", "Fondo de iconos"], ["color_borde", "Borde de iconos"] ] as const).map(([campo, titulo]) => <label key={campo} className="block text-sm">{titulo}<CampoColorPie valor={pie[campo]} disabled={disabled || (campo === "color_fondo" && pie.heredar_fondo)} onCambiar={valor => cambiar({ [campo]: valor })} /><span className="mt-1 block text-xs text-[var(--text-secondary)]">HEX, rgb, rgba o transparent.</span></label>)}
        {([ ["tamano_texto", "Tamaño del texto", 10, 24], ["tamano_iconos", "Tamaño de iconos", 14, 36], ["padding_superior", "Espacio superior", 0, 120], ["padding_inferior", "Espacio inferior", 0, 120] ] as const).map(([campo, titulo, min, max]) => <label key={campo} className="block text-sm">{titulo}: {pie[campo]} px<input type="range" min={min} max={max} value={pie[campo]} onChange={e => cambiar({ [campo]: Number(e.target.value) })} className="mt-2 block w-full accent-[var(--color-primary)]" /></label>)}
      </section>
      <section className="space-y-4 border-t border-[var(--border-card)] pt-4">
        {interruptor("mostrar_derechos", "Mostrar derechos de la tienda")}
        {texto("texto_derechos", "Texto de derechos (año automático)", 300)}
      </section>
      <p className="text-xs leading-relaxed text-[var(--text-secondary)]">Guarda el borrador y pulsa Publicar para mostrar los cambios en tu tienda.</p>
    </fieldset>
  );
}
