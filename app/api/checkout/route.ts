import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || "sk_test_mockKeyForBuild",
  {
    apiVersion: "2026-04-22.dahlia" as any,
  }
);

export async function POST(req: Request) {
  try {
    const { userId, email } = await req.json();

    if (!userId || !email) {
      return NextResponse.json(
        { error: "Identificación de usuario no válida o sesión expirada" },
        { status: 400 }
      );
    }

    // 🔥 CREAR O REUTILIZAR CUSTOMER
    let customerId: string | undefined;

    const existingCustomers = await stripe.customers.list({
      email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      customerId = existingCustomers.data[0].id;
    } else {
      const newCustomer = await stripe.customers.create({
        email,
        metadata: {
          supabaseUserId: userId,
        },
      });

      customerId = newCustomer.id;
    }

    // 🟢 CREAR CHECKOUT SESSION
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",

      customer: customerId, // 🔥 Clave para evitar duplicados en Stripe

      payment_method_types: ["card"],

      line_items: [
        {
          price: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],

      // Redirecciones automáticas post-pago
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/suscripcion?canceled=true`,

      metadata: {
        supabaseUserId: userId,
      },

      subscription_data: {
        metadata: {
          supabaseUserId: userId,
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Error crítico en la API de Checkout:", error);
    return NextResponse.json(
      { error: error?.message || "Fallo en el servidor al iniciar la pasarela de pago" },
      { status: 500 }
    );
  }
}