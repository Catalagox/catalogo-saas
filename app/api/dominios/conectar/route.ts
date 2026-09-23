import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ConectarDominioBody {
  dominio?: unknown;
}

interface VercelDomainResponse {
  name?: string;
  apexName?: string;
  projectId?: string;
  verified?: boolean;
  createdAt?: number;
  updatedAt?: number;
  redirect?: string | null;
  redirectStatusCode?: number | null;
  error?: {
    code?: string;
    message?: string;
  };
}

/**
 * Limpia el valor recibido.
 *
 * Ejemplos:
 * https://mitienda.com/ → mitienda.com
 * HTTP://MITIENDA.COM  → mitienda.com
 */
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

  // No permitimos puertos.
  if (dominio.includes(":")) {
    return false;
  }

  // Debe ser un dominio real, no localhost ni una IP.
  const patronDominio =
    /^(?=.{4,253}$)(?!-)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

  return patronDominio.test(dominio);
}

function dominioReservado(dominio: string): boolean {
  return (
    dominio === "catalagox.com" ||
    dominio === "www.catalagox.com" ||
    dominio.endsWith(".catalagox.com") ||
    dominio.endsWith(".vercel.app")
  );
}

function obtenerMensajeErrorVercel(
  codigo?: string,
  mensaje?: string,
): string {
  switch (codigo) {
    case "domain_already_in_use":
    case "domain_taken":
      return "Este dominio ya está conectado a otro proyecto.";

    case "forbidden":
      return "Vercel rechazó la operación por falta de permisos.";

    case "invalid_domain":
      return "Vercel indicó que el dominio no es válido.";

    case "custom_domain_needs_upgrade":
      return "Tu plan actual de Vercel no permite agregar este dominio.";

    default:
      return mensaje || "No se pudo agregar el dominio en Vercel.";
  }
}

export async function POST(request: Request) {
  let dominio = "";
  let registroDominioId: string | null = null;

  try {
    // =====================================================
    // 1. VALIDAR VARIABLES PRIVADAS
    // =====================================================

    const vercelToken = process.env.VERCEL_API_TOKEN;
    const vercelProjectId = process.env.VERCEL_PROJECT_ID;
    const vercelTeamId = process.env.VERCEL_TEAM_ID;

    if (!vercelToken || !vercelProjectId || !vercelTeamId) {
      console.error(
        "Faltan variables privadas para administrar dominios.",
      );

      return NextResponse.json(
        {
          ok: false,
          error:
            "La configuración de dominios no está disponible.",
        },
        { status: 500 },
      );
    }

    // =====================================================
    // 2. COMPROBAR USUARIO AUTENTICADO
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
          error: "Debes iniciar sesión para conectar un dominio.",
        },
        { status: 401 },
      );
    }

    // =====================================================
    // 3. LEER Y VALIDAR EL DOMINIO
    // =====================================================

    let body: ConectarDominioBody;

    try {
      body = (await request.json()) as ConectarDominioBody;
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
          error: "Debes escribir un dominio.",
        },
        { status: 400 },
      );
    }

    dominio = normalizarDominio(body.dominio);

    if (!esDominioValido(dominio)) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Escribe un dominio válido, por ejemplo: mitienda.com",
        },
        { status: 400 },
      );
    }

    if (dominioReservado(dominio)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Este dominio está reservado por Catalagox.",
        },
        { status: 400 },
      );
    }

    // =====================================================
    // 4. BUSCAR EL CATÁLOGO DEL USUARIO
    // =====================================================

    const { data: catalogo, error: catalogoError } =
      await supabase
        .from("catalogos")
        .select(`
          id,
          slug,
          suscripcion_activa,
          subscription_status,
          plan_vence_el
        `)
        .eq("user_id", user.id)
        .maybeSingle();

    if (catalogoError) {
      console.error(
        "Error buscando el catálogo:",
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
    // 5. COMPROBAR SUSCRIPCIÓN
    // =====================================================

    const fechaVencimiento = catalogo.plan_vence_el
      ? new Date(catalogo.plan_vence_el)
      : null;

    const suscripcionVencida =
      !fechaVencimiento ||
      Number.isNaN(fechaVencimiento.getTime()) ||
      fechaVencimiento.getTime() < Date.now();

    const puedeConectarDominio =
      catalogo.suscripcion_activa === true &&
      catalogo.subscription_status === "active" &&
      !suscripcionVencida;

    if (!puedeConectarDominio) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Los dominios personalizados están disponibles para clientes con una suscripción activa.",
        },
        { status: 403 },
      );
    }

    if (!catalogo.slug || !catalogo.slug.trim()) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Tu tienda necesita un enlace válido antes de conectar un dominio.",
        },
        { status: 400 },
      );
    }

    // =====================================================
    // 6. OPERACIONES ADMINISTRATIVAS EN SUPABASE
    // =====================================================

    const supabaseAdmin = createAdminClient();

    const { data: dominioExistente, error: dominioExistenteError } =
      await supabaseAdmin
        .from("dominios")
        .select("id, catalogo_id, dominio, estado, verificado")
        .eq("dominio", dominio)
        .maybeSingle();

    if (dominioExistenteError) {
      console.error(
        "Error comprobando el dominio:",
        dominioExistenteError,
      );

      return NextResponse.json(
        {
          ok: false,
          error: "No se pudo comprobar el dominio.",
        },
        { status: 500 },
      );
    }

    if (
      dominioExistente &&
      dominioExistente.catalogo_id !== catalogo.id
    ) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Este dominio ya está asociado con otra tienda.",
        },
        { status: 409 },
      );
    }

    // Durante esta primera versión permitimos un dominio
    // personalizado por catálogo.
    const { data: otroDominio, error: otroDominioError } =
      await supabaseAdmin
        .from("dominios")
        .select("id, dominio")
        .eq("catalogo_id", catalogo.id)
        .neq("dominio", dominio)
        .limit(1)
        .maybeSingle();

    if (otroDominioError) {
      console.error(
        "Error consultando los dominios de la tienda:",
        otroDominioError,
      );

      return NextResponse.json(
        {
          ok: false,
          error: "No se pudo comprobar tu configuración actual.",
        },
        { status: 500 },
      );
    }

    if (otroDominio) {
      return NextResponse.json(
        {
          ok: false,
          error: `Tu tienda ya tiene conectado el dominio ${otroDominio.dominio}.`,
        },
        { status: 409 },
      );
    }

    // Creamos el registro pendiente o reutilizamos uno anterior
    // perteneciente a la misma tienda.
    if (dominioExistente) {
      registroDominioId = dominioExistente.id;

      const { error: actualizarPendienteError } =
        await supabaseAdmin
          .from("dominios")
          .update({
            estado: "configurando",
            verificado: false,
            ultimo_error: null,
          })
          .eq("id", dominioExistente.id)
          .eq("catalogo_id", catalogo.id);

      if (actualizarPendienteError) {
        throw actualizarPendienteError;
      }
    } else {
      const { data: nuevoDominio, error: insertarError } =
        await supabaseAdmin
          .from("dominios")
          .insert({
            catalogo_id: catalogo.id,
            dominio,
            estado: "configurando",
            es_principal: false,
            verificado: false,
            configuracion_vercel: {},
            ultimo_error: null,
          })
          .select("id")
          .single();

      if (insertarError || !nuevoDominio) {
        console.error(
          "Error creando el dominio pendiente:",
          insertarError,
        );

        return NextResponse.json(
          {
            ok: false,
            error:
              "No se pudo guardar la configuración del dominio.",
          },
          { status: 500 },
        );
      }

      registroDominioId = nuevoDominio.id;
    }

    // =====================================================
    // 7. AGREGAR EL DOMINIO AL PROYECTO DE VERCEL
    // =====================================================

    const endpoint = new URL(
      `https://api.vercel.com/v10/projects/${encodeURIComponent(
        vercelProjectId,
      )}/domains`,
    );

    endpoint.searchParams.set("teamId", vercelTeamId);

    const vercelResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${vercelToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: dominio,
      }),
      cache: "no-store",
    });

    const vercelData =
      (await vercelResponse.json()) as VercelDomainResponse;

    if (!vercelResponse.ok) {
      const mensajeError = obtenerMensajeErrorVercel(
        vercelData.error?.code,
        vercelData.error?.message,
      );

      await supabaseAdmin
        .from("dominios")
        .update({
          estado: "error",
          verificado: false,
          ultimo_error: mensajeError,
          configuracion_vercel: vercelData,
        })
        .eq("id", registroDominioId)
        .eq("catalogo_id", catalogo.id);

      console.error("Error de Vercel al agregar dominio:", {
        status: vercelResponse.status,
        code: vercelData.error?.code,
        message: vercelData.error?.message,
      });

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
    // 8. GUARDAR RESPUESTA DE VERCEL
    // =====================================================

    const verificado = vercelData.verified === true;

    const { data: dominioGuardado, error: guardarError } =
      await supabaseAdmin
        .from("dominios")
        .update({
          estado: verificado ? "activo" : "verificando",
          es_principal: true,
          verificado,
          configuracion_vercel: vercelData,
          ultimo_error: null,
          verificado_en: verificado
            ? new Date().toISOString()
            : null,
        })
        .eq("id", registroDominioId)
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

    if (guardarError || !dominioGuardado) {
      console.error(
        "Vercel agregó el dominio, pero Supabase no pudo actualizarlo:",
        guardarError,
      );

      return NextResponse.json(
        {
          ok: false,
          error:
            "Vercel agregó el dominio, pero no pudimos terminar de guardar su configuración.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        ok: true,
        message: verificado
          ? "Dominio conectado correctamente."
          : "Dominio agregado. Ahora debes configurar sus registros DNS.",
        dominio: dominioGuardado,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error inesperado conectando dominio:", error);

    if (registroDominioId) {
      try {
        const supabaseAdmin = createAdminClient();

        await supabaseAdmin
          .from("dominios")
          .update({
            estado: "error",
            verificado: false,
            ultimo_error:
              "Ocurrió un error inesperado durante la configuración.",
          })
          .eq("id", registroDominioId);
      } catch (updateError) {
        console.error(
          "No se pudo registrar el error del dominio:",
          updateError,
        );
      }
    }

    return NextResponse.json(
      {
        ok: false,
        error:
          "Ocurrió un error inesperado al conectar el dominio.",
      },
      { status: 500 },
    );
  }
}