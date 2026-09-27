import "server-only";

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function PATCH(request: Request) {
  try {
    const origin = request.headers.get("origin");
    if (!origin || origin !== new URL(request.url).origin) {
      return NextResponse.json({ error: "Origen no permitido." }, { status: 403 });
    }

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Inicia sesión." }, { status: 401 });
    }

    const body: unknown = await request.json().catch(() => null);
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
    }
    const pedidoId = (body as Record<string, unknown>).pedidoId;
    if (typeof pedidoId !== "string" || !UUID_REGEX.test(pedidoId)) {
      return NextResponse.json({ error: "Pedido inválido." }, { status: 400 });
    }

    const { data: catalogo, error: tiendaError } = await supabase
      .from("catalogos")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (tiendaError) throw tiendaError;
    if (!catalogo) return NextResponse.json({ error: "Tienda no encontrada." }, { status: 404 });

    const admin = createAdminClient();
    const { data, error } = await admin
      .from("pedidos")
      .update({ visto_por_vendedor_at: new Date().toISOString() })
      .eq("id", pedidoId)
      .eq("catalogo_id", catalogo.id)
      .is("visto_por_vendedor_at", null)
      .select("id")
      .maybeSingle();
    if (error) throw error;

    // Un pedido ya visto también se considera una respuesta idempotente.
    if (!data) {
      const { data: existente, error: consultaError } = await admin
        .from("pedidos")
        .select("id")
        .eq("id", pedidoId)
        .eq("catalogo_id", catalogo.id)
        .maybeSingle();
      if (consultaError) throw consultaError;
      if (!existente) return NextResponse.json({ error: "Pedido no encontrado." }, { status: 404 });
    }

    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("No se pudo marcar el pedido como visto:", error);
    return NextResponse.json({ error: "No pudimos guardar la lectura del pedido." }, { status: 500 });
  }
}
