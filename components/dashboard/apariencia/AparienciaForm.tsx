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

  colorTextHeader: string;         // 🔥 NUEVO
  setColorTextHeader: (v: string) => void;    // 🔥 NUEVO

  colorBorderHeader: string;       // 🔥 NUEVO
  setColorBorderHeader: (v: string) => void;  // 🔥 NUEVO

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

  colorLupa: string;
  setColorLupa: (v: string) => void;

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
  colorTextHeader,       // 🔥 NUEVO
  setColorTextHeader,    // 🔥 NUEVO
  colorBorderHeader,     // 🔥 NUEVO
  setColorBorderHeader,  // 🔥 NUEVO
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

  colorLupa,
  setColorLupa,

  guardar,
}: Props) {
  return (
    <div className="space-y-4 sm:space-y-6 w-full">
      
      {/* 🟢 CONFIGURACIÓN GENERAL */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-4">
        <h3 className="text-xs sm:text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">
          Configuración General
        </h3>
        
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre del menú"
          className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-card)] text-[var(--text-primary)] rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-[var(--color-primary)] placeholder:text-[var(--text-secondary)] text-sm sm:text-base"
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[var(--border-card)]/50">
          <div>
            <h4 className="text-sm font-bold text-[var(--text-primary)]">Estilo del catálogo</h4>
            <p className="text-xs text-[var(--text-secondary)]">Elige el formato visual para los productos</p>
          </div>
          <div className="self-end sm:self-auto">
            <MenuStyleSwitch value={estiloMenu} onChange={setEstiloMenu} />
          </div>
        </div>
      </div>

      {/* 🔹 SECCIÓN: HEADER */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-4">
        <h3 className="text-xs sm:text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider border-b border-[var(--border-card)]/50 pb-2">
          Parte Superior (Header)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ColorPicker label="Color header" value={colorHeader} onChange={setColorHeader} />
          <ColorPicker label="Color texto de marca" value={colorTextHeader} onChange={setColorTextHeader} />
          <ColorPicker label="Color borde inferior" value={colorBorderHeader} onChange={setColorBorderHeader} />
          <ColorPicker label="Color icono hamburguesa" value={colorHamburguesa} onChange={setColorHamburguesa} />
          <ColorPicker label="Color lupa búsqueda" value={colorLupa} onChange={setColorLupa} />
        </div>
      </div>

      {/* 🔹 SECCIÓN: MAIN / CUERPO */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-4">
        <h3 className="text-xs sm:text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider border-b border-[var(--border-card)]/50 pb-2">
          Cuerpo del Catálogo (Main)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ColorPicker label="Color de fondo global" value={colorFondo} onChange={setColorFondo} />
          <ColorPicker label="Color principal (Botones)" value={colorPrimario} onChange={setColorPrimario} />
          <ColorPicker label="Color de tarjetas" value={colorTarjeta} onChange={setColorTarjeta} />
          <ColorPicker label="Color de categorías" value={colorCategoria} onChange={setColorCategoria} />
          <ColorPicker label="Color de texto base" value={colorTexto} onChange={setColorTexto} />
          <ColorPicker label="Color de precios" value={colorPrecio} onChange={setColorPrecio} />
        </div>
      </div>

      {/* 🔹 SECCIÓN: FOOTER */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-4">
        <h3 className="text-xs sm:text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider border-b border-[var(--border-card)]/50 pb-2">
          Parte Inferior (Footer)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ColorPicker label="Color footer" value={colorFooter} onChange={setColorFooter} />
        </div>
      </div>

      {/* BOTÓN ACCIÓN GLOBAL */}
      <div className="px-1 sm:px-0 pt-2">
        <button
          onClick={guardar}
          className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-text-inverse)] py-3.5 rounded-xl font-semibold transition shadow-md active:scale-[0.99]"
        >
          Guardar Cambios
        </button>
      </div>

    </div>
  );
}