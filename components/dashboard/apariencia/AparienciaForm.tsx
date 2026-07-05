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
  colorCategoria,
  setColorCategoria,
  colorLupa,
  setColorLupa,
  guardar,
}: Props) {
  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto pb-24 sm:pb-6 animate-in fade-in duration-200">
      
      {/* 🟢 CONFIGURACIÓN GENERAL */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-5 sm:p-6 space-y-5 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 rounded-full bg-[var(--color-primary)]" />
          <h3 className="text-xs sm:text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">
            Configuración General
          </h3>
        </div>
        
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[var(--text-secondary)] px-0.5">
            Nombre del menú / catálogo
          </label>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre de tu negocio"
            className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-card)] text-[var(--text-primary)] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] placeholder:text-[var(--text-secondary)]/50 text-sm sm:text-base transition-all"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[var(--border-card)]/40">
          <div>
            <h4 className="text-sm font-bold text-[var(--text-primary)]">Estilo del catálogo</h4>
            <p className="text-xs text-[var(--text-secondary)]">Formato visual para renderizar tus productos</p>
          </div>
          <div className="w-full sm:w-auto bg-[var(--bg-tertiary)] p-1 rounded-xl border border-[var(--border-card)] shrink-0">
            <MenuStyleSwitch value={estiloMenu} onChange={setEstiloMenu} />
          </div>
        </div>
      </div>

      {/* 🔹 SECCIÓN: HEADER */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 border-b border-[var(--border-card)]/40 pb-3">
          <span className="text-sm">✨</span>
          <h3 className="text-xs sm:text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">
            Parte Superior (Header)
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ColorPicker label="Color de fondo header" value={colorHeader} onChange={setColorHeader} />
          <ColorPicker label="Color de texto herder" value={colorTextHeader} onChange={setColorTextHeader} />
          <ColorPicker label="Color borde inferior" value={colorBorderHeader} onChange={setColorBorderHeader} />
          <ColorPicker label="Color icono hamburguesa" value={colorHamburguesa} onChange={setColorHamburguesa} />
          <ColorPicker label="Color lupa búsqueda" value={colorLupa} onChange={setColorLupa} />
        </div>
      </div>

      {/* 🔹 SECCIÓN: MAIN / CUERPO */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 border-b border-[var(--border-card)]/40 pb-3">
          <span className="text-sm">🎨</span>
          <h3 className="text-xs sm:text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">
            Cuerpo del Catálogo (Main)
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ColorPicker label="Color de fondo main" value={colorFondo} onChange={setColorFondo} />
          <ColorPicker label="Color principal (Botones)" value={colorPrimario} onChange={setColorPrimario} />
          <ColorPicker label="Color de fondo tarjetas" value={colorTarjeta} onChange={setColorTarjeta} />
          <ColorPicker label="Color de fondo categorías" value={colorCategoria} onChange={setColorCategoria} />
          <ColorPicker label="Color de texto main" value={colorTexto} onChange={setColorTexto} />
          <ColorPicker label="Color de precios" value={colorPrecio} onChange={setColorPrecio} />
        </div>
      </div>

      {/* 🔹 SECCIÓN: FOOTER */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 border-b border-[var(--border-card)]/40 pb-3">
          <span className="text-sm">🏁</span>
          <h3 className="text-xs sm:text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">
            Parte Inferior (Footer)
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ColorPicker label="Color footer" value={colorFooter} onChange={setColorFooter} />
        </div>
      </div>

      {/* BOTÓN ACCIÓN FIJO EN CELULARES / CONTROL TOTAL */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[var(--bg-page)] via-[var(--bg-page)] to-transparent sm:static sm:p-0 sm:bg-none z-50">
        <button
          onClick={guardar}
          className="w-full bg-[var(--color-primary)] hover:brightness-105 active:scale-[0.99] text-[var(--color-text-inverse)] py-3.5 rounded-xl font-bold transition shadow-lg sm:shadow-md tracking-wide text-sm sm:text-base"
        >
          Guardar Cambios Estéticos
        </button>
      </div>

    </div>
  );
}