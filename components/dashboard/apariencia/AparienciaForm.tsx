"use client";

import { useId } from "react";
import { Save } from "lucide-react";
import MenuStyleSwitch from "@/components/dashboard/apariencia/MenuStyleSwitch";
import ColorPicker from "./ColorPicker";

interface Props {
  nombre: string;
  setNombre: (v: string) => void;

  colorPrimario: string;
  setColorPrimario: (v: string) => void;

  colorFondo: string;
  setColorFondo: (v: string) => void;

  estiloMenu: "lista" | "galeria";
  setEstiloMenu: (v: "lista" | "galeria") => void;

  colorHeader: string;
  setColorHeader: (v: string) => void;

  colorTextHeader: string;
  setColorTextHeader: (v: string) => void;

  colorBorderHeader: string;
  setColorBorderHeader: (v: string) => void;

  colorFooter: string;
  setColorFooter: (v: string) => void;

  colorTexto: string;
  setColorTexto: (v: string) => void;

  colorPrecio: string;
  setColorPrecio: (v: string) => void;

  colorHamburguesa: string;
  setColorHamburguesa: (v: string) => void;

  colorTarjeta: string;
  setColorTarjeta: (v: string) => void;

  colorLupa: string;
  setColorLupa: (v: string) => void;

  colorFondoCategoria: string;
  setColorFondoCategoria: (v: string) => void;

  colorTextoCategoria: string;
  setColorTextoCategoria: (v: string) => void;

  colorBorderCategoria: string;
  setColorBorderCategoria: (v: string) => void;

  guardar: () => void;
}

const panelClassName =
  "space-y-5 rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-5 shadow-sm sm:p-6";

export default function AparienciaForm({
  nombre,
  setNombre,
  colorPrimario,
  setColorPrimario,
  colorFondo,
  setColorFondo,
  estiloMenu,
  setEstiloMenu,
  colorHeader,
  setColorHeader,
  colorTextHeader,
  setColorTextHeader,
  colorBorderHeader,
  setColorBorderHeader,
  colorFooter,
  setColorFooter,
  colorTexto,
  setColorTexto,
  colorPrecio,
  setColorPrecio,
  colorHamburguesa,
  setColorHamburguesa,
  colorTarjeta,
  setColorTarjeta,
  colorLupa,
  setColorLupa,
  colorFondoCategoria,
  setColorFondoCategoria,
  colorTextoCategoria,
  setColorTextoCategoria,
  colorBorderCategoria,
  setColorBorderCategoria,
  guardar,
}: Props) {
  const id = useId();

  const secciones = [
    {
      clave: "encabezado",
      titulo: "Encabezado",
      descripcion: "Personaliza la parte superior de tu tienda.",
      colores: [
        {
          label: "Fondo del encabezado",
          value: colorHeader,
          onChange: setColorHeader,
        },
        {
          label: "Texto del encabezado",
          value: colorTextHeader,
          onChange: setColorTextHeader,
        },
        {
          label: "Borde inferior del encabezado",
          value: colorBorderHeader,
          onChange: setColorBorderHeader,
        },
        {
          label: "Icono del menú",
          value: colorHamburguesa,
          onChange: setColorHamburguesa,
        },
        {
          label: "Icono de búsqueda",
          value: colorLupa,
          onChange: setColorLupa,
        },
      ],
    },
    {
      clave: "catalogo",
      titulo: "Productos y botones",
      descripcion: "Define los colores del contenido de tu tienda.",
      colores: [
        {
          label: "Fondo de la página",
          value: colorFondo,
          onChange: setColorFondo,
        },
        {
          label: "Color principal de los botones",
          value: colorPrimario,
          onChange: setColorPrimario,
        },
        {
          label: "Fondo de las tarjetas",
          value: colorTarjeta,
          onChange: setColorTarjeta,
        },
        {
          label: "Texto del catálogo",
          value: colorTexto,
          onChange: setColorTexto,
        },
        {
          label: "Precios",
          value: colorPrecio,
          onChange: setColorPrecio,
        },
      ],
    },
    {
      clave: "categorias",
      titulo: "Categorías",
      descripcion: "Personaliza los fondos, textos y bordes de las categorías.",
      colores: [
        {
          label: "Fondo de las categorías",
          value: colorFondoCategoria,
          onChange: setColorFondoCategoria,
        },
        {
          label: "Texto de las categorías",
          value: colorTextoCategoria,
          onChange: setColorTextoCategoria,
        },
        {
          label: "Borde de las categorías",
          value: colorBorderCategoria,
          onChange: setColorBorderCategoria,
        },
      ],
    },
    {
      clave: "pie",
      titulo: "Pie de página",
      descripcion: "Personaliza la parte inferior de tu tienda.",
      colores: [
        {
          label: "Fondo del pie de página",
          value: colorFooter,
          onChange: setColorFooter,
        },
      ],
    },
  ];

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 pb-[calc(6rem+env(safe-area-inset-bottom))] text-[var(--text-primary)] sm:pb-6">
      <section
        aria-labelledby={`${id}-general`}
        className={panelClassName}
      >
        <div className="border-b border-[var(--border-card)] pb-4">
          <h2 id={`${id}-general`} className="text-lg font-bold">
            Configuración general
          </h2>

          <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">
            Configura el nombre y la presentación de tu tienda.
          </p>
        </div>

        <div className="space-y-2">
          <label
            htmlFor={`${id}-nombre`}
            className="block text-sm font-semibold"
          >
            Nombre de la tienda
          </label>

          <input
            id={`${id}-nombre`}
            type="text"
            value={nombre}
            onChange={(event) => setNombre(event.target.value)}
            placeholder="Nombre de tu negocio"
            className="min-h-11 w-full rounded-xl border border-[var(--border-card)] bg-[var(--bg-secondary)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
          />
        </div>

        <div className="flex flex-col gap-4 border-t border-[var(--border-card)] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold">
              Estilo del catálogo
            </h3>

            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Elige cómo se muestran tus productos.
            </p>
          </div>

          <div className="w-full shrink-0 rounded-xl border border-[var(--border-card)] bg-[var(--bg-secondary)] p-1 sm:w-auto">
            <MenuStyleSwitch
              value={estiloMenu}
              onChange={setEstiloMenu}
            />
          </div>
        </div>
      </section>

      {secciones.map((seccion) => (
        <section
          key={seccion.clave}
          aria-labelledby={`${id}-${seccion.clave}`}
          className={panelClassName}
        >
          <div className="border-b border-[var(--border-card)] pb-4">
            <h2
              id={`${id}-${seccion.clave}`}
              className="text-lg font-bold"
            >
              {seccion.titulo}
            </h2>

            <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">
              {seccion.descripcion}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {seccion.colores.map((color) => (
              <ColorPicker
                key={color.label}
                label={color.label}
                value={color.value}
                onChange={color.onChange}
              />
            ))}
          </div>
        </section>
      ))}

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--border-card)] bg-[var(--bg-main)] p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:static sm:border-0 sm:bg-transparent sm:p-0">
        <div className="mx-auto w-full max-w-4xl">
          <button
            type="button"
            onClick={guardar}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-bold text-[var(--color-text-inverse)] transition-colors hover:bg-[var(--color-primary-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
          >
            <Save size={18} aria-hidden="true" />
            Guardar apariencia
          </button>
        </div>
      </div>
    </div>
  );
}