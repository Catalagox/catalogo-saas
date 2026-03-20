"use client";

import CategoriaSection from "@/components/public/CategoriaSection";

// 🛡️ Interfaces para TypeScript (para que VS Code esté feliz)
interface Producto {
  id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  imagen_url?: string;
  disponible?: boolean;
  slug: string;
}

interface Categoria {
  id: string;
  nombre: string;
  productos: Producto[];
}

interface MenuListaProps {
  categorias: Categoria[];
}

export default function MenuLista({ categorias }: MenuListaProps) {
  
  // 🛡️ Si no hay categorías, mostramos un estado vacío elegante
  if (!categorias || categorias.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
        <p className="text-gray-400 italic text-sm">
          No hay categorías configuradas aún.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-10">
      {categorias.map((categoria) => (
        <div 
          key={categoria.id} 
          className="animate-in fade-in slide-in-from-bottom-4 duration-700"
        >
          <CategoriaSection categoria={categoria} />
        </div>
      ))}
    </div>
  );
}