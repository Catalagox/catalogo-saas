"use client";

import Image from "next/image";
import {
  useId,
  useRef,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from "react";
import { X, Upload, Save, Camera, Package } from "lucide-react";
import { countriesRegistry, isCountryCode } from "@/lib/countries";

type Producto = {
  id: string;
  nombre: string;
  precio: number;
  descripcion?: string;
  categoria_id: string;
  imagen_url?: string;
  disponible: boolean;
  stock?: number | null;
};

type Categoria = {
  id: string;
  nombre: string;
};

type Props = {
  producto: Producto;
  categorias: Categoria[];
  paisCode: string;
  previewImage: string | null;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  setProducto: Dispatch<SetStateAction<Producto | null>>;
  onCancel: () => void;
  onSave: () => void;
};

export default function ProductEditModal({
  producto,
  categorias,
  paisCode,
  previewImage,
  setProducto,
  onFileChange,
  onCancel,
  onSave,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const id = useId();

  const normalizedCountryCode = (paisCode || "PE").toUpperCase();

  const countryData = isCountryCode(normalizedCountryCode)
    ? countriesRegistry[normalizedCountryCode]
    : countriesRegistry.PE;

  const imagen = previewImage || producto.imagen_url;
  const stock = producto.stock;
  const tieneStock = stock !== null && stock !== undefined;

  const inputClass =
    "w-full rounded-2xl border border-[var(--border-card)] bg-[var(--bg-tertiary)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]";

  const labelClass =
    "ml-1 text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]";

  const focusClass =
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]";

  const handleChange = (cambios: Partial<Producto>) => {
    setProducto((prev) => (prev ? { ...prev, ...cambios } : null));
  };

  const handleStockChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Vacío = inventario no administrado.
    if (value === "") {
      handleChange({ stock: null });
      return;
    }

    const numero = Number(value);

    if (!Number.isFinite(numero) || numero < 0) return;

    handleChange({ stock: Math.floor(numero) });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Fondo del modal */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[var(--bg-overlay)] backdrop-blur-md"
        onClick={onCancel}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-titulo`}
        className="relative flex max-h-[90dvh] w-full max-w-lg flex-col overflow-hidden rounded-[2rem] border border-[var(--border-card)] bg-[var(--bg-card)] text-[var(--text-primary)] shadow-2xl animate-in fade-in zoom-in duration-300 sm:rounded-[2.5rem]"
      >
        {/* Encabezado */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[var(--border-card)] bg-[var(--bg-secondary)] p-5 sm:p-6">
          <h2
            id={`${id}-titulo`}
            className="text-xl font-bold tracking-tight text-[var(--text-primary)]"
          >
            Editar producto
          </h2>

          <button
            type="button"
            onClick={onCancel}
            aria-label="Cerrar edición"
            className={`rounded-full p-2 text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)] ${focusClass}`}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Contenido desplazable */}
        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain p-5 sm:p-6">
          {/* Imagen */}
          <div className="relative">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              aria-label={
                imagen ? "Cambiar imagen del producto" : "Subir imagen del producto"
              }
              className={`group relative h-52 w-full overflow-hidden rounded-3xl border-2 border-dashed border-[var(--border-card)] bg-[var(--bg-tertiary)] transition-colors hover:border-[var(--color-primary)] ${focusClass}`}
            >
              {imagen ? (
                <>
                  <Image
                    src={imagen}
                    alt={producto.nombre}
                    fill
                    sizes="(max-width: 640px) 100vw, 464px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                    <div className="rounded-2xl border border-white/20 bg-white/10 p-3 backdrop-blur-md">
                      <Camera
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-[var(--text-secondary)]">
                  <Upload className="mb-2 h-8 w-8" aria-hidden="true" />

                  <span className="text-sm font-medium">
                    Subir nueva imagen
                  </span>
                </div>
              )}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onFileChange}
              aria-label="Seleccionar imagen del producto"
            />
          </div>

          {/* Campos */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Nombre */}
              <div className="space-y-1.5">
                <label htmlFor={`${id}-nombre`} className={labelClass}>
                  Nombre
                </label>

                <input
                  id={`${id}-nombre`}
                  className={inputClass}
                  value={producto.nombre}
                  onChange={(e) => handleChange({ nombre: e.target.value })}
                  placeholder="Ej: Pizza Pepperoni"
                />
              </div>

              {/* Precio */}
              <div className="space-y-1.5">
                <label htmlFor={`${id}-precio`} className={labelClass}>
                  Precio
                </label>

                <div className="flex items-center gap-2 rounded-2xl border border-[var(--border-card)] bg-[var(--bg-tertiary)] px-4 focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary)]">
                  <span className="shrink-0 text-sm font-bold text-[var(--text-secondary)]">
                    {countryData.symbol}
                  </span>

                  <input
                    id={`${id}-precio`}
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="any"
                    className="min-w-0 flex-1 bg-transparent py-3 text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
                    value={producto.precio}
                    onChange={(e) =>
                      handleChange({ precio: Number(e.target.value) })
                    }
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Stock */}
            <div className="space-y-1.5">
              <label htmlFor={`${id}-stock`} className={labelClass}>
                Stock disponible
              </label>

              <div className="relative">
                <Package
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
                  size={19}
                  aria-hidden="true"
                />

                <input
                  id={`${id}-stock`}
                  type="number"
                  min="0"
                  step="1"
                  inputMode="numeric"
                  className={`${inputClass} pl-12`}
                  value={stock ?? ""}
                  onChange={handleStockChange}
                  placeholder="Ej: 20"
                  aria-describedby={`${id}-stock-ayuda`}
                />
              </div>

              <p
                id={`${id}-stock-ayuda`}
                className="px-1 text-[11px] leading-relaxed text-[var(--text-secondary)]"
              >
                Deja este campo vacío si no quieres administrar el inventario
                de este producto. Coloca <strong>0</strong> para marcarlo
                como agotado.
              </p>

              {tieneStock && (
                <div
                  className={`mt-2 rounded-xl border px-4 py-2.5 text-xs font-bold text-[var(--text-primary)] ${
                    stock === 0
                      ? "border-red-500/30 bg-red-500/10"
                      : stock <= 5
                        ? "border-amber-500/30 bg-amber-500/10"
                        : "border-emerald-500/30 bg-emerald-500/10"
                  }`}
                >
                  {stock === 0
                    ? "Producto agotado"
                    : stock <= 5
                      ? `Quedan solo ${stock} unidades`
                      : `${stock} unidades disponibles`}
                </div>
              )}
            </div>

            {/* Categoría */}
            <div className="space-y-1.5">
              <label htmlFor={`${id}-categoria`} className={labelClass}>
                Categoría
              </label>

              <select
                id={`${id}-categoria`}
                className={`${inputClass} cursor-pointer`}
                value={producto.categoria_id}
                onChange={(e) =>
                  handleChange({ categoria_id: e.target.value })
                }
              >
                <option value="" disabled>
                  Selecciona una categoría
                </option>

                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Descripción */}
            <div className="space-y-1.5">
              <label htmlFor={`${id}-descripcion`} className={labelClass}>
                Descripción
              </label>

              <textarea
                id={`${id}-descripcion`}
                className={`${inputClass} resize-none`}
                rows={3}
                value={producto.descripcion || ""}
                onChange={(e) =>
                  handleChange({ descripcion: e.target.value })
                }
                placeholder="Describe tu producto..."
              />
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex shrink-0 flex-col gap-3 border-t border-[var(--border-card)] bg-[var(--bg-secondary)] p-5 sm:flex-row sm:p-6">
          <button
            type="button"
            onClick={onCancel}
            className={`order-2 flex-1 rounded-2xl bg-[var(--bg-tertiary)] px-6 py-3 font-semibold text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)] sm:order-1 ${focusClass}`}
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onSave}
            className={`order-1 flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[var(--color-primary)] px-6 py-3 font-bold text-[var(--color-text-inverse)] shadow-sm transition-colors hover:bg-[var(--color-primary-hover)] sm:order-2 ${focusClass}`}
          >
            <Save className="h-5 w-5" aria-hidden="true" />
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}