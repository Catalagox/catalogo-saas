import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // @ts-ignore
  apiVersion: "2026-04-22.dahlia",
});

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    // 1. Validar que el usuario esté logueado mediante el Token de Supabase
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: "Usuario inválido" }, { status: 401 });
    }

    // 2. Buscar el stripe_customer_id de este usuario en Supabase
    const { data: catalogo } = await supabaseAdmin
      .from("catalogos")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single();

    if (!catalogo || !catalogo.stripe_customer_id) {
      return NextResponse.json(
        { error: "Aún no tienes un ID de cliente de Stripe. ¿Ya realizaste tu primer pago?" },
        { status: 404 }
      );
    }

    // 3. Crear la sesión del portal en Stripe para que vuelva a "Ajustes" al salir
    const returnUrl = `${new URL(req.url).origin}/dashboard/ajustes`;

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: catalogo.stripe_customer_id,
      return_url: returnUrl,
    });

    // 4. Devolver la URL generada por Stripe
    return NextResponse.json({ url: portalSession.url });

  } catch (error: any) {
    console.error("❌ Error en Portal API:", error.message);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}