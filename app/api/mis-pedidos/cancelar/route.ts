import "server-only";

import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const NO_CACHE = { "Cache-Control": "private, no-store" };

export async function POST(request: NextRequest) {
  try {
    if (request.headers.get("origin") !== request.nextUrl.origin) {
      return NextResponse.json({ error: "Origen no permitido." }, { status: 403, headers: NO_CACHE });
    }

    const sesion = request.cookies.get("catalagox_comprador")?.value;
    if (!sesion || !/^[A-Za-z0-9_-]{43}$/.test(sesion)) {
      return NextResponse.json({ error: "No encontramos tus pedidos en este navegador." }, { status: 403, headers: NO_CACHE });
    }

    const body: unknown = await request.json().catch(() => null);
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Solicitud inválida." }, { status: 400, headers: NO_CACHE });
    }
    const { pedidoId, catalogoId } = body as Record<string, unknown>;
    if (typeof pedidoId !== "string" || !UUID_REGEX.test(pedidoId)
      || typeof catalogoId !== "string" || !UUID_REGEX.test(catalogoId)) {
      return NextResponse.json({ error: "Pedido o tienda inválidos." }, { status: 400, headers: NO_CACHE });
    }

    const hash = createHash("sha256").update(sesion).digest("hex");
    const admin = createAdminClient();
    const { data, error } = await admin.rpc("cancelar_pedido_comprador", {
      p_pedido_id: pedidoId,
      p_catalogo_id: catalogoId,
      p_sesion_hash: hash,
    });
    if (error) {
      if (error.message === "Pedido no encontrado") {
        return NextResponse.json({ error: "Pedido no encontrado." }, { status: 404, headers: NO_CACHE });
      }
      if (error.message === "Este pedido ya no se puede cancelar desde la tienda") {
        return NextResponse.json({ error: error.message }, { status: 409, headers: NO_CACHE });
      }
      console.error("Error cancelando pedido del comprador:", error);
      return NextResponse.json({ error: "No pudimos cancelar el pedido." }, { status: 500, headers: NO_CACHE });
    }
    return NextResponse.json({ estado: data }, { headers: NO_CACHE });
  } catch (error) {
    console.error("Error inesperado cancelando pedido del comprador:", error);
    return NextResponse.json({ error: "No pudimos cancelar el pedido." }, { status: 500, headers: NO_CACHE });
  }
}
