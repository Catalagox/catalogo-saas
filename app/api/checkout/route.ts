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
    // 👈 Ahora también recibimos el tipo de plan ("monthly" o "annual")
    const { userId, email, planType } = await req.json();

    if (!userId || !email) {
      return NextResponse.json(
        { error: "Identificación de usuario no válida o sesión expirada" },
        { status: 400 }
      );
    }

    // 🎯 Decidir qué Price ID usar dinámicamente
    let priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!; 

    if (planType === "annual") {
      priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY!; 
    }

    let customerId: string;

    // Buscar customer existente
    const existingCustomers = await stripe.customers.list({
      email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      const customer = existingCustomers.data[0];
      customerId = customer.id;

      // 🔥 Asegurar metadata correcta
      await stripe.customers.update(customerId, {
        metadata: {
          supabaseUserId: userId,
        },
      });
    } else {
      // Crear customer nuevo
      const customer = await stripe.customers.create({
        email,
        metadata: {
          supabaseUserId: userId,
        },
      });

      customerId = customer.id;
    }

    // Crear Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId, // 👈 Ahora usa la variable dinámica según la selección del usuario
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/suscripcion?canceled=true`,
      metadata: {
        supabaseUserId: userId,
        planType: planType || "monthly" // 💡 Agregamos el tipo de plan al metadato por si lo necesitas en tus Webhooks
      },
      subscription_data: {
        metadata: {
          supabaseUserId: userId,
          planType: planType || "monthly" // 💡 También en la suscripción
        },
      },
    });

    return NextResponse.json({
      url: session.url,
    });
  } catch (error: any) {
    console.error("Error crítico en la API de Checkout:", error);

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Fallo en el servidor al iniciar la pasarela de pago",
      },
      { status: 500 }
    );
  }
}