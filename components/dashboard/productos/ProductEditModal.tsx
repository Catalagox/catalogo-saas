
"use client";

import Image from "next/image";
import {
  Dispatch,
  SetStateAction,
  useRef,
} from "react";
import {
  X,
  Upload,
  Save,
  Camera,
  Package,
} from "lucide-react";
import { countriesRegistry } from "@/lib/Countries";

type Producto = {
  id: string;
  nombre: string;
  precio: number;
  descripcion?: string;
  categoria_id: string;
  imagen_url?: string;
  disponible: boolean;

  // Stock:
  // null = inventario no administrado
  // 0 = agotado
  // > 0 = unidades disponibles
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
  onFileChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  setProducto: Dispatch<
    SetStateAction<Producto | null>
  >;
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
  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const countryData =
    countriesRegistry[
      (paisCode || "PE").toUpperCase()
    ] || countriesRegistry["PE"];

  const handleChange = (
    cambios: Partial<Producto>
  ) => {
    setProducto((prev) =>
      prev ? { ...prev, ...cambios } : null
    );
  };

  // ==================================================
  // STOCK
  // ==================================================

  const handleStockChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;

    // Campo vacío = inventario no administrado
    if (value === "") {
      handleChange({
        stock: null,
      });

      return;
    }

    const numero = Number(value);

    // Evitar valores inválidos o negativos
    if (
      Number.isNaN(numero) ||
      numero < 0
    ) {
      return;
    }

    // Solo permitimos números enteros
    handleChange({
      stock: Math.floor(numero),
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-[var(--bg-overlay)] backdrop-blur-md"
        onClick={onCancel}
      />

      <div className="relative bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="flex items-center justify-between p-6 border-b border-[var(--border-card)] bg-[var(--bg-secondary)]">
          <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
            Editar Producto
          </h2>

          <button
            onClick={onCancel}
            className="p-2 hover:bg-[var(--bg-card-hover)] rounded-full text-[var(--text-secondary)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ==================================================
            CONTENIDO
        ================================================== */}

        <div className="p-6 overflow-y-auto max-h-[75vh] space-y-6">

          {/* ==================================================
              IMAGEN
          ================================================== */}

          <div className="relative group">
            <div
              onClick={() =>
                fileInputRef.current?.click()
              }
              className="relative w-full h-52 bg-[var(--bg-tertiary)] rounded-3xl overflow-hidden cursor-pointer border-2 border-dashed border-[var(--border-card)] hover:border-[var(--color-primary)] transition-all"
            >
              {previewImage ||
              producto.imagen_url ? (
                <>
                  <Image
                    src={
                      previewImage ||
                      producto.imagen_url ||
                      "/placeholder.png"
                    }
                    alt={producto.nombre}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-[var(--text-secondary)]">
                  <Upload className="w-8 h-8 mb-2" />

                  <span className="text-sm font-medium">
                    Subir nueva imagen
                  </span>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onFileChange}
            />
          </div>

          {/* ==================================================
              FORMULARIO
          ================================================== */}

          <div className="space-y-4">

            {/* NOMBRE + PRECIO */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* NOMBRE */}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest ml-1">
                  Nombre
                </label>

                <input
                  className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-card)] rounded-2xl text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all placeholder:text-[var(--text-secondary)]"
                  value={producto.nombre}
                  onChange={(e) =>
                    handleChange({
                      nombre: e.target.value,
                    })
                  }
                  placeholder="Ej: Pizza Pepperoni"
                />
              </div>

              {/* PRECIO */}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest ml-1">
                  Precio
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-primary)] font-bold text-sm">
                    {countryData.symbol}
                  </span>

                  <input
                    type="number"
                    className="w-full pl-12 pr-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-card)] rounded-2xl text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all"
                    value={producto.precio}
                    onChange={(e) =>
                      handleChange({
                        precio: Number(
                          e.target.value
                        ),
                      })
                    }
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* ==================================================
                STOCK
            ================================================== */}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest ml-1">
                Stock disponible
              </label>

              <div className="relative">
                <Package
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-primary)]"
                  size={19}
                />

                <input
                  type="number"
                  min="0"
                  step="1"
                  inputMode="numeric"
                  className="w-full pl-12 pr-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-card)] rounded-2xl text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all"
                  value={
                    producto.stock === null ||
                    producto.stock === undefined
                      ? ""
                      : producto.stock
                  }
                  onChange={handleStockChange}
                  placeholder="Ej: 20"
                />
              </div>

              <p className="text-[11px] leading-relaxed text-[var(--text-secondary)] px-1">
                Deja este campo vacío si no quieres
                administrar el inventario de este
                producto. Coloca <strong>0</strong> para
                marcarlo como agotado.
              </p>

              {/* ESTADO DEL STOCK */}

              {producto.stock !== null &&
                producto.stock !== undefined && (
                  <div
                    className={`mt-2 px-4 py-2.5 rounded-xl text-xs font-bold border ${
                      producto.stock === 0
                        ? "bg-red-500/10 text-red-500 border-red-500/20"
                        : producto.stock <= 5
                        ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    }`}
                  >
                    {producto.stock === 0
                      ? "Producto agotado"
                      : producto.stock <= 5
                      ? `Quedan solo ${producto.stock} unidades`
                      : `${producto.stock} unidades disponibles`}
                  </div>
                )}
            </div>

            {/* CATEGORÍA */}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest ml-1">
                Categoría
              </label>

              <select
                className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-card)] rounded-2xl text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all appearance-none cursor-pointer"
                value={producto.categoria_id}
                onChange={(e) =>
                  handleChange({
                    categoria_id:
                      e.target.value,
                  })
                }
              >
                <option value="" disabled>
                  Selecciona una categoría
                </option>

                {categorias.map((cat) => (
                  <option
                    key={cat.id}
                    value={cat.id}
                    className="bg-[var(--bg-card)]"
                  >
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* DESCRIPCIÓN */}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest ml-1">
                Descripción
              </label>

              <textarea
                className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-card)] rounded-2xl text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all resize-none placeholder:text-[var(--text-secondary)]"
                rows={3}
                value={
                  producto.descripcion || ""
                }
                onChange={(e) =>
                  handleChange({
                    descripcion:
                      e.target.value,
                  })
                }
                placeholder="Describe tu producto..."
              />
            </div>
          </div>
        </div>

        {/* ==================================================
            FOOTER
        ================================================== */}

        <div className="p-6 border-t border-[var(--border-card)] bg-[var(--bg-secondary)] flex flex-col sm:flex-row gap-3">

          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-[var(--bg-tertiary)] hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)] font-semibold rounded-2xl transition-all order-2 sm:order-1"
          >
            Cancelar
          </button>

          <button
            onClick={onSave}
            className="flex-1 px-6 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-text-inverse)] font-bold rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 order-1 sm:order-2"
          >
            <Save className="w-5 h-5" />
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}
