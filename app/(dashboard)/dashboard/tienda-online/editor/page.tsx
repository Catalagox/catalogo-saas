import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import EditorTienda from "@/components/dashboard/editor/EditorTienda";

import {
  VERSION_CONFIG,
  esPlantillaId,
  normalizarConfig,
} from "@/lib/tienda-diseno/config";

import type {
  CategoriaTienda,
  DatosRenderTienda,
  DatosTienda,
  ProductoTienda,
} from "@/lib/tienda-diseno/types";

export const dynamic = "force-dynamic";

type CategoriaRegistro = {
  id: string;
  nombre: string;
};

type ProductoRegistro = {
  id: string;
  nombre: string;
  precio: number;
  descripcion: string | null;
  imagen_url: string | null;
  disponible: boolean | null;
  stock: number | null;
  slug: string | null;
  categoria_id: string | null;
};

export default async function EditorDisenoPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: errorUsuario,
  } = await supabase.auth.getUser();

 if (errorUsuario || !user) {
  redirect("/auth?redirect=%2Fdashboard%2Ftienda-online%2Feditor");
}

  const { data: catalogo, error: errorCatalogo } = await supabase
    .from("catalogos")
    .select(`
      id,
      user_id,
      nombre,
      slug,
      logo,
      pais_code,
      whatsapp,
      mostrar_boton_whatsapp,
      mensaje_whatsapp,
      instagram,
      facebook,
      tiktok,
      youtube
    `)
    .eq("user_id", user.id)
    .maybeSingle();

  if (errorCatalogo) {
    console.error("Error cargando la tienda del editor:", errorCatalogo);
    throw new Error("No pudimos cargar tu tienda.");
  }

 if (!catalogo) {
  redirect("/onboarding?next=%2Fdashboard%2Ftienda-online%2Feditor");
}

  const [
    resultadoBorrador,
    resultadoCategorias,
    resultadoProductos,
  ] = await Promise.all([
    supabase
      .from("tienda_diseno_borrador")
      .select("plantilla, config, version_config, updated_at")
      .eq("catalogo_id", catalogo.id)
      .maybeSingle(),

    supabase
      .from("categorias")
      .select("id, nombre")
      .eq("catalogo_id", catalogo.id)
      .order("created_at", { ascending: true })
      .order("id", { ascending: true }),

    supabase
      .from("productos")
      .select(`
        id,
        nombre,
        precio,
        descripcion,
        imagen_url,
        disponible,
        stock,
        slug,
        categoria_id
      `)
      .eq("catalogo_id", catalogo.id)
      .eq("disponible", true)
      .order("created_at", { ascending: true })
      .order("id", { ascending: true }),
  ]);

  if (resultadoBorrador.error) {
    console.error(
      "Error cargando el borrador:",
      resultadoBorrador.error,
    );
    throw new Error("No pudimos cargar el borrador del diseño.");
  }

  if (resultadoCategorias.error) {
    console.error(
      "Error cargando las categorías:",
      resultadoCategorias.error,
    );
    throw new Error("No pudimos cargar las categorías.");
  }

  if (resultadoProductos.error) {
    console.error(
      "Error cargando los productos:",
      resultadoProductos.error,
    );
    throw new Error("No pudimos cargar los productos.");
  }

  const borrador = resultadoBorrador.data;

  if (!borrador) {
    throw new Error(
      "Tu tienda todavía no tiene un borrador de diseño.",
    );
  }

  if (!esPlantillaId(borrador.plantilla)) {
    throw new Error(
      "La plantilla del borrador no está disponible.",
    );
  }

  if (borrador.version_config !== VERSION_CONFIG) {
    throw new Error(
      "La versión de este diseño no es compatible con el editor.",
    );
  }

  if (
    !borrador.config ||
    typeof borrador.config !== "object" ||
    Array.isArray(borrador.config)
  ) {
    throw new Error(
      "La configuración del borrador no es válida.",
    );
  }

  if (
    typeof borrador.updated_at !== "string" ||
    !Number.isFinite(Date.parse(borrador.updated_at))
  ) {
    throw new Error(
      "No pudimos identificar la versión del borrador.",
    );
  }

  const tienda: DatosTienda = {
    id: catalogo.id,
    user_id: catalogo.user_id,
    nombre: catalogo.nombre,
    slug: catalogo.slug ?? null,
    logo: catalogo.logo ?? null,
    pais_code: catalogo.pais_code ?? "PE",
    whatsapp: catalogo.whatsapp ?? null,
    mostrar_boton_whatsapp: catalogo.mostrar_boton_whatsapp,
    mensaje_whatsapp: catalogo.mensaje_whatsapp ?? null,
    instagram: catalogo.instagram ?? null,
    facebook: catalogo.facebook ?? null,
    tiktok: catalogo.tiktok ?? null,
    youtube: catalogo.youtube ?? null,
  };

  const categoriasRegistro =
    (resultadoCategorias.data ?? []) as CategoriaRegistro[];

  const productosRegistro =
    (resultadoProductos.data ?? []) as ProductoRegistro[];

  const categorias: CategoriaTienda[] =
    categoriasRegistro.map((categoria) => ({
      id: categoria.id,
      nombre: categoria.nombre,
      productos: [],
    }));

  const categoriasPorId = new Map<string, CategoriaTienda>(
    categorias.map((categoria) => [
      categoria.id,
      categoria,
    ]),
  );

  const productosSinCategoria: ProductoTienda[] = [];

  for (const registro of productosRegistro) {
    const producto: ProductoTienda = {
      id: registro.id,
      nombre: registro.nombre,
      precio: Number(registro.precio),
      descripcion: registro.descripcion,
      imagen_url: registro.imagen_url,
      disponible: registro.disponible,
      stock: registro.stock,
      slug: registro.slug?.trim() || `preview-${registro.id}`,
    };

    const categoria = registro.categoria_id
      ? categoriasPorId.get(registro.categoria_id)
      : undefined;

    if (categoria) {
      categoria.productos.push(producto);
    } else {
      productosSinCategoria.push(producto);
    }
  }

  if (productosSinCategoria.length > 0) {
    categorias.push({
      id: "preview-sin-categoria",
      nombre: "Sin categoría",
      productos: productosSinCategoria,
    });
  }

  const datosIniciales: DatosRenderTienda = {
    tienda,
    categorias,
    plantilla: borrador.plantilla,
    config: normalizarConfig(borrador.config),
    rutaBase: tienda.slug
      ? `/${tienda.slug}`
      : "/preview-editor",
  };

  return (
    <div className="h-full min-h-0 w-full overflow-hidden">
      <EditorTienda
        key={tienda.id}
        datosIniciales={datosIniciales}
        borradorUpdatedAt={borrador.updated_at}
      />
    </div>
  );
}