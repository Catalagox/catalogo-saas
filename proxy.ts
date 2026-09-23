import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { updateSession } from "@/lib/supabase/proxy";
import { createAdminClient } from "@/lib/supabase/admin";

function limpiarHost(host: string | null): string {
  if (!host) {
    return "";
  }

  return host
    .toLowerCase()
    .trim()
    .split(":")[0]
    .replace(/\.$/, "");
}

function esDominioDeCatalagox(host: string): boolean {
  return (
    host === "catalagox.com" ||
    host === "www.catalagox.com" ||
    host === "localhost" ||
    host === "127.0.0.1" ||
    host.endsWith(".vercel.app")
  );
}

function esRutaInterna(pathname: string): boolean {
  const rutasInternas = [
    "/dashboard",
    "/auth",
    "/onboarding",
    "/suscripcion",
    "/facturacion",
    "/configuracion",
    "/contacto",
    "/privacidad",
    "/terminos",
    "/sobre-nosotros",
    "/preview-catalogo",
  ];

  return rutasInternas.some(
    (ruta) =>
      pathname === ruta ||
      pathname.startsWith(`${ruta}/`),
  );
}

async function buscarSlugPorDominio(
  dominio: string,
): Promise<string | null> {
  try {
    const supabaseAdmin = createAdminClient();

    const { data: dominioEncontrado, error: dominioError } =
      await supabaseAdmin
        .from("dominios")
        .select("catalogo_id")
        .eq("dominio", dominio)
        .eq("estado", "activo")
        .eq("verificado", true)
        .eq("es_principal", true)
        .maybeSingle();

    if (dominioError || !dominioEncontrado) {
      if (dominioError) {
        console.error(
          "Error buscando el dominio personalizado:",
          dominioError,
        );
      }

      return null;
    }

    const { data: catalogo, error: catalogoError } =
      await supabaseAdmin
        .from("catalogos")
        .select(`
          slug,
          suscripcion_activa,
          subscription_status,
          plan_vence_el
        `)
        .eq("id", dominioEncontrado.catalogo_id)
        .maybeSingle();

    if (catalogoError || !catalogo) {
      if (catalogoError) {
        console.error(
          "Error buscando el catálogo del dominio:",
          catalogoError,
        );
      }

      return null;
    }

    if (
      !catalogo.slug ||
      !catalogo.slug.trim() ||
      catalogo.suscripcion_activa !== true
    ) {
      return null;
    }

    const fechaVencimiento = catalogo.plan_vence_el
      ? new Date(catalogo.plan_vence_el)
      : null;

    const suscripcionVencida =
      !fechaVencimiento ||
      Number.isNaN(fechaVencimiento.getTime()) ||
      fechaVencimiento.getTime() < Date.now();

    const suscripcionValida =
      catalogo.subscription_status === "active" ||
      catalogo.subscription_status === "trialing";

    if (!suscripcionValida || suscripcionVencida) {
      return null;
    }

    return catalogo.slug.trim();
  } catch (error) {
    console.error(
      "Error inesperado resolviendo el dominio:",
      error,
    );

    return null;
  }
}

export async function proxy(request: NextRequest) {
  const host = limpiarHost(request.headers.get("host"));
  const { pathname } = request.nextUrl;

  /*
   * Los dominios propios de Catalagox continúan usando
   * el comportamiento normal y la protección de sesión.
   */
  if (!host || esDominioDeCatalagox(host)) {
    return updateSession(request);
  }

  /*
   * Si alguien intenta abrir una ruta administrativa desde
   * un dominio personalizado, lo enviamos a Catalagox.
   */
  if (esRutaInterna(pathname)) {
    const urlCatalagox = new URL(
      `${pathname}${request.nextUrl.search}`,
      "https://catalagox.com",
    );

    return NextResponse.redirect(urlCatalagox);
  }

  const slug = await buscarSlugPorDominio(host);

  /*
   * No mostramos otra tienda ni la página de marketing
   * cuando el dominio no está activo o no está verificado.
   */
  if (!slug) {
    return new NextResponse(
      `
        <!doctype html>
        <html lang="es">
          <head>
            <meta charset="utf-8" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <title>Dominio no disponible</title>
          </head>

          <body
            style="
              margin: 0;
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 24px;
              box-sizing: border-box;
              background: #050807;
              color: #ffffff;
              font-family: Arial, sans-serif;
            "
          >
            <main
              style="
                width: 100%;
                max-width: 460px;
                padding: 32px;
                box-sizing: border-box;
                text-align: center;
                border: 1px solid rgba(255,255,255,0.12);
                border-radius: 20px;
                background: #111827;
              "
            >
              <h1
                style="
                  margin: 0 0 12px;
                  font-size: 24px;
                "
              >
                Dominio no disponible
              </h1>

              <p
                style="
                  margin: 0;
                  color: #9ca3af;
                  line-height: 1.6;
                "
              >
                Este dominio todavía no está conectado con una
                tienda activa de Catalagox.
              </p>
            </main>
          </body>
        </html>
      `,
      {
        status: 404,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store",
        },
      },
    );
  }

  const rewriteUrl = request.nextUrl.clone();

  /*
   * mitienda.com
   * se convierte internamente en:
   * catalagox.com/slug-de-la-tienda
   */
  if (pathname === "/") {
    rewriteUrl.pathname = `/${slug}`;

    return NextResponse.rewrite(rewriteUrl);
  }

  /*
   * mitienda.com/producto-ejemplo
   * se convierte internamente en:
   * catalagox.com/slug-de-la-tienda/producto-ejemplo
   */
  rewriteUrl.pathname = `/${slug}${pathname}`;

  return NextResponse.rewrite(rewriteUrl);
}

export const config = {
  matcher: [
    /*
     * Ejecutar el proxy en las páginas, pero excluir:
     * - API
     * - archivos internos de Next.js
     * - imágenes y archivos estáticos
     */
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|css|js|map|txt|xml|woff|woff2|ttf)$).*)",
  ],
};