import { NextResponse } from "next/server";
import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";

// Usamos el Service Role para saltar RLS en el servidor de forma segura
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;

    // Validación extra para evitar el error de JWS/Token
    if (!userId || userId === "null" || userId === "undefined") {
      return NextResponse.json({ error: "ID de usuario no válido o sesión expirada" }, { status: 401 });
    }

    if (!file) {
      return NextResponse.json({ error: "No se subió ningún archivo" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Optimización con Sharp
    const optimizedImage = await sharp(buffer)
      .resize(800, 800, { fit: 'inside', withoutEnlargement: true }) // Mantiene proporción
      .jpeg({ quality: 75, progressive: true })
      .toBuffer();

    const fileName = `${crypto.randomUUID()}.jpg`;
    // Es mejor usar una estructura limpia: productos/userId/fileName
    const filePath = `${userId}/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from("productos")
      .upload(filePath, optimizedImage, {
        contentType: "image/jpeg",
        upsert: true // Evita errores si el archivo ya existe
      });

    if (uploadError) {
      console.error("Error de Supabase Storage:", uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data } = supabaseAdmin.storage
      .from("productos")
      .getPublicUrl(filePath);

    return NextResponse.json({ url: data.publicUrl });

  } catch (error: any) {
    console.error("Error crítico en API:", error);
    return NextResponse.json({ error: "Fallo en el servidor al procesar la imagen" }, { status: 500 });
  }
}



/*"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import CreateProductForm from "@/components/dashboard/agregar-producto/CreateProductForm";
import { Loader2, AlertCircle } from "lucide-react";

type Categoria = {
  id: string;
  nombre: string;
};

export default function NuevoProductoPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [catalogoId, setCatalogoId] = useState<string | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    iniciar();
  }, []);

  const iniciar = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      setUserId(user.id);

      // Cargar catalogo
      const { data: catalogo, error: catalogoError } = await supabase
        .from("catalogos")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (catalogoError) throw catalogoError;
      setCatalogoId(catalogo.id);

      // Cargar categorias
      const { data: categoriasData, error: categoriasError } = await supabase
        .from("categorias")
        .select("id, nombre")
        .eq("user_id", user.id)
        .order("nombre");

      if (categoriasError) throw categoriasError;
      setCategorias(categoriasData || []);

    } catch (error) {
      console.error("Error al iniciar:", error);
    } finally {
      setLoading(false);
    }
  };

  // 1. Estado de carga profesional
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="text-gray-400 font-medium animate-pulse">Sincronizando catálogo...</p>
      </div>
    );
  }

  // 2. Estado si no hay catálogo
  if (!catalogoId) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 text-center bg-gray-900 border border-gray-800 rounded-3xl">
        <div className="bg-amber-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-amber-500" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Falta configuración</h2>
        <p className="text-gray-400 mb-6">
          Para agregar productos, primero debes configurar la información básica de tu menú.
        </p>
        <button className="text-indigo-400 font-semibold hover:underline">
          Ir a configuración del catálogo →
        </button>
      </div>
    );
  }

  return (
    // 3. Contenedor optimizado
    <div className="w-full min-h-screen pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        
        <header className="py-8 md:py-12 border-b border-gray-800/50 mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <nav className="flex items-center gap-2 text-xs font-bold text-indigo-500 uppercase tracking-widest mb-3">
                <span>Panel</span>
                <span className="text-gray-700">/</span>
                <span className="text-gray-400">Productos</span>
              </nav>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Agregar Producto
              </h1>
              <p className="text-gray-400 mt-2 text-sm md:text-base max-w-lg">
                Personaliza los detalles de tu nuevo plato o servicio. Se actualizará en tiempo real en tu código QR.
              </p>
            </div>
          </div>
        </header>

        
        <div className="relative">
          
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/5 blur-[100px] pointer-events-none" />
          
          <CreateProductForm
            userId={userId}
            catalogoId={catalogoId}
            categorias={categorias}
            onCreated={() => {
              // Aquí podrías redirigir o mostrar un toast
              console.log("Producto creado");
            }}
          />
        </div>

      </div>
    </div>
  );
}*/