import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || "sk_test_mockKeyForBuild",
  {
    // @ts-ignore
    apiVersion: "2026-04-22.dahlia",
  }
);

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    // 1. Obtener de forma nativa las cookies del navegador
    const cookieStore = await cookies();
    
    // 2. Buscar la cookie de sesión que guarda Supabase automáticamente
    // Nota: El formato estándar de la cookie de Supabase suele ser "sb-<proyecto>-auth-token"
    // Para no errar con el nombre del proyecto, buscamos cualquier cookie que contenga "-auth-token"
    const allCookies = cookieStore.getAll();
    const authCookie = allCookies.find(c => c.name.endsWith("-auth-token"));

    if (!authCookie) {
      console.error("❌ No se encontró la cookie de sesión de Supabase.");
      return NextResponse.json({ error: "Sesión no encontrada. Por favor, inicia sesión nuevamente." }, { status: 401 });
    }

    // 3. Extraer el token de acceso (access_token) del valor de la cookie
    let accessToken: string;
    try {
      const parsedCookie = JSON.parse(authCookie.value);
      accessToken = parsedCookie.access_token;
    } catch {
      // En algunas configuraciones el valor viene como un array o texto directo
      accessToken = authCookie.value;
    }

    if (!accessToken) {
      return NextResponse.json({ error: "Token de acceso inválido." }, { status: 401 });
    }

    // 4. Validar el token con nuestro cliente de confianza de Supabase
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(accessToken);

    if (authError || !user) {
      console.error("❌ Supabase rechazó el token:", authError?.message);
      return NextResponse.json({ error: "Usuario inválido o sesión expirada." }, { status: 401 });
    }

    // 5. Buscar el stripe_customer_id en la base de datos
    const { data: catalogo } = await supabaseAdmin
      .from("catalogos")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single();

    if (!catalogo || !catalogo.stripe_customer_id) {
      return NextResponse.json(
        { error: "No se encontró tu ID de cliente de Stripe. ¿Ya hiciste tu primer pago?" },
        { status: 404 }
      );
    }

    // 6. Crear la sesión del portal en Stripe
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