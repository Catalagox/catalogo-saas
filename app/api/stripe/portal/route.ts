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

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "No autorizado. Falta el token." }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const urlSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const claveAnonSupabase = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const supabaseUserClient = createClient(urlSupabase!, claveAnonSupabase!);
    const { data: { user }, error: authError } = await supabaseUserClient.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: "Sesión inválida." }, { status: 401 });
    }

    // 🕵️ LOG 1: Saber qué ID de usuario está intentando usar el botón
    console.log("🔍 DIAGNÓSTICO: Buscando catálogo para el user_id:", user.id);

    const supabaseAdmin = createClient(urlSupabase!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

    // Hacemos la consulta completa sin el .single() primero para ver si encuentra algo
    const { data: catalogos, error: dbError } = await supabaseAdmin
      .from("catalogos")
      .select("*")
      .eq("user_id", user.id);

    // 🕵️ LOG 2: Ver qué devolvió exactamente la base de datos
    console.log("🔍 DIAGNÓSTICO DB: Resultado de la consulta:", catalogos);
    if (dbError) console.error("❌ DIAGNÓSTICO DB ERROR:", dbError.message);

    if (!catalogos || catalogos.length === 0) {
      return NextResponse.json(
        { error: `No se encontró ningún catálogo vinculado a tu ID de usuario (${user.id}).` },
        { status: 404 }
      );
    }

    const catalogo = catalogos[0];

    if (!catalogo.stripe_customer_id) {
      return NextResponse.json(
        { error: "Se encontró tu catálogo, pero el campo 'stripe_customer_id' está vacío en Supabase." },
        { status: 404 }
      );
    }

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