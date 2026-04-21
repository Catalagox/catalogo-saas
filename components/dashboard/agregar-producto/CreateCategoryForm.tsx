"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import ButtonPrimary from "@/components/dashboard/agregar-producto/ButtonPrimary";

type Props = {
  userId: string | null;
  catalogoId: string | null;
  onCreated: () => void;
};

export default function CreateCategoryForm({
  userId,
  catalogoId,
  onCreated,
}: Props) {
  const [nombre, setNombre] = useState("");
  const [loading, setLoading] = useState(false);

  const crearCategoria = async () => {
    if (!nombre.trim()) {
      alert("Escribe un nombre para la categoría");
      return;
    }

    if (!userId || !catalogoId) {
      alert("Error: no se encontró el catálogo.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.from("categorias").insert([
        {
          nombre: nombre.trim(),
          user_id: userId,
          catalogo_id: catalogoId,
        },
      ]);

      if (error) {
        console.error("Error creando categoría:", error);
        alert("No se pudo crear la categoría");
        return;
      }

      setNombre("");
      onCreated();
    } catch (err) {
      console.error("Error inesperado:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-card)] p-6 rounded-xl mb-10">
      <h2 className="text-xl mb-4 font-semibold text-[var(--text-primary)]">
        Nueva Categoría
      </h2>

      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Ej: Bebidas, Hamburguesas, Postres"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="flex-1 px-4 py-2 rounded bg-[var(--bg-tertiary)] border border-[var(--border-card)] text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--color-primary)] placeholder:text-[var(--text-secondary)]"
        />

        <ButtonPrimary onClick={crearCategoria} disabled={loading}>
          {loading ? "Creando..." : "Crear Categoría"}
        </ButtonPrimary>
      </div>
    </div>
  );
}
