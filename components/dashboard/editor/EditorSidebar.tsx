"use client";
import { useId } from "react";
import { ChevronLeft, LayoutGrid, LayoutList, Paintbrush } from "lucide-react";
import EditorPortada from "@/components/dashboard/editor/EditorPortada";
import EditorDestacados from "@/components/dashboard/editor/EditorDestacados";
import EditorSecciones from "@/components/dashboard/editor/EditorSecciones";
import EditorEspaciado from "@/components/dashboard/editor/EditorEspaciado";
import EditorEstilos from "@/components/dashboard/editor/EditorEstilos";
import EditorEncabezado from "@/components/dashboard/editor/EditorEncabezado";
import EditorTarjetas from "@/components/dashboard/editor/EditorTarjetas";
import EditorCatalogo from "@/components/dashboard/editor/EditorCatalogo";
import {
  SECCIONES_EDITOR,
  esColorValido,
  type CampoColor,
} from "@/lib/tienda-diseno/config";
import type {
  CategoriaTienda,
  ConfigDiseno,
  PlantillaId,
  SeccionEditor,
} from "@/lib/tienda-diseno/types";
interface EditorSidebarProps {
  catalogoId: string;
  logo?: string | null;
  onLogoActualizado?: (logo: string) => void;
  config: ConfigDiseno;
  categorias: CategoriaTienda[];
  plantilla: PlantillaId;
  seccionSeleccionada: SeccionEditor | null;
  onSeleccionarSeccion: (seccion: SeccionEditor | null) => void;
  onCambiarConfig: (config: ConfigDiseno) => void;
  disabled?: boolean;
  onSubiendoImagenChange?: (subiendo: boolean) => void;
}
type OpcionColor = {
  campo: CampoColor;
  nombre: string;
};
const COLORES_POR_SECCION: Record<SeccionEditor, OpcionColor[]> = {
  general: [
    { campo: "color_primario", nombre: "Color principal y botones" },
    { campo: "color_fondo", nombre: "Fondo de la tienda" },
    { campo: "color_texto", nombre: "Texto general" },
  ],
  encabezado: [
    { campo: "color_header", nombre: "Fondo del encabezado" },
    { campo: "color_text_header", nombre: "Texto del encabezado" },
    { campo: "color_border_header", nombre: "Borde del encabezado" },
    { campo: "color_hamburguesa", nombre: "Icono del menú" },
    { campo: "color_lupa", nombre: "Icono de búsqueda" },
  ],
  portada: [],
  destacados: [],
  catalogo: [
    { campo: "color_tarjeta", nombre: "Fondo de las tarjetas" },
    { campo: "color_texto", nombre: "Texto de los productos" },
    { campo: "color_precio", nombre: "Precio de los productos" },
  ],
  categorias: [
    { campo: "color_fondo_categoria", nombre: "Fondo de las categorías" },
    { campo: "color_texto_categoria", nombre: "Texto de las categorías" },
    { campo: "color_border_categoria", nombre: "Borde de las categorías" },
    { campo: "color_categoria", nombre: "Color complementario" },
  ],
  pie: [{ campo: "color_footer", nombre: "Fondo del pie de página" }],
};
const FORMATOS_PRODUCTOS = [
  {
    valor: "lista",
    nombre: "Lista",
    Icono: LayoutList,
  },
  {
    valor: "galeria",
    nombre: "Galería",
    Icono: LayoutGrid,
  },
] as const;
function CampoDeColor({
  nombre,
  valor,
  onChange,
  disabled,
}: {
  nombre: string;
  valor: string;
  onChange: (valor: string) => void;
  disabled: boolean;
}) {
  const id = useId();
  const valido = esColorValido(valor);
  const hex = valor.trim();
  const colorNativo = /^#[\da-f]{6}([\da-f]{2})?$/i.test(hex)
    ? hex.slice(0, 7)
    : /^#[\da-f]{3,4}$/i.test(hex)
      ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
      : "#ffffff";
  const cambiarPaleta = (nuevoColor: string) => {
    if (disabled) return;
    const transparencia = /^#[\da-f]{8}$/i.test(hex)
      ? hex.slice(7)
      : /^#[\da-f]{4}$/i.test(hex)
        ? `${hex[4]}${hex[4]}`
        : "";
    onChange(`${nuevoColor}${transparencia}`);
  };
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-[var(--text-primary)]"
      >
        {nombre}
      </label>
      <div className="flex items-center gap-3 rounded-xl border border-[var(--border-card)] bg-[var(--bg-tertiary)] p-2.5">
        <label
          className={`relative h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-[var(--border-card)] ${
            disabled ? "cursor-not-allowed" : "cursor-pointer"
          }`}
          style={{
            backgroundColor: valido ? valor : "transparent",
          }}
        >
          <span className="sr-only">Elegir color para {nombre}</span>
          <input
            type="color"
            value={colorNativo}
            onChange={(event) => cambiarPaleta(event.target.value)}
            disabled={disabled}
            className="absolute inset-0 h-full w-full cursor-inherit opacity-0"
          />
        </label>
        <input
          id={id}
          type="text"
          value={valor}
          onChange={(event) => {
            if (!disabled) onChange(event.target.value);
          }}
          disabled={disabled}
          spellCheck={false}
          autoComplete="off"
          aria-invalid={!valido}
          aria-describedby={!valido ? `${id}-error` : undefined}
          placeholder="#ffffff"
          className="min-w-0 flex-1 rounded-md bg-transparent px-1 py-1.5 font-mono text-sm text-[var(--text-primary)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>
      {!valido && (
        <p id={`${id}-error`} className="text-xs text-[var(--color-danger)]">
          Introduce un color válido, como #ffffff o rgba(0,0,0,0.1).
        </p>
      )}
    </div>
  );
}
export default function EditorSidebar({
  catalogoId,
  logo,
  onLogoActualizado,
  config,
  categorias,
  plantilla,
  seccionSeleccionada,
  onSeleccionarSeccion,
  onCambiarConfig,
  disabled = false,
  onSubiendoImagenChange,
}: EditorSidebarProps) {
  const seccion = SECCIONES_EDITOR.find(
    (item) => item.id === seccionSeleccionada,
  );
  const cambiarColor = (campo: CampoColor, valor: string) => {
    if (disabled) return;
    onCambiarConfig({
      ...config,
      [campo]: valor,
    });
  };
  return (
    <aside
      aria-label="Configuración del diseño"
      className="flex h-full min-h-0 w-full flex-col overflow-hidden border-r border-[var(--border-card)] bg-[var(--bg-secondary)] text-[var(--text-primary)]"
    >
      {/* Cabecera fija */}
      <div className="shrink-0 border-b border-[var(--border-card)] p-4">
        {seccionSeleccionada ? (
          <button
            type="button"
            disabled={disabled}
            onClick={() => onSeleccionarSeccion(null)}
            className="mb-3 inline-flex min-h-9 items-center gap-1 rounded-lg px-2 text-sm text-[var(--text-secondary)] transition hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <ChevronLeft size={17} aria-hidden="true" />
            Todas las secciones
          </button>
        ) : (
          <Paintbrush
            size={21}
            className="mb-3 text-[var(--color-primary)]"
            aria-hidden="true"
          />
        )}
        <h2 className="text-base font-bold">
          {seccion?.nombre ?? "Personalizar tienda"}
        </h2>
        <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">
          {seccionSeleccionada
            ? "Configura las opciones de esta sección."
            : "Selecciona una sección aquí o directamente en la vista previa."}
        </p>
      </div>
      {/* Solo esta zona se desplaza */}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
        {!seccionSeleccionada ? (
          <nav aria-label="Secciones del diseño" className="space-y-2">
            {SECCIONES_EDITOR.map((item) => (
              <button
                key={item.id}
                type="button"
                disabled={disabled}
                onClick={() => onSeleccionarSeccion(item.id)}
                className="flex min-h-12 w-full items-center justify-between gap-3 rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] px-4 py-3 text-left text-sm font-semibold transition hover:border-[var(--color-primary)] hover:bg-[var(--bg-card-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {item.nombre}
                <ChevronLeft
                  size={16}
                  className="rotate-180 text-[var(--text-secondary)]"
                  aria-hidden="true"
                />
              </button>
            ))}
          </nav>
        ) : seccionSeleccionada === "encabezado" ? (
          <EditorEncabezado
            catalogoId={catalogoId}
            logo={logo}
            onLogoActualizado={onLogoActualizado}
            onSubiendoImagenChange={onSubiendoImagenChange}
            categorias={categorias}
            config={config}
            onCambiarConfig={onCambiarConfig}
            disabled={disabled}
          />
        ) : seccionSeleccionada === "portada" ? (
          <EditorPortada
            catalogoId={catalogoId}
            config={config}
            onCambiarConfig={onCambiarConfig}
            disabled={disabled}
            onSubiendoImagenChange={onSubiendoImagenChange}
          />
        ) : seccionSeleccionada === "destacados" ? (
          <EditorDestacados
            config={config}
            categorias={categorias}
            onCambiarConfig={onCambiarConfig}
            disabled={disabled}
          />
        ) : (
          <div className="space-y-6">
            {seccionSeleccionada === "catalogo" && plantilla === "clasica" && (
              <fieldset disabled={disabled} className="space-y-3">
                <legend className="mb-3 text-sm font-semibold">
                  Formato de los productos
                </legend>
                <div className="grid grid-cols-2 gap-2">
                  {FORMATOS_PRODUCTOS.map(({ valor, nombre, Icono }) => (
                    <button
                      key={valor}
                      type="button"
                      aria-pressed={config.estilo_menu === valor}
                      onClick={() => {
                        if (disabled) return;
                        onCambiarConfig({
                          ...config,
                          estilo_menu: valor,
                        });
                      }}
                      className={`flex min-h-11 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-60 ${
                        config.estilo_menu === valor
                          ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-text-inverse)]"
                          : "border-[var(--border-card)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]"
                      }`}
                    >
                      <Icono size={17} aria-hidden="true" />
                      {nombre}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}
            <div className="space-y-5">
              <h3 className="text-sm font-bold">Colores</h3>
              {COLORES_POR_SECCION[seccionSeleccionada].map(
                ({ campo, nombre }) => (
                  <CampoDeColor
                    key={campo}
                    nombre={nombre}
                    valor={config[campo]}
                    onChange={(valor) => cambiarColor(campo, valor)}
                    disabled={disabled}
                  />
                ),
              )}
            </div>
            {seccionSeleccionada === "general" && (
              <>
                <div className="border-t border-[var(--border-card)] pt-6">
                  <EditorEstilos
                    config={config}
                    grupo="tipografia"
                    onCambiarConfig={onCambiarConfig}
                    disabled={disabled}
                  />
                </div>
                <div className="border-t border-[var(--border-card)] pt-6">
                  <EditorSecciones
                    config={config}
                    onCambiarConfig={onCambiarConfig}
                    disabled={disabled}
                  />
                </div>
                <div className="border-t border-[var(--border-card)] pt-6">
                  <EditorEspaciado
                    config={config}
                    onCambiarConfig={onCambiarConfig}
                    disabled={disabled}
                  />
                </div>
              </>
            )}
            {seccionSeleccionada === "catalogo" && (
              <div className="space-y-6 border-t border-[var(--border-card)] pt-6">
                {plantilla === "moderna" ? (
                  <>
                    <EditorCatalogo
                      config={config}
                      onCambiarConfig={onCambiarConfig}
                      disabled={disabled}
                    />
                    <div className="border-t border-[var(--border-card)] pt-6">
                      <EditorTarjetas
                        config={config}
                        onCambiarConfig={onCambiarConfig}
                        disabled={disabled}
                      />
                    </div>
                  </>
                ) : (
                  <EditorEstilos
                    config={config}
                    grupo="tarjetas"
                    onCambiarConfig={onCambiarConfig}
                    disabled={disabled}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </div>
      {/* Pie fijo */}
      <div className="shrink-0 border-t border-[var(--border-card)] px-4 py-3">
        <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
          La tienda pública cambia cuando publicas el diseño.
        </p>
      </div>
    </aside>
  );
}
