import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const ESTADOS_PERMITIDOS = new Set([
  "confirmado",
  "en_preparacion",
  "enviado",
  "entregado",
  "cancelado",
]);

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const origin = request.headers.get("origin");

    if (!origin || origin !== request.nextUrl.origin) {
      return NextResponse.json(
        { error: "Origen no permitido." },
        { status: 403 },
      );
    }

    const { id } = await context.params;

    if (!UUID_REGEX.test(id)) {
      return NextResponse.json(
        { error: "Pedido inválido." },
        { status: 400 },
      );
    }

    const body: unknown = await request.json().catch(() => null);

    const nuevoEstado =
      body && typeof body === "object" && !Array.isArray(body)
        ? (body as Record<string, unknown>).estado
        : null;

    if (
      typeof nuevoEstado !== "string" ||
      !ESTADOS_PERMITIDOS.has(nuevoEstado)
    ) {
      return NextResponse.json(
        { error: "Selecciona un estado válido." },
        { status: 400 },
      );
    }

    // La identidad siempre sale de la sesión, no del JSON enviado.
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Inicia sesión para gestionar pedidos." },
        { status: 401 },
      );
    }

    const admin = createAdminClient();

    const { data, error } = await admin.rpc(
      "cambiar_estado_pedido",
      {
        p_pedido_id: id,
        p_vendedor_id: user.id,
        p_nuevo_estado: nuevoEstado,
      },
    );

    if (error) {
      console.error("Error cambiando estado del pedido:", error);

      if (error.message === "No tienes acceso a este pedido") {
        return NextResponse.json(
          { error: "No tienes acceso a este pedido." },
          { status: 403 },
        );
      }

      if (error.message === "Pedido no encontrado") {
        return NextResponse.json(
          { error: "Pedido no encontrado." },
          { status: 404 },
        );
      }

      const erroresEsperados = [
        "Este pedido ya no puede cambiar de estado",
        "No se puede cancelar un pedido enviado",
        "Revisa el pago antes de cancelar",
        "Cambio de estado no permitido",
      ];

      if (erroresEsperados.includes(error.message)) {
        return NextResponse.json(
          { error: error.message },
          { status: 409 },
        );
      }

      return NextResponse.json(
        { error: "No pudimos actualizar el pedido." },
        { status: 500 },
      );
    }

    return NextResponse.json({ estado: data });
  } catch (error) {
    console.error("Error inesperado actualizando pedido:", error);

    return NextResponse.json(
      { error: "No pudimos actualizar el pedido." },
      { status: 500 },
    );
  }
}