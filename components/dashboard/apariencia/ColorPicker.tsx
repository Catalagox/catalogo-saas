"use client";

interface Props {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

export default function ColorPicker({ label, value, onChange }: Props) {
  // El input type="color" nativo es estricto: REQUIERE 7 caracteres (#RRGGBB) y falla si recibe 9 (#RRGGBBAA).
  // Limpiamos el valor para la paleta visual si es que viene con transparencia.
  const safeColorForNativePicker = value?.length === 9 
    ? value.substring(0, 7) 
    : (value || "#ffffff");

  return (
    <div className="flex flex-col gap-2 bg-[var(--bg-tertiary)] border border-[var(--border-card)] rounded-xl p-3.5 transition-all hover:border-[var(--text-secondary)]/40 group">
      
      {/* Etiqueta superior fija */}
      <label className="text-xs font-semibold text-[var(--text-secondary)] tracking-wide uppercase">
        {label}
      </label>

      <div className="flex items-center justify-between gap-3 pt-1">
        
        {/* Zona Izquierda: Inputs Sincronizados */}
        <div className="flex items-center gap-2.5 flex-1">
          
          {/* Contenedor del Input Nativo Invisible para usar el Círculo de Preview */}
          <div 
            className="relative w-7 h-7 rounded-full border border-[var(--border-card)] shadow-sm cursor-pointer overflow-hidden transition-transform active:scale-95 shrink-0"
            style={{ backgroundColor: value }} // Muestra el color REAL (incluso con transparencia)
          >
            <input
              type="color"
              value={safeColorForNativePicker}
              onChange={(e) => onChange(e.target.value)}
              className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 opacity-0 cursor-pointer"
            />
          </div>

          {/* Input Manual de Texto Hexadecimal */}
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#FFFFFF"
            maxLength={9} // Permite códigos estándar (#ffffff) y con transparencia (#ffffff10)
            className="w-full bg-transparent text-[var(--text-primary)] font-mono text-sm uppercase tracking-wider outline-none focus:text-[var(--color-primary)] transition-colors"
          />
        </div>

        {/* Zona Derecha: Indicador sutil de edición */}
        <span className="text-[10px] text-[var(--text-secondary)]/40 font-mono group-hover:text-[var(--text-secondary)]/70 transition-colors hidden sm:inline">
          HEX
        </span>

      </div>
    </div>
  );
}