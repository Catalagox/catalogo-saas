import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, ExternalLink, Paintbrush, Store } from "lucide-react";

import SelectorPlantillas from "@/components/dashboard/tienda-online/SelectorPlantillas";
import VistaPreviaTienda from "@/components/dashboard/tienda-online/VistaPreviaTienda";

import { createClient } from "@/lib/supabase/server";

import { PLANTILLAS, obtenerPlantilla } from "@/lib/tienda-diseno/plantillas";

import {
  VERSION_CONFIG,
  esPlantillaId,
  normalizarConfig,
} from "@/lib/tienda-diseno/config";

import type {
  CategoriaTienda,
  ConfigDiseno,
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

function firmaConfig(config: ConfigDiseno): string {
  return JSON.stringify(
    Object.entries(config).sort(([a], [b]) => a.localeCompare(b)),
  );
}

function esObjeto(valor: unknown): valor is Record<string, unknown> {
  return valor !== null && typeof valor === "object" && !Array.isArray(valor);
}

export default async function TiendaOnlinePage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: errorUsuario,
  } = await supabase.auth.getUser();

  if (errorUsuario || !user) {
    redirect("/auth?redirect=%2Fdashboard%2Ftienda-online");
  }

  const { data: catalogo, error: errorTienda } = await supabase
    .from("catalogos")
    .select(
      `
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
    `,
    )
    .eq("user_id", user.id)
    .maybeSingle();

  if (errorTienda) {
    console.error("Error cargando Tienda online:", errorTienda);
    throw new Error("No pudimos cargar tu tienda.");
  }

  if (!catalogo) {
    redirect("/onboarding?next=%2Fdashboard%2Ftienda-online");
  }

  const [
    resultadoPublicado,
    resultadoBorrador,
    resultadoCategorias,
    resultadoProductos,
  ] = await Promise.all([
    supabase
      .from("tienda_diseno")
      .select("plantilla, config, version_config")
      .eq("catalogo_id", catalogo.id)
      .maybeSingle(),

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
      .select(
        `
        id,
        nombre,
        precio,
        descripcion,
        imagen_url,
        disponible,
        stock,
        slug,
        categoria_id
      `,
      )
      .eq("catalogo_id", catalogo.id)
      .eq("disponible", true)
      .order("created_at", { ascending: true })
      .order("id", { ascending: true }),
  ]);

  if (resultadoPublicado.error || resultadoBorrador.error) {
    console.error(
      "Error cargando los diseños:",
      resultadoPublicado.error ?? resultadoBorrador.error,
    );

    throw new Error("No pudimos cargar los diseños de tu tienda.");
  }

  if (resultadoCategorias.error) {
    console.error("Error cargando las categorías:", resultadoCategorias.error);

    throw new Error("No pudimos cargar las categorías.");
  }

  if (resultadoProductos.error) {
    console.error("Error cargando los productos:", resultadoProductos.error);

    throw new Error("No pudimos cargar los productos.");
  }

  const publicado = resultadoPublicado.data;
  const borrador = resultadoBorrador.data;

  if (!publicado || !borrador) {
    throw new Error("No encontramos los diseños de tu tienda.");
  }

  if (
    !esPlantillaId(publicado.plantilla) ||
    !esPlantillaId(borrador.plantilla) ||
    publicado.version_config !== VERSION_CONFIG ||
    borrador.version_config !== VERSION_CONFIG
  ) {
    throw new Error("Uno de los diseños no es compatible con esta versión.");
  }

  if (!esObjeto(publicado.config) || !esObjeto(borrador.config)) {
    throw new Error("La configuración de uno de los diseños no es válida.");
  }

  if (
    typeof borrador.updated_at !== "string" ||
    !Number.isFinite(Date.parse(borrador.updated_at))
  ) {
    throw new Error("No pudimos identificar la versión del borrador.");
  }

  const temaPublicado = obtenerPlantilla(publicado.plantilla);
  const temaBorrador = obtenerPlantilla(borrador.plantilla);

  const configPublicada = normalizarConfig(
    publicado.config,
    temaPublicado.configInicial,
  );

  const configBorrador = normalizarConfig(
    borrador.config,
    temaBorrador.configInicial,
  );

  const hayCambiosPendientes =
    publicado.plantilla !== borrador.plantilla ||
    firmaConfig(configPublicada) !== firmaConfig(configBorrador);

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

  const categoriasRegistro = (resultadoCategorias.data ??
    []) as CategoriaRegistro[];

  const productosRegistro = (resultadoProductos.data ??
    []) as ProductoRegistro[];

  const categorias: CategoriaTienda[] = categoriasRegistro.map((categoria) => ({
    id: categoria.id,
    nombre: categoria.nombre,
    productos: [],
  }));

  const categoriasPorId = new Map<string, CategoriaTienda>(
    categorias.map((categoria) => [categoria.id, categoria]),
  );

  const productosSinCategoria: ProductoTienda[] = [];

  for (const registro of productosRegistro) {
    const precio = Number(registro.precio);

    if (!registro.nombre?.trim() || !Number.isFinite(precio) || precio < 0) {
      continue;
    }

    const producto: ProductoTienda = {
      id: registro.id,
      nombre: registro.nombre,
      precio,
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

  const rutaEditor = "/dashboard/tienda-online/editor";
  const slug = tienda.slug?.trim();

  const rutaTienda = slug ? `/${encodeURIComponent(slug)}` : null;

  // La vista superior muestra el borrador que abrirá el editor.
  const datosPreview: DatosRenderTienda = {
    tienda,
    categorias,
    plantilla: borrador.plantilla,
    config: configBorrador,
    rutaBase: rutaTienda ?? "/preview-editor",
  };

  const claseBoton =
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]";

  return (
    <div className="min-w-0 space-y-8">
      <header className="flex flex-col gap-4 border-b border-[var(--border-card)] pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            <Store size={16} aria-hidden="true" />
            Canal de venta
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)] md:text-3xl">
            Tienda online
          </h1>

          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Administra el diseño de {tienda.nombre}.
          </p>
        </div>

        {rutaTienda && (
          <a
            href={rutaTienda}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Ver tienda publicada, se abre en una pestaña nueva"
            className={`${claseBoton} shrink-0 border border-[var(--border-card)] bg-[var(--bg-card)] text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]`}
          >
            Ver tienda publicada
            <ExternalLink size={16} aria-hidden="true" />
          </a>
        )}
      </header>

      {/* Vista principal de la tienda */}
      <section
        aria-label="Diseño de tu tienda"
        className="mx-auto w-full max-w-6xl overflow-hidden rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] shadow-sm"
      >
        <VistaPreviaTienda
          key={`${tienda.id}-${borrador.updated_at}`}
          datos={datosPreview}
        />

        <div className="flex flex-col gap-4 border-t border-[var(--border-card)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="min-w-0">
            <h2 className="truncate text-base font-bold text-[var(--text-primary)]">
              {tienda.nombre}
            </h2>

            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--text-secondary)]">
              <span>{temaBorrador.nombre}</span>

              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2
                  size={14}
                  aria-hidden="true"
                  className="text-[var(--color-primary)]"
                />

                {hayCambiosPendientes
                  ? "Borrador pendiente de publicar"
                  : "Diseño publicado"}
              </span>
            </div>
          </div>

          <Link
            href={rutaEditor}
            className={`${claseBoton} shrink-0 bg-[var(--color-primary)] text-[var(--color-text-inverse)] hover:bg-[var(--color-primary-hover)]`}
          >
            <Paintbrush size={17} aria-hidden="true" />
            Editar tienda
          </Link>
        </div>
      </section>

      {/* Tarjetas: las actualizaremos en el siguiente paso */}
      <section aria-labelledby="plantillas-titulo">
        <h2
          id="plantillas-titulo"
          className="text-xl font-bold text-[var(--text-primary)]"
        >
          Plantillas disponibles
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
          Elige una plantilla para cambiar el diseño de tu borrador. Después
          podrás personalizarla desde Editar tienda.
        </p>

        <SelectorPlantillas
          key={`${tienda.id}-${borrador.updated_at}`}
          plantillas={PLANTILLAS.map((plantilla) =>
            obtenerPlantilla(plantilla.id),
          )}
          plantillaPublicada={publicado.plantilla}
          plantillaBorrador={borrador.plantilla}
          borradorUpdatedAt={borrador.updated_at}
          catalogoId={tienda.id}
        />
      </section>
    </div>
  );
}
