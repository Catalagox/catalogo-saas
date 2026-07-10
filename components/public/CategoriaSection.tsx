"use client";

import ProductoCard from "@/components/public/ProductoCard";

interface Producto {
  id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  imagen_url?: string;
  slug: string;
}

interface Categoria {
  id: string;
  nombre: string;
  productos: Producto[];
}

interface Props {
  categoria: Categoria;
  countryCode?: string; 
  colorFondoCategoria?: string;  // 👈 Añadir
  colorTextoCategoria?: string;  // 👈 Añadir
  colorBorderCategoria?: string; // 👈 Añadir
}

export default function CategoriaSection({ 
  categoria, 
  countryCode = "PE",
  colorFondoCategoria,  // 👈 Añadir
  colorTextoCategoria,  // 👈 Añadir
  colorBorderCategoria, // 👈 Añadir
}: Props) {

  const productosValidos =
    (categoria.productos ?? []).filter(
      (p) => p && p.id && p.nombre
    );

  if (productosValidos.length === 0) return null;

  return (
    <section className="py-6">

      <div className="grid grid-cols-1 gap-4">
        {productosValidos.map((producto) => (
          <div 
            key={producto.id} 
            id={`prod-${producto.id}`} 
            className="scroll-mt-24"
          >
            <ProductoCard
              producto={producto}
              countryCode={countryCode}
            />
          </div>
        ))}
      </div>

    </section>
  );
}