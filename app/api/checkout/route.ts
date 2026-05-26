import { NextResponse } from "next/server";
import Stripe from "stripe";

// Inicializamos Stripe utilizando la clave secreta guardada en Vercel/.env.local
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27" as any, // Mantiene la compatibilidad con las versiones estables de Stripe
});

export async function POST(req: Request) {
  try {
    const { userId, email } = await req.json();

    // Validación de seguridad para asegurarnos de que el usuario está logueado
    if (!userId || !email) {
      return NextResponse.json(
        { error: "Identificación de usuario no válida o sesión expirada" },
        { status: 400 }
      );
    }

    // Creamos la sesión segura de Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID, // El ID de 5 USD que configuramos en tus variables
          quantity: 1,
        },
      ],
      mode: "subscription",
      // URLs a las que Stripe enviará de vuelta al dueño del restaurante
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/marketing/suscripcion?canceled=true`,
      // Metadatos cruciales: guardamos el ID de Supabase para saber a quién activar en la BD cuando pague
      metadata: {
        supabaseUserId: userId,
      },
    });

    // Le respondemos al frontend con la URL de pasarela de pagos generada
    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Error crítico en la API de Checkout:", error);
    return NextResponse.json(
      { error: error?.message || "Fallo en el servidor al iniciar la pasarela de pago" },
      { status: 500 }
    );
  }
}