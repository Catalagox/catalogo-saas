"use client";

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

  colorCategoria: string;
  setColorCategoria: (v: string) => void;

  guardar: () => void;
}

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
  colorCategoria,
  setColorCategoria,

  guardar,
}: Props) {
  return (
    <div className="space-y-6">
      {/* SWITCH */}
      <div className="flex items-center justify-between bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl p-4">
        <div>
          <p className="text-sm text-[var(--text-secondary)]">
            Estilo del menú
          </p>
          <h2 className="text-lg font-bold text-[var(--text-primary)]">
            Visualización
          </h2>
        </div>

        <MenuStyleSwitch value={estiloMenu} onChange={setEstiloMenu} />
      </div>

      {/* FORM */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-6 space-y-6">
        {/* NOMBRE */}
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre del menú"
          className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-card)] text-[var(--text-primary)] rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-[var(--color-primary)] placeholder:text-[var(--text-secondary)]"
        />

        {/* 🎨 COLORES */}
        <ColorPicker
          label="Color principal"
          value={colorPrimario}
          onChange={setColorPrimario}
        />

        <ColorPicker
          label="Color fondo"
          value={colorFondo}
          onChange={setColorFondo}
        />

        <ColorPicker
          label="Color header"
          value={colorHeader}
          onChange={setColorHeader}
        />

        <ColorPicker
          label="Color icono hamburguesa"
          value={colorHamburguesa}
          onChange={setColorHamburguesa}
        />

        <ColorPicker
          label="Color tarjetas"
          value={colorTarjeta}
          onChange={setColorTarjeta}
        />

        <ColorPicker
          label="Color categorías"
          value={colorCategoria}
          onChange={setColorCategoria}
        />

        <ColorPicker
          label="Color texto"
          value={colorTexto}
          onChange={setColorTexto}
        />

        <ColorPicker
          label="Color precio"
          value={colorPrecio}
          onChange={setColorPrecio}
        />

        <ColorPicker
          label="Color footer"
          value={colorFooter}
          onChange={setColorFooter}
        />

        {/* BOTÓN */}
        <button
          onClick={guardar}
          className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-text-inverse)] py-3 rounded-lg font-semibold transition"
        >
          Guardar
        </button>
      </div>
    </div>
  );
}
