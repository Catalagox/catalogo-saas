"use client";

import Image from "next/image";
import { Dispatch, SetStateAction, useRef } from "react";
import { X, Upload, Save, Camera } from "lucide-react";

type Producto = {
  id: string;
  nombre: string;
  precio: number;
  descripcion?: string;
  categoria_id: string;
  imagen_url?: string;
  disponible: boolean;
};

type Categoria = {
  id: string;
  nombre: string;
};

type Props = {
  producto: Producto;
  categorias: Categoria[];
  previewImage: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setProducto: Dispatch<SetStateAction<Producto | null>>;
  onCancel: () => void;
  onSave: () => void;
};

export default function ProductEditModal({
  producto,
  categorias,
  previewImage,
  onFileChange,
  setProducto,
  onCancel,
  onSave,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (cambios: Partial<Producto>) => {
    setProducto((prev) => (prev ? { ...prev, ...cambios } : null));
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-[var(--bg-overlay)] backdrop-blur-md"
        onClick={onCancel}
      />

      <div className="relative bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
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

        <div className="p-6 overflow-y-auto max-h-[75vh] space-y-6">
          {/* Imagen */}
          <div className="relative group">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative w-full h-52 bg-[var(--bg-tertiary)] rounded-3xl overflow-hidden cursor-pointer border-2 border-dashed border-[var(--border-card)] hover:border-[var(--color-primary)] transition-all"
            >
              {previewImage || producto.imagen_url ? (
                <>
                  <Image
                    src={
                      previewImage || producto.imagen_url || "/placeholder.png"
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

          {/* Formulario */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest ml-1">
                  Nombre
                </label>
                <input
                  className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-card)] rounded-2xl text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all placeholder:text-[var(--text-secondary)]"
                  value={producto.nombre}
                  onChange={(e) => handleChange({ nombre: e.target.value })}
                  placeholder="Ej: Pizza Pepperoni"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest ml-1">
                  Precio
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-primary)] font-bold">
                    $
                  </span>
                  <input
                    type="number"
                    className="w-full pl-10 pr-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-card)] rounded-2xl text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all"
                    value={producto.precio}
                    onChange={(e) =>
                      handleChange({ precio: Number(e.target.value) })
                    }
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest ml-1">
                Categoría
              </label>
              <select
                className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-card)] rounded-2xl text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all appearance-none cursor-pointer"
                value={producto.categoria_id}
                onChange={(e) => handleChange({ categoria_id: e.target.value })}
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

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest ml-1">
                Descripción
              </label>
              <textarea
                className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-card)] rounded-2xl text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all resize-none placeholder:text-[var(--text-secondary)]"
                rows={3}
                value={producto.descripcion || ""}
                onChange={(e) => handleChange({ descripcion: e.target.value })}
                placeholder="Describe tu producto..."
              />
            </div>
          </div>
        </div>

        {/* Footer */}
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
