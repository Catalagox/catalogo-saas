import { headers } from "next/headers";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { createClient } from "@/lib/supabase/server";
import { obtenerDisenoPublicado } from "@/lib/tienda-diseno/server";
import type { CategoriaTienda } from "@/lib/tienda-diseno/types";

import TiendaLayout from "@/components/public/TiendaLayout";
import TiendaLista from "@/components/public/TiendaLista";
import TiendaGaleria from "@/components/public/TiendaGaleria";

interface PageProps {
  params: Promise<{
    slug: string;
    categoriaId: string;
  }>;
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

function limpiarHost(valor: string | null): string {
  if (!valor) return "";

  return valor
    .split(",")[0]
    .trim()
    .toLowerCase()
    .split(":")[0]
    .replace(/\.$/, "");
}

function esDominioDeCatalagox(host: string): boolean {
  return (
    !host ||
    host === "catalagox.com" ||
    host === "www.catalagox.com" ||
    host === "localhost" ||
    host === "127.0.0.1" ||
    host.endsWith(".vercel.app")
  );
}

function obtenerLogoUrl(logoPath?: string | null): string {
  if (!logoPath) {
    return "https://catalagox.com/default-share-image.png";
  }

  if (logoPath.startsWith("http://") || logoPath.startsWith("https://")) {
    return logoPath;
  }

  return (
    "https://yhlqooguctlzorinsxde.supabase.co/storage/v1/object/public/logos/" +
    encodeURIComponent(logoPath)
  );
}

async function obtenerHostActual(): Promise<string> {
  const headersList = await headers();

  return limpiarHost(
    headersList.get("x-forwarded-host") ?? headersList.get("host"),
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug, categoriaId } = await params;
  const supabase = await createClient();

  const { data: catalogo } = await supabase
    .from("catalogos")
    .select("id, nombre, slug")
    .eq("slug", slug)
    .maybeSingle();

  if (!catalogo) {
    return {
      title: "Categoría no encontrada",
      robots: { index: false, follow: false },
    };
  }

  const { data: categoria } = await supabase
    .from("categorias")
    .select("nombre")
    .eq("id", categoriaId)
    .eq("catalogo_id", catalogo.id)
    .maybeSingle();

  if (!categoria) {
    return {
      title: "Categoría no encontrada",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${categoria.nombre} | ${catalogo.nombre}`,
    description: `Descubre los productos de ${categoria.nombre} en ${catalogo.nombre}.`,
  };
}

export default async function CategoriaPage({ params }: PageProps) {
  const [{ slug, categoriaId }, host] = await Promise.all([
    params,
    obtenerHostActual(),
  ]);

  if (!slug || !categoriaId) {
    notFound();
  }

  const supabase = await createClient();

  // 1. Cargar la tienda.
  const { data: catalogoDB, error: errorCatalogo } = await supabase
    .from("catalogos")
    .select(
      `
        id,
        nombre,
        logo,
        user_id,
        estilo_menu,
        slug,
        color_primario,
        color_fondo,
        color_header,
        color_text_header,
        color_border_header,
        color_footer,
        color_texto,
        color_precio,
        color_hamburguesa,
        color_tarjeta,
        color_categoria,
        color_lupa,
        color_fondo_categoria,
        color_texto_categoria,
        color_border_categoria,
        whatsapp,
        instagram,
        facebook,
        tiktok,
        youtube,
        plan_vence_el,
        suscripcion_activa,
        subscription_status,
        pais_code
      `,
    )
    .eq("slug", slug)
    .maybeSingle();

  if (errorCatalogo || !catalogoDB) {
    notFound();
  }

  // 2. Mantener la validación de acceso de Catalagox.
  const { data: accesoGratis, error: errorAcceso } = await supabase.rpc(
    "catalogo_con_acceso_gratis",
    {
      p_catalogo_id: catalogoDB.id,
    },
  );

  if (errorAcceso) {
    console.error("Error comprobando el acceso de la tienda:", errorAcceso);
    notFound();
  }

  const fechaVencimiento = catalogoDB.plan_vence_el
    ? new Date(catalogoDB.plan_vence_el)
    : null;

  const vencida =
    !fechaVencimiento ||
    Number.isNaN(fechaVencimiento.getTime()) ||
    fechaVencimiento.getTime() < Date.now();

  const suscripcionPermitida =
    catalogoDB.subscription_status === "active" ||
    catalogoDB.subscription_status === "trialing" ||
    catalogoDB.subscription_status === "trial";

  const accesoPorSuscripcion =
    catalogoDB.suscripcion_activa && suscripcionPermitida && !vencida;

  if (!accesoPorSuscripcion && accesoGratis !== true) {
    notFound();
  }

  // 3. Obtener el diseño publicado y las categorías.
  const [diseno, { data: categoriasDB, error: errorCategorias }] =
    await Promise.all([
      obtenerDisenoPublicado(catalogoDB.id, catalogoDB),

      supabase
        .from("categorias")
        .select(
          `
    id,
    nombre,
    productos (
      id,
      nombre,
      descripcion,
      precio,
      imagen_url,
      disponible,
      stock,
      slug
    )
  `,
        )
        .eq("catalogo_id", catalogoDB.id),
    ]);

  if (errorCategorias || !categoriasDB) {
    console.error("Error cargando las categorías:", {
      message: errorCategorias?.message,
      code: errorCategorias?.code,
      details: errorCategorias?.details,
      hint: errorCategorias?.hint,
    });

    notFound();
  }

  const categorias = categoriasDB as unknown as CategoriaTienda[];

  // 4. Encontrar la categoría solicitada.
  const categoriaEncontrada = categorias.find(
    (categoria) => categoria.id === categoriaId,
  );

  if (!categoriaEncontrada) {
    notFound();
  }

  // Mostrar únicamente los productos válidos de esa categoría.
  const categoriaSeleccionada: CategoriaTienda = {
    ...categoriaEncontrada,
    productos: (categoriaEncontrada.productos ?? []).filter(
      (producto) =>
        producto &&
        producto.disponible !== false &&
        Boolean(producto.id) &&
        Boolean(producto.nombre?.trim()) &&
        Boolean(producto.slug?.trim()) &&
        Number.isFinite(producto.precio) &&
        producto.precio >= 0,
    ),
  };

  const categoriasVisibles = [categoriaSeleccionada];

  // 5. Preparar el diseño y las rutas.
  const catalogo = {
    ...catalogoDB,
    ...diseno.config,
    pais_code: catalogoDB.pais_code ?? "PE",
    logo: obtenerLogoUrl(catalogoDB.logo),
  };

  const slugTienda = catalogo.slug || slug;

  const rutaBase = esDominioDeCatalagox(host) ? `/${slugTienda}` : "";

  const propsProductos = {
    categorias: categoriasVisibles,
    countryCode: catalogo.pais_code,
    rutaBase,
    colorFondoCategoria: diseno.config.color_fondo_categoria,
    colorTextoCategoria: diseno.config.color_texto_categoria,
    colorBorderCategoria: diseno.config.color_border_categoria,
  };

  // 6. Renderizar la categoría dentro del diseño compartido.
  return (
    <div
      className="relative min-h-screen w-full transition-colors duration-300"
      style={{
        backgroundColor: catalogo.color_fondo,
      }}
    >
      <TiendaLayout
        key={catalogo.id}
        catalogo={catalogo}
        categorias={categorias}
        rutaBase={rutaBase}
        config={diseno.config}
      >
        <main
          className="mx-auto min-h-[50vh] w-full min-w-0 flex-grow px-0 pb-12 sm:px-6 lg:px-8"
          style={{
            maxWidth: `${diseno.config.espaciado?.ancho_contenido ?? 1200}px`,
            paddingTop: `${diseno.config.espaciado?.separacion_secciones ?? 24}px`,
          }}
        >
          <div className="mb-4 px-4 sm:px-0">
            <a
              href={rutaBase || "/"}
              className="inline-flex items-center gap-2 text-sm opacity-70 transition hover:opacity-100"
            >
              <span aria-hidden="true">←</span>
              Volver a la tienda
            </a>
          </div>

          {diseno.config.estilo_menu === "galeria" ? (
            <TiendaGaleria {...propsProductos} />
          ) : (
            <TiendaLista {...propsProductos} />
          )}
        </main>
      </TiendaLayout>
    </div>
  );
}
