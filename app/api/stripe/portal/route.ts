import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Inicia sesión para gestionar tu suscripción." },
        { status: 401 },
      );
    }

    const { data: catalogo, error: catalogoError } = await supabase
      .from("catalogos")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (catalogoError) {
      throw catalogoError;
    }

    if (!catalogo?.stripe_customer_id) {
      return NextResponse.json(
        { error: "Esta cuenta todavía no tiene una suscripción en Stripe." },
        { status: 404 },
      );
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error("Falta STRIPE_SECRET_KEY");
    }

    const stripe = new Stripe(secretKey);
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://www.catalagox.com";

    const session = await stripe.billingPortal.sessions.create({
      customer: catalogo.stripe_customer_id,
      return_url: `${baseUrl}/suscripcion`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error al abrir el portal de Stripe:", error);

    return NextResponse.json(
      { error: "No pudimos abrir el portal. Inténtalo nuevamente." },
      { status: 500 },
    );
  }
}