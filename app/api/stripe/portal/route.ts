import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

// Inicializamos Stripe con tu variable de Vercel
const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || "sk_test_mockKeyForBuild",
  {
    // @ts-ignore
    apiVersion: "2026-04-22.dahlia",
  }
);

export async function POST(req: Request) {
  try {
    // 1. Extraer el token enviado por el botón del frontend
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "No autorizado. Falta el token." }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");

    // 2. IMPORTANTE: Usamos NEXT_PUBLIC_SUPABASE_URL para que coincida exactamente con tu frontend
    const urlSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const claveAnonSupabase = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!urlSupabase || !claveAnonSupabase) {
      console.error("❌ Faltan variables de entorno de Supabase en el servidor.");
      return NextResponse.json({ error: "Error de configuración en el servidor." }, { status: 500 });
    }

    // 3. Crear el cliente de usuario con la misma URL del frontend
    const supabaseUserClient = createClient(urlSupabase, claveAnonSupabase);

    // 4. Validar el token del usuario
    const { data: { user }, error: authError } = await supabaseUserClient.auth.getUser(token);

    if (authError || !user) {
      console.error("❌ Supabase Auth Error en producción:", authError?.message);
      return NextResponse.json({ error: "Sesión inválida o vencida. Inicia sesión de nuevo." }, { status: 401 });
    }

    // 5. Crear el cliente Admin para buscar el cliente de Stripe de forma segura
    const supabaseAdmin = createClient(urlSupabase, process.env.SUPABASE_SERVICE_ROLE_KEY!);

    // 6. Buscar el stripe_customer_id en la base de datos
    const { data: catalogo } = await supabaseAdmin
      .from("catalogos")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single();

    if (!catalogo || !catalogo.stripe_customer_id) {
      return NextResponse.json(
        { error: "No se encontró tu ID de cliente de Stripe. ¿Ya realizaste un pago?" },
        { status: 404 }
      );
    }

    // 7. Crear la sesión del portal en Stripe
    const returnUrl = `${new URL(req.url).origin}/dashboard/ajustes`;

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: catalogo.stripe_customer_id,
      return_url: returnUrl,
    });

    // Devolvemos la URL mágica de Stripe
    return NextResponse.json({ url: portalSession.url });

  } catch (error: any) {
    console.error("❌ Error fatal en Portal API:", error.message);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}