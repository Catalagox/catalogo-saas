"use client";

import { useMemo, type CSSProperties } from "react";
import Link from "next/link";

import Price from "@/components/ui/Price";
import OptimizedImage from "@/components/public/OptimizedImage";
import IlustracionTienda from "@/components/public/IlustracionTienda";

import { normalizarConfig } from "@/lib/tienda-diseno/config";

import type { ConfigTarjetasCompleta } from "@/lib/tienda-diseno/config-tarjetas";

import type {
  CategoriaTienda,
  ConfigDiseno,
  ConfigTitulosCategoria,
  FuentePortada,
  ProductoTienda,
} from "@/lib/tienda-diseno/types";

interface ProductosModernaProps {
  categorias: CategoriaTienda[];
  config: ConfigDiseno;
  countryCode: string;
  rutaBase: string;
}

type EstiloConVariables = CSSProperties &
  Record<`--${string}`, string | number>;

interface TarjetaProductoProps {
  producto: ProductoTienda;
  tarjetas: ConfigTarjetasCompleta;
  countryCode: string;
  rutaBase: string;
  prioritario: boolean;
  sizes: string;
}

const CLASE_CUADRICULA =
  "grid w-full min-w-0 [grid-template-columns:repeat(var(--moderna-columns),minmax(0,1fr))]";

const ALINEACIONES = {
  izquierda: "left",
  centro: "center",
  derecha: "right",
} as const;

const PROPORCIONES = {
  cuadrada: "1 / 1",
  horizontal: "4 / 3",
  vertical: "3 / 4",
} as const;

const SOMBRAS = {
  ninguna: "none",
  suave: "0 4px 14px rgba(0, 0, 0, 0.08)",
  media: "0 10px 28px rgba(0, 0, 0, 0.15)",
} as const;

function obtenerFuente(fuente: FuentePortada): string {
  switch (fuente) {
    case "sistema":
      return "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

    case "serif":
      return "Georgia, 'Times New Roman', serif";

    case "monoespaciada":
      return "'Courier New', Courier, monospace";

    default:
      return "inherit";
  }
}

function estiloTarjeta(
  tarjetas: ConfigTarjetasCompleta,
): CSSProperties {
  return {
    borderRadius: tarjetas.radio_borde,
    borderStyle: "solid",
    borderWidth: tarjetas.mostrar_borde
      ? tarjetas.grosor_borde
      : 0,
    borderColor: tarjetas.color_borde,
    boxShadow: SOMBRAS[tarjetas.sombra],
    backgroundColor: "var(--color-card, transparent)",
  };
}

function estiloImagen(
  tarjetas: ConfigTarjetasCompleta,
): CSSProperties {
  const personalizada =
    tarjetas.modo_altura_imagen === "personalizada";

  return {
    aspectRatio: personalizada
      ? "auto"
      : PROPORCIONES[tarjetas.proporcion_imagen],
    height: personalizada
      ? "var(--moderna-image-height)"
      : undefined,
    backgroundColor: tarjetas.color_fondo_imagen,
  };
}

function estiloContenido(
  tarjetas: ConfigTarjetasCompleta,
): CSSProperties {
  return {
    padding: tarjetas.padding_contenido,
    gap: tarjetas.separacion_textos,
  };
}

function estiloTituloProducto(
  tarjetas: ConfigTarjetasCompleta,
): CSSProperties {
  return {
    textAlign: ALINEACIONES[tarjetas.alineacion_titulo],
    fontFamily: obtenerFuente(tarjetas.fuente_titulo),
    fontSize: "var(--moderna-title-size)",
    fontWeight: tarjetas.peso_titulo,
  };
}

function TituloCategoria({
  id,
  nombre,
  cantidad,
  config,
}: {
  id: string;
  nombre: string;
  cantidad: number;
  config: ConfigTitulosCategoria;
}) {
  if (!config.mostrar) return null;

  return (
    <h2
      id={id}
      className="break-words leading-tight"
      style={{
        color: config.color,
        fontFamily: obtenerFuente(config.fuente),
        fontSize: "var(--moderna-category-title-size)",
        fontWeight: config.peso,
        textAlign: ALINEACIONES[config.alineacion],
        marginBottom: config.separacion_inferior,
      }}
    >
      {nombre}

      {config.mostrar_cantidad && (
        <span
          aria-label={`${cantidad} ${
            cantidad === 1 ? "producto" : "productos"
          }`}
          className="ml-2 inline-block align-middle text-[0.55em] font-normal opacity-65"
        >
          ({cantidad})
        </span>
      )}
    </h2>
  );
}

function TarjetaProducto({
  producto,
  tarjetas,
  countryCode,
  rutaBase,
  prioritario,
  sizes,
}: TarjetaProductoProps) {
  const base =
    rutaBase === "/" ? "" : rutaBase.replace(/\/+$/, "");

  const slug = producto.slug
    .trim()
    .replace(/^\/+|\/+$/g, "");

  const agotado =
    producto.disponible === false ||
    (
      typeof producto.stock === "number" &&
      Number.isFinite(producto.stock) &&
      producto.stock <= 0
    );

  const imagen = producto.imagen_url?.trim();
  const descripcion = producto.descripcion?.trim();

  return (
    <Link
      href={`${base}/${slug}`}
      aria-label={`Ver producto: ${producto.nombre}`}
      data-producto-disponible={agotado ? "false" : "true"}
      className="flex h-full min-w-0 flex-col overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
      style={estiloTarjeta(tarjetas)}
    >
      <div className="relative min-w-0 overflow-hidden">
        {imagen ? (
          <OptimizedImage
            src={imagen}
            alt={producto.nombre}
            fill
            ajuste={tarjetas.ajuste_imagen}
            priority={prioritario}
            sizes={sizes}
            containerStyle={estiloImagen(tarjetas)}
            style={{
              padding: tarjetas.padding_imagen,
            }}
            className={agotado ? "grayscale-[35%]" : ""}
          />
        ) : (
          <div
            role="img"
            aria-label={`Sin fotografía: ${producto.nombre}`}
            style={{
              ...estiloImagen(tarjetas),
              padding: tarjetas.padding_imagen,
            }}
          >
            <IlustracionTienda
              variante="producto"
              className="h-full w-full"
            />
          </div>
        )}

        {agotado && tarjetas.mostrar_agotado && (
          <span className="absolute bottom-3 left-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-900 shadow-sm">
            Agotado
          </span>
        )}
      </div>

      <div
        className="flex min-w-0 flex-1 flex-col"
        style={estiloContenido(tarjetas)}
      >
        {tarjetas.mostrar_titulo && (
          <h3
            className="w-full break-words leading-snug text-[var(--color-text)]"
            style={estiloTituloProducto(tarjetas)}
          >
            {producto.nombre}
          </h3>
        )}

        {tarjetas.mostrar_descripcion && descripcion && (
          <p
            className="w-full break-words leading-relaxed text-[var(--color-text)] opacity-75"
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: tarjetas.lineas_descripcion,
              overflow: "hidden",
              textAlign:
                ALINEACIONES[tarjetas.alineacion_descripcion],
              fontFamily: obtenerFuente(
                tarjetas.fuente_descripcion,
              ),
              fontSize: "var(--moderna-description-size)",
              fontWeight: tarjetas.peso_descripcion,
            }}
          >
            {descripcion}
          </p>
        )}

        {tarjetas.mostrar_precio && (
          <div
            className="w-full text-[var(--color-price)]"
            style={{
              textAlign:
                ALINEACIONES[tarjetas.alineacion_precio],
              fontSize: "var(--moderna-price-size)",
              fontWeight: tarjetas.peso_precio,
            }}
          >
            <Price
              amount={producto.precio}
              countryCode={countryCode}
            />
          </div>
        )}
      </div>
    </Link>
  );
}

function ProductosVacios({
  tarjetas,
  titulos,
}: {
  tarjetas: ConfigTarjetasCompleta;
  titulos: ConfigTitulosCategoria;
}) {
  return (
    <section
      aria-labelledby={
        titulos.mostrar
          ? "moderna-coleccion-vacia"
          : undefined
      }
      aria-label={!titulos.mostrar ? "Nuestra colección" : undefined}
      className="w-full min-w-0"
    >
      <TituloCategoria
        id="moderna-coleccion-vacia"
        nombre="Nuestra colección"
        cantidad={0}
        config={titulos}
      />

      <div
        className={CLASE_CUADRICULA}
        style={{
          columnGap: tarjetas.separacion_horizontal,
          rowGap: tarjetas.separacion_vertical,
        }}
      >
        {[1, 2, 3, 4].map((numero) => (
          <div
            key={numero}
            className="flex min-w-0 flex-col overflow-hidden"
            style={estiloTarjeta(tarjetas)}
          >
            <div
              role="img"
              aria-label="Ilustración de camiseta"
              style={{
                ...estiloImagen(tarjetas),
                padding: tarjetas.padding_imagen,
              }}
            >
              <IlustracionTienda
                variante="producto"
                className="h-full w-full"
              />
            </div>

            {tarjetas.mostrar_titulo && (
              <div style={estiloContenido(tarjetas)}>
                <p
                  className="break-words leading-snug text-[var(--color-text)]"
                  style={estiloTituloProducto(tarjetas)}
                >
                  Próximamente
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default function ProductosModerna({
  categorias,
  config,
  countryCode,
  rutaBase,
}: ProductosModernaProps) {
  const diseno = useMemo(
    () => normalizarConfig(config),
    [config],
  );

  const { tarjetas, catalogo } = diseno;

  const categoriasProcesadas = useMemo(() => {
    const vistos = new Set<string>();

    return (Array.isArray(categorias) ? categorias : [])
      .filter(
        (categoria) =>
          categoria &&
          Boolean(categoria.id) &&
          Boolean(categoria.nombre?.trim()),
      )
      .map((categoria) => ({
        ...categoria,
        productos: (
          Array.isArray(categoria.productos)
            ? categoria.productos
            : []
        ).filter((producto) => {
          if (
            !producto ||
            producto.disponible === false ||
            !producto.id ||
            !producto.nombre?.trim() ||
            !producto.slug?.trim() ||
            !Number.isFinite(producto.precio) ||
            producto.precio < 0 ||
            vistos.has(producto.id)
          ) {
            return false;
          }

          vistos.add(producto.id);
          return true;
        }),
      }))
      .filter((categoria) => categoria.productos.length > 0);
  }, [categorias]);

  const variables: EstiloConVariables = {
    "--moderna-image-height-mobile":
      `${tarjetas.alto_imagen_movil}px`,
    "--moderna-image-height-desktop":
      `${tarjetas.alto_imagen}px`,

    "--moderna-title-size-mobile":
      `${tarjetas.tamano_titulo_movil}px`,
    "--moderna-title-size-desktop":
      `${tarjetas.tamano_titulo}px`,

    "--moderna-description-size-mobile":
      `${tarjetas.tamano_descripcion_movil}px`,
    "--moderna-description-size-desktop":
      `${tarjetas.tamano_descripcion}px`,

    "--moderna-price-size-mobile":
      `${tarjetas.tamano_precio_movil}px`,
    "--moderna-price-size-desktop":
      `${tarjetas.tamano_precio}px`,

    "--moderna-category-title-size-mobile":
      `${catalogo.titulos.tamano_movil}px`,
    "--moderna-category-title-size-desktop":
      `${catalogo.titulos.tamano}px`,

    "--moderna-columns-mobile":
      catalogo.columnas_movil,
    "--moderna-columns-tablet":
      catalogo.columnas_tablet,
    "--moderna-columns-desktop":
      catalogo.columnas_escritorio,

    "--moderna-padding-mobile":
      `${catalogo.margen_horizontal_movil}px`,
    "--moderna-padding-desktop":
      `${catalogo.margen_horizontal}px`,

    backgroundColor: catalogo.heredar_fondo
      ? diseno.color_fondo
      : catalogo.color_fondo,

    paddingTop: catalogo.padding_superior,
    paddingBottom: catalogo.padding_inferior,
  };

  // El navegador elige la resolución según las columnas.
  const sizes = [
    `(max-width: 639px) ${100 / catalogo.columnas_movil}vw`,
    `(max-width: 1023px) ${100 / catalogo.columnas_tablet}vw`,
    catalogo.ancho_completo
      ? `${100 / catalogo.columnas_escritorio}vw`
      : `(min-width: ${catalogo.ancho_maximo}px) ${
          catalogo.ancho_maximo / catalogo.columnas_escritorio
        }px`,
    ...(
      catalogo.ancho_completo
        ? []
        : [`${100 / catalogo.columnas_escritorio}vw`]
    ),
  ].join(", ");

  return (
    <div
      className="productos-moderna w-full min-w-0"
      style={variables}
    >
      <div
        className="mx-auto flex w-full min-w-0 flex-col"
        style={{
          maxWidth: catalogo.ancho_completo
            ? undefined
            : catalogo.ancho_maximo,
          gap: diseno.espaciado.separacion_secciones,
        }}
      >
        {categoriasProcesadas.length === 0 ? (
          <ProductosVacios
            tarjetas={tarjetas}
            titulos={catalogo.titulos}
          />
        ) : (
          categoriasProcesadas.map(
            (categoria, indiceCategoria) => {
              const idTitulo = `cat-header-${categoria.id}`;

              return (
                <section
                  key={categoria.id}
                  id={`cat-${categoria.id}`}
                  aria-labelledby={
                    catalogo.titulos.mostrar
                      ? idTitulo
                      : undefined
                  }
                  aria-label={
                    !catalogo.titulos.mostrar
                      ? categoria.nombre
                      : undefined
                  }
                  className="w-full min-w-0 scroll-mt-24"
                >
                  <TituloCategoria
                    id={idTitulo}
                    nombre={categoria.nombre}
                    cantidad={categoria.productos.length}
                    config={catalogo.titulos}
                  />

                  <div
                    className={CLASE_CUADRICULA}
                    style={{
                      columnGap: tarjetas.separacion_horizontal,
                      rowGap: tarjetas.separacion_vertical,
                    }}
                  >
                    {categoria.productos.map(
                      (producto, indiceProducto) => (
                        <div
                          key={producto.id}
                          id={`prod-${producto.id}`}
                          className="min-w-0 scroll-mt-24"
                        >
                          <TarjetaProducto
                            producto={producto}
                            tarjetas={tarjetas}
                            countryCode={countryCode}
                            rutaBase={rutaBase}
                            sizes={sizes}
                            prioritario={
                              indiceCategoria === 0 &&
                              indiceProducto <
                                catalogo.columnas_escritorio
                            }
                          />
                        </div>
                      ),
                    )}
                  </div>
                </section>
              );
            },
          )
        )}
      </div>

      <style jsx>{`
        .productos-moderna {
          --moderna-image-height:
            var(--moderna-image-height-mobile);
          --moderna-title-size:
            var(--moderna-title-size-mobile);
          --moderna-description-size:
            var(--moderna-description-size-mobile);
          --moderna-price-size:
            var(--moderna-price-size-mobile);
          --moderna-category-title-size:
            var(--moderna-category-title-size-mobile);
          --moderna-columns:
            var(--moderna-columns-mobile);

          padding-left: var(--moderna-padding-mobile);
          padding-right: var(--moderna-padding-mobile);
        }

        @media (min-width: 640px) {
          .productos-moderna {
            --moderna-image-height:
              var(--moderna-image-height-desktop);
            --moderna-title-size:
              var(--moderna-title-size-desktop);
            --moderna-description-size:
              var(--moderna-description-size-desktop);
            --moderna-price-size:
              var(--moderna-price-size-desktop);
            --moderna-category-title-size:
              var(--moderna-category-title-size-desktop);
            --moderna-columns:
              var(--moderna-columns-tablet);

            padding-left: var(--moderna-padding-desktop);
            padding-right: var(--moderna-padding-desktop);
          }
        }

        @media (min-width: 1024px) {
          .productos-moderna {
            --moderna-columns:
              var(--moderna-columns-desktop);
          }
        }
      `}</style>
    </div>
  );
}