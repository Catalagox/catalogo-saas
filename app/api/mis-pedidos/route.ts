import "server-only";

import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(request: NextRequest) {
  const catalogoId = request.nextUrl.searchParams.get("catalogoId");
  if (!catalogoId || !UUID_REGEX.test(catalogoId)) {
    return NextResponse.json({ error: "Tienda inválida." }, { status: 400 });
  }

  const sesion = request.cookies.get("catalagox_comprador")?.value;
  if (!sesion || !/^[A-Za-z0-9_-]{43}$/.test(sesion)) {
    return NextResponse.json(
      { pedidos: [] },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  }

  try {
    const hash = createHash("sha256").update(sesion).digest("hex");
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("pedidos")
      .select(`
        id,
        numero,
        estado_pedido,
        estado_pago,
        moneda,
        total,
        created_at,
        pedido_items (
          id,
          nombre_producto,
          cantidad,
          subtotal
        )
      `)
      .eq("catalogo_id", catalogoId)
      .eq("comprador_sesion_hash", hash)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;

    return NextResponse.json(
      { pedidos: data ?? [] },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    console.error("Error consultando pedidos del comprador:", error);
    return NextResponse.json(
      { error: "No pudimos cargar tus pedidos." },
      { status: 500, headers: { "Cache-Control": "private, no-store" } },
    );
  }
}
