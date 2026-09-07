import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    // 🚨 1. Validar que la API Key de Stripe exista en las variables del servidor
    if (!stripeSecretKey) {
      console.error("❌ ERROR: La variable STRIPE_SECRET_KEY no está configurada.");
      return NextResponse.json(
        { error: "Error de configuración en el servidor: Clave secreta de Stripe no encontrada." },
        { status: 500 }
      );
    }

    // Instancia limpia dentro de la ejecución de la petición
    const stripe = new Stripe(stripeSecretKey);

    // 📩 2. Obtener datos enviados desde el frontend
    const { userId, email, planType } = await req.json();

    if (!userId || !email) {
      return NextResponse.json(
        { error: "Identificación de usuario no válida o sesión expirada." },
        { status: 400 }
      );
    }

    // 🔍 3. Logs de diagnóstico para consola de Vercel/Terminal local
    console.log("🔍 DIAGNÓSTICO API CHECKOUT:");
    console.log("-> planType recibido:", planType);
    console.log("-> STRIPE_PRICE_ID_MONTHLY:", !!process.env.STRIPE_PRICE_ID_MONTHLY);
    console.log("-> STRIPE_PRICE_ID_ANNUAL:", !!process.env.STRIPE_PRICE_ID_ANNUAL);

    // 🎯 4. Selección dinámica de Price ID con fallbacks de compatibilidad
    let priceId: string | undefined;

    if (planType === "annual") {
      priceId =
        process.env.STRIPE_PRICE_ID_ANNUAL ||
        process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_ANNUAL;
    } else {
      priceId =
        process.env.STRIPE_PRICE_ID_MONTHLY ||
        process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY ||
        process.env.NEXT_PUBLIC_STRIPE_PRICE_ID; // Fallback a variable antigua si existe
    }

    // 🚨 5. Detener la ejecución si no hay Price ID cargado
    if (!priceId) {
      console.error(`❌ Error: Price ID no encontrado para el plan seleccionado: ${planType}`);
      return NextResponse.json(
        { error: `Price ID no configurado para el plan: ${planType || "monthly"}` },
        { status: 500 }
      );
    }

    // 🌐 6. Definir URL base con respaldo para evitar URLs relativas inválidas en Stripe
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://catalagox.com";

    // 👤 7. Buscar o crear cliente en Stripe
    let customerId: string;
    const existingCustomers = await stripe.customers.list({
      email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      const customer = existingCustomers.data[0];
      customerId = customer.id;

      // Actualizar metadata del usuario existente
      await stripe.customers.update(customerId, {
        metadata: {
          supabaseUserId: userId,
        },
      });
    } else {
      // Crear cliente nuevo
      const customer = await stripe.customers.create({
        email,
        metadata: {
          supabaseUserId: userId,
        },
      });
      customerId = customer.id;
    }

    // 💳 8. Crear Checkout Session de Stripe
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/dashboard?success=true`,
      cancel_url: `${baseUrl}/suscripcion?canceled=true`,
      metadata: {
        supabaseUserId: userId,
        planType: planType || "monthly",
      },
      subscription_data: {
        metadata: {
          supabaseUserId: userId,
          planType: planType || "monthly",
        },
      },
    });

    // ✅ 9. Respuesta exitosa con la URL de Checkout
    return NextResponse.json({
      url: session.url,
    });
  } catch (error: any) {
    console.error("❌ Error crítico en la API de Checkout:", error?.message || error);

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Fallo interno en el servidor al iniciar la pasarela de pago",
      },
      { status: 500 }
    );
  }
}