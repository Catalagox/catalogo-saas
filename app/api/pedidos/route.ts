import "server-only";

import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type ItemRecibido = {
  id: string;
  cantidad: number;
};

function esUuid(value: unknown): value is string {
  return typeof value === "string" && UUID_REGEX.test(value);
}

function texto(value: unknown, maximo: number): string | null {
  if (typeof value !== "string") return null;

  const limpio = value.trim();
  return limpio.length <= maximo ? limpio : null;
}

export async function POST(request: Request) {
  try {
    // El formulario se enviará desde la misma tienda, también
    // cuando utilice un dominio personalizado.
    const origin = request.headers.get("origin");

    if (!origin || origin !== new URL(request.url).origin) {
      return NextResponse.json(
        { error: "Origen de solicitud no permitido." },
        { status: 403 },
      );
    }

    const longitud = Number(request.headers.get("content-length"));

    if (Number.isFinite(longitud) && longitud > 16_000) {
      return NextResponse.json(
        { error: "El pedido es demasiado grande." },
        { status: 413 },
      );
    }

    const body: unknown = await request.json().catch(() => null);

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { error: "Datos del pedido inválidos." },
        { status: 400 },
      );
    }

    const datos = body as Record<string, unknown>;

    const catalogoId = datos.catalogoId;
    const claveIdempotencia = datos.claveIdempotencia;
    const nombre = texto(datos.nombre, 120);
    const telefono = texto(datos.telefono, 40);
    const email = texto(datos.email ?? "", 254);
    const direccion = texto(datos.direccion ?? "", 500);
    const notas = texto(datos.notas ?? "", 1000);
    const items = datos.items;

    if (
      !esUuid(catalogoId) ||
      !esUuid(claveIdempotencia) ||
      !nombre ||
      nombre.length < 2 ||
      !telefono ||
      telefono.length < 5 ||
      email === null ||
      direccion === null ||
      notas === null ||
      !Array.isArray(items) ||
      items.length < 1 ||
      items.length > 50
    ) {
      return NextResponse.json(
        { error: "Revisa los datos del comprador y del carrito." },
        { status: 400 },
      );
    }

    const productos: ItemRecibido[] = [];

    for (const item of items) {
      if (
        !item ||
        typeof item !== "object" ||
        !esUuid(item.id) ||
        !Number.isInteger(item.cantidad) ||
        item.cantidad < 1 ||
        item.cantidad > 999
      ) {
        return NextResponse.json(
          { error: "Hay un producto o cantidad inválidos." },
          { status: 400 },
        );
      }

      productos.push({
        id: item.id,
        cantidad: item.cantidad,
      });
    }

    if (new Set(productos.map((item) => item.id)).size !== productos.length) {
      return NextResponse.json(
        { error: "El carrito contiene productos repetidos." },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase.rpc(
      "crear_pedido_whatsapp",
      {
        p_catalogo_id: catalogoId,
        p_clave_idempotencia: claveIdempotencia,
        p_nombre: nombre,
        p_telefono: telefono,
        p_email: email || null,
        p_direccion: direccion || null,
        p_notas: notas || null,
        p_items: productos,
      },
    );

    if (error) {
      console.error("Error al crear pedido:", error);

      const mensajesPermitidos = [
        "No hay suficiente stock",
        "Un producto ya no está disponible",
        "La tienda no existe",
        "Cantidad inválida o producto repetido",
      ];

      const mensaje = mensajesPermitidos.find((permitido) =>
        error.message.startsWith(permitido),
      );

      return NextResponse.json(
        {
          error:
            mensaje && mensaje === "No hay suficiente stock"
              ? error.message
              : mensaje || "No pudimos registrar el pedido.",
        },
        { status: mensaje ? 409 : 500 },
      );
    }

    return NextResponse.json(
      {
        pedidoId: data.pedidoId,
        total: data.total,
        moneda: data.moneda,
        yaExistia: data.yaExistia,
      },
      { status: data.yaExistia ? 200 : 201 },
    );
  } catch (error) {
    console.error("Error inesperado al crear pedido:", error);

    return NextResponse.json(
      { error: "No pudimos registrar el pedido. Inténtalo de nuevo." },
      { status: 500 },
    );
  }
}