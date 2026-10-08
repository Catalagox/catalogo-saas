import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

import {
  VERSION_CONFIG,
  esPlantillaId,
  validarConfig,
} from "@/lib/tienda-diseno/config";

function esObjeto(
  valor: unknown,
): valor is Record<string, unknown> {
  return (
    valor !== null &&
    typeof valor === "object" &&
    !Array.isArray(valor)
  );
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Los datos enviados no son válidos." },
      { status: 400 },
    );
  }

  if (!esObjeto(body)) {
    return NextResponse.json(
      { error: "Los datos enviados no son válidos." },
      { status: 400 },
    );
  }

  const { expectedUpdatedAt } = body;

  if (
    typeof expectedUpdatedAt !== "string" ||
    !expectedUpdatedAt.trim() ||
    !Number.isFinite(Date.parse(expectedUpdatedAt))
  ) {
    return NextResponse.json(
      { error: "Falta la versión del borrador. Recarga el editor." },
      { status: 400 },
    );
  }

  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: errorUsuario,
    } = await supabase.auth.getUser();

    if (errorUsuario || !user) {
      return NextResponse.json(
        { error: "Tu sesión terminó. Inicia sesión nuevamente." },
        { status: 401 },
      );
    }

    const { data: catalogo, error: errorCatalogo } = await supabase
      .from("catalogos")
      .select("id, plan_vence_el, subscription_status")
      .eq("user_id", user.id)
      .maybeSingle();

    if (errorCatalogo) throw errorCatalogo;

    if (!catalogo) {
      return NextResponse.json(
        { error: "No encontramos tu tienda." },
        { status: 404 },
      );
    }

    const { data: accesoGratis, error: errorAccesoGratis } =
      await supabase
        .from("accesos_gratis")
        .select("vence_el")
        .eq("catalogo_id", catalogo.id)
        .maybeSingle();

    if (errorAccesoGratis) throw errorAccesoGratis;

    const ahora = Date.now();

    const promocionValida =
      accesoGratis?.vence_el != null &&
      new Date(accesoGratis.vence_el).getTime() > ahora;

    const trialValido =
      catalogo.plan_vence_el != null &&
      new Date(catalogo.plan_vence_el).getTime() > ahora;

    const stripeActivo =
      catalogo.subscription_status === "active" ||
      catalogo.subscription_status === "trialing";

    const stripeEnProblema =
      catalogo.subscription_status === "past_due" ||
      catalogo.subscription_status === "canceled";

    if (
      !promocionValida &&
      (stripeEnProblema || (!stripeActivo && !trialValido))
    ) {
      return NextResponse.json(
        { error: "Necesitas un plan vigente para publicar el diseño." },
        { status: 403 },
      );
    }

    // Valida la versión exacta del borrador que abrió el editor.
    const { data: borrador, error: errorBorrador } = await supabase
      .from("tienda_diseno_borrador")
      .select("plantilla, config, version_config, updated_at")
      .eq("catalogo_id", catalogo.id)
      .eq("updated_at", expectedUpdatedAt)
      .maybeSingle();

    if (errorBorrador) throw errorBorrador;

    if (!borrador) {
      return NextResponse.json(
        {
          error:
            "El borrador cambió o ya no está disponible. Recarga el editor antes de publicar.",
        },
        { status: 409 },
      );
    }

    if (
      !esPlantillaId(borrador.plantilla) ||
      borrador.version_config !== VERSION_CONFIG
    ) {
      return NextResponse.json(
        { error: "El diseño no es compatible con esta versión." },
        { status: 400 },
      );
    }

    const validacion = validarConfig(borrador.config);

    if (!validacion.valido) {
      return NextResponse.json(
        {
          error:
            "El borrador contiene colores o un formato inválido. Corrígelo y guarda nuevamente.",
          detalles: validacion.errores,
        },
        { status: 400 },
      );
    }

    // La función vuelve a comprobar la versión bajo bloqueo.
    // Si otra pestaña guardó cambios, la publicación se detiene.
    const { data: publicado, error: errorPublicacion } =
      await supabase.rpc("publicar_diseno_tienda_version", {
        p_catalogo_id: catalogo.id,
        p_expected_updated_at: expectedUpdatedAt,
      });

    if (errorPublicacion) {
      if (errorPublicacion.code === "P0001") {
        return NextResponse.json(
          {
            error:
              "No se pudo publicar esta versión del borrador. Recarga el editor y revisa el diseño.",
          },
          { status: 409 },
        );
      }

      if (errorPublicacion.code === "42501") {
        return NextResponse.json(
          { error: "No tienes permiso para publicar este diseño." },
          { status: 403 },
        );
      }

      throw errorPublicacion;
    }

    return NextResponse.json(
      {
        mensaje: "Diseño publicado.",
        publicado,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error("Error publicando el diseño:", error);

    return NextResponse.json(
      { error: "No pudimos publicar el diseño. Inténtalo nuevamente." },
      { status: 500 },
    );
  }
}