import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || "sk_test_mockKeyForBuild",
  {
    // @ts-ignore
    apiVersion: "2026-04-22.dahlia",
  }
);

// Usamos las variables de entorno que están corriendo en producción
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    // 1. Validar la autorización del header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    
    // 2. Le pedimos a Supabase que valide el token de forma directa
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    // Si da error, imprimimos en los logs de Vercel para saber exactamente qué falló
    if (authError || !user) {
      console.error("❌ Error de Supabase Auth:", authError?.message);
      return NextResponse.json({ error: "Usuario inválido o sesión expirada." }, { status: 401 });
    }

    // 3. Buscar el stripe_customer_id
    const { data: catalogo } = await supabaseAdmin
      .from("catalogos")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single();

    if (!catalogo || !catalogo.stripe_customer_id) {
      return NextResponse.json(
        { error: "No se encontró tu ID de cliente de Stripe en la base de datos." },
        { status: 404 }
      );
    }

    // 4. Crear sesión del portal
    const returnUrl = `${new URL(req.url).origin}/dashboard/ajustes`;

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: catalogo.stripe_customer_id,
      return_url: returnUrl,
    });

    return NextResponse.json({ url: portalSession.url });

  } catch (error: any) {
    console.error("❌ Error fatal en Portal API:", error.message);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}