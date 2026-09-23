import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface VerificarDominioBody {
  dominio?: unknown;
}

interface VercelVerificationItem {
  type?: string;
  domain?: string;
  value?: string;
  reason?: string;
}

interface VercelVerifyResponse {
  name?: string;
  apexName?: string;
  projectId?: string;
  verified?: boolean;
  verification?: VercelVerificationItem[];
  error?: {
    code?: string;
    message?: string;
  };
}

function normalizarDominio(valor: string): string {
  let dominio = valor.trim().toLowerCase();

  dominio = dominio.replace(/^https?:\/\//, "");
  dominio = dominio.split("/")[0];
  dominio = dominio.split("?")[0];
  dominio = dominio.split("#")[0];
  dominio = dominio.replace(/\.$/, "");

  return dominio;
}

function esDominioValido(dominio: string): boolean {
  if (dominio.length < 4 || dominio.length > 253) {
    return false;
  }

  if (dominio.includes(":")) {
    return false;
  }

  const patronDominio =
    /^(?=.{4,253}$)(?!-)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

  return patronDominio.test(dominio);
}

export async function POST(request: Request) {
  try {
    // =====================================================
    // 1. VALIDAR VARIABLES PRIVADAS
    // =====================================================

    const vercelToken = process.env.VERCEL_API_TOKEN;
    const vercelProjectId = process.env.VERCEL_PROJECT_ID;
    const vercelTeamId = process.env.VERCEL_TEAM_ID;

    if (!vercelToken || !vercelProjectId || !vercelTeamId) {
      console.error(
        "Faltan variables privadas para verificar dominios.",
      );

      return NextResponse.json(
        {
          ok: false,
          error:
            "La verificación de dominios no está disponible.",
        },
        { status: 500 },
      );
    }

    // =====================================================
    // 2. COMPROBAR USUARIO
    // =====================================================

    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Debes iniciar sesión para verificar un dominio.",
        },
        { status: 401 },
      );
    }

    // =====================================================
    // 3. LEER EL DOMINIO
    // =====================================================

    let body: VerificarDominioBody;

    try {
      body = (await request.json()) as VerificarDominioBody;
    } catch {
      return NextResponse.json(
        {
          ok: false,
          error: "La solicitud enviada no es válida.",
        },
        { status: 400 },
      );
    }

    if (typeof body.dominio !== "string") {
      return NextResponse.json(
        {
          ok: false,
          error: "Debes indicar el dominio que deseas verificar.",
        },
        { status: 400 },
      );
    }

    const dominio = normalizarDominio(body.dominio);

    if (!esDominioValido(dominio)) {
      return NextResponse.json(
        {
          ok: false,
          error: "El dominio recibido no es válido.",
        },
        { status: 400 },
      );
    }

    // =====================================================
    // 4. BUSCAR LA TIENDA DEL USUARIO
    // =====================================================

    const { data: catalogo, error: catalogoError } =
      await supabase
        .from("catalogos")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

    if (catalogoError) {
      console.error(
        "Error buscando la tienda:",
        catalogoError,
      );

      return NextResponse.json(
        {
          ok: false,
          error: "No se pudo consultar tu tienda.",
        },
        { status: 500 },
      );
    }

    if (!catalogo) {
      return NextResponse.json(
        {
          ok: false,
          error: "No encontramos una tienda asociada a tu cuenta.",
        },
        { status: 404 },
      );
    }

    // =====================================================
    // 5. COMPROBAR QUE EL DOMINIO PERTENECE A LA TIENDA
    // =====================================================

    const supabaseAdmin = createAdminClient();

    const { data: dominioGuardado, error: dominioError } =
      await supabaseAdmin
        .from("dominios")
        .select(`
          id,
          dominio,
          estado,
          verificado,
          configuracion_vercel
        `)
        .eq("catalogo_id", catalogo.id)
        .eq("dominio", dominio)
        .maybeSingle();

    if (dominioError) {
      console.error(
        "Error consultando el dominio:",
        dominioError,
      );

      return NextResponse.json(
        {
          ok: false,
          error: "No se pudo consultar el dominio.",
        },
        { status: 500 },
      );
    }

    if (!dominioGuardado) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Este dominio no está asociado con tu tienda.",
        },
        { status: 404 },
      );
    }

    // =====================================================
    // 6. MARCAR COMO VERIFICANDO
    // =====================================================

    await supabaseAdmin
      .from("dominios")
      .update({
        estado: "verificando",
        ultimo_error: null,
      })
      .eq("id", dominioGuardado.id)
      .eq("catalogo_id", catalogo.id);

    // =====================================================
    // 7. PEDIR VERIFICACIÓN A VERCEL
    // =====================================================

    const endpoint = new URL(
      `https://api.vercel.com/v9/projects/${encodeURIComponent(
        vercelProjectId,
      )}/domains/${encodeURIComponent(dominio)}/verify`,
    );

    endpoint.searchParams.set("teamId", vercelTeamId);

    const vercelResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${vercelToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const vercelData =
      (await vercelResponse.json()) as VercelVerifyResponse;

    if (!vercelResponse.ok) {
      const mensajeError =
        vercelData.error?.message ||
        "Vercel no pudo verificar el dominio.";

      await supabaseAdmin
        .from("dominios")
        .update({
          estado: "error",
          verificado: false,
          ultimo_error: mensajeError,
          configuracion_vercel: {
            conexion:
              dominioGuardado.configuracion_vercel || {},
            verificacion: vercelData,
          },
        })
        .eq("id", dominioGuardado.id)
        .eq("catalogo_id", catalogo.id);

      return NextResponse.json(
        {
          ok: false,
          error: mensajeError,
          code: vercelData.error?.code || null,
        },
        { status: vercelResponse.status },
      );
    }

    // =====================================================
    // 8. GUARDAR RESULTADO
    // =====================================================

    const verificado = vercelData.verified === true;

    const mensajePendiente =
      vercelData.verification?.[0]?.reason ||
      "El dominio todavía no está verificado. Revisa los registros DNS e inténtalo nuevamente.";

    const { data: dominioActualizado, error: actualizarError } =
      await supabaseAdmin
        .from("dominios")
        .update({
          estado: verificado ? "activo" : "verificando",
          verificado,
          es_principal: verificado,
          ultimo_error: verificado ? null : mensajePendiente,
          verificado_en: verificado
            ? new Date().toISOString()
            : null,
          configuracion_vercel: {
            conexion:
              dominioGuardado.configuracion_vercel || {},
            verificacion: vercelData,
          },
        })
        .eq("id", dominioGuardado.id)
        .eq("catalogo_id", catalogo.id)
        .select(`
          id,
          dominio,
          estado,
          es_principal,
          verificado,
          configuracion_vercel,
          ultimo_error,
          verificado_en,
          created_at,
          updated_at
        `)
        .single();

    if (actualizarError || !dominioActualizado) {
      console.error(
        "Error guardando la verificación:",
        actualizarError,
      );

      return NextResponse.json(
        {
          ok: false,
          error:
            "Vercel respondió, pero no pudimos guardar la verificación.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      verified: verificado,
      message: verificado
        ? "Dominio verificado y activado correctamente."
        : mensajePendiente,
      dominio: dominioActualizado,
    });
  } catch (error) {
    console.error(
      "Error inesperado verificando dominio:",
      error,
    );

    return NextResponse.json(
      {
        ok: false,
        error:
          "Ocurrió un error inesperado al verificar el dominio.",
      },
      { status: 500 },
    );
  }
}