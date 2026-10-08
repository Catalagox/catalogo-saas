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

export async function PATCH(request: Request) {
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

  const {
    plantilla,
    config,
    version_config,
    expectedUpdatedAt,
  } = body;

  if (!esPlantillaId(plantilla)) {
    return NextResponse.json(
      { error: "La plantilla seleccionada no está disponible." },
      { status: 400 },
    );
  }

  if (version_config !== VERSION_CONFIG) {
    return NextResponse.json(
      { error: "La versión del diseño no es compatible." },
      { status: 400 },
    );
  }

  const validacion = validarConfig(config);

  if (!validacion.valido) {
    return NextResponse.json(
      {
        error: "Revisa los colores y el formato del diseño.",
        detalles: validacion.errores,
      },
      { status: 400 },
    );
  }

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

    // El catálogo se obtiene desde la sesión, no desde el navegador.
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
        { error: "Necesitas un plan vigente para guardar el diseño." },
        { status: 403 },
      );
    }

    // Solo guarda si el borrador sigue siendo el que abrió el editor.
    // Evita sobrescribir cambios guardados desde otra pestaña.
    const { data: borrador, error: errorBorrador } = await supabase
      .from("tienda_diseno_borrador")
      .update({
        plantilla,
        config: validacion.config,
        version_config: VERSION_CONFIG,
      })
      .eq("catalogo_id", catalogo.id)
      .eq("updated_at", expectedUpdatedAt)
      .select(
        "catalogo_id, plantilla, config, version_config, updated_at",
      )
      .maybeSingle();

    if (errorBorrador) throw errorBorrador;

    if (!borrador) {
      return NextResponse.json(
        {
          error:
            "El borrador cambió o ya no está disponible. Recarga el editor antes de guardar.",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        mensaje: "Borrador guardado.",
        borrador,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error("Error guardando el borrador del diseño:", error);

    return NextResponse.json(
      { error: "No pudimos guardar el borrador. Inténtalo nuevamente." },
      { status: 500 },
    );
  }
}